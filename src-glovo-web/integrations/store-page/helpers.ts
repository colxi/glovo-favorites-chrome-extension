import type { StoreDetails, ProductDetails } from './types'
import { querySelectorStrict, querySelectorAllStrict } from '../../utils/query-selector'
import { api } from '@packages/worker-api'
import {
  ADD_PRODUCT_TO_FAVORITES_BUTTON,
  PRODUCT_IMAGE,
  STORE_IMAGE,
  STORE_NAME,
  PRODUCT_NAME,
  STORE_SECTION_WRAPPER
} from './selectors'

async function imageToBase64(sourceImageUrl: string): Promise<string> {
  return await new Promise((resolve, reject) => {
    const imageEl = new Image()
    imageEl.onload = () => {
      const canvas = document.createElement('canvas')
      const canvasContext = canvas.getContext('2d')
      if (!canvasContext) throw new Error('Could not get canvas context')
      canvasContext.drawImage(imageEl, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }
    imageEl.onerror = (e) => { reject(e) }
    imageEl.setAttribute('crossorigin', 'anonymous')
    imageEl.src = sourceImageUrl
  })
}

export function isStorePage(): boolean {
  const result = querySelectorStrict(document, STORE_SECTION_WRAPPER)
  return Boolean(result)
}

export function isAlreadyIntegrated(): boolean {
  return querySelectorAllStrict(document, ADD_PRODUCT_TO_FAVORITES_BUTTON).length > 0
}

export async function getCurrentStoreDetails(): Promise<StoreDetails> {
  const storeNameEl = querySelectorStrict(document, STORE_NAME)
  const storeImageEl = querySelectorStrict<HTMLSourceElement>(document, STORE_IMAGE)
  const storeUrl = location.href.split('?')[0]
  const isStoreInFavorites = await api.isStoreInFavorites(storeUrl)

  return {
    url: storeUrl,
    name: storeNameEl.innerText,
    image: await imageToBase64(storeImageEl.srcset),
    isInFavorites: isStoreInFavorites
  }
}

export async function getProductDetails(productEl: HTMLElement): Promise<ProductDetails> {
  const storeDetails = await getCurrentStoreDetails()
  const productImageEl = querySelectorStrict<HTMLImageElement>(document, PRODUCT_IMAGE)
  const productTitleEl = querySelectorStrict(productEl, PRODUCT_NAME)
  const isProductInFavorites = await api.isProductInStoreFavorites(
    storeDetails.url,
    productTitleEl.innerText
  )

  return {
    name: productTitleEl.innerText,
    imageUrl: productImageEl.src,
    isInFavorites: isProductInFavorites
  }
}
