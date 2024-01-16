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
// @ts-ignore
export default class MigrosProTagManager extends TagManager {
  constructor () {
    super()

    this.itemSchema = {
      item_id: '',
      item_name: '',
      affiliation: '',
      coupon: '',
      discount: 0.00,
      index: 0,
      item_brand: '',
      item_category: '',
      item_category2: '',
      item_category3: '',
      item_category4: '',
      item_category5: '',
      item_list_id: '',
      item_list_name: '',
      item_variant: '',
      location_id: '',
      price: 0.00,
      quantity: 1
    }
  }

  connectedCallback () {
    super.connectedCallback()
    document.body.addEventListener(this.getAttribute('add-basket') || 'add-basket', this.addBasketListener)
    document.body.addEventListener(this.getAttribute('remove-basket') || 'remove-basket', this.removeBasketListener)
    // document.body.addEventListener(this.getAttribute('add-wishlist') || 'add-wishlist', this.addWishlistListener)
    document.body.addEventListener(this.getAttribute('list-product') || 'list-product', this.listProductListener)
    document.body.addEventListener(this.getAttribute('product-clicked') || 'product-clicked', this.clickProductListener)
    document.body.addEventListener(this.getAttribute('product-viewed') || 'product-viewed', this.viewProductListener)
    // document.body.addEventListener(this.getAttribute('request-basket') || 'request-basket', this.requestListBasketListener)
    // document.body.addEventListener(this.getAttribute('list-basket') || 'list-basket', this.listBasketListener)
    // document.body.addEventListener(this.getAttribute('submit-order') || 'submit-order', this.submitOrderListener)
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    document.body.removeEventListener(this.getAttribute('add-basket') || 'add-basket', this.addBasketListener)
    document.body.removeEventListener(this.getAttribute('remove-basket') || 'remove-basket', this.removeBasketListener)
    // document.body.removeEventListener(this.getAttribute('add-wishlist') || 'add-wishlist', this.addWishlistListener)
    document.body.removeEventListener(this.getAttribute('list-product') || 'list-product', this.listProductListener)
    document.body.removeEventListener(this.getAttribute('product-clicked') || 'product-clicked', this.clickProductListener)
    document.body.removeEventListener(this.getAttribute('product-viewed') || 'product-viewed', this.viewProductListener)
    // document.body.removeEventListener(this.getAttribute('request-basket') || 'request-basket', this.requestListBasketListener)
    // document.body.removeEventListener(this.getAttribute('list-basket') || 'list-basket', this.listBasketListener)
    // document.body.removeEventListener(this.getAttribute('submit-order') || 'submit-order', this.submitOrderListener)
  }

  basketListener = (event, action) => {
    event.detail.tags.forEach((el) => {
      const item = this.items?.find((element) => element.item_id === el)

      const schemaItem = this.loop(this.itemSchema, item)
      if (action === 'add_to_cart' || action === 'add_to_wishlist') schemaItem.quantity = 1

      if (item) {
        const eventToCart = {
          event: action,
          ecommerce: {
            currency: 'CHF',
            value: parseFloat(item.price),
            items: [schemaItem]
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
    this.basketListener(event, 'remove_from_cart')
  }

  addWishlistListener = (event) => {
    this.basketListener(event, 'add_to_wishlist')
  }

  requestListBasketListener = (event) => {
    console.log('requestListBasketListener', event)
  }

  listBasketListener = (event) => {
    console.log('listBasketListener', event)
  }

  submitOrderListener = (event) => {
    console.log('submitOrderListener', event)
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
    }).catch((error) => {
      console.error(error)
    })
  }

  clickProductListener = (event) => {
    const clickedItem = {
      item_id: event.detail.data.id,
      item_name: event.detail.data.name,
      item_brand: event.detail.data.brand,
      price: parseFloat(event.detail.data.price),
      unit_price: event.detail.data.unit_price,
      vat: {
        vat_rate_id: event.detail.data.vat.id,
        vat_rate: event.detail.data.vat.percentage
      }
    }

    const selectItem = {
      event: 'select_item',
      ecommerce: {
        item_list_id: 'related_products',
        item_list_name: 'Related Products',
        items: [this.loop(this.itemSchema, clickedItem)]
      }
    }

    this.sendEvent(selectItem)
  }

  viewProductListener = (event) => {
    const viewedItems = []
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

        viewedItems.push(this.loop(this.itemSchema, viewItem))
      })

      const viewItemList = {
        event: 'view_item_list',
        ecommerce: {
          item_list_id: 'related_products',
          item_list_name: 'Related Products',
          items: viewedItems
        }
      }

      this.sendEvent(viewItemList)
    }).catch((error) => {
      console.warn(error)
    })
  }
/**
 *
 *
 * @param {*} eventData
 * @memberof MigrosProTagManager
 */
sendEvent (eventData) {
    // @ts-ignore
    const dataLayer = window.dataLayer

    if (typeof window !== 'undefined' && dataLayer && eventData) {
      try {
        console.log('sendEvent', eventData)
        dataLayer.push(eventData)
      } catch (err) {
        console.error('Failed to push event data:', err)
      }
    }
  }

  loop (schema, obj) {
    const resultObject = {}
    for (const key in schema) {
      if (Object.hasOwnProperty.call(schema, key)) {
        resultObject[key] = typeof schema[key] === 'object'
          ? this.loop(schema[key], obj[key] || {})
          : obj[key] || ''
      }
    }
    return resultObject
  }
}
