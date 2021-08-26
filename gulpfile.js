"use strict";

const gulp = require("gulp");
const gulpTslint = require("gulp-tslint");
const tslint = require("tslint");
const del = require("del");
const exec = require("child_process").exec;
const packageInfo =
    require("./package.json");

const tsify = require("tsify");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const babelify = require("babelify");
const path = require("path");
const fs = require('fs');

// task to compile typeScript to Javascript
function tsc(cb) {
    exec("./node_modules/.bin/tsc", (err, stdout, stderr) => {
        if (stdout) {
            console.log(stdout);
        }
        if (stderr) {
            console.log(stderr);
        }
        cb(err);
    });
}

// task to copy config files
function copyData() {
    return gulp.src(["data/**", "!**/*.template"])
        .pipe(gulp.dest("build/"));
}

function lint() {
    const program = tslint.Linter.createProgram("./tsconfig.json");
    return gulp.src(["src/**/*.ts"])
        .pipe(gulpTslint({
            program,
            reporter: "verbose"
        }))
        .pipe(gulpTslint.report());
}

gulp.task("clean", () => {
    return del(["dist", "build"]);
});

gulp.task("lint", gulp.series(lint));
gulp.task("copyData", gulp.series(copyData));
gulp.task("build", gulp.series("clean", "lint", gulp.parallel(tsc, copyData)));

gulp.task("default", gulp.series("build"));

gulp.task('default', () => {
    return browserify({ debug: true })
    .plugin(tsify, { target: 'es2018' })
    .transform(babelify, { extensions: [ '.tsx', '.ts' ] })
    .require("./src/app.ts", { entry: true })
    .bundle()
    .pipe(gulp.dest('./dest/javascripts'));
})