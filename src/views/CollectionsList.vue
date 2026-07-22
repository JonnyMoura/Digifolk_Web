<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import TheNavbar from '@/components/TheNavbar.vue'
import BottomBar from '@/components/BottomBar.vue'
import SearchBar from '@/components/SearchBar.vue'
import { collections } from '@/data/pieces'

const q = ref('')
const filtered = computed(() => {
  const t = q.value.trim().toLowerCase()
  return t
    ? collections.filter((c) => c.title.toLowerCase().includes(t) || c.code.toLowerCase().includes(t))
    : collections
})
</script>

<template>
  <div class="page">
    <TheNavbar accent="purple" />

    <main class="page__inner browse">
      <div class="browse__bar">
        <h1 class="browse__title">Collections</h1>
        <SearchBar v-model="q" class="search_bar" placeholder="Search collections" />
      </div>

      

      <ul class="browse__list">
        <li v-for="c in filtered" :key="c.id">
          <RouterLink :to="`/collections/${c.id}`" class="browse__row">
            <span class="browse__name">{{ c.title }}</span>
            <span class="browse__code">{{ c.code }}</span>
            <svg class="browse__arrow" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M14 3.50263V0H10.5004H2.33353V3.50263H7.1889L0 10.6973L3.29982 14L10.5004 6.79401V11.6761H14V3.50263Z" fill="currentColor" />
            </svg>
          </RouterLink>
        </li>
        <li v-if="!filtered.length" class="browse__empty">No collections found.</li>
      </ul>
    </main>

    <BottomBar accent="purple" />
  </div>
</template>

<style scoped>
.browse {
  display: flex;
  flex-direction: column;
}
.browse__bar {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
}
.browse__title {
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: var(--fs-h1);
  text-align: left;
  margin: 24px 0 28px;
}
.browse__list {
  list-style: none;
  margin: 0 auto;
  padding: 0;
  width: 100%;
  /*max-width: 760px;*/
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.browse__row {
  display: flex;
  align-items: center;
  gap: 21px;
  padding: 24px 36px;
  border-radius: 40px;
  background: var(--color-gray);
  color: #000;
  transition: background 0.2s ease;
}
.browse__row:hover {
  background: #cfcdcd;
}
.browse__name {
  flex: 1 1 auto;
  font-family: 'Archivo', sans-serif;
  font-size: 16px;
  font-weight: 400;
}
.browse__code {
  font-family: 'Roboto Mono', monospace;
  font-size: 12px;
  color: #555;
}
.browse__arrow {
  flex: 0 0 auto;
  width: 18px;
  height: 18px;
  color: #000;
}
.browse__empty {
  text-align: center;
  font-family: 'Roboto Mono', monospace;
  color: #555;
  padding: 20px;
}
.search_bar {
  max-height: 40px;
}

@media (max-width: 700px) {
  .browse__title {
    font-size: 26px;
  }
}
</style>
