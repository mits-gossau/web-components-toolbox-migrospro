// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * RequestForm
 * An example at: src/es/components/pages/Benutzerprofil.html
 *
 * @export
 * @class RequestForm
 * @type {CustomElementConstructor}
 */

export default class RequestForm extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.form = this.shadowRoot.querySelector('form')
    const showPasswordText = this.getAttribute('show-password-text') || 'show'
    const hidePasswordText = this.getAttribute('hide-password-text') || 'hide'

    // terms checkbox
    const termsCheckbox = this.root.querySelector('#terms-checkbox')
    const submitButtons = this.root.querySelectorAll('button[type="submit"]')
    if (termsCheckbox && submitButtons) {
      termsCheckbox.addEventListener('change', function () {
        if (termsCheckbox.checked) {
          submitButtons.forEach((element) => {
            element.removeAttribute('disabled')
          })
        } else {
          submitButtons.forEach((element) => {
            element.setAttribute('disabled', 'true')
          })
        }
      })
    }

    // show password
    const showHidePasswords = this.root.querySelectorAll(
      'input[type="password"] + span'
    )
    if (showHidePasswords) {
      showHidePasswords.forEach((element) => {
        element.addEventListener('click', function () {
          const input = this.previousElementSibling
          if (input.getAttribute('type') === 'password') {
            input.setAttribute('type', 'text')
            element.innerHTML = hidePasswordText
          } else {
            input.setAttribute('type', 'password')
            element.innerHTML = showPasswordText
          }
        })
      })
    }

    // update required fields
    const differentDeliveryOptions = this.root.querySelectorAll('input[name="delivery"]')
    const deliverySelect = this.root.querySelector('#delivery-select')
    const differentDeliveryName = this.root.querySelector('#different-name')
    const differentDeliveryAddressLine1 = this.root.querySelector('#different-address-line-1')
    const differentDeliveryAddressLine2 = this.root.querySelector('#different-address-line-2')
    const differentDeliveryLocation = this.root.querySelector('#different-location')

    for (let i = 0; i < differentDeliveryOptions.length; i++) {
      differentDeliveryOptions[i].addEventListener('change', function(event) {
        switch (event.target.value) {
          case '1':
            deliverySelect.required = true
            break;
          case '3':
            differentDeliveryName.required = true
            differentDeliveryAddressLine1.required = true
            differentDeliveryAddressLine2.required = true
            differentDeliveryLocation.required = true
            break;
          default:
            deliverySelect.required = false
            differentDeliveryName.required = false
            differentDeliveryAddressLine1.required = false
            differentDeliveryAddressLine2.required = false
            differentDeliveryLocation.required = false
            break;
        }
      });
    }

    // update delivery date minimum 
    const deliveryDate = this.root.getElementById('delivery-date')
    const minDays = deliveryDate.getAttribute('min-days') || 3
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + minDays);
    const minDate = currentDate.toISOString().substr(0, 10);
    deliveryDate.setAttribute('min', minDate);
  }

  connectedCallback () {
    this.form.addEventListener('submit', this.onSubmit.bind(this))
    if (this.shouldRenderCSS()) this.renderCSS()
    this.renderHTML()
  }

  onSubmit = async (event) => {
    event.preventDefault()

    const clickedButtonValue = event.submitter.value;
    let action = this.getAttribute('action-submit');

    if (clickedButtonValue === 'submit') {
        console.log("submit");
    }

    if (clickedButtonValue === 'saveForLater') {
        console.log("saveForLater");
        action = this.getAttribute('action-save-for-later');
    } 

    const formData = new FormData(event.target)
    const jsonData = {}

    formData.forEach((value, key) => {
      jsonData[key] = value
    })

    try {
      const response = await fetch(action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
      })

      if (!response.ok) {
        console.error('Failed to submit form:', response.statusText)
      } else {
        console.log('Form submitted successfully:', await response.json())
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
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
        :host input[type="checkbox"] {
            height: var(--input-radio-checkbox-dimension, 24px);
            width: var(--input-radio-checkbox-dimension, 24px);
            margin-right: var(--input-checkbox-margin-right, 0.5rem);
            position: relative;
            top: var(--input-checkbox-top, 0.375rem);
        }
        :host input[type='radio'] {
          accent-color: var(--m-orange-700);
          height: var(--input-radio-checkbox-dimension, 24px);
          width: var(--input-radio-checkbox-dimension, 24px);
          position: relative;
          top: var(--input-radio-top, -2px);
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
        :host input[type="text"],
        :host input[type="password"],
        :host input[type="email"],
        :host input[type="file"],
        :host input[type="tel"],
        :host input[type="number"],
        :host input[type="date"],
        :host input[type="time"] {
          height: var(--input-height, 48px);
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
        :host *:has(> input[type="file"]) {
          border: 1px solid var(--m-gray-400);
          color: inherit;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        :host *:has(> input[type="file"]) > div {
          display: inline-flex;
          justify-content: space-between;
          padding: var(--input-file-padding, 0.75rem 1rem);
          position: absolute;
          top: 0;
          width: 100%;
        }
        :host *:has(> input[type="file"]) > div a-icon-mdx {
          color: var(--m-gray-600);
        }
        :host input[type="file"] {
          width: 100%;
        }
        :host button[type="submit"],
        :host button {
            background-color: var(--color-secondary);
            border: var(--border-width, 1px) solid var(--border-color, var(--m-orange-600));
            border-radius: var(--border-radius);
            color: var(--m-white);
            cursor: pointer;
            font-size: var(--font-size-input, var(--font-size));
            padding: 0.75em 1.5em;
        }
        :host button[type="submit"][disabled] {
            cursor: not-allowed;
            opacity: 0.5;
        }
        :host button[type="submit"]:hover,
        :host button:hover {
            background-color: var(--button-primary-background-color-hover);
            border-color: var(--button-primary-border-color-hover);
            color: var(--button-primary-color-hover);
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
          padding-top: var(--form-radio-group-padding-top, 4px);
        }
        :host .form-radio-group-vertical {
          clear: both;
          padding-top: var(--form-radio-group-padding-top, 4px);
        }
        :host .form-radio-group-vertical input[type="radio"] {
          display: inline-block;
          float: left;
          margin-right: var(--form-radio-group-vertical-input-radio-margin-right, 0.5rem);
          position: relative;
          top: 0;
        }
        :host .form-radio-group-vertical input[type="radio"] + label {
          display: inline-block;
          height: var(--form-radio-group-vertical-input-radio-height, 24px);
          width: calc(100% - var(--form-radio-group-vertical-input-radio-width, 40px));
        }
        :host .form-radio-group-vertical input[type="radio"]:not(:last-of-type),
        :host .form-radio-group-vertical input[type="radio"]:not(:last-of-type) + label {
          margin-bottom: var(--form-radio-group-vertical-element-margin-bottom, 1rem);
        }
        :host .form-radio-group-vertical > select,
        :host .form-radio-group-vertical > address {
          margin-bottom: var(--form-radio-group-vertical-element-margin-bottom, 1rem);
        }
        :host .form-radio-group-vertical > address {
          margin-top: var(--form-radio-group-vertical-element-margin-bottom, 1rem);
        }
        :host .form-radio-group-vertical > input[type="radio"]:checked ~ select,
        :host .form-radio-group-vertical > input[type="radio"]:checked + address {
          display: block;
        }
        :host #terms-checkbox {
          margin-top: var(--term-checkbox-margin-top, 4rem);
          margin-bottom: var(--term-checkbox-margin-bottom, 3rem);
        }
        :host button[type="submit"] + button[type="submit"],
        :host a-button + a-button {
          background-color: var(--button-secondary-background-color);
          border: var(--button-secondary-border-width) solid var(--button-secondary-border-color);
          color: var(--button-secondary-color);
          margin-left: var(--button-margin-left, 2rem);
        }
        :host button[type="submit"] + button[type="submit"]:hover,
        :host a-button + a-button:hover {
            background-color: var(--button-secondary-background-color-hover);
            border-color: var(--button-secondary-border-color-hover);
            color: var(--button-secondary-color-hover);
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
        .hidden {
          display: none;
        }
    `
  }

  /**
   * renders the html
   *
   * @return {void}
   */
  renderHTML () {
    this.html = /* html */ `
        <slot></slot>
    `
  }
}
