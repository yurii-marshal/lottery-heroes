import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RouterReducerState, RouterStateSerializer } from '@ngrx/router-store';
import { ActivatedRouteSnapshot, Data, Params, RouterStateSnapshot } from '@angular/router';

export interface RouterStateUrl {
  url: string;
  urlWithoutQueryParams: string;
  queryParams: Params;
  params: Params;
  data: Data;
}

export class CustomRouterStateSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    const {url} = routerState;
    const {queryParams} = routerState.root;

    const queryParamsIndex = url.indexOf('?');
    const urlWithoutQueryParams = (queryParamsIndex === -1) ? url : url.slice(0, queryParamsIndex);

    let state: ActivatedRouteSnapshot = routerState.root;
    while (state.firstChild) {
      state = state.firstChild;
    }
    const {params} = state;
    const {data} = state;

    return {url, urlWithoutQueryParams, queryParams, params, data};
  }
}

export const getRouterStoreState = createFeatureSelector<RouterReducerState<RouterStateUrl>>('RouterStore');
export const getRouterStateUrl = createSelector(getRouterStoreState, (state: RouterReducerState<RouterStateUrl>) => {
  if (typeof state === 'undefined') {
    console.error(`Router state is undefined, don't subscribe to this.store.select(getRouterStateUrl) in constructor.`);
  }

  return state && state.state;
});
