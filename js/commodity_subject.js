    var start = function() {
        var appid = 'wx3d7f899c6405a785';
        // AppId
        var fileName = mobile.query('file');
        var ajax_banner = $.getJSON(baseurl+'/goods/banner');
        var ajax_list   = $.getJSON(baseurl+'/goods');

        $.when(ajax_banner, ajax_list).done(function(data_banner, data_list) {
            var lastid = 0;

            var pagedata = {
                banner: data_banner[0].data,
                data:   data_list[0].data
            };
            //console.log(data_banner[0].data);
            lastid = data_list[0].data[data_list[0].data.length-1].g_id;

            var vue_page = new Vue({
                el: 'body',
                data: pagedata
            });
            vue_page.$log();
            mobile.avoidEmptyRequest();
            mobile.binddownload(['.download']);
            $('.loading').remove();
            $('.content').show();

            var loadingblock = false;
            mobile.limitless(100, function() {
                if(!loadingblock) {
                    loadingblock = true;

                    var ajax_more = $.getJSON(baseurl+'/goods?g_id='+lastid);
                    ajax_more.done(function(json) {
                        if(json.data.length == 0){
                            $('.store-list-info').html('没有更多商品了');
                            return;
                        }
                        for (var i = 0; i< json.data.length; i++) {
                            pagedata.data.push(json.data[i]);
                        };
                        lastid = json.data[json.data.length-1].g_id;
                        setTimeout(mobile.avoidEmptyRequest,100);
                        // mobile.avoidEmptyRequest();
                        loadingblock = false;
                    })
                }
                else {
                    return;
                }
            })
        })

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
    }

    $(function(){
        start();
    });