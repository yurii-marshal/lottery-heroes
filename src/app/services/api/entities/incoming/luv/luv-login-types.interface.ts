export interface LuvLoginTypeInterface {
  id: string; // "regular"
  name: string; // "Regular"
}

export interface LuvLoginTypesInterface {
  login_types: Array<LuvLoginTypeInterface>;
}
