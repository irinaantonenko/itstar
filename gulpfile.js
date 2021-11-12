const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const htmlmin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));

const cssFiles = [
    './src/css/variables.scss',
    './src/css/mixins.scss',
    './src/css/main.scss'   
]

const jsFiles = [
    './src/js/main.js'
]

function html () {
    return gulp.src('./**/*.html')
    .pipe(htmlmin({
        collapseWhitespace: true, 
        removeComments: true 
      }))    
    .pipe(gulp.dest('./build/'))   
}

function styles () {
    return gulp.src(cssFiles)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(concat('style.css'))
    
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 2 versions'],
        cascade: false
    }))
    .pipe(cleanCSS({
        level: 2
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream())
}

function scripts() {
    return gulp.src(jsFiles)
    .pipe(concat('script.js'))
    .pipe(uglify({
        toplevel: true
    }))
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream())
}

function clean() {
    return del(['/build/*'])
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('./src/css/**/*.scss', styles)
    gulp.watch('./src/css/**/*.sass', styles)
    gulp.watch('./src/js/**/*.js', scripts)
    gulp.watch("./*.html").on('change', browserSync.reload)
}

gulp.task('html', html);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('del', clean);
gulp.task('watch', watch);
gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts, html)));
gulp.task('dev', gulp.series('build','watch'));
