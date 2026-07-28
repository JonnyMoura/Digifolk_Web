<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import * as d3 from 'd3'
import {
  removeTooltip,
  createTooltip,
  updateTooltipPosition,
  expandTooltip,
  collapseTooltip,
} from './Tooltip'
import { createCustomLayout, createEllipseLayout } from './utils/GroupLayouts'
import { hasRole, getNames, joinNames } from './utils/ContributerRoles'
import { createGradients } from './utils/Gradients'

const props = defineProps({
  data: { type: Array, required: true },
  dataAggregated: { type: Array, required: true },
  freeLayout: { type: Boolean, default: true },
  marginTop: { type: Number, default: 64 },
})

const containerRef = ref(null)
const svgRef = ref(null)
const width = ref(0)
const height = ref(0)

let simulation = null
let nodes = []
let nodeMap = new Map()
let circles = null
let tooltipTimer = null
let tooltipExpanded = false
let resizeObserver = null

const pieceMap = computed(() => new Map(props.data.map((d) => [d.music_id, d])))

const expandedAttributes = [
  'genre',
  'subject',
  'tempo',
  'mode',
  'meter',
  'instruments',
  'real_key',
  'language',
  'spatial.country',
  'temporal.year',
  'coverage',
]

const attributeLabels = {
  genre: 'Genre',
  subject: 'Subject',
  tempo: 'Tempo',
  mode: 'Mode',
  meter: 'Meter',
  instruments: 'Instruments',
  real_key: 'Key',
  language: 'Language',
  'spatial.country': 'Country',
  'temporal.year': 'Year',
  coverage: 'Coverage',
}

function draw() {
  const W = width.value
  const H = height.value

  if (!W || !H || !props.data?.length || !props.dataAggregated) return

  const margin = { top: props.marginTop, right: 20, bottom: 36, left: 20 }

  const svg = d3.select(svgRef.value)

  createGradients(svg, props.dataAggregated)

  const centerX = W / 2
  const centerY = (H - margin.top - margin.bottom) / 2 + margin.top

  const groupPositions = props.freeLayout
    ? new Map()
    : props.dataAggregated[0]?.attribute === 'temporal.year' ||
        props.dataAggregated[0]?.attribute === 'real_key'
      ? createEllipseLayout({ data_aggregated: props.dataAggregated, centerX, centerY, width: W, height: H })
      : createCustomLayout({
          data_aggregated: props.dataAggregated,
          width: W,
          height: H - margin.top - margin.bottom,
          padding: 0,
          padding_top: margin.top,
        })

  if (nodes.length === 0) {
    nodes = props.data.map((piece) => ({
      id: piece.music_id,
      group: null,
      x: Math.random() * W,
      y: Math.random() * (H - margin.top - margin.bottom) + margin.top,
      targetX: null,
      targetY: null,
      r: Math.max(W * H * 0.000004, 4),
    }))
    nodeMap = new Map(nodes.map((n) => [n.id, n]))
  }

  const groupIndexMap = new Map(props.dataAggregated.map((g, i) => [g.value, i]))

  nodes.forEach((node) => (node.group = null))
  props.dataAggregated.forEach((group) => {
    group.pieces.forEach((piece) => {
      const node = nodeMap.get(piece.music_id)
      if (node) node.group = group.value
    })
  })

  nodes.forEach((node) => {
    if (!node.group && !props.freeLayout) {
      node.targetX = node.x
      node.targetY = node.y
      return
    }

    const centroid = groupPositions.get(node.group)

    node.targetX = props.freeLayout ? Math.random() * W : (centroid?.x ?? node.x)
    node.targetY = props.freeLayout
      ? Math.random() * (H - margin.top - margin.bottom) + margin.top
      : (centroid?.y ?? node.y)
  })

  if (!simulation) {
    const activeNodes = nodes.filter((d) => d.group !== null || props.freeLayout)

    simulation = d3
      .forceSimulation(activeNodes)
      .alpha(1)
      .alphaDecay(0.12)
      .velocityDecay(0.45)
      .force(
        'x',
        d3.forceX((d) => d.targetX).strength((d) => (props.freeLayout || d.group !== null ? 0.22 : 0)),
      )
      .force(
        'y',
        d3.forceY((d) => d.targetY).strength((d) => (props.freeLayout || d.group !== null ? 0.22 : 0)),
      )
      .force(
        'collision',
        d3
          .forceCollide((d) => (props.freeLayout || d.group !== null ? d.r + 1.5 : 0))
          .strength(1)
          .iterations(4),
      )
      .force(
        'charge',
        d3.forceManyBody().strength((d) => (props.freeLayout || d.group !== null ? -1 : 0)),
      )
  }

  if (!circles) {
    circles = svg
      .selectAll('.node')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('id', (d) => `node-${d.id}`)
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', (d) => d.r)
  }

  circles = circles
    .data(nodes)
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', (d) => d.r)
    .attr('fill', (d) => {
      if (!d.group) return 'url(#gradient-free)'

      const index = groupIndexMap.get(d.group)

      return `url(#gradient-${index})`
    })
    .classed('hasNoGroup', (d) => d.group === null && !props.freeLayout)

  circles
    .on('mouseover', function (event, d) {
      d3.select(this).classed('node-hover', true)

      const piece = pieceMap.value.get(d.id)
      if (!piece) return

      const state = piece.spatial?.state ? `${piece.spatial?.state}` : null
      const country = piece.spatial?.country || null
      const year = piece.temporal?.year || 'N/A'

      const subtitle1 = hasRole(piece, 35)
        ? `Composer(s): ${joinNames(getNames(piece, 35))}`
        : hasRole(piece, 31)
          ? `Collector(s): ${joinNames(getNames(piece, 31))}`
          : hasRole(piece, 32)
            ? `Performer(s): ${joinNames(getNames(piece, 32))}`
            : hasRole(piece, 33)
              ? `Singer(s): ${joinNames(getNames(piece, 33))}`
              : hasRole(piece, 34)
                ? `Speech: ${joinNames(getNames(piece, 34))}`
                : ''

      const location = country
        ? state && state.toLowerCase() !== 'unknown'
          ? `${country} (${state})`
          : country
        : null

      const subtitle2 = location
        ? `Country: ${location} | Year of collection: ${year}`
        : `Year of collection: ${year}`

      const [mouseX, mouseY] = d3.pointer(event, svg.node())

      createTooltip({
        svg,
        x: mouseX,
        y: mouseY,
        title: piece.title?.[0],
        subtitle: subtitle1,
        subsubtitle: subtitle2,
        piece,
        expandedAttributes,
        attributeLabels,
      })

      tooltipExpanded = false

      tooltipTimer = setTimeout(() => {
        expandTooltip(svg)
        tooltipExpanded = true
      }, 800)
    })
    .on('mousemove', function (event) {
      const [mouseX, mouseY] = d3.pointer(event, svg.node())

      updateTooltipPosition({ svg, x: mouseX, y: mouseY })
      clearTimeout(tooltipTimer)

      if (tooltipExpanded) {
        collapseTooltip(svg)
        tooltipExpanded = false
      }

      tooltipTimer = setTimeout(() => {
        expandTooltip(svg)
        tooltipExpanded = true
      }, 800)
    })
    .on('mouseout', function () {
      d3.select(this).classed('node-hover', false)

      clearTimeout(tooltipTimer)
      tooltipExpanded = false

      removeTooltip(svg)
    })

  let frameRequested = false

  simulation.alpha(1).restart()
  simulation
    .force(
      'x',
      d3.forceX((d) => d.targetX).strength((d) => (props.freeLayout || d.group !== null ? 0.22 : 0)),
    )
    .force(
      'y',
      d3.forceY((d) => d.targetY).strength((d) => (props.freeLayout || d.group !== null ? 0.22 : 0)),
    )
    .force(
      'collision',
      d3
        .forceCollide((d) => (props.freeLayout || d.group !== null ? d.r + 1.5 : 0))
        .strength(1)
        .iterations(4),
    )
    .force(
      'charge',
      d3.forceManyBody().strength((d) => (props.freeLayout || d.group !== null ? -1 : 0)),
    )

  simulation.on('tick', () => {
    if (frameRequested) return

    frameRequested = true

    requestAnimationFrame(() => {
      circles.attr('transform', (d) => `translate(${d.x},${d.y})`)

      frameRequested = false
    })

    if (simulation.alpha() < 0.001) {
      simulation.stop()
    }
  })

  svg.selectAll('.group-label').remove()
  if (!props.freeLayout) {
    svg
      .selectAll('.group-label')
      .data(props.dataAggregated)
      .join('text')
      .attr('class', 'group-label')
      .classed('group-label--key', (d) => d.attribute === 'real_key')
      .attr('x', (d) => groupPositions.get(d.value)?.x ?? centerX)
      .attr('y', (d) => groupPositions.get(d.value)?.y ?? centerY)
      .attr('text-anchor', 'middle')
      .text((d) => d.value)
  }
}

