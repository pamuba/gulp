var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require( 'gulp-sass' );
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer  = require('vinyl-buffer');
var uglify = require('gulp-uglify');


var styleSRC = './src/scss/style.scss';
var styleDIST = './dist/css/'



gulp.task('style', function(done){
    gulp.src( styleSRC )
        .pipe( sourcemaps.init() )
        .pipe( sass({
            errorLoToConsole:true,
            outputStyle: 'compressed'
        }))
        .on('error', console.error.bind( console ))
        // .pipe( autoprefixer({ browsers: ['last 2 versions']}))
        .pipe( autoprefixer())
        .pipe( rename({ suffix:'.min' }))
        .pipe( sourcemaps.write('./') )
        .pipe( gulp.dest(styleDIST))
        done();
});

var jsSRC = 'src/js/script.js';
var jsDIST = './dist/js/'

var jsFILES = [jsSRC];

gulp.task('js', function(done){
    
    jsFILES.map(function(entry){
        return browserify({
            entries: [entry]
        })
        .transform(babelify, {presets:['env']})
        .bundle()
        .pipe( source(entry))
        .pipe( rename({ extname: '.min.js'}))
        .pipe( buffer() )
        .pipe( sourcemaps.init({loadMaps: true}))
        .pipe( uglify() )
        .pipe( sourcemaps.write( './' ))
        .pipe( gulp.dest( jsDIST ))
    })

    //browserify
    //transform babelify[env]
    //bundle
    //souce
    //rename .min
    //buffre
    //init sourcemap
    //uglify
    //write sourcemaps
    //dist
    done();
});


styleWatch = './src/scss/**/*.scss';
jsWatch = './src/js/**/*.js';

gulp.task('watch', function(){
    gulp.watch(styleWatch, gulp.series('style')),
    gulp.watch(jsWatch, gulp.series('js'))
});

gulp.task('default', gulp.parallel('style', 'js'), function(){

})