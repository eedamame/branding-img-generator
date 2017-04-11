var
  gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  config = require('../config').sitemap
;

gulp.task('sitemap', function() {
  gulp.src(config.src)
  .pipe($.sitemap({
    siteUrl: 'http://www.example.com/',
    lastmod: false
  }))
  .pipe(gulp.dest(config.dest));
});
