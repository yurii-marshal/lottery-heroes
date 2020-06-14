import { EventEmitter, Injectable } from '@angular/core';
import { LuckyNumbersApiService } from '../api/lucky-numbers.api.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { LuckyNumbersGroupsInterface,
         LuckyNumbersItemInterface
} from '../api/entities/incoming/lotteries/lucky-numbers.interface';
import { Observable } from 'rxjs/Observable';
import { AnalyticsDeprecatedService } from '../../modules/analytics-deprecated/services/analytics-deprecated.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { of } from 'rxjs/observable/of';
import { ArraysUtil } from '../../modules/shared/utils/arrays.util';

@Injectable()
export class LuckyNumbersService {
  private luckyNumbersSubject$: BehaviorSubject<LuckyNumbersItemInterface[]>;
  private editLuckyNumbersSubject$: BehaviorSubject<LuckyNumbersItemInterface[]>;
  private editNewLuckyNumbersSubject$: BehaviorSubject<LuckyNumbersItemInterface[]>;

  public onCancelEvent$ = new EventEmitter();
  public onSaveEvent$ = new EventEmitter();
  public showRemoveModalEvent$ = new EventEmitter();
  public showSaveModalEvent$ = new EventEmitter();
  public storeGroupsEvent$ = new EventEmitter();
  public onSaveModalEvent$ = new EventEmitter();

  private storedOldGroups: Array<LuckyNumbersItemInterface> = [];
  private storedNewGroups: Array<LuckyNumbersItemInterface> = [];
  private storedForDeletingOldGroupsId: Array<string> = [];
  private countStoredOldGroups = 0;
  private isValidatedStoredGroup = true;
  private countClicksOnAddLine = 0;

  constructor(private luckyNumbersApiService: LuckyNumbersApiService,
              private analyticsDeprecatedService: AnalyticsDeprecatedService) {
    this.luckyNumbersSubject$ = new BehaviorSubject([]);
    this.editLuckyNumbersSubject$ = new BehaviorSubject([]);
    this.editNewLuckyNumbersSubject$ = new BehaviorSubject([]);
    this.onCancelEvent$.subscribe(() => this.onCancelClicked());
    this.onSaveEvent$.subscribe(() => this.onSaveClicked());
    this.onSaveModalEvent$.subscribe(() => this.onSaveModalClicked());
  }

  loadLuckyNumbers(): void {
    this.luckyNumbersApiService.getGroups()
      .map((res: LuckyNumbersGroupsInterface) => res.luckyNumbers)
      .subscribe((luckyNumbers: Array<LuckyNumbersItemInterface>) => {
        this.luckyNumbersSubject$.next(luckyNumbers);
        this.editLuckyNumbersSubject$.next(luckyNumbers.slice());
      });
  }

  createGroups(groups: Array<LuckyNumbersItemInterface>) {
    const sendGroups = groups.filter(group => group.numbers.length > 0);
    let sendObservable;
    if (sendGroups.length > 0) {
      sendObservable = this.luckyNumbersApiService.createGroup({groups: groups});
    } else {
      sendObservable = of({groups: []});
    }
    return sendObservable;
  }

  updateGroups(groups: Array<LuckyNumbersItemInterface>) {
    return this.luckyNumbersApiService.updateGroups({groups: groups});
  }

  deleteGroup(groupId: string) {
    this.luckyNumbersApiService.deleteGroup(groupId).subscribe(() => {
      const luckyNumbers = this.luckyNumbersSubject$.getValue();
      const updatedLuckyNumbers = luckyNumbers.filter(group => group.id !== groupId);
      this.luckyNumbersSubject$.next(updatedLuckyNumbers);
      this.editLuckyNumbersSubject$.next(updatedLuckyNumbers.slice());
    });
  }

  // TODO: delete all groups with one query
  deleteGroups(groupsId: Array<string>) {
    // this.luckyNumbersApiService.deleteGroups(groupsId).subscribe((data) => {
    // });
  }

  getLuckyNumbers(): Observable<LuckyNumbersItemInterface[]> {
    this.loadLuckyNumbers();
    return this.luckyNumbersSubject$.asObservable();
  }

  getEditLuckyNumbers() {
    this.getLuckyNumbers();
    return this.editLuckyNumbersSubject$.asObservable();
  }

  getEditNewLuckyNumbers() {
    return this.editNewLuckyNumbersSubject$.asObservable();
  }

  onCancelClicked() {
    const luckyNumbers = this.luckyNumbersSubject$.getValue();
    this.editLuckyNumbersSubject$.next(luckyNumbers);
    this.clearStoredGroups();
    this.countClicksOnAddLine = 0;
  }

  addNewEmptyGroup() {
    const newGroups = this.editNewLuckyNumbersSubject$.getValue();
    newGroups.push({numbers: []});
    this.editNewLuckyNumbersSubject$.next(newGroups);
    this.onTrackLuckyNumbersAddLine(newGroups.length);
  }

