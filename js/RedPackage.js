$(function(){
	var item = $('.item');
	var owl  = $('.owl');
	var mask = $('#mask');
	var popup = $('.popup');
	var success = $('.success');
	var button = $('#gettingButtonLong,#gettingButtonShort');
	var button2 = $('#gettedButtonLong,#gettedButtonShort');
	var getbtn = $('#gettingButton');
	var telNo = function() {
		return ($('#telno').val());
	};
	var inapp = mobile.inApp();
	
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

	var render = {
		unget: function() {
			button.show();
			button2.hide();
			button.on('click', function() {
				if(inapp){
					$('body').appned('<iframe src="" height=0 ></iframe>')
				}
				else {
					mask.css('display','')
					setTimeout(function() {
						mask.css('opacity','1');
					},0);
				}
			})
		},
		getted: function(telNo) {
			button2.show();
			button.hide();
			button.off('click');
			$('.telNo').html(telNo);
			$('.getsuccess').show();
		}
	}

	// TODO ajax here 判断是否已领过 传入code
	render.unget();
	// render.getted();

	getbtn.click(function() {
		if(!/^[1][358][0-9]{9}$/.test(telNo())){
			alert('输入的手机号格式不对哦~');
			$('#telno').val('');
			return;
		}
		// TODO ajax 向手机号中注入红包，并将openID和TelNo绑定
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