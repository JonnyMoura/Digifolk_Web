<script setup>
import { reactive, computed, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import TheNavbar from '@/components/TheNavbar.vue'
import BottomBar from '@/components/BottomBar.vue'
import RightsSelect from '@/components/RightsSelect.vue'
import { getCollection, piecesByIds, collections } from '@/data/pieces'

const route = useRoute()
const collection = computed(() => getCollection(route.params.id) || collections[0])
const pieceList = computed(() => piecesByIds(collection.value.pieceIds))

// Editable metadata form (local copy of the collection).
const form = reactive({
  id: '', code: '', title: '', rights: '',
  country: '', state: '', location: '',
  century: '', decade: '', year: '', rightsHolder: '',
})
watch(
  collection,
  (c) => {
    form.id = c.id
    form.code = c.code
    form.title = c.title
    form.rights = c.rights
    form.country = c.country
    form.state = c.state
    form.location = c.location
    form.century = c.century
    form.decade = c.decade
    form.year = c.year
    form.rightsHolder = c.rightsHolder
  },
  { immediate: true },
)
</script>

<template>
  <div class="page">
    <TheNavbar accent="purple" />

    <main class="page__inner cv">
      <h1 class="cv__title">Collection</h1>

      <div class="cv__grid cv__grid--4">
        <div class="field"><span class="field__label">ID</span><input v-model="form.id" class="finput" type="text" placeholder="ID" /></div>
        <div class="field"><span class="field__label">Code</span><input v-model="form.code" class="finput" type="text" placeholder="Code" /></div>
        <div class="field"><span class="field__label">Title</span><input v-model="form.title" class="finput" type="text" placeholder="Title" /></div>
        <div class="field"><span class="field__label">Rights</span><RightsSelect v-model="form.rights" /></div>
      </div>

      <h2 class="cv__section">Spatial</h2>
      <div class="cv__grid cv__grid--3">
        <div class="field"><span class="field__label">Country</span><input v-model="form.country" class="finput" type="text" placeholder="Country" /></div>
        <div class="field"><span class="field__label">State</span><input v-model="form.state" class="finput" type="text" placeholder="State" /></div>
        <div class="field"><span class="field__label">Location</span><input v-model="form.location" class="finput" type="text" placeholder="Location" /></div>
      </div>

      <h2 class="cv__section">Temporal</h2>
      <div class="cv__grid cv__grid--3">
        <div class="field"><span class="field__label">Century</span><input v-model="form.century" class="finput" type="text" placeholder="Century" /></div>
        <div class="field"><span class="field__label">Decade</span><input v-model="form.decade" class="finput" type="text" placeholder="Decade" /></div>
        <div class="field"><span class="field__label">Year</span><input v-model="form.year" class="finput" type="text" placeholder="Year" /></div>
      </div>

      <div class="field cv__rights">
        <span class="field__label">rights_holder</span>
        <input v-model="form.rightsHolder" class="finput" type="text" placeholder="rights_holder" />
      </div>

      <h2 class="cv__pieces-title">Pieces</h2>
      <ul class="cv__pieces">
        <li v-for="p in pieceList" :key="p.id">
          <RouterLink :to="`/pieces/${p.id}`" class="cv__row">
            <span class="cv__name">{{ p.title }}</span>
            <svg class="cv__arrow" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M14 3.50263V0H10.5004H2.33353V3.50263H7.1889L0 10.6973L3.29982 14L10.5004 6.79401V11.6761H14V3.50263Z" fill="currentColor" />
            </svg>
          </RouterLink>
        </li>
        <li v-if="!pieceList.length" class="cv__empty">No pieces in this collection.</li>
      </ul>
    </main>

    <BottomBar accent="purple" />
  </div>
</template>

<style scoped>
.cv {
  display: flex;
  flex-direction: column;
}
.cv__title {
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: var(--fs-h1);
  text-align: left;
  margin: 0 0 34px;
}

.cv__grid {
  display: grid;
  gap: 24px 40px;
  margin-bottom: 8px;
}
.cv__grid--4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
.cv__grid--3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
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

.cv__section {
  font-family: 'Archivo', sans-serif;
  font-weight: 400;
  font-size: clamp(22px, 2.4vw, 28px);
  text-align: left;
  margin: 34px 0 22px;
}
.cv__rights {
  max-width: 420px;
  margin-top: 24px;
}

.cv__pieces-title {
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: var(--fs-h2);
  text-align: left;
  margin: 44px 0 22px;
}

.cv__pieces {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.cv__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 24px 32px;
  border-radius: 40px;
  background: var(--color-gray);
  color: #000;
  transition: background 0.2s ease;
}
.cv__row:hover {
  background: #cfcdcd;
}
.cv__name {
  font-family: 'Archivo', sans-serif;
  font-size: 16px;
  font-weight: 400;
}
.cv__arrow {
  width: 18px;
  height: 18px;
  color: #000;
  flex: 0 0 auto;
}
.cv__empty {
  font-family: 'Roboto Mono', monospace;
  color: #555;
  text-align: center;
  padding: 16px;
}

@media (max-width: 760px) {
  .cv__title {
    font-size: 26px;
  }
  .cv__grid--4,
  .cv__grid--3 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
