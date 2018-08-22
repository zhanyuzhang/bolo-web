/**
 * Created by Dillance on 16/5/12.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		user = require('/common/userMobile/1-0-x/User'),
		native = require('/common/native@1-0-x');

	var userInfo;
	native.call('getLoginInfo',function(result){
		userInfo = result;
	});

	var $wrapper = $('.wrapper');

	var $submitBtn = $('.submit-btn');
	$submitBtn.tap(function(){
		if($submitBtn.hasClass('loading')) return;
		$submitBtn.focus();

		var data = {};
		var url;

		var errorList = $('.input-item').map(function(){
			var $thisInput = $(this).find('input');
			if(!$thisInput.val()){
				$thisInput.addClass('error');
				return $thisInput;
			}else if($thisInput.attr('name') == 'phone' && $thisInput.val().match(/[^0-9]/)){
				$thisInput.addClass('error');
				alert('请输入正确电话号码');
				return $thisInput;
			}else{
				$thisInput.blur();
				data[$thisInput.attr('name')] = $thisInput.val();
			}
		});

		if(!errorList.length){
			$submitBtn.addClass('loading');
			if(native.hello()){
				url = HttpHelper.getOrigin() + '/bolo/api/user/enterApply';
				$.extend(data,{
					userId: userInfo.userId,
					encryptToken: userInfo.encryptToken || userInfo.encryptedToken,
					timeStamp: userInfo.timeStamp || userInfo.timestamp,
					random: userInfo.random
				});
			}else {
				if(!user.isLogin()) user.login(); // 如果没有登陆则登陆
                url = HttpHelper.getOrigin() + '/bolo/api/web/user/enterApply';
				$.extend(data,{
					userId: user.userId,
					encryptToken: user.token,
					timeStamp: user.timestamp,
					random: user.random
				});
			}

			$.ajax({
				url: url,
				dataType: 'jsonp',
				data: data,
				success: function(data){
					$submitBtn.removeClass('loading');
					if(data.status == 1) {
						$wrapper.hide();
						$('.success-tip').show();
					}else{
						alert(data.msg);
					}
				}
			});
		}
	});

	$('input').focus(function(){
		var $this = $(this);
		if($this.hasClass('error')) $this.removeClass('error');
	});

});