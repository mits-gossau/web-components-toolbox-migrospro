// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * Sidebar
 * An example at: src/es/components/pages/Benutzerprofil.html
 *
 * @export
 * @class Sidebar
 * @type {CustomElementConstructor}
 */

export default class Sidebar extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
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
        display: block;
        background-color: var(--m-gray-100);
        border-radius: var(--border-radius);
        padding: 1rem;
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
            <div class="sidebar">
                <slot></slot>
            </div>
        `
  }
}
