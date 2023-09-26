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
  /**
   * @param {any} args
   */
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this._inputField = null
    this.url = new URL(document.location)
    this.query = this.url.searchParams
    this.queryOrder = this.url.searchParams.get("orderBy")

    // click on tableHead or paged nav
    this.clickListener = event => {
      this.setParam(event.target.getAttribute('data-name'), event.target.getAttribute('data-value'))
    }

    //onchange of dropdown
    this.dropdownChange = event => {
      this.setParam('pageSize', this.footDropdown.value)
    }

    // onclick event on search button
    this.search = event => {
      this.setParam('searchString', this.InputField.value) 
    }

    // onclick on reset button
    this.reset = event => {
      this.url.searchParams.delete("orderBy")
      this.url.searchParams.delete("searchString")
      window.location.replace(this.url)
    }

    // onClick on edit field
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

    //set URL with new params
    window.location.replace(this.url)
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    this.footDropdown.addEventListener('change', this.dropdownChange)
    this.aModal.forEach(a => a.addEventListener('click', this.openModal))
    this.footArrow.forEach(a => a.addEventListener('click', this.clickListener))
    this.renderHTML()
  }

  disconnectedCallback () {
    this.footDropdown.removeEventListener('change', this.dropdownChange)
    this.aModal.forEach(a => a.removeEventListener('click', this.openModal))
    this.footArrow.forEach(a => a.addEventListener('click', this.clickListener))
    this.allHeads.forEach(th => {
      if (th.hasAttribute('data-name')){
        th.addEventListener('click', this.clickListener)
      }
    })
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

      :host .search {
        display: flex;
        width: 100%;
        padding-bottom: var(--search-padding-bottom, 1em);
        justify-content: flex-end;
      }
      :host .search > * {
        margin-left: var(--search-children-margin-left, 1em);
      }
      :host .search input{
        width: var(--search-input-width, auto);
        height: var(--search-input-height, 60px);
      }
      :host .search a-button {
        --button-primary-height: var(--search-button-height, 60px);
        --color: var(--search-button-color, 60px)
      }

      :host table {
        display: table !important;
      }

      :host thead {
        width: 100%;
        background-color: var(--thead-background-color, var(--color-secondary));
        cursor: pointer;
      }
      :host thead th {
        transition: var(--thead-transition, 0.3s);
        --color: var(--thead-color, white);
        color: var(--color);
      }
      :host thead th:has(a-icon-mdx){
        display: inline-flex;
      }
      :host thead th:hover {
        --color: var(--color-hover);;
      }

      :host tbody{ 
        display: table-row-group !important;
      }
      :host tbody {
        --table-margin: 0;
      }
      :host tbody tr:nth-child(even) {
        background-color: var(--tbody-child-even-background-color, var(--m-gray-200));
      }
      :host th, 
      :host td {
        text-align: left;
        padding: var(--table-element-padding, 0.5em);
        --table-padding-right-last-child: var(--table-element-padding, 0.5em);
      }

      :host tfoot div {
        display: flex;
        align-items: center;
        justify-content: flex-end;        
        padding-top: var(--tfoot-padding-top, 1em);
      }
      :host tfoot div span,
      :host tfoot div select,
      :host tfoot div a-icon-mdx {
        margin: var(--tfoot-margin, 0 0.3em);
      }
      :host tfoot select {
        width: var(--tfoot-select-width, 70px);
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
      path: `${this.importMetaUrl}../../web-components-toolbox/src/css/reset.css`, // no variables for this reason no namespace
      namespace: false
    },
    {
      path: `${this.importMetaUrl}../../web-components-toolbox/src/css/style.css`, // apply namespace and fallback to allow overwriting on deeper level
      namespaceFallback: false
    }
  ]
  switch (this.getAttribute('namespace')) {
    case 'table-paged-default-':
      return this.fetchCSS([{
        path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
        namespace: false
      }, ...styles])
    default:
      return this.fetchCSS(styles)
  }
}

  /**
   * renders the html
   *
   * @return {void}
   */
  renderHTML () {
    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/button/Button.js`,
        name: 'a-button'
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      }
    ]).then(children => {
      // Create div for search
      const searchDiv = document.createElement('div')
      searchDiv.className = 'search'

      // Input field to current search
      this.InputField.setAttribute('type', 'text')
      this.InputField.value = this.query.get('searchString') ?? ''
      searchDiv.appendChild(this.InputField)

      // Add search button with icon
      const searchBtn = new children[0].constructorClass({ namespace: (this.getAttribute('namespace') ?? '' + 'button-primary-') , namespaceFallback: this.hasAttribute('namespace-fallback'), mobileBreakpoint: this.mobileBreakpoint }) // eslint-disable-line
      const searchIcon = new children[1].constructorClass({ namespace: this.getAttribute('namespace') || '', namespaceFallback: this.hasAttribute('namespace-fallback'), mobileBreakpoint: this.mobileBreakpoint }) // eslint-disable-line
      searchIcon.setAttribute('icon-name', 'Search')
      searchIcon.setAttribute('size', '1.5em')
      searchIcon.setAttribute('no-hover', '')
      searchBtn.root.appendChild(searchIcon)
      searchBtn.addEventListener('click', this.search)
      searchDiv.appendChild(searchBtn)

      const resetBtn = new children[0].constructorClass({ namespace: (this.getAttribute('namespace') ?? '' + 'button-secondary-') , namespaceFallback: this.hasAttribute('namespace-fallback'), mobileBreakpoint: this.mobileBreakpoint }) // eslint-disable-line
      const resetIcon = new children[1].constructorClass({ namespace: this.getAttribute('namespace') || '', namespaceFallback: this.hasAttribute('namespace-fallback'), mobileBreakpoint: this.mobileBreakpoint }) // eslint-disable-line
      resetIcon.setAttribute('icon-name', 'RotateLeft')
      resetIcon.setAttribute('size', '1.5em')
      resetIcon.setAttribute('no-hover', '')
      resetBtn.root.appendChild(resetIcon)
      resetBtn.addEventListener('click', this.reset)
      searchDiv.appendChild(resetBtn)

      this.root.prepend(searchDiv)

      // For all table Heads add arrow up or down
      this.allHeads.forEach(th => {
        if (th.hasAttribute('data-name')){
          th.addEventListener('click', this.clickListener)
          if (th.hasAttribute('data-value')){
            if (this.queryOrder != null){
              const value = th.getAttribute('data-value')
              if (this.queryOrder.startsWith(value)){
                const icon = new children[1].constructorClass({ namespace: this.getAttribute('namespace') || '', namespaceFallback: this.hasAttribute('namespace-fallback'), mobileBreakpoint: this.mobileBreakpoint }) // eslint-disable-line
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

      // Paged navigation in div
      const fragment = document.createDocumentFragment();
      Array.from(this.foot.children).forEach(c => fragment.appendChild(c))
      
      const footDiv = document.createElement('div')
      footDiv.appendChild(fragment);

      this.foot.appendChild(footDiv)
    })
  }

  get allHeads () {
    return this.root.querySelectorAll('thead>tr>th')
  }

  get foot () {
    return this.root.querySelector('tfoot>tr>td')
  }

  get footDropdown () {
    return this.foot.querySelector('select')
  }

  get aModal () {
    return this.root.querySelectorAll('a[open-modal-target]')
  }

  get InputField () {
    return this._inputField || (this._inputField = document.createElement('input'))
  }

  get footArrow () {
    return this.foot.querySelectorAll('a-icon-mdx')
  }
}
