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
      <div class="mb-6">
        <label for="message-ids" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Message IDs</label>
        <input v-model="message_ids" type="text" id="message-ids" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 placeholder:text-gray-300 dark:placeholder:text-gray-500 read-only:bg-gray-200 dark:read-only:bg-slate-800 read-only:text-slate-400" placeholder="e.g. 1,2,3,4" required>
      </div>
    </div>
    <div class="w-full max-w-screen-md flex flex-start">
      <button @click="generate" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-75 dark:disabled:opacity-50" :disabled="isSaving">
        Generate
      </button>
    </div>
    <div class="mt-5 mb-5 relative flex flex-col items-start justify-center w-full max-w-screen-md bg-white dark:bg-gray-800 rounded-lg shadow">
      <table v-if="store && store.headers" class="w-full table-fixed text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
          <tr>
            <th v-for="header in store.headers.logMessages" :key="header" class="px-6 py-3 uppercase first:rounded-tl-lg last:rounded-tr-lg first:w-32 even:w-32">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody v-if="store && store.currentLogMessages">
          <tr v-for="content in store.currentLogMessages" :key="content" class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td class="px-6 py-4 break-words font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {{ content.message_id }}
            </td>
            <td class="px-6 py-4 break-words">
              {{ getContentType(content) }}
            </td>
            <td class="px-6 py-4 break-words">
              {{ content.content }}
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="store && !store.currentLogMessages" class="w-full h-16 text-sm flex items-center justify-center text-gray-500 dark:text-gray-400">
        Fetching messages...
      </div>
      <div v-else-if="store && store.currentLogMessages && store.currentLogMessages.length === 0" class="w-full h-16 text-sm flex items-center justify-center text-gray-500 dark:text-gray-400">
        No messages found
      </div>
      <div v-else class="w-full flex justify-between items-center space-y-0 p-4">
        <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
          Showing
          <span class="font-semibold text-gray-900 dark:text-white">{{ `${((store.currentPage.logMessages - 1) * store.pageLimit) + 1} - ${Math.min(((store.currentPage.logMessages - 1) * store.pageLimit) + store.pageLimit, store.dbLogMessages.length)}` }}</span>
          of
          <span class="font-semibold text-gray-900 dark:text-white">{{ store && store.dbLogMessages && store.dbLogMessages.length > 0 ? store.dbLogMessages.length : '?' }}</span>
        </span>
        <UPagination v-model="store.currentPage.logMessages" :total="store.dbLogMessages.length" :max="store.maxDisplayPages" :page-count="store.pageLimit"
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

const store = useContentsStore()
const message_ids = ref('')
const isSaving = ref(false)

function generate() {
  if (!isSaving.value) {
    isSaving.value = true
    store.dbLogMessages = null
    store.currentLogMessages = null
    if (!message_ids.value || message_ids.value === '') {
      store.toasts.push({
        type: 'warning',
        id: store.getID(),
        body: 'List cannot be empty',
      })
      isSaving.value = false
      return
    }
    const body = {}
    if (message_ids.value !== '') {
      body.messages = message_ids.value.split(',').map(((message_id) => isNaN(message_id.trim()) ? -1 : parseInt(message_id.trim())))
    }
    if (body.messages.find((message_id) => message_id === -1)) {
      store.toasts.push({
        type: 'warning',
        id: store.getID(),
        body: 'Invalid integer ID',
      })
      isSaving.value = false
      return
    }
    store.logMessages(body).then((data) => {
      store.currentPage.logMessages = 1
      store.dbLogMessages = sortByRequest(data.data, body.messages)
      store.currentLogMessages = store.dbLogMessages.slice((store.currentPage.logMessages - 1) * store.pageLimit, ((store.currentPage.logMessages - 1) * store.pageLimit) + store.pageLimit)
      isSaving.value = false
      store.toasts.push({
        type: 'success',
        id: store.getID(),
        body: 'Succesfully fetched messages.',
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

function sortByRequest(array, order) {
  return array.sort((a, b) => {
    if (order.indexOf(a.message_id) > order.indexOf(b.message_id)) {
      return 1
    } else {
      return -1
    }
  })
}

function getContentType(content) {
  if (content.is_frozen) {
    if (content.loki_post_id) {
      return 'Post'
    } else if (content.loki_episode_id) {
      return 'Episode'
    } else {
      return 'Fact'
    }
  } else {
    if (content.role === 'user') {
      return 'User Chat'
    } else {
      return 'Character Chat'
    } 
  }
}

watch(() => store.currentPage.logMessages, (page) => {
  store.currentPage.logMessages = page
  store.currentLogMessages = store.dbLogMessages.slice((store.currentPage.logMessages - 1) * store.pageLimit, ((store.currentPage.logMessages - 1) * store.pageLimit) + store.pageLimit)
})

</script>