export enum PersonalResultsActionTypes {
  BoxPresented = '[Personal Results] Box Presented',
  BoxClicked = '[Personal Results] Box Clicked',
  PageLoaded = '[Personal Results] PageLoaded'
}

export class BoxPresented {
  readonly type = PersonalResultsActionTypes.BoxPresented;

  constructor(public payload: { boxName: string, boxNumber: number, pageUrl: string }) {}
}

export class BoxClicked {
  readonly type = PersonalResultsActionTypes.BoxClicked;

  constructor(public payload: { boxName: string, boxNumber: number, pageUrl: string }) {}
}

export class PageLoaded {
  readonly type = PersonalResultsActionTypes.PageLoaded;

  constructor(public payload: { lotteryName: string }) {}
}

export type PersonalResultsActions =
  | BoxPresented
  | BoxClicked
  | PageLoaded;
