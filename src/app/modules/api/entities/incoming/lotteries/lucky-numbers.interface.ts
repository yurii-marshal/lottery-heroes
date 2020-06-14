export interface LuckyNumbersItemInterface {
  id?: string;
  name?: string;
  numbers: Array<number>;
}

export interface LuckyNumbersGroupInterface {
  luckyNumbers: LuckyNumbersItemInterface;
}

export interface LuckyNumbersGroupsInterface {
  luckyNumbers: Array<LuckyNumbersItemInterface>;
}

export interface LuckyNumbersCreateGroupsInterface {
  groups: Array<LuckyNumbersItemInterface>;
}
