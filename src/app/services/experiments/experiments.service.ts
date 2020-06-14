import { EventEmitter, Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs/Subject';

declare const dataLayer: Array<any>;

@Injectable()
export class ExperimentsService {
  switchExperimentalElements: EventEmitter<any> = new EventEmitter();
  experimentsSubject$: Subject<any>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone) {
    this.experimentsSubject$ = new Subject();
  }

  activate() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.switchExperimentalElements.emit(true);
    this.experimentsSubject$.asObservable()
      .delay(200)
      .subscribe(() => this.switchExperimentalElements.emit(false));
    this.runTriggeringExperiments();
  }

  runTriggeringExperiments() {
    let isNeedTriggered: any = dataLayer.push({'event': 'optimize.activate'});
    let startTriggering;

    this.zone.runOutsideAngular(() => {
      startTriggering = setInterval(() => {
        this.zone.run(() => {
          isNeedTriggered = dataLayer.push({'event': 'optimize.activate'});
          if (isNeedTriggered === false) {
            clearInterval(startTriggering);
            this.experimentsSubject$.next(true);
          }
        });
      }, 100);
    });

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.zone.run(() => {
          clearInterval(startTriggering);
          this.experimentsSubject$.next(true);
        });
      }, 2000);
    });
  }
}
