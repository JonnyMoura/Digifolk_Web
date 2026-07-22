<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import TheNavbar from '@/components/TheNavbar.vue'
import BottomBar from '@/components/BottomBar.vue'
import ArrowButton from '@/components/ArrowButton.vue'
import RightsSelect from '@/components/RightsSelect.vue'
import { pieces } from '@/data/pieces'

const route = useRoute()
const idx = computed(() => {
  const i = pieces.findIndex((p) => p.id === Number(route.params.id))
  return i === -1 ? 0 : i
})
const piece = computed(() => pieces[idx.value])

// Editable metadata form (local copy of the piece).
const form = reactive({ identifier: '', titleFull: '', rights: '', creator: '', date: '' })
watch(
  piece,
  (p) => {
    form.identifier = p.identifier
    form.titleFull = p.subtitle ? `${p.title} | ${p.subtitle}` : p.title
    form.rights = p.rights
    form.creator = p.creator
    form.date = p.date
  },
  { immediate: true },
)

// Carousel: slide 0 = MusicXML metadata, slide 1 = score + piece info.
const slide = ref(0)
function next() {
  if (slide.value < 1) slide.value++
}
function back() {
  if (slide.value > 0) slide.value--
}

// Score pagination (chevrons flip the pages of the score).
const scorePage = ref(1)
const totalScorePages = 4
function prevPage() {
  if (scorePage.value > 1) scorePage.value--
}
function nextPage() {
  if (scorePage.value < totalScorePages) scorePage.value++
}
</script>

<template>
  <div class="page">
    <TheNavbar accent="purple" />

    <main class="page__inner pv">
      <h1 class="pv__title">{{ piece.title }}</h1>
      <p class="pv__sub">{{ slide === 0 ? 'MusicXML Info' : 'Music Info' }}</p>

      <!-- Slide 1: editable MusicXML metadata -->
      <section v-if="slide === 0" class="pv__stage">
        <div class="pv__grid">
          <div class="field">
            <span class="field__label">Identifier</span>
            <input v-model="form.identifier" class="finput" type="text" placeholder="Identifier" />
          </div>
          <div class="field">
            <span class="field__label">Title</span>
            <input v-model="form.titleFull" class="finput" type="text" placeholder="Title" />
            <span class="field__hint">Use ' | ', i.e. space colon space, to separate title and subtitle</span>
          </div>
          <div class="field">
            <span class="field__label">Rights</span>
            <RightsSelect v-model="form.rights" />
          </div>
          <div class="field">
            <span class="field__label">Creator</span>
            <input v-model="form.creator" class="finput" type="text" placeholder="Creator" />
          </div>
          <div class="field">
            <span class="field__label">Date</span>
            <input v-model="form.date" class="finput" type="text" placeholder="Select date" />
          </div>
          <div class="field field--mei">
            <button type="button" class="meibtn">
              <span class="meibtn__note">&#119070;</span><span>MEI</span>
            </button>
          </div>
        </div>

        <footer class="pv__foot pv__foot--end">
          <ArrowButton direction="right" :size="40" aria-label="Next" @click="next" />
        </footer>
      </section>

      <!-- Slide 2: score + piece info -->
      <section v-else class="pv__stage">
        <div class="pv__score" role="img" :aria-label="`Score for ${piece.title}, page ${scorePage}`">
          <button class="pv__scorechev pv__scorechev--l" aria-label="Previous page" @click="prevPage">
            <svg viewBox="0 0 24 24" fill="none"><path d="M15 5 L8 12 L15 19" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </button>
          <svg class="pv__staff" viewBox="0 0 900 120" preserveAspectRatio="none" aria-hidden="true">
            <g v-for="row in [12, 78]" :key="row">
              <line v-for="n in 5" :key="n" :x1="20" :x2="880" :y1="row + (n - 1) * 9" :y2="row + (n - 1) * 9" stroke="#111" stroke-width="1" />
            </g>
          </svg>
          <button class="pv__scorechev pv__scorechev--r" aria-label="Next page" @click="nextPage">
            <svg viewBox="0 0 24 24" fill="none"><path d="M9 5 L16 12 L9 19" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </button>
          <p class="pv__count">{{ scorePage }} / {{ totalScorePages }}</p>
        </div>

        <dl class="pv__info">
          <div class="pv__info-item"><dt>Title</dt><dd>{{ piece.title }}</dd></div>
          <div class="pv__info-item"><dt>Author</dt><dd>{{ piece.author }}</dd></div>
          <div class="pv__info-item"><dt>Key</dt><dd>{{ piece.key }}</dd></div>
          <div class="pv__info-item"><dt>Metre</dt><dd>{{ piece.metre }}</dd></div>
          <div class="pv__info-item"><dt>Tempo</dt><dd>{{ piece.tempo }}</dd></div>
          <div class="pv__info-item"><dt>Mode</dt><dd>{{ piece.mode }}</dd></div>
          <div class="pv__info-item"><dt>Instruments</dt><dd>{{ piece.instruments }}</dd></div>
          <div class="pv__info-item"><dt>Genre</dt><dd>{{ piece.genre }}</dd></div>
        </dl>

        <footer class="pv__foot">
          <ArrowButton direction="left" :size="40" aria-label="Back" @click="back" />
        </footer>
      </section>
    </main>

    <BottomBar accent="purple" />
  </div>
