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

var config = {
    sassPath: './resources/sass',
    bowerDir: './bower_components'
}

var dest = "../static/";

var sassPaths = [
    config.bowerDir + '/foundation-sites/scss',
    config.bowerDir + '/motion-ui/src',
    config.bowerDir + '/fontawesome/scss',
    config.bowerDir + '/plyr/src/scss'
];

// Compile SCSS files to CSS
gulp.task("sass", function () {
  del([dest+"css/**/*"],{force:true})
  return gulp.src('scss/app.scss')
        .pipe(sass({
          includePaths: sassPaths,
          outputStyle: 'compressed' // if css compressed **file size**
        }))
        .on('error',function(error) {console.log(error); this.emit('end')})
        .pipe(autoprefixer({
            browsers : ["last 20 versions"]
        }))
        .pipe(hash())        
        .pipe(gulp.dest(dest+"css"))
        .pipe(hash.manifest("hash.json"))
        //Put the map in the data directory
        .pipe(gulp.dest("../data/css"))      
})

gulp.task('concat-bower-deps', function() {
    del([dest+"js/**/*"],{force:true})        
    return gulp.src(mainBowerFiles('**/*.js'))
        .pipe(print())        
        .pipe(concat("bower.js"))
        .pipe(gulp.dest("js/"))      

});

gulp.task('images',function() {
    return gulp.src(['images/**/*'])
        .pipe(imagemin())
        .pipe(gulp.dest(dest+"images"))
})

gulp.task('min-js',['concat-bower-deps'],function() {
    return gulp.src(['js/bower.js','js/playlist.js','js/app.js'])
        .pipe(concat("app.js"))    
        .pipe(uglify())
        .on('error',function(error) {console.log(error); this.emit('end')})        
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(hash())        
        .pipe(gulp.dest(dest+"js"))
        .pipe(hash.manifest("hash.json"))  
        .pipe(gulp.dest("../data/js"))      
})

gulp.task('js',['concat-bower-deps','min-js'])

gulp.task('icons', function() {
    return gulp.src(config.bowerDir + '/fontawesome/fonts/**.*')
        .pipe(flatten())    
        .pipe(gulp.dest(dest + 'fonts/'));
});


gulp.task("watch",function() {
    gulp.watch("scss/*.scss", ["sass",'images','icons'])
    gulp.watch("js/*.js", ["js",'images'])
})

// Set watch as default task
gulp.task("default", ["watch"])

