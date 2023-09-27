// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/* global sessionStorage */

/**
 * RegisterForm
 * An example at: src/es/components/pages/Register.html
 *
 * @export
 * @class RegisterForm
 * @type {CustomElementConstructor}
 */

export default class RegisterForm extends Shadow() {
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    // store in sessionStorage
    const form = this.root.querySelector('m-form > form')
    // @ts-ignore
    const savedData = JSON.parse(sessionStorage.getItem('formValues')) || {}
    const formFields = form.querySelectorAll('input, select')


    if (form) {
      formFields.forEach(field => {
        if (field.name && savedData[field.name] !== undefined) {
          field.value = savedData[field.name]
        }
      })

      form.addEventListener('change', function (event) {

        const formData = {}

        formFields.forEach(field => {
          if (field.name) {
            formData[field.name] = field.value
          }
        })
        sessionStorage.setItem('formValues', JSON.stringify(formData));

        if (event.target.hasAttribute("data-conditional-required-element-enabled")) {
          resetConditionalRequiredElement()
          const selectedOption = event.target.options[event.target.value]
          if (selectedOption.hasAttribute('additional-required-field')) {
            setConditionalRequiredElement(selectedOption);
          }
        }
      })
    }

    // next step
    const formSteps = this.root.querySelectorAll('.form-steps li')
    const sections = this.root.querySelectorAll('m-form .section')
    const nextButtons = this.root.querySelectorAll('a-button')

    nextButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        let isValidForm = false
        const currentSection = form.querySelector('section.active')
        const elementsInCurrentSection = currentSection.querySelectorAll('input, select, textarea')

