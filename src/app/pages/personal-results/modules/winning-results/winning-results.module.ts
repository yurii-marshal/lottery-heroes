import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WinningResultsContainerComponent} from './winning-results.container.component';
import {WinningResultsComponent} from './components/winning-results.component';
import {SharedModule} from '../../../../modules/shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule
    ],
    declarations: [
        WinningResultsContainerComponent,
        WinningResultsComponent
    ],
    exports: [
        WinningResultsContainerComponent
    ]
})
export class WinningResultsModule {
}
