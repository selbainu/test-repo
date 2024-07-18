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
  <div v-else class="relative overflow-x-auto flex items-center justify-center">
    <div class="mt-44 relative justify-center w-full max-w-screen-md my-16">
      <h1 class="mb-6 font-bold leading-tight tracking-widest text-gray-900 text-lg dark:text-white uppercase">
        Evaluation
      </h1>
      <div class="mb-6">
        <label for="model" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Model</label>
        <USelectMenu searchable searchable-placeholder="Search model..." v-model="evaluation.model" 
        :options="allowedModels()" :popper="{ placement: 'bottom-start' }">
          <UButton class="truncate bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 disabled:bg-gray-200 dark:disabled:bg-slate-800 disabled:text-slate-400" :label="evaluation.model" trailing-icon="i-heroicons-chevron-down-20-solid" :disabled="isSaving"/>
        </USelectMenu>
      </div>
      <div class="mb-6">
        <label for="model" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">CSV Dataset</label>
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
      </div>
      <div class="mb-6">
        <div class="flex items-center mb-2">
          <label for="evaluation-description" class="block mr-2 text-sm font-medium text-gray-900 dark:text-white">Evaluation Prompt: </label>
          <UDropdown :items="allowedPrompts()" :popper="{ placement: 'bottom-start' }">
            <UButton color="transparent" class=" p-2.5 text-gray-900 dark:text-white text-sm rounded-lg w-full hover:bg-gray-100 dark:hover:bg-gray-800" :label="allowedPrompts()[0][promptIndex].label" trailing-icon="i-heroicons-chevron-down-20-solid" :disabled="isSaving"/>
          </UDropdown>
        </div>
        <textarea v-model="constants[allowedPrompts()[0][promptIndex].value]" id="evaluation-description" rows="7" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 read-only:bg-gray-200 dark:read-only:bg-slate-800 read-only:text-slate-400" :readonly="isSaving"></textarea>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Please do not edit unless deemed necessary.</p>
      </div>
      <p v-if="evaluation.result && !store.currentEvaluation" class="text-sm text-red-800 dark:text-red-400 italic">Evaluation is not saved on the cloud. Local download is advised.</p>
      <div class="mt-5 w-full flex justify-between">
        <div class="space-x-5">
          <button class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 disabled:opacity-75 dark:disabled:opacity-50" @click="submit" :disabled="isSaving || !evaluation.model || !currentCSV || evaluation.result">
            Run Evaluation
          </button>
          <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-75 dark:disabled:opacity-50" @click="download" :disabled="isSaving || !evaluation.result">
            Download
          </button>
        </div>
        <button class="text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-900 disabled:opacity-75 dark:disabled:opacity-50" @click="view" :disabled="isSaving || !evaluation.result">
          View
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useContentsStore } from '~/store/contents'
import constants from '../lib/constants'

import eachLimit from 'async/eachLimit'
import Papa from 'papaparse'

const store = useContentsStore()
const router = useRouter()
const isSaving = ref(false)

const evaluation = ref({})
const currentCSV = ref()
const currentJSONL = ref([])
const promptIndex = ref(0)
const currentPrompt = ref(constants['EVALS_FACT_PROMPT'])

const tableHeaders = ref([])
const classifications = ref([])
const evaluatorModel = 'gpt-4'

const allowedPrompts = () => [
  [{
    label: 'Fact',
    value: 'EVALS_FACT_PROMPT',
    click: () => {
      if (promptIndex.value !== 0) {
        promptIndex.value = 0
        currentPrompt.value = constants['EVALS_FACT_PROMPT']
      }
    }
  }, {
    label: 'Character',
    value: 'EVALS_CHARACTER_PROMPT',
    click: () => {
      if (promptIndex.value !== 1) {
        promptIndex.value = 1
        currentPrompt.value = constants['EVALS_CHARACTER_PROMPT']
      }
    }
  }, {
    label: 'Creativity',
    value: 'EVALS_CREATIVITY_PROMPT',
    click: () => {
      if (promptIndex.value !== 2) {
        promptIndex.value = 2
        currentPrompt.value = constants['EVALS_CREATIVITY_PROMPT']
      }
    }
  }]
]

const allowedModels = () => {
  return store.dbFineTunes.map((dbFineTune) => dbFineTune.fine_tuned_model ?? '')
}

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

function listClassifications() {
  const classifications = []
  const promptLines = currentPrompt.value.split('\n')
  promptLines.forEach((line) => {
    const classification = getClassification(line)
    if (!classification) {
      return
    }
    classifications.push({
      code: classification,
      text: line.trim(),
      count: 0
    })
  })
  return classifications
}

function getClassification(string) {
  const regex = /^\(([A-Za-z])\)/
  const match = string.match(regex)
  return match ? match[1] : null
}

