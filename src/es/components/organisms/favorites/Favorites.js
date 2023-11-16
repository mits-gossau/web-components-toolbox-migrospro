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
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
    if (this.selection) this.selection.addEventListener('change', this.selectEventListener)
    document.body.addEventListener(this.getAttribute('answer-event-name') || 'answer-event-name', this.answerEventNameListener)
    this.dispatchEvent(new CustomEvent('request-list-favorites',
      {
        detail: {
          this: this,
          favorite: 'EMPTY'
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }
    ))
  }

  disconnectedCallback () {
    this.selection.removeEventListener('change', this.selectEventListener)
    document.body.removeEventListener(this.getAttribute('answer-event-name') || 'answer-event-name', this.answerEventNameListener)
  }

  answerEventNameListener = (event) => {
    console.log('event list favorites', event)
  }

  selectEventListener (event) {
    this.dispatchEvent(new CustomEvent('request-list-favorites',
      {
        detail: {
          this: this,
          favorite: event.target.value
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }
    ))
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
 * evaluates if a render is necessary
 *
 * @return {boolean}
 */
  shouldRenderHTML () {
    return !this.selection
  }

  renderCSS () {
    this.css = /* css */ `
      :host {
        display:block;
      }
      :host .product-list {
        margin: 1.25rem 0;
      }
      :host .no-products {
        display: flex;
        justify-content: center;
        align-items: center;
        border-top: 1px solid var(--m-black);
      }
    `
  }

  // TODO: Reflect on the parameters again
  renderHTML (data = { products: [] }) {
    const fetchModules = this.fetchModules([
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/molecules/productCard/ProductCard.js`,
        name: 'm-product-card'
      }
    ])

    return Promise.all([fetchModules]).then(() => {
      let products = ''

      data.products.forEach(product => {
        products += /* html */ `
        <m-product-card 
        is-logged-in="true"
        is-selectable="true"
        data='${JSON.stringify(product)}'
        ></m-product-card>
        `
      })

      console.log('--', products)
      const nested = this.html
      this.html = ''
      this.html = nested
    })
  }

  get selection () {
    return this.root.querySelector('select') || null
  }
}
