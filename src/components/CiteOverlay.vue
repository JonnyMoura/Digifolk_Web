<script setup>
// Citation overlay. Desktop = centred modal (Figma "Group 26"); mobile = a
// drawer that slides up from the bottom (Figma "overlay cite").
defineProps({ open: { type: Boolean, default: false } })
const emit = defineEmits(['close'])

const citations = [
  {
    label: 'MLA',
    text: 'Jiménez-Bravo, Diego M., et al. "Identifying Irish traditional music genres using latent audio representations." IEEE Access 12 (2024): 92536-92548.',
  },
  {
    label: 'APA',
    text: 'Jiménez-Bravo, D. M., Murciego, A. L., Navarro-Caceres, J. J., Navarro-Cáceres, M., & Harkin, T. (2024). Identifying Irish traditional music genres using latent audio representations. IEEE Access, 12, 92536-92548.',
  },
  {
    label: 'ISO 690',
    text: 'JIMÉNEZ-BRAVO, Diego M., et al. Identifying Irish traditional music genres using latent audio representations. IEEE Access, 2024, 12: 92536-92548.',
  },
]
</script>

<template>
  <transition name="cite">
    <div v-if="open" class="cite" @click.self="emit('close')">
      <div class="cite__panel" role="dialog" aria-modal="true" aria-label="Cite this work">
        <button class="cite__close" aria-label="Close" @click="emit('close')">×</button>

        <dl class="cite__list">
          <div v-for="c in citations" :key="c.label" class="cite__row">
            <dt class="cite__label">{{ c.label }}</dt>
            <dd class="cite__text">{{ c.text }}</dd>
          </div>
        </dl>

        <button type="button" class="cite__bibtex">BibTex</button>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.cite {
  position: fixed;
  inset: 0;
  /* Higher than MaterialInfoOverlay's z-index: 300 — Cite can now be opened
     from the "Cite" button inside that overlay, so both can be open at once
     and this one needs to render on top. */
  z-index: 310;
  background: rgba(20, 20, 20, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.cite__panel {
  position: relative;
  width: 100%;
  max-width: 760px;
  max-height: 82vh;
  overflow-y: auto;
  background: var(--color-gray);
  border-radius: 45px;
  padding: 40px 48px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.cite__close {
  align-self: flex-start;
  font-size: 30px;
  line-height: 1;
  color: #000;
  margin-bottom: 6px;
}

.cite__list {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.cite__row {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 24px;
  align-items: start;
}

.cite__label {
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: #000;
}

.cite__text {
  margin: 0;
  font-family: 'Roboto Mono', monospace;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.5;
  color: #000;
}

.cite__bibtex {
  align-self: flex-start;
  font-family: 'Archivo', sans-serif;
  font-weight: 400;
  font-size: 22px;
  color: #000;
}

/* transitions: subtle rise on desktop, full slide-up on mobile */
.cite-enter-active,
.cite-leave-active {
  transition: opacity 0.3s ease;
}
.cite-enter-active .cite__panel,
.cite-leave-active .cite__panel {
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.cite-enter-from,
.cite-leave-to {
  opacity: 0;
}
.cite-enter-from .cite__panel,
.cite-leave-to .cite__panel {
  transform: translateY(40px);
}

/* Mobile: bottom drawer */
@media (max-width: 700px) {
  .cite {
    align-items: flex-end;
    padding: 0;
  }
  .cite__panel {
    max-width: none;
    max-height: 80vh;
    border-radius: 30px 30px 0 0;
    padding: 28px 26px 30px;
  }
  .cite-enter-from .cite__panel,
  .cite-leave-to .cite__panel {
    transform: translateY(100%);
  }
}
</style>
