var
  gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  config = require('../config').styleguide
;

gulp.task('styleguide', $.shell.task([
  './node_modules/.bin/aigis run -c ' + config.src
]));