watch(
  () => [props.data, props.dataAggregated, props.freeLayout, width.value, height.value],
  draw,
)

onMounted(() => {
  resizeObserver = new ResizeObserver((entries) => {
    const entry = entries[0]
    if (!entry) return

    const { width: w, height: h } = entry.contentRect

    width.value = Math.round(w)
    height.value = Math.round(h)
  })

  resizeObserver.observe(containerRef.value)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  clearTimeout(tooltipTimer)
  simulation?.stop()
})
</script>

<template>
  <div ref="containerRef" class="dorling-map">
    <svg ref="svgRef" :width="width" :height="height"></svg>
  </div>
</template>

<style>
.dorling-map {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.dorling-map svg {
  display: block;
  overflow: visible;
}

.dorling-map .node {
  cursor: pointer;
  transition: filter 0.15s ease;
}

.dorling-map .node.node-hover {
  filter: brightness(1.12);
}

.dorling-map .node.hasNoGroup {
  display: none;
  pointer-events: none;
}

.dorling-map .group-label {
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: 14px;
  fill: rgba(0, 0, 0, 0.80);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  pointer-events: none;
}

.dorling-map .group-label.group-label--key {
  /* Musical key labels (e.g. "Ab", "Bb", "Eb") use a lowercase "b"
     for flat notes; forcing uppercase would turn them into "AB", "BB", "EB". */
  text-transform: none;
}

.dorling-map .tooltip-background {
  fill: rgba(250, 249, 246, 0.96);
  stroke: rgba(0, 0, 0, 0.12);
  stroke-width: 1;
}

.dorling-map .tooltip-title {
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: 16px;
  fill: #000;
}

.dorling-map .tooltip-subtitle {
  font-family: 'Roboto Mono', monospace;
  font-weight: 400;
  font-size: var(--fs-author);
  fill: #000;
}

.dorling-map .tooltip-subsubtitle {
  font-family: 'Roboto Mono', monospace;
  font-weight: 400;
  font-size: var(--fs-author);
  fill: rgba(0, 0, 0, 0.65);
}

.dorling-map .tooltip-attribute {
  font-family: 'Roboto Mono', monospace;
  font-size: var(--fs-author);
  fill: rgba(0, 0, 0, 0.65);
}

.dorling-map .tooltip-divider {
  stroke: rgba(31, 31, 31, 0.15);
  stroke-width: 1;
}

.dorling-map #tooltip {
  pointer-events: none;
}
</style>
