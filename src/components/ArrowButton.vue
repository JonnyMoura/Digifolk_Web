<script setup>
import { computed } from 'vue'

// Bold navigation arrow. 'left' = back (detail pages / about),
// 'right' = forward/submit (contribute form).
const props = defineProps({
  direction: { type: String, default: 'left' },
  size: { type: Number, default: 40 },
  ariaLabel: { type: String, default: 'Go back' },
})

const d = computed(() =>
  props.direction === 'right'
    ? 'M8 20 H32 M24 12 L32 20 L24 28'
    : 'M32 20 H8 M16 12 L8 20 L16 28',
)
</script>

<template>
  <button type="button" class="arrow-btn" :style="{ width: size + 'px', height: size + 'px' }" :aria-label="ariaLabel">
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path :d="d" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </button>
</template>

<style scoped>
.arrow-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #000;
  transition: color 0.2s ease;
}

.arrow-btn:hover {
  color: #9a9a9a;
}

.arrow-btn svg {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
