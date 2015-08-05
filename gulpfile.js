'use strict';

var babel    = require('gulp-babel');
var del      = require('del');
var gulp     = require('gulp');
var packager = require('electron-packager');
var electron = require('electron-connect').server.create();
var jade     = require('gulp-jade');
var useref   = require('gulp-useref');
var sass     = require('gulp-sass');

gulp.task('clean', function (done) {
    del(['releases', 'build'], done);
});

gulp.task('transpile', function () {
    return gulp.src(['app/src/**/*.js'])
        .pipe(babel({ comments: false }))
        .pipe(gulp.dest('build/src'));
});

gulp.task('sass', function () {
    return gulp.src('app/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('build/css'));
});

gulp.task('templates', function() {
    return gulp.src('app/templates/**/*.jade')
        .pipe(jade({ locals: {} }))
        .pipe(gulp.dest('build/templates'))
});

gulp.task('copy', function () {
    return gulp.src(['app/**/*', '!app/src{,/**/*}', '!app/sass{,/**/*}', '!app/templates{,/**/*}'])
        .pipe(gulp.dest('build'));
});

gulp.task('clean-ref', function () {
    return gulp.src('build/teamplates/**/*.html')
        .pipe(useref())
        .pipe(gulp.dest('build'));
});

gulp.task('package', function (done) {
    packager({
        dir:       'build',
        out:       'releases',
        name:      'Akademia',
        platform:  'darwin',
        arch:      'x64',
        version:   '0.28.3',
        overwrite: true,
        icon:      'design/icon.icns'
    }, done);
});

gulp.task('build:generate', gulp.parallel('copy', 'sass', 'templates', 'transpile'))
gulp.task('build', gulp.series('clean', 'build:generate'));

gulp.task('serve', function () {
    // Start browser process
    electron.start();

    // Restart browser process
    gulp.watch('app/src/main.js', gulp.series('build:generate', electron.restart));

    // Reload renderer process
    gulp.watch([
        'app/**/*',
        '!app/components/**/*',
        '!app/node_modules/**/*',
        '!app/src/main.js'
    ], gulp.series('build:generate', electron.reload));
});

gulp.task('default', gulp.series('build', 'serve'));
gulp.task('release', gulp.series('build', 'clean-ref', 'package'));