</template>

<style scoped>
.pv {
  display: flex;
  flex-direction: column;
}

.pv__title {
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: var(--fs-h1);
  margin: 0 0 6px;
}

.pv__sub {
  font-family: 'Archivo', sans-serif;
  font-weight: 400;
  font-size: var(--fs-subtitle);
  color: #000;
  margin: 0 0 34px;
}

.pv__stage {
  display: flex;
  flex-direction: column;
}

/* Field grid (shared look with CollectionView) */
.pv__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 64px;
  row-gap: 30px;
  margin-bottom: 8px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field__label {
  font-family: 'Roboto Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.04em;
  color: #555;
  padding-left: 6px;
}
.field__hint {
  font-family: 'Roboto Mono', monospace;
  font-size: 11px;
  color: #777;
  padding-left: 6px;
}
.finput {
  width: 100%;
  min-height: 44px;
  padding: 10px 22px;
  border-radius: 45px;
  border: none;
  outline: none;
  background: var(--color-gray);
  font-family: 'Roboto Mono', monospace;
  font-size: var(--fs-field);
  color: #000;
}
.finput::placeholder {
  color: #000;
  opacity: 0.85;
}
.field--mei {
  justify-content: flex-end;
}
.meibtn {
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  gap: 10px;
  padding: 10px 22px;
  border-radius: 45px;
  background: var(--color-gray);
  font-family: 'Roboto Mono', monospace;
  font-size: var(--fs-field);
  color: #000;
}
.meibtn__note {
  font-size: 16px;
}

.pv__foot {
  display: flex;
  justify-content: flex-start;
  margin-top: 30px;
}
.pv__foot--end {
  justify-content: flex-end;
}

/* Score */
.pv__score {
  position: relative;
  width: 100%;
  padding: 24px 20px;
  margin-bottom: 32px;
  border: 1px solid #000;
  border-radius: 18px;
  background: var(--fill-background);
}
.pv__staff {
  display: block;
  width: 100%;
  height: 160px;
}
.pv__scorechev {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  color: #000;
}
.pv__scorechev svg {
  width: 100%;
  height: 100%;
}
.pv__scorechev--l {
  left: 8px;
}
.pv__scorechev--r {
  right: 8px;
}
.pv__count {
  text-align: center;
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  color: #000;
  margin: 16px 0 0;
}

.pv__info {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px 40px;
  margin: 0 0 30px;
}
.pv__info-item dt {
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: #000;
}
.pv__info-item dd {
  margin: 0;
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  color: #000;
}

@media (max-width: 800px) {
  .pv__title {
    font-size: 26px;
  }
}

@media (max-width: 700px) {
  .pv__grid {
    grid-template-columns: minmax(0, 1fr);
    column-gap: 0;
  }
  .pv__info {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
