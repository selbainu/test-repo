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
      <!-- <div class="w-full flex justify-between items-center space-y-0 p-4">
        <div class="space-y-0">
          <UDropdown id="module" :items="allowedLimits()" :popper="{ placement: 'bottom-start' }">
            <UButton color="gray" class="w-16" :label="store.pageLimit" trailing-icon="i-heroicons-chevron-down-20-solid"/>
          </UDropdown>
          <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
            items per page
          </span>
        </div>
      </div> -->
      <table v-if="store && store.headers" class="w-full table-fixed text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
          <tr>
            <th v-for="header in store.headers.characters" :key="header" class="px-6 py-3 uppercase first:rounded-tl-lg last:rounded-tr-lg">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody v-if="store && store.currentCharacters">
          <tr v-for="content in store.currentCharacters" :key="content" class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" @click="edit(content ?? null)">
            <td class="px-6 py-4 break-words font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {{ content.character_id }}
            </td>
            <td class="px-6 py-4 break-words">
              {{ content.loki_character_id }}
            </td>
            <td class="px-6 py-4 break-words">
              {{ content.loki_detail && content.loki_detail.name ? content.loki_detail.name.length > 20 ? `${content.loki_detail.name.substring(0, 20)}...` : content.loki_detail.name : '' }}
            </td>
            <td class="px-6 py-4 break-words">
              {{ content.loki_detail && content.loki_detail.description ? content.loki_detail.description.length > 20 ? `${content.loki_detail.description.substring(0, 20)}...` : content.loki_detail.description : '' }}
            </td>
            <td class="px-6 py-4 break-words">
              <span class="px-2 py-0.5 rounded" :class="[!content.is_active ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' : 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300']">
                {{ !content.is_active ? 'draft' : 'active' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="store && !store.currentCharacters" class="w-full h-16 text-sm flex items-center justify-center text-gray-500 dark:text-gray-400">
        Fetching characters...
      </div>
      <div v-else class="w-full flex justify-between items-center space-y-0 p-4">
        <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
          Showing
          <span class="font-semibold text-gray-900 dark:text-white">{{ `${((store.currentPage.characters - 1) * store.pageLimit) + 1} - ${Math.min(((store.currentPage.characters - 1) * store.pageLimit) + store.pageLimit, store.dbCharacters.length)}` }}</span>
          of
          <span class="font-semibold text-gray-900 dark:text-white">{{ store && store.dbCharacters && store.dbCharacters.length > 0 ? store.dbCharacters.length : '?' }}</span>
        </span>
        <UPagination v-model="store.currentPage.characters" :total="store.dbCharacters.length" :max="store.maxDisplayPages" :page-count="store.pageLimit"
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

const allowedLimits = () => [
  [{
    label: 5,
    click: () => {
      if (store.pageLimit !== 5) {
        store.pageLimit = 5
      }
    }
  }, {
    label: 10,
    click: () => {
      if (store.pageLimit !== 10) {
        store.pageLimit = 10
      }
    }
  }, {
    label: 15,
    click: () => {
      if (store.pageLimit !== 15) {
        store.pageLimit = 15
      }
    }
  }, {
    label: 20,
    click: () => {
      if (store.pageLimit !== 20) {
        store.pageLimit = 20
      }
    }
  }]
]

function edit(content) {
  store.currentCharacter = content
  router.push(`/edit/${content.character_id}`)
}

watch(() => store.currentPage.characters, (page) => {
  store.currentPage.characters = page
  store.currentCharacters = store.dbCharacters.slice((store.currentPage.characters - 1) * store.pageLimit, ((store.currentPage.characters - 1) * store.pageLimit) + store.pageLimit)
})

// watch(() => store.pageLimit, (pageLimit) => {
//   store.pageLimit = pageLimit
//   store.currentCharacters = store.dbCharacters.slice((store.currentPage.characters - 1) * store.pageLimit, ((store.currentPage.characters - 1) * store.pageLimit) + store.pageLimit)
// })
</script>