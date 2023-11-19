import { api } from './../api/index'
import type { Method } from '@types'
import debounce from 'debounce'
import { WEB_INIT_CALLBACK_DELAY, WEB_ROOT_NODE_ID } from '../config'
import { throwError } from './throw-error'

export function initLocationWatcher(onLocationChangeHandler: Method): void {
  // initialize it with an empty string to ensure fist call is not rejected
  let currentLocation: string = ''

  // debounced wrapped for the handler
  const debouncedOnLocationChangeHandler = debounce(
    async () => {
      const activeNetworkConnections = await api.getActiveNetworkConnections()
      if (currentLocation !== document.location.href && activeNetworkConnections === 0) {
        currentLocation = document.location.href
        onLocationChangeHandler()
      }
    },
    WEB_INIT_CALLBACK_DELAY
  ) as Method

  // observe mutations of the root element and check if the location has changed
  // after those mutations. If so, call the callback
  const mutationObserver = new MutationObserver(() => debouncedOnLocationChangeHandler().catch(throwError))
  const rootElement: HTMLElement | null = document.getElementById(WEB_ROOT_NODE_ID)
  if (!rootElement) throw new Error(`Root element with id ${WEB_ROOT_NODE_ID} not found`)
  mutationObserver.observe(rootElement, { childList: true, subtree: true })

  // observe network activity
  const performanceObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries()
    for (const entry of entries) {
      if (entry.entryType === 'resource') {
        debouncedOnLocationChangeHandler()
        break
      }
    }
  })
  performanceObserver.observe({ type: 'resource', buffered: true })

  // initial call to the handler
  debouncedOnLocationChangeHandler()
}
