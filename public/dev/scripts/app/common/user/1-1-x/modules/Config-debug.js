define(function(require, exports, module) {
   'use strict';
   var $ = require('jquery@1-11-x');

   var defaultUrsConfig = {
		skin: 1,// 皮肤
		product: 'bobo', // 产品ID
		promark: 'rGTXaLY',// 组件ID
		host: 'bolo.163.com',// 组件所在域名
		//cookieDomain : 'bobo.com',
		//regCookieDomain: 'bobo.com',
		domains: '163.com',
	   regDomains: '163.com',
		page: 'login',// 首屏
		includeBox: 'login-URS-iframe',
		single: 0,// 是否只用一个模块，1是，0否
		// errMode : 1,\
	   regPlaceholder:{
		   account: '网易邮箱'
	   },
		needUnLogin: 1,
		notFastReg : 0 ,
		needanimation : 0,
		needPrepare: 1,
		// cssDomain:'http://static.live.netease.com/',
		// cssFiles: 'style/bobo_urs.css',
		cssDomain:'//img4.cache.netease.com/',
		cssFiles: 'liveshow/style/urs/urs.css',
		logincb: function(username, isOther){
			location.href = location.href;
		},
		regcb: function(username){
			location.href = location.href;
		}
   };

	if(/bobo\.com/.test(location.host)){
		$.extend(defaultUrsConfig,{
			cookieDomain : 'bobo.com',
			regCookieDomain: 'bobo.com'
		});
	}

   var getConfig = function(config) {
      return $.extend({}, defaultUrsConfig, config);
   };

   module.exports = {
      getConfig: getConfig
   };
});