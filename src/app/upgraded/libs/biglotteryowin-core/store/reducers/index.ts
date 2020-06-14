import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { lotteriesReducer, LotteriesState } from './lotteries.reducer';
import { drawsReducer, DrawsState } from './draws.reducer';
import { pricesReducer, PricesState } from './prices.reducer';
import { offersReducer, OffersState } from './offers.reducer';
import { brandsReducer, BrandsState } from './brands.reducer';
import { syndicatesReducer, SyndicatesState } from './syndicates.reducer';

export interface BiglotteryowinCoreState {
  lotteries: LotteriesState;
  draws: DrawsState;
  prices: PricesState;
  offers: OffersState;
  brands: BrandsState;
  syndicates: SyndicatesState;
}

export const biglotteryowinCoreReducers: ActionReducerMap<BiglotteryowinCoreState> = {
  lotteries: lotteriesReducer,
  draws: drawsReducer,
  prices: pricesReducer,
  offers: offersReducer,
  brands: brandsReducer,
  syndicates: syndicatesReducer,
};

export const getBiglotteryowinCoreState = createFeatureSelector<BiglotteryowinCoreState>('BiglotteryowinCore');
