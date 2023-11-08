// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * IconShoppingBasket
 * An example at: src/es/components/pages/Benutzerprofil.html
 *
 * @export
 * @class IconShoppingBasket
 * @type {CustomElementConstructor}
 */

export default class IconShoppingBasket extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
    this.color = this.getAttribute('color') || '#FF6600'
    this.width = this.getAttribute('width') || '24'
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
          :host {
            display: inline-block;
            height: ${this.width}px;
            width: ${this.width}px;
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
            <svg width="${this.width}" height="${this.width}" viewBox="0 0 ${this.width} ${this.width}" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.72147 19.3288L1 9H23L21.2785 19.3288C21.1178 20.2932 20.2834 21 19.3057 21H4.69425C3.71658 21 2.8822 20.2932 2.72147 19.3288Z" stroke="${this.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="3" y1="15" x2="21" y2="15" stroke="${this.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M5 8.5V4C5 2.89543 5.89543 2 7 2H17C18.1046 2 19 2.89543 19 4V8.5" stroke="${this.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 9L9 21" stroke="${this.color}" stroke-width="2"/>
                <path d="M16 9L15 21" stroke="${this.color}" stroke-width="2"/>
            </svg>
        `
  }
}
