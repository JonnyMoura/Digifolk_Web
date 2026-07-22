<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TheNavbar from '@/components/TheNavbar.vue'
import BottomBar from '@/components/BottomBar.vue'
import SquiggleLine from '@/components/SquiggleLine.vue'
import PillButton from '@/components/PillButton.vue'
import { vizPlot, vizMapEmotions } from '@/assets/images.js'

gsap.registerPlugin(ScrollTrigger)

const VIZ_BODY =
  'Irish traditional music contains a variety of features that help to understand the cultural idiosyncrasies of Irish people. One of the most prominent aspects is genre, which provides information on the musical structure, the composition’s essence and, in turn, offers insights into the cultural nuances and behaviors inherent to a particular community.'

// Each item is either a static image (`img`) or a short looping clip
// (`video`) — eventually every card will have its own video, for now only
// one does, so the rest keep their placeholder image.
const vizItems = [
  { id: 1, title: 'Visualização 1', author: 'Autor 1', body: VIZ_BODY, img: vizPlot },
  { id: 2, title: 'Visualização 2', author: 'Autor 1', body: VIZ_BODY, img: vizMapEmotions },
  { id: 3, title: 'Visualização 3', author: 'Autor 2', body: VIZ_BODY, video: '/videos/visualisation-demo.mp4' },
]

// Mobile carousel state
const index = ref(0)
const active = computed(() => vizItems[index.value])
function prev() {
  index.value = (index.value - 1 + vizItems.length) % vizItems.length
}
function next() {
  index.value = (index.value + 1) % vizItems.length
}

// Desktop: pinned full-width section — scrolling through it crossfades
// from one visualisation window to the next.
const pinWrapRef = ref(null)
const pinRef = ref(null)
const windowRefs = ref([])
let ctx

onMounted(async () => {
  await nextTick()

  ctx = gsap.context(() => {
    ScrollTrigger.matchMedia({
      '(min-width: 701px)': () => {
        const windows = windowRefs.value
        // autoAlpha (opacity + visibility) instead of plain opacity: every
        // window is stacked with inset:0 on top of the others, and opacity:0
        // alone still receives hover/click — without visibility:hidden, the
        // last window in DOM order always sat on top and ate every hover
        // regardless of which one was actually visible on screen.
        gsap.set(windows.slice(1), { autoAlpha: 0 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinWrapRef.value,
            start: 'top top',
            end: () => `+=${(windows.length - 1) * window.innerHeight}`,
            pin: pinRef.value,
            scrub: 1,
          },
        })

        windows.forEach((el, i) => {
          if (i === 0) return
          tl.to(windows[i - 1], { autoAlpha: 0, duration: 1 }, i - 1).to(el, { autoAlpha: 1, duration: 1 }, i - 1)
        })

        return () => {
          gsap.set(windows, { clearProps: 'opacity,visibility' })
        }
      },
    })
  })
})

onBeforeUnmount(() => {
  ctx?.revert()
})
</script>

<template>
  <div class="page">
    <TheNavbar accent="red" />

    <main class="page__inner viz">
      <header class="viz__head">
        <h1 class="viz__title">Visualisations</h1>
        <div class="viz__squiggle"><SquiggleLine color="var(--red)" /></div>
        <p class="viz__subtitle">Works selected by DigiFolk Team</p>
      </header>

      <!-- Desktop: full-width pinned section, scroll crossfades between windows -->
      <section ref="pinWrapRef" class="viz__pin-wrap">
        <div ref="pinRef" class="viz__pin">
          <article
            v-for="(v, i) in vizItems"
            :key="v.id"
            ref="windowRefs"
            class="viz-window"
          >
            <video v-if="v.video" class="viz-window__img" :src="v.video" autoplay loop muted playsinline></video>
            <img v-else class="viz-window__img" :src="v.img" alt="Visualisation" />
            <div class="viz-window__tint"></div>
            <div class="viz-window__caption">
              <div class="viz-window__left">
                <div class="viz-window__head">
                  <h2 class="viz-window__name">{{ v.title }}</h2>
                  <p class="viz-window__author">{{ v.author }}</p>
                </div>

                <PillButton label="More Info" icon="arrow" accent="red" small />
              </div>
              <p class="viz-window__body">{{ v.body }}</p>
            </div>
          </article>
        </div>
      </section>

      <!-- Mobile: a single carousel card; title/author/body/chevrons always visible -->
      <section class="viz__carousel">
        <article class="vizm">
          <video v-if="active.video" class="vizm__bg" :src="active.video" autoplay loop muted playsinline></video>
          <img v-else class="vizm__bg" :src="active.img" alt="Visualisation" />
          <div class="vizm__tint"></div>
          <div class="vizm__content">
            <div class="vizm__head">
              <h2 class="vizm__name">{{ active.title }}</h2>
              <p class="vizm__author">{{ active.author }}</p>
            </div>
            <div class="vizm__nav">
              <button class="vizm__chev" aria-label="Previous" @click="prev">
                <svg viewBox="0 0 24 24" fill="none"><path d="M15 5 L8 12 L15 19" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </button>
              <button class="vizm__chev" aria-label="Next" @click="next">
                <svg viewBox="0 0 24 24" fill="none"><path d="M9 5 L16 12 L9 19" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </button>
            </div>
            <div class="vizm__foot">
              <p class="vizm__body">{{ active.body }}</p>
              <PillButton label="More Info" icon="arrow" accent="red" small />
            </div>
          </div>
        </article>
      </section>
    </main>

    <BottomBar accent="red" />
  </div>
