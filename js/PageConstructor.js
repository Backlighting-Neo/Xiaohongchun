$(document).ready(function() {
  var current_item = '';
  var upload_token = '';
  var token_url = 'http://192.168.2.200:1337';
  var videolist = [];
  var v = $('#v'),
    u = $('#u'),
    e = $('#editzone'),
    h = $('#umeditor'),
    n = $('#event_name'),
    i = $('#event_id'),
    s = $('#s');
  var template = mobile.query('t');
  var downloadFile = function(fileName, content) {
    var aLink = document.createElement('a');
    var blob = new Blob([content]);
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("click", false, false); //initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);
    aLink.dispatchEvent(evt);
  };
  var getRanNum = function() {
    var result = ''
    for (var i = 0; i < 4; i++) {
      var ranNum = Math.ceil(Math.random() * 25);
      result = result.concat(String.fromCharCode(65 + ranNum));

    };
    return result;
  };


  $.get('template/' + template + '.html')
    .error(function() {
      location.href = 'select.html';
    })
    .then(function(html) {
      v.html(html);
    }) // 模板读取
    .then(function() {
      $.getJSON(token_url)
        .error(function() {
          alert('上传模块出现了问题……暂时不能上传图片');
        })
        .then(function(data) {
          upload_token = data.token;
        })
    }) // 上传凭证获取
    .then(function() {
      var result = '';
      for (item in data) {

        if(data[item].type == 'video')
          videolist.push(data[item]);

        var template = ({
          text: '<div class="form-group"><label for="{item}">{cname}</label><input type="{type}" v-model="{model}" class="form-control" value="{value}" /></div>',
          html: '<div class="form-group"><label for="{item}">{cname}</label><button type="button" class="btn btn-default html_edit_button" data-item="{item}">点击编辑</button><input type="text" v-model="{model}" class="form-control nodisplay" value="{value}" /><span class="brief">{brief}</span></div>',
          image: '<div class="form-group"><label for="{item}">{cname}</label><input type="text" v-model="{model}" class="form-control" value="{value}" /></div><div class="form-group"><div class="col-md-8"><input type="file" class="form-control" id="uploader_{item}" accept="image/*"/></div><div class="col-md-4"><button type="button" class="btn btn-primary upload_image_button" data-item="{item}">上传图片</button></div><div class="clearfix"></div></div>',
          video: '<div class="form-group"><label for="{item}">{cname}</label><div class="clearfix"></div><div class="col-md-8"><input type="text" v-model="{model}" class="form-control" value="{value}" id="video_{item}"/></div><div class="col-md-4"><button type="button" data-item="{item}" class="btn btn-primary video_change_button">确定</button></div><div class="clearfix"></div></div>'
        })[data[item].type];

        result = result.concat(
          template.replace(/{item}/g, item)
          .replace('{cname}', data[item].cname)
          .replace('{type}', data[item].type)
          .replace('{value}', '{{' + item + '.value}}')
          .replace('{model}', item + '.value')
          .replace('{brief}', '( {{' + item + '.value.replace(/<.*?>/,\'\').substring(0,10)}} )')
        );
      };
      e.append(result);
    }) // 编辑控件渲染
    .then(function() {
      $('.html_edit_button').click(function() {
        e.hide();
        h.show();
        var item = $(this).attr('data-item');
        um.setContent(data[item].value);
        current_item = item;
      });
      $('#html_edit_ok').click(function() {
        e.show();
        h.hide();
        data[current_item].value = um.getContent();
      });
      $('#html_edit_cancle').click(function() {
        e.show();
        h.hide();
      });
      $('.upload_image_button').click(function() {
        var item = $(this).attr('data-item');
        var file = document.getElementById('uploader_' + item).files.item(0);

        var event_name = n.val();
        var event_id = i.val();
        if (!event_name || !event_id) {
          alert('请先填写活动名称和活动标识');
        } else if (!upload_token) {
          alert('上传模块出现了问题……暂时不能上传图片\n可以刷新试试哦\n不过刷新之前记得保存哦');
        } else if (!file) {
          alert('还没有选择图片哦亲');
        } else {
          var extname = file.type.replace('image/', '').replace('jpeg', 'jpg');
          var formData = new FormData();
          var key = 'event/image/' + event_id + '_' + item + '_' + Date.parse(new Date()) + '.' + extname;
          formData.append('file', file);
          formData.append('token', upload_token);
          formData.append('key', key);
          $.ajax({
            url: 'http://upload.qiniu.com', //server script to process data
            type: 'POST',
            data: formData,
            cache: false,
            contentType: false,
            processData: false
          }).then(function(json) {
            data[item].value = 'http://static.xiaohongchun.com/' + key;
          });
        }
      });

      $('.video_change_button').click(function() {
        var item = $(this).attr('data-item');
        $.ajax({
          url: 'http://www.xiaohongchun.com/api2/video/get_video_info',
          type: 'POST',
          data: {
            vid: $('#video_' + item).val()
          }
        }).then(function(json) {
          json = $.parseJSON(json);
          if (json.code == 0) {
            var poster = json.data.cover_url;
            var video = json.data.full_path;
            data[item].video = video;
            data[item].poster = poster;
          } else {
            alert(json.msg);
          }
          // video.load()方法只在touch事件中调用才有效，这里调用无效
          // var video = 
          // for (var i = video.length - 1; i >= 0; i--) {
          // 	video[i].load();
          // };
        })
      })
    }) // 编辑控件绑定
    .then(function() {
      var vuev = new Vue({
        el: '#v',
        data: data
      });
      var vuee = new Vue({
        el: '#e',
        data: data
      });
      v.width(viewport+15);
    }); // VUE绑定

  $('#generateH5').click(function() {
    var html = v.html();
    var event_name = n.val();
    if (event_name) {
      html = html.replace(/<script>(.|\n)*?<\/script>/g, '');
      for (var i = videolist.length - 1; i >= 0; i--) {
        html = html + '<script>mobile.videoplugin('+(videolist[i].size+'')+',\''+videolist[i].selector+'\');</script>';
      };
      html = html + '<script type=\"text/javascript\">var _hmt = _hmt || [];(function() {  var hm = document.createElement(\"script\");  hm.src = \"//hm.baidu.com/hm.js?c431a03831df8d00747aa6a0c0d5c17d\";  var s = document.getElementsByTagName(\"script\")[0];  s.parentNode.insertBefore(hm, s);})();var img=new Image();img.src=\"http://static.xiaohongchun.com/params?share=1&img='+encodeURIComponent(data.shareimage.value)+'&content='+encodeURIComponent(data.share.value)+'&tick=\" + Date.now(); </script>';
      var result = '<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width='+(viewport?viewport:750+'')+'\"><meta name=\"apple-mobile-web-app-capable\" content=\"yes\"><meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black\"><meta name=\"format-detection\" content=\"telephone=no\"><meta name=\"description\" content=\"小红唇是小白学化妆神器，让你10秒学会化妆，最快速度找到适合你的化妆品\"><title>' + event_name + '</title></head><body>' + html + '</body></html>';
      downloadFile(event_name + '.html', result);
    } else {
      alert("还没有填活动名称哦亲");
    }
  });

  $('#upload').click(function() {
    var event_name = n.val();
    var event_id = i.val();
    if (!event_name || !event_id) {
      alert('请先填写活动名称和活动标识');
    } else if (confirm('确定要上传这个H5吗？')) {
      v.hide();
      u.show();
      var html = v.html();
      html = html.replace(/<script>(.|\n)*?<\/script>/g, '');
      for (var a = videolist.length - 1; a >= 0; a--) {
        html = html + '<script>mobile.videoplugin('+(videolist[a].size+'')+',\''+videolist[a].selector+'\');</script>';
      };
      html = html + '<script type=\"text/javascript\">var _hmt = _hmt || [];(function() {  var hm = document.createElement(\"script\");  hm.src = \"//hm.baidu.com/hm.js?c431a03831df8d00747aa6a0c0d5c17d\";  var s = document.getElementsByTagName(\"script\")[0];  s.parentNode.insertBefore(hm, s);})();var img=new Image();img.src=\"http://static.xiaohongchun.com/params?share=1&content='+data.share.value+'&tick=\" + Date.now(); </script>';
      html = '<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\" /><meta name=\"viewport\" content=\"width='+(viewport?viewport:750+'')+'\" /><meta name=\"apple-mobile-web-app-capable\" content=\"yes\" /><meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black\" /><meta name=\"format-detection\" content=\"telephone=no\" /><meta name=\"description\" content=\"小红唇是小白学化妆神器，让你10秒学会化妆，最快速度找到适合你的化妆品\" /><title>' + event_name + '</title></head><body>' + html + '</body></html>';

      var blob = new Blob([html], {
        "type": "text\/html"
      });
      var formData = new FormData();
      var key = 'event/' + event_id + '_' + getRanNum() + '.html';
      formData.append('file', blob);
      formData.append('token', upload_token);
      formData.append('key', key);
      $.ajax({
        url: 'http://upload.qiniu.com',
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false
      }).then(function(json) {
        v.show();
        u.hide();
        e.hide();
        s.show();
        var url = 'http://static.xiaohongchun.com/' + json.key;
        $('#h5_url').html(url);
        $('#h5_access').click(function() {
          window.open(url);
        });
      });
    }
  })

  var um = UM.getEditor('Editor');

});
