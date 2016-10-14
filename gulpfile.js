'use strict';

let gulp = require('gulp'),
    del = require('del'),
    runSequence = require('run-sequence'),
    stylish = require('jshint-stylish'),
    connect = require('gulp-connect'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCss = require('gulp-clean-css'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    imagemin = require('gulp-imagemin'),
    plumber = require('gulp-plumber'),
    changed = require('gulp-changed'),
    babel = require('gulp-babel'),
    sourcemaps = require('gulp-sourcemaps'),
    paths = require('./paths.json');

gulp.task('clean', () => {
    return del(paths.dist);
});

gulp.task('server', () => {
    return connect.server({
        port: 3000,
        livereload: true,
        root: paths.dist
    });
});

gulp.task('sass', () => {
    return gulp.src(paths.srcScss)
        .pipe(changed(paths.distCss, {
            extension: '.css'
        }))
        .pipe(plumber())
        .pipe(sass())
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.distCss))
        .pipe(connect.reload());
});

gulp.task('js', () => {
    return gulp.src(paths.srcJs)
        .pipe(changed(paths.distJs))
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(babel())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.distJs))
        .pipe(connect.reload());
});

gulp.task('html', () => {
    return gulp.src(paths.srcHtml)
        .pipe(changed(paths.dist))
        .pipe(plumber())
        .pipe(gulp.dest(paths.dist))
        .pipe(connect.reload());
});

gulp.task('img', () => {
    return gulp.src(paths.srcImg)
        .pipe(changed(paths.distImg))
        .pipe(plumber())
        .pipe(imagemin({
            optimizationLevel: 6,
            progressive: true,
            multipass: true
        }))
        .pipe(gulp.dest(paths.distImg))
        .pipe(connect.reload());
});

gulp.task('root', () => {
    return gulp.src(paths.srcRoot)
        .pipe(changed(paths.dist))
        .pipe(plumber())
        .pipe(gulp.dest(paths.dist))
        .pipe(connect.reload());
});

gulp.task('cleanup', () => {
    del(paths.distCss + 'variables.*');
});

gulp.task('watch', () => {
    gulp.watch(paths.srcHtml, ['html']);
    gulp.watch(paths.srcImg, ['img']);
    gulp.watch(paths.srcJs, ['js']);
    gulp.watch(paths.srcScss, ['sass']);
    gulp.watch(paths.srcRoot, ['root']);
});

gulp.task('default', (callback) => {
    runSequence('clean', 'build', 'server', 'watch', callback);
});

gulp.task('build', (callback) => {
    runSequence(['js', 'sass', 'html', 'img', 'root'], 'cleanup', callback);
});
