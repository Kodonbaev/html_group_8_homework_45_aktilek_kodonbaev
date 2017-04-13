var gulp = require('gulp');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var pug = require('gulp-pug');
var data = require('gulp-data');
var js = require('gulp-uglify');

gulp.task('styles', function(){
	gulp.src('app/sass/style.sass')
	.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
	.pipe(prefix())
	.pipe(gulp.dest('app/css/'))
});

gulp.task('views', function(){
	gulp.src('app/templates/*.pug')
	.pipe(data(function(file){
		return require('./app/templates/data/data.json')
	}))
	.pipe(pug())
	.pipe(gulp.dest('app/'))
});

gulp.task('watch', function(){
	gulp.watch('app/sass/**/*.sass', ['styles']);
	gulp.watch('app/templates/**/*.pug', ['views'])
});

gulp.task('')

gulp.task('default', ['styles', 'watch', 'views']);