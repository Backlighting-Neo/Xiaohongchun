(function() {
	var start = function() {
		var rankingli_creator = function(p) {
			var template = '<li><div class="rd r_id">{id}</div><div class="rd r_avatar"><img src="{avatar}" class="avatar"></div><div class="rd r_username">{username}</div><div class="rd r_{updown}"></div><div class="rd r_increment">{increment}</div><div class="rd r_remeneration">{remeneration}</div><div class="clearfix"></div></li>';
			template = template.replace('{id}', p.id);
			template = template.replace('{avatar}', p.avatar);
			template = template.replace('{username}', p.username);
			template = template.replace('{updown}', p.updown.concat((p.id <= 3 && p.updown != 'stay') ? '_specail' : ''));
			template = template.replace('{increment}', p.increment);
			template = template.replace('{remeneration}', p.remeneration);
			return (template);
		}

		var ajaxhandle = function(json) {
			var rankingdom = '';
			for (var counter = 0; counter < json.length; counter++) {
				rankingdom = rankingdom.concat(rankingli_creator(json[counter]));
			};
			document.getElementById('rankingol').innerHTML = rankingdom;
		};

		ajax.request({
			url: 'data.json',
			params: {},
			type: 'json',
			callback: ajaxhandle
		});

	}
	window.onload = start;
})();