<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Search' },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <label class="search">
    <svg class="search__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" />
      <path d="M20 20 L16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
    <input
      class="search__input"
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </label>
</template>

<style scoped>
.search {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  width: min(360px, 100%);
  padding: 10px 20px;
  border-radius: 21px;
  background: var(--color-gray);
}
.search__icon {
  flex: 0 0 auto;
  width: 18px;
  height: 18px;
  color: #000;
}
.search__input {
  width: 100%;
  border: none;
  background: none;
  outline: none;
  font-family: 'Roboto Mono', monospace;
  font-size: var(--fs-field);
  color: rgba(0, 0, 0, 0.7);
}
.search__input::placeholder {
  color: rgba(0, 0, 0, 0.7);
}
</style>
