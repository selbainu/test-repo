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
          <div v-if="!currentCSV" class="flex flex-col items-center justify-center">
            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span class="font-semibold">
                Click to upload
              </span>
              or drag and drop
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Only CSV files are accepted
            </p>
          </div>
          <div v-else class="text-gray-500 dark:text-gray-400">
            {{ currentCSV.name }}
          </div>
        </div>
        <input id="dropzone-file" type="file" accept=".csv" class="hidden" @change="upload($event)"/>
      </label>
      <div class="mt-5 w-full flex justify-center space-x-5">
        <button @click="convert" class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 disabled:opacity-75 dark:disabled:opacity-50" :disabled="isSaving || !currentCSV || currentJSONL">
          Convert
        </button>
        <button @click="download" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-75 dark:disabled:opacity-50" :disabled="isSaving || !currentJSONL">
          Download
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useContentsStore } from '~/store/contents'
import Papa from 'papaparse'

const store = useContentsStore()
const currentCSV = ref()
const currentJSONL = ref()
const isSaving = ref(false)

function upload(event) {
  currentJSONL.value = null
  let input
  if (event.type === 'drop') {
    input = event.dataTransfer.files[0]
  } else if (event.type === 'change') {
    input = event.target.files[0]
  }
  if (input) {
    if (input.type === 'text/csv') {
      currentCSV.value = input
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

function convert() {
  if (!isSaving.value) {
    isSaving.value = true
    if (!currentCSV.value) {
      store.toasts.push({
        type: 'warning',
        id: store.getID(),
        body: 'File failed to upload.',
      })
      isSaving.value = false
      return
    }
    if (currentJSONL.value) {
      store.toasts.push({
        type: 'warning',
        id: store.getID(),
        body: 'File already converted.',
      })
      isSaving.value = false
      return
    }
    let jsonStr = ''
    const systemPrompt = 'conversation'
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target.result
      const rows = Papa.parse(text, { delimiter: ',' })
      try {
        rows.data.forEach((row, index) => {
          if (systemPrompt === 'conversation' && index > 0) {
            const conversation = row[1].split('\n').filter((text) => text !== '')
            let userAssistantConv = ''
            jsonStr += '{"messages":[{"role": "system", "content": "' + row[0].replace(/[\r\n]/gm, '').replace(/"/g, "'") + '"}, '
            let temp
            for (let i = 0; i < conversation.length; i++) {        
              temp = conversation[i].replace(/\uFF1A/g, ': ').split(': ')
              if (i % 2 === 0) {
                userAssistantConv += '{"role": "user", "content": "' + temp[1].replace(/"/g, "'") + '"}'
              } else if (i % 2 === 1) {
                userAssistantConv += '{"role": "assistant", "content": "' + temp[1].replace(/"/g, "'") + '"}'
              }
              if (i + 1 !== conversation.length) {
                userAssistantConv += ', '
              }
            }
            jsonStr += userAssistantConv + ']}\n'
          }
        })
        currentJSONL.value = jsonStr
        isSaving.value = false
        store.toasts.push({
          type: 'success',
          id: store.getID(),
          body: 'File formatted successfully.',
        })
      } catch(e) {
        console.log(e)
        currentCSV.value = null
        isSaving.value = false
        store.toasts.push({
          type: 'error',
          id: store.getID(),
          body: `Invalid CSV ${e.code}: ${e.message}`
        })
      }
    }
    reader.readAsText(currentCSV.value)
  }
}

function download() {
  if (!isSaving.value) {
    isSaving.value = true
    try {
      const a = document.createElement('a')
      const file = new Blob([currentJSONL.value], { type: 'text/plaincharset=utf-8' })
      a.href = URL.createObjectURL(file)
      a.download = currentCSV.value.name.replace('.csv', '.jsonl')
      a.click()
      URL.revokeObjectURL(a.href)
      isSaving.value = false
    } catch(e) {
      console.log(e)
      isSaving.value = false
      store.toasts.push({
        type: 'error',
        id: store.getID(),
        body: `Invalid CSV ${e.code}: ${e.message}`
      })
    }
  }
}

</script>