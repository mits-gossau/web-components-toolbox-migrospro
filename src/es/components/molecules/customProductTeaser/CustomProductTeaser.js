// @ts-check
import Teaser from "../../web-components-toolbox/src/es/components/molecules/teaser/Teaser.js";

export default class MProCustomProductTeaser extends Teaser {
  constructor(options = {}, ...args) {
    super({ ...options }, ...args);
  }

  connectedCallback() {
    if (this.shouldRenderCSS()) this.renderCSS();
    if (this.shouldRenderHTML()) this.renderHTML();
  }

  shouldRenderCSS() {
    return !this.root.querySelector(`${this.cssSelector} > style[_css]`);
  }

  shouldRenderHTML() {
    return !this.root.querySelector(".teaser-list");
  }

  renderCSS() {
    this.css = /* css */ `
        :host img {
            object-fit: cover;
            width: 100%;
            height: 100%;
        }
        :host img.imageFullsize {
            aspect-ratio: 21/16;
        }
        :host img.imageTileview {
            aspect-ratio: 9/10;
            margin-bottom: var(--content-spacing, 1.143rem);
        }
        :host div.teaserContent {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        :host h2.productName {
            display: flex;
            flex-wrap: wrap;
            align-content: center;
            font-family: var(--font-family-bold);
            font-size: max(1.4vw, 18px);
            line-height: var(--custom-product-teaser-h2-line-height, var(--h2-line-height, var(--line-height, 1.334em)));
            word-break: break-all;
            height: calc(var(--custom-product-teaser-h2-line-height, var(--h2-line-height, var(--line-height, 1.334em))) * 2);
            margin-top: 0;
            margin-bottom: 0;
        }
        :host p {
            font-family: var(--font-family);
            font-size: var(--p-font-size, 1em);
            line-height: var(--custom-product-teaser-p-line-height, var(--p-line-height, var(--line-height, 1.5)));
        }
        :host p.articleNumber {
            margin-top: 0;
            margin-bottom: 1em;
        }
        :host p.price {
            font-size: max(1.25vw, 19px);
            margin-top: var(--content-spacing, 1.143rem);
            margin-bottom: var(--content-spacing, 1.143rem);
        }
        :host div.bottomContent {
            width: 100%;
        }
        :host div.description {
            display: flex;
            align-items: flex-end;
        }
        :host div.descriptionFullsize {
            height: calc(var(--custom-product-teaser-p-line-height, var(--p-line-height, var(--line-height, 1.5))) * var(--p-font-size) * 6);
            margin-top: 1em;
            margin-bottom: 1em;
        }
        :host div.descriptionTileview {
            height: calc(var(--custom-product-teaser-p-line-height, var(--p-line-height, var(--line-height, 1.5))) * var(--p-font-size) * 3);
            margin-top: 1em;
            margin-bottom: 1em;
        }
        :host p.description {
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
        }
        :host p.descriptionFullsize {
            -webkit-line-clamp: 6;
            margin: 0;
        }
        :host p.descriptionTileview {
            -webkit-line-clamp: 3;
            margin: 0;
        }
        :host div.description span.tooltip {
            position: absolute;
            z-index: 1;
            visibility: hidden;
            font-family: var(--font-family);
            color: var(--m-white, #ffffff);
            background-color: var(--m-black, #333);
            text-align: center;
            width: auto;
            max-width: 50%;
            padding: 10px 8px;
            border-radius: 0.5rem;
        }
        :host div.description:hover span.tooltip {
            visibility: visible;
        }
        :host a-button {
            word-break: break-all;
            background-color: var(--m-orange-600, #ff6600);
            border: 0;
            border-radius: 0.5rem;
            margin: 0;
            width: 100%;
        }

        @media only screen and (max-width: _max-width_) {
            :host m-migrospro-custom-product-teaser.fullsize div.teaserContent {
                order: 2;
            }
            :host img.imageFullsize, :host img.imageTileview {
                aspect-ratio: 9/10;
                margin-bottom: var(--content-spacing, 1.143rem);
            }
            :host div.teaserContent {
              order: 2;
            }
            :host h2.productName {
                font-size: 2em;
                height: auto;
            }
            :host p.price {
                font-size: 1.5em;
            }
            :host p.descriptionFullsize, p.descriptionTileview {
                -webkit-line-clamp: 3;
                margin: 0;
            }
            :host div.description span.tooltip {
                position: absolute;
                left: 50%;
                margin-left: -45%;
                z-index: 1;
                visibility: hidden;
                font-family: var(--font-family);
                color: var(--m-white, #ffffff);
                background-color: var(--m-black, #333);
                text-align: center;
                width: auto;
                max-width: 90%;
                border-radius: 0.5rem;
            }
            :host div.description:focus span.tooltip, div.description:hover span.tooltip {
                visibility: visible;
            }
        }
    `;
    return this.fetchTemplate();
  }

  fetchTemplate() {
    const baseStyles = [
      {
        path: `${this.importMetaUrl}../../../../css/reset.css`, // no variables for this reason no namespace
        namespace: false,
      },
      {
        path: `${this.importMetaUrl}../../../../css/style.css`, // apply namespace and fallback to allow overwriting on deeper level
        namespaceFallback: true,
      }
    ];
    switch (this.getAttribute("namespace")) {
      case "custom-product-teaser-default-":
        return this.fetchCSS({
          path: "/src/es/components/molecules/customProductTeaser/default-/default-.css",
          namespace: false,
        });
      default:
        return this.fetchCSS(baseStyles);
    }
  }

  renderHTML() {
    // path is wrong for FE, but is correct in BE!
    const fetchModules = this.fetchModules([
      {
        path: "/web-components-toolbox-migrospro/src/es/components/web-components-toolbox/src/es/components/organisms/grid/Grid.js",
        name: "o-grid",
      },
    ]);
    Promise.all([fetchModules])
  }
}
