import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';

import {CartLotteryItemModel} from '../../../../../../models/cart/cart-lottery-item.model';
import {CartItemPrice} from '../../../../../../services/cart2/entities/cart-item-price-map';
import {
    OfferingsSubscriptionDiscountInterface
} from '../../../../../../modules/api/entities/incoming/offerings/offerings-subscription-discounts.interface';
import {LotteryInterface} from '../../../../../../modules/api/entities/incoming/lotteries/lotteries.interface';
import {DrawInterface} from '../../../../../../modules/api/entities/incoming/lotteries/draws.interface';
import {OfferFreeLinesInterface} from '../../../../../../modules/api/entities/incoming/offerings/offerings-offers.interface';
import {LineInterface} from '../../../../../../modules/api/entities/outgoing/common/line.interface';
import {LotteriesService} from '../../../../../../services/lotteries/lotteries.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-cart-item-lottery',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './cart-item-lottery.component.html',
    styleUrls: ['./cart-item-lottery.component.scss']
})
export class CartItemLotteryComponent implements OnChanges, OnInit {
    @Input() item: CartLotteryItemModel;
    @Input() index: number;
    @Input() lottery: LotteryInterface;
    @Input() upcomingDraw: DrawInterface;
    @Input() freeLinesOffer: OfferFreeLinesInterface;
    @Input() siteCurrencyId: string;
    @Input() itemPrice: CartItemPrice;
    @Input() renewPeriods: Array<OfferingsSubscriptionDiscountInterface>;
    @Input() skipFirstDrawParam: string | null;
    @Input() expandedLines: boolean;

    @Output() openLinesClickEvent = new EventEmitter<void>();
    @Output() closeLinesClickEvent = new EventEmitter<void>();
    @Output() renewPeriodChangeEvent = new EventEmitter<{ item: CartLotteryItemModel, value: string | null }>();
    @Output() deleteItemEvent = new EventEmitter<CartLotteryItemModel>();
    @Output() deleteLineEvent = new EventEmitter<LineInterface>();
    @Output() editLineEvent = new EventEmitter<{ item: CartLotteryItemModel, editedLine: LineInterface }>();
    @Output() addAutoselectedLineEvent = new EventEmitter<string>();
    @Output() removeLastLineEvent = new EventEmitter<{ lotteryId: string, value: string | number }>();
    @Output() setLinesNumberEvent = new EventEmitter<{ lotteryId: string, value: number }>();
    @Output() addFreeLinesEvent = new EventEmitter<{ lotteryId: string, addFreeLinesText: string }>();
    @Output() scrollToEvent = new EventEmitter<HTMLElement>();
    @Output() changeSubsription = new EventEmitter<{ label: string, value: string | null }>();
    @Output() showSubscriptionsTooltip = new EventEmitter<void>();

    @ViewChild('linesListWrapper') linesListWrapper: ElementRef;
    @ViewChild('linesListBody') linesListBody: ElementRef;
    @ViewChild('buttonLineToggle') buttonLineToggle: ElementRef;
    @ViewChild('buttonLineToggleMobile') buttonLineToggleMobile: ElementRef;
    @ViewChild('addLineLink') addLineLink: ElementRef;
    @ViewChild('cartItem') cartItem: ElementRef;
    @ViewChild('inputLinesNumber') inputLinesNumber: ElementRef;
    @ViewChild('inputLinesNumberMobile') inputLinesNumberMobile: ElementRef;

    addFreeLinesText = '';
    nonFreeLinesNumber = 0;
    freeLinesNumber = 0;
    isRemoveOneLine: boolean;
    isLinesOpened: boolean;
    toggler = true;
    togglerMobile = true;

    freeLineClass: string;
    linesFree: number;
    linesToQualify: number;
    ribbonText: string;
    isShowRibbon: boolean;
    renewPeriodSelected: any;
    lotterySlug: string;

    changeSubscriptionLabel = 'Monthly Subscription';

    constructor(private lotteriesService: LotteriesService,
                private translate: TranslateService) {
    }

