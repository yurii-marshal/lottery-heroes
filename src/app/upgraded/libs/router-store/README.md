## Install
Module depends on @ngrx/store @ngrx/effects @ngrx/router-store

## Use
`constructor(private store: Store<RouterReducerState<RouterStateUrl>>) {}`

`this.store.select(getRouterStateUrl).subscribe();`
