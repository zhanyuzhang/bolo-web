/**
 * Created by Dillance on 16/8/19.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		uadetector = require('uadetector@1-0-x'),
		user = require('/common/user/mobile/1-0-x/user'),
		tip = require('/common/uiComponent/mobile/tip@1-0-x');

	if(uadetector.isDevice('pc')) location.href = '/act/share';

	$('.join-btn').tap(function(){
		if(user.isLogin()){
			if(user.userType == 1){
				if(user.shareUserStatus == 1) tip.show('您已成功加入分享计划，请到视频管理平台分享吧！');
				else location.href = '/m/act/share/join';
			}else location.href = '/m/act/share/flow';
		}else user.login();
		//alert('请使用电脑打开此页面加入');
	}); //test



});