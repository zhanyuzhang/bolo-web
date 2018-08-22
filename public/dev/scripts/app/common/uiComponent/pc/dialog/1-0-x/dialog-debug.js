/**
 * Created by Dillance on 16/8/22.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('jquery@1-11-x'),
		user = require('/common/user@1-0-x'),
		tmpl = require('/common/tmpl@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		util = require('/common/util@1-0-x');

	var $window = $(window);

	var tip = {
		$wrapper: $('.tip-dialog'),
		init: function(){
			this.$content = this.$wrapper.find('.content');
			this.bindEvents();
			return this;
		},
		bindEvents: function(){
			var self = this;
			this.$wrapper.find('.confirm-btn').click(function(){
				self.hide();
				if(self.callback) self.callback('confirm');
			});
			this.$wrapper.find('.remove-btn').click(function(){
				self.hide();
				if(self.callback && self.isHardCallback) self.callback('cancel');
			});
			this.$wrapper.click(function(){
				self.hide();
				if(self.callback && self.isHardCallback) self.callback('cancel');
			}).find('.container').click(function(e){
				e.stopPropagation();
			});
		},
		setBtnText: function(text){
			this.$content.find('.confirm-btn').text(text);
		},
		show: function(msg,callback,isHardCallback){
			var self = this;
			this.callback = callback;
			this.isHardCallback = isHardCallback;
			this.$content.text(msg);
			this.$wrapper.show();
			setTimeout(function(){
				self.$wrapper.addClass('show');
			},10);
		},
		hide: function(){
			var self = this;
			this.$wrapper.removeClass('show');
			this.$content.find('.confirm-btn').text('确定');
			setTimeout(function(){
				self.$wrapper.hide();
			},200);
		}
	};

	var intro = {
		$wrapper: $('.intro-dialog'),
		init: function(){
			this.$container = this.$wrapper.find('.container');
			this.$header = this.$wrapper.find('.dialog-header');
			this.$content = this.$wrapper.find('.content');
			this.bindEvents();
			return this;
		},
		setSize: function(height){
			this.beset = true;
			this.$content.css('height',height + 'px');
		},
		bindEvents: function(){
			var self = this;
			this.$wrapper.click(function(){
				self.hide();
				if(self.callback) self.callback('cancel');
			}).find('.container').click(function(e){
				var $target = $(e.target);
				if(!$target.hasClass('remove-btn') && !$target.hasClass('confirm-btn')) e.stopPropagation();
			});
		},
		show: function(title,key,callback){
			var self = this;
			this.callback = callback;
			this.$header.text(title);
			this.$content.html(tmpl.render(key));
			this.$wrapper.addClass('show');
			if(this.beset) this.$container.css('margin-top',-this.$container.height() / 2 + 'px')
		},
		hide: function(){
			var self = this;
			this.$wrapper.removeClass('show');
			if(this.beset){
				this.$content.removeAttr('style');
				this.$container.removeAttr('style');
				this.beset = false;
			}
		}
	};

	var enter = {
		$wrapper: $('.join-dialog.enter'),
		$container: $('.join-dialog.enter .container'),
		init: function(){
			this.exist = !!this.$wrapper.length;
			this.bindEvnets();
			return this;
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
					weibo = self.$container.find('[name=weibo]').val(),
					wechatAccount = self.$container.find('[name=wechatAccount]').val(),
					phone = self.$container.find('[name=phone]').val(),
					video = self.$container.find('[name=video]').val();

				if(!name) tip.show('请输入团队名称');
				else if(!weibo) tip.show('请输入微博账号');
				else if(!wechatAccount) tip.show('请输入QQ或微信账号');
				else if(!phone) tip.show('请输入手机号码');
				else if(!video) tip.show('请输入视频平台');
				else{
					$.ajax({
						url: HttpHelper.getOrigin() + '/bolo/api/web/user/enterApply',
						dataType: 'jsonp',
						data: {
							userId: user.userIdStr,
							name: name,
							weibo: weibo,
							wechatAccount: wechatAccount,
							phone: phone,
							video: video
						},
						success: function(result){
							if(result.status == 1) {
								tip.show('提交成功',function(){
									location.href = location.href;
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

	var joinBolo = {
		$wrapper: $('.join-bolo-dialog'),
		$container: $('.join-bolo-dialog .container'),
		init: function(){
			this.exist = !!this.$wrapper.length;
			this.bindEvnets();
			return this;
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
					weibo = self.$container.find('[name=weibo]').val(),
					wechatAccount = self.$container.find('[name=wechatAccount]').val(),
					phone = self.$container.find('[name=phone]').val(),
					video = self.$container.find('[name=video]').val();

				if(!name) tip.show('请输入团队名称');
				else if(!weibo) tip.show('请输入微博账号');
				else if(!wechatAccount) tip.show('请输入QQ或微信账号');
				else if(!phone) tip.show('请输入手机号码');
				else if(!video) tip.show('请输入视频平台');
				else{
					$.ajax({
						url: HttpHelper.getOrigin() + '/bolo/api/web/user/enterApply',
						dataType: 'jsonp',
						data: {
							userId: user.userIdStr,
							name: name,
							weibo: weibo,
							wechatAccount: wechatAccount,
							phone: phone,
							video: video
						},
						success: function(result){
							if(result.status == 1) {
								tip.show('提交成功',function(){
									location.href = location.href;
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

	return {
		tip: tip.init(),
		intro: intro.init(),
		enter: enter.init(),
		joinBolo: joinBolo.init()
	}


});