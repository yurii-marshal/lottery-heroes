import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { DrawsService } from '../../../../services/lotteries/draws.service';
import { LightboxesService } from '../../../../modules/lightboxes/services/lightboxes.service';
import { Router } from '@angular/router';
import { MygamesService } from '../mygames.service';
import { WalletService } from '../../../../services/wallet.service';
import { CurrencyPipe } from '@angular/common';
import { CurrencyService } from '../../../../services/auth/currency.service';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../store/reducers/index';
import { GlobalService } from '../../../../services/global.service';
import { LotteriesService } from '../../../../services/lotteries/lotteries.service';

@Component({
  selector: 'app-status-game',
  template: `<div class="td-status" #statusButton>
              <div class="link status" (click)="clickStatus($event);">
                <span>{{value}}</span><i class="biglotteryowin-down-open"></i>
              </div>
            </div>`
})
export class StatusGameComponent {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @Input() value: any;
  @Input() rowData: any;

  subscriptionStatus: string;
  isShow = false;
  drawResult = null;
  view;
  currency_id: string;
  sessionStatus: string;
  customerStatusId: string;

  @ViewChild('statusButton') statusButton: ElementRef;

  constructor(private store: Store<fromRoot.State>,
              private elRef: ElementRef,
              private renderer: Renderer2,
              private drawsService: DrawsService,
              private lightboxesService: LightboxesService,
              private lotteriesService: LotteriesService,
              private router: Router,
              private mygamesService: MygamesService,
              private walletService: WalletService,
              private currencyPipe: CurrencyPipe,
              private globalService: GlobalService,
              private currencyService: CurrencyService) {
    this.currencyService.getCurrencyId()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(id => this.currency_id = id);
    this.store.select(fromRoot.getSessionStatus)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((status: string) => this.sessionStatus = status);
  }

  clickStatus(event) {
    event.stopPropagation();
    const drawId = this.rowData.drawId;
    if (this.statusButton.nativeElement.classList.contains('open')) {
      this.statusButton.nativeElement.classList.remove('open');
    } else {
      this.statusButton.nativeElement.classList.add('open');
    }
    if (drawId && drawId > 0) {
      this.drawsService.getDraw(this.rowData.gameLines[0].draw_id).subscribe(
        draw => {
          this.drawResult = draw;
          this.checkSubscriptionStatus();
        },
        error => console.error('StatusGameComponent error getDrawById', error)
      );
    } else {
      this.checkSubscriptionStatus();
    }
  }

  checkSubscriptionStatus() {
    if (this.rowData.type === 'subscriptions') {
      this.walletService.getCustomerSubscriptionById(this.rowData.subscriptionId).subscribe(
        sub => {
          this.subscriptionStatus = sub.subscription.status;
          this.onShowViewLine();
        }
      );
    } else {
      this.onShowViewLine();
    }
  }

  onShowViewLine() {
    const tr = this.elRef.nativeElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
    if (this.isShow) {
      this.closeViewGame();
    } else {
      this.view = this.createTemplate();
      tr.parentNode.insertBefore(this.view, tr.nextSibling);
      this.isShow = !this.isShow;
      this.mygamesService.getSortTableEvent()
        .first()
        .subscribe(() => this.closeViewGame());
    }
  }

  createTemplate() {
    const trElem = this.renderer.createElement('tr');
    const tdElem = this.renderer.createElement('td');
    const linesListElem = this.renderer.createElement('div');
    const winningElem = this.renderer.createElement('div');
    const winningAmount = this.rowData.winnings;

    trElem.classList.add('game-details');
    tdElem.setAttribute('colspan', 5);
    linesListElem.classList.add('game-lines-list');
    winningElem.classList.add('hidden-sm-up', 'winnings-info');

    this.rowData.gameLines.map(elem => {
      if (elem.lines) {
        // syndicates
        this.addStatusClass(elem.status, winningElem);
        elem.lines.map(numbers => {
          const numbersElem = this.renderer.createElement('div');
          const extraNums = this.getExtraNumbers(numbers, 'extra_numbers', 'perticket_numbers');
          this.createMainNumbers(numbers['main_numbers'], numbersElem);
          this.createExtraNumbers(extraNums, numbersElem);
          this.renderer.addClass(numbersElem, 'line-item');
          this.renderer.appendChild(linesListElem, numbersElem);
        });
      } else {
        // lines
        const numbersElem = this.renderer.createElement('div');
        const numbers = JSON.parse(elem.numbers);
        const extraNums = this.getExtraNumbers(numbers, 'extra', 'perticket');
        this.addStatusClass(elem.line_status_id, winningElem);
        this.createMainNumbers(numbers['main'], numbersElem);
        this.createExtraNumbers(extraNums, numbersElem);
        this.renderer.addClass(numbersElem, 'line-item');
        this.renderer.appendChild(linesListElem, numbersElem);
      }

      this.renderer.appendChild(tdElem, linesListElem);
    });

    winningElem.innerHTML = '<b>Winnings:</b>' + this.currencyPipe.transform(winningAmount, this.currency_id, 'symbol', '1.2-2');

    // this.renderer.appendChild(linesListElem, this.createCloseButton());
    this.renderer.appendChild(tdElem, this.createSectionByType());
    this.renderer.appendChild(tdElem, winningElem);
    this.renderer.appendChild(trElem, tdElem);
    return trElem;
  }

