<script setup lang="ts">
import type { StoreDescriptor } from '@packages/types'
import { api } from '@packages/worker-api'
import { onBeforeMount, ref } from 'vue'

const favorites = ref<StoreDescriptor[]>([])
const isLoading = ref<boolean>(false)

const onOpenStoreClick = async (storeUrl: string): Promise<void> => {
  await chrome.tabs.create({ active: true, url: storeUrl })
}

const onFavoriteProductsClick = async (storeUrl: string): Promise<void> => {
  //
}

const onRemoveStoreClick = async (storeUrl: string): Promise<void> => {
  //
}

onBeforeMount(async () => {
  isLoading.value = true
  favorites.value = await api.getAllFavorites()
  isLoading.value = false
})
</script>

<template>
  <div v-if="!isLoading">
    <div v-for="store in favorites" :key="store.id">
      <img :src="store.image" />
      <div>{{ store.name }}</div>
      <div @click="onOpenStoreClick(store.url)">Go to store</div>
      <div @click="onFavoriteProductsClick(store.url)">Favorite products</div>
      <div @click="onRemoveStoreClick(store.url)">Remove</div>
    </div>
  </div>
</template>

<style ></style>
