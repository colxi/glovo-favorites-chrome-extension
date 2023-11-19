import { api } from './../../api'
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
  const products = querySelectorAllStrict(document, '.product-row')
  for (const productEl of products) {
    // set the favorite-product attribute to product
    const productDetails = await getProductDetails(productEl)
    productEl.setAttribute('favorite-product', `${productDetails.isInFavorites}`)

    // create the add to favorite button
    const heartRedUrl = chrome.runtime.getURL('./dist/glovo-web/heart_red.png')
    const addToFavoritesButtonEl = document.createElement('div')
    addToFavoritesButtonEl.className = 'favorite-button'
    addToFavoritesButtonEl.innerHTML = `<img src="${heartRedUrl}" class="favorite-button__icon" />`
    const buttonsContainerEl = querySelectorStrict(productEl, '.product-row__bottom')
    const addProductToCartButtonEl = querySelectorStrict(productEl, '.product__button')

    // TODO: Investigate why the button is not inserted when the product has been
    // added to the cart.
    try {
      buttonsContainerEl.insertBefore(addToFavoritesButtonEl, addProductToCartButtonEl)
    } catch (e) {
      console.log(
        '❌',
        e instanceof Error ? e.message : String(e),
        { buttonsContainerEl, addToFavoritesButtonEl, addProductToCartButtonEl }
      )
    }

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
    productEl.setAttribute('favorite-product', 'false')
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
        name: storeDetails.name,
        products: [{ name: productDetails.name, image: productDetails.imageUrl }]
      })
    }
    productEl.setAttribute('favorite-product', 'true')
  }
}
