const gulp = require('gulp')

gulp.task('server', () => {
  const webserver = require('gulp-webserver')
  gulp.src('./public')
    .pipe(webserver({
      port: 9000,
      host: '0.0.0.0',
      livereload: true,
      directoryIndex: false,
      open: false,
    }))
})

gulp.task('default', ['server'])
