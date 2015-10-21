var gulp = require('gulp');

var p = require('gulp-load-plugins')({
  scope: ['devDependencies'],
  rename: {
    'gulp-uglify': 'uglify',
    'gulp-minify-css': 'cssmin',
    'throug2': 'throug2',
    'gulp-connect': 'connect',
    'gulp-rename': 'rename',
    'gulp-sass': 'sass',
    'gulp-html-replace': 'htmlreplace',
    'gulp-util': 'util',
    'gulp-replace': 'replace',
    'gulp-clean': 'clean',
    'gulp-sass': 'sass'
  }
});
var colors = p.util.colors;
var log = p.util.log;
var fs = require('fs');
String.prototype.endWith=function(str){
  var reg=new RegExp(str+"$");     
  return reg.test(this);        
}

var getAppName = function() {
  var app = "";
  var has = false;
  process.argv.forEach(function(v) {
    if (v == '--app') {
      has = true;
    } else if (has) {
      app = v;
      has = false;
    }
  });
  if (!app) {
    error("please use --app xxx argument");
    process.exit();
  }
  return (app);
}
var app = getAppName();
var depend = {};
var prestring = "";

var src_root = './';
var dest_root = `../publish/${app}/`
var dependlist = [`${src_root}${app}.html`];

log(`Start ${app}`);

var config = {
  index: {
    src: `${src_root}${app}.html`,
    dest: `${dest_root}`
  },
  js: {
    src: [],
    dest: ''
  },
  jsx: {
    src: [],
    dest: ''
  },
  css: {
    src: [],
    dest: ''
  },
  scss: {
    src: [],
    dest: ''
  },
  images: {
    src: [],
    dest: ''
  },
};

