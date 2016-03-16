(function() {
  var debug = mobile.query('debug');
  debug = debug ? debug : 1;
  var tokenOption = mobile.query('token');


  // 调试指令
  document.write('<style>body {font-size: 35px; padding: 20px; word-break: break-all;} .key {color: blue; margin-right:30px; font-weight: bold;}</style>');
  document.write('<div id="content"></div>');
  document.title = '小红唇微信接口测试';
  var log = function(key, value) {
    var type = 'document'; // document
    value = value ? value : '';
    if (debug > 0) {
      $.get('http://192.168.2.221:1678/log/'+key+'/'+value);
      $.get('http://192.168.2.150:1678/log/'+key+'/'+value);

      switch (type) {
        case 'console':
          console.log("%c" + key + "    %c" + value, "color: blue; font-size: x-large", "color: #000; font-size: x-large");
          break;
        case 'document':
          $('#content').append('<span class="key">' + key + '</span><span>' + value + '</span><br><br>');
          break;
      }
    }
  }

  var start = function() {
    var appid = 'wx3d7f899c6405a785';
    // AppId
    var redirect_url = "http://static.xiaohongchun.com/store/test.html";
    // 回调URL
    // var scope = 'snsapi_login';
    var scope = 'snsapi_userinfo';
    // 授权作用域
    var code = mobile.query('code');
    code = code ? code : 'debugCode';
    // 临时凭票
    var state = tokenOption;
    // 状态码
    var prepayid = 'u802345jgfjsdfgsdg888';
    // 微信预订单编号


    var url = {};
    url.getAccessToken = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + encodeURIComponent(redirect_url) + '&response_type=code&scope=' + scope + '&state=' + state + '#wechat_redirect';

    if (code.length < 32 && debug < 2) {

      location.href = url.getAccessToken;
      return;
    }

    tokenOption = mobile.query('state');
    log('code', code);
    log('prePayId', prepayid);

    $.getJSON('http://192.168.2.100:1339/weixin/get_accesstoken/' + code)
      .done(function(json) {
        if (!json.error) {
          log('AccessToken', json.tencent.access_token);
          log('openID', json.tencent.openid);
        }
      })
      .fail(function() {
        log('get AccessToken Error');
      });

    var sign_ajax = $.getJSON('http://192.168.2.100:1339/weixin/sign/' + prepayid);

    var auth_ajax = $.getJSON('http://192.168.2.100:1339/weixin/authJs')
    
    var jssdk_sign_ajax = $.getJSON('http://192.168.2.100:1339/weixin/authJs/' + encodeURIComponent(location.href));
    
    jssdk_sign_ajax.done(function(json) {
      log('JSSDK-sign', json.signature);
      wx.config({
         debug: debug==2, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
         appId: appid, // 必填，公众号的唯一标识
         timestamp: json.timeStamp, // 必填，生成签名的时间戳
         nonceStr: json.nonceStr, // 必填，生成签名的随机串
         signature: json.signature,// 必填，签名，见附录1
         jsApiList: ['onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
    })

    wx.ready(function(){
      // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
      log('JS-SDK','Ready');
      
      wx.onMenuShareAppMessage({
        title: '微信再分享测试', // 分享标题
        desc: '这里是一个描述', // 分享描述
        link: location.href, // 分享链接
        imgUrl: 'http://static.xiaohongchun.com/store/images/logo.png', // 分享图标
        type: 'link', // 分享类型,music、video或link，不填默认为link
        // dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        // success: function () { 
        //     // 用户确认分享后执行的回调函数
        // },
        // cancel: function () { 
        //     // 用户取消分享后执行的回调函数
        // }
      });
    });



    var onBridgeReady = function() {


      log('WeixinReady', 'Ready');

      $.when(sign_ajax).done(function(json) {
        log('timeStamp', json.timeStamp);
        log('nonceStr', json.nonceStr);
        log('paySign', json.sign);
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            "appId": appid,
            "timeStamp": json.timeStamp,
            "nonceStr": json.nonceStr,
            "package": "prepay_id=" + prepayid,
            "signType": "MD5",
            "paySign": json.sign
          },
          function(res) {
            log('ReturnOnPayFE', res.err_msg);
            if (res.err_msg == "get_brand_wcpay_request:ok") {} // 使用以上方式判断前端返回,微信团队郑重提示:res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
          }
        );
      })
    }

    if (typeof WeixinJSBridge == "undefined") {
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
      }
    } else {
      onBridgeReady();
    }

    document.title = '小红唇微信接口测试';
  };

  var getUserToken = function(success, fail) {
    var _promise = function() {
      var appid = 'wx3d7f899c6405a785';
      var redirect_url = "http://static.xiaohongchun.com/store/test.html";
      var scope = 'snsapi_userinfo';
      var state = mobile.query('token');
      var weChatUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + encodeURIComponent(redirect_url) + '&response_type=code&scope=' + scope + '&state=' + state + '#wechat_redirect';

      var loginPromise = $.Deferred();
      var code = mobile.query('code');
      code = code?code:'';
      var token_interface = 'http://test1.xiaohongchun.com/oauth/weixin/'

      if(typeof window.sessionStorage == 'undefined') {
        loginPromise.reject('noSupport');
      }
      else if(code.length < 32){
        loginPromise.reject('redirect:'+weChatUrl);
      }
      else if(sessionStorage.userToken) {
        loginPromise.resolve(sessionStorage.userToken)
      }
      else {
        var url = token_interface + code;
        // var token_ajax = $.getJSON(url);
        // token_ajax.done(function(json){
        //   if (json.code == 0) {
        //     if(json.data.token && json.data.token.length>0) {
        //       sessionStorage.setItem('userToken', json.token);
        //       loginPromise.resolve(json.data);
        //     }
        //     else {
        //       loginPromise.reject('noToken');
        //     }
        //   }
        //   else if(json.code == 7001) {
        //     loginPromise.reject('codeError');
        //   }
        //   else {
        //     loginPromise.reject('tokenGetError');
        //   }
        // })
        log('微信登录凭票',code);
        tokenOption = mobile.query('state');
        if(tokenOption == 'REAL'){
          tokenOption = 'napi';
        }
        else{
          tokenOption = 'test1';
        }
        var ajax_token = $.getJSON('http://'+tokenOption+'.xiaohongchun.com/oauth/weixin/'+code);
        ajax_token.done(function(json) {
          log('以下是来自'+tokenOption+'服务器的Token','');
          log('小红唇Token', json.data.token);
        })

        loginPromise.resolve(code);
      }

      return loginPromise.promise();
    }
    _promise().done(function(auth) {
      success(auth.token);
    }).fail(function(err) {
      if(err.indexOf('redirect')>-1) {
        location.href = err.replace('redirect:','');
      }
      else {
        fail(err);
      }
    })
  }

  window.onload = function() {
    getUserToken(function(token) {
      // log('token',token);
    }, function(err) { 
      // log('error',error)
    })
  }

})();
