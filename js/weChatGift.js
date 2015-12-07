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


	
	var randomColor = function (){
		var border_color = ['764c4e', 'ff656c', 'fbc400'];
    var id =  Math.floor(Math.random() * (border_color.length+1));
    return ('#'+border_color[id]);
	}

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

	var showPopup = function() {
		mask.show();
	}

	var hidePopup = function() {
		mask.hide();
	}

	var getGift = function() {
		var tel = telNo();
		if(!/^[1][358][0-9]{9}$/.test(tel)){
			alert('输入的手机号格式不对哦~');
			$('#telno').val('');
			return;
		}
		// TODO ajax 请求领红包

		// 成功后
		mask.hide();
		$('#img').attr('src','images/weChatGift_backGround_2x.jpg');
		result.show();
		$('.telNo').html(tel);
		owl_outer.css('top','1165px');
		$('#img_gB1').attr('src', 'images/weChatGift_getted.png');
		$('#img_gB2').attr('src', 'images/weChatGift_goToStore.png');
	}

	getButton1.on('click', showPopup);
	getButton2.on('click', showPopup);

	mask.on('click', hidePopup);

	popup.click(function(event) {
    event.stopPropagation();
  });

  getGiftButton.on('click', getGift);

  $('.editTelNo').on('click', showPopup);

  $('.loading').hide();
  $('.content').show();
  $('body').css('background-color', '#6e0006');
})