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

    const termsCheckbox = this.root.querySelector('input[type="checkbox"]');
    const submitButton = this.root.querySelector('input[type="submit"]');

    if (termsCheckbox && submitButton) {
      termsCheckbox.addEventListener("change", function () {
        // @ts-ignore
        if (termsCheckbox.checked) {
          submitButton.removeAttribute("disabled");
        } else {
          submitButton.setAttribute("disabled", "true");
        }
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
        }
        :host label {
            align-items: center;
            display:inline-flex;
            gap:0.25rem;
            margin-top:2rem;
        }
        :host input[type="checkbox"] {
            height: 1.5rem;
            margin-right: 0.5rem;
            width: 1.5rem;
        }
        :host input[type="submit"] {
            background-color: var(--color-secondary);
            border: var(--border-width, 1px) solid var(--border-color, var(--m-orange-600));
            border-radius: var(--border-radius);
            color: var(--m-white);
            cursor: pointer;
            font-size: var(--font-size);
            padding: 0.75em 1.5em;
        }
        :host input[type="submit"][disabled] {
            cursor: not-allowed;
            opacity: 0.5;
        }
        :host label a {
            color: var(--color);
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
