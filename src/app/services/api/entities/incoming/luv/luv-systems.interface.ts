export interface LuvSystemInterface {
  id: string; // "web"
  name: string; // "Website"
}

export interface LuvSystemsInterface {
  systems: Array<LuvSystemInterface>;
}
