/* =============================================================================
   config.flag.minifyCss がtrueの場合は、cssをminifyする
   falseの場合は、csscombによって展開された状態になる

   config.flag.useStyleguide がtrueの場合は、スタイルガイドを作成する

============================================================================= */
var
  gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  flag = require('../config').flag,
  config = require('../config').sass
;

function _sass() {
  return gulp.src([config.src])
    .pipe($.plumber({errorHandler: $.notify.onError('<%= error.message %>')}))
    .pipe($.sass({
      style: 'expanded'
    }))
    .on('error', function (err) { console.log(err.message); })
    .pipe($.autoprefixer('last 1 version', 'ie 9', 'ie 10'))
    .pipe($.csscomb())
    .pipe($.if(flag.minifyCss, $.minifyCss()))
    .pipe(gulp.dest(config.dest));
}

if(flag.useStyleguide) {
  gulp.task('sass', ['styleguide'], function() {
    _sass();
  });
} else {
  gulp.task('sass', function() {
    _sass();
  });
}
