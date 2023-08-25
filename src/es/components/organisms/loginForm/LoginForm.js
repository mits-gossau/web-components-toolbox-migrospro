// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * LoginForm
 * An example at: src/es/components/pages/Login.html
 *
 * @export
 * @class LoginForm
 * @type {CustomElementConstructor}
 */

export default class LoginForm extends Shadow() {
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
          margin-bottom: 4rem;
      }
      @media (min-width: 768px) {
        :host section {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            column-gap: 2rem;
        }
      }
      :host label {
          color: var(--m-gray-600);
          font-size: 14px;
      }
      :host h2,
      :host h3 {
          color: var(--m-orange-600);
          font-family: var(--font-family);
          font-size: var(--font-size);
          font-weight: 400;
          margin: 0 0 1rem 0;
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
      :host .login-form {
        margin-bottom: 4rem;
      }
      :host .login-sidebar {
          background-color: var(--m-gray-100);
          padding: 24px 16px;
      }
      :host input[type="submit"] {
          padding: 12px 24px;
      }
    `
  }

}
