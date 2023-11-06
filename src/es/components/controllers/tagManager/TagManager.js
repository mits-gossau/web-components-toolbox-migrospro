// @ts-check
import TagManager from '../../web-components-toolbox/src/es/components/controllers/tagManager/TagManager.js'

/**
 * Example at: /src/es/components/pages/TrackingTest.html
 *
 * @export
 * @class MigrosProTagManager
 * @type {CustomElementConstructor}
 * @attribute {
 *  {string} id
 *  {boolean} test-mode
 *  {has} [wc-config-load=n.a.] trigger the render
 *  {number} [timeout=n.a.] timeout to trigger the render
 * }
 * @example {
    <c-migrospro-tag-manager id="GTM-XXXXXX" test-mode="true" wc-config-load>
      <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXX" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    </c-migrospro-tag-manager>
 * }
 */
export default class MigrosProTagManager extends TagManager {
  connectedCallback () {
    super.connectedCallback()
    document.body.addEventListener(this.getAttribute('add-basket') || 'add-basket', this.addBasketListener)
    document.body.addEventListener(this.getAttribute('remove-basket') || 'remove-basket', this.removeBasketListener)
    // document.body.addEventListener(this.getAttribute('list-product') || 'list-product', this.listProductListener)
    document.body.addEventListener(this.getAttribute('product-viewed') || 'product-viewed', this.listProductListener)
    document.body.addEventListener(this.getAttribute('request-basket') || 'request-basket', this.requestListBasketListener)
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    document.body.removeEventListener(this.getAttribute('add-basket') || 'add-basket', this.addBasketListener)
    document.body.removeEventListener(this.getAttribute('remove-basket') || 'remove-basket', this.removeBasketListener)
    // document.body.removeEventListener(this.getAttribute('list-product') || 'list-product', this.listProductListener)
    document.body.removeEventListener(this.getAttribute('product-viewed') || 'product-viewed', this.listProductListener)
    document.body.removeEventListener(this.getAttribute('request-basket') || 'request-basket', this.requestListBasketListener)
  }

  basketListener = (event, action) => {
    event.detail.tags.forEach((el) => {
      const item = this.items?.find((element) => element.item_id === el)

      if (item) {
        const eventToCart = {
          event: action,
          ecommerce: {
            items: [item]
          }
        }

        this.sendEvent(eventToCart)
      }
    })
  }

  addBasketListener = (event) => {
    this.basketListener(event, 'add_to_cart')
  }

  removeBasketListener = (event) => {
    this.basketListener(event, 'remove_to_cart')
  }

  requestListBasketListener = (event) => {
    console.log(event)
  }

  listProductListener = (event) => {
    /**
      * @typedef {Object} VAT
      * @property {any} vat_rate_id
      * @property {any} vat_rate
      */

    /**
      * @typedef {Object} Item
      * @property {any} item_id
      * @property {any} item_name
      * @property {any} item_brand
      * @property {any} price
      * @property {any} unit_price
      * @property {VAT} vat
      */

    /** @type {Item[]} */
    this.items = []

    event.detail.fetch.then((productData) => {
      productData[0].products.forEach((item) => {
        const viewItem = {
          item_id: item.id,
          item_name: item.name,
          item_brand: item.brand,
          price: parseFloat(item.price),
          unit_price: item.unit_price,
          vat: {
            vat_rate_id: item.vat.id,
            vat_rate: item.vat.percentage
          }
        }

        this.items?.push(viewItem)
      })

      const viewItemList = {
        event: 'view_item_list',
        ecommerce: {
          item_list_id: 'related_products',
          item_name: 'Related Products',
          items: this.items
        }
      }

      this.sendEvent(viewItemList)
    }).catch((error) => {
      console.warn(error)
    })
  }

  sendEvent (eventData) {
    // @ts-ignore
    const dataLayer = window.dataLayer

    if (typeof window !== 'undefined' && dataLayer && eventData) {
      try {
        dataLayer.push(eventData)
      } catch (err) {
        console.error('Failed to push event data:', err)
      }
    }
  }
}
