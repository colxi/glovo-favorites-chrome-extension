import type { Method } from '@types'
import { createRequestHandler } from './request-handler'

export function initCommunicationClient(controllersMap: Record<string, Method>): void {
  const onMessage = createRequestHandler(controllersMap)
  chrome.runtime.onMessage.addListener(onMessage)
}
