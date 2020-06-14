export interface LuvLineStatusInterface {
  id: string; // "won"
  name: string; // "Won"
}

export interface LuvLineStatusesInterface {
  line_statuses: Array<LuvLineStatusInterface>;
}
