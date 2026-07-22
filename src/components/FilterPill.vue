<script setup>
defineProps({
  label: { type: String, required: true },
  active: { type: Boolean, default: false },
})
defineEmits(['click'])
</script>

<template>
  <button
    type="button"
    class="filter-pill"
    :class="{ 'filter-pill--active': active }"
    :aria-pressed="active"
    @click="$emit('click')"
  >
    {{ label }}
  </button>
</template>

<style scoped>
.filter-pill {
  border: 1px solid #000;
  border-radius: 45px;
  padding: 8px 20px;
  font-family: 'Archivo', sans-serif;
  font-weight: 400;
  font-size: var(--fs-pill);
  color: #000;
  background: transparent;
  transition: background 0.2s ease, color 0.2s ease;
}

.filter-pill--active {
  background: #000;
  color: var(--fill-background);
}
</style>
