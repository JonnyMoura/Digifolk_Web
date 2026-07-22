<script setup>
import { computed } from 'vue'

// Decorative scalloped/curl border that tiles seamlessly across any width.
// Draws ONE full-width SVG and repeats the motif with an SVG <pattern>, so the
// browser tiles the vector at exact intervals (no per-element subpixel drift)
// and the line fills any container width — including each navbar option.
const props = defineProps({
  color: { type: String, default: 'var(--green)' },
  height: { type: Number, default: 24 },
  strokeWidth: { type: Number, default: 4 },
  // accepted for backwards compatibility with existing call sites; unused.
  count: { type: Number, default: 0 },
})

// One full period as a SINGLE continuous stroke (dome arch -> hook curl) so the
// arch flows straight into the curl with no lifted-pen notch. Ends at x = 2 +
// PITCH so the next repeat starts exactly where this one ends -> seamless.
const PERIOD =
  'M2 15' +
  'C2 7.8203 10.2827 2 20.5 2C30.7173 2 39 7.8203 39 15' + // dome (arch)
  'C39 18.866 37.2091 22 35 22C32.7909 22 31 18.866 31 15' // hook (curl)

const PITCH = 29
const TILE_HEIGHT = 24

const patternId = `scallop-${Math.random().toString(36).slice(2, 9)}`
const scale = computed(() => props.height / TILE_HEIGHT)
const tiles = [-PITCH, 0, PITCH]
</script>

<template>
  <svg class="squiggle" width="100%" :height="height" fill="none" :style="{ color }" role="presentation" aria-hidden="true">
    <defs>
      <pattern :id="patternId" patternUnits="userSpaceOnUse" :width="PITCH * scale" :height="height">
        <g :transform="`scale(${scale})`">
          <path
            v-for="dx in tiles"
            :key="dx"
            :d="PERIOD"
            :transform="`translate(${dx} 0)`"
            stroke="currentColor"
            :stroke-width="strokeWidth"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
      </pattern>
    </defs>
    <rect x="0" y="0" width="100%" :height="height" :fill="`url(#${patternId})`" />
  </svg>
</template>

<style scoped>
.squiggle {
  display: block;
}
</style>
