    var start = function() {
        //var appid = 'wx3d7f899c6405a785';
        // AppId
        var fileName = mobile.query('file');
        //$.getJSON(goods + '/' + fileName,function(res){
        var ok = 'http://localhost:63342/xhc_frontend/config';
        $.getJSON(ok + '/' + fileName,function(res){
            var pid = '';
            var len = res[0]['goods'].length;
            for(var i = 0 ; i < len ; i++){
                pid += res[0]['goods'][i]['pid'] + ',';
            }
            var rpid = {
                g_ids:pid.substring(0,pid.length-1)
            };
            console.log(rpid);
            //todo 通过所有pid请求接口拿到title、price、img
            $.get('http://test1.xiaohongchun.com/goods',rpid,function(data){
                var goodsLj = data['data'].length;  // Interface goods number
                var goodsLa = res[0]['goods'].length;

                var cursor = 0;

                for(var i = 0 ; i< goodsLj ; i++){

                    var gid = data['data'][i]['g_id'];


                    for(var j = cursor ; j < goodsLa ; j++){

                        if( gid = res[0]['goods'][j]['pid']){

                            data.data[i].pdesc = res[0].goods[j].pdesc;
                            data.data[i].sellingPiont = res[0].goods[j].sellingPiont;

                            cursor = j;
                            break;
                        }
                    }
                }
                var pagedata = {
                    headerImg:res[0]['headerImg'],
                    desc:res[0]['desc'],
                    goods: data['data']
                };

                var vue_page = new Vue({
                    el: 'body',
                    data: pagedata
                });

                vue_page.$log();
                mobile.avoidEmptyRequest();
                mobile.binddownload(['.download']);
                $('.loading').remove();
                $('.content').show();
            });

        });

        mobile.weChat.bindWeChatShare({
            title: '小红唇商城-美妆达人视频同款',
            desc: '只选人气NO.1的口碑产品！正品低价，全球采买！',
            link: location.href,
            imgUrl: 'http://static.xiaohongchun.com/store/images/share_icon.png',
            type: 'link'
        });

        if(!(window.inapp && window.inapp==1)){
            $('.top').remove();
        }
    };

    $(function(){
        start();
    });