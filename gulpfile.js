const gulp = require('gulp');
const merge = require('gulp-merge-json');
const jsonminify = require('gulp-jsonminify');
const rename = require('gulp-rename');

/***********************************************************
 * TRANSLATIONS
 **********************************************************/
const translationTasks = [];
[
  'en-BIGLOTTERYOWIN_AU'
].forEach(item => {
  let translationTask = `translations:${item}`;
  translationTasks.push(translationTask);

  gulp.task(translationTask, function() {
    return gulp.src([
      `src/**/i18n/${item}.json`,
      `!src/assets/i18n/${item}.json`,
    ])
      .pipe(jsonminify())
      .pipe(merge({
        fileName: `${item}.json`,
        edit: (json) => {
          return JSON.parse(JSON.stringify(json).replace(/\s+/ig, ' '));
        }
      }))
      .pipe(gulp.dest('./src/assets/i18n'));
  });
});

gulp.task('translations:watch', function() {
  gulp.watch([
    `src/**/i18n/*.json`,
    `!src/assets/i18n/*.json`,
  ], translationTasks);
});

gulp.task('distribute', function () {
  return gulp.src([
    `src/i18n/**BIGLOTTERYOWIN_COM.json`
  ])
    .pipe(gulp.dest('./src/assets/i18n'));
});



/***********************************************************
 * DEFAULT
 **********************************************************/
gulp.task('default', [...translationTasks]);
