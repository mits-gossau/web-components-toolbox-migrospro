// @ts-check
import { Shadow } from "../../web-components-toolbox/src/es/components/prototypes/Shadow.js";

/**
 * Favorites
 * @export
 * @class Favorites
 * @type {CustomElementConstructor}
 */
export default class Favorites extends Shadow() {
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.deleteFromFavoritesAbortController = null

    // select element
    this.select = this.root.querySelector("select#devis")
    
    this.select.addEventListener("change", (event) => {
      console.log(event.target.value)
    })

    // submit button
    this.submit = this.root.querySelector("input[type=submit]")
    this.submit.addEventListener("click", (event) => {
      event.preventDefault()
      console.log(event.target.value)
    })

    this.requestListFavoritesListener = (event) => {
      console.log('requestListFavoritesListener', event.detail)
      // this.dispatchEvent(
      //   new CustomEvent("list-favorites", {
      //     detail: {
      //       fetch: this.fetch,
      //     },
      //     bubbles: true,
      //     cancelable: true,
      //     composed: true,
      //   })
      // )
    }

    const endpoint = "https://api.json-generator.com/templates/hpINMz4yKYqK/data"
    const token = "ojsdbk9lbwewfluj5ujth8kfr0ujzmkmzzgfw5fk"

    async function fetchData() {
      try {
        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        return data
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error
      }
    }

    fetchData()
      .then((data) => {
        this.dispatchEvent(
          new CustomEvent('list-favorites', {
            detail: {
              products: data.products
            },
            bubbles: true,
            cancelable: true,
            composed: true
          })
        )
        handleFavorites()
      })
      .catch((error) => {
        console.error("An error occurred:", error)
      })

    this.productsLoaded = false

    const handleFavorites = () => { 
      const products = this.root.querySelectorAll(".product-item")
      console.log(products)
      products.forEach((product) => {
        console.log(product)
        const checkbox = product.querySelector("input[type=checkbox]")
        checkbox.addEventListener("change", (event) => {
          console.log(event.target.checked)
          console.log(product.dataset.id)
        })
      })
    }
  }

  connectedCallback() {
    this.addEventListener("request-list-favorites", this.requestListFavoritesListener)
    this.addEventListener(this.getAttribute('delete-from-order') || 'delete-from-order', this.deleteFromFavoritesListener)

    
  }

  disconnectedCallback() {
    this.removeEventListener("request-list-favorites", this.requestListFavoritesListener)
    this.removeEventListener(this.getAttribute('delete-from-order') || 'delete-from-order', this.deleteFromFavoritesListener)
  }

  checkProductListener = async (event) => {
    console.log('checkProductListener', event.detail)
  }

  /**
   * delete from favorites
   * @param {{ detail: any; }} event
   */
  deleteFromFavoritesListener = async (event) => {
    console.log('deleteFromFavoritesListener', event.detail)
    // if (this.deleteFromFavoritesAbortController) this.deleteFromFavoritesAbortController.abort()
    // this.deleteFromFavoritesAbortController = new AbortController()
    // const fetchOptions = {
    //   method: 'GET',
    //   signal: this.deleteFromFavoritesAbortController.signal
    // }
    // const productId = event.detail.tags[0]

    // // @ts-ignore
    // const endpoint = `${self.Environment.getApiBaseUrl('migrospro').apiDeleteFromFavorites}?favoritesItemId=${productId}`
    // this.dispatchEvent(new CustomEvent(this.getAttribute('list-favorites') || 'list-favorites', {
    //   detail: {
    //     id: productId,
    //     fetch: fetch(endpoint, fetchOptions).then(async response => {
    //       if (response.status >= 200 && response.status <= 299) return await response.json()
    //       throw new Error(response.statusText)
    //     })
    //   },
    //   bubbles: true,
    //   cancelable: true,
    //   composed: true
    // }))
  }
}
