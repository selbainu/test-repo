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
    <div class="mt-44 overflow-x-scroll relative flex flex-col items-start justify-center w-full max-w-screen-md bg-white dark:bg-gray-800 rounded-t-lg shadow">
      <table v-if="store && store.headers" class="w-auto table-fixed text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
          <tr>
            <th v-for="header in store.headers.fineTunes" :key="header" class="px-6 py-3 uppercase first:rounded-tl-lg last:rounded-tr-lg">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody v-if="store && store.currentFineTunes">
          <tr v-for="(content, index) in store.currentFineTunes" :key="content" class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td class="px-6 py-4 break-words font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {{ content.fine_tuned_model }}
            </td>
            <td class="px-6 py-4 break-words whitespace-nowrap">
              {{ content.n_epochs }}
            </td>
            <td class="px-6 py-4 break-words whitespace-nowrap">
              <div class="flex items-center">
                {{ content.status }}
                <svg v-if="content.status === 'failed'" class="relative ml-1 w-5 h-5 text-gray-700 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                @mouseenter.stop.prevent.self="showTooltip($event, { title: 'Fine-tune Failed', description: content.error.message })" @mouseleave.stop.prevent.self="showTooltip(null)">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.5 10a2.5 2.5 0 1 1 5 .2 2.4 2.4 0 0 1-2.5 2.4V14m0 3h0m9-5a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
              </div>
            </td>
            <td class="px-6 py-4 break-words whitespace-nowrap">
              {{ content.id }}
            </td>
            <td class="px-6 py-4 break-words whitespace-nowrap">
              {{ content.model }}
            </td>
            <td class="px-6 py-4 break-words whitespace-nowrap">
              {{ content.training_file_name }}
            </td>
            <td class="px-6 py-4 break-words whitespace-nowrap">
              {{ content.est_price }}
            </td>
            <td class="px-6 py-4 break-words whitespace-nowrap">
              {{ content.duration }}
            </td>
            <td class="px-6 py-4">
              <span v-if="['queued', 'validating_files', 'running'].includes(content.status.toLowerCase())" class="text-red-500 underline cursor-pointer" @click="!isSaving ? confirmCancel(content.id): ''">
                cancel
              </span>
              <span v-else-if="content.status.toLowerCase() === 'succeeded' && store.aggregateModels.filter((item) => item === content.fine_tuned_model).length < 2" class="text-blue-500 underline cursor-pointer" @click="!isSaving ? submit(content): ''">
                save
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mb-5 relative flex flex-col items-start justify-center w-full max-w-screen-md bg-white dark:bg-gray-800 rounded-b-lg shadow">
      <div v-if="store && !store.currentFineTunes" class="w-full h-16 text-sm flex items-center justify-center text-gray-500 dark:text-gray-400">
        Fetching fine tunes...
      </div>
      <div v-else class="w-full flex justify-between items-center space-y-0 p-4">
        <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
          Showing
          <span class="font-semibold text-gray-900 dark:text-white">{{ `${((store.currentPage.fineTunes - 1) * store.pageLimit) + 1} - ${Math.min(((store.currentPage.fineTunes - 1) * store.pageLimit) + store.pageLimit, store.dbFineTunes.length)}` }}</span>
          of
          <span class="font-semibold text-gray-900 dark:text-white">{{ store && store.dbFineTunes && store.dbFineTunes.length > 0 ? store.dbFineTunes.length : '?' }}</span>
        </span>
        <UPagination v-model="store.currentPage.fineTunes" :total="store.dbFineTunes.length" :max="store.maxDisplayPages" :page-count="store.pageLimit"
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
const router = useRouter()

const isSaving = ref(false)

function submit(fineTune) {
  store.currentFineTune = fineTune
  router.push('/fine-tune/save')
}

function confirmCancel(id) {
  if (!isSaving.value) {
    isSaving.value = true
    store.dialog = {
      header: 'Are you sure?',
      description: 'You are about to cancel an ongoing fine-tune. This action cannot be undone.',
      buttons: {
        success: 'Yes, I\'m sure',
        fail: 'No, cancel',
      }, 
      callback: cancel,
      options: { id }
    }
    isSaving.value = false
  }
}

function cancel(id) {
  store.cancelFineTune('fineTuning', 'jobs', 'cancel', id).then((response) => {
    const index = store.dbFineTunes.findIndex((fineTune) => fineTune.id === response.id)
    if (index > -1) {
      store.dbFineTunes[index].status = 'cancelled'
      store.currentFineTunes = store.dbFineTunes.slice((store.currentPage.fineTunes - 1) * store.pageLimit, ((store.currentPage.fineTunes - 1) * store.pageLimit) + store.pageLimit)
    }
    isSaving.value = false
    store.toasts.push({
      type: 'success',
      id: store.getID(),
      body: 'Fine-tune cancelled.',
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

function showTooltip(event, tooltip) {
  if (event) {
    if (!store.tooltip) {
      store.tooltip = {
        coor: event.target.getBoundingClientRect(),
        tooltip
      }
    }
  } else {
    if (store.tooltip) {
      store.tooltip = null
    }
  }
}

watch(() => store.currentPage.fineTunes, (page) => {
  store.currentPage.fineTunes = page
  store.currentFineTunes = store.dbFineTunes.slice((store.currentPage.fineTunes - 1) * store.pageLimit, ((store.currentPage.fineTunes - 1) * store.pageLimit) + store.pageLimit)
})
</script>