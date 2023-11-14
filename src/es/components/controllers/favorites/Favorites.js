// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * Favorites
 * @export
 * @class Favorites
 * @type {CustomElementConstructor}
 */
export default class Favorites extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    document.body.addEventListener(this.getAttribute('request-list-favorites') || 'request-list-favorites', this.requestListFavoritesEventListener)
  }

  disconnectedCallback () {
    document.body.removeEventListener(this.getAttribute('request-list-favorites') || 'request-list-favorites', this.requestListFavoritesEventListener)
  }

  requestListFavoritesEventListener (event) {
    console.log('controller value:', event.detail)
  }
}
