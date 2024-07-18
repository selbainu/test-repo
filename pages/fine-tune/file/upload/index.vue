<template>
  <div v-if="!store.currentAccount" class="flex items-center justify-center px-6 py-8 mx-auto h-screen">
    <Login/>
  </div>
  <div v-else-if="store.currentAccount.status === 'staged'" class="h-screen w-full flex flex-col justify-center items-center">
    <Staging/>
  </div>
  <div v-else-if="store.currentAccount.status === 'suspended'" class="h-screen w-full flex flex-col justify-center items-center">
    <Unauthorized/>
  </div>
  <div v-else class="relative overflow-x-auto flex flex-col items-center justify-center">
    <div class="mt-44 mb-5 relative flex flex-col items-start justify-center w-full max-w-screen-md">
      <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      @drag.stop.prevent @dragstart.stop.prevent @dragend.stop.prevent @dragover.stop.prevent @dragenter.stop.prevent @dragleave.stop.prevent @drop.stop.prevent="upload($event)">
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
          <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
          </svg>
          <div v-if="!currentJSONL" class="flex flex-col items-center justify-center">
            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span class="font-semibold">
                Click to upload
              </span>
              or drag and drop
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Only JSONL files are accepted
            </p>
          </div>
          <div v-else class="text-gray-500 dark:text-gray-400">
            {{ currentJSONL.name }}
          </div>
        </div>
        <input id="dropzone-file" type="file" accept=".jsonl" class="hidden" @change="upload($event)"/>
      </label>
      <div class="mt-5 w-full flex justify-center space-x-5">
        <button @click="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-75 dark:disabled:opacity-50" :disabled="isSaving || !currentJSONL">
          Upload
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useContentsStore } from '~/store/contents'

const store = useContentsStore()
const currentJSONL = ref()
const isSaving = ref(false)

function upload(event) {
  let input
  if (event.type === 'drop') {
    input = event.dataTransfer.files[0]
  } else if (event.type === 'change') {
    input = event.target.files[0]
  }
  if (input) {
    if (input.name.split('.').pop() === 'jsonl') {
      currentJSONL.value = input
    } else {
      store.toasts.push({
        type: 'warning',
        id: store.getID(),
        body: 'Invalid file type.',
      })
      return
    }
  }
}

function submit() {
  if (!isSaving.value) {
    isSaving.value = true
    store.createFile('files', 'create', { file: currentJSONL.value, purpose: 'fine-tune' }).then((response) => {
      currentJSONL.value = null
      isSaving.value = false
      store.toasts.push({
        type: 'success',
        id: store.getID(),
        body: 'File uploaded successfully.',
      })
    }).catch((e) => {
      console.log(e)
      isSaving.value = false
      store.toasts.push({
        type: 'error',
        id: store.getID(),
        body: `${e.code}: ${e.message}`
      })
    })
  }
}

</script>