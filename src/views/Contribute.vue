<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import TheNavbar from '@/components/TheNavbar.vue'
import BottomBar from '@/components/BottomBar.vue'
import ArrowButton from '@/components/ArrowButton.vue'

const router = useRouter()

// Wizard steps mirror the Figma "Contribute form pages" variants:
// Default -> Variant2 -> Variant3 -> Variant6 -> Variant7 -> Variant8
const STEPS = ['default', 'contributors1', 'musicInfo', 'contributors2', 'details', 'thankyou']
const stepIndex = ref(0)
const step = computed(() => STEPS[stepIndex.value])
function next() {
  if (stepIndex.value < STEPS.length - 1) stepIndex.value++
}
function back() {
  if (stepIndex.value > 0) stepIndex.value--
}

// --- Default step: upload + rights dropdown ---
const fileName = ref('')
function onFile(e) {
  const f = e.target.files?.[0]
  fileName.value = f ? f.name : ''
}
const rightsOpen = ref(false)
const rightsValue = ref('')
const rightsOptions = ['All rights reserved', 'CC BY', 'CC BY-SA', 'CC BY-NC', 'Public Domain']
function pickRights(opt) {
  rightsValue.value = opt
  rightsOpen.value = false
}

// --- Contributor add form (Overlay_Contributor / Overlay_Contributor_2) ---
// Appears centred on the page itself (not a modal overlay).
const showAddForm = ref(false)
const addForm = reactive({ contributor: '', role: '', gender: '', description: '' })
const contributors1 = ref([])
const contributors2 = ref([])
// Variant2's form has a Description field; Variant6's does not.
const addHasDescription = computed(() => step.value === 'contributors1')
const currentList = computed(() => (step.value === 'contributors1' ? contributors1.value : contributors2.value))

