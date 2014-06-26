var gulp = require('gulp');
var browserify = require('gulp-browserify');

gulp.task('browserify', function() {
    gulp.src(['./app/assets/js/app/app.js'])
        .pipe(browserify({
          insertGlobals : true,
          debug : true
        }))
        .pipe(gulp.dest('./public/js'))
});

gulp.task('views', function() {
    // Get our index.html
    gulp.src('app/assets/js/app/views/**/*.html')
        .pipe(gulp.dest('public/views/'));
});

gulp.task('default', ['browserify', 'views']);

gulp.task('watch', function() {
    // Watch our scripts, and when they change run lint and browserify
    gulp.watch(['./app/assets/js/app/**/*.js'],[
        'browserify'
    ]);
    gulp.watch(['app/assets/js/app/views/**/*.html'], [
        'views'
    ]);
});