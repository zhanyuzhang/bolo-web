/**
 * @description：
 * @author: maoyh(maoyh@corp.netease.com)
 * wiki: http://doc.hz.netease.com/pages/viewpage.action?pageId=53580199
 */
define(function(require, exports, module) {
    'use strict';
    var $ = require("zepto@1-1-4");
    var defaultConfig = {
        skin: 1, // 皮肤
        product: 'bobo', // 产品ID
        promark: 'rGTXaLY', // 组件ID
        host: 'bolo.163.com', // 组件所在域名
        //cookieDomain: 'bobo.com',
        //regCookieDomain: 'bobo.com',
        domains: '163.com',
	    regDomains: '163.com',
        page: 'login',
        includeBox: 'login-urs-block',
        single: 0, // 是否只用一个模块，1是，0否
        needUnLogin: 0,
        notFastReg: 0,
        needanimation: 0,
        needPrepare: 1,
        gotoRegText: '新用户注册',
        placeholder: {
            account: '网易邮箱/手机号',
            pwd: '登录密码'
        },
        cssDomain: '//img4.cache.netease.com',
        cssFiles: '/bobo/release/styles/mobile/pages/user/1-1-x/urs_a8296e9caa.css',
        logincb: function(username, isOther) {
            location.reload();
        },
        regcb: function(username) {
            location.reload();
        }
    };

	if(/bobo\.com/.test(location.host)){
		$.extend(defaultConfig,{
			cookieDomain : 'bobo.com',
			regCookieDomain: 'bobo.com'
		});
	}

    var isLoad = false,
        getScript = function(src, callback) {
            var script = document.createElement('script');
            script.async = 'async';
            script.src = src;
            callback && (script.onload = callback);
            document.querySelector('head').appendChild(script);
        };

    module.exports = function(config) {
        var createFun = function() {
            isLoad = true;
            typeof URS == 'function' && new URS($.extend({}, defaultConfig, config || {}));
        };
        
        isLoad ? createFun() : getScript('https://webzj.reg.163.com/webapp/javascript/message.js?v=20160823', createFun);
    };
});
