import { SyndicateDto } from '@libs/biglotteryowin-api/dto/offerings/get-syndicates.dto';

import { SyndicateEntityInterface } from '../entities/syndicate-entity.interface';
import { SyndicatesActions, SyndicatesActionTypes } from '../actions/syndicates.actions';

export interface SyndicatesState {
  entities: {[lotteryId: string]: SyndicateEntityInterface};
  loading: boolean;
  loaded: boolean;
}

export const initialSyndicatesState: SyndicatesState = {
  entities: {},
  loading: false,
  loaded: false,
};

export function syndicatesReducer(state = initialSyndicatesState, action: SyndicatesActions): SyndicatesState {
  switch (action.type) {
    case SyndicatesActionTypes.SyndicatesLoadAction: {
      return {
        ...state,
        loading: true,
      };
    }

    case SyndicatesActionTypes.SyndicatesLoadSuccessAction: {
      const entities = action.payload.reduce((result: {[lotteryId: string]: SyndicateEntityInterface}, item: SyndicateDto) => {
        return {
          ...result,
          [item.lottery_id]: {
            templateId: item.template_id,
            lotteryId: item.lottery_id,
            numLines: item.num_lines,
            numShares: item.num_shares,
            numSharesAvailable: item.num_shares_available,
            stopSellTime: item.stop_sell_time,
            cutoffTime: item.cutoff_time,
            drawId: item.draw_id,
            prices: item.prices.reduce((res: {[currencyId: string]: {currencyId: string; sharePrice: number}}, price) => {
              return {
                ...res,
                [price.currency_id]: {
                  currencyId: price.currency_id,
                  sharePrice: price.share_price,
                }
              };
            }, {}),
            lines: item.lines.map(line => ({
              mainNumbers: line.main_numbers,
              extraNumbers: line.extra_numbers,
              perticketNumbers: line.perticket_numbers,
            })),
          }
        };
      }, {});

      return {
        ...state,
        entities,
        loading: false,
        loaded: true,
      };
    }

    case SyndicatesActionTypes.SyndicatesLoadFailAction: {
      return {
        ...state,
        loading: false,
      };
    }
  }

  return state;
}
