// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * GTMEvent
 * An example at Migros Pro: src/es/components/pages/TrackingTest.html
 *
 * @export
 * @class GTMEvent
 * @type {CustomElementConstructor}
 * @attribute {
 *  {listen-to} 'click', 'change', 'on-page-load'
 *  {event-data} {...} object to be pushed to the dataLayer
 * }
 * @example {
    <c-migrospro-gtm-event event-data='{
       "event": "register",
       "action": "started",
       "step": "1"
     }'>
       <a-button namespace="button-primary-">Register started</a-button>
    </c-migrospro-gtm-event>
 * }
 */

export default class GTMEvent extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
    this.sendEvent = this.sendEvent.bind(this)
  }

  connectedCallback () {
    const eventType = this.getAttribute('listen-to')

    switch (eventType) {
      case 'click':
        this.addEventListener('click', this.sendEvent)
        break
      case 'change':
        this.shadowRoot.querySelectorAll('*').forEach(child => {
          child.addEventListener('change', this.sendEvent)
        })
        break
      case 'on-page-load':
        this.sendEvent()
        break
      default:
        console.error('Invalid event type: ' + eventType)
        break
    }
  }

  disconnectedCallback () {
    this.removeEventListener('click', this.sendEvent)
    this.shadowRoot.querySelectorAll('*').forEach(child => {
      child.removeEventListener('change', this.sendEvent)
    })
  }

  sendEvent (event) {
    this.eventData = JSON.parse(this.getAttribute('event-data'))

    if (event?.target?.name) {
      this.eventData[event.target.name] = event.target.value
    }

    // @ts-ignore
    if (typeof window !== 'undefined' && window.dataLayer) {
      try {
        // @ts-ignore
        window.dataLayer.push(this.eventData)
      } catch (err) {
        console.error('Failed to push event data:', err)
      }
    }
  }
}
