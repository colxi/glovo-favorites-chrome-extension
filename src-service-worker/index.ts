import { workerPublicMethodsMap } from './controllers/index'
import { initCommunicationClient } from './client'
import { initDatabase } from './database'
import { initConnectionsTracker } from './connection-tracker'

console.log('[INFO] Service worker started!')

initDatabase()
initConnectionsTracker()
initCommunicationClient(workerPublicMethodsMap)
