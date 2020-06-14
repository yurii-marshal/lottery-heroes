export interface LuvCustomerStatusInterface {
  id: string; // "active"
  name: string; // "Active"
}

export interface LuvCustomerStatusesInterface {
  customer_statuses: Array<LuvCustomerStatusInterface>;
}
