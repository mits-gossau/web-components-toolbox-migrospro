// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * RegisterForm
 * An example at: src/es/components/pages/Register.html
 *
 * @export
 * @class RegisterForm
 * @type {CustomElementConstructor}
 */

export default class RegisterForm extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
  }

  disconnectedCallback () {
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
      :host section {
          display: flex;
          flex-direction: column;
          margin-bottom: 4rem;
      }
      :host h1 {
        font-size: 2rem;
      }
      :host h2 {
        color: var(--m-orange-600);
        font-family: var(--font-family);
        font-size: 1.25rem;
        font-weight: 400;
        margin: 1rem 0 .5rem 0;
        text-align: left;
        width: 100%;
      }
      :host .form-steps {
        margin-bottom: 2rem;
      }
      :host m-form {
        max-width: 560px;
        margin: 0 auto 4rem auto;
      }
      :host m-form section {
        display: none;
      }
      :host m-form section.section-active {
        display: block;
      }
      :host .form-group {
        margin-bottom: 1rem;
      }
      :host label,
      :host .form-text {
          color: var(--m-gray-600);
          font-size: 14px;
      }
      :host .form-radio-group {
        display: flex;
        gap: 2rem;
      }
      :host .form-radio-group span {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      :host input[type='radio'] {
        accent-color: var(--m-orange-700);
      }
      :host input[type="submit"] {
        padding: 12px 24px;
      }
      :host .icon-chevron :after {
        background-image: var(--background-image, url(../../../../../src/es/components/web-components-toolbox/src/icons/chevron_right.svg));
        background-position: center;
        background-repeat: no-repeat;
        background-size: 1em;
        color: transparent;
        min-width: 3em;
      }
      @media (min-width: 768px) {
        :host .col-2-desktop {
            display: flex;
            column-gap: 1rem;
            width: 100%;
        }
        :host .col-2-desktop > div {
          width: 100%;
        }
      }
    `
  }

}
