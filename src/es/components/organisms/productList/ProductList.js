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
    super({ importMetaUrl: import.meta.url, ...options }, ...args);

    const endpoint = this.getAttribute("endpoint");
    const token = this.getAttribute("token");

    async function fetchData() {
      try {
        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    }

    fetchData()
      .then((data) => {
        this.renderHTML(data);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }

  connectedCallback() {
    if (this.shouldRenderCSS()) this.renderCSS();
  }

  disconnectedCallback() {}

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS() {
    return !this.root.querySelector(
      `:host > style[_css], ${this.tagName} > style[_css]`
    );
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
    `;
  }

  renderHTML(data) {
    console.log(this.importMetaUrl)
    const fetchModules = this.fetchModules([
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/molecules/productCard/ProductCard.js`,
        name: "m-product-card",
      },
    ]);

    return Promise.all([fetchModules]).then(() => {
      let products = ""

      data.products.forEach((product) => {
        console.log(JSON.stringify(product))
        products += /* html */ `
          <m-product-card 
            is-logged-in="true"
            is-selectable="true"
            data='${JSON.stringify(product)}'
          ></m-product-card>
        `
      })

      console.log(products)

      this.html = ""
      this.html = products
    });
  }
}
