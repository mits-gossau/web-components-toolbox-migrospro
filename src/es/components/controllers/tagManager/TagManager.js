// @ts-check
import TagManager from '../../web-components-toolbox/src/es/components/controllers/tagManager/TagManager.js'

/* global self */

/**
 * Example at: /src/es/components/pages/Home.html
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
    <c-tag-manager id="GTM-XXXXXX" test-mode="true" wc-config-load>
      <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXX" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    </c-tag-manager>
 * }
 */
export default class MigrosProTagManager extends TagManager {
  connectedCallback () {
    super.connectedCallback()
    document.body.addEventListener(this.getAttribute('add-basket') || 'add-basket', this.addBasketListener)
    document.body.addEventListener(this.getAttribute('list-product') || 'list-product', this.listProductListener)
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    document.body.removeEventListener(this.getAttribute('add-basket') || 'add-basket', this.addBasketListener)
    document.body.removeEventListener(this.getAttribute('list-product') || 'list-product', this.listProductListener)
  }

  addBasketListener = (event) => {
    event.detail.tags.forEach((el) => {
      const item = this.items?.find((element) => element.item_id === el)

      if (item) {
        const addToCart = {
          event: 'add_to_cart',
          ecommerce: {
            items: [item] 
          }
        }

        this.sendEvent(addToCart)
      }
    })
  }

  listProductListener = (event) => {
    console.log(event)
    /**
     * @type {{ item_id: any; item_name: any; item_names: { item_name_rpa: any; item_name_sap: any; item_short_name: any; }; item_brand: any; item_category: any; item_variant: any; price: any; unit_price: any; quantity: any; package_size: any; language: any; vat: { vat_rate_id: any; vat_rate: any; }; }[]}
     */
    this.items = []

    event.detail.fetch.then((productData) => {
      

      productData[0].products.forEach((item) => {
        const viewItem = {
          item_id: item.id,
          item_name: item.name,
          item_names: {
            item_name_rpa: item.names.names_rpa,
            item_name_sap: item.names.names_sap,
            item_short_name: item.names.short_name
          },
          item_brand: item.brand,
          item_category: item.category,
          item_variant: item.variant,
          price: item.price,
          unit_price: item.unit_price,
          quantity: item.quantity,
          package_size: item.package_size,
          language: item.language,
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

  sendEvent(eventData) {
    console.log(eventData)

    // @ts-ignore
    const dataLayer = window.dataLayer

    // this.eventData = JSON.parse(this.getAttribute('event-data'))
    // if (event.target.name) this.eventData[event.target.name] = event.target.value

    if (typeof window !== 'undefined' && dataLayer && eventData) {
      try {
        dataLayer.push(eventData)
      } catch (err) {
        console.error("Failed to push event data:", err)
      }
    }
  }
}
