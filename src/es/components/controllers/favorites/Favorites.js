// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/* global fetch */
/* global CustomEvent */
/* global self */

/**
 * Favorites
 * @export
 * @class Favorites
 * @type {CustomElementConstructor}
 */
export default class Favorites extends Shadow() {
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
    this.abortController = null
    this.abortAddToFavoriteController = null
  }

  connectedCallback() {
    document.body.addEventListener(this.getAttribute('request-list-favorites') || 'request-list-favorites', this.requestListFavoritesEventListener)
    document.body.addEventListener(this.getAttribute('request-add-favorite-to-order') || 'request-add-favorite-to-order', this.requestAddToFavoritesEventListener)
    document.body.addEventListener(this.getAttribute('delete-favorite-product-from-favorite-list') || 'delete-favorite-product-from-favorite-list', this.deleteFavoriteFromFavoriteListEventListener)
  }

  disconnectedCallback() {
    document.body.removeEventListener(this.getAttribute('request-list-favorites') || 'request-list-favorites', this.requestListFavoritesEventListener)
    document.body.removeEventListener(this.getAttribute('request-add-favorite-to-order') || 'request-add-favorite-to-order', this.requestAddToFavoritesEventListener)
    document.body.removeEventListener(this.getAttribute('delete-favorite-product-from-favorite-list') || 'delete-favorite-product-from-favorite-list', this.deleteFavoriteFromFavoriteListEventListener)
  }

  requestListFavoritesEventListener = async (event) => {
    if (this.abortController) this.abortController.abort()
    this.abortController = new AbortController()
    const fetchOptions = {
      method: 'GET',
      signal: this.abortController.signal
    }

    // @ts-ignore
    const api = [`${self.Environment.getApiBaseUrl('migrospro').apiGetAllFavoriteOrders}`, `${self.Environment.getApiBaseUrl('migrospro').apiGetAllFavorites}`]
    
    this.dispatchEvent(new CustomEvent(this.getAttribute('list-favorites') || 'list-favorites', {
      detail: {
        fetch: Promise.all(api.map(async url => {
          const response = await fetch(url, fetchOptions)
          if (response.status >= 200 && response.status <= 299) return await response.json()
          throw new Error(response.statusText)
        }))
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  requestAddToFavoritesEventListener = async (event) => {
    const orderId = event.detail.tags[0]
    const favoriteList = this.root.querySelector('o-migrospro-favorites')
    const productCards = favoriteList.root.querySelectorAll('m-product-card')
    const selectedProducts = Array.from(productCards).map(product => {
      if (product.hasAttribute('selected')) {
        return product.getAttribute('id')
      } else {
        return 
      }
    }).filter(e => e).toString()

    if (this.abortAddToFavoriteController) this.abortAddToFavoriteController.abort()
    this.abortAddToFavoriteController = new AbortController()
    const fetchOptions = {
      method: 'GET',
      signal: this.abortAddToFavoriteController.signal
    }

    if (orderId && selectedProducts) {
      // @ts-ignore
      const endpoint = `${self.Environment.getApiBaseUrl('migrospro').apiAddFavoritesToOrder}?orderId=${orderId}&mapiProductIds=${selectedProducts}`

      this.dispatchEvent(new CustomEvent(this.getAttribute('update-add-to-favorite') || 'update-add-to-favorite', {
        detail: {
          fetch: fetch(endpoint, fetchOptions).then(async response => {
            if (response.status >= 200 && response.status <= 299) {
              this.dispatchEvent(new CustomEvent('request-basket',
                {
                  bubbles: true,
                  cancelable: true,
                  composed: true
                }
              ))

              this.renderNotification("c-favorite", "Ajouté avec succès au panier", { top: "4em", right: "2em" })

              //clear the selectedProducts and the checked checkboxes
              Array.from(productCards).map(product => {
                product.removeAttribute("selected")
                product.root.querySelector('#selectCheckbox').checked = false
              })
            }
            throw new Error(response.statusText)
          })
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }))
    }
    return
  }

  deleteFavoriteFromFavoriteListEventListener = async (event) => {
    const productId = event.detail.tags[0]

    if (this.abortAddToFavoriteController) this.abortAddToFavoriteController.abort()
    this.abortAddToFavoriteController = new AbortController()
    const fetchOptions = {
      method: 'GET',
      signal: this.abortAddToFavoriteController.signal
    }

    // @ts-ignore
    const endpoint = `${self.Environment.getApiBaseUrl('migrospro').apiDeleteFromFavoriteList}?mapiProductId=${productId}`

    fetch(endpoint, fetchOptions).then(async response => {
      if (response.status >= 200 && response.status <= 299) {
        this.requestListFavoritesEventListener()
        return
      }
      throw new Error(response.statusText)
    })
  }

  renderNotification(dependsElementName, description, position, renderingDuration = 4000, type = "success",) {
    if (dependsElementName && description) {
      const chainedElement = document.querySelector(`${dependsElementName}`)
      const systemNotificationWrapper = document.createElement("div")
      systemNotificationWrapper.innerHTML = /* html */ `
      <m-system-notification>
        <style>
        :host {
          position: absolute;
          z-index: 5555;
          width: auto;
        }
        :host .description {
          padding: 0.5 !important;
          display: flex;
        }
        :host .description p {
          margin: 0 0 0 1em;
        }
        </style>
        <div class="description" slot="description">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="#2E5C23" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p>${description}</p>
        </div>
      </m-system-notification>
      `
      const systemNotificationElement = systemNotificationWrapper.querySelector("m-system-notification")

      if (systemNotificationElement) {
        // @ts-ignore
        systemNotificationElement.style.top = position.top || "";
        // @ts-ignore
        systemNotificationElement.style.right = position.right || "";
        // @ts-ignore
        systemNotificationElement.style.bottom = position.bottom || "";
        // @ts-ignore
        systemNotificationElement.style.left = position.left || "";
        systemNotificationElement.setAttribute("type", type)
        systemNotificationWrapper.setAttribute("role", "alert")
      }

      chainedElement?.prepend(systemNotificationWrapper)
      // remove notification
      setTimeout(() => {
        chainedElement?.removeChild(systemNotificationWrapper)
      }, renderingDuration);
    }
    return
  }
}
