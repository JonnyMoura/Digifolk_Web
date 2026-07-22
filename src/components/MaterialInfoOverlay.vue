<script setup>
import { useRouter } from 'vue-router'
import PillButton from './PillButton.vue'

// Figma "Overlay_material_info": slides in from the right edge of the screen.
// Default variant = just the abstract. Variant2 (used when a material's tag
// is "Module") also lists the module's lessons below a short divider.
const props = defineProps({
  open: { type: Boolean, default: false },
  body: { type: String, default: '' },
  lessons: { type: Array, default: () => [] },
  // Same tag/link + citation the gallery card exposes, surfaced here too so
  // the user doesn't have to close the overlay to reach either one.
  type: { type: String, default: '' },
  to: { type: [String, Object], default: null },
  authors: { type: String, default: '' },
})
const emit = defineEmits(['close', 'cite'])
const router = useRouter()

function goToDetail() {
  if (props.to) router.push(props.to)
}
</script>

<template>
  <transition name="material-overlay">
    <div v-if="open" class="material-overlay" @click.self="emit('close')">
      <div class="material-overlay__panel" role="dialog" aria-modal="true" aria-label="Material info">
        <button class="material-overlay__close" aria-label="Close" @click="emit('close')">×</button>

        <span v-if="authors" class="material-overlay__authors">{{ authors }}</span>

        <p class="material-overlay__body">{{ body }}</p>

        <div class="material-overlay__actions">
          <PillButton
            v-if="type && type.toLowerCase() !== 'module' && to"
            :label="type"
            :icon="type.toLowerCase() === 'lesson' ? 'doc' : 'arrow'"
            small
            @click="goToDetail"
          />
          <PillButton label="Cite" icon="quote" small @click="emit('cite')" />
        </div>

        <div v-if="lessons.length" class="material-overlay__lessons">
          <span class="material-overlay__divider" />
          <div class="material-overlay__lesson-row">
            <PillButton v-for="(lesson, i) in lessons" :key="i" :label="lesson" icon="doc" small />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.material-overlay {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(20, 20, 20, 0.4);
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
}

.material-overlay__panel {
  position: relative;
  width: min(480px, 100%);
  height: 100vh;
  overflow: hidden;
  background: var(--fill-background);
  
  box-shadow: -15px 0 50px 10px rgba(0, 0, 0, 0.25);
  padding: 24px 30px 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.material-overlay__close {
  align-self: flex-start;
  font-size: 30px;
  line-height: 1;
  color: #000;
}

.material-overlay__authors {
     align-self: flex-start;
    max-width: 100%;
    /* padding: 6px 14px; */
    border-radius: 20px;
    /* background: rgba(0, 0, 0, 0.06); */
    font-family: 'Roboto Mono', monospace;
    font-weight: 500;
    font-size: 12px;
    letter-spacing: 0.02em;
    line-height: 1.4;
    color: #333;
}

.material-overlay__body {
  margin: 0;
  font-family: 'Josefin Slab', serif;
  font-weight: 400;
  font-size: 13px;
  line-height: 1.4;
  color: #000;
}

.material-overlay__actions {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 10px;
}

.material-overlay__lessons {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
}

.material-overlay__divider {
  width: 134px;
  height: 1px;
  background: rgba(0, 0, 0, 0.3);
}

/* The pills themselves are the row — kept out of the same flex line as the
   divider (which is a fixed 134px-wide rule, not meant to share row space
   with the buttons) and wrapped so a panel-width's worth of lessons doesn't
   squeeze/clip the pills against the panel's overflow:hidden edge. */
.material-overlay__lesson-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

/* slide in from the right */
.material-overlay-enter-active,
.material-overlay-leave-active {
  transition: opacity 0.3s ease;
}
.material-overlay-enter-active .material-overlay__panel,
.material-overlay-leave-active .material-overlay__panel {
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.material-overlay-enter-from,
.material-overlay-leave-to {
  opacity: 0;
}
.material-overlay-enter-from .material-overlay__panel,
.material-overlay-leave-to .material-overlay__panel {
  transform: translateX(100%);
}

@media (max-width: 700px) {
  .material-overlay__panel {
    width: 100%;
    border-radius: 0;
  }
}
</style>
