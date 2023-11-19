import { PRODUCT_ROW, PRODUCT_ROW_BUTTONS_WRAPPER, ADD_PRODUCT_TO_CART_BUTTON } from './selectors'
import { api } from '@packages/worker-api'
import { uuid } from './../../utils/uuid'
import { querySelectorAllStrict, querySelectorStrict } from '../../utils/query-selector'
import {
  getCurrentStoreDetails,
  getProductDetails,
  isAlreadyIntegrated,
  isStorePage
} from './helpers'
import { throwError } from '../../utils/throw-error'

export async function integrateExtensionInStorePage(): Promise<void> {
  // only integrate on the store page, and if not already integrated
  if (!isStorePage()) throw new Error('Integrator only compatible with store page')
  if (isAlreadyIntegrated()) return

  // iterate all products on the page
  const products = querySelectorAllStrict(document, PRODUCT_ROW)
  for (const productEl of products) {
    // set the favorite-product attribute to product
    const productDetails = await getProductDetails(productEl)
    productEl.setAttribute('is-favorite', `${productDetails.isInFavorites}`)

    // create the add to favorite button
    const addToFavoritesButtonEl = document.createElement('img')
    addToFavoritesButtonEl.src = chrome.runtime.getURL('./dist/glovo-web/heart_red.png')
    addToFavoritesButtonEl.className = 'add_product_to_favorite__button'
    const addToFavoritesContainerEl = document.createElement('div')
    addToFavoritesContainerEl.className = 'add_product_to_favorite__wrapper'
    addToFavoritesContainerEl.appendChild(addToFavoritesButtonEl)
    const buttonsContainerEl = querySelectorStrict(productEl, PRODUCT_ROW_BUTTONS_WRAPPER)
    const addProductToCartButtonEl = querySelectorStrict(productEl, ADD_PRODUCT_TO_CART_BUTTON)
    buttonsContainerEl.insertBefore(addToFavoritesContainerEl, addProductToCartButtonEl)

    // add the click event listener
    addToFavoritesButtonEl.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      onAddProductToFavoritesButtonClick(productEl).catch(throwError)
    })
  }
}

async function onAddProductToFavoritesButtonClick(productEl: HTMLElement): Promise<void> {
  const storeDetails = await getCurrentStoreDetails()
  const productDetails = await getProductDetails(productEl)

  // if product is in favorites, remove it
  if (productDetails.isInFavorites) {
    await api.removeProductFromStoreFavorites(storeDetails.url, productDetails.name)
    productEl.setAttribute('is-favorite', 'false')
  }
  // if product is not in favorites add it...
  else {
    // If store is in favorites, append the product to it
    if (storeDetails.isInFavorites) {
      await api.addProductToStoreFavorites(
        storeDetails.url,
        { name: productDetails.name, image: productDetails.imageUrl }
      )
    }
    // if not, add store to favorites with the product
    else {
      await api.addStoreToFavorites({
        id: uuid(),
        url: storeDetails.url,
        image: storeDetails.image,
        name: storeDetails.name,
        products: [{ name: productDetails.name, image: productDetails.imageUrl }]
      })
    }
    productEl.setAttribute('is-favorite', 'true')
  }
}
