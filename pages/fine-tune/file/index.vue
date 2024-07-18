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
    <div class="mt-44 mb-5 relative flex flex-col items-start justify-center w-full max-w-screen-md bg-white dark:bg-gray-800 rounded-lg shadow">
      <table v-if="store && store.headers" class="w-full table-fixed text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="w-full text-xs text-gray-700 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
          <tr>
            <th v-for="header in store.headers.files" :key="header" class="px-6 py-3 uppercase first:rounded-tl-lg last:rounded-tr-lg last:w-24">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody v-if="store && store.currentFiles">
          <tr v-for="content in store.currentFiles" :key="content" class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td class="px-6 py-4 break-words font-medium text-gray-900 dark:text-white">
              {{ content.filename }}
            </td>
            <td class="px-6 py-4 break-words">
              {{ content.id }}
            </td>
            <td class="px-6 py-4 break-words">
              {{ content.status }}
            </td>
            <td class="px-6 py-4">
              <span class="text-red-500 underline cursor-pointer" @click="!isSaving ? confirmDelete(content.id): ''">
                delete
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="relative flex flex-col items-start justify-center w-full max-w-screen-md bg-white dark:bg-gray-800 rounded-b-lg shadow">
        <div v-if="store && !store.currentFiles" class="w-full h-16 text-sm flex items-center justify-center text-gray-500 dark:text-gray-400">
          Fetching files...
        </div>
        <div v-else class="w-full flex justify-between items-center space-y-0 p-4">
          <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
            Showing
            <span class="font-semibold text-gray-900 dark:text-white">{{ `${((store.currentPage.files - 1) * store.pageLimit) + 1} - ${Math.min(((store.currentPage.files - 1) * store.pageLimit) + store.pageLimit, store.dbFiles.length)}` }}</span>
            of
            <span class="font-semibold text-gray-900 dark:text-white">{{ store && store.dbFiles && store.dbFiles.length > 0 ? store.dbFiles.length : '?' }}</span>
          </span>
          <UPagination v-model="store.currentPage.files" :total="store.dbFiles.length" :max="store.maxDisplayPages" :page-count="store.pageLimit"
          :active-button="{ color: 'gray', class: `font-normal text-sm bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white` }"
          :inactive-button="{ color: 'gray', class: `font-normal text-sm bg-none text-gray-500 dark:bg-none dark:text-white hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white` }"
          :prev-button="{ color: 'gray', class: `font-normal text-sm bg-none text-gray-500 dark:bg-none dark:text-white hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white` }"
          :next-button="{ color: 'gray', class: `font-normal text-sm bg-none text-gray-500 dark:bg-none dark:text-white hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useContentsStore } from '~/store/contents'

const store = useContentsStore()
const isSaving = ref(false)

function confirmDelete(id) {
  if (!isSaving.value) {
    isSaving.value = true
    store.dialog = {
      header: 'Are you sure?',
      description: 'You are about to permanently delete a file asset. This action cannot be undone.',
      buttons: {
        success: 'Yes, I\'m sure',
        fail: 'No, cancel',
      }, 
      callback: del,
      options: { id }
    }
    isSaving.value = false
  }
}

function del(id) {
  store.deleteFile('files', 'del', id).then((response) => {
    store.dbFiles = store.dbFiles.filter((file) => file.id !== response.id )
    store.currentFiles = store.dbFiles.slice((store.currentPage.files - 1) * store.pageLimit, ((store.currentPage.files - 1) * store.pageLimit) + store.pageLimit)
    isSaving.value = false
    store.toasts.push({
      type: 'success',
      id: store.getID(),
      body: 'File deleted successfully.',
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

watch(() => store.currentPage.files, (page) => {
  store.currentPage.files = page
  store.currentFiles = store.dbFiles.slice((store.currentPage.files - 1) * store.pageLimit, ((store.currentPage.files - 1) * store.pageLimit) + store.pageLimit)
})
</script>