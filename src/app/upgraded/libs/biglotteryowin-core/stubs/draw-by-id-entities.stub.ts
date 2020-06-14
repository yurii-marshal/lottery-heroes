import { DrawEntityInterface } from '../store/entities/draw-entity.interface';

export const drawByIdEntitiesStub: {[drawId: string]: DrawEntityInterface} = {
  '22999': {
    drawId: 22999,
    lotteryId: 'megamillions',
    jackpot: 1699662,
    minJackpot: 1700388,
    dateLocal: '2018-02-01',
    lastTicketTime: '2018-02-01T08:30:00.000Z',
  },
  '23887': {
    drawId: 23887,
    lotteryId: 'powerball',
    jackpot: 89716610,
    minJackpot: 28178800,
    dateLocal: '2018-01-31',
    lastTicketTime: '2018-02-01T03:00:00.000Z',
  },
};
