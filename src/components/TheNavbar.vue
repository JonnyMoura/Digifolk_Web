<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import BrandLogo from './BrandLogo.vue'
import SquiggleLine from './SquiggleLine.vue'

// accent: 'green' (scientific/educational), 'red' (main/visualisations),
// 'purple' (contribute/login).
const props = defineProps({
  accent: { type: String, default: 'purple' },
})

const accentColor = computed(() => {
  if (props.accent === 'green') return 'var(--green)'
  if (props.accent === 'red') return 'var(--red)'
  return 'var(--purple)'
})

// Solid at rest so it reads clearly. Hides itself (fades + slides up) while
// the user scrolls down, out of the way of the content beneath it, and
// fades back in — fully opaque/"clear" again — the moment they scroll back
// up. Direction is what matters, not how far down the page they are.
const NAVBAR_REVEAL_THRESHOLD = 40 // px of scroll before hiding kicks in, so the very top of a page always shows it
const navbarHidden = ref(false)
let lastScrollY = 0
function updateNavbarVisibility() {
  const y = window.scrollY
  if (y <= NAVBAR_REVEAL_THRESHOLD) {
    navbarHidden.value = false
  } else if (y > lastScrollY) {
    navbarHidden.value = true // scrolling down
  } else if (y < lastScrollY) {
    navbarHidden.value = false // scrolling up
  }
  lastScrollY = y
}
onMounted(() => {
  lastScrollY = window.scrollY
  window.addEventListener('scroll', updateNavbarVisibility, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateNavbarVisibility)
})

const links = [
  { label: 'SCIENTIFIC MATERIALS', to: '/scientific-materials' },
  { label: 'EDUCATIONAL MATERIALS', to: '/educational-materials' },
  { label: 'VISUALISATIONS', to: '/visualisations' },
  {
    label: 'CONTRIBUTIONS',
    to: '/contribute',
    children: [
      { label: 'Pieces', to: '/pieces' },
      { label: 'Collections', to: '/collections' },
      { label: 'New contribution', to: '/contribute' },
    ],
  },
  { label: 'ABOUT', to: '/about' },
]
</script>

<template>
  <header class="navbar" :class="{ 'navbar--hidden': navbarHidden }" :style="{ color: accentColor }">
    <div class="navbar__inner">
      <RouterLink to="/" class="navbar__logo" aria-label="Home">
        <BrandLogo :size="30" />
      </RouterLink>

      <nav class="navbar__links">
        <template v-for="link in links" :key="link.to">
          <!-- Item with a hover dropdown (Contribute → Pieces / Collections) -->
          <div v-if="link.children" class="nav-item nav-dd">
            <RouterLink :to="link.to" class="nav-item__label nav-dd__label" active-class="nav-dd__label--active">
              {{ link.label }}
            </RouterLink>
            <div class="nav-dd__panel">
              <RouterLink v-for="c in link.children" :key="c.to" :to="c.to" class="nav-dd__opt">
                {{ c.label }}
              </RouterLink>
            </div>
          </div>

          <!-- Normal item with the squiggle line animation -->
          <RouterLink v-else :to="link.to" class="nav-item" active-class="nav-item--active">
            <span class="nav-item__label">{{ link.label }}</span>
            <span class="nav-item__underline">
              <SquiggleLine color="currentColor" :count="12" :height="8" />
            </span>
          </RouterLink>
        </template>
      </nav>

      <RouterLink to="/login" class="nav-item nav-item--login" active-class="nav-item--active">
        <span class="nav-item__label">LOGIN</span>
        <span class="nav-item__underline">
          <SquiggleLine color="currentColor" :count="12" :height="8" />
        </span>
      </RouterLink>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  padding: 16px 48px 4px;
  background: rgba(250, 249, 246, 0.88);
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.navbar--hidden {
  opacity: 0;
  transform: translateY(-16px);
  pointer-events: none;
}

