"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var srcmap = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var server = require("browser-sync").create();

var less = require("gulp-less");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");

var imagemin = require("gulp-imagemin");

var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");

var del = require("del");

var autoprefixerOptions = {
	grid: true
};

gulp.task("css-flex", function () {
  return gulp.src("src/less-flex/style.less")
    .pipe(plumber())
    .pipe(srcmap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(srcmap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("css-grid", function () {
  return gulp.src("src/less-grid/style.less")
    .pipe(plumber())
    .pipe(srcmap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(autoprefixerOptions)
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(srcmap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("images", function() {
  return gulp.src("src/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task("html", function() {
  return gulp.src("src/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"));
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("src/less-flex/**/*.less", gulp.series("css-flex"));
  gulp.watch("src/less-grid/**/*.less", gulp.series("css-grid"));
  gulp.watch("src/*.html", gulp.series("html", "refresh"));
});

gulp.task("refresh", function(done) {
  server.reload();
  done();
})

gulp.task("copy", function() {
  return gulp.src([
    "src/fonts/**/*.{woff,woff2}",
    "src/js/**",
    "src/*.ico"
  ], {
    base: "src"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
  return del("build");
});

gulp.task("build-flex", gulp.series(
  "clean",
  "copy",
  "css-flex",
  "images",
  "html"
));

gulp.task("build-grid", gulp.series(
  "clean",
  "copy",
  "css-grid",
  "images",
  "html"
  ));
  
gulp.task("start-flex", gulp.series("build-flex", "server"));
gulp.task("start-grid", gulp.series("build-grid", "server"));
