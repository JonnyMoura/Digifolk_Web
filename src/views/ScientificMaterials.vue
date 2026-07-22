<script setup>
import { ref, computed } from 'vue'
import TheNavbar from '@/components/TheNavbar.vue'
import BottomBar from '@/components/BottomBar.vue'
import SquiggleLine from '@/components/SquiggleLine.vue'
import MaterialCard from '@/components/MaterialCard.vue'
import CiteOverlay from '@/components/CiteOverlay.vue'
import MaterialInfoOverlay from '@/components/MaterialInfoOverlay.vue'
import FilterPill from '@/components/FilterPill.vue'
import { scientificMaterials, ABSTRACT } from '@/data/materials'

const showCite = ref(false)

const FILTERS = ['Paper', 'Dataset']
const activeFilter = ref(null)
function toggleFilter(type) {
  activeFilter.value = activeFilter.value === type ? null : type
}
const filteredMaterials = computed(() =>
  activeFilter.value ? scientificMaterials.filter((m) => m.type === activeFilter.value) : scientificMaterials,
)

const showInfo = ref(false)
const activeMaterial = ref(null)
function openInfo(m) {
  activeMaterial.value = m
  showInfo.value = true
}
</script>

<template>
  <div class="page">
    <TheNavbar accent="green" />

    <main class="page__inner materials">
      <header class="materials__head">
        <h1 class="page-title">Scientific Materials</h1>
        <div class="materials__squiggle">
          <SquiggleLine color="var(--green)" :count="40" />
        </div>
      </header>

      <div class="materials__filters">
        <FilterPill
          v-for="f in FILTERS"
          :key="f"
          :label="f"
          :active="activeFilter === f"
          @click="toggleFilter(f)"
        />
      </div>

      <section class="materials__grid">
        <MaterialCard
          v-for="m in filteredMaterials"
          :key="m.id"
          :title="m.title"
          :authors="m.authors"
          :type="m.type"
          :to="`/scientific-materials/${m.id}`"
          @open="openInfo(m)"
          @cite="showCite = true"
        />
      </section>
    </main>

    <BottomBar accent="green" />

    <CiteOverlay :open="showCite" @close="showCite = false" />
    <MaterialInfoOverlay
      :open="showInfo"
      :body="ABSTRACT"
      :authors="activeMaterial?.authors"
      :type="activeMaterial?.type"
      :to="activeMaterial ? `/scientific-materials/${activeMaterial.id}` : null"
      @close="showInfo = false"
      @cite="showCite = true"
    />
  </div>
</template>

<style scoped>
.materials__head {
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding-bottom: 28px;
}

.materials__squiggle {
  width: min(520px, 100%);
}

.materials__filters {
  display: flex;
  gap: 15px;
  padding-bottom: 25px;
}

.materials__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  column-gap: 16px;
  row-gap: 30px;
}

@media (max-width: 1100px) {
  .materials__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* Mobile: single column of pill cards, monospace title. */
@media (max-width: 700px) {
  .materials__grid {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 14px;
  }
  .page-title {
    font-family: 'Roboto Mono', monospace;
    font-weight: 700;
    font-size: 26px;
    text-align: center;
  }
  .materials__head {
    align-items: center;
    gap: 14px;
  }
  .materials__filters {
    justify-content: center;
  }
}
</style>
