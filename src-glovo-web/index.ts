import { initLocationWatcher } from './utils/location-watcher'
import { integrateExtensionInStorePage } from './integrations/store-page'

initLocationWatcher(integrateExtension)

async function integrateExtension(): Promise<void> {
  const isStorePage = Boolean(document.querySelector('.app-wrapper section.store'))
  if (isStorePage) await integrateExtensionInStorePage()
}
