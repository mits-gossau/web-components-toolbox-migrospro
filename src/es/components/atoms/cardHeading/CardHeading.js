// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'
import(
    '../../web-components-toolbox/src/es/components/atoms/button/Button.js'
    // @ts-ignore
  ).then((module) => customElements.define('a-button', module.default))  

/**
 * CardHeading
 * An example at: src/es/components/pages/Bestelluebersicht.html
 *
 * @export
 * @class CardHeading
 * @type {CustomElementConstructor}
 */

export default class CardHeading extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
    this.title = this.getAttribute('title')
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    this.renderHTML()
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS () {
    return !this.root.querySelector(
      `:host > style[_css], ${this.tagName} > style[_css]`
    )
  }

  renderCSS () {
    this.css = /* css */ `
      :host h2 {
        background-color: var(--card-heading-background-color, var(--m-gray-300));
        font-size: var(--card-heading-font-size, var(--font-size));
        padding: var(--card-heading-padding, 0.5rem 1rem);
        margin: var(--card-heading-margin, 3rem 0 0 0);
      }
    `
  }

  /**
   * renders the html
   *
   * @return {void}
   */
  renderHTML () {
    this.html = /* html */`
        <h2>${this.title}</h2>
    `
  }

}
