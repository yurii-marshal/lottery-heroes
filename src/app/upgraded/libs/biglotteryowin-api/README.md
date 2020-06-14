## Install
Module depends on provider: 

`export function BaseApiUrlFactory(brandQueryService: BrandQueryService): string {
  return brandQueryService.getBrandApiUrl();
}`

`{
  provide: BIGLOTTERYOWIN_BASE_API_URL,
  useFactory: BaseApiUrlFactory,
  deps: [BrandQueryService]
}
`

or

`{provide: BIGLOTTERYOWIN_BASE_API_URL, useValue: 'http://base-api.url'},`
