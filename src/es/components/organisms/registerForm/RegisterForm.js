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
      :host .form-steps {
        margin-bottom: 2rem;
      }
      :host m-form {
        max-width: 560px;
        margin: 0 auto;
      }
      :host .form-group {
        margin-bottom: 1rem;
      }
      :host label {
          color: var(--m-gray-600);
          font-size: 14px;
      }
      :host hr {
          color: var(--m-gray-300);
          margin: 2rem 0;
      }
      :host ul {
          list-style: none;
          padding: 0;
      }
      :host li {
          display: flex;
          align-items: center;
          margin-bottom: 24px;
      }
      :host li a-picture {
          width: 85px;
          height: 60px;
      }
      :host li p {
          color: #9E9E9E;
          font-size: 12px;
          width: 75%;
          margin: 0 0 0 12px;
      }
      :host .register-form {
        margin-bottom: 4rem;
      }
      :host input[type="submit"] {
          padding: 12px 24px;
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
    `
  }

}
