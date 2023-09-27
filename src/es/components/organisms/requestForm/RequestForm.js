// @ts-check
import { Shadow } from "../../web-components-toolbox/src/es/components/prototypes/Shadow.js";

/**
 * RequestForm
 * An example at: src/es/components/pages/Benutzerprofil.html
 *
 * @export
 * @class RequestForm
 * @type {CustomElementConstructor}
 */

export default class RequestForm extends Shadow() {
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args);
    const showPasswordText = this.getAttribute("show-password-text") || "show";
    const hidePasswordText = this.getAttribute("hide-password-text") || "hide";

    // terms checkbox
    const termsCheckbox = this.root.querySelector('input[type="checkbox"]')
    const submitButton = this.root.querySelector('input[type="submit"]')
    if (termsCheckbox && submitButton) {
      termsCheckbox.addEventListener("change", function () {
        // @ts-ignore
        if (termsCheckbox.checked) {
          submitButton.removeAttribute("disabled")
        } else {
          submitButton.setAttribute("disabled", "true")
        }
      });
    }

    // show password
    const showHidePasswords = this.root.querySelectorAll('input[type="password"] + span');
    if (showHidePasswords) {
      showHidePasswords.forEach(element => {
        element.addEventListener("click", function () {
          const input = this.previousElementSibling
          if (input.getAttribute("type") === "password") {
            input.setAttribute("type", "text")
            element.innerHTML = hidePasswordText
          } else {
            input.setAttribute("type", "password")
            element.innerHTML = showPasswordText
          }
        });
      });
    }
  }

  connectedCallback() {
    if (this.shouldRenderCSS()) this.renderCSS();
    this.renderHTML();
  }

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
          --background-color: transparent; 
          --font-size: 14px;
          --color: var(--m-gray-600);
          --color-black: var(--m-black);
          color: var(--color, var(--m-gray-600));
          font-size: var(--font-size);
        }
        :host h2,
        :host m-form h3 {
          color: var(--m-orange-600);
          font-family: var(--font-family);
          font-size: var(--h-font-size, 1.25rem);
          font-weight: var(--h-font-weight, 400);
          margin: var(--h-margin, 1rem 0 .5rem 0);
          text-align: var(--h-text-align, left);
          width: 100%;
        }
        :host input[type="checkbox"] {
            height: var(--input-checkbox-dimension, 1.5rem);
            margin-right: var(--input-checkbox-margin-right, 0.5rem);
            width: var(--input-checkbox-dimension, 1.5rem);
            position: relative;
            top: var(--input-checkbox-top, 0.375rem);
        }
        :host input[type='radio'] {
          accent-color: var(--m-orange-700);
        }
        :host .icon-chevron :after {
          background-image: var(--background-image, url('_import-meta-url_../../../../icons/chevron_right.svg'));
          background-position: center;
          background-repeat: no-repeat;
          background-size: 1em;
          color: transparent;
          min-width: 3em;
        }
        :host textarea:focus, 
        :host input:focus {
            color: var(--color-secondary);
        }
        :host input[type="password"] + span,
        :host input[type="text"] + span {
            color: var(--color);
            cursor: pointer;
            display: flex;
            height: 100%;
            justify-content: center;
            align-items: center;
            font-size: smaller;
            padding: 0 1rem;
            position: absolute;
            right: 0;
            top: 0;
        }
        :host input[type="submit"],
        :host button {
            background-color: var(--color-secondary);
            border: var(--border-width, 1px) solid var(--border-color, var(--m-orange-600));
            border-radius: var(--border-radius);
            color: var(--m-white);
            cursor: pointer;
            font-size: var(--font-size-input, var(--font-size));
            padding: 0.75em 1.5em;
        }
        :host input[type="submit"][disabled] {
            cursor: not-allowed;
            opacity: 0.5;
        }
        :host label a {
            color: var(--color-label-a, var(--color-black));
        }
        :host .form-group {
            margin-bottom: var(--form-group-margin-bottom, 1rem);
        }
        :host .form-group > div {
            position: relative;
        }
        :host label {
          cursor: pointer;
        }
        :host label,
        :host .form-text {
            color: var(--color);
            font-size: var(--font-size-label, var(--font-size));
        }
        :host .form-radio-group {
          display: flex;
          gap: 2rem;
        }
        @media (min-width: 768px) {
          :host {
            display: flex;
            gap: var(--gap, 2rem);
          }
          :host .content {
            width: var(--content-width, 68%);
          }
          :host .sidebar {
            width: var(--sidebar-width, 32%);
          }
        }
    `;
  }

  /**
   * renders the html
   *
   * @return {void}
   */
  renderHTML() {
    this.html = /* html */ `
        <slot></slot>
    `;
  }
}
