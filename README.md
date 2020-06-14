# Service-web-app HELP
## ng serve detecting file changes
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

## Dev tips Php\WebStorm
- Install "editorconfig" plugin if not installed
- Install "Sass Lint" plugin and enable it in settings
- Change code style rules ('', { })
- Set "Right margin" 140 in code style
- Enable tslint 
- Mark "src" and "scss" folder as "Resource Root"
- Exclude src/assets/i18n

## For local build in src/environments/ create the environment.local.ts file 
and copy environment.local.example.ts into a new file environment.local.ts!
And in environment.local.ts, you can switch brand_id: 'BIGLOTTERYOWIN_COM'.

## Measure 
- npm i -g source-map-explorer
- build with -sm flag
- source-map-explorer dist/vendor*.js
- webpack-bundle-analyzer + --stats-json=true

## Test
toBe(value)
toEqual(object)
toMatch(regexp)
toBeDefined()
toBeUndefined()
toBeNull()
toBeTruthy()
toBeFalsy()
toContain(substring)
toBeLessThan(value)
toBeGreaterThan(value)
