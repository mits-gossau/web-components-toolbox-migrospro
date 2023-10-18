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
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
    // store in sessionStorage
    const form = this.root.querySelector('m-form > form')
    // @ts-ignore
    const savedData = JSON.parse(sessionStorage.getItem('formValues')) || {}
    const formFields = form.querySelectorAll('input, select')

    if (form) {
      formFields.forEach(field => {
        if (field.type !== 'radio' && field.type !== 'checkbox') {
          if (field.name && savedData[field.name] !== undefined) {
            field.value = savedData[field.name]
          }
        }
        if (field.type === 'radio' || field.type === 'checkbox') {
          if (field.name && savedData[field.name] !== undefined) {
            if (field.value === savedData[field.name]) {
              field.checked = true
            }
          }
        }
      })

      form.addEventListener('change', function (event) {
        const formData = {}

        formFields.forEach(field => {
          if (field.type !== 'radio' && field.type !== 'checkbox') {
            if (field.name) {
              formData[field.name] = field.value
            }
          }
          if (field.type === 'radio' || field.type === 'checkbox') {
            if (field.name) {
              if (field.checked) {
                formData[field.name] = field.value
              }
            }
          }
        })
        sessionStorage.setItem('formValues', JSON.stringify(formData))

        if (event.target.hasAttribute('data-conditional-required-element-enabled')) {
          resetConditionalRequiredElement()
          const selectedOption = event.target.options[event.target.value]
          if (selectedOption.hasAttribute('additional-required-field')) {
            setConditionalRequiredElement(selectedOption)
          }
        }
      })
    }

    // remove from sessionStorage
    form.addEventListener('submit', () => {
      sessionStorage.removeItem('formValues')
    })

    // next step
    const formSteps = this.root.querySelectorAll('.form-steps li')
    const sections = this.root.querySelectorAll('m-form .section')
    const nextButtons = this.root.querySelectorAll('a-button')

    nextButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        const currentSection = form.querySelector('section.active')
        const elementsInCurrentSection = currentSection.querySelectorAll('input, select, textarea')
        const isValidForm = Array.from(elementsInCurrentSection).every(element => {
          if (element.checkValidity()) {
            return true
          } else {
            form.reportValidity()
            return false
          }
        })

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

          sendEvent(index + 2)

          getRequiredFields()
        }
      })
    })

    // send gtm event
    const sendEvent = (step) => {
        // @ts-ignore
        window.dataLayer.push({
          "event": "register",
          "action": "started",
          "step": `${step}`
      })
    }

    sendEvent(1) // initial gtm event step 1

    // required fields
    const getRequiredFields = () => {
      const activeSection = this.root.querySelectorAll('m-form .section.active')[0]
      const requiredFields = activeSection.querySelectorAll('[required]')
      const nextButton = activeSection.querySelectorAll('a-button')[0]
      const submitButton = this.root.querySelectorAll('input[type="submit"]')[0]
      const dataConditionalRequiredElement = activeSection.querySelector('[data-conditional-required-element-enabled]')
      const dataNameConditionalRequiredElement = dataConditionalRequiredElement?.getAttribute('name')
      // @ts-ignore
      const currentSessionStorageFormValues = JSON.parse(sessionStorage.getItem('formValues')) || {}

      const emptyRequiredFields = Array.from(requiredFields).filter(field => {
        if (field.required) {
          if (field.tagName.toLowerCase() === 'input' && (field.type === 'text' || field.type === 'email' || field.type === 'tel')) {
            return field.value.trim() === ''
          }
          if (field.tagName.toLowerCase() === 'select') {
            return field.value === ''
          }
          if (field.tagName.toLowerCase() === 'input' && field.type === 'radio') {
            const radioInputsWithSameName = Array.from(form.querySelectorAll(`input[type="radio"][name="${field.name}"]`))
            return radioInputsWithSameName.every(radioInput => radioInput.checked === false)
          }
          if (field.tagName.toLowerCase() === 'input' && field.type === 'checkbox') {
            const checkbox = Array.from(form.querySelectorAll(`input[type="checkbox"][name="${field.name}"]`))
            return checkbox.every(checkboxInput => checkboxInput.checked === false)
          }
          return field
        }
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
            setConditionalRequiredElement(elem)
          }
        })
      }
    }

    // set conditional required fields
    const setConditionalRequiredElement = (elem) => {
      removeRequiredSignOfElement()
      const additionalRequiredFieldId = elem.getAttribute('additional-required-field')
      const additionalRequiredInputField = Array.from(formFields).find(elem => elem.getAttribute('required-field-name') === additionalRequiredFieldId)
      if (additionalRequiredInputField) {
        additionalRequiredInputField.required = true
        additionalRequiredInputField.setAttribute('conditional-required', true)
        const currentInputLabel = this.root.querySelector(`[required-field-label='${additionalRequiredInputField.getAttribute('required-field-name')}']`)
        // set min value to "if-required-min-value" if its needed
        if (additionalRequiredInputField.hasAttribute('min') &&
          additionalRequiredInputField.hasAttribute('if-required-min-value')) {
          additionalRequiredInputField.setAttribute('min', additionalRequiredInputField.getAttribute('if-required-min-value'))
        }

        // add * as required sign end of the label
        if (currentInputLabel && !currentInputLabel.textContent.trim().slice(-3).includes('*')) currentInputLabel.textContent = `${currentInputLabel.textContent} *`
      }
    }

    const resetConditionalRequiredElement = () => {
      const activeSectionConditionalRequiredFields = this.root.querySelector('m-form .section.active').querySelectorAll("[conditional-required]")
      activeSectionConditionalRequiredFields.forEach(elem => {
        if (elem.hasAttribute('conditional-required')) {
          elem.required = false

          // remove * as required sign at the end of the label
          const currentInputLabel = this.root.querySelector(`[required-field-label='${elem.getAttribute('required-field-name')}']`)
          if (currentInputLabel && currentInputLabel.textContent.trim().slice(-3).includes('*')) currentInputLabel.textContent = `${currentInputLabel.textContent.slice(0, -2)}`
        }

        // set min value to "default-min-value" if its needed
        if (elem.hasAttribute('min') &&
          elem.hasAttribute('default-min-value')) {
          elem.setAttribute('min', elem.getAttribute('default-min-value'))
        }
      })
    }

    const removeRequiredSignOfElement = () => {
      formFields.forEach(elem => {
        if (elem.hasAttribute('conditional-required')) {
          // remove * as required sign at the end of the label
          const currentInputLabel = this.root.querySelector(`[required-field-label='${elem.getAttribute('required-field-name')}']`)
          if (currentInputLabel && currentInputLabel.textContent.trim().slice(-3).includes('*')) currentInputLabel.textContent = `${currentInputLabel.textContent.slice(0, -2)}`
        }
      })
    }

    // initial required fields
    getRequiredFields()

    // billing address
    const renderingControllerElements = this.root.querySelectorAll('[rendering-controller-element]')

    Array.from(renderingControllerElements).forEach(controller => {
      const firstComponentController = controller.querySelectorAll('[show-component-if-checked]')[0]
      const allConditionalElement = controller.querySelectorAll('[component-name]')
      controller.addEventListener('change', (e) => {
        const elementNameToRender = e.target.getAttribute('show-component-if-checked')
        if (elementNameToRender) {
          const showedElements = Array.from(allConditionalElement).filter(elem => {
            return elem.getAttribute('component-name') === elementNameToRender
          })
          const hidedElements = Array.from(allConditionalElement).filter(elem => {
            return elem.getAttribute('component-name') !== elementNameToRender
          })

          if (showedElements.length > 0) {
            showedElements.forEach(elem => {
              const conditionalRequiredFieldsInElement = elem.querySelectorAll('[conditional-required]')
              if (conditionalRequiredFieldsInElement.length > 0) {
                conditionalRequiredFieldsInElement.forEach(elem => elem.required = true)
              }
              elem.style.display = 'block'
            })
          }

          if (hidedElements.length > 0) {
            hidedElements.forEach(elem => {
              const conditionalRequiredFieldsInElement = elem.querySelectorAll('[conditional-required]')
              if (conditionalRequiredFieldsInElement.length > 0) {
                conditionalRequiredFieldsInElement.forEach(elem => elem.required = false)
              }
              elem.style.display = 'none'
            })
          }
        }
      })
      if (firstComponentController) {
        firstComponentController.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    // number input max and min value validation
    const numberInputFieldsWithMaxAttribute = this.root.querySelectorAll('input[type="text"][custom-number-validation]')
    Array.from(numberInputFieldsWithMaxAttribute).forEach(elem => {
      const max = +elem.getAttribute('max')
      const min = +elem.getAttribute('min')
      const validityMessage = elem.getAttribute('custom-validity-message')

      elem.addEventListener('keydown', (e) => {
        // ignore NaN e.keys except backspace and -,+,.,e key since the are as default allow to type in number
        if ((isNaN(+e.key) || +e.keyCode === 69 || +e.keyCode === 109 || +e.keyCode === 107 || +e.keyCode === 190) && +e.keyCode !== 8) {
          e.target.setCustomValidity(validityMessage)
          e.target.reportValidity()
          e.preventDefault()
        }
      })

      elem.addEventListener('keyup', (e) => {
        if (elem.value) {
          const typed = +elem.value
          if (typed <= max && typed >= min) {
            e.target.setCustomValidity('')
            elem.value = typed
          } else {
            e.target.setCustomValidity(validityMessage)
            e.target.reportValidity()
          }
        } else {
          e.target.setCustomValidity(validityMessage)
          e.target.reportValidity()
        }
      })

      elem.addEventListener('change', (e) => {
        if (elem.value) {
          const typed = +elem.value
          if (typed > max || typed < min) {
            elem.value = ''
            e.target.setCustomValidity(validityMessage)
            e.target.reportValidity()
          }
        }
      })
    })

    // pattern right format validation
    const patternTextInputFields = this.root.querySelectorAll('input[type="text"][custom-pattern-validation]')
    Array.from(patternTextInputFields).forEach(elem => {
      const validityMessage = elem.getAttribute('custom-validity-message')

      elem.addEventListener('keyup', (e) => {
        const currentValue = elem.value
        if (
          currentValue.substring(0, 3) === 'CHE' &&
          currentValue.split('.').length === 3 &&
          currentValue.split('.')[1].split('').every(e => !isNaN(+e)) &&
          currentValue.split('.')[2].split('').every(e => !isNaN(+e)) &&
          currentValue.length === 15
        ) {
          e.target.setCustomValidity('')
          e.target.reportValidity()
        } else {
          e.target.setCustomValidity(validityMessage)
          e.target.reportValidity()
        }
      })

      elem.addEventListener('change', (e) => {
        const currentValue = elem.value
        if (
          currentValue.substring(0, 3) === 'CHE' &&
          currentValue.split('.').length === 3 &&
          currentValue.split('.')[1].split('').every(e => !isNaN(+e)) &&
          currentValue.split('.')[2].split('').every(e => !isNaN(+e)) &&
          currentValue.length === 15
        ) {
          e.target.setCustomValidity('')
          e.target.reportValidity()
        } else {
          e.target.setCustomValidity(validityMessage)
          e.target.reportValidity()
          elem.value = ''
        }
      })
    })
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
      :host {
        --background-color: transparent; 
        --color: var(--m-gray-600);
        --color-black: var(--m-black);
        color: var(--color, var(--m-gray-600));
        font-size: var(--font-size);
      }
      :host section {
        color: var(--color, var(--m-gray-600));
        display: flex;
        flex-direction: column;
        margin-bottom: var(--section-margin-bottom, 4rem);
      }
      :host h1 {
        font-size: var(--h1-font-size, 2rem);
        text-align: var(--h1-text-align, center);
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
      :host .form-steps {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        list-style: none;
        margin-bottom: var(--form-steps-margin-bottom, 2rem);
        padding: var(--form-steps-padding, 0);
      }
      :host .form-steps li {
        color: var(--m-gray-400);
        cursor: pointer;
        margin-bottom: var(--form-steps-li-margin-bottom, 1rem);
      }
      :host .form-steps li:hover {
        color: var(--m-orange-800);
      }
      :host .form-steps li.ready {
        color: var(--m-black);
      }
      :host .form-steps li.active {
        background: var(--form-steps-li-active-background, 0 none);
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
        max-width: var(--m-form-max-width, 560px);
        margin: var(--m-form-margin, 0 auto 4rem auto);
      }
      :host form section {
        background: 0 none;
        display: none;
      }
      :host form section.active {
        display: block;
      }
      :host .form-group {
        margin-bottom: var(--form-group-margin-bottom, 1rem);
      }
      :host label,
      :host .form-text {
          color: var(--m-gray-600);
          font-size: var(--label-form-text-font-size, 14px);
      }
      :host input[type='radio'] {
        accent-color: var(--m-orange-700);
      }
      :host textarea:focus, 
      :host input:focus {
          color: var(--color-secondary);
      }
      :host .icon-chevron :after {
        background-image: var(--background-image, url('_import-meta-url_../../../../icons/chevron_right.svg'));
        background-position: center;
        background-repeat: no-repeat;
        background-size: 1em;
        color: transparent;
        min-width: 3em;
      }
      :host .info-box {
        margin-left: var(--info-box-margin-left, 2rem);
        position: relative;
      }
      :host .info-box > *:first-child {
        display: block;
        position: absolute;
        left: calc(var(--info-box-margin-left, 2rem) * -1);
      }
      @media (min-width: 768px) {
        :host .col-2-desktop {
            display: flex;
            column-gap: var(--col-2-desktop-column-gap, 1rem);
            width: 100%;
        }
        :host .col-2-desktop > div {
          width: 100%;
        }
      }
    `
  }
}
