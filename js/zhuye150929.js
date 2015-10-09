$(document).ready(function() {
  // baseurl这里需要改成上面这行
  // var base_url="http://www.xiaohongchun.com";
  var base_url = ".";
  // end baseurl这里需要改成上面这行
  var last_videoid = -1;
  var last_getvideoid = -2;
  var getvideo_lock = false;
  // 从原版本拿过来的封装好X对象
  // 可以实现绑定某个DOM下载APP
  ;
  // 20151009修改
  var brower = {
    versions: function() {
      var u = window.navigator.userAgent;
      var num;
      if (u.indexOf('Trident') > -1) {
        //IE
        return {"type":"IE"};
      } else if (u.indexOf('Presto') > -1) {
        //opera
        return {"type":"Opera"};
      } else if (u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1) {
        //firefox
        return {"type":"Firefox"};
      } else if (u.indexOf('AppleWebKit' && u.indexOf('Safari') > -1) > -1) {
        //苹果、谷歌内核
        if (u.indexOf('Chrome') > -1) {
          //chrome  
          return {"type":"Chrome"};
        } else if (u.indexOf('OPR')) {
          //webkit Opera
          return {"type":"Opera_webkit"};
        } else {
          //Safari
          return {"type":"Safari"};
        }
      } else if (u.indexOf('Mobile') > -1) {
        //移动端
        if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
          //ios
          if (u.indexOf('iPhone') > -1) {
            //iphone
            return {"type":"iPhone"};
          } else if (u.indexOf('iPod') > -1) {
            //ipod  
            return {"type":"iPod"};
          } else if (u.indexOf('iPad') > -1) {
            //ipad
            return {"type":"iPad"};
          }
        } else if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
          //android
          num = u.substr(u.indexOf('Android') + 8, 3);
          return {
            "type": "Android",
            "version": num
          };
        } else if (u.indexOf('BB10') > -1) {
          //黑莓bb10系统
          return {"type":"BB10"};
        } else if (u.indexOf('IEMobile')) {
          //windows phone
          return {"type":"Windows Phone"};
        } else if (u.indexOf('micromessenger')) {
          //微信
          return {"type":"weixin"};
        }
      }
    }
  }
  var browerversion = brower.versions();

  var X = function(a) {
    this._options = a || {
      isappinstalled: false,
      refer: "",
      tid: 5,
      access: "indexh5",
      android_version: browerversion.type=='Android'?browerversion.version:''
    };
    this._log_url = "/index/index/log_download";
    this._ios_durl = "https://itunes.apple.com/cn/app/id931449079";
    this._android_durl = "http://i.xiaohongchun.com/xhc_release_1.0.apk";
    this._app_isInstalled = false;
    this._ios_app = "QQ41C537CB://";
    this._android_app = "xhc://xiaohongchun/params";
    this._hosts = "http://www.xiaohongchun.com";
    this._browsers = {
      isAndroid: browerversion.type=='Android',
      isIos: browerversion.type=='iPhone',
      isIpad: browerversion.type=='iPad',
      weixin: browerversion.type=='weixin'
    };
    this.init = function() {
      var b = {
        isAndroid: navigator.userAgent.match(/android/ig),
        isIos: navigator.userAgent.match(/iphone|ipod/ig),
        isIpad: navigator.userAgent.match(/ipad/ig),
        weixin: navigator.userAgent.match(/MicroMessenger/ig)
      };
      this._browsers = b || this._browsers
    };
    this.init();
    if (this._options.isappinstalled == 1) {
      $("#downBut").attr("src", "/img/h5share/downBut.png");
      $("#download_img1").attr("src", "/img/h5share/open.png")
    }
  };
  X.prototype.download = function() {
    this.logs();
    if (this._browsers.weixin) {
      url = "http://a.app.qq.com/o/simple.jsp?pkgname=com.xiaohongchun.redlips&g_f=991653";
      location.href = url;
      return
    }
    if (this._browsers.isAndroid) {
      if (parseInt(this._options.android_version) >= 4) {
        location.href = this._android_durl;
        return
      } else {
        alert("您的系统版本过低，该应用支持4.0以上！");
        return
      }
    }
    location.href = this._ios_durl;
    return
  };
  X.prototype.download_for_scan = function() {
    this.logs();
    if (this._browsers.weixin) {
      if (this._browsers.isAndroid) {
        $("#tip_pic").attr("src", "/img/tags_share/android_tip.png")
      }
      if (this._browsers.isIos) {
        $("#tip_pic").attr("src", "/img/tags_share/ios_tip.png")
      }
      return
    }
    if (this._browsers.isAndroid) {
      if (parseInt(this._options.android_version) >= 4) {
        location.href = this._android_durl;
        return
      } else {
        alert("您的系统版本过低，该应用支持4.0以上！");
        return
      }
    }
    location.href = this._ios_durl;
    return
  };
  X.prototype.logs = function() {
    var a = {
      tid: this._options.tid,
      refer: this._options.refer,
      access: this._options.access,
      os: "ios"
    };
    if (this._browsers.isAndroid) {
      a.os = "android"
    }
    $.ajax({
        url: this._log_url,
        data: a,
        cache: false,
        type: "POST"
    })
  };
  X.prototype.bind_download = function(a) {
    var b = this;
    $.each(a, function(c, d) {
      if (d.indexOf(".") != -1) {
        $(d).each(function() {
          $(this).click(function() {
            b.download()
          })
        })
      } else {
        $("#" + d).click(function() {
          b.download()
        })
      }
    })
  };
  X.prototype.redirect = function(a) {
    var d, b = 1000,
      e = true;
    setTimeout(function() {
      if (e) {
        this._app_isInstalled = true
      } else {
        this._app_isInstalled = false
      }
      document.body.removeChild(f)
    }, 2000);
    var c = Date.now();
    var f = document.createElement("iframe");
    f.setAttribute("src", a);
    f.setAttribute("style", "display:none");
    document.body.appendChild(f);
    d = setTimeout(function() {
      var g = Date.now();
      if (!c || g - c < b + 100) {
        e = false
      }
    }, b)
  };
  X.prototype.bind_redirect = function(a) {
    var b = this;
    $.each(a, function(c, d) {
      $("#" + d).click(function() {
        if (b._browsers.isAndroid) {
          b.redirect(b._android_app)
        }
        if (b._browsers.isIos) {
          b.redirect(b._ios_app)
        }
      })
    })
  };
  X.prototype.play = function(b, d) {
    var c = b ? b : 640;
    var a = d ? d : 640;
    $("video").each(function(f, e) {
      $($(this)).mediaelementplayer({
        defaultVideoWidth: c,
        defaultVideoHeight: a,
        videoWidth: c,
        videoHeight: a,
        framesPerSecond: 30,
        alwaysShowControls: false,
        features: ["playpause", "progress", "current", "duration", "tracks", "volume", "fullscreen"],
        success: function(g) {}
      })
    })
  };
  var template = function(t, p) {
    if (p) {
      for (var i in p) t = t.replace('{' + i + '}', p[i]);
    }
    return t;
  }
  var limitless = function(height_th, callback) {
    window.onscroll = function() {
      if (document.body.scrollHeight - document.body.scrollTop - window.innerHeight < height_th) {
        console.log(document.body.scrollHeight - document.body.scrollTop - window.innerHeight);
        callback();
      }
    };
  }
  var loadTags = function() {
    $.getJSON(base_url + "/api2/index/gtag", function(json) {
      var tagscreator = function(p) {
        var domtemp = '<div class="users"><img src="{recommend_pic}"; onclick="location.href=\'/share_tags/{id}\'"><div><p>{name}</p></div></div>';
        return template(domtemp, p);
      }
      if (json && json.data && json.data.length > 0) {
        var tempdom = '';
        for (var i = 0; i < json.data.length; i++) {
          tempdom = tempdom.concat(tagscreator(json.data[i]));
        };
        $recommandusers = $('.recommandusers')
        $recommandusers.append(tempdom)
        .owlCarousel({
          item: 4,
          itemsMobile: [640, 4],
          autoPlay: 4000
        });
      }
    });
  }
  var loadMoreVideo = function() {
    if (getvideo_lock || last_videoid == last_getvideoid) {
      return;
    }
    getvideo_lock = true;
    $loading_dom.fadeIn();
    var url = base_url.concat("/api2/index/gvideo").concat(last_videoid == -1 ? '' : ('?id=' + last_videoid));
    $.getJSON(url, function(json) {
      var gvideocreator = function(p) {
        var domtemp = '<div class="card videocard"><img src="{cover_url}"; style="width:{img_width};height:{img_height};" class="screenshot" onclick="location.href=\'/show/{id}\'"><div class="textwrapper"><div class="playcount">{plays}</div><div class="commentcount">{comments}</div><div class="clearfix"></div><div class="videotitle">{title}</div><div class="videodescription">{desc}</div></div><div class="user" onclick="location.href=\'/u/{user_id}\'"><img src="{icon_url}"; class="avatar"><span class="username">{nick}</span><div class="clearfix"></div></div></div>'
        last_videoid = p.id;
        p.desc = p.desc.length > 44 ? p.desc.substring(0, 44).concat('··') : p.desc;
        if (p.cover_wh_ratios == 1) {
          p.img_width = '300px';
          p.img_height = '300px';
        } else if (p.cover_wh_ratios > 1) {
          p.img_height = '300px';
          p.img_width = parseInt(p.cover_wh_ratios * 300) + 'px';
        } else if (p.cover_wh_ratios < 1) {
          p.img_width = '300px';
          p.img_height = parseInt(300 / p.cover_wh_ratios) + 'px';
        }
        return template(domtemp, p);
      }
      var doyencreator = function(p) {
        if (p && p.view_flag && p.view_flag == 1) var domtemplate2 = '<img src="{icon_url}"; onclick="location.href=\'/u/{uid}\'"><div class="d_text">{nick}</div>';
        var domtemp2 = '';
        var domtemplate1 = '<div class="card doyen"><div class="d_text">{user_title}</div>{domtemp2}</div>';
        for (var i = 0; i < p.users.length; i++) {
          domtemp2 = domtemp2.concat(template(domtemplate2, p.users[i]));
        }
        delete p.users;
        p.domtemp2 = domtemp2;
        return template(domtemplate1, p);
      }
      last_getvideoid = last_videoid;
      if (json && json.data && json.data.length > 0) {
        var tempdom = '';
        for (var i = 0; i < json.data.length; i++) {
          tempdom = tempdom.concat(json.data[i].view_flag == 0 ? gvideocreator(json.data[i]) : doyencreator(json.data[i]));
        };
        tempdom = $(tempdom);
        $container.append(tempdom).masonry('appended', tempdom);
      } else if (json.err) {
        // TODO NoData Handler in here
      }
      $loading_dom.hide();
      getvideo_lock = false;
    });
  }
  var $loading_dom = $('.loading');
  var $container = $('.masonry');
  var $download = $('.download,.footerdownload');
  // TODO Here  
  // 这里需要修改
  var x = new X();
  x.bind_download(['download', 'footerdownload']);
  // end 这里需要修改
  $container.masonry({
    itemSelector: '.card',
    columnWidth: 310
  });
  loadTags();
  loadMoreVideo();
  limitless(100, loadMoreVideo, true);
});