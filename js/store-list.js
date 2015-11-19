(function() {
	var start = function() {
		var ajax_banner = $.getJSON(baseurl+'/goods/banner');
		var ajax_list   = $.getJSON(baseurl+'/goods');

		$.when(ajax_banner, ajax_list).done(function(data_banner, data_list) {
			var pagedata = {
				banner: data_banner[0].data,
				data:   data_list[0].data
			};

			var vue_page = new Vue({
				el: 'body',
				data: pagedata
			})
			mobile.avoidEmptyRequest();

		})
	}

	window.onload = start;
})()