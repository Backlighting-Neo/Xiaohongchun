var gulp = require('gulp');
var moment = require('moment');

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
  return (app.replace('.html',''));
}
var app = getAppName();
var depend = {};
var prestring = "           ";

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
    log("Scaning Dependencies files in your HTML");

		depend.js     = new Set();
		depend.css    = new Set();
    depend.scss   = new Set();
		depend.jsx    = new Set();
		depend.images = new Set();

    // depend.scss.add(`${src_root}scss/${app}.scss`)

	  var rf = function (path) {
	  	o_path = path.split("/");
	  	o_path.pop();
	  	o_path = o_path.join("/");
	  	var extname = path.split(".");
	  	extname = extname[extname.length - 1];
      if(path.indexOf('http')>-1){
        return new Promise(function(resolve, reject) {
          resolve({
            data:'', 
            o_path:'',
            extname:extname
          });
        })
      }
	  	return new Promise(function(resolve, reject) {
	  		fs.readFile(path, 'utf-8', function(err, data) {
	  			err ? reject(err) : resolve({
	  				data:data, 
						o_path:o_path,
						extname:extname})
	  		});
	  	});
	  }	

    var ex = function (path) {
      return new Promise(function(resolve, reject) {
        fs.exists(path, function (exists) {
          resolve(exists);
        });
      })
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
          filename = filename.replace(/(\w*\/\.\.\/)/g,"/");
          filename = filename.replace(/^\//,"");
          var extname = filename.split(".");
          extname = extname[extname.length - 1];
          switch(extname) {
            case "js": case "jsx": case "css":
              depend[extname].add(filename);
              next_promise.push(rf(filename).then(handle));
              if(extname == "css") {
                var scss_filename = filename.replace(".css",".scss")
                .replace("css/","scss/");

                next_promise.push(ex(scss_filename).then(function(isexists) {
                  if(isexists) {
                    depend['scss'].add(scss_filename);
                  }
                }));
              }
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
		  (["js","jsx","css","scss","images"]).forEach(function(item){
		  	depend[item].forEach(function(item2){
		  		config[item].src.push(`${src_root}${item2}`);
		  		dependlist.push(`${src_root}${item2}`);
		  		config[item].dest = `${dest_root}${item}/`;
		  	})
		  })
      var result_string = '';
      (["js","jsx","css","scss","images"]).forEach(function(item) {
        result_string = result_string.concat(depend[item].size==0?"":` ${depend[item].size} ${item},`);
      })
      result_string = result_string.slice(0,-1);
	  	log(`Scaned${result_string} files`);
			resolve();
		})
	});
})

gulp.task("depend", ["scan"], function() {
  var rs = {
    js  :'js  ',
    css :'css ',
    jsx :'jsx ',
    scss:'scss',
    images:'img '
  }
  var r = '\n=============Dependencies Files List=============\n\n';
  (["js","jsx","css","scss","images"]).forEach(function(item) {
    if(depend[item].size>0){
      r += `${prestring}${colors.green(rs[item])}: \t${colors.yellow(`(${depend[item].size} files)`)}\n`;
      for(item2 of depend[item]) {
        r += `${prestring}  ${item2}\n`;
      }
    }
  })
  r += '\n=============Dependencies Files List=============\n';
  console.log(r);
})

gulp.task("clean", function() {
	return gulp.src(dest_root)
		.pipe(p.clean({force: true}));
})

gulp.task("index",['scan', 'clean'], function() {
  return gulp.src(config.index.src)
    .pipe(p.rename("index.html"))
    .pipe(p.replace(
  		'<script type="text/javascript" src="build/JSXTransformer.js"></script>',
  		'<!-- \n 要使用未编译的JSX，请包含下面的js文件 \n <script type="text/javascript" src="build/JSXTransformer.js"></script> \n -->'
  	))
    .pipe(p.replace('src="lib/','src="../lib/'))
    .pipe(p.replace('.js">',`.js?v=${moment().unix()}">`))
    .pipe(p.replace('.css">',`.css?v=${moment().unix()}">`))
  	.pipe(p.replace('build/','js/'))
  	.pipe(p.replace('text/jsx','text/javascript'))
  	.pipe(p.replace('.jsx','.js'))
    .pipe(gulp.dest(config.index.dest))
});

gulp.task("images",['scan','clean'], function() {
  return gulp.src(config.images.src)
    .pipe(gulp.dest(config.images.dest));
})

gulp.task("js-min",['scan', 'clean'], function() {
  var jstomin = [];
  config.js.src.forEach(function(item) {
    if (item.indexOf('.min.js') == -1 &&
      item.indexOf('.jsx') == -1 &&
      item.indexOf('build/' == -1)) 
    // 已压缩过的、JSX文件、build目录中的不压缩
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
    .pipe(gulp.dest(src_root + 'js/')));
})

gulp.task("js",['scan', 'clean', 'js-min', 'babel', 'jsx'], function() {
  return gulp.src(config.js.src)
    .pipe(gulp.dest(config.js.dest))
})

gulp.task("jsx",['scan', 'clean'], function() {
  return gulp.src(config.jsx.src)
    .pipe(gulp.dest(config.js.dest))
})

gulp.task("babel",['scan', 'clean'], function() {
  return gulp.src(config.jsx.src)
    .pipe(p.babel())
    .pipe(p.rename({
      extname: '.js'
    }))
    .pipe(gulp.dest(config.js.dest))
})

gulp.task("scss",['scan', 'clean'], function() {
  return gulp.src(config.scss.src)
    .pipe(gulp.dest(config.scss.dest))
})

gulp.task("css-min",['scan', 'clean'], function() {
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
    .pipe(gulp.dest(src_root + 'css/'));
})

gulp.task("css",['scan','clean','css-min','scss','scss-complie'], function() {
  return gulp.src(config.css.src)
    .pipe(gulp.dest(config.css.dest))
})

gulp.task("scss-complie", function() {
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

gulp.task('watch', ['scan'], function() {
  gulp.watch(dependlist, function(event) {
    var path = event.path;
    var extname = path.split(".");
    extname = extname[extname.length - 1];
    if(extname == "scss") {
      gulp.run('scss-complie');
    } 
    else {
      gulp.src(path).pipe(p.connect.reload());
    }   
  });
});

gulp.task('scsswatch', ['scan'], function() {
  gulp.watch(config.scss.src, ['scss-complie']);
})

gulp.task('build', ['clean', 'images', 'css', 'js', 'index'],function() {
  log("Build OK");
});

gulp.task('default', ['connect-develop', 'watch', 'scsswatch']);
