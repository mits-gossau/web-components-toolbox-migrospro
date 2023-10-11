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
 *  {event-data} {...} object to be pushed to the dataLayer
 * }
 * @example {
    <c-gtm-event event-data='{
       "event": "register",
       "action": "started",
       "step": "1"
     }'>
       <a-button namespace="button-primary-">Register started</a-button>
    </c-gtm-event>
 * }
 */

export default class GTMEvent extends Shadow() {
    constructor(options = {}, ...args) {
        super({ importMetaUrl: import.meta.url, ...options }, ...args)
    }

    connectedCallback() {
        this.addEventListener('click', this.sendEvent);
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.sendEvent);
    }

    sendEvent(event) {
        // @ts-ignore
        if (window.dataLayer) {
            const eventData = this.getAttribute('event-data');
            if (eventData) {
                try {
                    const parsedData = JSON.parse(eventData);
                    // @ts-ignore
                    window.dataLayer.push(parsedData);
                } catch (err) {
                    console.error("Failed to parse event data:", err);
                }
            }
        }
    }

    reset() {
        // @ts-ignore
        if (window.dataLayer) {
            // @ts-ignore
            window.dataLayer.push(function() {
                this.reset();
            })
        }
    }
}
  