// Load plugins
var gulp = require('gulp');

var plugins = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*', 'main-bower-files', '*'],
  replaceString: /\bgulp[\-.]/
});

var critical = require('critical').stream;

// Define default source and destination folders
var dest = 'dist/';
var src = 'src/';

//Optimize Images
gulp.task('images', function() {
  return
    gulp.src(src + 'img')
    .pipe(plugins.cache(plugins.imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest(dest + 'img'))
    .pipe(plugins.notify({ message: 'Images have been optimized' }))
});

// Move scripts to bottom of html pages
// Generate & Inline Critical-path CSS for above the fold content
// Minify html
gulp.task('inline', function () {
  return gulp.src('src/*.html')
    //.pipe(plugins.htmlreplace({js: 'js/perfmatters.min.js'}))
    .pipe(plugins.defer())
    .pipe(critical({base: 'src/tmp', inline: true, minify: true, css: ['src/css/main.css'] }))
    .pipe(plugins.htmlmin({collapseWhitespace: true}))
    .pipe(plugins.rename({ suffix: '.min' }))
    .pipe(gulp.dest(dest))
    .pipe(plugins.notify({ message: 'CSS inlined and HTML minified' }))

});

// Delete leftover temp files from 'critical' plugin
gulp.task('del', function() {
  plugins.del([ 'src/tmp/**', '!src/tmp' ])
});

gulp.task('css', function() {
  var cssFiles = ['src/css/*.css'];
  var bowerCSS = ['bower_components/**/*.css'];
  return gulp.src(plugins.mainBowerFiles().concat(cssFiles))
    .pipe(plugins.filter(bowerCSS))
    .pipe(plugins.order([
      'normalize.css',
      '*'
    ]))
    .pipe(plugins.concat('main.css'))
    .pipe(plugins.cleanCss({compatibility: 'ie8'}))
    .pipe(plugins.rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/css'))
    .pipe(plugins.notify({ message: 'CSS minified' }))
});

// Minify JS
gulp.task('scripts', function() {
  var jsFiles = ['src/js/*'];
  var bowerJS = ['bower_components/**/*.js'];
  return gulp.src(plugins.mainBowerFiles().concat(jsFiles))
    .pipe(plugins.filter(bowerJS))
    .pipe(plugins.concat('main.js'))
    .pipe(plugins.uglify())
    .pipe(plugins.rename({ suffix: '.min' }))
    .pipe(gulp.dest(dest + 'js'))
    .pipe(plugins.notify({ message: 'JS minified' }))
});

// Lint JS
gulp.task('lint', function() {
  return gulp.src(src + 'js/*.js')
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('default'))
    .pipe(plugins.notify({ message: 'JS lint complete' }))
});

//Browsersync
gulp.task('browser-sync', function() {
  plugins.browserSync.init({
    server: {
      baseDir: "./"
    }
  });
});

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch(src + 'js/*.js' ['lint', 'scripts']).on('change', plugins.browserSync.reload);
  gulp.watch(src + 'css/*.css'['critical']).on('change', plugins.browserSync.reload);
  gulp.watch(src + 'html/*.html' ['useref']).on('change', plugins.browserSync.reload);
});

// Default Task
gulp.task('default', ['del', 'inline', 'scripts', 'css', 'images', 'lint', 'watch'] );
