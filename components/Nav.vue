<template>
  <div v-if="store.currentAccount && checkStatus() && checkPath() && checkRole()" class="w-full fixed h-20 z-50 flex items-center bg-white dark:bg-gray-900 border-b dark:border-gray-700">
    <div class="w-full flex justify-between items-center px-6">
      <div class="flex items-center">
        <div class="flex items-center p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <svg class="w-4 h-4 text-white dark:text-white mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 8v8m0-8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8-8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 0a4 4 0 0 1-4 4h-1a3 3 0 0 0-3 3"/>
          </svg>
          <UDropdown id="module" :items="allowedModules()" :popper="{ placement: 'bottom-start' }">
            <UButton color="transparent" class="text-gray-900 dark:text-white text-sm rounded-lg w-full p-0" :label="store.currentModule" trailing-icon="i-heroicons-chevron-down-20-solid"/>
          </UDropdown>
        </div>
        <div v-if="store.currentModule === 'creator'" class="flex items-center">
          <span class="mx-2 text-gray-700 dark:text-gray-400">
            /
          </span>
          <div class="flex items-center p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <svg class="w-3 h-3 text-white dark:text-white mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 7.2c4.4 0 8-1.2 8-2.6C20 3.2 16.4 2 12 2S4 3.2 4 4.6C4 6 7.6 7.2 12 7.2ZM12 22c5 0 8-1.7 8-2.6V15h-.2a7.8 7.8 0 0 1-1.3.7l-.2.1c-2 .7-4.2 1-6.3 1a19 19 0 0 1-6.3-1h-.2a10.1 10.1 0 0 1-1.3-.7L4 15v4.4c0 1 3 2.6 8 2.6Zm7-14c-.1.2-.3.2-.5.3l-.2.1c-2 .7-4.2 1-6.3 1a19 19 0 0 1-6.3-1h-.2a10.2 10.2 0 0 1-1.3-.7L4 7.6V12c0 1 3 2.6 8 2.6s8-1.7 8-2.6V7.6h-.2a7.8 7.8 0 0 1-.7.5Z"/>
            </svg>
            <UDropdown v-if="url.host === 'localhost:3000'" id="environment" :items="allowedLocal()" :popper="{ placement: 'bottom-start' }">
              <UButton color="transparent" class="text-gray-900 dark:text-white text-sm rounded-lg w-full p-0" label="local" trailing-icon="i-heroicons-chevron-down-20-solid"/>
            </UDropdown>
            <UDropdown v-else id="environment" :items="allowedEnvironment()" :popper="{ placement: 'bottom-start' }">
              <UButton color="transparent" class="text-gray-900 dark:text-white text-sm rounded-lg w-full p-0" :label="store.environment" trailing-icon="i-heroicons-chevron-down-20-solid"/>
            </UDropdown>
          </div>
        </div>
      </div>
      <button class="text-sm text-gray-900 dark:text-blue-500 flex ml-5 p-2.5" @click="logout">
        <span class="flex items-center justify-center underline">
          Log out
        </span>
      </button>
    </div>
    <Subnav/>
  </div>
</template>

<script setup>
import { useContentsStore } from '~/store/contents'

const store = useContentsStore()
const route = useRoute()
const router = useRouter()

const url = useRequestURL()

const allowedEnvironment = () => [
  [{
    label: 'production',
    click: () => {
      if (store.environment !== 'production') {
        store.environment = 'production'
        fetch()
        reset()
      }
    }
  }, {
    label: 'development',
    click: () => {
      if (store.environment !== 'development') {
        store.environment = 'development'
        fetch()
        reset()
      }
    }
  }]
]

const allowedLocal = () => [
  [{
    label: 'local',
  }]
]


const allowedModules = () => [
  [{
    label: 'creator',
    click: () => {
      if (store.currentModule !== 'creator') {
        router.push('/')
      }
    }
  }, {
    label: 'fine-tune',
    click: () => {
      if (store.currentModule !== 'fine-tune') {
        router.push('/fine-tune')
      }
    }
  }, {
    label: 'evals',
    click: () => {
      if (store.currentModule !== 'evals') {
        router.push('/evals')
      }
    }
  }]
]

function checkStatus() {
  return store.currentAccount.status === 'active'
}

function checkPath() {
  return !route.path.startsWith('/register')
}

function checkRole() {
  if (route.path.startsWith('/admin')) {
    if (store.currentAccount.role !== 'admin' || store.currentAccount.status === 'suspended') {
      return false
    }
    return true
  }
  return true
}

function reset() {
  store.currentCharacter = null
  store.currentCharacters = null
  store.dbCharaceters = null
  store.currentPage = {
    characters: 1,
    accounts: 1,
    models: 1,
    fineTunes: 1,
    files: 1,
    logMessages: 1
  },
  store.currentModel = null
  store.currentModels = null
  store.dbModels = []
  store.currentFrozenMessages = null
}

function fetch() {
  if (route.path === '/') {
    store.getCharacters({ limit: 1000 }).then((response) => {
      if (response && response.data) {
        store.dbCharacters = response.data ? response.data.sort(( a, b ) => { return b.character_id - a.character_id }) : []
        store.currentCharacters = store.dbCharacters.slice((store.currentPage.characters - 1) * store.pageLimit, ((store.currentPage.characters - 1) * store.pageLimit) + store.pageLimit)
      }
      return
    }).catch((e) => {
      console.log(e)
      return
    })
    return
  } else if (route.path == '/admin') {
    if (store.currentAccount && store.currentAccount.role === 'admin') {
      store.getAccounts({ limit: 1000 }).then((response) => {
        if (response && response.data) {
          store.dbAccounts = response.data ? response.data.sort(( a, b ) => { return b.account_id - a.account_id }) : []
          store.currentAccounts = store.dbAccounts.slice((store.currentPage.accounts - 1) * store.pageLimit, ((store.currentPage.accounts - 1) * store.pageLimit) + store.pageLimit)
        }
        return
      }).catch((e) => {
        console.log(e)
        return
      })
    }
  } else if (route.path == '/admin/model') {
    store.getModels(store.environment, { limit: 1000 }).then((response) => {
      if (response && response.data) {
        store.dbModels = response.data ? response.data.sort(( a, b ) => { return b.model_id - a.model_id }) : []
        store.currentModels = store.dbModels.slice((store.currentPage.models - 1) * store.pageLimit, ((store.currentPage.models - 1) * store.pageLimit) + store.pageLimit)
      }
      return
    }).catch((e) => {
      console.log(e)
      return
    })
  } else if (route.path.startsWith('/edit')) {
    router.push('/')
    return
  } else if (route.path.startsWith('/admin/model/edit')) {
    router.push('/admin/model')
    return
  }
}

function logout() {
  store.deleteCookie()
  store.currentAccount = null
  router.push('/')
}

</script>