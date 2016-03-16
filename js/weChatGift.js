$(function() {
	var item = $('.item');
	var owl  = $('.owl');
	var getButton1 = $('.getButton1');
	var getButton2 = $('.getButton2');
	var mask = $('.mask');
	var popup = $('.popup');
	var getGiftButton = $('.getGift');
	var result = $('.result');
	var owl_outer = $('.owl_outer');
	var telNo = function() {
		return ($('#telno').val());
	};
	var cs_code = mobile.query('cs_code');
	var token = '';
	var telphone = '';

	if(navigator.userAgent.indexOf('Android')>-1){
		$('.popup').css('margin-top',20);
	}

	var code = mobile.weChat.getCode('snsapi_userinfo');
	if(code == 'redirect'){return};

	if(code == 'Not in Wechat') {
		alert('请在微信浏览器中打开');
		location.href = 'http://www.xiaohongchun.com';
		return;
	}

	if(cs_code==null) {
		alert('红包编号错误');
		location.href = 'http://www.xiaohongchun.com';
		return;
	}

	var randomColor = function (){
		var border_color = ['764c4e', 'ff656c', 'fbc400'];
    var id =  Math.floor(Math.random() * (border_color.length+1));
    return ('#'+border_color[id]);
	}

	// 渲染底部owl商品列表
	
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

				for (var i = item.length - 1; i >= 0; i--) {
					item[i].style['border-color'] = randomColor();
				};
			}
		})
	})


	var showPopup = function() {
		mask.show();
	}

	var hidePopup = function() {
		mask.hide();
	}

	var renderGeted = function(tel, price) {
		mask.hide();
		$('#img').attr('src','images/weChatGift_backGround_2x.jpg');
		result.show();
		$('.telNo').html(tel);
		sessionStorage.weChatCode_Gift118_token = token;
		sessionStorage.weChatCode_Gift118_telphone = tel;
		owl_outer.css('top','1165px');
		$('#img_gB1').attr('src', 'images/weChatGift_getted.png');
		$('#img_gB2').attr('src', 'images/weChatGift_goToStore.png');
		$('#c_price').html(price);
		getButton1.off('click');
		getButton2.off('click');
		getButton2.on('click', function() {
			location.href = 'http://static.xiaohongchun.com/store/list.html';
		})
	}

	var getGift = function(tel) {
		// TODO ajax 请求领红包

		var ajax_getGift = $.getJSON(package_url + '/oauth/weixin/'+token+'/coupons/'+cs_code);
		ajax_getGift.done(function(json) {

			if(json.code > 0){
				alert(json.msg);
				return;
			}
			else {
				renderGeted(tel, json.data.c_price);
			}
		})
	}

	getButton1.on('click', showPopup);
	getButton2.on('click', showPopup);

	mask.on('click', hidePopup);

	popup.click(function(event) {
    event.stopPropagation();
  });

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
			sessionStorage.weChatCode_w_token = token;
			sessionStorage.weChatCode_w_telphone = telphone;
			if(telphone != '') {
				//TODO 已有手机号领取
				getGift(telphone);
			}
		}
	}

  if(sessionStorage.weChatCode_Gift118_token){
  	handler({
  		code: 0,
  		token: sessionStorage.weChatCode_w_token,
  		telphone: sessionStorage.weChatCode_w_telphone
  	})
  }
  else{
  	$.getJSON(package_url+'/oauth/weixin/'+code+'/telphone', handler);
  }

  getGiftButton.bind('touchstart', function() {
  	var tel = telNo();
  	if(!/^[1][358][0-9]{9}$/.test(tel)){
  		alert('输入的手机号格式不对哦~');
  		$('#telno').val('');
  		return;
  	}
  	var ajax_changeTelphone = $.getJSON(package_url + '/oauth/weixin/'+token+'/telphone/'+tel);
  	ajax_changeTelphone.done(function(json) {
  		console.log(json.data.success);
  		if(json.data.success != true){
  			alert('修改手机号失败');
  		}
  		getGift(tel);
  	})
  });

  $('.editTelNo').on('click', showPopup);

  $('.loading').hide();
  $('.content').show();
  $('body').css('background-color', '#6e0006');

  var smallimage = 'images/weChatGift_20151215.png';
  var content = '便宜有好货，真人视频分享，小红唇只卖口碑王。 ';
  var link = 'http://' + location.host + location.pathname + '?cs_code=' + cs_code;
  mobile.appendAppShare(smallimage,content);
  mobile.weChat.bindWeChatShare({
		title: document.title,
		desc: content,
		link: link,
		imgUrl: smallimage
	})
})