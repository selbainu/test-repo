<template>
  <div v-if="!store.currentAccount" class="flex items-center justify-center px-6 py-8 mx-auto h-screen">
    <Login/>
  </div>
  <div v-else-if="store.currentAccount.status === 'staged'" class="h-screen w-full flex flex-col justify-center items-center">
    <Staging/>
  </div>
  <div v-else-if="store.currentAccount.role !== 'admin' || store.currentAccount.status === 'suspended'" class="h-screen w-full flex flex-col justify-center items-center">
    <Unauthorized/>
  </div>
  <div v-else class="relative overflow-x-auto flex flex-col items-center justify-center">
    <div class="mt-44 mb-5 relative flex flex-col items-ssart justify-center w-full max-w-screen-md bg-white dark:bg-gray-800 rounded-lg shadow">
      <table v-if="store && store.headers" class="w-full table-fixed text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
          <tr>
            <th v-for="header in store.headers.models" :key="header" class="px-6 py-3 uppercase first:rounded-tl-lg last:rounded-tr-lg">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody v-if="store && store.currentModels">
          <tr v-for="content in store.currentModels" :key="content" class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" @click="edit(content ?? null)">
            <td class="px-6 py-4 break-words font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {{ content.model_id }}
            </td>
            <td class="px-6 py-4 break-words">
              {{ content.name }}
            </td>
            <td class="px-6 py-4 break-words">
              {{ content.description }}
            </td>
            <td class="px-6 py-4 break-words">
              {{ content.language }}
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="store && !store.currentModels" class="w-full h-16 text-sm flex items-center justify-center text-gray-500 dark:text-gray-400">
        Fetching models...
      </div>
      <div v-else class="w-full flex justify-between items-center space-y-0 p-4">
        <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
          Showing
          <span class="font-semibold text-gray-900 dark:text-white">{{ `${((store.currentPage.models - 1) * store.pageLimit) + 1} - ${Math.min(((store.currentPage.models - 1) * store.pageLimit) + store.pageLimit, store.dbModels.length)}` }}</span>
          of
          <span class="font-semibold text-gray-900 dark:text-white">{{ store && store.dbModels && store.dbModels.length > 0 ? store.dbModels.length : '?' }}</span>
        </span>
        <UPagination v-model="store.currentPage.models" :total="store.dbModels.length" :max="store.maxDisplayPages" :page-count="store.pageLimit"
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

function edit(content) {
  store.currentModel = content
  router.push(`/admin/model/edit/${content.model_id}`)
}

watch(() => store.currentPage.models, (page) => {
  store.currentPage.models = page
  store.currentModels = store.dbModels.slice((store.currentPage.models - 1) * store.pageLimit, ((store.currentPage.models - 1) * store.pageLimit) + store.pageLimit)
})
</script>