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
    document.body.addEventListener(this.getAttribute('add-wishlist') || 'add-wishlist', this.addWishlistListener)
    document.body.addEventListener(this.getAttribute('list-product') || 'list-product', this.listProductListener)
    document.body.addEventListener(this.getAttribute('product-viewed') || 'product-viewed', this.viewProductListener)
    document.body.addEventListener(this.getAttribute('request-basket') || 'request-basket', this.requestListBasketListener)
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    document.body.removeEventListener(this.getAttribute('add-basket') || 'add-basket', this.addBasketListener)
    document.body.removeEventListener(this.getAttribute('remove-basket') || 'remove-basket', this.removeBasketListener)
    document.body.removeEventListener(this.getAttribute('add-wishlist') || 'add-wishlist', this.addWishlistListener)
    document.body.removeEventListener(this.getAttribute('list-product') || 'list-product', this.listProductListener)
    document.body.removeEventListener(this.getAttribute('product-viewed') || 'product-viewed', this.viewProductListener)
    document.body.removeEventListener(this.getAttribute('request-basket') || 'request-basket', this.requestListBasketListener)
  }

  basketListener = (event, action) => {
    event.detail.tags.forEach((el) => {
      const item = this.items?.find((element) => element.item_id === el)
      const schema = {
        item_id: "SKU_12345",
        item_name: "Stan and Friends Tee",
        affiliation: "Google Merchandise Store",
        coupon: "SUMMER_FUN",
        discount: 2.22,
        index: 0,
        item_brand: "Google",
        item_category: "Apparel",
        item_category2: "Adult",
        item_category3: "Shirts",
        item_category4: "Crew",
        item_category5: "Short sleeve",
        item_list_id: "related_products",
        item_list_name: "Related Products",
        item_variant: "green",
        location_id: "ChIJIQBpAG2ahYAR_6128GcTUEo",
        price: 9.99,
        quantity: 1,
      }

      const schemaItem = this.loop(schema, item)
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
    }).catch((error) => {
      console.error(error)
    })
  }

  viewProductListener = (event) => {
    const viewedItems = []
    event.detail.fetch.then((productData) => {
      productData[0].products.forEach((item) => {
        const schema = {
          item_id: "SKU_12345",
          item_name: "Stan and Friends Tee",
          affiliation: "Google Merchandise Store",
          coupon: "SUMMER_FUN",
          discount: 2.22,
          index: 0,
          item_brand: "Google",
          item_category: "Apparel",
          item_category2: "Adult",
          item_category3: "Shirts",
          item_category4: "Crew",
          item_category5: "Short sleeve",
          item_list_id: "related_products",
          item_list_name: "Related Products",
          item_variant: "green",
          location_id: "ChIJIQBpAG2ahYAR_6128GcTUEo",
          price: 9.99,
          quantity: 1,
        }

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

        viewedItems.push(this.loop(schema, viewItem))
      })

      const viewItemList = {
        event: 'view_item_list',
        ecommerce: {
          item_list_id: 'related_products',
          item_name: 'Related Products',
          items: viewedItems
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

  loop (schema, obj) {
    const resultObject = {}
    for (const key in schema) {
      if (Object.hasOwnProperty.call(schema, key)) resultObject[key] = typeof schema[key] === 'object'
        ? this.loop(schema[key], obj[key] || {})
        : obj[key] || ''
    }
    return resultObject
  }
}