        if (elementsInCurrentSection.length === 0 || Array.from(elementsInCurrentSection).every(element => element.checkValidity())) {
          isValidForm = true
        } else {
          form.reportValidity()
        }
        if (isValidForm) {
          formSteps.forEach((stepItem) => {
            stepItem.classList.remove('active')
          })

          sections.forEach((section) => {
            section.classList.remove('active')
          })

          formSteps[index].classList.add('ready')
          formSteps[index].addEventListener('click', () => {
            formSteps.forEach((stepItem) => {
              stepItem.classList.remove('active')
            })

            sections.forEach((section) => {
              section.classList.remove('active')
            })

            formSteps[index].classList.add('active')
            sections[index].classList.add('active')
          })

          formSteps[index + 1].classList.remove('disabled')
          formSteps[index + 1].classList.add('active')
          sections[index + 1].classList.add('active')

          getRequiredFields()
        }
      })
    })

    // required fields
    const getRequiredFields = () => {
      const activeSection = this.root.querySelectorAll('m-form .section.active')[0]
      const requiredFields = activeSection.querySelectorAll('[required]')
      const nextButton = activeSection.querySelectorAll('a-button')[0]
      const submitButton = this.root.querySelectorAll('input[type="submit"]')[0]
      const dataConditionalRequiredElement = activeSection.querySelector("[data-conditional-required-element-enabled]")
      const dataNameConditionalRequiredElement = dataConditionalRequiredElement?.getAttribute("name")
      // @ts-ignore
      const currentSessionStorageFormValues = JSON.parse(sessionStorage.getItem('formValues')) || {}

      const emptyRequiredFields = Array.from(requiredFields).filter(field => {
        if (field.tagName.toLowerCase() === 'input' && (field.type === 'text' || field.type === 'email')) {
          return field.value.trim() === ''
        } else if (field.tagName.toLowerCase() === 'select') {
          return field.value === ''
        }
        return field
      })

      if (emptyRequiredFields.length !== 0) {
        nextButton?.setAttribute('disabled', true)
        submitButton?.setAttribute('disabled', true)

        requiredFields.forEach(field => {
          field.addEventListener('change', function () {
            const isFormValid = Array.from(requiredFields).every(field => {
              if (field.nodeName === 'SELECT') {
                return field.value !== ''
              }
              return field.value.trim() !== ''
            })

            if (isFormValid) {
              nextButton?.removeAttribute('disabled')
              submitButton?.removeAttribute('disabled')
            }
          })
        })
      }

      if (dataConditionalRequiredElement && currentSessionStorageFormValues[dataNameConditionalRequiredElement]) {
        // temporary enable the next btn since required attribute will stop the user
        nextButton?.removeAttribute('disabled')
        Array.from(dataConditionalRequiredElement.options).forEach(elem => {
          if (elem.value === currentSessionStorageFormValues[dataNameConditionalRequiredElement] && elem.hasAttribute('additional-required-field')) {
            setConditionalRequiredElement(elem);
          }
        })
      }
    }

    // set conditional required fields
    const setConditionalRequiredElement = (elem) => {
      removeRequiredSignOfElement()
      const additionalRequiredFieldId = elem.getAttribute('additional-required-field')
      const additionalRequiredInputField = Array.from(formFields).find(elem => elem.getAttribute("required-field-name") === additionalRequiredFieldId)
      if (additionalRequiredInputField) {
        additionalRequiredInputField.required = true
        additionalRequiredInputField.setAttribute("conditional-required", true)
        const currentInputLabel = additionalRequiredInputField.parentElement.previousElementSibling;
        currentInputLabel.textContent = `${currentInputLabel.textContent} *`
      }
    }

    const resetConditionalRequiredElement = () => {
      formFields.forEach(elem => {
        if (elem.hasAttribute("conditional-required")) {
          elem.required = false
          elem.removeAttribute("conditional-required")
          // remove * as required sign at the end of the label
          const currentInputLabel = elem.parentElement.previousElementSibling;
          currentInputLabel.textContent = `${currentInputLabel.textContent.slice(0, -2)}`
        }
      })
    }

    const removeRequiredSignOfElement = () => {
      formFields.forEach(elem => {
        if (elem.hasAttribute("conditional-required")) {
          // remove * as required sign at the end of the label
          const currentInputLabel = elem.parentElement.previousElementSibling;
          currentInputLabel.textContent = `${currentInputLabel.textContent.slice(0, -2)}`
        }
      })
    }


    // initial required fields
    getRequiredFields()

    // billing address
    const renderingControllerElements = this.root.querySelectorAll("[rendering-controller-element]")

    Array.from(renderingControllerElements).forEach(controller => {
      

      const firstComponentController = controller.querySelectorAll("[show-component-if-checked]")[0]
      const allConditionalElement = controller.querySelectorAll("[component-name]")
      controller.addEventListener('change', (e) => {
        const elementNameToRender = e.target.getAttribute("show-component-if-checked")
        if (elementNameToRender) {
          const showedElements = Array.from(allConditionalElement).filter(elem => {
            return elem.getAttribute("component-name") === elementNameToRender
          })
          const hidedElements = Array.from(allConditionalElement).filter(elem => {
            return elem.getAttribute("component-name") !== elementNameToRender
          })

          if (showedElements.length > 0) {
            showedElements.forEach(elem => {
              const conditionalRequiredFieldsInElement = elem.querySelectorAll("[conditional-required]")
              if (conditionalRequiredFieldsInElement.length > 0) {
                conditionalRequiredFieldsInElement.forEach(elem => elem.required = true)
              }
              elem.style.display = 'block'
            })
          }

          if (hidedElements.length > 0) {
            hidedElements.forEach(elem => {
              const conditionalRequiredFieldsInElement = elem.querySelectorAll("[conditional-required]")
              if (conditionalRequiredFieldsInElement.length > 0) {
                conditionalRequiredFieldsInElement.forEach(elem => elem.required = false)
              }
              elem.style.display = 'none'
            })
          }
        }
      })
      if (firstComponentController) {
        firstComponentController.dispatchEvent(new Event('change', { 'bubbles': true }))
      }
    });
  }

  connectedCallback() {
    if (this.shouldRenderCSS()) this.renderCSS()
  }

  disconnectedCallback() {
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS() {
    return !this.root.querySelector(
      `:host > style[_css], ${this.tagName} > style[_css]`
    )
  }

  renderCSS() {
    this.css = /* css */ `
      :host section {
          display: flex;
          flex-direction: column;
          margin-bottom: 4rem;
      }
      :host h1 {
        font-size: 2rem;
        text-align: center;
      }
      :host h2,
      :host m-form h3 {
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
        justify-content: center;
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
      :host .form-steps li.ready {
        color: var(--m-black);
      }
      :host .form-steps li.active {
        background: 0 none;
        color: var(--m-orange-600);
      }
      :host .form-steps li.disabled {
        color: var(--m-gray-400);
        cursor: default;
      }
      :host .form-steps li:not(:last-child):after {
        background-image: url('_import-meta-url_../../../../icons/chevron_right.svg');
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
