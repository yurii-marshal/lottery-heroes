import {Component, Inject, Input, OnInit, PLATFORM_ID} from '@angular/core';
import {Properties} from '../properties.utils';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {WindowService} from '../../../services/device/window.service';

@Component({
  selector: 'app-social-container',
  templateUrl: './social-container.component.html',
  styleUrls: ['./social-container.component.scss'],
})
export class SocialContainerComponent implements OnInit {
  // Primary platforms that appear
  @Input() platforms = ['twitter', 'facebook'];
  // Secondary Platforms that appear when expanded
  @Input() secondaryPlatforms = ['googlePlus', 'reddit', 'pinterest', 'linkedin'];
  // Wether or not the component is expendable
  @Input() expandable = true;
  // tells if the text must be enabled on primary platforms
  @Input() textEnabled = false;
  // Text added to the vanilla message, ex: 'your creation' will result in
  // 'Tweet your creation' for twitter or 'Share your creation' for fb
  @Input() addedText: string;
  // This should be set up directly in the meta tags as this is good practice
  // Use this input only if you have multiple content to share per url.
  // So in case you need this the input should be like the following object (you can omitt some fields)
  // {title:'my title', description:'my desc',img:' an image', via:'Ced_VDB', hashtags:'someHashTag'}
  @Input() properties: Properties = {};
  // horizontal layout or vertical layout (_accessed via getter & setter)
  _direction = 'horizontal';
  // state of the secondary platform expandable pannel
  expandedState = 'collapsed';

  constructor(@Inject(DOCUMENT) private document,
              @Inject(PLATFORM_ID) private platformId: Object,
              private windowService: WindowService) {
  }

  ngOnInit() {
    this.fetchProperties();
  }

  fetchProperties() {
    if (isPlatformBrowser(this.platformId)) {
      this.properties.url =
        this.properties.url || this.getMetaContent('og:url') || this.windowService.nativeWindow.location.href.toString();
      this.properties.title = this.properties.title || this.getMetaContent('og:title') || this.document.title;
      this.properties.description = this.properties.description || this.getMetaContent('og:description');
      this.properties.image = this.properties.image || this.getMetaContent('og:image');
      this.properties.via = this.properties.via || this.getMetaContent('n2s:via');
      this.properties.hashtags = this.properties.hashtags || this.getMetaContent('n2s:hashtags');
      for (const p in this.properties) {
        if (this.properties.hasOwnProperty(p)) {
          this.properties[p] = encodeURIComponent(this.properties[p]);
        }
      }
    }
  }

  getMetaContent(property: string) {
    const elem = this.document.querySelector(`meta[property='${property}']`);
    if (elem) {
      return elem.getAttribute('content');
    }
    return '';
  }

  // safe check to prevent missuses
  @Input()
  set direction(direction) {
    this._direction = 'horizontal';

    if (direction === 'vertical') {
      this._direction = direction;
    }
  }

  get direction() {
    return this._direction;
  }
}
