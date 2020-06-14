export interface BallCombinationsMapInterface {
  total?: number;
  [combination: string]: number | string;
}

export interface ParsedBallCombinationInterface {
  key: any; // 'm1_x1'
  val: number;
  [ballKey: string]: number;
}
