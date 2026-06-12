<template>
  <div class="mb-4">
    <div class="flex justify-between text-sm mb-1">
      <span class="font-medium">{{ label }}</span>
      <span class="text-gray-400">{{ value }} / {{ goal }} {{ unit }}</span>
    </div>
    <div class="w-full rounded-full overflow-hidden" style="height: 10px; background: var(--ion-color-step-100)">
      <div
        class="h-full rounded-full transition-all duration-500"
        :style="{
          width: pct + '%',
          background: over ? overColor : color
        }"
      ></div>
    </div>
    <div class="flex justify-between text-xs mt-1">
      <span :class="over ? 'text-red-400' : 'text-gray-500'">
        {{ over ? '+' + (value - goal) + ' ' + unit + ' over' : pct + '% of goal' }}
      </span>
      <span class="text-gray-600">{{ goal }} {{ unit }} goal</span>
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
  overColor: string
}>()

const pct = computed(() => Math.min(100, Math.round((props.value / props.goal) * 100)))
const over = computed(() => props.value > props.goal)
</script>