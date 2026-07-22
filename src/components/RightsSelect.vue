<script setup>
import { ref } from 'vue'

// Rights dropdown matching the original Contribute page.
defineProps({ modelValue: { type: String, default: '' } })
const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const options = ['All rights reserved', 'CC BY', 'CC BY-SA', 'CC BY-NC', 'Public Domain']
function pick(o) {
  emit('update:modelValue', o)
  open.value = false
}
</script>

<template>
  <div class="rsel">
    <button type="button" class="rsel__field" @click="open = !open">
      <span :class="{ 'rsel__ph': !modelValue }">{{ modelValue || 'Rights' }}</span>
      <svg class="rsel__chev" :class="{ 'rsel__chev--up': open }" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M5 8 L10 13 L15 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <ul v-if="open" class="rsel__menu">
      <li v-for="o in options" :key="o">
        <button type="button" @click="pick(o)">{{ o }}</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.rsel {
  position: relative;
}
.rsel__field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 44px;
  padding: 10px 22px;
  border-radius: 45px;
  background: var(--color-gray);
  font-family: 'Roboto Mono', monospace;
  font-size: var(--fs-field);
  color: #000;
  cursor: pointer;
  text-align: left;
}
.rsel__ph {
  opacity: 0.85;
}
.rsel__chev {
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
  color: #000;
  transition: transform 0.2s ease;
}
.rsel__chev--up {
  transform: rotate(180deg);
}
.rsel__menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  z-index: 20;
  margin: 0;
  padding: 8px;
  list-style: none;
  background: var(--color-gray);
  border-radius: 22px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
}
.rsel__menu li button {
  display: block;
  width: 100%;
  text-align: left;
  padding: 9px 16px;
  border-radius: 16px;
  font-family: 'Roboto Mono', monospace;
  font-size: var(--fs-field);
  color: #000;
}
.rsel__menu li button:hover {
  background: rgba(255, 255, 255, 0.55);
}
</style>
