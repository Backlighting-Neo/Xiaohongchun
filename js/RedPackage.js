$(function(){
	var code = mobile.weChat.getCode();

	var package_url = 'http://test1.xiaohongchun.com';

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
			data: json
		})
		mobile.avoidEmptyRequest();
	})

	for (var i = item.length - 1; i >= 0; i--) {
		item[i].style['border-color'] = randomColor();
	};

	owl
	.prepend('<div class="item_first"></div>')
	.owlCarousel({
    pagination: false,
    allowimperfect: true,
    customWidth: 890
	});

	var render = {
		unget: function() {
			button.show();
			button2.hide();
			button.on('click', function() {
				if(inapp){
					// TODO 修改截获地址
					$('body').append('<script src="http://www.xiaohongchun.com/index/params?getCoupon='+couponId+'"></script>');
				}
				else {
					mask.css('display','')
					setTimeout(function() {
						mask.css('opacity','1');
					},0);
				}
			})
			$('.editTelNo').click(function() {
				mask.css('display','')
				setTimeout(function() {
					mask.css('opacity','1');
				},0);
			})
		},
		getted: function(telNo) {
			button2.show();
			button.hide();
			button.off('click');
			if(inapp) {
				$('.getsuccess').html('红包已放至您当前登录账户');
			}
			else {
				$('.telNo').html(telNo);
			}
			$('.getsuccess').show();
		}
	}

	// TODO ajax here 判断是否已领过 传入code
	
	// render.getted();

  var appgeted = function() {
		var hashQuery = function(item){
			var svalue = location.hash.match(new RegExp("[\#\&]" + item + "=([^\&]*)(\&?)","i"));
			return svalue ? svalue[1] : svalue;
		}
		console.log(hashQuery('code'));
		if(hashQuery('code')==''){
			return;
		}
		if(hashQuery('code')==0){
			popup.hide();
			mask.show();
			setTimeout(function() {
				mask.css('opacity','1');
			},0);
			success.show(function() {
				mask.on('click', function() {
					mask.off('click');
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
			var ajax_gettoken = $.getJSON(package_url+'/oauth/weixin/'+code+'/telphone');
			ajax_gettoken.done(function(json) {
				if(json.code > 0){
					alert(json.msg);
					return;
				}
				token = json.token;
				telphone = json.telphone || '';
				if(telphone != '') {
					//TODO 已有手机号领取
					render.getted(telphone);
				}
			})
		}
	}

	getbtn.click(function() {
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
			mask.on('click', function() {
				mask.off('click');
				mask.css('display','none').css('opacity','0');;
			})
			render.getted(telNo());
		});
	})
})