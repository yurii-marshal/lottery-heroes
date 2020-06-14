import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { EnvironmentService } from '../../../../services/environment/environment.service';
import { BrandParamsService } from '../../../../modules/brand/services/brand-params.service';
import { CombosService } from '../../../../services/combos/combos.service';
import { filter, first, switchMap } from 'rxjs/operators';
import { ComboItemModel } from '../../../../models/combo.model';
import { Observable } from 'rxjs/Observable';
import { ComboItemModelMap } from '../../../../services/combos/entities/combos-map.interface';
import { of } from 'rxjs/observable/of';
import { LotteriesService } from '../../../../services/lotteries/lotteries.service';
import { LotteryInterface } from '../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import { LotteriesMapInterface } from '../../../../services/lotteries/entities/interfaces/lotteries-map.interface';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Cart2ComboService } from '../../../../services/cart2/cart2-combo.service';
import { CartComboItemModel } from '../../../../models/cart/cart-combo-item.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offer-best-odds-combo-box-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-offer-best-odds-combo-box
      [bestOddsCombo]="bestOddsCombo$ | async"
      [comboLotteries]="comboLotteries$ | async"
      [boxName]="boxName"
      [boxNumber]="boxNumber"
      (redirectToCart)="redirectToCart()"
    ></app-offer-best-odds-combo-box>
  `
})
export class OfferBestOddsComboBoxContainerComponent implements OnInit {

  @Input() boxName: string;
  @Input() boxNumber: number;

  bestOddsCombo$: Observable<ComboItemModel>;
  comboLotteries$: Observable<LotteryInterface[]>;

  constructor(private environmentService: EnvironmentService,
              private brandParamsService: BrandParamsService,
              private comboService: CombosService,
              private lotteriesService: LotteriesService,
              private cart2ComboService: Cart2ComboService,
              private router: Router) {}

  ngOnInit(): void {
    const brandId: string = this.brandParamsService.getBrandId();
    const comboId = this.environmentService.getEnvironmentData('bestOddsCombo')[brandId].id;

    this.bestOddsCombo$ = this.comboService.getActiveCombosMap()
      .pipe(
        switchMap((comboItemModelMap: ComboItemModelMap) => of(comboItemModelMap[comboId])),
        filter((bestOddsCombo: ComboItemModel) => typeof bestOddsCombo !== 'undefined' && bestOddsCombo !== null)
      );

    this.comboLotteries$ = combineLatest(
      this.bestOddsCombo$.publishReplay(1).refCount(),
      this.lotteriesService.getSoldLotteriesMap()
    )
      .pipe(
        first(),
        switchMap(([bestOddsCombo, lotteriesMap]: [ComboItemModel, LotteriesMapInterface]) => {
          const lotteries = Array.from(
            bestOddsCombo.items,
            ({ lottery_id, items_qty }: { lottery_id: string, items_qty: number }) => {
              return lotteriesMap[lottery_id];
            });

          return of(lotteries);
        })
      );
  }

  redirectToCart(): void {
    this.bestOddsCombo$.publishReplay(1).refCount()
      .pipe(
        first()
      )
      .subscribe((combo: ComboItemModel) => {
        const lines = this.cart2ComboService.generateLines(combo);
        this.cart2ComboService.addItems([new CartComboItemModel(combo.id, lines)]);
        this.router.navigate(['/cart']);
      });
  }
}
