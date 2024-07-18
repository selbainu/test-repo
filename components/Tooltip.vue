<template>
  <div v-if="currentTooltip" class="absolute z-20 inline-block text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 transition-opacity duration-300 border border-gray-200 rounded-lg shadow-sm opacity-100 w-72 dark:border-gray-600"
  :style="{
    left: `${currentTooltip ? currentTooltip.coor.x : '0'}px`,
    top: `${currentTooltip ? currentTooltip.coor.y + 20 : '0'}px`,
  }">
    <div class="p-3 space-y-2">
      <h3 class="font-semibold text-gray-900 dark:text-white">
        {{ currentTooltip.tooltip.title }}
      </h3>
      <p>
        {{ currentTooltip.tooltip.description }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { useContentsStore } from '~/store/contents'

const store = useContentsStore()
const currentTooltip = ref(null)

watch(() => store.tooltip, (tooltip) => {
  currentTooltip.value = tooltip
})
</script>