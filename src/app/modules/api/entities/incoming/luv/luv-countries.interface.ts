export interface LuvCountryInterface {
  id: string; // "AU"
  name: string; // "Australia"
  code3: string; // "AUS"
  code_numeric: string; // "248"
}

export interface LuvCountriesBrandInterface {
  countries: {
    [brandId: string]: Array<LuvCountryInterface>;
  };
}

export interface LuvCountriesInterface {
  countries: Array<LuvCountryInterface>;
}