  removeNewGroup(index: number) {
    const newGroups = this.editNewLuckyNumbersSubject$.getValue();
    newGroups.splice(+index, 1);
    this.editNewLuckyNumbersSubject$.next(newGroups);
  }

  removeOldGroup(index: number) {
    const oldGroups = this.editLuckyNumbersSubject$.getValue();
    const removeGroupId = oldGroups[index].id;
    this.storeForDeletingOldGroup(removeGroupId);
    oldGroups.splice(+index, 1);
    this.editLuckyNumbersSubject$.next(oldGroups);
  }

  storeForDeletingOldGroup(groupId: string) {
    this.storedForDeletingOldGroupsId.push(groupId);
  }

  onSaveClicked() {
    const oldGroups = this.editLuckyNumbersSubject$.getValue();
    if (oldGroups.length === 0) {
      this.showSaveModal();
    }
    this.storeGroupsEvent$.emit();
  }

  storeOldGroups({group, index}: {group: LuckyNumbersItemInterface, index: number}) {
    const editLuckyNumbers = this.editLuckyNumbersSubject$.getValue();
    const countGroups = editLuckyNumbers.length;
    this.countStoredOldGroups += 1;

    this.validationStoredGroup(group);
    if (countGroups === this.countStoredOldGroups) {
      this.countStoredOldGroups = 0;
      if (this.isValidatedStoredGroup === true) {
        this.showSaveModal();
      }
    }
    if (group.numbers.length > 0) {
      this.storedOldGroups[index] = group;
    }
  }

  validationStoredGroup(group: LuckyNumbersItemInterface) {
    if (this.countStoredOldGroups === 1) {
      this.storedOldGroups = [];
      this.isValidatedStoredGroup = true;
    }
    if (this.isValidatedStoredGroup === true) {
      if (group.numbers.length === 0 && !this.storedForDeletingOldGroupsId.includes(group.id)) {
        this.isValidatedStoredGroup = false;
      }
    }
  }

  showSaveModal() {
    this.showSaveModalEvent$.emit();
  }

  storeNewGroup({group, index}: {group: LuckyNumbersItemInterface, index: number}) {
    this.storedNewGroups[index] = group;
  }

  onSaveModalClicked() {
    this.countClicksOnAddLine = 0;
    this.deleteStoredOldGroups();
    const create = this.storedNewGroups.filter((group: LuckyNumbersItemInterface) => group.numbers.length > 0);
    const update = this.storedOldGroups
      .filter((group: LuckyNumbersItemInterface) => (this.storedForDeletingOldGroupsId.includes(group.id) === false));
    forkJoin(
      this.createGroups(create),
      this.updateGroups(update)
    ).subscribe(
      data => {
        if (!(data[0]['isBoom'] || data[1]['isBoom'])) {
          this.onSuccessSave(data);
        }
      },
      error => console.error('error on save lucky numbers: ', error));
  }

  deleteStoredOldGroups() {
    this.storedForDeletingOldGroupsId.map(groupId => this.deleteGroup(groupId));
    // this.deleteGroups(this.storedForDeletingOldGroupsId);
    this.storedForDeletingOldGroupsId = [];
  }

  onSuccessSave(data) {
    this.onTrackSaveChanges(data[1]['groups'], data[0]['groups']);
    const updatedLuckyNumbers = data[0]['groups'].concat(data[1]['groups']).sort((a, b) => {
      if (a.id > b.id) {
        return 1;
      }
      if (a.id < b.id) {
        return -1;
      }
      return 0;
    });
    this.luckyNumbersSubject$.next(updatedLuckyNumbers);
    this.editLuckyNumbersSubject$.next(updatedLuckyNumbers.slice());
    this.clearStoredGroups();
  }

  clearStoredGroups() {
    this.storedOldGroups = [];
    this.storedNewGroups = [];
    this.storedForDeletingOldGroupsId = [];
    this.editNewLuckyNumbersSubject$.next([]);
  }

  onTrackLuckyNumbersAddLine(countClicks: number) {
    this.countClicksOnAddLine ++;
    this.analyticsDeprecatedService.trackLuckyNumbersAddLine(this.countClicksOnAddLine);
  }

  onTrackSaveChanges(updateLines, newLines) {
    let countChanges = newLines.length;
    const oldLines = this.luckyNumbersSubject$.getValue();
    countChanges += Math.abs(oldLines.length - updateLines.length);

    for (let i = 0; i < oldLines.length; i++) {
      for (let y = 0; y < updateLines.length; y++) {
        if (oldLines[i].id === updateLines[y].id) {
          const difference1 = ArraysUtil.difference(oldLines[i].numbers, updateLines[y].numbers);
          const difference2 = ArraysUtil.difference(updateLines[y].numbers, oldLines[i].numbers);
          if (difference1.length > 0 || difference2.length > 0) {
            countChanges += 1;
          }
          break;
        }
      }
    }
    this.analyticsDeprecatedService.trackLuckyNumbersSaveLine(countChanges);
  }
}
