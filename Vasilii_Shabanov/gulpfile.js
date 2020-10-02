const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');

gulp.task('server', function () {

    browserSync({
        server: {
            baseDir: "dist"
        }
    });


    gulp.watch("src/flexbox/**/*.less", gulp.series("css-flex"));
    gulp.watch("src/grid/**/*.less", gulp.series("css-grid"));
    gulp.watch("src/flexbox/*.html").on('change', browserSync.reload);
    gulp.watch("src/grid/*.html").on('change', browserSync.reload);
});

gulp.task("css-flex", function () {
    return gulp.src("src/flexbox/sass/**/*.+(scss|sass)")
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(rename({
            suffix: '.min',
            prefix: ''
        }))
        .pipe(autoprefixer())
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});

gulp.task("css-grid", function () {
    return gulp.src("src/grid/sass/**/*.+(scss|sass)")
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(rename({
            suffix: '.min',
            prefix: ''
        }))
        .pipe(autoprefixer())
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});

gulp.task('watch', function () {
    gulp.watch("src/flexbox/sass/**/*.+(scss|sass|css)", gulp.parallel("css-flex"));
    gulp.watch("src/grid/sass/**/*.+(scss|sass|css)", gulp.parallel("css-grid"));
    gulp.watch("src/flexbox/*.html").on('change', gulp.parallel('html'));
    gulp.watch("src/grid/*.html").on('change', gulp.parallel('html'));
});

gulp.task('html', () => {
    return gulp.src([
            'src/flexbox/*.html',
            'src/grid/*.html'
        ])
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('fonts', () => {
    return gulp.src('fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('icons', () => {
    return gulp.src('icons/**/*')
        .pipe(gulp.dest('dist/icons'));
});

gulp.task('images', () => {
    return gulp.src('img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});

gulp.task("build-flex", gulp.series(
    "icons",
    "fonts",
    "css-flex",
    "images",
    "html"
));

gulp.task("build-grid", gulp.series(
    "icons",
    "fonts",
    "css-grid",
    "images",
    "html"
));

gulp.task("start-flex", gulp.series("build-flex", "server"));
gulp.task("start-grid", gulp.series("build-grid", "server"));