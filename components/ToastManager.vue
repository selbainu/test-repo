<template>
  <div class="fixed right-5 bottom-5 z-40">
    <div v-for="toast in store.toasts" :key="toast" class="flex items-center w-72 max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
      <Toast :toast="toast"/>
    </div>
  </div>
</template>

<script setup>
import { useContentsStore } from '~/store/contents'

const store = useContentsStore()

</script>