function openAdd() {
  addForm.contributor = ''
  addForm.role = ''
  addForm.gender = ''
  addForm.description = ''
  showAddForm.value = true
}
function submitContributor() {
  const target = step.value === 'contributors1' ? contributors1 : contributors2
  target.value.push({ ...addForm })
  showAddForm.value = false
}
function submitFinal() {
  stepIndex.value = STEPS.indexOf('thankyou')
}
function startNewContribution() {
  stepIndex.value = 0
  fileName.value = ''
  rightsOpen.value = false
  rightsValue.value = ''
  contributors1.value = []
  contributors2.value = []
  showAddForm.value = false
}
function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="page contribute-page">
    <TheNavbar accent="purple" />

    <main class="contribute">
      <!-- DEFAULT: upload + work metadata -->
      <form v-if="step === 'default'" class="cform" @submit.prevent>
        <label class="upload">
          <span class="upload__text">{{ fileName || 'Upload MusicXML File' }}</span>
          <input class="upload__input" type="file" accept=".xml,.musicxml,.mxl" @change="onFile" />
          <svg class="upload__icon" viewBox="0 0 32 34" fill="none" aria-hidden="true">
            <path d="M16 22 V5 M8.5 12.5 L16 5 L23.5 12.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M4 23 V30 H28 V23" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </label>

        <div class="grid2">
          <input class="field" type="text" placeholder="Identifier" />
          <div class="rights">
            <button type="button" class="field field--button" @click="rightsOpen = !rightsOpen">
              <span :class="{ 'is-placeholder': !rightsValue }">{{ rightsValue || 'Rights' }}</span>
              <svg class="chevron" :class="{ 'chevron--up': rightsOpen }" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M5 8 L10 13 L15 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <ul v-if="rightsOpen" class="rights__menu">
              <li v-for="opt in rightsOptions" :key="opt"><button type="button" @click="pickRights(opt)">{{ opt }}</button></li>
            </ul>
          </div>
          <input class="field" type="text" placeholder="Type" />
          <input class="field" type="text" placeholder="Publisher" />
          <input class="field" type="text" placeholder="Date" />
          <input class="field" type="text" placeholder="Title" />
          <input class="field" type="text" placeholder="Creator" />
        </div>

        <footer class="cfoot">
          <span />
          <ArrowButton direction="right" :size="40" aria-label="Next" @click="next" />
        </footer>
      </form>

      <!-- VARIANT2 / VARIANT6: Contributors -->
      <section v-else-if="step === 'contributors1' || step === 'contributors2'" class="cform">
        <header class="cform__head">
          <div class="cform__heading">
            <h1 class="cform__title">Contributors</h1>
            <p class="cform__subtitle">{{ step === 'contributors1' ? 'MusicXML' : 'Musical Piece' }}</p>
          </div>
          <button type="button" class="addbtn" @click="openAdd"><span>ADD</span></button>
        </header>

        <ul class="contrib-list">
          <li v-if="!currentList.length" class="contrib-empty">No contributor added yet. Click ADD to create new contributor</li>
          <li v-for="(c, i) in currentList" :key="i" class="contrib-card">
            <span class="contrib-card__name">{{ c.contributor || 'Contributor' }}</span>
            <span v-if="c.role || c.gender" class="contrib-card__meta">{{ [c.role, c.gender].filter(Boolean).join(' · ') }}</span>
            <span v-if="c.description" class="contrib-card__desc">{{ c.description }}</span>
          </li>
        </ul>

        <footer class="cfoot">
          <ArrowButton direction="left" :size="40" aria-label="Back" @click="back" />
          <ArrowButton direction="right" :size="40" aria-label="Next" @click="next" />
        </footer>
      </section>

      <!-- VARIANT3: Musical Piece Info -->
      <form v-else-if="step === 'musicInfo'" class="cform" @submit.prevent>
        <h1 class="cform__title">Musical Piece Info</h1>
        <div class="grid2">
          <input class="field" type="text" placeholder="Creator" />
          <input class="field" type="text" placeholder="Genre" />
          <input class="field" type="text" placeholder="Rights" />
          <input class="field" type="text" placeholder="Metre" />
          <input class="field" type="text" placeholder="Key" />
          <input class="field" type="text" placeholder="Instrument" />
          <input class="field" type="text" placeholder="Tempo" />
        </div>
        <footer class="cfoot">
          <ArrowButton direction="left" :size="40" aria-label="Back" @click="back" />
          <ArrowButton direction="right" :size="40" aria-label="Next" @click="next" />
        </footer>
      </form>

      <!-- VARIANT7: Additional details -->
      <form v-else-if="step === 'details'" class="cform" @submit.prevent="submitFinal">
        <div class="grid2">
          <input class="field" type="text" placeholder="Alternative Title" />
          <input class="field" type="text" placeholder="Description" />
          <input class="field" type="text" placeholder="Type" />
          <input class="field" type="text" placeholder="Subject" />
          <input class="field" type="text" placeholder="hasVersion" />
          <input class="field" type="text" placeholder="isVersion" />
          <input class="field" type="text" placeholder="Coverage" />
          <input class="field" type="text" placeholder="Format" />
          <input class="field" type="text" placeholder="Language" />
        </div>
        <footer class="cfoot cfoot--submit">
          <ArrowButton direction="left" :size="40" aria-label="Back" @click="back" />
          <button type="submit" class="submitbtn"><span>SUBMIT</span></button>
          <span />
        </footer>
      </form>

      <!-- VARIANT8: Thank you -->
      <section v-else class="cform thankyou">
        <h1 class="thankyou__title">THANK YOU!</h1>
        <p class="thankyou__sub">Your response has been submitted for futher review</p>
        <footer class="cfoot">
          <ArrowButton direction="left" :size="40" aria-label="Back to home" @click="goHome" />
          <button type="button" class="submitbtn" @click="startNewContribution"><span>NEW CONTRIBUTION</span></button>
        </footer>
      </section>

      <!-- Add-contributor form: appears centred on the page itself -->
      <div v-if="showAddForm" class="addform-catcher" @click.self="showAddForm = false">
        <form class="addform" @submit.prevent="submitContributor">
          
          <div class="grid2">
            <input v-model="addForm.contributor" class="field" type="text" placeholder="Contributor" />
            <input v-model="addForm.role" class="field" type="text" placeholder="Role" />
            <input v-model="addForm.gender" class="field" type="text" placeholder="Gender" />
            <input v-if="addHasDescription" v-model="addForm.description" class="field" type="text" placeholder="Description" />
          </div>
          <button type="submit" class="submitbtn"><span>SUBMIT</span></button>
        </form>
      </div>
    </main>

    <BottomBar accent="purple" />
  </div>
