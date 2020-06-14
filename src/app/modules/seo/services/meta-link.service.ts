import { Injectable, RendererFactory2, ViewEncapsulation, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export declare type LinkDefinition = {
  charset?: string;
  crossorigin?: string;
  href?: string;
  hreflang?: string;
  media?: string;
  rel?: string;
  rev?: string;
  sizes?: string;
  target?: string;
  type?: string;
} & {
  [prop: string]: string;
};

@Injectable()
export class MetaLinkService {

  constructor(private rendererFactory: RendererFactory2,
              @Inject(DOCUMENT) private document) {
  }

  /**
   * Inject the State into the bottom of the <head>
   */
  addTag(tag: LinkDefinition) {
    try {
      const renderer = this.rendererFactory.createRenderer(this.document, {
        id: '-1',
        encapsulation: ViewEncapsulation.None,
        styles: [],
        data: {}
      });

      const link = renderer.createElement('link');
      const head = this.document.head;

      if (head === null) {
        throw new Error('<head> not found within DOCUMENT.');
      }

      Object.keys(tag).forEach((prop: string) => {
        return renderer.setAttribute(link, prop, tag[prop]);
      });

      renderer.appendChild(head, link);

    } catch (e) {
      console.error('Error within linkService : ', e);
    }
  }

  removeTag(rel: string) {
    try {
      const renderer = this.rendererFactory.createRenderer(this.document, {
        id: '-1',
        encapsulation: ViewEncapsulation.None,
        styles: [],
        data: {}
      });
      const head = this.document.head;

      if (head === null) {
        throw new Error('<head> not found within DOCUMENT.');
      }

      const children = head.children;
      for (let idx = 0; idx < children.length; idx++) {
        if (children[idx].localName === 'link' && children[idx].rel === rel) {
          renderer.removeChild(head, children[idx]);
        }
      }

    } catch (e) {
      console.error('Error within linkService : ', e);
    }
  }
}
