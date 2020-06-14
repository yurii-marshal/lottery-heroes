import { Injectable } from '@angular/core';
import { LinesApiService } from './api/lines.api.service';

@Injectable()
export class TicketsService {

  constructor(private linesApiService: LinesApiService) { }

  getOrderedLines() {
    return this.linesApiService.getOrderedLines();
  }

  getOrderedLine(lineId) {
    return this.linesApiService.getOrderedLine(lineId);
  }

  getSettledLines() {
    return this.linesApiService.getSettledLines();
  }

  getSettledLine(lineId) {
    return this.linesApiService.getSettledLine(lineId);
  }

  getSettledLinesByDraw(drawId) {
    return this.linesApiService.getSettledLinesByDraw(drawId);
  }

  getSyndicateShares() {
    return this.linesApiService.getSyndicateShares();
  }

}