</template>

<style scoped>
.contribute-page {
  display: flex;
  flex-direction: column;
}

.contribute {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - var(--navbar-height) - var(--bottombar-height));
}

.cform {
  width: 100%;
  max-width: 1010px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.cform__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.cform__heading {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cform__title {
  font-family: 'Archivo', sans-serif;
  font-weight: 400;
  font-size: clamp(26px, 3vw, 34px);
  color: #000;
  margin: 0;
}

/* Same treatment as PieceView's slide subtitle ("MusicXML Info"/"Music Info") */
.cform__subtitle {
  font-family: 'Archivo', sans-serif;
  font-weight: 400;
  font-size: var(--fs-subtitle);
  color: #000;
  margin: 0;
}

/* Upload field */
.upload {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  padding: 12px 22px;
  border-radius: 45px;
  background: var(--color-gray);
  cursor: pointer;
}
.upload__text {
  font-family: 'Archivo', sans-serif;
  font-weight: 300;
  font-size: var(--fs-upload);
  color: #000;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.upload__input {
  display: none;
}
.upload__icon {
  flex: 0 0 auto;
  width: 26px;
  height: 28px;
  color: #000;
}

/* Field grid */
.grid2 {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 64px;
  row-gap: 36px;
}

.field {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 11px 22px;
  border-radius: 45px;
  background: var(--color-gray);
  font-family: 'Roboto Mono', monospace;
  font-weight: 300;
  font-size: var(--fs-field);
  color: #000;
  outline: none;
  border: none;
}
.field::placeholder {
  color: #000;
  opacity: 0.85;
}
.field--button {
  justify-content: space-between;
  cursor: pointer;
  text-align: left;
}
.is-placeholder {
  opacity: 0.85;
}
.chevron {
  width: 18px;
  height: 18px;
  color: #000;
  flex: 0 0 auto;
  transition: transform 0.2s ease;
}
.chevron--up {
  transform: rotate(180deg);
}
.rights {
  position: relative;
}
.rights__menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  z-index: 20;
  margin: 0;
  padding: 8px;
  list-style: none;
  background: var(--color-gray);
  border-radius: 22px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
}
.rights__menu li button {
  display: block;
  width: 100%;
  text-align: left;
  padding: 9px 16px;
  border-radius: 16px;
  font-family: 'Roboto Mono', monospace;
  font-size: var(--fs-field);
  color: #000;
}
.rights__menu li button:hover {
  background: rgba(255, 255, 255, 0.55);
}

/* Footer arrows */
.cfoot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
}
.cfoot--submit {
  justify-content: space-between;
}

/* ADD button — same purple hover wash as Sign In */
.addbtn {
  position: relative;
  overflow: hidden;
  padding: 8px 22px;
  border-radius: 45px;
  background: var(--color-gray);
  font-family: 'Roboto Mono', monospace;
  font-weight: 500;
  font-size: 13px;
  letter-spacing: 0.05em;
  color: #000;
}
.addbtn::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  opacity: 0;
  pointer-events: none;
  background: var(--hover-purple);
  transition: opacity 0.6s ease;
}
.addbtn > * {
  position: relative;
  z-index: 1;
}
/* hover on desktop, tap (:active) on touch devices */
.addbtn:hover::before,
.addbtn:active::before {
  opacity: 1;
}

