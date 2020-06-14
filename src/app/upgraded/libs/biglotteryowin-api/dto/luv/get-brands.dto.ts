export interface GetBrandsDto {
  brands: BrandDto[];
}

export interface BrandDto {
  id: string;
  name: string;
  currency_id: string;
  type: string;
}
