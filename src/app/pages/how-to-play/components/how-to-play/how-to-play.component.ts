import { Component, Input, OnChanges, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HowToPlayCmsInterface } from '../../entities/how-to-play-cms.interface';

@Component({
  selector: 'app-how-to-play',
  templateUrl: './how-to-play.component.html',
  styleUrls: ['./how-to-play.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HowToPlayComponent implements OnChanges {
  @Input() cms: HowToPlayCmsInterface;
  @Input() lotterySlug: string;
  @Input() lotteryId: string;

  @Output() clickPlayLotteryEvent = new EventEmitter<string>();

  cmsYouTubeVideoTrustedUrl: SafeResourceUrl;

  constructor(private domSanitizer: DomSanitizer) {
  }

  ngOnChanges(): void {
    if (this.cms) {
      this.cmsYouTubeVideoTrustedUrl = this.parseYoutubeUrl(this.cms.youtube_video_url);
    }
  }

  setHeight(e) {
    const item = e.target.parentElement;
    const input = item.children['0'];
    const itemWrapper = item.children['3'];
    const itemBody = item.children['3'].firstElementChild;

    if (input.checked) {
      itemWrapper.style.maxHeight = itemBody.offsetHeight + 'px';
    } else {
      itemWrapper.style.maxHeight = '0px';
    }
  }

  private parseYoutubeUrl(youtubeUrl: string): SafeResourceUrl {
    if (!youtubeUrl) {
      return null;
    }

    const youtubeRE = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
    const youtubeVideoId = youtubeUrl.match(youtubeRE)[1];
    const youtubeEmbedUrl = 'https://www.youtube.com/embed/' + youtubeVideoId;
    return this.domSanitizer.bypassSecurityTrustResourceUrl(youtubeEmbedUrl);
  }
}
