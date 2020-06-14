import { ArraysUtil } from '../../modules/shared/utils/arrays.util';
import { ObjectsUtil } from '../../modules/shared/utils/objects.util';

import { TicketsActions, TicketsActionTypes } from '../actions/tickets.actions';
import { LineInterface } from '../../modules/api/entities/outgoing/common/line.interface';

export interface State {
  selectedLotteryId: string | null;
  tickets: {[lotteryId: string]: Array<LineInterface>};
  editedTickets: {[lotteryId: string]: LineInterface};
  luckyNumbersLineStatuses: {[lotteryId: string]: {[lineId: string]: boolean}};
}

export const initialState: State = {
  selectedLotteryId: null,
  tickets: {},
  editedTickets: {},
  luckyNumbersLineStatuses: {},
};

export function reducer(
  state: State = initialState,
  action: TicketsActions
): State {
  switch (action.type) {
    /***************************************************************************************************************************************
     * selectedLotteryId
     **************************************************************************************************************************************/
    case TicketsActionTypes.SelectLotteryId: {
      return Object.assign({}, state, {
        selectedLotteryId: action.payload,
      });
    }

    /***************************************************************************************************************************************
     * tickets
     **************************************************************************************************************************************/
    case TicketsActionTypes.SetLotteryTickets: {
      return {
        ...state,
        tickets: {
          ...state.tickets,
          [action.payload.lotteryId]: action.payload.tickets
        },
      };
    }

    case TicketsActionTypes.AddLotteryTickets: {
      const tickets = Object.assign({}, state.tickets);
      const lotteryTickets = tickets[action.payload.lotteryId];

      if (typeof lotteryTickets === 'undefined') {
        tickets[action.payload.lotteryId] = action.payload.tickets;
      } else {
        tickets[action.payload.lotteryId] = [...tickets[action.payload.lotteryId], ...action.payload.tickets];
      }

      return Object.assign({}, state, {
        tickets: tickets,
      });
    }

    case TicketsActionTypes.UpdateLotteryTickets: {
      const tickets = ObjectsUtil.deepClone(state.tickets);
      const lotteryTickets = tickets[action.payload.lotteryId];

      if (typeof lotteryTickets === 'undefined') {
        return state;
      }

      action.payload.tickets.forEach(ticket => {
        ArraysUtil.findObjByKeyValue(lotteryTickets, 'id', ticket.id, ticket);
      });

      return Object.assign({}, state, {
        tickets: tickets,
      });
    }

    case TicketsActionTypes.DeleteLotteryTickets: {
      const tickets = ObjectsUtil.deepClone(state.tickets);
      const lotteryTickets = tickets[action.payload.lotteryId];

      if (typeof lotteryTickets === 'undefined') {
        return state;
      }

      const deletedTicketIds: Array<string> = action.payload.tickets.map(ticket => ticket.id);
      const newLotteryTickets = [];
      lotteryTickets.forEach(ticket => {
        if (!ArraysUtil.inArray(deletedTicketIds, ticket.id)) {
          newLotteryTickets.push(ticket);
        }
      });
      tickets[action.payload.lotteryId] = newLotteryTickets;

      return Object.assign({}, state, {
        tickets: tickets,
      });
    }

    /***************************************************************************************************************************************
     * editedTickets
     **************************************************************************************************************************************/
    case TicketsActionTypes.SetEditedTicket: {
      return {
        ...state,
        editedTickets: {
          ...state.editedTickets,
          [action.payload.lotteryId]: action.payload.ticket
        }
      };
    }

    case TicketsActionTypes.DeleteEditedTicket: {
      const {[action.payload.lotteryId]: removed, ...editedTickets} = state.editedTickets;

      return {
        ...state,
        editedTickets
      };
    }

    /***************************************************************************************************************************************
     * luckyNumbersLineStatuses
     **************************************************************************************************************************************/
    case TicketsActionTypes.SetLuckyNumbersLineStatus: {
      const luckyNumbersLineStatuses = ObjectsUtil.deepClone(state.luckyNumbersLineStatuses);
      const lotteryLuckyNumbersLineStatuses = luckyNumbersLineStatuses[action.payload.lotteryId];

      if (typeof lotteryLuckyNumbersLineStatuses === 'undefined') {
        luckyNumbersLineStatuses[action.payload.lotteryId] = {};
      }

      luckyNumbersLineStatuses[action.payload.lotteryId][action.payload.lineId] = action.payload.status;

      return Object.assign({}, state, {
        luckyNumbersLineStatuses,
      });
    }

    /***************************************************************************************************************************************
     * default
     **************************************************************************************************************************************/
    default: {
      return state;
    }
  }
}

export const getSelectedLotteryId = (state: State) => state.selectedLotteryId;
export const getTickets = (state: State) => state.tickets;
export const getEditedTickets = (state: State) => state.editedTickets;
export const getLuckyNumbersLineStatuses = (state: State) => state.luckyNumbersLineStatuses;
