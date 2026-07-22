<script setup>
import { useRouter } from 'vue-router'
import BottomBar from '@/components/BottomBar.vue'
import SquiggleLine from '@/components/SquiggleLine.vue'
import ArrowButton from '@/components/ArrowButton.vue'
import PillButton from '@/components/PillButton.vue'
import { TITLE, AUTHORS, ABSTRACT } from '@/data/materials'

const router = useRouter()
const goBack = () => router.push('/educational-materials')
</script>

<template>
  <div class="page page--detail">
    <main class="page__inner detail">
      <ArrowButton class="detail__back" direction="left" :size="50" @click="goBack" />

      <h1 class="detail__title">{{ TITLE }}</h1>

      <div class="detail__squiggle">
        <SquiggleLine color="var(--green)" :count="40" />
      </div>

      <p class="detail__authors">{{ AUTHORS }}</p>

      <p class="detail__body">{{ ABSTRACT }}</p>

      <div class="detail__actions">
        <PillButton label="Lesson" icon="doc" />
        <PillButton label="Lesson" icon="doc" />
        <PillButton label="Lesson" icon="doc" />
      </div>
    </main>

    <BottomBar accent="green" />
  </div>
</template>

<style scoped>
.detail {
  display: flex;
  flex-direction: column;
}

.detail__back {
  margin-bottom: 28px;
}

.detail__title {
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: var(--fs-h1);
  line-height: 1.14;
  margin: 0 0 22px;
  max-width: 900px;
}

.detail__squiggle {
  width: min(520px, 100%);
  margin-bottom: 20px;
}

.detail__authors {
  font-family: 'Roboto Mono', monospace;
  font-weight: 300;
  font-size: var(--fs-author);
  letter-spacing: 0.02em;
  line-height: 1.6;
  margin: 0 0 36px;
  max-width: 900px;
}

.detail__body {
  font-family: 'Josefin Slab', serif;
  font-weight: 400;
  font-size: var(--fs-body);
  line-height: 1.4;
  margin: 0 0 44px;
  max-width: 640px;
}

.detail__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

@media (max-width: 800px) {
  .detail__title {
    font-size: 26px;
  }
}

/* Mobile uses the hamburger top bar's ✕ to go back. */
@media (max-width: 700px) {
  .detail__back {
    display: none;
  }
}
</style>
