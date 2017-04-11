var
  gulp = require('gulp'),
  config = require('../config').htmlhint,
  shell = require('gulp-shell')
;

gulp.task('htmlhint', shell.task([
  'htmlhint ' + config.prod
]));
gulp.task('htmlhint:dev', shell.task([
  'htmlhint ' + config.dev
]));
