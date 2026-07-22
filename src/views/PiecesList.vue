<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import TheNavbar from '@/components/TheNavbar.vue'
import BottomBar from '@/components/BottomBar.vue'
import SearchBar from '@/components/SearchBar.vue'
import { pieces } from '@/data/pieces'

const q = ref('')
const filtered = computed(() => {
  const t = q.value.trim().toLowerCase()
  return t ? pieces.filter((p) => p.title.toLowerCase().includes(t)) : pieces
})
</script>

<template>
  <div class="page">
    <TheNavbar accent="purple" />

    <main class="page__inner browse">
      <div class="browse__bar">
        <h1 class="browse__title">Pieces</h1>
        <SearchBar v-model="q" placeholder="Search pieces" />
      </div>

      

      <ul class="browse__list">
        <li v-for="p in filtered" :key="p.id">
          <RouterLink :to="`/pieces/${p.id}`" class="browse__row">
            <span class="browse__name">{{ p.title }}</span>
            <svg class="browse__arrow" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M14 3.50263V0H10.5004H2.33353V3.50263H7.1889L0 10.6973L3.29982 14L10.5004 6.79401V11.6761H14V3.50263Z" fill="currentColor" />
            </svg>
          </RouterLink>
        </li>
        <li v-if="!filtered.length" class="browse__empty">No pieces found.</li>
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
  justify-content: space-between;
  gap: 14px;
  padding: 24px 32px;
  border-radius: 40px;
  background: var(--color-gray);
  color: #000;
  transition: background 0.2s ease;
}
.browse__row:hover {
  background: #cfcdcd;
}
.browse__name {
  font-family: 'Archivo', sans-serif;
  font-size: 16px;
  font-weight: 400;
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

@media (max-width: 700px) {
  .browse__title {
    font-size: 26px;
  }
}
</style>
