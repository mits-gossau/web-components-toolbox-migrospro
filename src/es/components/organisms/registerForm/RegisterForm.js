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

    const formSteps = this.root.querySelectorAll('.form-steps li');
    const sections = this.root.querySelectorAll('m-form .section');
  
    formSteps.forEach((item, index) => {
      item.addEventListener('click', () => {
        formSteps.forEach((navItem) => {
          navItem.classList.remove('active');
        });
  
        sections.forEach((section) => {
          section.classList.remove('active');
        });
  
        item.classList.add('active');
        sections[index].classList.add('active');
      });
    });
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
        display: flex;
        flex-wrap: wrap;
        list-style: none;
        margin-bottom: 2rem;
        padding: 0;
      }
      :host .form-steps li {
        color: var(--m-gray-400);
        cursor: pointer;
        margin-bottom: 1rem;
      }
      :host .form-steps li:hover {
        color: var(--m-orange-800);
      }
      :host .form-steps li.active {
        background: 0 none;
        color: var(--m-orange-600);
      }
      :host .form-steps li:not(:last-child):after {
        background-image: url('../../web-components-toolbox/src/icons/chevron_right.svg');
        background-position: center;
        background-repeat: no-repeat;
        background-size: 1em;
        color: transparent;
        content: "";
        display: inline-block;
        height: 10px;
        width: 1rem;
        margin: 0 1rem;
      }
      :host m-form {
        max-width: 560px;
        margin: 0 auto 4rem auto;
      }
      :host form section {
        background: 0 none;
        display: none;
      }
      :host form section.active {
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
