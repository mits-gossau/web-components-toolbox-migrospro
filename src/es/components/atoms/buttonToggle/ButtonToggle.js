// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/* global self */

/**
 * ButtonToggle
 * An example at: src/es/components/pages/Benutzerprofil.html
 *
 * @export
 * @class ButtonToggle
 * @type {CustomElementConstructor}
 */

export default class ButtonToggle extends Shadow() {
  constructor(options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
    this.orderId = this.getAttribute('order-id')
    this.isActive = this.getAttribute('is-active') === 'true'
    this.addEventListener('click', this.handleClick)
  }

  connectedCallback() {
    if (this.shouldRenderCSS()) this.renderCSS()
  }

  handleClick() {
    // @ts-ignore
    const toggleDefaultOrder = self.Environment.getApiBaseUrl('migrospro').apiToggleDefaultOrder + '?orderId=' + this.orderId
    if (toggleDefaultOrder) {
      fetch(toggleDefaultOrder)
        .then(response => response.json())
        .then(result => {
          if (result.requestSuccess) {
            this.dispatchEvent(new CustomEvent('request-basket',
              {
                bubbles: true,
                cancelable: true,
                composed: true
              }
            ))

            this.dispatchEvent(new CustomEvent('render-timed-system-notification',
                {
                  detail: {
                    position: {
                      top: 40,
                      right: 30,
                    },
                    description: "La commande active sera mise à jour.",
                    duration: 4000,
                    type: "success"
                  },
                  bubbles: true,
                  cancelable: true,
                  composed: true
                }
              ))

            // handle active and not active toggle button reactivity
            const cardsWithToggleButton = Array.from(this.getRootNode().querySelectorAll("m-migrospro-card-order")).filter(card => card.querySelectorAll("a-migrospro-button-toggle").length > 0)

            cardsWithToggleButton.map(card => {
              const toggleButton = card.querySelector("a-migrospro-button-toggle")

              if (toggleButton === this) {
                this.isActive = !this.isActive
                this.renderCSS()
              } else {
                toggleButton.isActive = false
                toggleButton.renderCSS()
              }
            })
          }
        })
        .catch(error => console.error(error))
    }
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
      :host {
        --color: ${this.isActive ? 'var(--m-white)' : 'var(--m-orange-600)'};
        --background-color: ${this.isActive ? 'var(--m-orange-600)' : 'transparent'};
        background-color: var(--background-color, transparent);
        border-color: var(--border-color, transparent);
        border-style: solid;
        border-radius: var(--border-radius, var(--button-action-border-radius, 0.5em));
        border-width: var(--button-action-border-width, var(--button-action-border-width-custom, 2px));
        cursor: pointer;
        height: var(--height, 2.5rem);
        width: var(--width, 3.5rem);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      :host(:hover) {
        --color: var(--m-orange-600);
        border-color: var(--border-color-hover, var(--m-orange-600));
        background-color: var(--background-color-hover, transparent);
      }
    `
  }
}
