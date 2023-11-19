import type { StoreDetails, ProductDetails } from './types'
import { querySelectorStrict, querySelectorAllStrict } from '../../utils/query-selector'
import { api } from './../../api'

export function isStorePage(): boolean {
  const result = querySelectorStrict(document, '.app-wrapper section.store')
  return Boolean(result)
}

export function isAlreadyIntegrated(): boolean {
  return querySelectorAllStrict(document, '.favorite-button').length > 0
}

export async function getCurrentStoreDetails(): Promise<StoreDetails> {
  const storeTitleEl = querySelectorStrict(document, 'h1.store-info__title')
  const storeUrl = location.href.split('?')[0]
  const isStoreInFavorites = await api.isStoreInFavorites(storeUrl)

  return {
    url: storeUrl,
    name: storeTitleEl.innerText,
    isInFavorites: isStoreInFavorites
  }
}

export async function getProductDetails(productEl: HTMLElement): Promise<ProductDetails> {
  const storeDetails = await getCurrentStoreDetails()
  const productImageEl = querySelectorStrict<HTMLImageElement>(document, '.product-row__picture')
  const productTitleEl = querySelectorStrict(productEl, '.product-row__name>span>span')
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
