// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * GTMEvent
 * An example at: src/es/components/pages/Benutzerprofil.html
 *
 * @export
 * @class GTMEvent
 * @type {CustomElementConstructor}
 */

export default class GTMEvent extends Shadow() {
    connectedCallback() {
        this.addEventListener('click', this.sendEvent);
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.sendEvent);
    }

    // @ts-ignore
    sendEvent(e) {
        // @ts-ignore
        if (this.dataLayer) {
            const eventData = this.getAttribute('event-data');
            console.log("eventData", eventData)
            if (eventData) {
                try {
                    const parsedData = JSON.parse(eventData);
                    // @ts-ignore
                    this.dataLayer.push(parsedData);
                } catch (err) {
                    console.error("Failed to parse event data:", err);
                }
            }
        }
    }

    reset() {
        // @ts-ignore
        if (this.dataLayer) {
            this.dataLayer.push(function() {
                this.reset();
            })
        }
    }
}
  