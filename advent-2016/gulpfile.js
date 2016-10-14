var gulp         = require("gulp"),
    sass         = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    hash         = require("gulp-hash"),
    del          = require("del"),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),    
    filter = require('gulp-filter'),
    mainBowerFiles = require('main-bower-files'),
    flatten = require('gulp-flatten'),
    imagemin = require('gulp-imagemin');

var print = require('gulp-print');


var dest = "../static/";

var sassPaths = [
  'bower_components/foundation-sites/scss',
  'bower_components/motion-ui/src'
];

// Compile SCSS files to CSS
gulp.task("sass", function () {
  del([dest+"css/**/*"],{force:true})
  return gulp.src('scss/app.scss')
        .pipe(sass({
          includePaths: sassPaths,
          outputStyle: 'compressed' // if css compressed **file size**
        }))
        .pipe(autoprefixer({
            browsers : ["last 20 versions"]
        }))
        .pipe(hash())        
        .pipe(gulp.dest(dest+"css"))
        .pipe(hash.manifest("hash.json"))
        //Put the map in the data directory
        .pipe(gulp.dest("../data/css"))      
})

// Compile SCSS files to CSS
gulp.task('concat-bower-deps', function() {
    del([dest+"js/**/*"],{force:true})        
    return gulp.src(mainBowerFiles('**/*.js'))
        .pipe(print())
        .pipe(concat("bower.js"))
        .pipe(gulp.dest("js/"))      

});

gulp.task('min-js',['concat-bower-deps'],function() {
    return gulp.src(['js/bower.js','js/app.js'])
        .pipe(print())    
        .pipe(concat("app.js"))    
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(hash())        
        .pipe(gulp.dest(dest+"js"))
        .pipe(hash.manifest("hash.json"))  
        .pipe(gulp.dest("../data/js"))      
})

gulp.task('js',['concat-bower-deps','min-js'])

gulp.task("watch",function() {
    gulp.watch("scss/app.scss", ["sass"])
    gulp.watch("js/app.js", ["js"])
})

// Set watch as default task
gulp.task("default", ["watch"])

