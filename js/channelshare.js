$(document).ready(function() {
	mobile.binddownload(['download', 'footerdownload','.comment','']);

	// 正式上线前需要修改这里！
	// var tagsid = mobile.query('#');  //获取最后一个斜线后的tid
	var tagsid = mobile.query('tid');

 	// 载入Tags详情
	$.getJSON(mobile.baseurl() + '/api2/index/tags_share_ajax',
		{tags_id:tagsid},function(json) {
			var dom_temp = '<div class=\"text\"><div class=\"title\">{name} 频道</div><div class=\"desc\">{nick}创建 {c_cnts}人订阅</div></div><div class=\"share\"><img src=\"images/share.png\"><div>分享</div></div><div class=\"clearfix\"></div>';
			var dom = mobile.template(dom_temp,json.data.tags);
			$('.channeldetail').append(dom);
	});

	// $("video").each(function(v,k){
	// 	var width=570,height=570;
	// 	$(k).mediaelementplayer({
	// 		defaultVideoWidth: width,
	// 		defaultVideoHeight: height,
	// 		videoWidth: width,
	// 		videoHeight: height,
	// 		framesPerSecond: 30,
	// 		alwaysShowControls: false,
	// 		features: ['playpause','progress','current','duration','tracks','volume','fullscreen'],
	// 		success: function(me) {
	// 			//alert( me.pluginType);
	// 		}
	// 	});
	// });

});