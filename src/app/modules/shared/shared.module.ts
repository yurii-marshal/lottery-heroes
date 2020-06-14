import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { RangeToPipe } from './pipes/range-to.pipe';
import { NumberFormatPipe } from './pipes/number-format.pipe';
import { NumberPadPipe } from './pipes/number-pad.pipe';
import { JackpotFormatPipe } from './pipes/jackpot-format.pipe';

import {
ApproximatelyCurrencyInfoContainerComponent
} from './components/approximately-currency-info/approximately-currency-info.container.component';
import { ApproximatelyCurrencyInfoComponent } from './components/approximately-currency-info/approximately-currency-info.component';
import { NeedHelpComponent } from './components/help/need-help.component';
import { BrandModule } from '../brand/brand.module';
import { ConfirmationRemoveLineComponent } from './components/confirmation-remove-line/confirmation-remove-line.component';
import {
ConfirmationRemoveLineContainerComponent
} from './components/confirmation-remove-line/confirmation-remove-line.container.component';
import { AnalyticsDeprecatedModule } from '../analytics-deprecated/analytics-deprecated.module';
import { ConfirmationRemoveItemComponent } from './components/confirmation-remove-item/confirmation-remove-item.component';
import { LiveChatModule } from '../live-chat/live-chat.module';
import { SelectModule } from 'ng-select';
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import { JackpotRoundPipe } from './pipes/jackpot-round.pipe';
import { EscapeSanitizePipe } from './pipes/escape-sanitize.pipe';
import {TranslateSafeHtmlPipe} from './pipes/translateSafeHtml.pipe';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    BrandModule,
    AnalyticsDeprecatedModule,
    LiveChatModule,
    SelectModule,
    RouterModule
  ],
  declarations: [
    // PIPES
    RangeToPipe,
    NumberFormatPipe,
    NumberPadPipe,
    JackpotFormatPipe,
    JackpotRoundPipe,
    EscapeSanitizePipe,
    TranslateSafeHtmlPipe,

    // COMPONENTS
    ApproximatelyCurrencyInfoContainerComponent,
    ApproximatelyCurrencyInfoComponent,
    NeedHelpComponent,
    ConfirmationRemoveLineComponent,
    ConfirmationRemoveLineContainerComponent,
    ConfirmationRemoveItemComponent,

    // DIRECTIVES
    NumbersOnlyDirective,
  ],
  exports: [
    // MODULES
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    BrandModule,
    AnalyticsDeprecatedModule,
    SelectModule,
    LiveChatModule,

    // PIPES
    RangeToPipe,
    NumberFormatPipe,
    NumberPadPipe,
    JackpotFormatPipe,
    JackpotRoundPipe,
    EscapeSanitizePipe,
    TranslateSafeHtmlPipe,

    // COMPONENTS
    ApproximatelyCurrencyInfoContainerComponent,
    NeedHelpComponent,
    ConfirmationRemoveLineComponent,
    ConfirmationRemoveLineContainerComponent,
    ConfirmationRemoveItemComponent,

    // DIRECTIVES
    NumbersOnlyDirective,
  ],
  providers: [
    EscapeSanitizePipe,
    TranslateSafeHtmlPipe,
  ]
})
export class SharedModule {
}
