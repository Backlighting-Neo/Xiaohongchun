$(function() {
  var appid = 'wx3d7f899c6405a785';
  var redirect_url = "http://static.xiaohongchun.com/store/TempPay.html";
  var scope = 'snsapi_base';
  var code = mobile.query('code');
  code = code?code:'';
  var state = location.search.replace('?','');
  var alipay = mobile.query('is_success');
  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + encodeURIComponent(redirect_url) + '&response_type=code&scope=' + scope + '&state=' + state + '#wechat_redirect';

  if(alipay && alipay=='T'){
    $('.pay').html('支付成功');
  }

  if ((code.length < 32) && (navigator.userAgent.indexOf('MicroMessenger') > -1)) {
    location.href = url;
    return;
  }

  var data = {
    '129': {
      price: 129,
      title: '【温和到孕妈妈都能用】Papa recipe春雨 蜂胶补水舒缓面膜 10片/盒',
      img: 'http://i.xiaohongchun.com/Fgt-hWmpZBNcl2w5xgLwUwhdCWwW-optimize'
    },
    '99': {
      price: 99,
      title: '【入门级高能面霜】The Face Shop菲诗小铺 大米调理保湿霜 45g',
      img: 'http://i.xiaohongchun.com/FlI9-Ljp_enyiVybXhDAMv4B20Po-optimize'
    }
  }

  if(navigator.userAgent.indexOf('MicroMessenger') > -1) {
    var option = mobile.query('state');
  }
  else if(alipay && alipay=='T') {
    var option = mobile.query('total_fee');
  }
  else {
    var option = location.search.replace('?','');
  }

  if(option!='99' && option!='129'){
    option = '99';
  }
  data = data[option];

  if(option!='99'){
    $('img').attr('src',data.img);
    $('.price').html('¥ '+data.price);
    $('.goods_title').html(data.title);
  }

  if(alipay && alipay=='T') {return}

  if(navigator.userAgent.indexOf('MicroMessenger') > -1) {
    $('.pay').html('微信支付');
    var onBridgeReady = function() {
      $('.pay').click(function() {
        $('.pay').html('请稍候……');
        var pay_ajax = $.getJSON('http://test1.xiaohongchun.com/wxpay/'+code+'/'+data.price*100);
        $.when(pay_ajax).done(function(json) {
          if(json.code>0){
            alert(json.msg);
            return;
          }
          WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
              "appId": appid,
              "timeStamp": json.data.timestamp+'',
              "nonceStr": json.data.noncestr,
              "package": "prepay_id=" + json.data.prepayid,
              "signType": "MD5",
              "paySign": json.data.sign
            },
            function(res) {
              if (res.err_msg == "get_brand_wcpay_request:ok") {
                $('.pay').html('支付成功');
                $('.pay').off('click');
              } 
              else {
                $('.pay').html('支付失败，点击刷新');
                $('.pay').off('click');
                $('.pay').on('click', function() {
                  location.href = 'http://static.xiaohongchun.com/store/TempPay.html?'+option
                })
              }
            }
          );
        })
      })
    }
  }
  else {
    $('.pay').html('支付宝支付');
    // TODO 支付宝
    $('.pay').click(function() {
      $('.pay').html('请稍候……');
      var surl = 'http://'+location.hostname+location.pathname;
      data.title = '小红唇';
      var alipay_option = $.getJSON('http://test1.xiaohongchun.com/alipay/'+data.price+'?return_url='+surl+'&title='+data.title);

      alipay_option.done(function(json) {
        var alipay_gateway = 'https://mapi.alipay.com/gateway.do';
        delete json.code;
        var propertys = Object.getOwnPropertyNames(json);
        for (var i = propertys.length - 1; i >= 0; i--) {
          console.log(propertys[i] + '    ' + json[propertys[i]]);
          if(propertys[i] == 'body'){
            propertys[i] = propertys[i] + '=' + encodeURIComponent(json[propertys[i]]);
          }
          else {
            propertys[i] = propertys[i] + '=' + json[propertys[i]];
          }
        };
        var alipay_url = alipay_gateway + '?' + (propertys.join('&'));
        // console.log(alipay_url);

        location.href = alipay_url;
      })
    });
  }

  // 支付宝也可以读到以下的信息
  mobile.weChat.bindWeChatShare({
    title: '小红唇商城购买',
    desc: data.title,
    link: location.href,
    imgUrl: data.img
  })

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
})