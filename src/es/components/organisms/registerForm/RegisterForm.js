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

    // store in sessionStorage
    const form = this.root.querySelector('m-form > form')
    if (form) {
      // @ts-ignore
      const savedData = JSON.parse(sessionStorage.getItem('formValues')) || {};
      const formFields = form.querySelectorAll('input, select');
  
      formFields.forEach(field => {
        if (field.name && savedData[field.name] !== undefined) {
          field.value = savedData[field.name];
        }
      });
  
      form.addEventListener('change', function () {
        const formData = {};
  
        formFields.forEach(field => {
          if (field.name) {
            formData[field.name] = field.value;
          }
        });
  
        sessionStorage.setItem('formValues', JSON.stringify(formData));
      });
    }

    // form steps
    const formSteps = this.root.querySelectorAll('.form-steps li')
    const sections = this.root.querySelectorAll('m-form .section')
    const nextButtons = this.root.querySelectorAll('a-button')

    formSteps.forEach((item, index) => {
      item.addEventListener('click', () => {
        formSteps.forEach((stepItem) => {
          stepItem.classList.remove('active')
        });
  
        sections.forEach((section) => {
          section.classList.remove('active')
        });
  
        item.classList.add('active')
        sections[index].classList.add('active')

        getRequiredFields()
      })
    })

    // next buttons
    nextButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        formSteps.forEach((stepItem) => {
          stepItem.classList.remove('active')
        });
  
        sections.forEach((section) => {
          section.classList.remove('active')
        });
  
        formSteps[index + 1].classList.add('active')
        sections[index + 1].classList.add('active')

        getRequiredFields()
      })
    })

    // required fields
    const getRequiredFields = () => {
      const activeSection = this.root.querySelectorAll('m-form .section.active')[0]
      const requiredFields = activeSection.querySelectorAll('[required]')
      const activeSectionButton = activeSection.querySelectorAll('a-button')[0]
      const submitButton = this.root.querySelectorAll('input[type="submit"]')[0]

      const emptyRequiredFields = Array.from(requiredFields).filter(field => {
        if (field.tagName.toLowerCase() === 'input' && (field.type === 'text' || field.type === 'email')) {
          return field.value.trim() === '';
        } else if (field.tagName.toLowerCase() === 'select') {
          return field.value === '';
        }
      });

      if (emptyRequiredFields.length !== 0) {
        activeSectionButton?.setAttribute('disabled', true)
        submitButton?.setAttribute('disabled', true)

        requiredFields.forEach(field => {
          field.addEventListener('change', function () {
            const isFormValid = Array.from(requiredFields).every(field => {
              if (field.nodeName === 'SELECT') {
                return field.value !== '';
              }
              return field.value.trim() !== '';
            });
    
            if (isFormValid) {
              activeSectionButton?.removeAttribute('disabled');
              submitButton?.removeAttribute('disabled');
            }
          });
        });
      }
    }

    // initial required fields
    getRequiredFields()
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
