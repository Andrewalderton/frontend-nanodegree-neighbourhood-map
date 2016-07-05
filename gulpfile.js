
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    minifycss = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    plumber = require('gulp-plumber'),
    minifyinline = require('gulp-minify-inline'),
    copy = require('gulp-copy'),
    htmlReplace = require('gulp-html-replace'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    del = require('del'),
    jshint = require('gulp-jshint'),
    csslint = require('gulp-csslint'),
    html5Lint = require('gulp-html5-lint'),
    minifyhtml = require('gulp-minify-html');

var critical = require('critical').stream;

var bowerSrc = ['bower_components/**(!sizzle)/dist/*.js', 'bower_components/jquery-ui/*.js', 'bower_components/bootstrap/dist/**/*.js', '!**/**/npm.*', '!**/**/*.slim.*', '!**/**/*.debug.*', '!**/**/*.min.*'];

var bowerCss = ['bower_components/**(!sizzle)/dist/*.css', 'src/css/jquery-ui.css', 'bower_components/bootstrap/dist/**/*.css', '!bower_components/jquery-ui/**/**/jquery-ui.css', '!**/**/npm.*', '!**/**/*.slim.*', '!**/**/*.debug.*', '!**/**/*.min.*', '!**/**/bootstrap-theme.*'];

// Copy Bower Components
gulp.task('copy', function() {
  return [
    gulp.src(['bower_components/bootstrap/fonts/*'])
    .pipe(copy('src/fonts', {prefix: 3})),

    gulp.src(bowerSrc)
    .pipe(copy('src/js', {prefix: 4})),

    gulp.src(bowerCss)
    .pipe(copy('src/css', {prefix: 4}))
  ]
});

// Copy to 'dist' folder
gulp.task('distCopy', function() {
  return [
    gulp.src('src/favicon.ico')
    .pipe(copy('dist', {prefix: 1})),

    gulp.src('src/fonts/*')
    .pipe(copy('dist/fonts', {prefix: 2}))
  ]
});

// HTML minifier
gulp.task('mini-html', function() {
  var opts = {
    conditionals: true,
    spare:true
  };

  return gulp.src('src/*.html')
    .pipe(htmlReplace({js: 'js/vendor.min.js', js2: 'js/main.min.js', css: 'css/vendor.min.css', css2: 'css/main.min.css'}))
    .pipe(critical({base: 'src/tmp', inline: true, minify: true, css: ['src/css/main.css'] }))
    .pipe(minifyhtml(opts))
    .pipe(plumber())
    .pipe(gulp.dest('dist/'));
});

gulp.task('mini-inline', function() {
  gulp.src('*.html')
    .pipe(minifyinline())
    .pipe(gulp.dest('dist'))
});

// Delete leftover temp files from 'critical' plugin
gulp.task('del', function() {
  del([ 'src/tmp/**', '!src/tmp' ])
});

// JavaScript  minifier
gulp.task('mini-js', function() {
  [ gulp.src('src/js/main.js')
      .pipe(plumber())
      .pipe(uglify( {mangle: false}))
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest('dist/js')),

    gulp.src(bowerSrc)
      .pipe(plumber())
      .pipe(concat('vendor.min.js'))
      .pipe(gulp.dest('dist/js'))
      .pipe(uglify({mangle: false}))
      .pipe(gulp.dest('dist/js'))
  ]
});

// CSS minifier
gulp.task('mini-css', function() {
  [ gulp.src('src/css/main.css')
      .pipe(plumber())
      .pipe(minifycss({compatibility: 'ie8'}))
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest('dist/css')),

    gulp.src(bowerCss)
      .pipe(plumber())
      .pipe(concat('vendor.min.css'))
      .pipe(gulp.dest('dist/css'))
      .pipe(minifycss({compatibility: 'ie8'}))
      .pipe(gulp.dest('dist/css'))
  ]
});

// Optimize Images
gulp.task('optimize-image', function() {
    gulp.src('src/img/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/img'));
});

// Image compress
gulp.task('compress-image', function() {
  gulp.src('src/img/*')
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'));
});

// Lint JS
gulp.task('lint', function() {
  return gulp.src('src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(notify({ message: 'JS lint complete' }));
});

// Lint CSS
gulp.task('css', function() {
  gulp.src('src/css/*.css')
    .pipe(csslint())
    .pipe(csslint.reporter());
});

// Lint HTML
gulp.task('html-lint', function() {
    return gulp.src('src/*.html')
        .pipe(html5Lint());
});

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch('src/*.html', ['mini-html']);
  gulp.watch('src/*.html', ['mini-inline']);
  gulp.watch('src/js/*.js', ['mini-js']);
  gulp.watch('src/css/*.css', ['mini-css']);
  gulp.watch('src/img/*', ['optimize-image']);
});

gulp.task('default', ['del', 'distCopy', 'mini-html', 'mini-js', 'mini-css', 'compress-image', 'lint', 'watch']);
