import type { StoreDescriptor, StoreProductDescriptor } from '@types'
import { workerClient } from './worker-client'

export const api = {
  getActiveNetworkConnections: async (): Promise<number> => {
    return await workerClient.exec({
      type: 'request',
      method: 'getActiveNetworkConnections',
      parameters: []
    })
  },

  getAllFavorites: async (): Promise<StoreDescriptor[]> => {
    return await workerClient.exec({
      type: 'request',
      method: 'getAllFavorites',
      parameters: []
    })
  },

  addStoreToFavorites: async (
    storeData: StoreDescriptor
  ): Promise<void> => {
    return await workerClient.exec({
      type: 'request',
      method: 'addStoreToFavorites',
      parameters: [storeData]
    })
  },

  addProductToStoreFavorites: async (
    storeUrl: string, productData: StoreProductDescriptor
  ): Promise<void> => {
    return await workerClient.exec({
      type: 'request',
      method: 'addProductToStoreFavorites',
      parameters: [storeUrl, productData]
    })
  },

  removeProductFromStoreFavorites: async (
    storeUrl: string, productName: string
  ): Promise<void> => {
    return await workerClient.exec({
      type: 'request',
      method: 'removeProductFromStoreFavorites',
      parameters: [storeUrl, productName]
    })
  },

  isProductInStoreFavorites: async (
    storeUrl: string, productName: string
  ): Promise<boolean> => {
    return await workerClient.exec({
      type: 'request',
      method: 'isProductInStoreFavorites',
      parameters: [storeUrl, productName]
    })
  },

  isStoreInFavorites: async (
    storeUrl: string
  ): Promise<boolean> => {
    return await workerClient.exec({
      type: 'request',
      method: 'isStoreInFavorites',
      parameters: [storeUrl]
    })
  },

  getStoreFromFavorites: async (
    storeUrl: string
  ): Promise<boolean> => {
    return await workerClient.exec({
      type: 'request',
      method: 'getStoreFromFavorites',
      parameters: [storeUrl]
    })
  },


}