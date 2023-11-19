import type { Method, WorkerRequest, WorkerResponse } from '@types'
import { validateRequestObject } from './request-validator'

/**
 * 
 * IMPORTANT:Any exit point of this function must return true, otherwise the following
 * error will be thrown on extension side: "The message port closed before a response was received.""
 * 
 */
export function createRequestHandler(controllersMap: Record<string, Method>) {
  return (requestData: WorkerRequest, _sender: any, sendResponse: Method) => {
    // validate request object
    const validationResult = validateRequestObject(requestData, controllersMap)
    if (validationResult !== true) {
      console.log(`[VALIDATION] ❌ ${validationResult}`)
      sendResponse({ type: 'error', data: validationResult })
      return true
    }

    // call controller method
    const controllerPromise = controllersMap[requestData.method](...requestData.parameters)

    // handle controller response
    controllerPromise
      .then((returnData: unknown) => {
        const responseData: WorkerResponse = { type: 'response', data: returnData }
        console.log('[RESPONSE]', responseData)
        sendResponse(responseData)
      })
      .catch((error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : String(error)
        const responseData: WorkerResponse = { type: 'error', data: errorMessage }
        console.log(`[REQUEST-ERROR] ❌ Error while executing ${requestData.type}: ${errorMessage}`)
        sendResponse(responseData)
      })

    // Return true to keep the channel open
    return true
  }
}

