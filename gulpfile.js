var gulp = require('gulp');

var p = require('gulp-load-plugins')({
  scope: ['devDependencies'], 
  rename: {
  	'gulp-uglify': 'uglify',
  	'gulp-minify-css': 'cssmin',
  	'throug2': 'throug2',
  	'gulp-connect': 'connect',
  	'gulp': 'gulp',
  	'gulp-rename': 'rename'
  } 
});
var fs = require('fs');
console.log('scaning js&css files in your html');
var getAppName = function(){
	var app = "";
	var has = false;
	process.argv.forEach(function(v){
		if(v == '--app'){
			has = true;
		}
		else if(has){
			app = v;
			has = false;
		}
	});
	if(!app){
		console.error("please use --app xxx argument");
		process.exit();
	}
	return(app);
}
var app = getAppName();
var depend = JSON.parse(fs.readFileSync(`${app}.depend.json`,'utf-8'));
if(depend.fileName != app){
	console.error(`depend file (${app}.depend.json) not match this app`);
	process.exit();
};
depend.js  = [];
depend.css = [];
depend.jsx = [];


var html = fs.readFileSync(`${app}.html`,'utf-8');
var css_re = new RegExp("(<link rel=\"stylesheet\" type=\"text/css\" href=\")(.*?)(\">)",'g');
var js_re  = new RegExp("(<script type=\"text/javascript\" src=\")(.*?)(\"></script>)",'g');
var jsx_re = new RegExp("(<script type=\"text/jsx\" src=\")(.*?)(\"></script>)",'g');

var result = '';
while ((result = css_re.exec(html)) != null)
  depend.css.push(result[2]);
while ((result = js_re.exec(html))  != null)
  depend.js.push(result[2]);
while ((result = jsx_re.exec(html)) != null)
	depend.jsx.push(result[2]);

var src_root = './';
var dest_root = `../publish/${app}/`
var dependlist = [`${src_root}${app}.html`];

console.log(`Start ${app}`);

var config = {
	index:{
		src: `${src_root}${app}.html`,
		dest: `${dest_root}`
	},
	js:{src:[],dest:''},
	css:{src:[],dest:''},
	images:{src:[],dest:''},
};

(["js","css","images"]).forEach(function(item){
	depend[item].forEach(function(item2){
		config[item].src.push(`${src_root}${item2}`);
		dependlist.push(`${src_root}${item2}`);
		config[item].dest = `${dest_root}${item}/`;
	})
})

gulp.task("index",function(){
	return gulp.src(config.index.src)
	.pipe(p.rename("index.html"))
	.pipe(gulp.dest(config.index.dest))
});

gulp.task("images",function(){
	return gulp.src(config.images.src)
	.pipe(gulp.dest(config.images.dest));
})

gulp.task("js-min",function(){
	var jstomin = [];
	config.js.src.forEach(function(item){
		if(item.indexOf('.min.js')==-1  && 
			 item.indexOf('.jsx')==-1)
			// 已压缩过的和JSX文件不压缩
		{
			jstomin.push(item);
			config.js.src.push(item.replace('.js','').concat('.min.js'));
		}
	})
	return(gulp.src(jstomin)
	.pipe(p.uglify())
	.pipe(p.rename({extname: ".min.js"}))
	.pipe(gulp.dest(src_root+depend.jsbase)));
})

gulp.task("js",function(){
	return gulp.src(config.js.src)
	.pipe(gulp.dest(config.js.dest))
})

gulp.task("babel",function(){
	return gulp.src(depend.jsx)
	.pipe(p.babel())
	.pipe(p.rename({extname:'.js'}))
	.pipe(gulp.dest(config.js.dest))
})

gulp.task("css-min",function(){
	var csstomin = [];
	config.css.src.forEach(function(item){
		if(item.indexOf('.min.css')==-1)
		{
			csstomin.push(item);
			config.css.src.push(item.replace('.css','').concat('.min.css'));
		}
	})
	return gulp.src(csstomin)
	.pipe(p.cssmin())
	.pipe(p.rename({extname: ".min.css"}))
	.pipe(gulp.dest(src_root+depend.cssbase));
})

gulp.task("css",function(){
	return gulp.src(config.css.src)
	.pipe(gulp.dest(config.css.dest))
})

gulp.task('build',
	['images','js-min','css-min','css','js','index'],
	function(){
	console.info("Build OK");
});

gulp.task('connect-develop', function () {
	p.connect.server({
		root: './',
		port:8080,
		livereload: true
	});
});

gulp.task('reload', function () {
  gulp.src(`./${app}.html`)
    .pipe(p.connect.reload());
});
 
gulp.task('watch', function () {
	console.log(dependlist);
  gulp.watch(dependlist, ['reload']);
});

gulp.task('default', ['connect-develop','watch']);