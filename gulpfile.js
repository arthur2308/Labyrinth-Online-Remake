/*jslint indent: 2, node: true, nomen: true */

var gulp = require('gulp'),
  jslint = require('gulp-jslint'),
  _jslintGlob = [
    '*.js',
    'client/*.js',
    'server/*.js',
    '!**/*.min.js',
    '!bundle.js'
  ];

gulp.task('jslint', function () {
  "use strict";

  return gulp.src(_jslintGlob).
    pipe(jslint());
});

gulp.task('watch', function () {
  "use strict";

  gulp.watch(_jslintGlob, ['jslint']);
});

gulp.task('default', ['jslint']);
