import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuid } from 'uuid'

interface Favorite {
  id: number,
  url: string,
  name: string,
  products: [
    {
      image: string,
      name: string,
    },
  ],
}

const sendMessageToBackground = (message: any): Promise<any> => {
  const sendMessage = (self as any).chrome.runtime.sendMessage
  return new Promise((resolve, reject) => {
    sendMessage(message, (response: any) => {
      if (response) {
        resolve(response)
      } else {
        alert(`Error: ${response}`)
      }
    })
  })
}


export const useFavoritesStore = defineStore('favorites-store', () => {
  const favorites = ref<Favorite[]>([])

  const init = async () => {
    favorites.value = await sendMessageToBackground({ type: 'getAllFavorites' })
  }

  return {
    init,
    favorites
  }
})
