var
  gulp = require('gulp'),
  config = require('../config').itemcopy
;

gulp.task('itemcopy', function() {
  return gulp.src(config.src)
    .pipe(gulp.dest(config.dest));
});
