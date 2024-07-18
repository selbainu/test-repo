import axios from 'axios'

let devAxios = null
let prodAxios = null

export const useAxios = async (env, type, url, body) => {
  if (env === 'production') {
    if (!prodAxios) {
      prodAxios = axios.create({
        baseURL: useRuntimeConfig().public.VUE_APP_NODE_ENV === 'production' ? 'https://fenrir-business-prod-9d1050723811.herokuapp.com' : 'http://127.0.0.1:8080',
        headers: {
          'Authorization': `Bearer ${useRuntimeConfig().public.HASHED_SECRET_KEY}`,
        },
        crossorigin: true
      })
    }
    return prodAxios[type](url, body)
  } else {
    if (!devAxios) {
      devAxios = axios.create({
        baseURL: useRuntimeConfig().public.VUE_APP_NODE_ENV === 'production' ? 'https://fenrir-business-69e42dbe0b7b.herokuapp.com' : 'http://127.0.0.1:8080',
        headers: {
          'Authorization': `Bearer ${useRuntimeConfig().public.HASHED_SECRET_KEY}`,
        },
        crossorigin: true
      })
    }
    return devAxios[type](url, body)
  }
}