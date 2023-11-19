import { DB_STORE_NAME, DB_NAME } from '../config'

export function initDatabase(): void {
  // Open (or create) the database and Create the schema (if not created yet)
  const open = indexedDB.open(DB_NAME, 1)
  open.onupgradeneeded = function () {
    const db = open.result
    db.createObjectStore(DB_STORE_NAME, { keyPath: 'id' })
  }
}

export async function getDatabaseConnection(): Promise<IDBDatabase> {
  return await new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onsuccess = () => { resolve(request.result) }
    request.onerror = () => { reject(request.error) }
  })
}

export async function getAllDatabaseEntries<T>(): Promise<T[]> {
  const db = await getDatabaseConnection()
  return await new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE_NAME, 'readwrite')
    const store = tx.objectStore(DB_STORE_NAME)
    const request = store.getAll()
    request.onsuccess = () => { resolve(request.result) }
    request.onerror = () => { reject(request.error) }
    tx.oncomplete = () => { db.close() }
  })
}

export async function addToDatabase(data: object): Promise<IDBValidKey> {
  const db = await getDatabaseConnection()
  return await new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE_NAME, 'readwrite')
    const store = tx.objectStore(DB_STORE_NAME)
    const request = store.put(data)
    request.onsuccess = () => { resolve(request.result) }
    request.onerror = () => { reject(request.error) }
    tx.oncomplete = () => { db.close() }
  })
}

export async function deleteFromDatabase(id: string): Promise<void> {
  const db = await getDatabaseConnection()
  await new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE_NAME, 'readwrite')
    const store = tx.objectStore(DB_STORE_NAME)
    const request = store.delete(id)
    request.onsuccess = () => { resolve(undefined) }
    request.onerror = () => { reject(request.error) }
    tx.oncomplete = () => { db.close() }
  })
}
