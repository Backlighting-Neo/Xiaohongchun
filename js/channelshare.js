$(document).ready(function() {
	var tagsid = mobile.query('tag_id');  //获取最后一个斜线后的tid
	var template = {
		tags: '<div class=\"text\"><div class=\"title\">{name} 频道</div><div class=\"desc\">{nick}创建 {c_cnts}人订阅</div></div><div class=\"share\"><img src=\"images/share.png\"><div>分享</div></div><div class=\"clearfix\"></div>',
		re_tags: '<li><img src=\"{face_url}\" class=\"avatar75\"><div class=\"channel\"><div class=\"title\" onclick=\"location.href=\'http://www.xiaohongchun.com/share_tags/{id}\'\">{name}</div><div class=\"subscribe\">{c_cnts} 订阅</div><div class=\"clearfix\"></div></div><div class=\"clearfix\"></div></li>',
		videos: '<div class=\"videocard\"><div class=\"cover\"><video webkit-playsinline="true" controls=\"controls\" preload=\"none\" width=\"570\" height=\"570\"  id=\"player{id}\" poster=\"{cover_url}\"><source type=\"video/mp4\" src=\"{full_path}\" /></video><div class=\"like\">{likes}</div></div><div class=\"userinfo\"><img class=\"avatar75\" src=\"{icon_url}\"><div class=\"info\"><div class=\"username\">{nick}</div><div class=\"playcount\">{play_count}次播放</div></div><div class=\"clearfix\"></div></div><div class=\"description\">{desc}</div><div class=\"command\"><div class=\"comment\">已有{comment_count}条评论</div><div class=\"share\">分享</div><div class=\"clearfix\"></div></div></div>'
	}
	var visibleVideoCount = 0;
	mobile.share.bind('.channeldetail .share');

	$.getJSON('http://www.xiaohongchun.com/index/tags_share_ajax',
		{tid:tagsid},function(json) {
			document.title = json.data.tags.name + ' - 小红唇';
			// 数据绑定
			var vue = new Vue({
				el: '.content',
				data: json.data
			})
			mobile.avoidEmptyRequest();

			$('.loading').remove();
			$('.content').show();

			// 视频插件
			// mobile.videoplugin(570);

			mobile.adddownloader();// 添加上下的APP下载按钮
			// 评论和分享按钮的APP下载绑定
			mobile.binddownload(['.command .comment','.command .share']);
			mobile.binddownload(['.download', '.footerdownload','.comment']);
	});

	mobile.limitless(100, function() {
		
	})

});