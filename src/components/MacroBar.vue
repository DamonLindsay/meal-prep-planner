<template>
  <div class="mb-3">
    <div class="flex justify-between text-sm mb-1">
      <span>{{ label }}</span>
      <span class="text-gray-400">{{ value }} / {{ goal }} {{ unit }}</span>
    </div>
    <div class="w-full h-2 rounded-full bg-gray-700 overflow-hidden">
      <div
        class="h-full rounded-full transition-all duration-300"
        :style="{
          width: pct + '%',
          background: over ? '#E24B4A' : color
        }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  value: number
  goal: number
  unit: string
  color: string
}>()

const pct = computed(() => Math.min(100, Math.round((props.value / props.goal) * 100)))
const over = computed(() => props.value > props.goal)
</script>