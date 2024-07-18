<template>
  <div class="top-20 w-full fixed h-14 px-6 flex justify-start items-center bg-gray-100 dark:bg-gray-800">
    <h5 class="font-medium text-base flex items-center text-gray-700 dark:text-gray-400">
      <div v-if="store && store.currentModule === 'creator'" class="font-light mx-2 flex items-center p-2.5 hover:text-gray-900 dark:hover:text-blue-500" :class="{ 'text-gray-900 dark:text-blue-500 !font-bold': route.path === '/' || route.path.startsWith('/edit') }">
        <button @click="goToCharacters">
          Characters
        </button>
      </div>
      <div v-if="store && store.currentModule === 'creator' && store.currentAccount.role === 'admin'" class="font-light mx-2 flex items-center p-2.5 hover:text-gray-900 dark:hover:text-blue-500" :class="{ 'text-gray-900 dark:text-blue-500 !font-bold': route.path === '/admin' }">
        <button @click="goToAccounts">
          Accounts
        </button>
      </div>
      <div v-if="store && store.currentModule === 'creator' && store.currentAccount.role === 'admin'" class="font-light mx-2 flex items-center p-2.5 hover:text-gray-900 dark:hover:text-blue-500" :class="{ 'text-gray-900 dark:text-blue-500 !font-bold': route.path === '/admin/model' || route.path.startsWith('/admin/model/edit') }">
        <button @click="goToModels">
          Models
        </button>
      </div>
      <div v-if="store && store.currentModule === 'creator' && store.currentAccount.role === 'admin'" class="font-light mx-2 flex items-center p-2.5 hover:text-gray-900 dark:hover:text-blue-500" :class="{ 'text-gray-900 dark:text-blue-500 !font-bold': route.path === '/logger' }">
        <button @click="goToLogger">
          Logger
        </button>
      </div>
      <div v-if="store && store.currentModule === 'fine-tune' && store.currentAccount.role === 'admin'" class="font-light mx-2 flex items-center p-2.5 hover:text-gray-900 dark:hover:text-blue-500" :class="{ 'text-gray-900 dark:text-blue-500 !font-bold': route.path === '/fine-tune' || route.path.startsWith('/fine-tune/save') }">
        <button @click="goToModelList">
          Model List
        </button>
      </div>
      <div v-if="store && store.currentModule === 'fine-tune' && store.currentAccount.role === 'admin'" class="font-light mx-2 flex items-center p-2.5 hover:text-gray-900 dark:hover:text-blue-500" :class="{ 'text-gray-900 dark:text-blue-500 !font-bold': route.path === '/fine-tune/file' }">
        <button @click="goToFileList">
          File List
        </button>
      </div>
      <div v-if="store && store.currentModule === 'fine-tune' && store.currentAccount.role === 'admin'" class="font-light mx-2 flex items-center p-2.5 hover:text-gray-900 dark:hover:text-blue-500" :class="{ 'text-gray-900 dark:text-blue-500 !font-bold': route.path === '/fine-tune/file/format' }">
        <button @click="goToJsonLFormatter">
          JSONL Formatter
        </button>
      </div>
      <div v-if="store && store.currentModule === 'fine-tune' && store.currentAccount.role === 'admin'" class="font-light mx-2 flex items-center p-2.5 hover:text-gray-900 dark:hover:text-blue-500" :class="{ 'text-gray-900 dark:text-blue-500 !font-bold': route.path === '/fine-tune/file/upload' }">
        <button @click="goToUploadFile">
          Upload File
        </button>
      </div>
      <div v-if="store && store.currentModule === 'fine-tune' && store.currentAccount.role === 'admin'" class="font-light mx-2 flex items-center p-2.5 hover:text-gray-900 dark:hover:text-blue-500" :class="{ 'text-gray-900 dark:text-blue-500 !font-bold': route.path === '/fine-tune/submit' }">
        <button @click="goToSubmit">
          Submit
        </button>
      </div>
      <div v-if="store && store.currentModule === 'evals' && store.currentAccount.role === 'admin'" class="font-light mx-2 flex items-center p-2.5 hover:text-gray-900 dark:hover:text-blue-500" :class="{ 'text-gray-900 dark:text-blue-500 !font-bold': route.path === '/evals' }">
        <button @click="goToEval">
          Submit
        </button>
      </div>
      <div v-if="store && store.currentModule === 'evals' && store.currentAccount.role === 'admin'" class="font-light mx-2 flex items-center p-2.5 hover:text-gray-900 dark:hover:text-blue-500" :class="{ 'text-gray-900 dark:text-blue-500 !font-bold': route.path === '/evals/view' }">
        <button @click="goToEvalView">
          View
        </button>
      </div>
    </h5>
  </div>
</template>

<script setup>
import { useContentsStore } from '~/store/contents'

const store = useContentsStore()
const route = useRoute()
const router = useRouter()

function goToCharacters() {
  router.push('/')
}

function goToAccounts() {
  router.push('/admin')
}

function goToModels() {
  router.push('/admin/model')
}

function goToLogger() {
  router.push('/logger')
}

function goToModelList() {
  router.push('/fine-tune')
}

function goToFileList() {
  router.push('/fine-tune/file')
}

function goToJsonLFormatter() {
  router.push('/fine-tune/file/format')
}

function goToUploadFile() {
  router.push('/fine-tune/file/upload')
}

function goToSubmit() {
  router.push('/fine-tune/submit')
}

function goToEval() {
  router.push('/evals')
}

function goToEvalView() {
  router.push('/evals/view')
}
</script>