/**
 * Created by Dillance on 16/8/19.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('jquery@1-11-x'),
		uadetector = require('uadetector@1-0-x'),
		user = require('/common/user@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		dialog = require('/common/uiComponent/pc/dialog@1-0-x'),
		util = require('/common/util@1-0-x');

	if(uadetector.isDevice('mobile')) location.href = '/m/act/share';

	var $window = $(window);

	var tip = dialog.tip,
		enterDialog = dialog.enter;

	var $agreement = $('.agreement');
	$agreement.find('.agree-btn').click(function(){
		$agreement.hide();
	});

	var joinSharePlanDialog = {
		$wrapper: $('.join-dialog.share-plan'),
		$container: $('.join-dialog.share-plan .container'),
		formData: new FormData(),
		init: function(){
			this.bindEvnets();
		},
		bindEvnets: function(){
			var self = this;
			this.$wrapper.click(function(){
				self.$wrapper.hide();
			});
			this.$container.click(function(e){
				if(!$(e.target).hasClass('remove-btn')){
					e.stopPropagation();
				}
			});

			this.$container.find('.agreement-btn').click(function(){
				$agreement.show();
			});

			this.$container.find('input[type=file]').change(function(){
				var $this = $(this),
					file = this.files[0];
				if(!file.type.match('image')){
					$this.val('');
					tip.show('请选择图片文件');
				}else{
					self.formData.append($this.attr('name'),file);
					var reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = function(){
						$this.siblings('img').attr('src',this.result);
						$this.siblings('.file-input').hide();
					};
				}
			});

			this.$container.find('.submit-btn').click(function(){
				var name = self.$container.find('[name=name]').val(),
					alipayAccount = self.$container.find('[name=alipayAccount]').val(),
					phone = self.$container.find('[name=phone]').val(),
					wechatAccount = self.$container.find('[name=wechatAccount]').val(),
					IDNumber = self.$container.find('[name=IDNumber]').val(),
					IDImageFront = self.$container.find('[name=IDImageFront]').val(),
					IDImageBack = self.$container.find('[name=IDImageBack]').val(),
					agreeChecked = self.$container.find('[name=agree]').prop('checked');

				if(!name) tip.show('请输入真实姓名');
				else if(!alipayAccount) tip.show('请输入支付宝账号');
				else if(!wechatAccount) tip.show('请输入QQ或微信账号');
				else if(!phone) tip.show('请输入手机号码');
				else if(!IDNumber) tip.show('请输入身份证号码');
				else if(!IDImageFront) tip.show('请选择身份证正面照片');
				else if(!IDImageBack) tip.show('请选择身份证反面照片');
				else if(!agreeChecked) tip.show('请先阅读并同意分享计划协议');
				else{
					self.formData.append('userId',user.userIdStr);
					self.formData.append('name',name);
					self.formData.append('alipayAccount',alipayAccount);
					self.formData.append('wechatAccount',wechatAccount);
					self.formData.append('phone',phone);
					self.formData.append('IDNumber',IDNumber);

					$.ajax({
						url: HttpHelper.getOrigin() + '/bolo/api/web/user/shareEnterApply',
						dataType: 'json',
						type: 'post',
						data: self.formData,
						contentType: false,    //不可缺
						processData: false,    //不可缺
						xhrFields: {
							withCredentials: true
						},
						success: function(result){
							if(result.status == 1) {
								tip.setBtnText('现在就去');
								tip.show('申请成功！马上去进行分享吧',function(){
									location.href = '/video/console';
								},true);
							}else{
								tip.show(result.msg);
							}
						}
					});

				}


			});

		},
		show: function(){
			this.$wrapper.show();
			if($window.height() < this.$container.height()){
				this.$container.find('.body').css('height',$window.height() - 100);
			}
			this.$container.css('margin-top',this.$container.height() / -2);
		}
	};
	joinSharePlanDialog.init();


	var Page = {
		$wrapper: $('.wrapper'),
		init: function(){
			this.$container = this.$wrapper.find('.container');
			this.$joinBtn = this.$container.find('.join-btn');
			this.$applyBtn = this.$container.find('.flow-chart .apply-btn');
			this.$introductionsContainer = this.$container.find('.introductions-container');
			this.$detailsBtn = $('.details-btn');

			this.$applyDialog = $('.join-dialog.apply');
			this.render();
			this.bindEvents();
		},
		render: function(){
		},
		bindEvents: function(){
			var self = this;
			this.$joinBtn.add(this.$applyBtn).click(function(){

				if(!user.isLogin()){
					user.login();
					return false;
				}

				if(user.userType != 1){
					self.$applyDialog.show();
					return false;
				}

				if(user.shareUserStatus == 0) tip.show('您好，您的申请正在审核中，请勿重复申请');
				else if(user.shareUserStatus == 1) tip.show('您好，您的申请已通过，请到管理平台查看');
				else if(typeof(FormData)){
					joinSharePlanDialog.show();
				}else{
					tip.show('您的浏览器老掉牙了，为了您的生命财产安全，请使用Chrome，FireFox，IE10+等高级浏览器进行资料上传。');
				}

			});

			this.$applyDialog.find('.join-btn').click(function(){
				self.$applyDialog.hide();
				enterDialog.show();
			});
			this.$applyDialog.click(function(){
				self.$applyDialog.hide();
			}).find('.container').click(function(e){
				if(!$(e.target).hasClass('remove-btn')){
					e.stopPropagation();
				}
			});

			this.$introductionsContainer.find('.nav .item').mouseenter(function(){
				var $this = $(this);
				if(!$this.hasClass('current')){
					$this.addClass('current').siblings('.current').removeClass('current');
					self.$introductionsContainer.find('.body').removeClass('s01 s02 s03').addClass('s0' + ($this.index() + 1))
				}
				if(self.navCarouselTimer) clearTimeout(self.navCarouselTimer);
				self.navCarouselTimer = setTimeout(function(){
					if($this.index() == 2) self.$introductionsContainer.find('.nav .item:eq(0)').trigger('mouseenter');
					else $this.next('.item').trigger('mouseenter');
				},3000);
			});

			this.$detailsBtn.click(function(){
				dialog.intro.setSize(300);
				dialog.intro.show('细则','detail-rules');
			});
		}
	};

	Page.init();
});