    ngOnInit() {
        this.checkIsLineFree();
        if (this.expandedLines) {
            this.toggleLines();
            this.toggleLinesBody();
        }
        this.translate.get('CartItemLotteryComponent.TEXT_MONTHLY_SUBSCRIPTION')
            .subscribe( res => { this.changeSubscriptionLabel = res; } );
        this.translate.onLangChange.subscribe( event => {
            // console.log(event);
            this.translate.get('CartItemLotteryComponent.TEXT_MONTHLY_SUBSCRIPTION')
                .subscribe( res => { this.changeSubscriptionLabel = res; } );
            // this.changeSubscriptionLabel = this.translate.instant('CartItemLotteryComponent.TEXT_MONTHLY_SUBSCRIPTION');
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['item']) {
            this.nonFreeLinesNumber = this.item.lines.filter(line => !line.isFree).length;
            this.freeLinesNumber = this.item.lines.filter(line => line.isFree).length;
            this.isRemoveOneLine = this.canDeleteOneLine();
        }

        if (changes['item'] || changes['renewPeriods']) {
            if (this.item !== null && this.renewPeriods !== null) {
                this.renewPeriodSelected = this.renewPeriods.find(period => period.period === this.item.renewPeriod);
            }
        }

        if ((changes['item'] || changes['freeLinesOffer']) && this.freeLinesOffer) {
            this.addFreeLinesText = this.getAddFreeLinesText();
        }

        if (changes.lottery && changes.lottery.currentValue) {
            this.lotterySlug = this.lotteriesService.getSlugByLottery(this.lottery);
        }
    }

    private getAddFreeLinesText(): string {
        return `Add ${this.freeLinesOffer.details.lines_to_qualify - this.nonFreeLinesNumber
        % this.freeLinesOffer.details.lines_to_qualify}
    lines Get ${this.freeLinesOffer.details.lines_free} FREE!`;
    }

    checkIsLineFree() {
        if (this.freeLinesOffer) {
            this.freeLineClass = this.freeLinesOffer.display_properties.ribbon_css_class;
            this.linesFree = this.freeLinesOffer.details.lines_free;
            this.linesToQualify = this.freeLinesOffer.details.lines_to_qualify;
            this.ribbonText = this.freeLinesOffer.display_properties.short_text;
            this.isShowRibbon = this.freeLinesOffer.display_properties.ribbon_lotteries_page;
        }
    }

    toggleLines(): void {
        if (this.toggler) {
            Velocity(this.linesListWrapper.nativeElement, 'slideDown', {display: 'flex', duration: 200});
            Velocity(this.buttonLineToggle.nativeElement, {rotateZ: '180deg'}, {duration: 200});
            Velocity(this.buttonLineToggleMobile.nativeElement, {rotateZ: '180deg'}, {duration: 200});
            this.openLinesClickEvent.emit();

            this.toggler = false;

        } else {
            Velocity(this.linesListWrapper.nativeElement, 'slideUp', {duration: 200});
            Velocity(this.buttonLineToggle.nativeElement, {rotateZ: '0deg'}, {duration: 200});
            Velocity(this.buttonLineToggleMobile.nativeElement, {rotateZ: '0deg'}, {duration: 200});
            this.closeLinesClickEvent.emit();

            this.toggler = true;
        }
    }

    toggleLinesBody(): void {
        if (this.togglerMobile) {
            Velocity(this.linesListBody.nativeElement, 'slideDown', {duration: 200});
            this.isLinesOpened = true;
            this.togglerMobile = false;

        } else {
            Velocity(this.linesListBody.nativeElement, 'slideUp', {duration: 200});
            this.isLinesOpened = false;
            this.togglerMobile = true;
        }
    }

    scrollToAddAutoselectedLine(): void {
        this.addAutoselectedLineEvent.emit(this.lottery.id);
        this.scrollToEvent.emit(this.addLineLink.nativeElement);
    }

    trackByLineId(index: number, line: LineInterface): string {
        return line.id;
    }

    canDeleteOneLine(): boolean {
        return (this.item.lines.length - 1) >= this.lottery.rules.min_lines;
    }

    isShowFreeLinesButton(): boolean {
        if (this.freeLinesOffer) {
            return this.freeLinesOffer.details.is_multiplied || this.freeLinesNumber < this.freeLinesOffer.details.lines_free;
        } else {
            return false;
        }
    }

    onInputMaxCheck(value) {
        if (value > 200) {
            this.inputLinesNumber.nativeElement.value = 200;
            this.inputLinesNumberMobile.nativeElement.value = 200;
        }
    }
}
