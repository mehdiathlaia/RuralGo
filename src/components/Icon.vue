<template>
  <svg
    :class="['mdi-icon', sizeClass]"
    :style="{ color, width: sizePixels, height: sizePixels }"
    viewBox="0 0 24 24"
  >
    <path :d="iconPath" fill="currentColor" />
  </svg>
</template>

<script setup>
import { computed } from 'vue';
import * as mdiJs from '@mdi/js';

const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  size: {
    type: [String, Number],
    default: 'md'
  },
  color: {
    type: String,
    default: 'currentColor'
  }
});

const sizeMap = {
  'xs': 16,
  'sm': 20,
  'md': 24,
  'lg': 32,
  'xl': 40,
  '2xl': 48
};

const sizePixels = computed(() => {
  const size = props.size;
  if (typeof size === 'number') return `${size}px`;
  return `${sizeMap[size] || 24}px`;
});

const sizeClass = computed(() => {
  return `mdi-${props.size}`;
});

const iconPath = computed(() => {
  const iconKey = `mdi${props.icon.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}`;
  return mdiJs[iconKey] || mdiJs.mdiAlert;
});
</script>

<style scoped>
.mdi-icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}
</style>
