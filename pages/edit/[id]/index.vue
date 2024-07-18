<template>
  <div v-if="!store.currentAccount" class="flex items-center justify-center px-6 py-8 mx-auto h-screen">
    <Login/>
  </div>
  <div v-else-if="store.currentAccount.status === 'staged'" class="h-screen w-full flex flex-col justify-center items-center">
    <Staging/>
  </div>
  <div v-else class="relative overflow-x-auto flex items-center justify-center">
    <div class="mt-44 relative justify-center w-full max-w-screen-md my-16">
      <div class="mb-10">
        <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-small rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-75 dark:disabled:opacity-50" @click="back" :disabled="isSaving">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-2 w-5 h-5 text-white dark:text-white">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          <span>Back</span>
        </button>
      </div>
      <div class="mb-6">
        <label for="character-id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fenrir ID</label>
        <input v-model="character.character_id" type="text" id="character-id" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600  dark:text-white dark:focus:border-gray-600 placeholder:text-gray-300 dark:placeholder:text-gray-500 read-only:bg-gray-200 dark:read-only:bg-slate-800 read-only:text-slate-400" placeholder="e.g. 1234" readonly required>
      </div>
      <div class="grid grid-cols-2 gap-x-6 mb-6">
        <div>
          <label for="created-at" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date Created</label>
          <input v-model="character.created_at" type="text" id="created-at" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 placeholder:text-gray-300 dark:placeholder:text-gray-500 read-only:bg-gray-200 dark:read-only:bg-slate-800 read-only:text-slate-400" placeholder="e.g. 12/25/1990" readonly required>
        </div>
        <div>
          <label for="updated-at" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Updated</label>
          <input v-model="character.updated_at" type="text" id="updated-at" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 placeholder:text-gray-300 dark:placeholder:text-gray-500 read-only:bg-gray-200 dark:read-only:bg-slate-800 read-only:text-slate-400" placeholder="e.g. 12/25/1990" readonly required>
        </div>
      </div>
      <h1 class="mb-6 font-bold leading-tight tracking-widest text-gray-900 text-lg dark:text-white uppercase">
        Loki Reference
      </h1>
      <div class="mb-6">
        <label for="loki-character-id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Loki ID</label>
        <input v-model="character.loki_character_id" type="text" id="loki-character-id" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 placeholder:text-gray-300 dark:placeholder:text-gray-500 read-only:bg-gray-200 dark:read-only:bg-slate-800 read-only:text-slate-400" placeholder="e.g. 1234" readonly required>
      </div>
      <div class="mb-6">
        <label for="loki-detail-name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Loki Name</label>
        <input v-model="character.loki_detail.name" type="text" id="loki-detail-name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 placeholder:text-gray-300 dark:placeholder:text-gray-500 read-only:bg-gray-200 dark:read-only:bg-slate-800 read-only:text-slate-400" placeholder="e.g. Mei" :readonly="isSaving || store.currentAccount.role === 'viewer'">
      </div>
      <div class="mb-6">
        <label for="loki-detail-description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Loki Description</label>
        <textarea v-model="character.loki_detail.description" id="loki-detail-description" rows="7" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 placeholder:text-gray-300 dark:placeholder:text-gray-500 read-only:bg-gray-200 dark:read-only:bg-slate-800 read-only:text-slate-400" placeholder="e.g. She is a cute character with a bubbly personality." :readonly="isSaving || store.currentAccount.role === 'viewer'"></textarea>
      </div>
      <h1 class="mb-6 font-bold leading-tight tracking-widest text-gray-900 text-lg dark:text-white uppercase">
        Character Creation
      </h1>
      <div class="mb-6">
        <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
        <textarea v-model="character.detail.description" id="description" rows="7" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 placeholder:text-gray-300 dark:placeholder:text-gray-500 read-only:bg-gray-200 dark:read-only:bg-slate-800 read-only:text-slate-400" placeholder="e.g. You are Post Malone, the world-famous rapper." :readonly="isSaving || store.currentAccount.role === 'viewer'"></textarea>
      </div>
      <div class="mb-6">
        <label for="model" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Model</label>
        <USelectMenu searchable searchable-placeholder="Search model..." v-model="character.detail.model" 
        :options="allowedModels()" :popper="{ placement: 'bottom-start' }">
          <UButton class="truncate bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white
          disabled:bg-gray-200 dark:disabled:bg-slate-800 dark:disabled:opacity-100 disabled:text-slate-400 hover:bg-gray-50 dark:hover:bg-gray-700" :label="character.detail.model" trailing-icon="i-heroicons-chevron-down-20-solid"
          :disabled="store.currentAccount.role !== 'admin' && store.currentAccount.role !== 'editor'"/>
        </USelectMenu>
      </div>
      <div class="mb-6">
        <label for="language" class="block mb-2 text-sm font-medium text-gray-90:text-white">Language</label>
        <UDropdown class="w-full" id="language" :items="allowedLanguages()" :popper="{ placement: 'bottom-start' }">
          <UButton class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white
          disabled:bg-gray-200 dark:disabled:bg-slate-800 dark:disabled:opacity-100 disabled:text-slate-400 hover:bg-gray-50 dark:hover:bg-gray-700" :label="character.detail.language" trailing-icon="i-heroicons-chevron-down-20-solid"
          :disabled="store.currentAccount.role !== 'admin' && store.currentAccount.role !== 'editor'"/>
        </UDropdown>
      </div>
      <div class="mb-6">
        <label for="setting" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Setting</label>
        <input v-model="character.detail.setting" type="text" id="setting" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 placeholder:text-gray-300 dark:placeholder:text-gray-500 read-only:bg-gray-200 dark:read-only:bg-slate-800 read-only:text-slate-400" placeholder="e.g. At the office" :readonly="isSaving || store.currentAccount.role === 'viewer'">
      </div>
      <div class="mb-6">
        <label for="alias" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Names</label>
        <div class="flex justify-between items-center">
          <input v-model="currentNameAlias" type="text" id="alias" class="mr-6 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 placeholder:text-gray-300 dark:placeholder:text-gray-500 read-only:bg-gray-200 dark:read-only:bg-slate-800 read-only:text-slate-400" placeholder="e.g. The Weeknd" @keypress.enter="addNameAlias" :readonly="isSaving || store.currentAccount.role === 'viewer'"/>
          <button v-if="store.currentAccount.role === 'admin' || store.currentAccount.role === 'editor'" type="button" class="text-white w-10 h-10 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-75 dark:disabled:opacity-50 flex justify-center items-center" @click="addNameAlias" :disabled="isSaving">
          <svg class="w-4 h-4 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 1v16M1 9h16"/>
          </svg>
        </button>
        </div>
        <div v-if="nameAlias.length > 0" class="my-3 flex flex-wrap -m-1">
          <button v-for="(name, index) in nameAlias" type="button" @click="removeNameAlias(index)" class="m-1 flex flex-wrap focus:outline-none font-small rounded-lg text-sm p-2.5 text-center items-center bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white" :disabled="isSaving">
            <span class="mr-2">
              {{ name }}
            </span>
            <svg class="w-2.5 h-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
          </button>
        </div>
      </div>
      <h1 class="mb-6 font-bold leading-tight tracking-widest text-gray-900 text-lg dark:text-white uppercase">
        User Profile
        <button @click="() => { isProfileHidden = !isProfileHidden }" class="ml-2">
          <svg v-if="isProfileHidden" class="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
          </svg>
          <svg v-else class="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
          </svg>
        </button>
      </h1>
      <div id="profile-accordion" :class="{ 'h-0' : isProfileHidden }" class="overflow-hidden">
        <div v-if="store.currentAccount.role === 'admin' || store.currentAccount.role === 'editor'" class="mb-6">
          <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-small rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-75 dark:disabled:opacity-50" @click="addProfile" :disabled="isSaving">
            <svg class="mr-2 w-2.5 h-2.5 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 1v16M1 9h16"/>
            </svg>
            <span>
              Add profile
            </span>
          </button>
        </div>
        <div v-if="profile.length > 0" class="mb-6">
          <div v-for="(p, index) in profile" :key="profile" class="mb-6 flex justify-between items-end">
            <div class="w-full mr-6">
              <label :for="p.key" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Key</label>
              <input v-model="p.key" type="text" :id="p.key" class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 placeholder:text-gray-300 dark:placeholder:text-gray-500 read-only:bg-gray-200 dark:read-only:bg-slate-800 read-only:text-slate-400" placeholder="e.g. name" :readonly="isSaving || store.currentAccount.role === 'viewer'">
            </div>
            <div class="w-full"
              :class="{ 'mr-6': store.currentAccount.role === 'admin' || store.currentAccount.role === 'editor' }">
              <label :for="p.value" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Value</label>
              <input v-model="p.value" type="text" :id="p.value" class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 placeholder:text-gray-300 dark:placeholder:text-gray-500 read-only:bg-gray-200 dark:read-only:bg-slate-800 read-only:text-slate-400" placeholder="e.g. Micah" :readonly="isSaving || store.currentAccount.role === 'viewer'">
            </div>
            <button v-if="store.currentAccount.role === 'admin' || store.currentAccount.role === 'editor'" type="button" class="text-white w-10 h-10 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-75 dark:disabled:opacity-50" @click="removeProfile(index)" :disabled="isSaving">
              <svg class="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                <path d="M17 4h-4V2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2H1a1 1 0 0 0 0 2h1v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1a1 1 0 1 0 0-2ZM7 2h4v2H7V2Zm1 14a1 1 0 1 1-2 0V8a1 1 0 0 1 2 0v8Zm4 0a1 1 0 0 1-2 0V8a1 1 0 0 1 2 0v8Z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <h1 class="mb-6 font-bold leading-tight tracking-widest text-gray-900 text-lg dark:text-white uppercase flex items-center">
        Facts
        <button @click="() => { isFactsHidden = !isFactsHidden }" class="ml-2">
          <svg v-if="isFactsHidden" class="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
          </svg>
          <svg v-else class="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
          </svg>
        </button>
      </h1>
      <div :class="{ 'h-0' : isFactsHidden }"  class="overflow-hidden">
        <div v-if="store.currentAccount.role === 'admin' || store.currentAccount.role === 'editor'" class="mb-6">
          <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-small rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-75 dark:disabled:opacity-50" @click="addFact" :disabled="isSaving">
            <svg class="mr-2 w-2.5 h-2.5 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 1v16M1 9h16"/>
            </svg>
            <span>
              Add fact
            </span>
          </button>
        </div>
        <div v-if="facts.length > 0" class="mb-6">
          <div v-for="(fact, index) in facts" :key="fact" class="mb-6 flex justify-between items-center">
            <div class="w-full mr-6">
              <textarea v-model="fact.content" :id="fact+index" rows="7" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 placeholder:text-neutral-300 dark:placeholder:text-gray-600 read-only:bg-gray-200 dark:read-only:bg-slate-800 read-only:text-slate-400" placeholder="e.g. You are Post Malone, the world-famous rapper known for your unique style and genre-blending music. With your signature tattoos and distinctive fashion sense, you have a charismatic and laid-back personality that resonates with your fans. Your music is a mix of hip-hop, pop, and rock, and you've achieved great success in the music industry. You're also recognized for your philanthropic efforts and down-to-earth attitude despite your fame. In conversations, you often speak in a casual and relatable manner, connecting with people through your love for music and your experiences in the industry." :readonly="isSaving || store.currentAccount.role === 'viewer'" required></textarea>
            </div>
            <button v-if="store.currentAccount.role === 'admin' || store.currentAccount.role === 'editor'" type="button" class="text-white w-10 h-10 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-75 dark:disabled:opacity-50" @click="removeFact(index)" :disabled="isSaving">
              <svg class="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                <path d="M17 4h-4V2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2H1a1 1 0 0 0 0 2h1v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1a1 1 0 1 0 0-2ZM7 2h4v2H7V2Zm1 14a1 1 0 1 1-2 0V8a1 1 0 0 1 2 0v8Zm4 0a1 1 0 0 1-2 0V8a1 1 0 0 1 2 0v8Z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <h1 class="mb-6 font-bold leading-tight tracking-widest text-gray-900 text-lg dark:text-white uppercase flex items-center">
        Episodes
        <span class="ml-1 normal-case font-normal">
          (readonly)
        </span>
        <button @click="() => { isEpisodesHidden = !isEpisodesHidden }" class="ml-2">
          <svg v-if="isEpisodesHidden" class="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
          </svg>
          <svg v-else class="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
          </svg>
        </button>
      </h1>
      <div :class="{ 'h-0' : isEpisodesHidden }"  class="overflow-hidden">
        <div v-if="episodes.length > 0" class="mb-6">
          <div v-for="episode in episodes" :key="episode" class="mb-6 flex justify-between items-center">
            <div class="w-full">
              <div class="mb-2 text-sm">
                Episode ID: {{ episode.loki_episode_id }}
              </div>
              <textarea v-model="episode.content" :id="episode" rows="7" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 placeholder:text-neutral-300 dark:placeholder:text-gray-600 read-only:bg-gray-200 dark:read-only:bg-slate-800 read-only:text-slate-400" placeholder="e.g. You are Post Malone, the world-famous rapper known for your unique style and genre-blending music. With your signature tattoos and distinctive fashion sense, you have a charismatic and laid-back personality that resonates with your fans. Your music is a mix of hip-hop, pop, and rock, and you've achieved great success in the music industry. You're also recognized for your philanthropic efforts and down-to-earth attitude despite your fame. In conversations, you often speak in a casual and relatable manner, connecting with people through your love for music and your experiences in the industry." readonly required></textarea>
            </div>
          </div>
        </div>
        <div v-else class="mb-6 italic">
          No episodes
        </div>
      </div>
      <h1 class="mb-6 font-bold leading-tight tracking-widest text-gray-900 text-lg dark:text-white uppercase flex items-center">
        Posts
        <span class="ml-1 normal-case font-normal">
          (readonly)
        </span>
        <button @click="() => { isPostsHidden = !isPostsHidden }" class="ml-2">
          <svg v-if="isPostsHidden" class="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
          </svg>
          <svg v-else class="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
          </svg>
        </button>
      </h1>
      <div :class="{ 'h-0' : isPostsHidden }"  class="overflow-hidden">
        <div v-if="posts.length > 0" class="mb-6">
          <div v-for="post in posts" :key="post" class="mb-6 flex justify-between items-center">
            <div class="w-full">
              <div class="mb-2 text-sm">
                Post ID: {{ post.loki_post_id }}
              </div>
              <textarea v-model="post.content" :id="post" rows="7" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 placeholder:text-neutral-300 dark:placeholder:text-gray-600 read-only:bg-gray-200 dark:read-only:bg-slate-800 read-only:text-slate-400" placeholder="e.g. You are Post Malone, the world-famous rapper known for your unique style and genre-blending music. With your signature tattoos and distinctive fashion sense, you have a charismatic and laid-back personality that resonates with your fans. Your music is a mix of hip-hop, pop, and rock, and you've achieved great success in the music industry. You're also recognized for your philanthropic efforts and down-to-earth attitude despite your fame. In conversations, you often speak in a casual and relatable manner, connecting with people through your love for music and your experiences in the industry." readonly required></textarea>
            </div>
          </div>
        </div>
        <div v-else class="mb-6 italic">
          No posts
        </div>
      </div>
      <h1 class="mb-6 font-bold leading-tight tracking-widest text-gray-900 text-lg dark:text-white uppercase">
        System Prompt
      </h1>
      <div class="mb-6">
        <label for="system-prompt" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white required-label">System Prompt</label>
        <textarea v-model="character.system_prompt" id="system-prompt" rows="7" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 placeholder:text-neutral-300 dark:placeholder:text-gray-600 read-only:bg-gray-200 dark:read-only:bg-slate-800 read-only:text-slate-400" placeholder="e.g. You are Post Malone, the world-famous rapper known for your unique style and genre-blending music. With your signature tattoos and distinctive fashion sense, you have a charismatic and laid-back personality that resonates with your fans. Your music is a mix of hip-hop, pop, and rock, and you've achieved great success in the music industry. You're also recognized for your philanthropic efforts and down-to-earth attitude despite your fame. In conversations, you often speak in a casual and relatable manner, connecting with people through your love for music and your experiences in the industry." :readonly="isSaving || store.currentAccount.role === 'viewer'" required></textarea>
      </div>
      <div v-if="store.currentAccount.role === 'admin' || store.currentAccount.role === 'editor'" class="mb-6">
        <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-small rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-75 dark:disabled:opacity-50" :disabled="isSaving"
        @click="regenerate">
          <span>{{ isSaving ? 'Please wait' : 'Auto generate' }}</span>
          <svg v-if="isSaving" class="ml-2 inline w-4 h-4 text-white animate-spin" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 101">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
          </svg>
        </button>
      </div>
      <div class="flex item-center" :class="{ 'mb-6': store.currentAccount.role === 'admin' || store.currentAccount.role === 'editor' }">
        <label class="relative cursor-pointer">
          <input type="checkbox" v-model="character.is_active" class="sr-only peer" :readonly="isSaving" :disabled="isSaving || store.currentAccount.role === 'viewer'">
          <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
        <div class="flex item-center ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          {{ !character.is_active ? 'Status: Draft - Toggle to deploy.' : 'Status: Active - Toggle to save to drafts.' }}
        </div>
      </div>
      <button v-if="store.currentAccount.role === 'admin' || store.currentAccount.role === 'editor'" @click="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-75 dark:disabled:opacity-50" :disabled="isSaving">
        Update
      </button>
    </div>
  </div>