  createMainNumbers(numbers, container) {
    numbers.map(num => {
      const span = this.renderer.createElement('span');
      const resultMainNumbers = this.drawResult.winning_main_numbers;
      span.innerHTML = num;
      if (resultMainNumbers) {
        resultMainNumbers.map(n => {if (n === num) { span.classList.add('equal'); }});
      }
      this.renderer.appendChild(container, span);
    });
  }

  createExtraNumbers(numbers, container) {
    numbers.map(num => {
      const span = this.renderer.createElement('span');
      const resultExtraNumbers = this.drawResult.winning_extra_numbers ? this.drawResult.winning_extra_numbers
        : this.drawResult.winning_perticket_numbers;
      span.innerHTML = num;
      span.classList.add('extra');
      if (resultExtraNumbers) {
        resultExtraNumbers.map(n => {if (n === num) {span.classList.add('equal'); }});
      }
      this.renderer.appendChild(container, span);
    });
  }

  getExtraNumbers(numbers, extra, perticket) {
    return numbers[perticket] && numbers[perticket].length !== 0 ?  numbers[perticket] : numbers[extra];
  }

  addStatusClass(status, container) {
    if (status === 'open' || status === 'pending') {
      container.classList.add('hidden');
    }
  }

  createCloseButton() {
    const divElem = this.renderer.createElement('div');
    divElem.classList.add('close-view');
    divElem.innerHTML = '×';
    divElem.addEventListener('click', () => this.closeViewGame());
    return divElem;
  }

  createSectionByType() {
    const section =  this.renderer.createElement('div');
    section.classList.add('game-results');
    if (this.drawResult && this.drawResult.status_id === 'settled') {
      this.renderer.appendChild(section, this.createResultTemplate());
    }
    switch (this.rowData.type) {
      case 'subscriptions':
        if (this.subscriptionStatus === 'active') {
          const aElemSub = this.renderer.createElement('a');
          const textElemSub = this.renderer.createText('Unsubscribe');
          const tooltipHolder = this.renderer.createElement('span');
          const tooltipIcon = this.renderer.createElement('i');
          const tooltip = this.renderer.createElement('span');
          const tooltipText = this.renderer.createText('Your monthly subscription makes sure you take part in every future draw');
          tooltipHolder.classList.add('tooltip-holder');
          tooltipIcon.classList.add('biglotteryowin-question');
          tooltip.classList.add('tooltip-text');
          section.classList.add('subscription');
          this.renderer.appendChild(tooltipHolder, tooltipIcon);
          this.renderer.appendChild(tooltip, tooltipText);
          this.renderer.appendChild(tooltipHolder, tooltip);
          aElemSub.classList.add('link', 'unsubscribe');
          aElemSub.onclick = (e) => this.showUnsubscribeModal(e);
          this.renderer.appendChild(aElemSub, textElemSub);
          this.renderer.appendChild(section, aElemSub);
          this.renderer.appendChild(section, tooltipHolder);
        }
        break;
      case 'combos':
        const comboElemline = this.renderer.createElement('button');
        comboElemline.classList.add('bt', 'green');
        section.classList.add('combo');
        const comboBtnTextline = this.renderer.createText('Use My Numbers Again');
        this.renderer.appendChild(comboElemline, comboBtnTextline);
        comboElemline.onclick = (e) => this.clickUseNumbersAgain(e);
        this.renderer.appendChild(section, comboElemline);
        break;
      case 'bundles':
        const bundleElemline = this.renderer.createElement('button');
        comboElemline.classList.add('bt', 'green');
        section.classList.add('bundle');
        const bundleBtnTextline = this.renderer.createText('Use My Numbers Again');
        this.renderer.appendChild(bundleElemline, bundleBtnTextline);
        bundleElemline.onclick = (e) => this.clickUseNumbersAgain(e);
        this.renderer.appendChild(section, bundleElemline);
        break;
      case 'lines':
        const btnElemline = this.renderer.createElement('button');
        btnElemline.classList.add('bt', 'green');
        section.classList.add('just-lines');
        const btnTextline = this.renderer.createText('Use My Numbers Again');
        this.renderer.appendChild(btnElemline, btnTextline);
        btnElemline.onclick = (e) => this.clickUseNumbersAgain(e);
        this.renderer.appendChild(section, btnElemline);
        break;
      case 'syndicates':
        section.classList.add('syndicates');
        break;
    }
    return section;
  }

