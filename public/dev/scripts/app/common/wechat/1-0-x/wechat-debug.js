/**
 * Created by Chess on 16/10/10.
 */
define(function(require, exports, module) {
    'use strict';
    var $ = require('zepto@1-1-4');
    var Promise = require('promise@1-0-x');
    var wx = require('jweixin@1-0-x');

    var eventTypes = [
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'onMenuShareQZone'
    ];

    /**
     * @method getSignature: 通过ajax请求获取签名
     **/
    function getSignature() {
        return new Promise(function (resolve, reject) {
            var url = '//bolo.163.com/bolo/api/wechat/getJsApiSignature.htm?url=' + encodeURIComponent(location.href.split('#')[0]);
            $.ajax({
                url: url,
                dataType: "jsonp",
                jsonpCallback:"getJsApiSignature",
                success: function(data) {
                    resolve(data);
                },
                error: function(){
                    reject("获取签名失败！");
                }
            });
        });
    }

    /**
     * @method initConfig:  初始化jssdk的权限验证配置
     * @param config: 配置对象，调用getSignature()之后，由后台返回的
     **/
    function initConfig(config) {
        // 通过config接口注入权限验证配置
        wx.config({
            // debug: true,
            appId: config.appid,
            timestamp: config.timestamp,
            nonceStr: config.noncestr,
            signature: config.signature,
            jsApiList: eventTypes.slice(0)
        });
        // 监听错误
        wx.error(function (res) {
            alert(res.errMsg);
        });
    }

    /**
     * @method onMenuShare：设置分享信息
     * @params shareInfo，分享配置对象，它包含下列10个属性:
     *    title: 分享标题
     *    desc: 分享描述
     *    link: 分享链接
     *    imgUrl: 分享图标
     *    type: 分享类型,music、video或link，不填默认为link
     *    dataUrl: 如果type是music或video，则要提供数据链接，默认为空
     *    success: 分享成功时的回调函数
     *    cancel: 取消分享时的回调函数
     *    fail: 分享失败时的回调函数
     **/
    function onMenuShare(shareInfo) {
        wx.ready(function () {
            eventTypes.forEach(function (event) {
	            var data = $.extend(true, {}, shareInfo);
	            if(shareInfo[event]) {
		            $.extend(data, shareInfo[event]);
	            }
				wx[event]({
					title: data.title,
					desc: data.desc,
					link: data.link,
					imgUrl: data.imgUrl,
					type: data.type || 'link',
					dataUrl: data.dataUrl || null,
					success: function (res) {
						data.success && data.success(res);
					},
					cancel: function (res) {
						data.cancel && data.cancel(res);
					},
					fail: function (res) {
						data.fail && data.fail(res);
					}
				});
            });
        });
    }

    /**
     * @method share：分享接口
     * @params shareInfo，和onMenuShare()的参数一样
     **/
    exports.share = function(shareInfo) {
        return getSignature().then(function (res) {
            initConfig(res.data);
            onMenuShare(shareInfo);
            return res;
        }, function (err) {
            alert(err);
        });
    };

});