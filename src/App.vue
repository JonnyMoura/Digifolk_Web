<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import MobileNav from '@/components/MobileNav.vue'

const route = useRoute()
// Detail pages show a ✕ (close → back) in the mobile top bar.
const showClose = computed(() =>
  ['scientific-project', 'educational-material'].includes(route.name),
)
</script>

<template>
  <MobileNav :show-close="showClose" />
  <RouterView />
</template>
