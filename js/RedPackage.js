$(function(){
	var item = $('.item');
	var owl  = $('.owl');
	var popup = $('#mask');
	var button = $('#gettingButtonLong,#gettingButtonShort');
	var button2 = $('#gettedButtonLong,#gettedButtonShort');
	var getbtn = $('#gettingButton');
	
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
				popup.css('display','')
				setTimeout(function() {
					popup.css('opacity','1');
				},0);
			})
		},
		getted: function() {
			button2.show();
			button.hide();
			button.off('click');
		}
	}

	// TODO ajax here 判断是否已领过 传入code
	render.unget();
	// render.getted();

	getbtn.click(function() {
		popup.on('click',popup,function() {
			popup.css('opacity','0')
			setTimeout(function() {
				popup.css('display','none');
			},400);
		})
	})
})