gulp.task("scan", function() {
	return new Promise(function(resolve, reject) {
	  var re   = /(<link.*?href=\\?\"|<script.*?src=\\?\"|<img.*?src=\\?\"|background.*?url\()(.*?)(\\?\".*?>|\).*?;)/g;
		log(`${prestring}Scaning Dependencies files in your HTML`);

		depend.js     = new Set();
		depend.css    = new Set();
    depend.scss   = new Set();
		depend.jsx    = new Set();
		depend.images = new Set();

    depend.scss.add(`${src_root}scss/${app}.scss`)

	  var rf = function (path) {
	  	o_path = path.split("/");
	  	o_path.pop();
	  	o_path = o_path.join("/");
	  	var extname = path.split(".");
	  	extname = extname[extname.length - 1];
	  	return new Promise(function(resolve, reject) {
	  		fs.readFile(path, 'utf-8', function(err, data) {
	  			err ? reject(err) : resolve({
	  				data:data, 
						o_path:o_path,
						extname:extname})
	  		});
	  	});
	  }	

	  var handle = function(opt){
	  	var data = opt.data;
	  	var o_path = opt.o_path;
	  	var o_extname = opt.extname;
	  	var next_promise = [];
	  	var a = new Promise(function(resolve, reject) {
			  var dependarray = data.match(re);
			  dependarray.forEach(function(item, index) {
			  	var filename = item.replace(re,"$2").replace("\\","/");
			  	if((filename.indexOf("\'")+
			  		filename.indexOf("\"")+
			  		filename.indexOf("+"))>-1)
			  			return;
			  	if(o_extname == "css"){
			  		filename = o_path + "/" + filename;
			  	}
			  	
			  	var extname = filename.split(".");
			  	extname = extname[extname.length - 1];
			  	switch(extname) {
			  		case "js": case "jsx": case "css":
			  			depend[extname].add(filename);
			  			next_promise.push(rf(filename).then(handle));
			  			break;
			  		case "png": case "jpg": case "jpeg": case "gif": case "svg":
			  			depend.images.add(filename);
			  			break;
			  	}
			  });
		  });
		  return Promise.all(next_promise);
		}
		  
		rf(`${app}.html`)
		.then(handle)
		.then(function(){
		  (["js","jsx","css","images"]).forEach(function(item){
		  	depend[item].forEach(function(item2){
		  		config[item].src.push(`${src_root}${item2}`);
		  		dependlist.push(`${src_root}${item2}`);
		  		config[item].dest = `${dest_root}${item}/`;
		  	})
		  })
	  	log(`Scaned${(["js","jsx","css","scss","images"]).map(function(item){return depend[item].size==0?undefined:` ${depend[item].size} ${item}`})} files`);
			resolve();
		})
	});
})

gulp.task("clean", function() {
	return gulp.src(dest_root)
		.pipe(p.clean({force: true}));
})

gulp.task("index",['scan'], function() {
  return gulp.src(config.index.src)
    .pipe(p.rename("index.html"))
    .pipe(p.replace(
  		'<script type="text/javascript" src="build/JSXTransformer.js"></script>',
  		'<!-- \n 要使用未编译的JSX，请包含下面的js文件 \n <script type="text/javascript" src="build/JSXTransformer.js"></script> \n -->'
  	))
  	.pipe(p.replace('build/','js/'))
  	.pipe(p.replace('text/jsx','text/javascript'))
  	.pipe(p.replace('.jsx','.js'))
    .pipe(gulp.dest(config.index.dest))
});

gulp.task("images",['scan'], function() {
  return gulp.src(config.images.src, {read: false})
    .pipe(gulp.dest(config.images.dest));
})

gulp.task("js-min",['scan'], function() {
  var jstomin = [];
  config.js.src.forEach(function(item) {
    if (item.indexOf('.min.js') == -1 &&
      item.indexOf('.jsx') == -1)
    // 已压缩过的和JSX文件不压缩
    {
      jstomin.push(item);
      config.js.src.push(item.replace('.js', '').concat('.min.js'));
    }
  })
  return (gulp.src(jstomin)
    .pipe(p.uglify())
    .pipe(p.rename({
      extname: ".min.js"
    }))
    .pipe(gulp.dest(src_root + depend.jsbase)));
})

gulp.task("js",['scan', 'js-min', 'babel', 'jsx'], function() {
  return gulp.src(config.js.src)
    .pipe(gulp.dest(config.js.dest))
})

gulp.task("jsx",['scan'], function() {
  return gulp.src(config.jsx.src)
    .pipe(gulp.dest(config.js.dest))
})

gulp.task("babel",['scan'], function() {
  return gulp.src(config.jsx.src)
    .pipe(p.babel())
    .pipe(p.rename({
      extname: '.js'
    }))
    .pipe(gulp.dest(config.js.dest))
})

gulp.task("scss",['scan'], function() {
  return gulp.src(config.scss.src)
    .pipe(sass())
    .pipe(gulp.dest(config.css.dest))
})

gulp.task("css-min",['scan'], function() {
  var csstomin = [];
  config.css.src.forEach(function(item) {
    if (item.indexOf('.min.css') == -1) {
      csstomin.push(item);
      config.css.src.push(item.replace('.css', '').concat('.min.css'));
    }
  })
  return gulp.src(csstomin)
    .pipe(p.cssmin())
    .pipe(p.rename({
      extname: ".min.css"
    }))
    .pipe(gulp.dest(src_root + depend.cssbase));
})

gulp.task("css",['scan','css-min'], function() {
  return gulp.src(config.css.src)
    .pipe(gulp.dest(config.css.dest))
})

gulp.task("scss",['scan'], function() {
  return gulp.src([`${src_root}scss/${app}.scss`])
    .pipe(p.sass().on('error', p.sass.logError))
    .pipe(gulp.dest(`${src_root}css/`))
})

gulp.task('connect-develop', ['scan'], function() {
  p.connect.server({
    root: [__dirname],
    port: 80,
    livereload: true
  });
});

gulp.task('reload', function() {
  gulp.src(`./${app}.html`)
    .pipe(p.connect.reload());
});

gulp.task('watch', ['scan'], function() {
  gulp.watch(dependlist, ['reload']);
});

gulp.task('build', ['clean', 'images', 'css', 'js', 'index'],function() {
  log(`${prestring}Build OK`);
});

gulp.task('default', ['connect-develop', 'watch']);
