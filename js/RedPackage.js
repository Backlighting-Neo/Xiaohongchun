$(function(){
	var code = mobile.weChat.getCode('snsapi_userinfo');
	if(code == 'redirect'){return};

	var package_url = 'http://napi.xiaohongchun.com';

	var item = $('.item');
	var owl  = $('.owl');
	var mask = $('#mask');
	var popup = $('.popup');
	var success = $('.success');
	var button = $('#gettingButtonLong,#gettingButtonShort');
	var button2 = $('#gettedButtonLong,#gettedButtonShort');
	var getbtn = $('#gettingButton');
	var token = '';
	var telphone = '';
	var telNo = function() {
		return ($('#telno').val());
	};
	var couponId = mobile.query('couponId');
	if(couponId == ''){
		location.href = 'http://www.xiaohongchun.com';
	}
	var inapp = mobile.query('debug')=='1'?true:mobile.inApp();
	
	if(!inapp && code=='Not in Wechat'){
		alert('请在APP内或微信中打开');
		location.href = 'http://www.xiaohongchun.com';
		return;
	}

	var randomColor = function (){
		var border_color = ['764c4e', 'ff656c', 'fbc400'];
    var id =  Math.floor(Math.random() * (border_color.length+1));
    return ('#'+border_color[id]);
	}

	var ajax_goods = $.getJSON(package_url+'/goods/tags/banners');
	ajax_goods.done(function(json) {
		var goods_vue = new Vue({
			el: '.owl',
			data: json,
			ready: function() {
				mobile.avoidEmptyRequest();
				owl
				.prepend('<div class="item_first"></div>')
				.owlCarousel({
			    pagination: false,
			    allowimperfect: true,
			    customWidth: 890
				});
				var item = $('.item');
				for (var i = item.length - 1; i >= 0; i--) {
					item[i].style['border-color'] = randomColor();
				};
			}
		})
	})

	var render = {
		unget: function() {
			button.show();
			button2.hide();
			button.on('touchstart', function() {
				if(inapp){
					// TODO 修改截获地址
					var hm = document.createElement("script");
					hm.src = 'http://www.xiaohongchun.com/index/params?getCoupon='+couponId;
					var s = document.getElementsByTagName("script")[0];
					s.parentNode.insertBefore(hm, s);
				}
				else {
					mask.css('display','')
					setTimeout(function() {
						mask.css('opacity','1');
					},0);
				}
			})
			$('.editTelNo').on('touchstart',function() {
				mask.css('display','')
				setTimeout(function() {
					mask.css('opacity','1');
				},0);
			})
		},
		getted: function(telNo) {
			button2.show();
			button.hide();
			button.off('touchstart');
			if(inapp) {
				$('.getsuccess').html('红包已放至您当前登录账户');
			}
			else {
				$('.telNo').html(telNo);
				sessionStorage.weChatCode_Gift118_token = token;
				sessionStorage.weChatCode_Gift118_telphone = telNo;
			}
			$('.getsuccess').show();
			if(inapp){
				$('#gettedButtonLong').on('touchstart',function() {
					location.href = 'http://www.xiaohongchun.com/index/params?goods=0';
				})
			}
			else {
				mobile.binddownload(['#gettedButtonLong']);
			}
		}
	}

	// TODO ajax here 判断是否已领过 传入code
	
	render.unget();
  var appgeted = function() {
		var hashQuery = function(item){
			var svalue = location.hash.match(new RegExp("[\#\&]" + item + "=([^\&]*)(\&?)","i"));
			return svalue ? svalue[1] : svalue;
		}
		if(hashQuery('code')==null){
			return;
		}
		if(hashQuery('code')==0){
			popup.hide();
			mask.show();
			setTimeout(function() {
				mask.css('opacity','1');
			},0);
			success.show(function() {
				mask.on('touchstart', function() {
					mask.off('touchstart');
					mask.css('display','none').css('opacity','0');;
				})
				render.getted();
			});
		}
		else {
			if(hashQuery('errmsg')==''){
				alert('领取失败');
			}
			else {
				alert(hashQuery('errmsg'));
			}
		}
  }

	if(inapp){
		window.onhashchange = appgeted;
		appgeted();
	}
	else {
		render.unget();
		if(code!='Not in Wechat'){
			var handler = function(json){
				if(json.code > 0){
					alert(json.msg);
					sessionStorage.removeItem('token');
					sessionStorage.removeItem('telphone');
					return;
				}
				else {
					token = json.token;
					telphone = json.telphone || '';
					sessionStorage.weChatCode_Gift118_token = token;
					sessionStorage.weChatCode_Gift118_telphone = telphone;
					if(telphone != '') {
						//TODO 已有手机号领取
						render.getted(telphone);
					}
				}
			}

			if(sessionStorage.weChatCode_Gift118_token){
				handler({
					code: 0,
					token: sessionStorage.weChatCode_Gift118_token,
					telphone: sessionStorage.weChatCode_Gift118_telphone
				})
			}
			else{
				$.getJSON(package_url+'/oauth/weixin/'+code+'/telphone', handler);
			}
		}
	}

	getbtn.on('touchstart', function() {
		if(!/^[1][358][0-9]{9}$/.test(telNo())){
			alert('输入的手机号格式不对哦~');
			$('#telno').val('');
			return;
		}
		
		var ajax_editTelephone = $.getJSON(package_url+'/oauth/weixin/'+token+'/telphone/'+telNo());
		ajax_editTelephone.done(function(json) {
			var ajax_getPackage = $.getJSON(package_url+'/oauth/weixin/'+token+'/coupons_sys/'+couponId);
		})

		popup.hide();
		success.show(function() {
			var closePopup = function() {
				success.hide();
				popup.show();
				telephone = telNo();
				$('#telno').val('');
				mask.off('touchstart');
				mask.css('display','none').css('opacity','0');
				render.getted(telephone);
			}
			mask.on('touchstart', closePopup)
			$('#closeButton').on('touchstart', closePopup)
		});
	})

	var smallimage = 'images/weChatIcon_RedPackage118.jpg';
	var content = '天天有特价化妆品，便宜有好货，真人视频分享，小红唇只卖口碑王';

	mobile.weChat.bindWeChatShare({
		title: document.title,
		desc: content,
		link: 'http://' + location.host + location.pathname + '?couponId=' + couponId,
		imgUrl: smallimage
	})

	mobile.appendAppShare(smallimage,content);
})