</template>

<script setup>
import async from 'async'
import { useContentsStore } from '~/store/contents'
import { Character, Message } from '~/assets/classes'

const store = useContentsStore()
const router = useRouter()
const route = useRoute()

const allowedLanguages = () => [
  [{
    label: 'English',
    click: () => {
      character.value.detail.language = 'English'
    }
  }, {
    label: 'Japanese',
    click: () => {
      character.value.detail.language = 'Japanese'
    }
  }, {
    label: 'Korean',
    click: () => {
      character.value.detail.language = 'Korean'
    }
  }],
]
const allowedModels = () => store.dbModels.map((model) => model.name)

const isSaving = ref(false)
const character = ref(new Character())

const profile = ref([])
const facts = ref([])
const posts = ref([])
const episodes = ref([])

const nameAlias = ref([])
const currentNameAlias = ref('')
const deletedFacts = ref([])

const isProfileHidden = ref(true)
const isFactsHidden = ref(true)
const isPostsHidden = ref(true)
const isEpisodesHidden = ref(true)

init()
async function init() {
  if (!store.currentCharacter) {
    await store.getCharacter({id: route.params.id}).then((data) => {
      store.currentCharacter = data.data
      if (!store.currentCharacter) {
        router.push('/')
      }
    }).catch((e) => {
      console.log(e)
    })
  }
  await store.getFrozenMessages({ limit: 1000, loki_character_id: store.currentCharacter.loki_character_id }).then((response) => {
    if (response && response.data) {
      store.currentFrozenMessages = response.data ? response.data.sort(( a, b ) => { return b.message_id - a.message_id }) : []
    } else {
      store.currentFrozenMessages = null
    }
  }).catch((e) => {
    console.log(e)
  })
  character.value = assign(store.currentCharacter)
  if (character.value && character.value.user_detail) {
    Object.keys(character.value.user_detail).forEach((parameter) => {
      profile.value.push({
        key: parseToRegularCase(parameter),
        value: character.value.user_detail[parameter]
      })
    })
  }
  if (character.value && character.value.name && character.value.name !== '') {
    nameAlias.value = character.value.name.split('|')
  }
  if (store.currentFrozenMessages && store.currentFrozenMessages.length > 0) {
    const frozenCopy = JSON.parse(JSON.stringify(store.currentFrozenMessages)).filter((message) => !message.is_deleted)
    for (let i = 0; i < frozenCopy.length; i++) {
      if (frozenCopy[i].loki_post_id) {
        posts.value.push(frozenCopy[i])
        posts.value.sort(( a, b ) => { return a.message_id - b.message_id })
      } else if (frozenCopy[i].loki_episode_id) {
        episodes.value.push(frozenCopy[i])
        episodes.value.sort(( a, b ) => { return a.message_id - b.message_id })
      } else {
        facts.value.push(frozenCopy[i])
      }
    }
  }
}

