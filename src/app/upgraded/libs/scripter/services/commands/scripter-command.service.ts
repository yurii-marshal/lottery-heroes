import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class ScripterCommandService {
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2,
              @Inject(DOCUMENT) private document) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  addScript(id: string, value: any, place: 'head' | 'body' = 'body', type = 'text/javascript'): void {
    const script = this.renderer.createElement('script');
    this.renderer.setAttribute(script, 'id', id);
    this.renderer.setAttribute(script, 'type', type);

    const textValue = (typeof value !== 'string') ? JSON.stringify(value) : value;
    const textElement = this.renderer.createText(textValue);
    this.renderer.appendChild(script, textElement);

    let placeToAdd;
    switch (place) {
      case 'head':
        placeToAdd = this.document.head;
        break;
      case 'body':
        placeToAdd = this.document.body;
        break;
    }

    this.renderer.appendChild(placeToAdd, script);
  }

  removeScript(id: string): void {
    try {
      const script = this.renderer.selectRootElement(`script#${id}`);
      this.renderer.removeChild(this.renderer.parentNode(script), script);
    } catch (error) {
    }
  }
}
