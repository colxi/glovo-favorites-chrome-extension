export type Method = (...args: any[]) => any

export interface StoreDescriptor {
  id: string
  url: string
  name: string
  image: string
  products: StoreProductDescriptor[]
}

export interface StoreProductDescriptor {
  image: string
  name: string
}

export interface WorkerResponse {
  type: 'response' | 'error'
  data: unknown
}

export interface WorkerRequest {
  type: 'request'
  method: string
  parameters: unknown[]
}
