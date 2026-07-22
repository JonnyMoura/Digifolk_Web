<script setup>
// Desktop: red navbar + hero banner. Mobile: red "EA DigiFolk" wordmark +
// hero banner (Figma "main page phone"). Hero hosts the folk-pieces bubble visualisation.
import TheNavbar from '@/components/TheNavbar.vue'
import BottomBar from '@/components/BottomBar.vue'
import BrandWordmark from '@/components/BrandWordmark.vue'
import MainPageVisualisation from '@/components/main-page-vis/MainPageVisualisation.vue'
</script>

<template>
  <div class="page home-page">
    <TheNavbar accent="red" />

    <main class="home">
      <div class="home__wordmark"><BrandWordmark /></div>

      <div class="home__hero">
        <MainPageVisualisation />
      </div>
    </main>

    <BottomBar accent="red" />
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
}

.home {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* .page's padding-bottom reserves bottombar-height + 40px (see style.css);
     that extra 40px must be subtracted here too, or this page's total content
     height exceeds 100vh by 40px, forcing a vertical scrollbar — which in turn
     makes width:100vw (below) wider than the now-narrower visible viewport,
     causing a horizontal scrollbar as well. */
  min-height: calc(100vh - var(--navbar-height) - var(--bottombar-height) - 40px);
}

/* Wordmark only shows on mobile (desktop has the navbar). */
.home__wordmark {
  display: none;
  color: var(--red);
  width: 86%;
  max-width: 320px;
  margin-bottom: 24px;
}

/* Full-bleed: break out of .page's side padding so the visualisation spans
   the entire viewport width instead of sitting in a boxed container.
   .home already centers its children via align-items:center, which alone
   correctly centers a too-wide child on the viewport here (the page's left/
   right padding is symmetric) — adding a left/transform offset on top of
   that double-corrects and shifts it off-center, so width:100vw is enough. */
.home__hero {
  position: relative;
  width: 100vw;
  flex: 1 1 auto;
  min-height: 0;
}

@media (max-width: 700px) {
  .home {
    justify-content: flex-start;
    padding-top: 10px;
  }
  .home__wordmark {
    display: block;
  }
}
</style>
