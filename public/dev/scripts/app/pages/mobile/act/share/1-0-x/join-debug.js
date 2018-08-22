/**
 * Created by Dillance on 16/8/19.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		uadetector = require('uadetector@1-0-x'),
		tip = require('/common/uiComponent/mobile/tip@1-0-x');

	if(uadetector.isDevice('pc')) location.href = '/act/share';

	var $wrapper = $('.wrapper');

	$wrapper.find('input[type=file]').change(function(){
		var $this = $(this),
			file = this.files[0];
		if(!file.type.match('image')){
			$this.val('');
			tip.show('请选择图片文件');
		}else{
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function(){
				$this.siblings('img').attr('src',this.result).show();
				$this.siblings('.file-input').hide();
			};
		}
	});

	var formData = new FormData();

	$('.submit-btn').click(function(){
		var name = $wrapper.find('[name=name]').val(),
			alipayAccount = $wrapper.find('[name=alipayAccount]').val(),
			phone = $wrapper.find('[name=phone]').val(),
			wechatAccount = $wrapper.find('[name=wechatAccount]').val(),
			IDNumber = $wrapper.find('[name=IDNumber]').val(),
			IDImageFront = $wrapper.find('[name=IDImageFront]').val(),
			IDImageBack = $wrapper.find('[name=IDImageBack]').val(),
			agreeChecked = $wrapper.find('[name=agree]').prop('checked');

		if(!name) tip.show('请输入真实姓名');
		else if(!alipayAccount) tip.show('请输入支付宝账号');
		else if(!wechatAccount) tip.show('请输入QQ或微信账号');
		else if(!phone) tip.show('请输入手机号码');
		else if(!IDNumber) tip.show('请输入身份证号码');
		else if(!IDImageFront) tip.show('请选择身份证正面照片');
		else if(!IDImageBack) tip.show('请选择身份证反面照片');
		else if(!agreeChecked) tip.show('请先阅读并同意分享计划协议');
		else{
			$.ajax({
				url: HttpHelper.getOrigin() + '/bolo/api/web/user/shareEnterApply',
				dataType: 'json',
				type: 'post',
				data: new FormData(document.querySelector('#join-form')),
				contentType: false,    //不可缺
				processData: false,    //不可缺
				xhrFields: {
					withCredentials: true
				},
				success: function(result){
					if(result.status == 1) {
						tip.show('申请成功！马上去视频管理平台分享吧');
						setTimeout(function(){
							location.href = '/m/act/share';
						},4000);
					}else{
						tip.show(result.msg);
					}
				}
			});
		}
	});



});