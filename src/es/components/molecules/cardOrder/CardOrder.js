// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'
import(
  '../../web-components-toolbox/src/es/components/atoms/button/Button.js'
  // @ts-ignore
).then((module) => customElements.define('a-button', module.default))

/**
 * CardOrder
 * An example at: src/es/components/pages/Bestelluebersicht.html
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
    this.state = this.getAttribute('state') || ''
    this.edit = this.getAttribute('edit')
    this.download = this.getAttribute('download')
    this.duplicate = this.getAttribute('duplicate')
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
        --button-action-color: var(--card-button-action-color, var(--color-secondary));
        --button-action-color-hover: var(--card-button-action-color-hover, var(--m-white));
        --button-action-padding: var(--card-button-action-padding, 0.5rem 1rem);
      }
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
        white-space: nowrap;
      }
      :host .card > div p:first-child {
        height: var(--card-line-height-small, 2.25rem);
      }
      :host .card small {
        color: var(--card-color-small, var(--m-gray-700));
      }
      @media (min-width: 768px) {
        :host .card {
            display: grid;
            grid-template-columns: 2fr repeat(2, 1fr);
            grid-template-rows: 1fr;
            grid-column-gap: var(--card-column-gap, 2.5rem);
            align-items: end;
        }
        :host .state {
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
    const buttonEdit = this.edit
      ? `
        <a-button namespace="button-action-">
            ${this.edit}
            <svg class="icon-left" width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 3.99998H3C2.46957 3.99998 1.96086 4.2107 1.58579 4.58577C1.21071 4.96084 1 5.46955 1 5.99998V20C1 20.5304 1.21071 21.0391 1.58579 21.4142C1.96086 21.7893 2.46957 22 3 22H17C17.5304 22 18.0391 21.7893 18.4142 21.4142C18.7893 21.0391 19 20.5304 19 20V13M17.5 2.49998C17.8978 2.10216 18.4374 1.87866 19 1.87866C19.5626 1.87866 20.1022 2.10216 20.5 2.49998C20.8978 2.89781 21.1213 3.43737 21.1213 3.99998C21.1213 4.56259 20.8978 5.10216 20.5 5.49998L11 15L7 16L8 12L17.5 2.49998Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </a-button>`
      : ''
    const buttonDownload = this.download
      ? `
        <a-button namespace="button-action-">
            ${this.download}
            <svg class="icon-left" width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 1.00037H3C2.46957 1.00037 1.96086 1.21108 1.58579 1.58615C1.21071 1.96123 1 2.46993 1 3.00037V19.0004C1 19.5308 1.21071 20.0395 1.58579 20.4146C1.96086 20.7897 2.46957 21.0004 3 21.0004H15C15.5304 21.0004 16.0391 20.7897 16.4142 20.4146C16.7893 20.0395 17 19.5308 17 19.0004V7.00037M11 1.00037L17 7.00037M11 1.00037V7.00037H17M13 12.0004H5M13 16.0004H5M7 8.00037H5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </a-button>`
      : ''
    const buttonDuplicate = this.duplicate
      ? `
        <a-button namespace="button-action-">
            ${this.duplicate}
            <svg class="icon-left" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 14.0004H3C2.46957 14.0004 1.96086 13.7897 1.58579 13.4146C1.21071 13.0395 1 12.5308 1 12.0004V3.00037C1 2.46993 1.21071 1.96123 1.58579 1.58615C1.96086 1.21108 2.46957 1.00037 3 1.00037H12C12.5304 1.00037 13.0391 1.21108 13.4142 1.58615C13.7893 1.96123 14 2.46993 14 3.00037V4.00037M10 8.00037H19C20.1046 8.00037 21 8.8958 21 10.0004V19.0004C21 20.1049 20.1046 21.0004 19 21.0004H10C8.89543 21.0004 8 20.1049 8 19.0004V10.0004C8 8.8958 8.89543 8.00037 10 8.00037Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </a-button>`
      : ''

    this.html = /* html */`
        <div class="card">
            <div class="title">
                <p><small>${this.date}</small></p>
                <h3>${this.title}</h3>
            </div>
            <div class="state">
                <p><small>${this.name}</small></p>
                <p>${this.state}</p>
            </div>
            <div class="action">
                ${buttonEdit}
                ${buttonDownload}
                ${buttonDuplicate}
            </div>
        </div>
    `
  }
}
