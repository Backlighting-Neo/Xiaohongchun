(function() {
	var start = function() {
		var baseurl = 'http://test1.xiaohongchun.com/';

		var ajax_banner = $.ajax(baseurl+'goods/banner');
		var ajax_list   = $.ajax(baseurl+'goods');

		$.when(ajax_banner, ajax_list).done(function(data_banner, data_list) {
			var pagedata = {
				banner: data_banner[0].data,
				data:   data_list[0].data
			};

			var vue_page = new Vue({
				el: 'body',
				data: pagedata
			})

			$('.store-list-banner, .store-list-item').show();
		})
	}

	window.onload = start;
})()