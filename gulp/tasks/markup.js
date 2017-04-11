/* =============================================================================
   config.flag.useEct がtrueの場合は、ectのコンパイル
   falseの場合は、htmlファイルのコピーをする
============================================================================= */
var
  gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  config = require('../config'),
  flag = config.flag
;

gulp.task('markup', function() {
  gulp.src($.if(flag.useEct, config.ect.src, config.markup.src))
    .pipe($.if(flag.useEct, $.ect()))
    .pipe($.if(flag.useEct, gulp.dest(config.ect.dest), gulp.dest(config.markup.dest)));
});
