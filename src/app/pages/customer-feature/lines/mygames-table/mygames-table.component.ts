import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { StatusGameComponent } from './status-game.component';
import { MygamesService } from '../mygames.service';
import { DeviceService } from '../../../../services/device/device.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-mygames-table',
  templateUrl: './mygames-table.component.html',
  styleUrls: ['./mygames-table.component.scss']
})
export class MygamesTableComponent implements OnInit, OnDestroy {
  @Input() lines;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  device = '';
  sortField = '';
  sortDirection = 'desc';
  data: LocalDataSource;
  settings = {
    hideSubHeader: true,
    actions: null,
    attr: {
      class: 'games-table'
    },
    columns: {
      game: {
        title: 'Game',
        class: 'th',
        type: 'html',
        valuePrepareFunction: (cell, row) => '<div class="cell-game-' + row.type + '">' + cell + '</div>',
        compareFunction: (direction: any, a: any, b: any) => this.onSort(direction, a, b)
      },
      type: {
        title: 'Type',
        class: 'th',
        valuePrepareFunction: (cell, row) => this.setTypeName(cell),
        compareFunction: (direction: any, a: any, b: any) => this.onSort(direction, a, b)
      },
      purchased: {
        title: 'Draw',
        class: 'th',
        type: 'html',
        sort: true,
        sortDirection: 'desc',
        valuePrepareFunction: (cell, row) => '<div class="cell-date-' + row.type + '">' + row.purchasedValue + '</div>',
        compareFunction: (direction: any, a: any, b: any) => this.onSort(direction, a, b)
      },
      winnings: {
        title: 'Winnings',
        class: 'th',
        type: 'html',
        sort: true,
        valuePrepareFunction: (cell, row) => row.winningsValue,
        compareFunction: (direction: any, a: any, b: any) => this.onSort(direction, a, b)
      },
      status: {
        title: 'Status',
        class: 'th',
        type: 'custom',
        renderComponent: StatusGameComponent,
        compareFunction: (direction: any, a: any, b: any) => this.onSort(direction, a, b)
      }
    }
  };

  sortingTypes = [
      {name: 'Game', id: 'game'},
      {name: 'Type', id: 'type'},
      {name: 'Draw', id: 'purchased'},
      {name: 'Winnings', id: 'winnings'},
      {name: 'Status', id: 'status'},
    ];

  constructor(private mygamesService: MygamesService,
              private deviceService: DeviceService) {
    this.data = new LocalDataSource();
    deviceService.getDevice()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(device => this.onChangeDevice(device));
  }

  setTypeName(type) {
    let name = '';
    switch (type) {
      case 'lines':
        name = 'One Time';
        break;
      case 'subscriptions':
        name = 'Subscription';
        break;
      case 'combos':
      case 'bundles':
      case 'comboShares':
        name = 'Combo';
        break;
      case 'bundleShares':
        name = 'Bundle';
        break;
      case 'lineShares':
        name = 'Syndicates';
        break;
    }

    return name;
  }

  onSort(direction: any, a: any, b: any) {
    this.mygamesService.getSortTableEvent().emit();
    if (a < b) {
      return -1 * direction;
    }
    if (a > b) {
      return direction;
    }
    return 0;
  }

  onChangeSelect(select) {
    this.mygamesService.getSortTableEvent().emit();
    this.sortField = select.value;
    this.data.setSort([{ field: select.value, direction: this.sortDirection }]);
  }

  onChangeDevice(device: string) {
    this.device = device;
    this.sortField = 'purchased';
    this.sortDirection = 'desc';
    if (device === 'mobile') {
      this.mygamesService.getSortTableEvent().emit();
      this.data.setSort([{ field: this.sortField, direction: this.sortDirection }]);
    }
  }

  onChangeDirection() {
    this.mygamesService.getSortTableEvent().emit();
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.data.setSort([{ field: this.sortField, direction: this.sortDirection }]);
  }

  ngOnInit() {
    this.data.load(this.lines);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
