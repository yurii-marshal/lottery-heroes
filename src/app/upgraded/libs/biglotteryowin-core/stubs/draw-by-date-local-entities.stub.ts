import { DrawEntityInterface } from '../store/entities/draw-entity.interface';

export const drawByDateLocalEntitiesStub: {[lotteryId_dateLocal: string]: DrawEntityInterface} = {
  'powerball_2018-03-28': {
    drawId: 2464,
    lotteryId: 'powerball',
    jackpot: 40000000,
    minJackpot: 40000000,
    dateLocal: '2018-03-28',
    lastTicketTime: '2018-03-29T03:00:00.000Z',
  },
};
