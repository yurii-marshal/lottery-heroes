import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class MetaService {
  constructor(private titleService: Title,
              private translate: TranslateService,
              private metaService: Meta) {
  }

  setTitle(newTitle: string): void {
    this.titleService.setTitle(newTitle);
  }

  setMetaDescription(description: string): void {
    this.metaService.updateTag({
      name: 'description',
      content: description,
    });
  }

  setMetaKeywords(keywords: string): void {
    this.metaService.updateTag({
      name: 'keywords',
      content: keywords
    });
  }

  setFromConfig(group: string, key: string): void {
    this.translate.get(`META.${group}.${key}.title`).subscribe((res: string) => {
      this.setTitle(res);
    });

    this.translate.get(`META.${group}.${key}.description`).subscribe((res: string) => {
      this.setMetaDescription(res);
    });
  }
}
