;
var X = function(a) {
    this._options = a || {
        isappinstalled: false,
        refer: "",
        tid: 5,
        access: "",
        android_version: ""
    };
    this._log_url = "/index/index/log_download";
    this._ios_durl = "https://itunes.apple.com/cn/app/id931449079";
    this._android_durl = "http://i.xiaohongchun.com/xhc_release_1.0.apk";
    this._app_isInstalled = false;
    this._ios_app = "QQ41C537CB://";
    this._android_app = "xhc://xiaohongchun/params";
    this._hosts = "http://www.xiaohongchun.com";
    this._browsers = {
        isAndroid: false,
        isIos: false,
        isIpad: false,
        weixin: false
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
    // this.logs();
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