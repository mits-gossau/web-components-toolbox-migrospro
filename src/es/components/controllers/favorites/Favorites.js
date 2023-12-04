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
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
    this.abortController = null
  }

  connectedCallback () {
    document.body.addEventListener(this.getAttribute('request-list-favorites') || 'request-list-favorites', this.requestListFavoritesEventListener)
  }

  disconnectedCallback () {
    document.body.removeEventListener(this.getAttribute('request-list-favorites') || 'request-list-favorites', this.requestListFavoritesEventListener)
  }

  requestListFavoritesEventListener (event) {
    console.log('controller value:', event.detail)
    if (this.abortController) this.abortController.abort()
    this.abortController = new AbortController()
    const fetchOptions = {
      method: 'GET',
      signal: this.abortController.signal
    }

    // @ts-ignore
    // TODO: Change API
    const endpoint = `${self.Environment.getApiBaseUrl('migrospro').apiGetAllFavoriteOrders}`
    this.dispatchEvent(new CustomEvent(this.getAttribute('list-favorites') || 'list-favorites', {
      detail: {
        fetch: fetch(endpoint, fetchOptions).then(async response => {
          if (response.status >= 200 && response.status <= 299) return await response.json()
          throw new Error(response.statusText)
        })
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }
}
