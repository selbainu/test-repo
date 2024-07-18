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
    <div class="mt-44 relative justify-center w-full max-w-screen-md">
      <div v-if="!store.currentEvaluation && currentSummary.length === 0 && currentTable.length === 0" class="mb-6">
        <label for="model" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">CSV Evaluation Result</label>
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
          <input id="dropzone-file" type="file" accept=".csv" class="hidden" @change="upload($event)" :disabled="isSaving"/>
        </label>
        <button class="mt-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-75 dark:disabled:opacity-50" @click="display" :disabled="isSaving || !currentCSV">
          Display
        </button>
      </div>
      <UDropdown :items="allowedViews()" :popper="{ placement: 'bottom-start' }" v-else>
        <UButton color="transparent" class="capitalize p-2.5 text-gray-900 dark:text-white text-lg rounded-lg w-full hover:bg-gray-100 dark:hover:bg-gray-800" :label="currentView" trailing-icon="i-heroicons-chevron-down-20-solid" />
      </UDropdown>
    </div>
    <div class="mt-2 overflow-x-scroll relative justify-center w-full max-w-screen-md bg-white dark:bg-gray-800 rounded-t-lg shadow">
      <table v-if="currentView === 'summary' && currentSummary && currentSummary.length > 0" class="mb-6 w-full table-fixed text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
          <tr>
            <th v-for="header in currentSummary[0]" :key="header" class="px-6 py-3 uppercase first:rounded-tl-lg last:rounded-tr-lg">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody v-if="currentSummary && currentSummary.length > 0">
          <tr v-for="content in currentSummary.slice(1)" :key="content" class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td v-for="item in content.slice(0, currentSummary[0].length)" class="px-6 py-4 break-words">
              {{ item }}
            </td>
          </tr>
        </tbody>
      </table>
      <table v-if="currentView === 'table' && currentTable && currentTable.length > 0" class="w-auto table-fixed text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
          <tr>
            <th v-for="header in currentTable[0]" :key="header" class="px-6 py-3 uppercase first:rounded-tl-lg last:rounded-tr-lg">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody v-if="currentTable && currentTable.length > 0">
          <tr v-for="content in currentTable.slice((currentPage - 1) * store.pageLimit + 1, ((currentPage - 1) * store.pageLimit) + store.pageLimit + 1)" :key="content" class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td v-for="item in content.slice(0, currentTable[0].length)" class="px-6 py-4 break-words whitespace-nowrap">
              {{ item }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="currentView === 'table'" class="mb-5 relative flex flex-col items-start justify-center w-full max-w-screen-md bg-white dark:bg-gray-800 rounded-b-lg shadow">
      <div v-if="currentTable && currentTable.length === 0" class="w-full h-16 text-sm flex items-center justify-center text-gray-500 dark:text-gray-400">
        Fetching table...
      </div>
      <div v-else class="w-full flex justify-between items-center space-y-0 p-4">
        <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
          Showing
          <span class="font-semibold text-gray-900 dark:text-white">{{ `${((currentPage - 1) * store.pageLimit) + 1} - ${Math.min(((currentPage - 1) * store.pageLimit) + store.pageLimit, currentTable.length - 1)}` }}</span>
          of
          <span class="font-semibold text-gray-900 dark:text-white">{{ currentTable.length > 0 ? currentTable.length - 1 : '?' }}</span>
        </span>
        <UPagination v-model="currentPage" :total="currentTable.length - 1" :max="store.maxDisplayPages" :page-count="store.pageLimit"
        :active-button="{ color: 'gray', class: `font-normal text-sm bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white` }"
        :inactive-button="{ color: 'gray', class: `font-normal text-sm bg-none text-gray-500 dark:bg-none dark:text-white hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white` }"
        :prev-button="{ color: 'gray', class: `font-normal text-sm bg-none text-gray-500 dark:bg-none dark:text-white hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white` }"
        :next-button="{ color: 'gray', class: `font-normal text-sm bg-none text-gray-500 dark:bg-none dark:text-white hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white` }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useContentsStore } from '~/store/contents'
import Papa from 'papaparse'

const store = useContentsStore()
const isSaving = ref(false)

const currentCSV = ref()

const currentSummary = ref([])
const currentTable = ref([])

const currentView = ref('summary')
const currentPage = ref(1)

const allowedViews = () => [
  [{
    label: 'Summary',
    click: () => {
      if (currentView.value !== 'summary') {
        currentView.value = 'summary'
      }
    }
  }, {
    label: 'Table',
    click: () => {
      if (currentView.value !== 'table') {
        currentView.value = 'table'
      }
    }
  },
  // {
  //   label: 'Graph',
  //   click: () => {
  //     if (currentView.value !== 'graph') {
  //       currentView.value = 'graph'
  //     }
  //   }
  // }
  ]
]

function upload(event) {
  let input
  if (event.type === 'drop') {
    input = event.dataTransfer.files[0]
  } else if (event.type === 'change') {
    input = event.target.files[0]
  }
  if (input) {
    if (input.name.split('.').pop() === 'csv') {
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

function display() {
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
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target.result
      const rows = Papa.parse(text, { delimiter: ',' })
      const summary = []
      const table = []
      try {
        let isLegend = false
        rows.data.forEach((row) => {
          if (row[0].toLowerCase() === 'classification') {
            isLegend = true
          }
          if (isLegend) {
            summary.push(row)
          } else {
            table.push(row)
          }
        })
        currentSummary.value.push(...summary)
        currentTable.value.push(...table)
        currentView.value = 'summary'
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

function getCurrentEvalution() {
  if (store.currentEvaluation) {
    const rows = Papa.parse(store.currentEvaluation, { delimiter: ',' })
    const summary = []
    const table = []
    try {
      let isLegend = false
      rows.data.forEach((row) => {
        if (row[0].toLowerCase() === 'classification') {
          isLegend = true
        }
        if (isLegend) {
          summary.push(row)
        } else {
          table.push(row)
        }
      })
      currentSummary.value.push(...summary)
      currentTable.value.push(...table)
      currentView.value = 'table'
    } catch(e) {
      console.log(e)
    }
  }
}

getCurrentEvalution()

</script>