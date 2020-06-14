import { Action } from '@ngrx/store';

export enum SyndicatePageActionTypes {
  SyndicatePageLoadedAction = '[SyndicatePage] Page is loaded',
  SyndicatePageSetSharesAction = '[SyndicatePage] Set shares',
  SyndicatePageAddSharesAction = '[SyndicatePage] Add shares',
  SyndicatePageRemoveSharesAction = '[SyndicatePage] Remove shares',
  SyndicatePageAddToCartAction = '[SyndicatePage] Add shares to cart',
  SyndicatePageShowLinesAction = '[SyndicatePage] Show lines',
}

export class SyndicatePageLoadedAction implements Action {
  readonly type = SyndicatePageActionTypes.SyndicatePageLoadedAction;

  constructor(public payload: {sharesAmount: number}) {
  }
}

export class SyndicatePageSetSharesAction implements Action {
  readonly type = SyndicatePageActionTypes.SyndicatePageSetSharesAction;

  constructor(public payload: {lotteryId: string; sharesAmount: number}) {
  }
}

export class SyndicatePageAddSharesAction implements Action {
  readonly type = SyndicatePageActionTypes.SyndicatePageAddSharesAction;

  constructor(public payload: {lotteryId: string; sharesAmount: number; sharesBeforeClick: number}) {
  }
}

export class SyndicatePageRemoveSharesAction implements Action {
  readonly type = SyndicatePageActionTypes.SyndicatePageRemoveSharesAction;

  constructor(public payload: {lotteryId: string; sharesAmount: number, sharesBeforeClick: number}) {
  }
}

export class SyndicatePageAddToCartAction implements Action {
  readonly type = SyndicatePageActionTypes.SyndicatePageAddToCartAction;

  constructor(public payload: {templateId: number, lotteryId: string; sharesAmount: number}) {
  }
}

export class SyndicatePageShowLinesAction implements Action {
  readonly type = SyndicatePageActionTypes.SyndicatePageShowLinesAction;

  constructor(public payload: {
    lotteryName: string,
    lines: Array<{
      mainNumbers: number[],
      extraNumbers: number[],
      perticketNumbers: number[],
    }>
  }) {
  }
}

export type SyndicatePageActions =
  | SyndicatePageLoadedAction
  | SyndicatePageSetSharesAction
  | SyndicatePageAddSharesAction
  | SyndicatePageRemoveSharesAction
  | SyndicatePageAddToCartAction;
