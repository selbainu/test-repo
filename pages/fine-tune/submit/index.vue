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
    <div v-if="store.dbFineTunes && store.dbFiles" class="mt-44 relative justify-center w-full max-w-screen-md my-16">
      <h1 class="mb-6 font-bold leading-tight tracking-widest text-gray-900 text-lg dark:text-white uppercase">
        Submit Fine-tune
      </h1>
      <div class="mb-6">
        <label for="base-model" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Base Model</label>
        <USelectMenu searchable searchable-placeholder="Search base model..." v-model="fineTune.base_model" 
        :options="allowedBaseModels()" :popper="{ placement: 'bottom-start' }">
          <UButton class="truncate bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 disabled:bg-gray-200 dark:disabled:bg-slate-800 disabled:text-slate-400" :label="fineTune.base_model" trailing-icon="i-heroicons-chevron-down-20-solid" :disabled="isSaving"/>
        </USelectMenu>
      </div>
      <div class="mb-6">
        <label for="training-file" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Training File</label>
        <USelectMenu color="transparent" option-attribute="name" searchable searchable-placeholder="Search training file..." v-model="fineTune.training_file" :options="allowedTrainingFiles()" :popper="{ placement: 'bottom-start' }" class=" bg-gray-50  text-gray-900 text-sm rounded-lg w-full dark:bg-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700">
          <UButton class="truncate bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 disabled:bg-gray-200 dark:disabled:bg-slate-800 disabled:text-slate-400" :value="fineTune.training_file ? fineTune.training_file.name : ''" trailing-icon="i-heroicons-chevron-down-20-solid" :disabled="isSaving">
            {{ fineTune.training_file ? fineTune.training_file.name : ''}}
          </UButton>
        </USelectMenu>
      </div>
      <div class="mb-6">
        <label for="validation-data" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Validation Data (optional)</label>
        <USelectMenu color="transparent" option-attribute="name" searchable searchable-placeholder="Search training data..." v-model="fineTune.validation_data" :options="allowedValidationData()" :popper="{ placement: 'bottom-start' }" class=" bg-gray-50  text-gray-900 text-sm rounded-lg w-full dark:bg-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700">
          <UButton class="truncate bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 disabled:bg-gray-200 dark:disabled:bg-slate-800 disabled:text-slate-400e" :value="fineTune.validation_data ? fineTune.validation_data.name : ''" trailing-icon="i-heroicons-chevron-down-20-solid" :disabled="isSaving">
            {{ fineTune.validation_data ? fineTune.validation_data.name : ''}}
          </UButton>
          <svg @click.prevent="() => { fineTune.validation_data = '' }" class="absolute top-2.5 right-2.5 w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 18 6m0 12L6 6"/>
          </svg>
        </USelectMenu>
      </div>
      <div class="mb-6">
        <label for="model-name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Model Name</label>
        <input v-model="fineTune.model_name" type="text" id="model-name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 placeholder:text-gray-300 dark:placeholder:text-gray-500 read-only:bg-gray-200 dark:read-only:bg-slate-800 read-only:text-slate-400" placeholder="Mei" :readonly="isSaving">
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Model name must not exceed 18 characters.</p>
      </div>
      <div class="mb-6">
        <label for="epoch" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Epoch (optional)</label>
        <input v-model="fineTune.epoch" type="number" id="epoch" class="appearance-none focus:appearance-none hover:appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 placeholder:text-gray-300 dark:placeholder:text-gray-500 read-only:bg-gray-200 dark:read-only:bg-slate-800 read-only:text-slate-400" placeholder="4" :readonly="isSaving">
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Must be an integer. Leave blank to set to 'auto'.</p>
      </div>
      <div class="flex w-full flex-start">
        <button type="submit" class="text-white bg-blue-700 focus:outline-none rounded-lg text-sm px-5 py-2.5 disabled:opacity-75 dark:disabled:opacity-50" @click="submit" :disabled="isSaving">
          Submit for Fine-tuning
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useContentsStore } from '~/store/contents'
import { FineTune } from '~/assets/classes'

const store = useContentsStore()

const fineTune = ref(new FineTune())
const isSaving = ref(false)

const allowedBaseModels = () => {
  const baseModels = store.dbFineTunes.map((dbFineTune) => dbFineTune.fine_tuned_model ?? '')
  baseModels.unshift('gpt-3.5-turbo-1106')
  return baseModels
}
const allowedTrainingFiles = () => {
  return store.dbFiles.map((dbFile) => { return { name: dbFile.filename, id: dbFile.id } })
}

const allowedValidationData = () => {
  return store.dbFiles.map((dbFile) => { return { name: dbFile.filename, id: dbFile.id } })
}

function submit() {
  if (!isSaving.value) {
    isSaving.value = true
    const payload = {}
    const hyperparameters = {}
    if (fineTune.value.base_model) {
      payload.model = fineTune.value.base_model
    } else {
      store.toasts.push({
        type: 'warning',
        id: store.getID(),
        body: 'Base model required.',
      })
      isSaving.value = false
      return
    }
    if (fineTune.value.training_file) {
      payload.training_file = fineTune.value.training_file.id
    } else {
      store.toasts.push({
        type: 'warning',
        id: store.getID(),
        body: 'Training file required.',
      })
      isSaving.value = false
      return
    }
    if (fineTune.value.model_name) {
      payload.suffix = fineTune.value.model_name
    } else {
      store.toasts.push({
        type: 'warning',
        id: store.getID(),
        body: 'Model name required.',
      })
      isSaving.value = false
      return
    }
    if (fineTune.value.epoch) {
      hyperparameters.n_epochs = fineTune.value.epoch
    } else {
      hyperparameters.n_epochs = 'auto'
    }
    payload.hyperparameters = hyperparameters
    if (fineTune.value.validation_data) {
      payload.validation_file = fineTune.value.validation_data.id
    } else {
      payload.validation_file = null
    }
    store.createFineTune('fineTuning', 'jobs', 'create', payload).then(() => {
      fineTune.value = new FineTune()
      isSaving.value = false
      store.toasts.push({
        type: 'success',
        id: store.getID(),
        body: 'Fine-tune submitted successfully.',
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