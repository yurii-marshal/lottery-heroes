import { DrawDto } from '@libs/biglotteryowin-api/dto/lotteries/draw.dto';

import { DrawEntityInterface } from '../entities/draw-entity.interface';
import { DrawsActions, DrawsActionTypes } from '../actions/draws.actions';

export interface DrawsState {
  upcomingEntities: {[lotteryId: string]: DrawEntityInterface};
  upcomingLoading: boolean;
  upcomingLoaded: boolean;

  latestEntities: {[lotteryId: string]: DrawEntityInterface};
  latestLoading: boolean;
  latestLoaded: boolean;

  drawByIdEntities: {[drawId: string]: DrawEntityInterface};
  drawByIdLoading: boolean;

  drawByDateLocalEntities: {[lotteryId_dateLocal: string]: DrawEntityInterface};
  drawByDateLocalLoading: boolean;
}

export const initialDrawsState: DrawsState = {
  upcomingEntities: {},
  upcomingLoading: false,
  upcomingLoaded: false,

  latestEntities: {},
  latestLoading: false,
  latestLoaded: false,

  drawByIdEntities: {},
  drawByIdLoading: false,

  drawByDateLocalEntities: {},
  drawByDateLocalLoading: false,
};

export function drawsReducer(state = initialDrawsState, action: DrawsActions): DrawsState {
  switch (action.type) {
    /*********************************************************************************
     * UPCOMING
     *********************************************************************************/
    case DrawsActionTypes.UpcomingDrawsLoadAction: {
      return {
        ...state,
        upcomingLoading: true,
      };
    }

    case DrawsActionTypes.UpcomingDrawsLoadSuccessAction: {
      const upcomingEntities = action.payload.reduce((result: {[lottery_id: string]: DrawEntityInterface}, item: DrawDto) => {
        return {
          ...result,
          [item.lottery_id]: {
            drawId: item.id,
            lotteryId: item.lottery_id,
            jackpot: item.jackpot,
            minJackpot: item.min_jackpot,
            dateLocal: item.date_local,
            lastTicketTime: item.last_ticket_time,
          }
        };
      }, {});

      return {
        ...state,
        upcomingEntities,
        upcomingLoading: false,
        upcomingLoaded: true,
      };
    }

    case DrawsActionTypes.UpcomingDrawsLoadFailAction: {
      return {
        ...state,
        upcomingLoading: false,
      };
    }

    /*********************************************************************************
     * LATEST
     *********************************************************************************/
    case DrawsActionTypes.LatestDrawsLoadAction: {
      return {
        ...state,
        latestLoading: true,
      };
    }

    case DrawsActionTypes.LatestDrawsLoadSuccessAction: {
      const latestEntities = action.payload.reduce((result: {[lottery_id: string]: DrawEntityInterface}, item: DrawDto) => {
        return {
          ...result,
          [item.lottery_id]: {
            drawId: item.id,
            lotteryId: item.lottery_id,
            jackpot: item.jackpot,
            minJackpot: item.min_jackpot,
            dateLocal: item.date_local,
            lastTicketTime: item.last_ticket_time,
          }
        };
      }, {});

      return {
        ...state,
        latestEntities,
        latestLoading: false,
        latestLoaded: true,
      };
    }

    case DrawsActionTypes.LatestDrawsLoadFailAction: {
      return {
        ...state,
        latestLoading: false,
      };
    }

    /*********************************************************************************
     * DRAW BY ID
     *********************************************************************************/
    case DrawsActionTypes.DrawsByIdLoadAction: {
      return {
        ...state,
        drawByIdLoading: true,
      };
    }

    case DrawsActionTypes.DrawsByIdLoadSuccessAction: {
      const drawByIdEntities = action.payload.reduce((result: {[drawId: number]: DrawEntityInterface}, item: DrawDto) => {
        return {
          ...result,
          [item.id.toString()]: {
            drawId: item.id,
            lotteryId: item.lottery_id,
            jackpot: item.jackpot,
            minJackpot: item.min_jackpot,
            dateLocal: item.date_local,
            lastTicketTime: item.last_ticket_time,
          }
        };
      }, state.drawByIdEntities);

      return {
        ...state,
        drawByIdEntities,
        drawByIdLoading: false,
      };
    }

    case DrawsActionTypes.DrawsByIdLoadFailAction: {
      return {
        ...state,
        drawByIdLoading: false,
      };
    }

    /*********************************************************************************
     * DRAW BY DATE LOCAL
     *********************************************************************************/
    case DrawsActionTypes.DrawByDateLocalLoadAction: {
      return {
        ...state,
        drawByDateLocalLoading: true,
      };
    }

    case DrawsActionTypes.DrawByDateLocalLoadSuccessAction: {
      const drawByDateLocalEntities = {
        ...state.drawByDateLocalEntities,
        [action.payload.lottery_id + '_' + action.payload.date_local]: {
          drawId: action.payload.id,
          lotteryId: action.payload.lottery_id,
          jackpot: action.payload.jackpot,
          minJackpot: action.payload.min_jackpot,
          dateLocal: action.payload.date_local,
          lastTicketTime: action.payload.last_ticket_time,
        }
      };

      return {
        ...state,
        drawByDateLocalEntities,
        drawByDateLocalLoading: false,
      };
    }

    case DrawsActionTypes.DrawByDateLocalLoadFailAction: {
      return {
        ...state,
        drawByDateLocalLoading: false,
      };
    }
  }

  return state;
}
