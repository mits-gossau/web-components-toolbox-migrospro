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
    this.root.addEventListener(this.getAttribute('set-all-favorite-products-to-selected') || 'set-all-favorite-products-to-selected', this.setAllFavoriteProductsToSelectedEventListener)
  }

  disconnectedCallback() {
    this.selection.removeEventListener('change', this.selectEventListener)
    document.body.removeEventListener(this.getAttribute('answer-event-name') || 'answer-event-name', this.answerEventNameListener)
    this.root.removeEventListener(this.getAttribute('set-all-favorite-products-to-selected') || 'set-all-favorite-products-to-selected', this.setAllFavoriteProductsToSelectedEventListener)
  }

  answerEventNameListener = (/** @type {{ detail: { fetch: Promise<any>; }; }} */ event) => {
    event.detail.fetch.then((/** @type {{ response: any; }} */ data) => {
      this.renderHTML(data)
    })
  }

  selectEventListener = (/** @type {{ target: { value: any; }; }} */ event) => {
    this.addToOrderBtn.setAttribute('tag', event.target.value)
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
        --product-list-img-max-width: var(--product-list-img-max-width-custom, 8em);
        --product-image-margin: var(--product-image-margin-custom, auto .5em);
        --product-image-margin-mobile: var(--product-image-margin-mobile-custom, auto .5em);
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
   * @param {any | undefined} [data]
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
    const orders = data[0].response
    const favorites = data[1].response.products
    this.renderSelection(orders)
    this.addToOrderBtn.setAttribute('tag', orders[0].id)
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
    const favoriteList = this.root.querySelector(".product-list")
    if (favoriteList) favoriteList.remove()

    let HTMLFavorites = '<div class="product-list">'
    if (favorites && favorites.length > 0) {
      favorites.forEach(favorite => {
          // replace apostrophes because they break JSON
          if (favorite.name != null)
            favorite.name = favorite.name.replaceAll("'","")
          if (favorite.brand != null)
            favorite.brand = favorite.brand.replaceAll("'","")
          if (favorite.package_size != null)
            favorite.package_size = favorite.package_size.replaceAll("'","")

          if (favorite.names != null) {
            if (favorite.names.name_sap != null)
              favorite.names.name_sap = favorite.names.name_sap.replaceAll("'","")
            if (favorite.names.short_name != null)
              favorite.names.short_name = favorite.names.short_name.replaceAll("'","")
            if (favorite.names.name_rpa  != null)	
              favorite.names.name_rpa = favorite.names.name_rpa.replaceAll("'","") 
          }
          
        HTMLFavorites += /* html */ `
        <m-product-card
          is-logged-in="true"
          data='${JSON.stringify(favorite)}'
        ></m-product-card>
        `
      })
    }
    HTMLFavorites += '</div>'
    return HTMLFavorites
  }

  setAllFavoriteProductsToSelectedEventListener() {
    const allProductCardsCheckboxes = Array.from(this.querySelectorAll("m-product-card")).map(pc => pc.shadowRoot.querySelector('input[type="checkbox"]')).filter(checkbox => checkbox)
    // if all checkbox checked set it all not checked
    if (allProductCardsCheckboxes.every(checkbox => checkbox.checked)) {
      allProductCardsCheckboxes.map(checkbox => {
        checkbox.click()
        checkbox.checked = false
      })
      return
    }
    // if not all checkbox checked set it all checked
    if (!allProductCardsCheckboxes.every(checkbox => checkbox.checked)) {
      allProductCardsCheckboxes.map(checkbox => {
        if (!checkbox.checked) {
          checkbox.click()
          checkbox.checked = true
        }
      })
      return
    }
  }

  // orders dropdown
  get selection() {
    return this.root.querySelector('select') || null
  }

  // add btn
  get addToOrderBtn() {
    return this.root.getElementById('addToOffer') || null
  }
}
