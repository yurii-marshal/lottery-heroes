export interface OfferingsComboPriorityInterface {
  combo_id: string;
  page: string;
  priority: number;
}

export interface OfferingsCombosPrioritiesInterface {
  priorities: Array<OfferingsComboPriorityInterface>;
}
