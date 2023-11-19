import type { Method, StoreDescriptor, StoreProductDescriptor } from '@types'
import { getAllDatabaseEntries, addToDatabase } from '../database'
import { getActiveConnections } from '../connection-tracker'

export const workerPublicMethodsMap: Record<string, Method> = {
  getAllFavorites,
  addStoreToFavorites,
  addProductToStoreFavorites,
  isProductInStoreFavorites,
  isStoreInFavorites,
  getStoreFromFavorites,
  getActiveNetworkConnections,
  removeProductFromStoreFavorites,
}

async function getAllFavorites(): Promise<StoreDescriptor[]> {
  return await getAllDatabaseEntries<StoreDescriptor>()
}

async function getStoreFromFavorites(
  storeUrl: string
): Promise<StoreDescriptor> {
  const favorites = await getAllFavorites()
  const store = favorites.find((i) => i.url === storeUrl)
  if (!store) throw new Error(`Store not found in favorites: ${storeUrl}`)
  return store
}

async function addStoreToFavorites(
  storeData: StoreDescriptor
): Promise<void> {
  await addToDatabase(storeData)
}

async function addProductToStoreFavorites(
  storeUrl: string, product: StoreProductDescriptor
): Promise<boolean> {
  const storeInFavorites = await isStoreInFavorites(storeUrl)
  if (!storeInFavorites) throw new Error(`Store not found in favorites: ${storeUrl}`)

  const productInStore = await isProductInStoreFavorites(storeUrl, product.name)
  if (!productInStore) {
    const store = await getStoreFromFavorites(storeUrl)
    store.products.push(product)
    await addStoreToFavorites(store)
  }

  return true
}

async function removeProductFromStoreFavorites(
  storeUrl: string, productName: string
): Promise<boolean> {
  const storeInFavorites = await isStoreInFavorites(storeUrl)
  if (!storeInFavorites) return true

  const productInStore = await isProductInStoreFavorites(storeUrl, productName)
  if (!productInStore) return true

  const store = await getStoreFromFavorites(storeUrl)
  // delete product from store
  const productIndex = store.products.findIndex((i) => i.name === productName)
  store.products.splice(productIndex, 1)
  // update store in favorites
  await addStoreToFavorites(store)

  return true
}

async function isProductInStoreFavorites(
  storeUrl: string, productName: string
): Promise<boolean> {
  const favorites = await getAllFavorites()
  const store = favorites.find((i) => i.url === storeUrl)
  if (!store) return false
  const product = store.products.find((i) => i.name === productName)
  return Boolean(product)
}

async function isStoreInFavorites(
  storeUrl: string
): Promise<boolean> {
  const favorites = await getAllFavorites()
  const store = favorites.find((i) => i.url === storeUrl)
  return Boolean(store)
}

async function getActiveNetworkConnections(): Promise<number> {
  return getActiveConnections()
}


