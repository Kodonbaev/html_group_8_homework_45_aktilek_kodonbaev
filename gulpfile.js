var gulp = require('gulp');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var pug = require('gulp-pug');
var data = require('gulp-data');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var csscomb = require('gulp-csscomb');
var prettify = require('gulp-html-prettify');
var imagemin = require('gulp-imagemin');

gulp.task('styles', function(){
	gulp.src('app/sass/style.sass')
	.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
	.pipe(prefix())
	.pipe(csscomb())
	.pipe(gulp.dest('app/css'))
});

gulp.task('views', function(){
	gulp.src('app/templates/*.pug')
	.pipe(data(function(file){
		return require('./app/templates/data/data.json')
	}))
	.pipe(pug())
	.pipe(prettify({indent_char: ' ', indent_size: 2}))
	.pipe(gulp.dest('app/'))
});

gulp.task('compress', function(){
	gulp.src('app/js/main.js')
	.pipe(uglify())
	.pipe(rename('main.min.js'))
	.pipe(gulp.dest('app/js'));
});

gulp.task('compressImg', function(){
	gulp.src('app/*')
	.pipe(imagemin())
	.pipe(gulp.dest('app/'))
});

gulp.task('watch', function(){
	gulp.watch('app/sass/**/*.sass', ['styles'])
	gulp.watch('app/templates/**/*.pug', ['views'])
	gulp.watch('app/js//**/*.js', ['compress'])
	gulp.watch('app/*', ['compressImg'])
});

gulp.task('default', ['styles', 'watch', 'views', 'compress', 'compressImg']);