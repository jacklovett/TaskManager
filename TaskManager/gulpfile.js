var gulp = require("gulp"),
    sass = require("gulp-sass"),
    $ = require("gulp-load-plugins")(),
    args = require("yargs").argv;

var prod = args.prod;

var scripts = [
    "App/.components/**/*.js",
    "App/.config/app.config.js",
    "App/Authentication/**/*.js",
    "App/Projects/**/*.js",
    "App/Tasks/**/*.js",
    "App/Overview/**/*.js",
    "App/Backlog/**/*.js",
    "App/Calendar/**/*.js",
    "App/App/**/*.js"
];

var vendor = [
      "Scripts/Vendor/jQuery/jquery-2.2.3.js",
      "Scripts/Vendor/Angular/angular.js",
      "Scripts/Vendor/Angular/angular-ui-breadcrumbs.js",
      "Scripts/Vendor/Angular/angular-ui-router.js",
      "Scripts/Vendor/Angular/angular-mocks.js",
      "Scripts/Vendor/Angular/angular-cookies.js",
      "Scripts/Vendor/Angular/angular-local-storage.js",
      "Scripts/Vendor/Angular/angular-animate.js",
      "Scripts/Vendor/Angular/angular-aria.js",
      "Scripts/Vendor/Angular/angular-http-utils.js",
      "Scripts/Vendor/Angular/angular-material.js",
      "Scripts/Vendor/Angular/angular-material-mocks.js",
      "Scripts/Vendor/Angular/angular-ui-grid.js"
];


var vendorCss = [
    "Content/Reset/reset.css",
    "Content/Vendor/Angular/angular-material.min.css",
    "Content/Vendor/Icons/materialdesignicons.min.css"
];

var scss = ["./Content/Sass/**/*.scss"];

function compileVendorCss() {
    gulp.src(vendorCss)
        .pipe($.concat("vendor.css"))
        .pipe(gulp.dest("content/"));
}

function compileVendorJs() {
    gulp.src(vendor)
        .pipe(!prod ? $.sourcemaps.init() : $.util.noop())
        .pipe($.concat("vendor.js"))
        .pipe(prod ? $.uglify() : $.util.noop())
        .pipe(!prod ? $.sourcemaps.write() : $.util.noop())
        .pipe(gulp.dest("scripts/"));
}

function compileAppSass() {


    gulp.src(scss)
        .pipe(sass().on("error", sass.logError))
        .pipe($.concat("taskmanager.css"))
        .pipe(gulp.dest("content/"));
}

function compileAppScripts() {
    gulp.src(scripts)
        .pipe(!prod ? $.sourcemaps.init() : $.util.noop())
        .pipe($.babel({
            presets: ["es2015"]
        }))
        .pipe($.concat("application.js"))
        .pipe(prod ? $.uglify() : $.util.noop())
        .pipe(!prod ? $.sourcemaps.write() : $.util.noop())
        .pipe(gulp.dest("scripts/"));
}

gulp.task("vendorSass", compileVendorCss);
gulp.task("vendorScripts", compileVendorJs);
gulp.task("appSass", compileAppSass);
gulp.task("appScripts", compileAppScripts);

gulp.task("compileVendor", function () {
    compileVendorCss();
    compileVendorJs();
});

gulp.task("default", ["appScripts", "appSass"], function () {
    gulp.watch(scripts, ["appScripts"]);
    gulp.watch(scss, ["appSass"]);
});