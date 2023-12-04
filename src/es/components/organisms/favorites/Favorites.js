// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * Favorites
 * An example at: src/es/components/pages/Benutzerprofil.html?tab=favorites
 *
 * @export
 * @class Favorites
 * @type {CustomElementConstructor}
 */

export default class Favorites extends Shadow() {
  /**
   * @param {any} args
   */
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback() {
    this.hidden = true
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
    this.selection.addEventListener('change', this.selectEventListener)
    document.body.addEventListener(this.getAttribute('answer-event-name') || 'answer-event-name', this.answerEventNameListener)
    this.dispatchEvent(new CustomEvent('request-list-favorites',
      {
        detail: {
          this: this
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }
    ))
  }

  disconnectedCallback() {
    this.selection.removeEventListener('change', this.selectEventListener)
    document.body.removeEventListener(this.getAttribute('answer-event-name') || 'answer-event-name', this.answerEventNameListener)
  }

  answerEventNameListener = (/** @type {{ detail: { fetch: Promise<any>; }; }} */ event) => {
    event.detail.fetch.then((/** @type {{ response: any; }} */ data) => {
      this.renderHTML(data)
    })
  }

  selectEventListener = (/** @type {{ target: { value: any; }; }} */ event) => {
    this.addToOrderBtn.setAttribute('order-id', event.target.value)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS() {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
  */
  shouldRenderHTML() {
    return !this.selection
  }

  renderCSS() {
    this.css = /* css */ `
      :host {
        display:block;
      }
      :host label {
        padding:0 0 calc(var(--content-spacing-mobile) / 2) 0;
      }
      :host .product-list {
        align-items: stretch;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        margin: 1.25rem 0;
      }
      :host .no-products {
        align-items: center;
        border-top: 1px solid var(--m-black);
        display: flex;
        justify-content: center;
      }
    `
  }

  /**
   * @param {undefined} [data]
   */
  renderHTML(data) {
    const fetchModules = this.fetchModules([
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/molecules/productCard/ProductCard.js`,
        name: 'm-product-card'
      }
    ])

    Promise.all([fetchModules]).then(() => {
      this.renderFavoritesContent(data)
    })
  }

  renderFavoritesContent(data) {
    // TODO Talk with JJ
    const orders = data[0].response
    const favorites = data[0].response
    this.renderSelection(orders)
    this.addToOrderBtn.setAttribute('order-id', data[0].id)
    this.html = this.renderFavorites(favorites)
  }

  renderSelection(data) {
    let i = 0
    for (const key in data) {
      const option = document.createElement('option')
      option.value = data[key].id
      option.text = data[key].name
      if (i === 0) option.setAttribute('selected', 'selected')
      this.selection.appendChild(option)
      i++
    }
    if (this.selection.length) this.hidden = false
  }

  renderFavorites(favorites) {
    let HTMLFavorites = '<div class="product-list">'
    favorites.forEach(favorite => {
      HTMLFavorites += /* html */ `
      <m-product-card
        is-logged-in="true"
        is-selectable="true"
        data='${JSON.stringify(favorite)}'
      ></m-product-card>
      `
    })
    HTMLFavorites += "</div>"
    return HTMLFavorites
  }

  get selection() {
    return this.root.querySelector('select') || null
  }

  get addToOrderBtn() {
    return this.root.getElementById('addToOffer') || null
  }
}
