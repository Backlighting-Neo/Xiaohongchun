$(function() {
  var data = {
    '99': {
      price: 99,
      title: '【温和到孕妈妈都能用】Papa recipe春雨 蜂胶补水舒缓面膜 10片/盒',
      img: 'http://i.xiaohongchun.com/Fgt-hWmpZBNcl2w5xgLwUwhdCWwW-optimize'
    },
    '49': {
      price: 49,
      title: '【入门级高能面霜】The Face Shop菲诗小铺 大米调理保湿霜 45g',
      img: 'http://i.xiaohongchun.com/FlI9-Ljp_enyiVybXhDAMv4B20Po-optimize'
    }
  }

  var option = mobile.query('#');

  if(option!='49' && option!='99'){
    option = '49';
  }
  data = data[option];

  if(option!='49'){
    $('img').attr('src',data.img);
    $('.price').html('¥ '+data.price);
    $('.goods_title').html(data.title);
  }

  var alipay_option = $.getJSON('http://test1.xiaohongchun.com/alipay/0.01');

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
    console.log(alipay_url);
  })

  // var onBridgeReady = function() {
  //   $('.pay').click(function() {
  //     $('.pay').html('请稍候……');
  //     var pay_ajax = $.getJSON('http://test1.xiaohongchun.com/wxpay/'+code+'/'+data.price*100);
  //     $.when(pay_ajax).done(function(json) {
  //       if(json.code>0){
  //         alert(json.msg);
  //         return;
  //       }
  //       WeixinJSBridge.invoke(
  //         'getBrandWCPayRequest', {
  //           "appId": appid,
  //           "timeStamp": json.data.timestamp+'',
  //           "nonceStr": json.data.noncestr,
  //           "package": "prepay_id=" + json.data.prepayid,
  //           "signType": "MD5",
  //           "paySign": json.data.sign
  //         },
  //         function(res) {
  //           if (res.err_msg == "get_brand_wcpay_request:ok") {
  //             $('.pay').html('支付成功');
  //             $('.pay').off('click');
  //           } 
  //           else {
  //             $('.pay').html('支付失败，点击刷新');
  //             $('.pay').off('click');
  //             $('.pay').on('click', function() {
  //               location.href = 'http://static.xiaohongchun.com/store/TempPay.html?'+option
  //             })
  //           }
  //         }
  //       );

  //     })
  //   })
  // }

  mobile.weChat.bindWeChatShare({
    title: '小红唇商城购买',
    desc: data.title,
    link: location.href,
    imgUrl: data.img
  })

})