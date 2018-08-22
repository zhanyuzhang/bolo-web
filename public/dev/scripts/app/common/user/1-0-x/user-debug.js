/**
 * Created by Dillance on 16/6/16.
 */
define(function(require, exports, module) {
	'use strict';

	var LoginBox = require('/common/user/1-0-x/modules/LoginBox'),
		//RegBox = require('/common/user/1-0-x/modules/RegBox'),
		base = require('base@1-1-x');

	var userInfo = window.USER_INFO || {};
	//window.USER_INFO = null;

	return base.extend(userInfo,{
		isLogin: function(){
			return !!userInfo.userId;
		},
		login: function(){
			new LoginBox().show();
		},
		logout: function(url){
			window.location.href = "http://reg.163.com/Logout.jsp?product=bobo&url=" + (url || location.href);
		},
		register: function(){
			new LoginBox().show({
				loginType: 'register'
			});
		},
		getInfo:function(){
			return userInfo;
		}
	});

});