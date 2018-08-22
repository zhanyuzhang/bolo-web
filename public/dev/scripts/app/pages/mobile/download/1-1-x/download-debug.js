/**
 * Created by gztimboy on 2016/8/29 0029.
 */

define(function(require, exports, module) {
    'use strict';
    var $ = require('zepto@1-1-4'),
        Tmpl = require('tmpl@2-1-x'),
        Stat = require('/common/Stat@1-0-x'),
        uadetector = require('uadetector@1-0-x'),
        user = require('/common/user/mobile/1-0-x/user'),
        qs = require('querystring@1-0-x'),
        native = require('/common/native@1-0-x');


    $(function () {
        var $downloadGuide = $('.download-guide');
        var QUERY = qs.parse();
        // 判断是否为自定义下载页
        var customInfo = (QUERY.bg && uadetector.isOS('android')) ? BACKGROUND_INFO.filter(function (info) {
            return info.subTitle === QUERY.bg;
        })[0] : null;

        // 自定义下载页
        if(customInfo) {
            $('.download-cnt-1').css({backgroundImage: 'url(' + customInfo.url + ')'});
            $('.download-cnt-text').hide();

            $('.download-cnt-1, .download-bar').tap(function (e) {
                Stat.send('download_all');
                if(uadetector.is('MicroMessenger')) {
                    $downloadGuide.show();
                    return;
                }
                location.href = customInfo.pic;
            });
            $downloadGuide.tap(function() {
                $downloadGuide.hide();
            });

        // 通用下载页
        } else {
            $('.download-bar .btn ,.download-cnt-text .btn').tap(function(e) {
                Stat.send('download_all');
                native.download();
            });
            $('.download-cnt-text .btn2').tap(function(e){
                var url = $(this).data('href');
                if(!user.isLogin()){
                    user.login(url);
                }else location.href = url;
            });
        }
    });

});

