export interface OfferingsBundlePriorityInterface {
  bundle_id: string;
  page: string;
  priority: number;
}

export interface OfferingsBundlesPrioritiesInterface {
  priorities: Array<OfferingsBundlePriorityInterface>;
}
