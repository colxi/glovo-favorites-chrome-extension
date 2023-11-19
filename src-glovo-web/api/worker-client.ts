import type { WorkerRequest, WorkerResponse } from '@types'
import { DEBUG_ENABLED } from './../config'

export const workerClient = {
  exec: <T>(requestData: WorkerRequest): Promise<T> => {
    return new Promise((resolve, reject) => {
      if (DEBUG_ENABLED) {
        console.log(`[WORKER-CLIENT] Request ${requestData.method}. With params:`, requestData.parameters)
      }
      chrome.runtime.sendMessage(requestData, (response: WorkerResponse) => {
        if (response.type === 'error') {
          if (DEBUG_ENABLED) {
            console.log(`[WORKER-CLIENT] Response error:`, response.data)
          }
          reject(new Error(`[WORKER-ERROR] ${response.data}`))
        }
        else {
          if (DEBUG_ENABLED) {
            console.log(`[WORKER-CLIENT] Response data:`, response.data)
          }
          resolve(response.data as T)
        }
      })
    })
  }
}

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   console.log('new message recieved in content script!', request)
//   let favorites = JSON.parse(localStorage.getItem('favorites') || '{}')
//   sendResponse(favorites)
//   return true
// })