function back() {
  router.push('/')
}

function addFact() {
  facts.value.unshift(new Message(true))
}

function removeFact(index) {
  deletedFacts.value.push(...facts.value.splice(index, 1))
}

function addProfile() {
  profile.value.push({ key: '', value: '' })
}

function removeProfile(index) {
  profile.value.splice(index, 1)
}

function addNameAlias() {
  if (currentNameAlias.value !== '') {
    nameAlias.value.push(currentNameAlias.value)
    currentNameAlias.value = ''
  }
}

function removeNameAlias(index) {
  nameAlias.value.splice(index, 1)
}

function submit() {
  if (!isSaving.value) {
    isSaving.value = true
    const params = {}
    const body = {}
    if (character.value.loki_character_id !== store.currentCharacter.loki_character_id) {
      params.id = character.value.loki_character_id
      body.fenrir_character_id = character.value.character_id
    } else {
      params.id = character.value.character_id
    }
    if (character.value.is_active !== store.currentCharacter.is_active) {
      body.is_active = character.value.is_active
    }
    if (character.value.system_prompt) {
      body.system_prompt = character.value.system_prompt
    }
    if (nameAlias.value) {
      if (nameAlias.value.length > 0) {
        body.name = nameAlias.value.join('|')
      } else {
        body.name = null
      }
    }
    const detail = {}
    if (character.value.detail.description) {
      detail.description = character.value.detail.description
    }
    if (character.value.detail.model) {
      detail.model = character.value.detail.model
    } 
    if (character.value.detail.setting) {
      detail.setting = character.value.detail.setting
    } 
    if (character.value.detail.language) {
      detail.language = character.value.detail.language
    }
    body.detail = detail
    const loki_detail = {}
    if (character.value.loki_detail.name) {
      loki_detail.name = character.value.loki_detail.name
    }
    if (character.value.loki_detail.description) {
      loki_detail.description = character.value.loki_detail.description
    }
    body.loki_detail = loki_detail
    const user_detail = map(profile.value)
    body.user_detail = user_detail
    async.parallel([
      (callback) => {
        store.updateCharacter(params, body).then((data) => {
          store.currentCharacter = data.data
          callback(null)
        }).catch((e) => {
          console.log(e)
          callback(null)
        })
      }, (callback) => {
        if (facts.value.length === 0) {
          callback(null)
        }
        let count = 0
        for (let i = 0; i < facts.value.length; i++) {
          if (facts.value[i].message_id) {
            const frozenFacts = store.currentFrozenMessages.find((item) => {
              return item.message_id === facts.value[i].message_id
            })
            if (frozenFacts.content !== facts.value[i].content) {
              const factBody = {}
              const factParams = {}
              factParams.id = facts.value[i].message_id
              factBody.content = facts.value[i].content
              store.updateFrozenMessage(factParams, factBody).then((data) => {
                count++
                if (count === facts.value.length) {
                  callback(null)
                }
              }).catch((e) => {
                console.log(e)
                count++
                if (count === facts.value.length) {
                  callback(null)
                }
              })
            } else {
              count++
              if (count === facts.value.length) {
                callback(null)
              }
            }
          } else {
            const factBody = {}
            factBody.loki_character_id = character.value.loki_character_id
            factBody.content = facts.value[i].content
            store.createFrozenMessage(factBody).then((data) => {
              count++
              if (count === facts.value.length) {
                callback(null)
              }
            }).catch((e) => {
              console.log(e)
              count++
              if (count === facts.value.length) {
                callback(null)
              }
            })
          }
        }
      }, (callback) => {
        console.log(deletedFacts.value)
        if (deletedFacts.value.length === 0) {
          callback(null)
        }
        let count = 0
        for (let i = 0; i < deletedFacts.value.length; i++) {
          const factParams = {}
          factParams.id = deletedFacts.value[i].message_id
          store.deleteFrozenMessage(factParams).then((data) => {
            count++
            if (count === deletedFacts.value.length) {
              callback(null)
            }
          }).catch((e) => {
            console.log(e)
            count++
            if (count === deletedFacts.value.length) {
              callback(null)
            }
          })
        }
      }
    ]).then(() => {
      router.push(`/edit/${store.currentCharacter.character_id}`)
      isSaving.value = false
      store.toasts.push({
        type: 'success',
        id: store.getID(),
        body: 'Model updated successfully.',
      })
    }).catch((e) => {
      console.log(e)
      router.push(`/edit/${store.currentCharacter.character_id}`)
      isSaving.value = false
      store.toasts.push({
        type: 'error',
        id: store.getID(),
        body: `${e.code}: ${e.message}`
      })
    })
  }
}