async function createDataset() {
  return new Promise((resolve) => {
    const dataRows = []
    currentJSONL.value = []
    const file = currentCSV.value
    if (!file) {
      store.toasts.push({
        type: 'warning',
        id: store.getID(),
        body: 'File failed to upload.',
      })
      resolve(dataRows)
    }
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target.result
      const rows = Papa.parse(text, { delimiter: ',' })
      try {
        let headers = rows.data[0]
        if (headers.includes('ideal') && !tableHeaders.value.includes('ideal')) {
          tableHeaders.value.splice(2, 0, 'ideal')
        }
        rows.data.shift()
        rows.data.forEach((row, index) => {
          if (row.length == 0 || row[0].length == 0) {
            return
          }
          let data = {}
          data.index = index + 1
          headers.forEach((header, index) => {
            data[header] = row[index]
          })
          const extraChats = []
          const chatArray = data?.chat_array.split('\n')
          chatArray.forEach((chat, i) => {
            if (chat.trim().length == 0) {
              return
            }
            if (chat.startsWith('user:')) {
              extraChats.push({
                role: 'user',
                content: chat.replace('user: ', '').trim()
              })
            } else if (chat.startsWith('assistant:')) {
              extraChats.push({
                role: 'assistant',
                content: chat.replace('assistant: ', '').trim()
              })
            } else {
              store.toasts.push({
                type: 'warning',
                id: store.getID(),
                body: `Role is neither user nor assistant. ${chat}`,
              })
            }
          })
          data.input = []
          data.input.push({
            role: 'system',
            content: data.system_prompt.trim()
          })
          data.input.push(...extraChats)
          data.input.push({
            role: 'user',
            content: data.question.trim()
          })
          data.completion = ''
          data.classification = ''
          dataRows.push(data)
        })
        currentJSONL.value = dataRows
        store.toasts.push({
          type: 'success',
          id: store.getID(),
          body: 'Dataset created successfully.',
        })
        resolve()
      } catch(e) {
        console.log(e)
        isSaving.value = false
        store.toasts.push({
          type: 'error',
          id: store.getID(),
          body: `Invalid CSV ${e.code}: ${e.message}`
        })
        resolve()
      }
    }
    reader.readAsText(file)
  })
}

async function submit() {
  if (!isSaving.value) {
    isSaving.value = true

    tableHeaders.value = ['index', 'question', 'completion', 'classification']
    await createDataset()
    classifications.value = listClassifications()

    if (currentJSONL.value.length === 0) {
      isSaving.value = false
      return
    }

    evaluation.value.result = null
    
    eachLimit(currentJSONL.value, 10, async (row) => {
      try {
        await evaluateModel(row)
      } catch (e) {
        console.log(e)
      }
    }, (e) => {
      if (e) {
        console.log(e)
        store.toasts.push({
          type: 'error',
          id: store.getID(),
          body: `${e.code}: ${e.message}`
        })
      } else {
        evaluation.value.result = { success: true }
        store.toasts.push({
          type: 'success',
          id: store.getID(),
          body: `Evaluation complete.`
        })
      }
      isSaving.value = false
    })
  }
}

const evaluateModel = async (row) => {
  try {
    const chatResponse = await store.getInference('chat', 'completions', 'create', {
      model: evaluation.value.model,
      messages: row.input
    })
    row.completion = chatResponse.choices[0].message.content
    const evalResponse = await store.getInference('chat', 'completions', 'create', {
      model: evaluatorModel,
      messages: [{
        role: 'system',
        content: placeVariables(currentPrompt.value, row, findPlaceholders(currentPrompt.value))
      }]
    })
    let result = evalResponse.choices[0].message.content
    if (result.includes('\n')) {
      const longResult = result.split('\n')
      result = longResult.shift()
      row.reason = typeof longResult !== undefined ? longResult.toString().replace(',', '').replace('Reason:', '').trim() : ''
      if (!tableHeaders.value.includes('reason')) {
        tableHeaders.value.push('reason')
      }
    }
    row.classification = result.trim().replace('Conditions Satisfied:', '').replaceAll(',', '').replace(/\s/g, '').split('').sort().join('')
    row.classification.split('').forEach((letter) => {
      const classification = classifications.value.find((classification) => classification.code === letter)
      if (classification) {
        classification.count++
      }
    })
    return
  } catch (e) {
    console.log(e)
    store.toasts.push({
      type: 'error',
      id: store.getID(),
      body: `${e.code}: ${e.message}`
    })
    return row
  }
}

function download() {
  if (!isSaving.value) {
    isSaving.value = true
    try {
      const csvLines = []
      currentJSONL.value.forEach((item) => {
        let i = []
        tableHeaders.value.forEach((header) => {
          i.push(item[header])
        })
        csvLines.push(i)
      })
      csvLines.push(['classification', 'count', 'code'])
      classifications.value.forEach((item) => {
        csvLines.push([item.text, item.count, item.code])
      })

      store.currentEvaluation = Papa.unparse({
        fields: tableHeaders.value,
        data: csvLines
      });


      const a = document.createElement('a')
      const file = new Blob([store.currentEvaluation], { type: 'text/plaincharset=utf-8' })
      a.href = URL.createObjectURL(file)
      a.download = `${evaluation.value.model}.csv`
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

function findPlaceholders(text) {
  const regex = /{{(.*?)}}/g
  const matches = []
  let match
  while ((match = regex.exec(text)) !== null) {
    matches.push(match[1])
  }
  return matches
}

function placeVariables(content, detail, variables) {
  if (variables.length === 0) {
    return content
  } else {
    const variable = variables.shift()
    const expression = new RegExp(`{{${variable}}}`, 'g')
    if (detail[variable]) {
      return placeVariables(content.replace(expression, detail[variable]), detail, variables)
    } else {
      return placeVariables(content, detail, variables)
    }
  }
}

function escapeCSV(value) {
  if (typeof value === 'string') {
    return `"${value.replace(/"/g, '""')}"`
  } else {
    return String(value)
  }
}

function view() {
  if (!isSaving.value) {
    isSaving.value = true
    try {
      const csvLines = []
      currentJSONL.value.forEach((item) => {
        let i = []
        tableHeaders.value.forEach((header) => {
          i.push(item[header])
        })
        csvLines.push(i)
      })
      csvLines.push(['classification', 'count', 'code'])
      classifications.value.forEach((item) => {
        csvLines.push([item.text, item.count, item.code])
      })
      store.currentEvaluation = Papa.unparse({
        fields: tableHeaders.value,
        data: csvLines
      });
      router.push('/evals/view')
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