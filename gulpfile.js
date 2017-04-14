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
var browserSync = require('browser-sync');
var imageminPngquant = require('imagemin-pngquant');
var liveReload = require('gulp-livereload');
var plumber = require('gulp-plumber');

gulp.task('styles', function(){
	gulp.src('app/sass/style.sass')
	.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
	.pipe(prefix())
	.pipe(csscomb())
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({
		stream: true
	}))
});

gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: 'app'
		}
	})
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
	gulp.src(['app/js/*.js', '!app/js/*min.js'])
	.pipe(uglify())
	.pipe(rename({
		suffix: '.min'
	}))
	.pipe(gulp.dest('app/js'));
});

gulp.task('compressImg', function(){
	gulp.src('app/uploads/*')
	.pipe(imagemin({
		progressive: true
	}))
	.pipe(gulp.dest('app/uploads/'))
});


gulp.task('watch', ['browserSync'], function(){
	gulp.watch('app/sass/**/*.sass', ['styles'])
});

gulp.task('watch', ['browserSync', 'sass'], function (){
	gulp.watch('app/sass/**/*.sass', ['styles']);
});

gulp.task('build-css', function() {
	return gulp.src('app/sass/style.sass')
	.pipe(plumber())
	.pipe(sass())
	.on('error', function (err) {
		gutil.log(err);
		this.emit('end');
	})
	.pipe(prefix(
	{
		browsers: [
		'> 1%',
		'last 2 versions',
		'firefox >= 4',
		'safari 7',
		'safari 8',
		'IE 8',
		'IE 9',
		'IE 10',
		'IE 11'
		],
		cascade: false
	}
	))
	.pipe(gulp.dest('app/sass'))
	.pipe(liveReload());
});

gulp.task('watch', function(){
	gulp.watch('app/sass/**/*.sass', ['styles'])
	gulp.watch('app/templates/**/*.pug', ['views'])
	gulp.watch('app/js//**/*.js', ['compress'])
	gulp.watch('app/*', ['compressImg'])
});

gulp.task('default', ['styles', 'watch', 'views', 'compress', 'compressImg', 'build-css']);