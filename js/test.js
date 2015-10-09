var template = function(t, p) {
  if (p) for (var i in p) t = t.replace('{' + i + '}', p[i]);
  return t;
};

var notification = function(params) {
  params = params || {
    icon: '',
    text: '',
    position: 'top-left',
    duration: 2000,
    callback: function() {}
  };

  var dom_template = '<div style=\"display:none;height: 48px;width: auto;border-radius: 100px;background: rgba(0,0,0,0.4);padding: 4px 20px 4px 7px;line-height: 48px;font-size: 25px;color: #fff;font-family: \'Microsoft Yahei\';position: fixed;margin: 8px	8px 8px 8px;{position}\"><img src="{icon}\" style=\"width: 48px;height: 48px;border-radius: 100px;float: left;\"><span style=\"float: left;padding-left: 10px;\">{text}</span><div style=\"clear: both;\"></div></div>';
  params.position = params.position
  .replace('-','')
  .replace('left','left:0;')
  .replace('right','right:0;')
  .replace('top','top:0;')
  .replace('bottom','bottom:0;');
  dom_template = $(template(dom_template,params));
  $('body').append(dom_template);
  dom_template.fadeIn();
  setTimeout(function(){
  	dom_template.fadeOut(function(){
  		dom_template.remove();
  		params.callback;
  	});
  }, params.duration);
};

