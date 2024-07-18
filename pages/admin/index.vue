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
    <div class="mt-44 mb-5 relative flex flex-col items-start justify-center w-full max-w-screen-md bg-white dark:bg-gray-800 rounded-lg shadow">
      <table v-if="store && store.headers" class="w-full table-fixed text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
          <tr>
            <th v-for="header in store.headers.accounts" :key="header" class="px-6 py-3 uppercase first:rounded-tl-lg last:rounded-tr-lg">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody v-if="store && store.currentAccounts">
          <tr v-for="content in store.currentAccounts" :key="content" class="border-b dark:border-gray-700 ">
            <td class="px-6 py-4 break-words font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {{ content.account_id }}
            </td>
            <td class="px-6 py-4 break-words">
              {{ content.username }}
            </td>
            <td class="px-6 py-4 break-words">
              {{ content.email }}
            </td>
            <td class="px-6 py-4">
              <UDropdown :items="allowedRoles(content.account_id, content.role)" :popper="{ placement: 'bottom-start' }">
                <UButton color="gray" :label="tempRoles[content.account_id] ?? content.role" trailing-icon="i-heroicons-chevron-down-20-solid"/>
              </UDropdown>
            </td>
            <td class="px-6 py-4">
              <UDropdown :items="allowedStatus(content.account_id, content.status)" :popper="{ placement: 'bottom-start' }">
                <UButton color="gray" :label="tempStatus[content.account_id] ?? content.status" trailing-icon="i-heroicons-chevron-down-20-solid"/>
              </UDropdown>
            </td>
            <td class="px-6 py-4">
              <span :class="[!tempRoles[content.account_id] && !tempStatus[content.account_id] ? 'text-blue-500 opacity-30' : 'text-blue-500 underline cursor-pointer']"
              @click="tempRoles[content.account_id] || tempStatus[content.account_id] ? submit(content.account_id) : '' ">
                save
              </span>
              <!-- <button type="button" class="text-white w-8 h-8 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-75 dark:disabled:opacity-50"
              @click="submit(content.account_id)" :disabled="!tempRoles[content.account_id] && !tempStatus[content.account_id]">
                <svg class="w-5 h-5 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                  <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z"/>
                  <path d="M13.768 15.475a1 1 0 0 1-1.414-1.414L13.414 13H6a1 1 0 0 1 0-2h7.414l-1.06-1.061a1 1 0 1 1 1.414-1.414L16 10.757V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2H14a2 2 0 0 0 2-2v-4.757l-2.232 2.232Z"/>
                </svg>
              </button> -->
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="store && !store.currentAccounts" class="w-full h-16 text-sm flex items-center justify-center text-gray-500 dark:text-gray-400">
        Fetching accounts...
      </div>
      <div v-else class="w-full flex justify-between items-center space-y-0 p-4">
        <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
          Showing
          <span class="font-semibold text-gray-900 dark:text-white">{{ `${((store.currentPage.accounts - 1) * store.pageLimit) + 1} - ${Math.min(((store.currentPage.accounts - 1) * store.pageLimit) + store.pageLimit, store.dbAccounts.length)}` }}</span>
          of
          <span class="font-semibold text-gray-900 dark:text-white">{{ store && store.dbAccounts && store.dbAccounts.length > 0 ? store.dbAccounts.length : '?' }}</span>
        </span>
        <UPagination v-model="store.currentPage.accounts" :total="store.dbAccounts.length" :max="store.maxDisplayPages" :page-count="store.pageLimit"
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

const allowedRoles = (id, role) => [
  [{
    label: 'admin',
    click: () => {
      update(id, role, 'admin', 'role')
    }
  }, {
    label: 'editor',
    click: () => {
      update(id, role, 'editor', 'role')
    }
  }, {
    label: 'viewer',
    click: () => {
      update(id, role, 'viewer', 'role')
    }
  }],
]
const allowedStatus = (id, status) => [
  [{
    label: 'staged',
    click: () => {
      update(id, status, 'staged', 'status')
    }
  }, {
    label: 'active',
    click: () => {
      update(id, status, 'active', 'status')
    }
  }, {
    label: 'suspended',
    click: () => {
      update(id, status, 'suspended', 'status')
    }
  }],
]
const tempRoles = ref({})
const tempStatus = ref({})

function submit(id) {
  const account = store.currentAccounts.find((item) => {
    return item.account_id === id
  })

  const params = {}
  const body = {}
  params.id = account.account_id
  if (tempRoles.value[account.account_id]) {
    body.role = tempRoles.value[account.account_id]
  }
  if (tempStatus.value[account.account_id]) {
    body.status = tempStatus.value[account.account_id]
  }
  store.updateAccount(params, body).then((data) => {
    tempRoles.value[account.account_id] = null
    tempStatus.value[account.account_id] = null
    const accountCurrentIndex = store.currentAccounts.findIndex((item) => {
      return item.account_id === id
    })
    const accountDbIndex = store.dbAccounts.findIndex((item) => {
      return item.account_id === id
    })
    store.currentAccounts[accountCurrentIndex] = data.data
    store.dbAccounts[accountDbIndex] = data.data
    store.toasts.push({
      type: 'success',
      id: store.getID(),
      body: 'Account updated successfully.',
    })
  }).catch((e) => {
    console.log(e)
    store.toasts.push({
      type: 'error',
      id: store.getID(),
      body: `${e.code}: ${e.message}`
    })
  })
}

function update(id, prevVal, newVal, prop) {
  if (prop === 'role') {
    if (!tempRoles.value[id] && prevVal !== newVal) {
      tempRoles.value[id] = newVal
    } else if (tempRoles.value[id] !== newVal) {
      tempRoles.value[id] = null
    }
  } else if (prop === 'status') {
    if (!tempStatus.value[id] && prevVal !== newVal) {
      tempStatus.value[id] = newVal
    } else if (tempStatus.value[id] !== newVal) {
      tempStatus.value[id] = null
    }
  }
}

watch(() => store.currentPage.accounts, (page) => {
  store.currentPage.accounts = page
  store.currentAccounts = store.dbAccounts.slice((store.currentPage.accounts - 1) * store.pageLimit, ((store.currentPage.accounts - 1) * store.pageLimit) + store.pageLimit)
})
</script>