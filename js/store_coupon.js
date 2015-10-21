var start = function() {
	function $(id){
		return document.getElementById(id);
	}
	var adjust_title = function() {
		var st = document.body.scrollTop;
		$('title').setAttribute("style","margin-top:-"+(st>87?87:st)+"px;");
	}
	window.onscroll = adjust_title;
	adjust_title();

	var vb  = $('validbutton'),
	    ivb = $('invalidbutton'),
	    v   = $('valid'),
	    iv  = $('invalid');
	vb.onclick = function(){
		vb.className = 'left active';
		ivb.className = 'right';
		v.setAttribute('style', 'margin-left:0px');
	};
	ivb.onclick = function(){
		vb.className = 'left';
		ivb.className = 'right active';
		v.setAttribute('style', 'margin-left:-640px');
	};
}

window.onload = start;