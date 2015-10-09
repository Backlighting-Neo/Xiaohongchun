var _BackLighting = {
  limitless: function(height_th, callback) {
    window.onscroll = function() {
      if (document.body.scrollHeight - document.body.scrollTop - window.innerHeight < height_th) {
        callback();
      }
    };
  },
  
  template: function(t, p) {
    if (p) {
      for (var i in p) t = t.replace('{' + i + '}', p[i]);
    }
    return t;
  },

  notification: function(params) {
    params = params ? params || {
      icon:'',
      text:'',
      postion:'top-left',
      duration:2000,
      callback:function(){}
    };

    console.log(params);
  }
  
}