$(document).ready(function() {
	// 添加上下的APP下载按钮
	mobile.adddownloader();

	// 下载按钮绑定
	mobile.binddownload(['download', 'footerdownload','.comment']);

	var tagsid = mobile.query('tag_id');  //获取最后一个斜线后的tid

	$.getJSON(mobile.baseurl + '/index/tags_share_ajax',
		{tid:tagsid},function(json) {

			// 载入频道详情
			mobile.renderdom('.channeldetail',json.data.tags,'single',
				'<div class=\"text\"><div class=\"title\">{name} 频道</div><div class=\"desc\">{nick}创建 {c_cnts}人订阅</div></div><div class=\"share\"><img src=\"images/share.png\"><div>分享</div></div><div class=\"clearfix\"></div>'
			)

			// 分享绑定
			mobile.share.bind('.channeldetail .share');

			// 载入热门频道
			mobile.renderdom('.hotchannelol',json.data.re_tags,'loop',
				'<li><img src=\"{face_url}\" class=\"avatar75\"><div class=\"channel\"><div class=\"title\" onclick=\"location.href=\'http://www.xiaohongchun.com/share_tags/{id}\'\">{name}</div><div class=\"subscribe\">{c_cnts} 订阅</div><div class=\"clearfix\"></div></div><div class=\"clearfix\"></div></li>'
			)

			// 载入视频列表
			var type = navigator.userAgent.indexOf('Mac')>-1?'pre6':'pre3';
			mobile.renderdom('.videolist',json.data.videos,type,
				'<div class=\"videocard\"><div class=\"cover\"><video controls=\"controls\" preload=\"none\" width=\"570\" height=\"570\"  id=\"player{id}\" poster=\"{cover_url}\"><source type=\"video/mp4\" src=\"{full_path}\" /></video><div class=\"like\">{likes}</div></div><div class=\"userinfo\"><img class=\"avatar75\" src=\"{icon_url}\"><div class=\"info\"><div class=\"username\">{nick}</div><div class=\"playcount\">{play_count}次播放</div></div><div class=\"clearfix\"></div></div><div class=\"description\">{desc}</div><div class=\"command\"><div class=\"comment\">已有{comment_count}条评论</div><div class=\"share\">分享</div><div class=\"clearfix\"></div></div></div>'
			)

			// 视频插件
			mobile.videoplugin(570);

			// 评论和分享按钮的APP下载绑定
			mobile.binddownload(['.command .comment','.command .share']);
	});
});