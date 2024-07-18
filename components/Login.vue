<template>
  <div v-if="store.cookieChecked" class="w-full bg-white rounded-lg shadow dark:border :mt-0 max-w-md p-0 dark:bg-gray-800 dark:border-gray-700">
    <div class="relative p-8">
      <h1 class="mb-6 font-bold leading-tight tracking-tight text-gray-900 text-2xl dark:text-white">
        Sign in to your account
      </h1>
      <form class="space-y-6" @submit.prevent="submit">
        <div>
          <label for="text" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
          <input v-model="account.username" type="text" name="text" id="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="username" required :readonly="isSaving">
        </div>
        <div>
          <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
          <div class="relative">
            <input v-model="account.password" :type="showPassword ? 'text' : 'password'" name="password" id="password" :placeholder="showPassword ? 'password' : '••••••••'" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required :readonly="isSaving">
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
              <svg v-if="!showPassword" class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14"
              @click="toggleShow(true)">
                <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
              </svg>
              <svg v-else class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"
              @click="toggleShow(false)">
                <path d="m2 13.587 3.055-3.055A4.913 4.913 0 0 1 5 10a5.006 5.006 0 0 1 5-5c.178.008.356.026.532.054l1.744-1.744A8.973 8.973 0 0 0 10 3C4.612 3 0 8.336 0 10a6.49 6.49 0 0 0 2 3.587Z"/>
                <path d="m12.7 8.714 6.007-6.007a1 1 0 1 0-1.414-1.414L11.286 7.3a2.98 2.98 0 0 0-.588-.21l-.035-.01a2.981 2.981 0 0 0-3.584 3.583c0 .012.008.022.01.033.05.204.12.401.211.59l-6.007 6.007a1 1 0 1 0 1.414 1.414L8.714 12.7c.189.091.386.162.59.211.011 0 .021.007.033.01a2.981 2.981 0 0 0 3.584-3.584c0-.012-.008-.023-.011-.035a3.05 3.05 0 0 0-.21-.588Z"/>
                <path d="M17.821 6.593 14.964 9.45a4.952 4.952 0 0 1-5.514 5.514L7.665 16.75c.767.165 1.55.25 2.335.251 6.453 0 10-5.258 10-7 0-1.166-1.637-2.874-2.179-3.407Z"/>
              </svg>
            </div>
          </div>
        </div>
        <div v-if="errorMessage" class="text-sm font-light text-orange-600 flex mt-0">
          {{ errorMessage }}
        </div>
        <button type="submit" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" :disabled="isSaving">
          Sign in
        </button>
        <div class="text-sm font-light text-gray-500 dark:text-gray-400 flex">
          Don’t have an account yet?
          <div class="ml-2 font-medium text-primary-600 hover:underline hover:cursor-pointer dark:text-primary-500" @click="register">
          Sign up
          </div>
        </div>
      </form>
      <div v-if="isSaving" role="status" class="absolute rounded-lg flex justify-center items-center top-0 left-0 w-full h-full bg-gray-600 bg-opacity-50">
        <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useContentsStore } from '~/store/contents'
import { Account } from '~/assets/classes'

const store = useContentsStore()
const router = useRouter()

const isSaving = ref(false)
const account = ref(new Account())

const showPassword = ref(false)

const errorMessage = ref('')

function toggleShow(value) {
  if (!isSaving.value) {
    showPassword.value = value
  }
}

function submit() {
  if (!isSaving.value) {
    isSaving.value = true
    const body = {}
    if (account.value.username) {
      body.username = account.value.username
    }
    if (account.value.password) {
      body.password = account.value.password
    }
    store.loginAccount(body).then((data) => {
      setTimeout(() => {
        store.currentAccount = data.data
        store.createCookie(store.currentAccount)
        router.push('/')
        isSaving.value = false
      }, 1000)
    }).catch((e) => {
      console.log(e)
      if (e.response && e.response.status === 404) {
        errorMessage.value = 'Account does not exist'
      } else if (e.response && e.response.status === 401) {
        errorMessage.value = 'Account suspended'
      } else {
        errorMessage.value = 'Internal server error'
      }
      isSaving.value = false
    })
  }
}

function register() {
  setTimeout(() => {
    router.push('/register')
  }, 3000)
}

</script>