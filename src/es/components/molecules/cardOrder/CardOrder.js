// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * CardOrder
 * An example at: src/es/components/pages/Benutzerprofil.html
 *
 * @export
 * @class CardOrder
 * @type {CustomElementConstructor}
 */

export default class CardOrder extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
    this.date = this.getAttribute('date') || ''
    this.title = this.getAttribute('title') || ''
    this.name = this.getAttribute('name') || ''
    this.category = this.getAttribute('category') || ''
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
      :host .card {
        border-bottom: var(--card-border-bottom, 1px solid var(--m-gray-300));
        padding-top: var(--card-padding-top, 1rem);
      }
      :host .card > div {
        padding-bottom: var(--card-padding-bottom, 1rem);
      }
      :host .card h3,
      :host .card p {
        display: flex;
        align-items: center;
        font-size: var(--font-size);
        height: var(--card-line-height, 2.5rem);
        margin: 0;
        padding: 0;
      }
      :host .card > div p:first-child {
        height: var(--card-line-height-small, 2.25rem);
      }
      :host .card small {
        color: var(--card-color-small, var(--m-gray-700));
      }
      :host .action {
        min-width: var(--card-action-min-width, 10rem);
      }
      @media (min-width: 768px) {
        :host .card {
            display: grid;
            grid-template-columns: 2fr repeat(2, 1fr);
            grid-template-rows: 1fr;
            grid-column-gap: var(--card-column-gap, 2.5rem);
            align-items: end;
        }
        :host .category {
            text-align: right;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }
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
        <div class="card">
            <div class="title">
                <p><small>${this.date}</small></p>
                <h3>${this.title}</h3>
            </div>
            <div class="category">
                <p><small>${this.name}</small></p>
                <p>${this.category}</p>
            </div>
            <slot class="action" name="action"></slot>
        </div>
    `
  }

  get iconName () {
    return this.getAttribute('icon-name') || ''
  }

  get iconSize () {
    return this.getAttribute('icon-size') || '1em'
  }
}
