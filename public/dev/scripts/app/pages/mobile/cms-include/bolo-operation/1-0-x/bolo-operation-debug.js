/**
 * Created by Dillance on 16/6/15.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		uadetector = require('uadetector@1-0-x'),
		native = require('/common/native@1-0-x'),
		qs = require('querystring@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		comment = require('/common/uiComponent/mobile/comment@1-0-x');

	setTimeout(function(){
		comment.init();
	},50);

	if(native.hello()){

		$(document).on('tap','a',function(e){
			var href = this.href,
				search = this.search;
			if(href.match(/\/play\?videoId/)){
				native.call('openVideo',{
					videoId: qs.parse(search).videoId
				});
			}else if(href.match(/follow\:/)){
				if(native.isLogin()) follow(href.split(':')[1]);
				else native.call('loginApp');
			}
		}).on('click','a',function(e){
			if(this.href.match(/(\/play)|(follow\:)/)){
				e.preventDefault();
			}
		});
	}

	var following = false;
	function follow(id){
		if(following) return;
		isFollowed(id,function(){
			following = true;
			$.ajax({
				url: HttpHelper.getOrigin() + '/bolo/api/user/follow',
				dataType: 'jsonp',
				data: {
					userId: native.userInfo.userId,
					encryptToken: native.userInfo.encryptToken || userInfo.encryptedToken,
					timeStamp: native.userInfo.timeStamp || userInfo.timestamp,
					random: native.userInfo.random,
					follow: true,
					followedId: id
				},
				success: function(result){
					following = false;
					if(result.status == 1){
						alert('您已关注成功！记得把消息推送设置为打开状态哦！')
					}else{
						alert(result.msg)
					}
				}
			});
		});
	}

	function isFollowed(id,callback){
		following = true;
		$.ajax({
			url: HttpHelper.getOrigin() + '/bolo/api/public/userInfo.htm',
			dataType: 'jsonp',
			data: {
				userId: native.userInfo.userId,
				targetUserId: id
			},
			success: function(result){
				following = false;
				if(result && result.userId){
					if(result.followed) alert('您已经关注过该合伙人啦！记得把消息推送设置为打开状态哦！');
					else callback();
				}else{
					alert('网络异常，请稍后再试')
				}
			}
		});
	}

});