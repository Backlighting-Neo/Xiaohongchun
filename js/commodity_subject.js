    var start = function() {
        //var appid = 'wx3d7f899c6405a785';
        // AppId
        //var fileName = mobile.query('file');
        $.getJSON(goods +'/subject_20151215.json',function(res){

            var pagedata = {
                goods: res[0]['goods']
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
        console.log(goods);
        start();
    });