var gulp = require('gulp');
var ts = require('gulp-typescript');

var tsproject = ts.createProject("tsconfig.json");

gulp.task("typescript", function () {
    return tsproject.src()
        .pipe(ts(tsproject)) //tells gulp ts to use the tsconfig.json file to specify rules
        .pipe(gulp.dest("")); //view the gulp documentation to see options how to integrate gulp and TS
});

gulp.task("watch", function () {
    gulp.watch("*.ts", ["typescript"]); //runs the above typescript task if any changes are detected in ts files
})


gulp.task("default", ["watch"]);