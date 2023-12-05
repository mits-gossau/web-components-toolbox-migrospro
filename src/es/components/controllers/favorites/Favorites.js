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
  }

  connectedCallback() {
    document.body.addEventListener(this.getAttribute('request-list-favorites') || 'request-list-favorites', this.requestListFavoritesEventListener)
    document.body.addEventListener(this.getAttribute('request-add-favorite-to-order') || 'request-add-favorite-to-order', this.requestAddToFavoritesEventListener)
  }

  disconnectedCallback() {
    document.body.removeEventListener(this.getAttribute('request-list-favorites') || 'request-list-favorites', this.requestListFavoritesEventListener)
    document.body.removeEventListener(this.getAttribute('request-add-favorite-to-order') || 'request-add-favorite-to-order', this.requestAddToFavoritesEventListener)
  }

  async requestListFavoritesEventListener(event) {
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

  requestAddToFavoritesEventListener = (event) => {
    console.log("update");
  }
}
