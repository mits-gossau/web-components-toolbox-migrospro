// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/* global self */

/**
 *
 * @export
 * @class VoiceOfCustomers
 * @type {CustomElementConstructor}
 * @attribute {}
 * @css {}
 */
export default class VoiceCustomers extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, mode: 'open' }, ...args)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    // if (this.shouldRenderHTML()) this.renderHTML()
    this.renderHTML()
  }

  disconnectedCallback () {}

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML () {
    return true
  }

  renderCSS () {
    this.css = /* css */` 
    :host {
      display:block; 
      background:red;
      height:5rem;
      color:black;
    }
    
    @media only screen and (max-width: _max-width_) {
      :host {}
    }`
  }

  renderHTML () {
    this.html = 'do something...'
  }

  /**
   * fetch dependency
   *
   * @returns {Promise<{components: any}>}
   */
  loadDependency () {
    // @ts-ignore
    self.initMap = () => { }

    return new Promise(resolve => {
      const googleMapScript = document.createElement('script')
      googleMapScript.setAttribute('type', 'text/javascript')
      googleMapScript.setAttribute('async', '')
      googleMapScript.setAttribute('src', this.MAP_URL)
      googleMapScript.onload = () => {
        // @ts-ignore
        if ('google' in self) resolve(self.google.maps)
      }
      this.html = googleMapScript
    })
  }
}
