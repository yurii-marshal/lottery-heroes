import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { LuckyNumbersItemInterface } from '../../../../../services/api/entities/incoming/lotteries/lucky-numbers.interface';
import { Observable } from 'rxjs/Observable';
import { MyLuckyNumbersSandbox } from '../../my-lucky-numbers.sandbox';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-my-lucky-numbers',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './my-lucky-numbers.component.html',
  styleUrls: ['./my-lucky-numbers.component.scss']
})
export class MyLuckyNumbersComponent implements OnDestroy {
  @Input() device: string;
  @Input() editLuckyNumbers$: Observable<LuckyNumbersItemInterface>;
  @Input() editNewLuckyNumbers$: Observable<LuckyNumbersItemInterface>;
  isEditDetails = false;
  saveModalClickedEventSubscription: Subscription;

  constructor(private myLuckyNumbersSandbox: MyLuckyNumbersSandbox) {
    this.saveModalClickedEventSubscription = myLuckyNumbersSandbox.getSaveModalClickedEvent().subscribe(() => this.onSaveModalClicked());
  }

  onEdit() {
    this.isEditDetails = true;
    this.myLuckyNumbersSandbox.onTrackLuckyNumbersEditClicked();
  }

  onSave() {
    this.myLuckyNumbersSandbox.showSaveLightbox();
    this.myLuckyNumbersSandbox.getSaveClickedEvent().emit();
  }

  onCancel() {
    this.isEditDetails = false;
    this.myLuckyNumbersSandbox.getCancelClickedEvent().emit();
  }

  onSaveModalClicked() {
    this.isEditDetails = false;
  }

  onBackToMenu() {
    this.myLuckyNumbersSandbox.onBackToMenu();
  }

  ngOnDestroy() {
    this.saveModalClickedEventSubscription.unsubscribe();
  }

}
