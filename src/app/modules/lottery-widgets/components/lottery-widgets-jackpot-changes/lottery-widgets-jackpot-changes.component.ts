import { Component, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges, PLATFORM_ID, Inject, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { JackpotFormatPipe } from '../../../shared/pipes/jackpot-format.pipe';
import { LoadScripts } from '../../../shared/utils/load-scripts.utils';

@Component({
  selector: 'app-lottery-widgets-jackpot-changes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lottery-widgets-jackpot-changes.component.html',
  styleUrls: ['./lottery-widgets-jackpot-changes.component.scss']
})
export class LotteryWidgetsJackpotChangesComponent implements OnChanges {
  @Input() lastJackpots: Array<number>;
  @Input() currencyId: string;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private jackpotFormatPipe: JackpotFormatPipe,
              private zone: NgZone) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lastJackpots'] && changes['lastJackpots'].currentValue) {
      this.zone.runOutsideAngular(() => {
        setTimeout(() => {
          this.zone.run(() => {
            this.initChartist(this.currencyId, this);
          });
        }, 0);
      });
    }
  }

  initChartist(currencyId, component) {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof(Chartist) === 'undefined') {
        LoadScripts.append('chartist.bundle.js', () => this.createChartist(currencyId, component));
      } else {
        this.createChartist(currencyId, component);
      }
    }
  }

  createChartist(currencyId, component) {
    // http://gionkunz.github.io/chartist-js/getting-started.html
    new Chartist.Line('.last-jackpots-chart', {
        series: [this.lastJackpots],
      },
      {
        lineSmooth: false,
        axisX: {
          showGrid: true,
          offset: 0,
        },
        axisY: {
          showGrid: true,
          offset: 0,
        },
        height: 210,
        fullWidth: true,
        chartPadding: {
          top: 25,
          bottom: 20,
          left: 25,
          right: 25
        }
      })
      .on('draw', function (data) {
        // customize x,y main axis
        if (data.type === 'grid' && data.index === 0) {
          data.element.attr({'class': data.element.attr('class') + ' main-axis'});
        }

        // customize points
        if (data.type === 'point') {
          const circle = new Chartist.Svg('circle', {
            cx: data.x,
            cy: data.y,
            r: 4.2,
            'class': 'ct-point-circle'
          });
          data.element.replace(circle);

          // add labels for points
          const defaultOptions = {
            labelClass: 'ct-label-point',
            labelOffset: {
              x: 0,
              y: -12
            },
            textAnchor: 'middle'
          };
          const options = Chartist.extend({}, defaultOptions);

          const text = data.group.elem('text', {
            x: data.x + options.labelOffset.x,
            y: data.y + options.labelOffset.y,
            style: 'text-anchor: ' + options.textAnchor
          }, options.labelClass).text(component.jackpotFormatPipe.transform(data.value.y, currencyId, 'M', 'K', false));
        }
      });
  }
}
