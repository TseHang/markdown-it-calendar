const gulp = require('gulp')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const compass = require('gulp-compass')
const minifyCSS = require('gulp-minify-css');

gulp.task('babel', () => {
  return gulp.src('./src/js/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./'))
})

gulp.task('sass', function() {

  return gulp.src('./sass/**/*.scss')
  .pipe(compass({
    config_file: './config.rb',
    css: './',
    sass: 'sass'
  }))
  .pipe(minifyCSS())
  .pipe(gulp.dest('./'));
});

gulp.task('watch', () => {
  gulp.watch(['./src/**/*.js'], ['babel'])
  gulp.watch(['./sass/**/*.scss'], ['sass'])
})

gulp.task('default', ['babel', 'sass', 'watch'])
