(function() {
	var start = function() {
		mobile.adddownloader();
		mobile.binddownload(['download', 'footerdownload']);

		var vid = mobile.query('vid');
		var baseurl = 'http://www.xiaohongchun.com'
		var ajax = {};
		ajax.detail = $.ajax({
	    url: baseurl + '/api2/video/get_video_info',
	    type: 'POST',
	    dataType: 'html',
	    data: {vid: vid}
		});

		ajax.other = $.ajax({
	    url: baseurl + '/index/video_other_get',
	    type: 'GET',
	    dataType: 'html',
	    data: {vid: vid}
		});

		// 记着把这行删了
		vid = 16376;

		ajax.goods = $.getJSON(window.baseurl + '/goods/video/' + vid);

		$.when(ajax.detail, ajax.other, ajax.goods).done(function(detail, other, goods) {
			detail = JSON.parse(detail[0].replace(/\n/g,'<br/>').replace(/\r/g,'')).data;
			other = JSON.parse(other[0].replace(/\n/g,'<br/>').replace(/\r/g,'')).data[0];

			detail.comments_detail = other.comments_detail;
			detail.recommend_videos = other.recommend_videos;

			var data = detail;
			data.goods = goods[0].data;

			data.tags.forEach(function(item) {
				data.vdesc = data.vdesc.replace('#'+item.name+'#','<span class="tags" onclick="location.href=\'http://static.xiaohongchun.com/channel/index.html?tag_id='+item.id+'\'">'+item.name+'</span>')
			});

			var detail_vue = new Vue({
				el: 'body',
				data: data
			})

			mobile.videoplugin();
		});

		$('#tab-recommand, #tab-comment').click(function() {
			console.log(this.id);

		})
	};

	window.onload = start;
})()