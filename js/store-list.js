(function() {
	var start = function() {
		var appid = 'wx3d7f899c6405a785';
    // AppId

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
			mobile.binddownload(['download']);
		})

		mobile.bindWeChatShare({
			title: '小红唇商城-美妆达人视频同款',
			desc: '只选人气NO.1的口碑产品！正品低价，全球采买！',
			link: location.href,
			imgUrl: 'http://static.xiaohongchun.com/store/images/share_icon.png',
			type: 'link'
			// dataUrl: '',
			// success: function () {},
			// cancel: function () {}
		});

		if(!(window.inapp && window.inapp==1)){
			$('.top').remove();
		}
	}

	window.onload = start;
})()