  // create bundles ?bundles=(4-1-2-[1-3-5-7-9-1-2])
  clickUseNumbersAgain(event) {
    this.lotteriesService.getSegmentationIdsMap()
      .first()
      .subscribe(ids => {
        let x;
        const y = this.rowData.gameLines.length;
        const z = 1;
        let linePacks = '';
        Object.keys(ids).map(key => {
         if (ids[key] === this.rowData.lotteryId) {
           x = key;
         }
        });
        this.rowData.gameLines.forEach(line => {
          const numbers = JSON.parse(line.numbers);
          const concatNumbers = numbers.main.concat(numbers.extra);
          linePacks += '[' + concatNumbers.join('-') + ']';
        });
        const params = '(' + x + '-' + y + '-' + z + '-' + linePacks + ')';
        this.router.navigate(['/cart'], {queryParams: { bundles: params}});
      });
  }

  createResultTemplate() {
    const wrapper =  this.renderer.createElement('div');
    const numbersElem =  this.renderer.createElement('div');
    const textSpan = this.renderer.createElement('span');
    const textElem = this.renderer.createText('Result: ');
    const mainNumbers = this.drawResult.winning_main_numbers;
    const extraNumbers = this.drawResult.winning_extra_numbers;

    wrapper.classList.add('result-wrapper');
    numbersElem.classList.add('results-line');
    textSpan.classList.add('result-label');
    this.renderer.appendChild(textSpan, textElem);

    mainNumbers.map(num => {
      const span = this.renderer.createElement('span');
      span.innerHTML = num;
      this.renderer.appendChild(numbersElem, span);
    });

    if (extraNumbers) {
      extraNumbers.map(num => {
        const span = this.renderer.createElement('span');
        span.innerHTML = num;
        span.classList.add('extra');
        this.renderer.appendChild(numbersElem, span);
      });
    }

    this.renderer.appendChild(wrapper, textSpan);
    this.renderer.appendChild(wrapper, numbersElem);
    return wrapper;
  }

  closeViewGame() {
    if (this.isShow) {
      this.view.parentNode.removeChild(this.view);
      this.isShow = !this.isShow;
      this.statusButton.nativeElement.classList.remove('open');
    }
  }

  showUnsubscribeModal(event) {
    if (this.isLimitedActivity() || this.isAccountUnverified()) {
      return;
    }
    this.lightboxesService.show({
      type: 'general',
      message: 'Are you sure you want to unsubscribe? We don\'t want you to miss out on any opportunities.',
      buttons: [
        {
          text: 'Unsubscribe',
          type: 'save',
          handler: () => this.unsubscribe(event)
        },
        {
          text: 'Cancel',
          type: 'cancel',
        }
      ]
    });
  }

  isLimitedActivity(): boolean {
    if (this.sessionStatus === 'limited') {
      this.lightboxesService.show({
        type: 'general',
        title: 'Lightboxes.sessionStatusTittle',
        message: 'Lightboxes.sessionStatusMessage',
      });
      return true;
    }

    if (this.customerStatusId === 'limited') {
      this.globalService.showLightbox$.emit({name: 'limited-status', value: ''});
      return true;
    }
    return false;
  }

  isAccountUnverified(): boolean {
    if (this.customerStatusId === 'unverified') {
      this.globalService.showLightbox$.emit({name: 'account-unverified', value: 'not verified'});
      return true;
    }
    return false;
  }

  unsubscribe(event) {
    event.target.parentNode.getElementsByClassName('tooltip-holder')[0].style.display = 'none';
    event.target.style.display = 'none';
    this.walletService.cancelCustomerSubscriptionById(this.rowData.subscriptionId)
      .subscribe(
        res => {
          const parentNode = event.target.parentNode;
          parentNode.removeChild(event.target);
        },
        error => {
          event.target.style.display = 'block';
        });
  }
}
