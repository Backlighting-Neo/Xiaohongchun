$(document).ready(function() {
	var videoobj;
	// 如果页面中出现多视频则有可能产生问题
	mobile.videoplugin(750,function(e){
		videoobj = e;
	});

	$(".product-rolling").owlCarousel({
	  slideSpeed: 300,
	  paginationSpeed: 400,
	  singleItem: true,
	  afterMove: function() {
	  	if(videoobj) videoobj.pause();	// 切换页面后暂停视频
	  }
	});

	$(".rolling").owlCarousel({
		pagination:false,
		allowimperfect:true,	// 允许一行内显示一个不完整的item
		customWidth:632				// 两倍的card宽度
		// 以上两个属性是我在owl.carousel.js中新增的
	})

});