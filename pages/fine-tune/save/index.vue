<template>
  <div v-if="!store.currentAccount" class="flex items-center justify-center px-6 py-8 mx-auto h-screen">
    <Login/>
  </div>
  <div v-else-if="store.currentAccount.status === 'staged'" class="h-screen w-full flex flex-col justify-center items-center">
    <Staging/>
  </div>
  <div v-else-if="store.currentAccount.role !== 'admin'" class="h-screen w-full flex flex-col justify-center items-center">
    <Unauthorized/>
  </div>
  <div v-else class="relative overflow-x-auto flex items-center justify-center">
    <div class="mt-44 relative justify-center w-full max-w-screen-md my-16">
      <div class="mb-10">
        <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-small rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-75 dark:disabled:opacity-50" @click="back" :disabled="isSaving">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-2 w-5 h-5 text-white dark:text-white">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          <span>Back</span>
        </button>
      </div>
      <div class="mb-6">
        <label for="model-name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Model Name</label>
        <input v-model="model.name" type="text" id="model-name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 placeholder:text-gray-300 dark:placeholder:text-gray-500 read-only:bg-gray-200 dark:read-only:bg-slate-800 read-only:text-slate-400" placeholder="e.g. gpt-3.5-turbo" :readonly="isSaving || store.currentAccount.role === 'viewer' || store.currentFineTune">
      </div>
      <div class="mb-6">
        <label for="model-description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Model Description</label>
        <textarea v-model="model.description" id="model-description" rows="7" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 placeholder:text-gray-300 dark:placeholder:text-gray-500 read-only:bg-gray-200 dark:read-only:bg-slate-800 read-only:text-slate-400" placeholder="e.g. She is a cute character with a bubbly personality." :readonly="isSaving || store.currentAccount.role === 'viewer'"></textarea>
      </div>
      <div class="mb-6">
        <label for="language" class="block mb-2 text-sm font-medium text-gray-90:text-white">Language</label>
        <UDropdown class="w-full" id="language" :items="allowedLanguages()" :popper="{ placement: 'bottom-start' }">
          <UButton class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white
          disabled:bg-gray-200 dark:disabled:bg-slate-800 dark:disabled:opacity-100 disabled:text-slate-400 hover:bg-gray-50 dark:hover:bg-gray-700" :label="model.language" trailing-icon="i-heroicons-chevron-down-20-solid"
          :disabled="store.currentAccount.role !== 'admin' && store.currentAccount.role !== 'editor'"/>
        </UDropdown>
      </div>
      <div class="mb-6">
        <label for="environment" class="block mb-2 text-sm font-medium text-gray-90:text-white">Environment</label>
        <UDropdown class="w-full" id="environment" :items="allowedEnvironment()" :popper="{ placement: 'bottom-start' }">
          <UButton class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white
          disabled:bg-gray-200 dark:disabled:bg-slate-800 dark:disabled:opacity-100 disabled:text-slate-400 hover:bg-gray-50 dark:hover:bg-gray-700" :label="currentEnvironment" trailing-icon="i-heroicons-chevron-down-20-solid"
          :disabled="store.currentAccount.role !== 'admin' && store.currentAccount.role !== 'editor'"/>
        </UDropdown>
      </div>
      <button v-if="store.currentAccount.role === 'admin' || store.currentAccount.role === 'editor'" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-75 dark:disabled:opacity-50" :disabled="isSaving" @click="submit">
        Create
      </button>
    </div>
  </div>
</template>

<script setup>
import async from 'async'

import { useContentsStore } from '~/store/contents'
import { Model } from '~/assets/classes'

const store = useContentsStore()
const router = useRouter()

const isSaving = ref(false)

const model = ref(new Model())
const currentEnvironment = ref('Development')

const allowedEnvironment = () => [
  [{
    label: 'Development',
    click: () => {
      currentEnvironment.value = 'Development'
    }
  }, {
    label: 'Production',
    click: () => {
      currentEnvironment.value = 'Production'
    }
  }, {
    label: 'Both',
    click: () => {
      currentEnvironment.value = 'Both'
    }
  }],
]

const allowedLanguages = () => [
  [{
    label: 'English',
    click: () => {
      model.value.language = 'English'
    }
  }, {
    label: 'Japanese',
    click: () => {
      model.value.language = 'Japanese'
    }
  }, {
    label: 'Korean',
    click: () => {
      model.value.language = 'Korean'
    }
  }],
]

if (store.currentFineTune) {
  model.value.name = store.currentFineTune.fine_tuned_model
}

function back() {
  router.push('/fine-tune')
}

function submit() {
  if (!isSaving.value) {
    isSaving.value = true
    const body = {}
    if (model.value.name) {
      body.name = model.value.name
    }
    if (model.value.description) {
      body.description = model.value.description
    } else {
      store.toasts.push({
        type: 'warning',
        id: store.getID(),
        body: 'Description cannot be empty.',
      })
      isSaving.value = false
      return
    }
    if (model.value.language) {
      body.language = model.value.language
    }
    async.parallel([
      (callback) => {
        if (currentEnvironment.value.toLowerCase() === 'production') {
          callback(null)
        } else {
          store.createModel('development', body).then((data) => {
            store.toasts.push({
              type: 'success',
              id: store.getID(),
              body: 'Model added to development successfully.',
            })
            callback(null, data.data)
          }).catch((e) => {
            store.toasts.push({
              type: 'error',
              id: store.getID(),
              body: `${e.code}: ${e.message}`
            })
            callback(null)
          })
        }
      }, (callback) => {
        if (currentEnvironment.value.toLowerCase() === 'development') {
          callback(null)
        } else {
          store.createModel('production', body).then((data) => {
            store.toasts.push({
              type: 'success',
              id: store.getID(),
              body: 'Model added to production successfully.',
            })
            callback(null, data.data)
          }).catch((e) => {
            store.toasts.push({
              type: 'error',
              id: store.getID(),
              body: `${e.code}: ${e.message}`
            })
            callback(null)
          })
        }
      }
    ]).then((responses) => {
      store.currentModel = responses[0]
      router.push('/fine-tune')
      isSaving.value = false
    }).catch((e) => {
      console.log(e)
      isSaving.value = false
    })
  }
}

</script>