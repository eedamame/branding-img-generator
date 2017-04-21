var
  dest = './build',
  src = './src';

module.exports = {
  dest: dest,
  src: src,
  flag: {
    useEct: false,// ectを使うか
    useStyleguide: false,// styleguide(aigis)を使うか
    minifyCss: true,// cssをminifyするか
    useBrowsefify: true,// browserify + babelify を使うか
    minifyJs: false,// 上がfalseの場合、minifyだけはおこなうのかどうか
    createSitemap: true // サイトマップファイルを作成するか
  },
  clean: {
    dest: dest
  },
  itemcopy: {
    src: [
      src + "/htdocs/**",
      "!" + src + "/**/*.ect"
    ],
    dest: dest
  },
  browserSync: {
    server: {
      baseDir: [dest, src]
    },
    files: [
      dest + "/**",
      "!" + dest + "/**.map"
    ]
  },
  sass: {
    src: src + "/sass/*.{sass,scss}",
    dest: "./assets/css"
  },
  images: {
    src: src + "/images/**",
    dest: dest + "/images"
  },
  js: {
    src: src + "/js/*.js",
    dest: "./assets/js"
  },
  markup: {
    src: src + "/htdocs/**",
    dest: dest + ""
  },
  ect: {
    src: src + "/htdocs/**/*.ect",
    dest: dest,
    temp: src + "/template/**/*.ect"
  },
  sitemap: {
    src: [
      dest + "/**/*.html",
      "!" + dest + "/headfoot/**/*.html",
      "!" + dest + "/googleb033e3e934699651.html"
    ],
    dest: dest
  },
  eslint: {
    dev: src + "/**/*.js",
    prod: dest + "/**/*.js"
  },
  htmlhint: {
    dev: dest + "/**/*.html",
    prod: src + "/**/*.{html, ect, php}"
  },
  stylelint: {
    dev: src + "/**/*.scss",
    prod: dest + "/**/*.css"
  },
  styleguide: {
    src: "./aigis_config.yml"
  },
  sprite: {
    src: src,
    sass: src + "/sass",
    sprite: src + "/sprite",
    image: src + "/img"
  }
};
