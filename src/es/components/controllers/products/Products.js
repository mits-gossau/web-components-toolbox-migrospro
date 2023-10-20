// @ts-check
import { Shadow } from "../../web-components-toolbox/src/es/components/prototypes/Shadow.js";

/**
 * Products
 * @export
 * @class Products
 * @type {CustomElementConstructor}
 */
export default class Products extends Shadow() {
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args);

    this.requestListProductsListener = () => {
      this.dispatchEvent(
        new CustomEvent("list-products", {
          detail: {
            fetch: this.fetch,
          },
          bubbles: true,
          cancelable: true,
          composed: true,
        })
      );
    };
  }

  connectedCallback() {
    this.addEventListener(
      "request-list-products",
      this.requestListProductsListener
    );
  }

  disconnectedCallback() {
    this.removeEventListener(
      "request-list-products",
      this.requestListProductsListener
    );
  }

  /**
   * This fetch contains all needed data and is the only communication with the api endpoint
   *
   * @return {Promise<>}
   */
  get fetch() {
    return (
      this._fetch ||
      (this._fetch = fetch(this.getAttribute("endpoint"), {
        method: "GET",
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }

        let { products } = await response.json();

        return {
          products,
        };
      }))
    );
  }
}
