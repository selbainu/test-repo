import async from 'async'
import { useContentsStore } from '~/store/contents'

export default defineNuxtRouteMiddleware(async (to, from, next) => {
  const store = useContentsStore()
  const cookies = {}
  if(process.client) {
    const browserCookies = decodeURIComponent(document.cookie).split('; ')
    for (let i = 0; i < browserCookies.length; i++) {
      const cookie = browserCookies[i].split('=')
      cookies[cookie[0]] = cookie[1] ?? ''
    }
  }
  if(process.client) {
    if (!store.currentAccount) {
      if(cookies.fccAccount) {
        const body = store.getCookie(cookies.fccAccount)
        if (Object.keys(body).length > 0) {
          store.loginAccount(body).then((data) => {
            setTimeout(() => {
              if (data.data.status === 'active') {
                store.currentAccount = data.data
                if (store.currentAccount.role === 'admin') {
                  store.getAccounts({ limit: 1000 }).then((response) => {
                    if (response && response.data) {
                      store.dbAccounts = response.data ? response.data.sort(( a, b ) => { return b.account_id - a.account_id }) : []
                      store.currentAccounts = store.dbAccounts.slice((store.currentPage.accounts - 1) * store.pageLimit, ((store.currentPage.accounts - 1) * store.pageLimit) + store.pageLimit)
                    }
                  }).catch((e) => {
                    console.log(e)
                  })
                }
              }
              store.cookieChecked = true
            }, 1000)
          }).catch((e) => {
            console.log(e)
            store.cookieChecked = true
          })
        } else {
          store.cookieChecked = true
        }
      } else {
        store.cookieChecked = true
      }
    }
  }
  const path = to.path.split('/')

  store.currentModule = 'creator'
  if (path[1] === '') {
    await store.getCharacters({ limit: 1000 }).then((response) => {
      if (response && response.data) {
        store.dbCharacters = response.data ? response.data.sort(( a, b ) => { return b.character_id - a.character_id }) : []
        store.currentCharacters = store.dbCharacters.slice((store.currentPage.characters - 1) * store.pageLimit, ((store.currentPage.characters - 1) * store.pageLimit) + store.pageLimit)
      }
    }).catch((e) => {
      console.log(e)
    })
  } else if (path[1] == 'admin') {
    if (path[2] === 'model') {
      await store.getModels(store.environment, { limit: 1000 }).then((response) => {
        if (response && response.data) {
          store.dbModels = response.data ? response.data.sort(( a, b ) => { return b.model_id - a.model_id }) : []
          store.currentModels = store.dbModels.slice((store.currentPage.models - 1) * store.pageLimit, ((store.currentPage.models - 1) * store.pageLimit) + store.pageLimit)
        }
      }).catch((e) => {
        console.log(e)
      })
    } else if (store.currentAccount && store.currentAccount.role === 'admin') {
      await store.getAccounts({ limit: 1000 }).then((response) => {
        if (response && response.data) {
          store.dbAccounts = response.data ? response.data.sort(( a, b ) => { return b.account_id - a.account_id }) : []
          store.currentAccounts = store.dbAccounts.slice((store.currentPage.accounts - 1) * store.pageLimit, ((store.currentPage.accounts - 1) * store.pageLimit) + store.pageLimit)
        }
      }).catch((e) => {
        console.log(e)
      })
    }
  } else if (path[1] === 'edit') {
    await store.getModels(store.environment, { limit: 1000 }).then((response) => {
      if (response && response.data) {
        store.dbModels = response.data ? response.data.sort(( a, b ) => { return b.model_id - a.model_id }) : []
        store.currentModels = store.dbModels.slice((store.currentPage.models - 1) * store.pageLimit, ((store.currentPage.models - 1) * store.pageLimit) + store.pageLimit)
      }
    }).catch((e) => {
      console.log(e)
    })
  } else if (path[1] === 'fine-tune') {
    store.currentModule = 'fine-tune'
    if (path[2] === 'file') {
      store.getFiles('files', 'list').then((response) => {
        if (response && response.data) {
          store.dbFiles = response.data ? response.data.sort(( a, b ) => { return b.model_id - a.model_id }) : []
          store.dbFiles = store.dbFiles.filter((file) => file.purpose === 'fine-tune')
          store.currentFiles = store.dbFiles.slice((store.currentPage.files - 1) * store.pageLimit, ((store.currentPage.files - 1) * store.pageLimit) + store.pageLimit)
        }
      }).catch((e) => {
        console.log(e)
      })
    } else if (path[2] === 'submit') {
      async.parallel([
        (callback) => {
          store.getFineTunes('fineTuning', 'jobs', 'list', { limit: 50 }).then((response) => {
            if (response && response.data) {
              store.dbFineTunes = response.data
              store.dbFineTunes = store.dbFineTunes.filter((fineTune) => fineTune.status === 'succeeded')
              store.currentFineTunes = store.dbFineTunes.slice((store.currentPage.fineTunes - 1) * store.pageLimit, ((store.currentPage.fineTunes - 1) * store.pageLimit) + store.pageLimit)
            }
            callback(null)
          }).catch((e) => {
            console.log(e)
            callback(null)
          })
        }, (callback) => {
          store.getFiles('files', 'list').then((response) => {
            if (response && response.data) {
              store.dbFiles = response.data ? response.data.sort(( a, b ) => { return b.model_id - a.model_id }) : []
              store.dbFiles = store.dbFiles.filter((file) => file.purpose === 'fine-tune')
              store.currentFiles = store.dbFiles.slice((store.currentPage.files - 1) * store.pageLimit, ((store.currentPage.files - 1) * store.pageLimit) + store.pageLimit)
            }
            callback(null)
          }).catch((e) => {
            console.log(e)
            callback(null)
          })
        }
      ]).catch((e) => {
        console.log(e)
      })
    } else {
      store.aggregateModels = []
      async.parallel([
        (callback) => {
          store.getModels('development', { limit: 1000 }).then((response) => {
            if (response && response.data) {
              store.aggregateModels.push(...response.data.map((model) => model.name))
            }
            callback(null)
          }).catch((e) => {
            console.log(e)
            callback(null)
          })
        }, (callback) => {
          store.getModels('production', { limit: 1000 }).then((response) => {
            if (response && response.data) {
              store.aggregateModels.push(...response.data.map((model) => model.name))
            }
            callback(null)
          }).catch((e) => {
            console.log(e)
            callback(null)
          })
        }, (callback) => {
          store.getFiles('files', 'list').then((response) => {
            if (response && response.data) {
              store.dbFiles = response.data ? response.data.sort(( a, b ) => { return b.model_id - a.model_id }) : []
              store.currentFiles = store.dbFiles.slice((store.currentPage.files - 1) * store.pageLimit, ((store.currentPage.files - 1) * store.pageLimit) + store.pageLimit)
            }
            callback(null)
          }).catch((e) => {
            console.log(e)
            callback(null)
          })
        }
      ]).then(() => {
        store.getFineTunes('fineTuning', 'jobs', 'list', { limit: 50 }).then((response) => {
          const fineTunePrice = 0.008
          if (response && response.data) {
            store.dbFineTunes = response.data
            store.dbFineTunes.forEach((dbFineTune) => {
              dbFineTune['est_price'] = `$ ${Math.round(dbFineTune.trained_tokens * dbFineTune.hyperparameters.n_epochs * fineTunePrice) / 1000}`
              dbFineTune['duration'] = dbFineTune.fine_tuned_model ? `${Math.round(((dbFineTune.finished_at - dbFineTune.created_at) / 60) * 100) / 100} m` : null
              dbFineTune['n_epochs'] = dbFineTune.hyperparameters.n_epochs
              const trainingFile = store.dbFiles.find((file) => file.id === dbFineTune.training_file)
              dbFineTune['training_file_name'] = trainingFile ? trainingFile.filename : null
            })
            store.currentFineTunes = store.dbFineTunes.slice((store.currentPage.fineTunes - 1) * store.pageLimit, ((store.currentPage.fineTunes - 1) * store.pageLimit) + store.pageLimit)
          }
        }).catch((e) => {
          console.log(e)
        })
      }).catch((e) => {
        console.log(e)
      })
    }
  } else if (path[1] === 'evals') {
    store.currentModule = 'evals'
    if (!path[2]) {
      store.currentEvaluation = null
      await store.getFineTunes('fineTuning', 'jobs', 'list', { limit: 50 }).then((response) => {
        if (response && response.data) {
          store.dbFineTunes = response.data
          store.dbFineTunes = store.dbFineTunes.filter((fineTune) => fineTune.status === 'succeeded')
          store.currentFineTunes = store.dbFineTunes.slice((store.currentPage.fineTunes - 1) * store.pageLimit, ((store.currentPage.fineTunes - 1) * store.pageLimit) + store.pageLimit)
        }
      }).catch((e) => {
        console.log(e)
      })
    }
  }
})