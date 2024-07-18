<template>
  <div v-if="currentDialog" class="z-10 fixed top-0 flex items-center justify-center px-6 py-8 mx-auto h-screen w-full bg-gray-900 bg-opacity-50 dark:bg-opacity-80">
    <div class="relative p-4 w-full max-w-md">
      <div class="relative p-6 bg-white rounded-lg dark:bg-gray-800 text-left drop-shadow-2xl">
        <p class="mb-2 font-bold text-gray-900 dark:text-white text-lg">
          {{ currentDialog.header }}
        </p>
        <p class="mb-6 text-gray-700 dark:text-gray-400">
          {{ currentDialog.description }}
        </p>
        <div class="flex justify-start items-center space-x-4">
          <button @click="cancel" class="p-2.5 text-sm font-medium text-gray-500 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
            {{ currentDialog.buttons ? currentDialog.buttons.fail : 'No, cancel' }}
          </button>
          <button @click="confirm" class="p-2.5 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">
            {{ currentDialog.buttons ? currentDialog.buttons.success : 'Yes, I\'m sure' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useContentsStore } from '~/store/contents'

const store = useContentsStore()

const isSaving = ref(false)
const currentDialog = ref(null)

function cancel() {
  if (!isSaving.value) {
    isSaving.value = true
    store.dialog = null
    isSaving.value = false
  }
}

function confirm() {
  if (!isSaving.value) {
    isSaving.value = true
    if (currentDialog.value.options) {
      currentDialog.value.callback(...Object.values(currentDialog.value.options))
    } else {
      currentDialog.value.callback()
    }
    store.dialog = null
    isSaving.value = false
  }
}

watch(() => store.dialog, (dialog) => {
  currentDialog.value = dialog
})
</script>