.navbar__inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 128px;
}

.navbar__logo {
  flex: 0 0 auto;
  display: block;
  margin-right: 44px;
  color: inherit;
  transition: color 0.2s ease;
}

.navbar__logo:hover {
  color: var(--yellow);
}

.navbar__links {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  /* Nav item labels reserve invisible space below themselves for the hover
     underline (gap 4px + 10px height), so align-items:center on
     .navbar__inner centers that whole box rather than just the visible
     label — the labels end up ~7px above the logo's center. Nudge the text
     down (not the logo) to meet it, per design feedback. */
  position: relative;
  top: 7px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: inherit;
}

/* Contribute dropdown -------------------------------------------------- */
/* padding-bottom matches the squiggle underline (gap 4 + height 10) so the
   label sits at the same height as the other nav items. */
.nav-dd {
  position: relative;
  padding-bottom: 14px;
}
.nav-dd__label {
  color: inherit;
  cursor: pointer;
}
.nav-dd:hover .nav-dd__label,
.nav-dd__label--active {
  color: var(--yellow);
}
.nav-dd__panel {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(6px);
  display: flex;
  flex-direction: column;
  min-width: 160px;
  padding: 10px;
  background: var(--fill-background);
  border-radius: 16px;
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.16);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, transform 0.2s ease;
  z-index: 20;
}
.nav-dd:hover .nav-dd__panel {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}
.nav-dd__opt {
  display: block;
  padding: 9px 14px;
  border-radius: 10px;
  font-family: 'Archivo', sans-serif;
  font-weight: 400;
  font-size: 15px;
  color: #000;
  white-space: nowrap;
  transition: background 0.2s ease, color 0.2s ease;
}
.nav-dd__opt:hover {
  background: rgba(216, 216, 216, 0.4);
  color: var(--yellow);
}

.nav-item__label {
  font-family: 'Archivo', sans-serif;
  font-weight: 400;
  font-size: var(--fs-nav);
  line-height: 1.1;
  text-align: center;
  white-space: pre-line;
}

.nav-item--login {
  flex: 0 0 auto;
  max-width: 80px;
  /* Same down-nudge as .navbar__links, see comment there. */
  position: relative;
  top: 7px;
}

.nav-item--login .nav-item__label {
  font-weight: 200;
}

/* Figma "Line Animation": a squiggle revealed left→right by a mask over 600ms. */
.nav-item__underline {
  display: block;
  width: 100%;
  height: 10px;
  clip-path: inset(0 100% 0 0);
  transition: clip-path 0.6s ease;
}

.nav-item:hover .nav-item__underline {
  clip-path: inset(0 0 0 0);
}

/* Typography turns yellow on hover (line animation colour). The active/current
   page also stays yellow, but without the underline — that's reserved for hover. */
.nav-item:hover,
.nav-item--active {
  color: var(--yellow);
}

@media (max-width: 1080px) {
  .navbar {
    padding: 14px 28px 10px;
  }
  .navbar__inner {
    gap: 26px;
  }
  .navbar__links {
    gap: 16px;
  }
  .nav-item__label {
    font-size: 13px;
  }
}

/* Wrap the links onto a second row on tablets/phones. */
@media (max-width: 820px) {
  .navbar__inner {
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px 20px;
  }
  .navbar__logo {
    margin-right: auto;
  }
  .navbar__links {
    flex: 1 1 100%;
    order: 3;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px 18px;
  }
  .nav-item--login {
    order: 2;
  }
}

@media (max-width: 540px) {
  .navbar {
    padding: 12px 18px 8px;
  }
  .nav-item__label {
    font-size: 12px;
  }
  .nav-item__underline {
    min-width: 60px;
    height: 7px;
  }
}

/* Mobile uses the hamburger top bar instead of this navbar. */
@media (max-width: 700px) {
  .navbar {
    display: none;
  }
}
</style>
