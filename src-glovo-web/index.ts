import { initLocationWatcher } from './utils/location-watcher'
import { integrateExtensionInStorePage } from './integrations/store-page'

initLocationWatcher(integrateExtension)

async function integrateExtension() {
  const isStorePage = Boolean(document.querySelector('.app-wrapper section.store'))
  if (isStorePage) integrateExtensionInStorePage()
}


