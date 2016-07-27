// Sass configuration
var gulp = require('gulp');
var sass = require('gulp-sass');
// var minify = require('gulp-minify');


gulp.task('sass', function () {

    return gulp.src('public/scss/*.scss')
        .pipe(sass())
        // .pipe(minify())
        .pipe(gulp.dest('public/stylesheets/'));
});

gulp.task('default', ['sass'], function () {
    gulp.watch('public/scss/*.scss', ['sass']);
});

