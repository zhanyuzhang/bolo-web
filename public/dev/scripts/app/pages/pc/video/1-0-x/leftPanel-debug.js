/**
 * Created by Dillance on 16/8/4.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('jquery@1-11-x'),
		user = require('/common/user@1-0-x'),
		QRCode = require('qrcode@1-0-x'),
		userEditor = require('/pages/pc/video/1-0-x/modules/userEditor');

	var $container = $('.side-panel-container'),
		$shareMyPageBox = $container.find('.share-box');

	$shareMyPageBox.mouseenter(function(){
		var $qrWrap = $shareMyPageBox.find('.qr-box .content');
		$shareMyPageBox.addClass('hover');
		if(!$shareMyPageBox.data('qrcode')){
			$shareMyPageBox.data('qrcode',new QRCode($qrWrap.get(0), {
				text: $shareMyPageBox.find('input').val() + '&sourceFrom=qr',
				width: $qrWrap.width(),
				height: $qrWrap.height(),
				colorDark : "#000000",
				colorLight : "#ffffff",
				correctLevel : QRCode.CorrectLevel.H
			}));
		}
	}).mouseleave(function(){
		$shareMyPageBox.removeClass('hover');
	}).find('.p-item').click(function(){
		var $this = $(this),
			$parent = $this.parents('.share-box'),
			url = $parent.find('input').val();

		if($this.hasClass('weibo')){
			window.open('http://v.t.sina.com.cn/share/share.php?title=' + encodeURIComponent('马上来看@' + user.nickName + ' 全集视频 @网易菠萝菌') + '&pic=' + encodeURIComponent(user.avatar) + '&url=' + encodeURIComponent(url + '&sourceFrom=wb'));
		}else if($this.hasClass('qzone')){
			window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + encodeURIComponent(url + '&sourceFrom=qz') + '&title=' + encodeURIComponent('#网易菠萝#') + '&desc=' + encodeURIComponent('马上来看@' + user.nickName + ' 全集视频') + '&pics=' + encodeURIComponent(user.avatar));
		}else if($this.hasClass('qq')){
			window.open('http://connect.qq.com/widget/shareqq/index.html?url=' + encodeURIComponent(url + '&sourceFrom=qq') + '&title=' + encodeURIComponent('#网易菠萝#') + '&desc=' + encodeURIComponent('马上来看@' + user.nickName + ' 全集视频') + '&pics=' + encodeURIComponent(user.avatar));
		}else if($this.hasClass('baidu')){
			window.open('http://tieba.baidu.com/f/commit/share/openShareApi?url=' + encodeURIComponent(url + '&sourceFrom=ba') + '&title=' + encodeURIComponent('马上来看@' + user.nickName + ' 全集视频') + '&pic=' + encodeURIComponent(user.avatar))
		}
	});

	if(!user.isLogin()){
		$('.login-btn').click(function(){
			user.login();
		});
		$('.to-console-btn').click(function(){
			user.login();
			return false;
		});
	}else{
		$('.exit-btn').click(function(){
			user.logout(location.protocol + '//' + location.host + '/video/upload');
		});
	}

	if(user.isLogin()) userEditor.init();
	$container.find('.avatar').click(function(){
		if($(this).hasClass('pointer')) userEditor.show();
	});
	$container.find('.edit-icon').click(function(){
		userEditor.show();
	});


});