<script setup>
import { ref, computed, onMounted } from 'vue'
import { getListOfPiecesWDetails } from './api/digifolkAPI'
import { aggregateByCriteria } from './utils/Aggregator'
import { sortAggregatedData } from './utils/SortAggregatedData'
import { getCountryFromMusicId } from './utils/GetCountry'
import DorlingMap from './DorlingMap.vue'

const attributesToShow = [
  'genre',
  'language',
  'spatial.country',
  'temporal.year',
  'meter',
  'mode',
  'real_key',
  'tempo',
  'instruments',
]

const attributeDisplayNames = {
  genre: 'Genre',
  instruments: 'Instruments',
  language: 'Language',
  meter: 'Meter',
  mode: 'Mode',
  publisher: 'Publisher',
  real_key: 'Key',
  'spatial.country': 'Country',
  'temporal.year': 'Coverage Year',
  subject: 'Subject',
  tempo: 'Tempo',
}

const attributeKeySorted = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'Ab', 'A', 'Bb', 'B']

const attributeModeMapping = {
  Major: 'Ionian',
  Minor: 'Aeolian',
  Dorico: 'Dorian',
}

const attributeTempoMapping = {
  'î = 90': 'Andante moderato',
  'î = 80': 'Andante lento',
  'î = 180': 'Presto',
  'î = 120': 'Allegro moderato',
  'î = 60': 'Adagio',
  'î = 100': 'Andante',
  'î = 140': 'Allegro',
  'î = 160': 'Vivace',
  'î = 110': 'Andantino',
  'î = 70': 'Adagietto',
  'î = 200': 'Prestissimo',
  'î = 50': 'Largo',
}

const pieces = ref([])
const loading = ref(true)
const attributeIndex = ref(-1)

const currentAttribute = computed(() => (attributeIndex.value === -1 ? null : attributesToShow[attributeIndex.value]))
const freeLayout = computed(() => currentAttribute.value === null)

const aggregatedUnsorted = computed(() =>
  currentAttribute.value ? aggregateByCriteria(pieces.value, currentAttribute.value) : [],
)

const aggregated = computed(() => {
  if (currentAttribute.value === 'temporal.year') {
    return sortAggregatedData(aggregatedUnsorted.value)
  }

  if (currentAttribute.value === 'real_key') {
    return sortAggregatedData(aggregatedUnsorted.value, 'custom', 'asc', attributeKeySorted)
  }

  return sortAggregatedData(aggregatedUnsorted.value, 'cluster_size', 'asc')
})

const totalPiecesCount = computed(() =>
  aggregated.value.reduce((sum, group) => sum + group.pieces.length, 0),
)

const displayedCount = computed(() => (freeLayout.value ? pieces.value.length : totalPiecesCount.value))

function prevAttribute() {
  attributeIndex.value = attributeIndex.value <= -1 ? attributesToShow.length - 1 : attributeIndex.value - 1
}

function nextAttribute() {
  attributeIndex.value = attributeIndex.value >= attributesToShow.length - 1 ? -1 : attributeIndex.value + 1
}

onMounted(() => {
  getListOfPiecesWDetails(true)
    .then((data) => {
      data.forEach((entry) => {
        // "MX" is used as a duplicate/mistaken tag for Spanish and should
        // be merged into "ES" rather than shown as its own language.
        entry.language = entry.language === 'MX' ? 'ES' : entry.language

        // Some tempo values are corrupted with stray C1 control characters
        // that make them miss attributeTempoMapping below. Strip those before matching.
        const normalizedTempo = entry.tempo?.replace(/[\u0080-\u009F]/g, '')

        if (normalizedTempo && attributeTempoMapping[normalizedTempo]) {
          entry.tempo = attributeTempoMapping[normalizedTempo]
        }

        // "-1" is a placeholder for an unknown/unset mode, not a real value.
        entry.mode = entry.mode === '-1' ? '' : entry.mode.charAt(0).toUpperCase() + entry.mode.slice(1)

        // Collapse mode name variants/translations onto their canonical name:
        // Major/Minor are the common names for Ionian/Aeolian, "Dorico" is
        // Portuguese for Dorian, and numbered Aeolian variants (e.g. "Aeolian6")
        // are treated as plain Aeolian.
        if (entry.mode.startsWith('Aeolian')) {
          entry.mode = 'Aeolian'
        } else if (attributeModeMapping[entry.mode]) {
          entry.mode = attributeModeMapping[entry.mode]
        }

        if (!entry.spatial?.country || entry.spatial?.country === 'Unknown' || entry.spatial?.country === 'unknown') {
          entry.spatial = { ...entry.spatial, country: getCountryFromMusicId(entry.id) }
        }
      })

      pieces.value = Array.isArray(data) ? data : data.pieces || []
      loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
})
</script>

<template>
  <div class="main-vis">
    <div v-if="loading" class="main-vis__status">Loading collection...</div>

    <template v-else>
      <div class="main-vis__canvas">
        <button class="main-vis__arrow main-vis__arrow--left" aria-label="Previous attribute" @click="prevAttribute">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M15 5 L8 12 L15 19"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <button class="main-vis__arrow main-vis__arrow--right" aria-label="Next attribute" @click="nextAttribute">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M9 5 L16 12 L9 19"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <DorlingMap :data="pieces" :data-aggregated="aggregated" :free-layout="freeLayout" :margin-top="24" />
      </div>

      <div class="main-vis__footer">
        <p class="main-vis__description">
          Here are <strong>{{ displayedCount }}</strong> folk music pieces. Each bubble represents a unique piece
          of folk music. Hover over a bubble to see more details.
          <template v-if="freeLayout"> The bubbles are randomly positioned.</template>
          <template v-else>
            The bubbles are grouped and coloured by <strong>{{ attributeDisplayNames[currentAttribute] }}</strong
            >.
          </template>
        </p>
      </div>
    </template>
  </div>
</template>

<style scoped>
.main-vis {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
}

.main-vis__status {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Josefin Slab', serif;
  font-weight: 300;
  font-size: var(--fs-body-sm);
  color: #000;
}

/* The bubble canvas takes all available space; the description sits below it
   (not overlaid on top of it) in the remaining, content-sized row. */
.main-vis__canvas {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
}

.main-vis__footer {
  flex: 0 0 auto;
  padding: 8px 64px 4px;
  text-align: center;
}

.main-vis__description {
  margin: 0;
  font-family: 'Archivo', sans-serif;
  font-weight: 300;
  font-size: var(--fs-body-sm);
  line-height: 1.3;
  color: #000;
}
.main-vis__description strong {
  font-weight: 700;
}

.main-vis__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  width: 30px;
  height: 30px;
  color: #1f1f1f;
}
.main-vis__arrow svg {
  width: 100%;
  height: 100%;
}
.main-vis__arrow--left {
  left: 24px;
}
.main-vis__arrow--right {
  right: 24px;
}

@media (max-width: 700px) {
  .main-vis__footer {
    padding: 6px 44px 0;
  }
  .main-vis__description {
    font-size: 12px;
  }
}
</style>