function regenerate() {
  if (!isSaving.value) {
    isSaving.value = true
    const params = {}
    const body = {}
    params.id = character.value.loki_character_id
    const detail = {}
    if (character.value.detail.description) {
      detail.description = character.value.detail.description
    }
    if (character.value.detail.setting) {
      detail.setting = character.value.detail.setting
    }
    if (character.value.detail.language) {
      detail.language = character.value.detail.language
    }
    if (character.value.is_active !== store.currentCharacter.is_active) {
      body.is_active = character.value.is_active
    }
    body.detail = detail
    body.endpoint = 'internal'
    store.generateSystemPrompt(params, body).then((response) => {
      character.value.system_prompt = response.data.system_prompt
      isSaving.value = false
      store.toasts.push({
        type: 'success',
        id: store.getID(),
        body: 'Successfully generated system prompt.',
      })
    }).catch(() => {
      console.log('Failed to generate system prompt.')
      isSaving.value = false
      store.toasts.push({
        type: 'error',
        id: store.getID(),
        body: `${e.code}: ${e.message}`
      })
    }) 
  }
}

function assign(object) {
  const output = new Character()
  for (const property in object) {
    if (object[property] !== null) {
      if (property === 'created_at' || property === 'updated_at') {
        output[property] = new Date(object[property]).toLocaleDateString()
      } else if (property === 'detail') {
        output[property] = {}
        for (const detail in object[property]) {
          output[property][detail] = object[property][detail]
        }
      } else if (property === 'loki_detail') {
        output[property] = {}
        for (const detail in object[property]) {
          output[property][detail] = object[property][detail]
        }
      } else {
        output[property] = object[property]
      }
    }
  }
  return output
}

function map(array) {
  const output = {}
  for (const index in array) {
    const element = array[index]
    if (element.key !== '' && element.value !== '') {
      output[element.key] = element.value
    }
  }
  return output
}

function parseToRegularCase(string) {
  if (string.includes('_')) {
    return string.replace(/\s/g, '').split('_').map((word) => `${word.charAt(0).toUpperCase()}${word.substring(1)}`).join(' ')
  } else {
    return string.replace(/\s/g, '').split(/([A-Z][a-z]+)/).filter((e) => e).map((word) => `${word.charAt(0).toUpperCase()}${word.substring(1)}`).join(' ')
  }
}

</script>