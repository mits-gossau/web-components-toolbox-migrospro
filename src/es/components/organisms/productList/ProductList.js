// @ts-check
import { Shadow } from "../../web-components-toolbox/src/es/components/prototypes/Shadow.js";

/**
 * ProductList
 * An example at: src/es/components/pages/Benutzerprofil.html?tab=favorites
 *
 * @export
 * @class ProductList
 * @type {CustomElementConstructor}
 */

export default class ProductList extends Shadow() {
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.answerEventNameListener = (event) => {
      this.renderHTML(event.detail)
    }
  }

  connectedCallback() {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.productsLoaded) this.renderHTML()

    document.body.addEventListener(
      this.getAttribute('answer-event-name') || 'answer-event-name',
      this.answerEventNameListener
    )
    
    this.dispatchEvent(
      new CustomEvent(this.getAttribute('request-event-name'), {
        bubbles: true,
        cancelable: true,
        composed: true
      })
    )
  }

  disconnectedCallback() {
    document.body.removeEventListener(
      this.getAttribute('answer-event-name') || 'answer-event-name',
      this.answerEventNameListener
    )
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS() {
    return !this.root.querySelector(
      `:host > style[_css], ${this.tagName} > style[_css]`
    )
  }

  renderCSS() {
    this.css = /* css */ `
      :host {

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

  renderHTML(data) {
    const fetchModules = this.fetchModules([
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/molecules/productCard/ProductCard.js`,
        name: "m-product-card",
      },
    ])

    return Promise.all([fetchModules]).then(() => {
      let products = ""

      data.products.forEach((product) => {
        products += /* html */ `
          <m-product-card 
            is-logged-in="true"
            is-selectable="true"
            data='${JSON.stringify(product)}'
          ></m-product-card>
        `
      })

      this.html = ""
      this.html = products
    });
  }
}
