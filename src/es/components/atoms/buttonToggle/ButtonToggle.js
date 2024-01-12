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
            const scrollPosition = document.getElementsByTagName("html")[0].scrollTop + "px"
            this.renderNotification("c-favorite", "La commande active sera mise à jour.", { top: scrollPosition, right: "2em" })

            // handle active and not active toggle button reactivity
            const cardsWithToggleButton = Array.from(this.getRootNode().querySelectorAll("m-migrospro-card-order")).filter(card => {
              return card.querySelectorAll("a-migrospro-button-toggle").length > 0
            })

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

  renderNotification(dependsElementName, description, position, renderingDuration = 4000, type = "success",) {
    if (dependsElementName && description) {
      const chainedElement = document.querySelector(`${dependsElementName}`)
      const systemNotificationWrapper = document.createElement("div")
      systemNotificationWrapper.innerHTML = /* html */ `
      <m-system-notification>
        <style>
        :host {
          position: absolute;
          z-index: 55555;
          width: auto;
          animation: var(--show, show .3s ease-out);
        }
        :host .description {
          padding: 0.5 !important;
          display: flex;
        }
        :host .description p {
          margin: 0 0 0 1em;
        }
        @keyframes show {
          0%{opacity: 0}
          100%{opacity: 1}
        }
        </style>
        <div class="description" slot="description">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="#2E5C23" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p>${description}</p>
        </div>
      </m-system-notification>
      `
      const systemNotificationElement = systemNotificationWrapper.querySelector("m-system-notification")

      if (systemNotificationElement) {
        // @ts-ignore
        systemNotificationElement.style.top = position.top || "";
        // @ts-ignore
        systemNotificationElement.style.right = position.right || "";
        // @ts-ignore
        systemNotificationElement.style.bottom = position.bottom || "";
        // @ts-ignore
        systemNotificationElement.style.left = position.left || "";
        systemNotificationElement.setAttribute("type", type)
        systemNotificationWrapper.setAttribute("role", "alert")
      }

      chainedElement?.prepend(systemNotificationWrapper)
      // remove notification
      setTimeout(() => {
        chainedElement?.removeChild(systemNotificationWrapper)
      }, renderingDuration);
    }
    return
  }
}
