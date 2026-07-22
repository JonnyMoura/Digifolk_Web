<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import BrandWordmark from './BrandWordmark.vue'
import SquiggleLine from './SquiggleLine.vue'

// Mobile-only top bar (hamburger + optional close) and the slide-in drawer.
const props = defineProps({
  // show the ✕ close control (detail pages return to the previous screen)
  showClose: { type: Boolean, default: false },
})

const router = useRouter()
const open = ref(false)

const links = [
  { label: 'SCIENTIFIC MATERIALS', to: '/scientific-materials' },
  { label: 'EDUCATIONAL MATERIALS', to: '/educational-materials' },
  { label: 'VISUALISATIONS', to: '/visualisations' },
  { label: 'ABOUT', to: '/about' },
]

function goBack() {
  router.back()
}
</script>

<template>
  <div class="mnav">
    <header class="mnav__bar">
      <button class="mnav__burger" aria-label="Open menu" @click="open = true">
        <span /><span /><span />
      </button>
      <button v-if="showClose" class="mnav__close" aria-label="Go back" @click="goBack">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 6 L18 18 M18 6 L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
        </svg>
      </button>
    </header>

    <!-- Drawer -->
    <transition name="scrim">
      <div v-if="open" class="mnav__scrim" @click="open = false" />
    </transition>
    <transition name="drawer">
      <nav v-if="open" class="drawer" :style="{ color: 'var(--red)' }">
        <div class="drawer__brand"><BrandWordmark /></div>
        <div class="drawer__squiggle"><SquiggleLine color="currentColor" :height="12" /></div>
        <ul class="drawer__links">
          <li v-for="link in links" :key="link.to">
            <RouterLink :to="link.to" class="drawer__link" @click="open = false">{{ link.label }}</RouterLink>
          </li>
        </ul>
      </nav>
    </transition>
  </div>
</template>

<style scoped>
.mnav {
  display: none;
}

@media (max-width: 700px) {
  .mnav {
    display: block;
  }
}

.mnav__bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  z-index: 120;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 22px;
  background: var(--fill-background);
}

.mnav__burger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 30px;
  height: 24px;
  color: #1f1f1f;
}
.mnav__burger span {
  display: block;
  height: 3px;
  width: 100%;
  border-radius: 2px;
  background: currentColor;
}

.mnav__close {
  width: 26px;
  height: 26px;
  color: #1f1f1f;
}
.mnav__close svg {
  width: 100%;
  height: 100%;
  display: block;
}

/* Drawer */
.mnav__scrim {
  position: fixed;
  inset: 0;
  z-index: 130;
  background: rgba(20, 20, 20, 0.4);
}

.drawer {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 224px;
  max-width: 80vw;
  z-index: 140;
  background: var(--fill-background);
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.18);
}

.drawer__brand {
  width: 128px;
}

.drawer__squiggle {
  width: 80%;
  margin-top: 6px;
}

.drawer__links {
  list-style: none;
  margin: 0;
  padding: 60px 0 0;
  display: flex;
  flex-direction: column;
  gap: 35px;
}

.drawer__link {
  font-family: 'Archivo', sans-serif;
  font-weight: 600;
  font-size: 20px;
  color: var(--red);
  display: block;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.3s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(-100%);
}

.scrim-enter-active,
.scrim-leave-active {
  transition: opacity 0.3s ease;
}
.scrim-enter-from,
.scrim-leave-to {
  opacity: 0;
}
</style>