/* Contributor list — a FIXED height (not min/max, which still let the box
   grow/shrink with content between those bounds and kept pushing the
   header/footer around the page as cards were added/removed). Fixed height
   + overflow-y:auto means .cform's total height never changes no matter how
   many contributors there are; the list scrolls internally instead. */
.contrib-list {
  list-style: none;
  margin: 0;
  padding: 0 6px 0 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 260px;
  overflow-y: auto;
}
.contrib-empty {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1 1 auto;
  text-align: left;
  font-family: 'Roboto Mono', monospace;
  font-weight: 300;
  font-size: 13px;
  color: #6b6b6b;
}
/* Row disposition: name + role/gender + description all flow inline on the
   same line (wrapping onto more lines only if they don't fit), instead of
   each sitting stacked as its own block below the name. */
.contrib-card {
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: baseline;
  column-gap: 10px;
  row-gap: 2px;
  padding: 10px 20px;
  border-radius: 18px;
  background: var(--color-gray);
}
.contrib-card__name {
  font-family: 'Roboto Mono', monospace;
  font-weight: 500;
  font-size: 13px;
  color: #000;
}
.contrib-card__meta {
  font-family: 'Roboto Mono', monospace;
  font-weight: 300;
  font-size: 11px;
  color: #2b2b2b;
}
.contrib-card__meta::before {
  content: '· ';
}
.contrib-card__desc {
  font-family: 'Roboto Mono', monospace;
  font-weight: 300;
  font-size: 11px;
  color: #2b2b2b;
}
.contrib-card__desc::before {
  content: '— ';
}

/* SUBMIT button (purple hover wash over 600ms) */
.submitbtn {
  position: relative;
  overflow: hidden;
  padding: 10px 30px;
  border-radius: 45px;
  background: var(--color-gray);
  font-family: 'Roboto Mono', monospace;
  font-weight: 500;
  font-size: 13px;
  letter-spacing: 0.05em;
  color: #000;
}
.submitbtn::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  opacity: 0;
  pointer-events: none;
  background: var(--hover-purple);
  transition: opacity 0.6s ease;
}
.submitbtn:hover::before,
.submitbtn:active::before {
  opacity: 1;
}
.submitbtn > * {
  position: relative;
  z-index: 1;
}

/* Thank you */
.thankyou {
  gap: 16px;
}
.thankyou__title {
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: clamp(44px, 7vw, 72px);
  color: #000;
  margin: 0;
}
.thankyou__sub {
  font-family: 'Josefin Slab', serif;
  font-weight: 400;
  font-size: 22px;
  color: #000;
  margin: 0;
}

/* Add-contributor form: centred on the page (no dark modal backdrop) */
.addform-catcher {
  position: fixed;
  inset: 0;
  z-index: 1;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 40px;

  /* keep your blur, but it becomes the *environment blur* */
  backdrop-filter: blur(3px);
}

.addform {
  position: relative;
  width: 100%;
  max-width: 720px;

  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;

  padding: 44px 48px;
  border-radius: 36px;

  background: rgba(35, 35, 40, 0); /* darker frosted base */

  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);



  box-shadow:
    0 25px 80px rgba(0, 0, 0, 0.193),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);

  isolation: isolate;
  overflow: hidden;
}
.addform::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;

 
  pointer-events: none;
}
.addform::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;

  filter: url(#container-glass);
  opacity: 0.6;

  pointer-events: none;
}

.addform .grid2 {
  width: 100%;
}
.addform__close {
  position: absolute;
  top: 14px;
  right: 22px;
  font-size: 28px;
  line-height: 1;
  color: #000;
}

@media (max-width: 760px) {
  .grid2 {
    grid-template-columns: minmax(0, 1fr);
    column-gap: 0;
    row-gap: 24px;
  }
  .upload__text {
    font-size: 17px;
  }
}
</style>
