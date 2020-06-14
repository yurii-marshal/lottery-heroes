import {Component, Input, OnInit} from '@angular/core';
import {Platform, platforms} from '../platforms.utils';
import {Properties} from '../properties.utils';
import {WindowService} from '../../../services/device/window.service';

@Component({
  selector: 'app-social-button',
  template: `<a href="{{this.url}}" (click)="click($event)" target='_blank' rel="nofollow">
    <div (click)="click($event)"
         class="n2s-share-btn n2s-share-btn-{{platform.name}} n2s-{{direction}}-margin
                  {{textEnabled ? 'n2s-share-btn-with-text' : '' }}">
      <i class="ic fa fa-{{platform.logoOfficial}}"></i>
      <span class="n2s-shareText" *ngIf="textEnabled">
                  <span class="n2s-shareText-primary">{{platform.text}} </span>
                  <span class="n2s-shareText-secondary">{{addedText}}</span>
                </span>
    </div>
  </a>
  `,
  styleUrls: ['./social-button.component.scss']
})
export class SocialButtonComponent implements OnInit {
  @Input() platformName;
  @Input() textEnabled: boolean;
  @Input() addedText: string;
  @Input() direction = 'horizontal';
  @Input() properties: Properties;

  platform: Platform;
  url: string;

  constructor(private windowService: WindowService) {
  }

  ngOnInit() {
    this.platform = platforms[this.platformName];
    this.constructUrl();
  }

  click(event) {
    this.windowService.nativeWindow.open(this.url, 'newwindow', 'width=1070, height=600');
    event.preventDefault();
  }

  constructUrl() {
    this.url = this.platform.url + this.properties.url;
    if (this.platform.properties) {
      for (const key in this.platform.properties) {
        // if the property has been found.
        if (this.properties[this.platform.properties[key]]) {
          this.url += `&${key}=${this.properties[this.platform.properties[key]]}`;
        }
      }
    }
  }
}