</template>

<style scoped>
.viz__head {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-bottom: 12px;
}

.viz__title {
  font-family: 'Roboto Mono', monospace;
  font-weight: 700;
  font-size: var(--fs-h1);
  color: #000;
  margin: 0;
}

.viz__squiggle {
  width: min(520px, 100%);
}

.viz__subtitle {
  font-family: 'Roboto Mono', monospace;
  font-weight: 400;
  font-size: var(--fs-subtitle);
  color: #000;
  margin: 0;
}

/* Desktop pinned full-width section ---------------------------------- */
/* Full-bleed: break out of .page's side padding to span the viewport.
   Uses a margin (not transform) to shift — GSAP's pin sets the inner
   .viz__pin to position:fixed, and a `transform` on this ancestor would
   create a new containing block for it, breaking the fixed positioning. */
.viz__pin-wrap {
  position: relative;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  height: 300vh;
}

.viz__pin {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.viz-window {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.viz-window__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
/* The caption used to only reveal on hover; it now always shows, appearing
   and disappearing together with its window as GSAP crossfades them on
   scroll, so the tint stays at its (darker, more legible) revealed level
   permanently instead of toggling on hover. */
.viz-window__tint {
  position: absolute;
  inset: 0;
  /*background: rgba(216, 216, 216, 0.6);*/
}
/* Anchored to the bottom only (not the full inset) so the extra-opacity
   backing below sits just behind the text, not over the whole image — the
   general .viz-window__tint above already handles the rest of the window. */
.viz-window__caption {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 28px;
  padding: 36px 60px;
  background: rgba(250, 249, 246, 0.8);
}
.viz-window__left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
}

.viz-window__head {
  gap: 4px;
  display: flex;
  flex-direction: column;
}
.viz-window__name {
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: var(--fs-viz-name);
  line-height: 1;
  margin: 0;
  color: #000;
}
.viz-window__author {
  font-family: 'Archivo', sans-serif;
  font-weight: 300;
  font-size: var(--fs-viz-author);
  margin: 0;
  padding: 0 0 20px;
  color: #000;
}
.viz-window__body {
  flex: 0 1 420px;
  max-width: 420px;
  font-family: 'Josefin Slab', serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 1.3;
  color: #000;
  margin: 0;
  text-align: justify;
}

/* Mobile carousel card --------------------------------------------- */
.viz__carousel {
  display: none;
}

.vizm {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  max-width: 100%;
  aspect-ratio: 345 / 609;
  border-radius: 25px;
  overflow: hidden;
}
.vizm__bg {
  position: absolute;
  max-width: none;
  width: 388.91%;
  height: 108.1%;
  left: -174.75%;
  top: -6.99%;
}
.vizm__tint {
  position: absolute;
  inset: 0;
  background: rgba(216, 216, 216, 0.5);
}
.vizm__content {
  position: absolute;
  inset: 0;
  padding: 30px 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.vizm__head {
  color: #000;
}
.vizm__name {
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 1;
  margin: 0;
}
.vizm__author {
  font-family: 'Archivo', sans-serif;
  font-weight: 300;
  font-size: 14px;
  margin: 4px 0 0;
}
.vizm__nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.vizm__chev {
  width: 30px;
  height: 30px;
  color: #1f1f1f;
}
.vizm__chev svg {
  width: 100%;
  height: 100%;
  display: block;
}
.vizm__foot {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}
.vizm__body {
  width: 58%;
  max-width: 190px;
  font-family: 'Josefin Slab', serif;
  font-weight: 600;
  font-size: 10px;
  line-height: 1.1;
  color: #000;
  margin: 0;
}

@media (max-width: 700px) {
  .viz {
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - var(--navbar-height) - var(--bottombar-height) - 40px);
  }
  .viz__head {
    align-items: center;
    text-align: center;
    flex: 0 0 auto;
  }
  .viz__squiggle {
    width: min(320px, 100%);
  }
  .viz__pin-wrap {
    display: none;
  }
  .viz__carousel {
    display: block;
    position: relative;
    flex: 1 1 auto;
    min-height: 0;
    margin-top: 8px;
  }
}
</style>
