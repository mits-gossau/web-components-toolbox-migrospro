// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * TablePaged
 *
 * @export
 * @class TablePaged
 * @type {CustomElementConstructor}
 */
export default class TablePaged extends Shadow() {
  constructor (...args) {
    super(...args)

    this.url = new URL(document.location)
    this.query = this.url.searchParams
    this.queryOrder = this.url.searchParams.get("orderBy")

    this.clickTable = event => {
      this.setParam(event.target.getAttribute('data-name'), event.target.getAttribute('data-value'))
    }

    this.dropdownChange = event => {
      this.setParam('pageSize', this.footDropdown.value)
    }

    this.openModal = event => {
      this.dispatchEvent(
        new CustomEvent(
          'open-modal', 
          { detail: 
            { origEvent: event, 
              child: event.target 
            }, 
            bubbles: true, 
            cancelable: true, 
            composed: true 
          }
        )
      )
    }
  }

  /**
   * @param {string} name
   * @param {string} value
   */
  setParam(name, value){
    switch (name) {
      case "orderBy":
        if (this.url.searchParams.get(name) === value) {
          this.url.searchParams.set(name, value + " Descending")
          break;
        }
      case "pageNumber":
        if (Number(value) == 0 || Number(value) == 1) {
          this.url.searchParams.delete(name)
          break;
        }
      default:
        this.url.searchParams.set(name, value)
    };

    window.location.replace(this.url)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    this.footDropdown.addEventListener('change', this.dropdownChange)
    this.aModal.forEach(a => a.addEventListener('click', this.openModal))
    this.renderHTML()
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
        --any-content-width: 80%;
      }
      :host thead{
        width: 100%;
        background-color: #04AA6D;
        cursor: pointer;
      }
      :host thead th{
        transition: 0.3s;
        --color: white;
        --color-hover: var(--color-secondary);
        color: var(--color);
      }
      :host thead th:hover {
        --color: var(--color-secondary);;
      }
      :host table {
        display: table !important;
      }
      :host table tbody{ 
        display: table-row-group !important;
      }
      :host tbody {
        --table-margin: 0;
      }
      :host tfoot td {
        text-align: end;
        padding-top: 2em;
      }
      :host tbody tr:nth-child(even) {
        background-color: #f2f2f2;
      }
      :host th, :host td{
        text-align: left;
        padding: 8px;
        --table-padding-right-last-child: 8px;
      }
    `
    return this.fetchTemplate()
  }

    /**
   * fetches the template
   *
   * @return {Promise<void>}
   */
    fetchTemplate () {
      /** @type {import("../../prototypes/Shadow.js").fetchCSSParams[]} */
      const styles = [
        {
          path: `${this.importMetaUrl}../../../css/reset.css`, // no variables for this reason no namespace
          namespace: false
        },
        {
          path: `${this.importMetaUrl}../../../css/style.css`, // apply namespace and fallback to allow overwriting on deeper level
          namespaceFallback: true
        }
      ]
      return this.fetchCSS(styles, false)
    }

  /**
   * renders the html
   *
   * @return {void}
   */
  renderHTML () {
    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      }
    ]).then(children => {
      this.allHeads.forEach(th => {
        if (th.hasAttribute('data-name')){
          th.addEventListener('click', this.clickTable)

          if (th.hasAttribute('data-value')){
            var value = th.getAttribute('data-value')
            if (this.queryOrder != null){          

              if (this.queryOrder.startsWith(value)){
                
                const icon = new children[0].constructorClass({ namespace: this.getAttribute('namespace') || '', namespaceFallback: this.hasAttribute('namespace-fallback'), mobileBreakpoint: this.mobileBreakpoint }) // eslint-disable-line

                icon.setAttribute('size', '1.5em')

                if (this.queryOrder.endsWith('Descending')){
                  icon.setAttribute('icon-name', 'ArrowDown')
                } else {
                  icon.setAttribute('icon-name', 'ArrowUp')
                }

                th.appendChild(icon)
              }
            }
          }
        }
      });
    })
  }

  get allHeads () {
    return this.root.querySelectorAll('thead>tr>th')
  }

  get foot () {
    return this.root.querySelector('tfoot')
  }

  get footDropdown () {
    return this.foot.querySelector('select')
  }

  get aModal () {
    return this.root.querySelectorAll('a[open-modal-target]')
  }
}
