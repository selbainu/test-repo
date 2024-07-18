import { defineStore } from 'pinia'
import { useOpenAI } from '../composables/openai'
import ShortUniqueId from 'short-unique-id'
import async from 'async'

const uid = new ShortUniqueId();

export const useContentsStore = defineStore({
  id: 'content-store',
  state: () => {
    return {
      headers: {
        characters: ['Fenrir ID', 'Loki ID', 'Name', 'Description', 'Status'],
        accounts: ['Account ID', 'Username', 'Email', 'Role', 'Status', 'Action'],
        models: ['Model ID', 'Name', 'Description', 'Language'],
        fineTunes: ['Model Name', 'Epochs', 'Status', 'Model ID', 'Base Model', 'Training File', 'Estimated Cost', 'Duration', 'Action'],
        files: ['File Name', 'File ID', 'Status', 'Action'],
        logMessages: ['Message ID', 'Type', 'Content']
      },
      toasts: [],
      dialog: null,
      tooltip: null,
      currentCharacter: null,
      currentCharacters: null,
      dbCharaceters: null,
      currentPage: {
        characters: 1,
        accounts: 1,
        models: 1,
        fineTunes: 1,
        files: 1,
        logMessages: 1
      },
      pageLimit: 5,
      maxDisplayPages: 5,

      currentLogMessages: null,
      dbLogMessages: null,
      
      currentAccount: null,
      currentAccounts: null,
      dbAccounts: null,
      cookieChecked: false,

      currentModel: null,
      currentModels: null,
      dbModels: null,
      aggregateModels: [],

      currentFineTune: null,
      currentFineTunes: null,
      dbFineTunes: null,

      currentFiles: null,
      dbFiles: null,

      currentFrozenMessages: null,

      currentEvaluation: null,

      environment: 'development',
      currentModule: 'creator'
    }
  },
  actions: {
    getID() {
      return uid.rnd()
    },
    async getCharacters(query = {}) {
      return await useAxios(this.environment, 'get', `/internal/characters?limit=${query.limit ?? 10}`).then((response) => {
        return response.data
      }).catch((e) => {
        console.log(e)
        throw e
      })
    },
    async getCharacter(params = {}) {
      return await useAxios(this.environment, 'get', `/internal/characters/${params.id}`).then((response) => {
        return response.data
      }).catch((e) => {
        console.log(e)
        throw e
      })
    },
    async updateCharacter(params = {}, body = {}) {
      return await useAxios(this.environment, 'put', `/internal/characters/${params.id}`, body).then((response) => {
        return response.data
      }).catch((e) => {
        console.log(e)
        throw e
      })
    },
    async generateSystemPrompt(params = {}, body = {}) {
      return await useAxios(this.environment, 'post', `/admin/characters/${params.id}/generate-prompt`, body).then((response) => {
        return response.data
      }).catch((e) => {
        console.log(e)
        throw e
      })
    },
    async getAccounts(query = {}) {
      return await useAxios('development', 'get', `/internal/accounts?limit=${query.limit ?? 10}`).then((response) => {
        return response.data
      }).catch((e) => {
        console.log(e)
        throw e
      })
    },
    async updateAccount(params = {}, body = {}) {
      return await useAxios('development', 'put', `/internal/accounts/${params.id}`, body).then((response) => {
        return response.data
      }).catch((e) => {
        console.log(e)
        throw e
      })
    },
    async loginAccount(body = {}) {
      return await useAxios('development', 'post', `/internal/accounts/login`, body).then((response) => {
        if (response.data.data.status === 'suspended') {
          throw({
            response: {
              status: 401,
              message: 'Account suspended'
            }
          })
        } else {
          return response.data
        }
      }).catch((e) => {
        console.log(e)
        throw e
      })
    },
    async createAccount(body = {}) {
      return await useAxios('development', 'post', `/internal/accounts`, body).then((response) => {
        return response.data
      }).catch((e) => {
        console.log(e)
        throw e
      })
    },
    async getModels(env, query = {}) {
      return await useAxios(env, 'get', `/admin/models?limit=${query.limit ?? 10}`).then((response) => {
        return response.data
      }).catch((e) => {
        console.log(e)
        throw e
      })
    },
    async getModel(params = {}) {
      return await useAxios(this.environment, 'get', `/admin/models/${params.id}`).then((response) => {
        return response.data
      }).catch((e) => {
        console.log(e)
        throw e
      })
    },
    async updateModel(params = {}, body = {}) {
      return await useAxios(this.environment, 'put', `/admin/models/${params.id}`, body).then((response) => {
        return response.data
      }).catch((e) => {
        console.log(e)
        throw e
      })
    },
    async createModel(env, body = {}) {
      return await useAxios(env, 'post', `/admin/models`, body).then((response) => {
        return response.data
      }).catch((e) => {
        console.log(e)
        throw e
      })
    },
    async deleteModel(params = {}) {
      return await useAxios(this.environment, 'delete', `admin/models/${params.id}`).then((response) => {
        return response.data
      }).catch((e) => {
        console.log(e)
        throw e
      })
    },
    async logMessages(body = {}) {
      return await useAxios(this.environment, 'post', '/admin/messages/log', body).then((response) => {
        return response.data
      }).catch((e) => {
        console.log(e)
        throw e
      })
    },
    async createFrozenMessage(body = {}) {
      return await useAxios(this.environment, 'post', `/internal/messages/frozen`, body).then((response) => {
        return response.data
      }).catch((e) => {
        console.log(e)
        throw e
      })
    },
    async getFrozenMessages(query = {}) {
      return await useAxios(this.environment, 'get', `/internal/messages/frozen?limit=${query.limit ?? 10}&loki_character_id=${query.loki_character_id}`).then((response) => {
        return response.data
      }).catch((e) => {
        console.log(e)
        throw e
      })
    },
    async updateFrozenMessage(params = {}, body = {}) {
      return await useAxios(this.environment, 'put', `internal/messages/frozen/${params.id}`, body).then((response) => {
        return response.data
      }).catch((e) => {
        console.log(e)
        throw e
      })
    },
    async deleteFrozenMessage(params = {}) {
      return await useAxios(this.environment, 'delete', `admin/messages/frozen/${params.id}`).then((response) => {
        return response.data
      }).catch((e) => {
        console.log(e)
        throw e
      })
    },
    getCookie(cookie) {
      return JSON.parse(cookie)
    },
    createCookie(account) {
      const accountCookie = {
        username: account.username,
        password: account.password
      }
      const expiry = new Date()
      expiry.setDate(expiry.getDate() + 365)
      expiry.toUTCString()
      document.cookie = `fccAccount=${JSON.stringify(accountCookie)}; expires=${expiry}; path=/`
    },
    deleteCookie() {
      document.cookie = 'fccAccount={}'
    },
    async getInference(api, method, sub, body) {
      return await useOpenAI(api, method, sub, body).then((response) => {
        return response
      }).catch((e) => {
        console.log(e)
        throw e
      })
    },
    async getFineTunes(api, method, sub, body) {
      return await useOpenAI(api, method, sub, body).then((response) => {
        return response.body
      }).catch((e) => {
        console.log(e)
        throw e
      })
    },
    async createFineTune(api, method, sub, body) {
      return await useOpenAI(api, method, sub, body).then((response) => {
        return response
      }).catch((e) => {
        console.log(e)
        throw e
      })
    },
    async cancelFineTune(api, method, sub, body) {
      return await useOpenAI(api, method, sub, body).then((response) => {
        return response
      }).catch((e) => {
        console.log(e)
        throw e
      })
    },
    async getFiles(api, method) {
      return await useOpenAI(api, method, null, {}).then((response) => {
        return response.body
      }).catch((e) => {
        console.log(e)
        throw e
      })
    },
    async createFile(api, method, body) {
      return await useOpenAI(api, method, null, body).then((response) => {
        return response
      }).catch((e) => {
        console.log(e)
        throw e
      })
    },
    async deleteFile(api, method, body) {
      return await useOpenAI(api, method, null, body).then((response) => {
        return response
      }).catch((e) => {
        console.log(e)
        throw e
      })
    }
  },
})