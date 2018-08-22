/**
 * Created by Dillance on 16/10/10.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('jquery@1-11-x'),
		base = require('base@1-1-x'),
		tmpl = require('/common/tmpl@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		user = require('/common/user@1-0-x'),
		tip = require('/pages/pc/video/1-0-x/modules/tip'),
		Promise = require('promise@1-0-x'),
		ChinaRegion = require('ChinaRegion@1-0-x');

	var Editor = {
		$wrapper: $('.user-editor'),
		init: function(){
			this.formData = new FormData();
			this.$avatar = this.$wrapper.find('.avatar');
			this.$avatarInput = this.$avatar.find('input');
			this.$nickInput = this.$wrapper.find('.nickname');
			this.$nickCount = this.$nickInput.siblings('.letter-count');
			this.$sexInput = this.$wrapper.find('[name=sex]');
			this.$introTextarea = this.$wrapper.find('textarea');
			this.$introCount = this.$introTextarea.siblings('.textarea-count');
			this.$provinceSlector = this.$wrapper.find('select.province');
			this.$citySlector = this.$wrapper.find('select.city');
			this.$saveBtn = this.$wrapper.find('.save-btn');
			this.render();
			this.bindEvents();
		},
		render: function(){
			this.$provinceSlector.html(tmpl.render('china-province',{
				data: ChinaRegion
			}));
			this.$citySlector.html(tmpl.render('china-city',{
				data: ChinaRegion.filter(function(d){
					return d.pid == (user.province || 1);
				})[0].cities
			}));
		},
		bindEvents: function(){
			var self = this;
			this.$avatarInput.change(function(){
				if(!this.files.length) return;
				self.checkImage(this.files[0]).then(function(data){
					self.currentAvatarFile = data.blob;
					self.$avatar.find('img').attr('src',data.base64);
				},function(err){
					self.$avatarInput.val('');
					tip.show(err);
				});
				//var file = this.files[0];
				//if(!file.type.match('image')){
				//	self.$avatarInput.val('');
				//	tip.show('请选择图片文件');
				//	return false;
				//}else if(file.size > 200 * 1024){
				//	self.$avatarInput.val('');
				//	tip.show('图片过大,请重新选择');
				//	return false;
				//}else{
				//	self.currentAvatarFile = file;
				//	var reader = new FileReader();
				//	reader.readAsDataURL(file);
				//	reader.onload = function(){
				//		var img = new Image();
				//		img.src = this.result;
				//		if(img.width != img.height){
				//			tip.show('请选择尺寸为正方形的图片');
				//			self.$avatarInput.val('');
				//		}else self.$avatar.find('img').attr('src',img.src);
				//	};
				//}
			});

			this.$nickInput.focus(function(){
				self.$nickInput.data('countingInterval',setInterval(function(){
					self.$nickCount.text(self.$nickInput.val().length + '/10');
				},200));
			}).blur(function(){
				clearInterval(self.$nickInput.data('countingInterval'));
			});

			this.$introTextarea.focus(function(){
				self.$introTextarea.data('countingInterval',setInterval(function(){
					self.$introCount.text(self.$introTextarea.val().length + '/20');
				},200));
			}).blur(function(){
				clearInterval(self.$introTextarea.data('countingInterval'));
			});

			this.$provinceSlector.change(function(){
				var city = self.$provinceSlector.find('option').filter(function(){
					return !!$(this).prop('selected')
				}).data('city');
				city = decodeURIComponent(city);
				city = JSON.parse(city);
				self.$citySlector.html(tmpl.render('china-city',{
					data: city
				}));
			});

			this.$wrapper.click(function(){
				self.hide();
			}).find('.container').click(function(e){
				if(e.target.className != 'remove-btn'){
					e.stopPropagation();
				}
			});

			this.$saveBtn.click(function(){
				var data = {},
					nick = self.$nickInput.val(),
					sex = self.$sexInput.filter(':checked').val(),
					provinceId = self.$provinceSlector.find('option:selected').data('id'),
					cityId = self.$citySlector.find('option:selected').data('id'),
					intro = self.$introTextarea.val();

				if(!nick || nick.length > 10){
					tip.show('请输入长度不大于10的昵称');
					return false;
				}else if(intro.length > 20){
					tip.show('简介长度不能超过20');
					return false;
				}

				if(nick != user.nickName) data.nick = nick;
				if(sex != user.sex) data.sex = sex;
				if(provinceId !=user.province) data.provinceId = provinceId;
				if(cityId != user.city) data.cityId = cityId;
				if(intro != user.intro) data.intro = intro;

				if(self.currentAvatarFile){
					self.uploadAvatar(self.currentAvatarFile).then(function(avatarData){
						if(avatarData.status == 1){
							data.avatar = avatarData.url;
							self.submitData(data);
						}else{
							tip.show('头像上传失败,请稍后重试!')
						}
					});
				}else self.submitData(data);
			});
		},
		show: function(){
			this.$wrapper.addClass('show');
		},
		hide: function(){
			this.$wrapper.removeClass('show');
		},
		checkImage: function(file){
			var self = this;
			return new Promise(function(resolve,reject){
				if(!file.type.match('image')){
					reject('请选择图片文件');
				}else if(file.size > 3 * 1024 * 1024){
					reject('图片过大,请重新选择');
				}else{
					var reader = new FileReader();
					var img = new Image();
					//img.crossOrigin = "anonymous";

					reader.onload = function(){
						img.src = this.result;
					};
					img.onload = function(){
						self.cutImage(img).then(function(data){
							resolve(data);
						});
					};

					reader.readAsDataURL(file);
				}
			});
		},
		cutImage: function(img){
			var self = this;
			return new Promise(function(resolve){
				var canvas = document.createElement('canvas'),
					ctx = canvas.getContext('2d');
				canvas.width = 300;
				canvas.height = 300;

				var width, height;
				if(img.width / img.height > 300 / 300){
					width = img.width / (img.height / canvas.height);
					height = 0;
					ctx.drawImage(img, -(width - canvas.width) / 2, height, width, canvas.height);
				}else{
					width = 0;
					height = img.height / (img.width / canvas.width);
					ctx.drawImage(img, width, -(height - canvas.height) / 2, canvas.width, height);
				}

				var base64 = canvas.toDataURL('image/jpeg',0.7);
				resolve({
					base64: base64,
					blob: self.dataURLtoBlob(base64)
				});

			});
		},
		dataURLtoBlob: function(dataurl){
			var arr = dataurl.split(','),
				mime = arr[0].match(/:(.*?);/)[1],
				bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
			while (n--) {
				u8arr[n] = bstr.charCodeAt(n);
			}
			return new Blob([u8arr], { type: mime });
		},
		uploadAvatar: function(file){
			var formData = new FormData();
			formData.append('avatar',file);
			return new Promise(function(resolve){
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/web/user/uploadAvatar',
					type: 'post',
					data: formData,
					dataType: 'json',
					contentType: false,    //不可缺
					processData: false,    //不可缺
					xhrFields: {
						withCredentials: true
					},
					success: function(result){
						resolve(result);
					}
				})
			})
		},
		submitData: function(data){
			var self = this;
			if(base.isEmptyObject(data)){
				self.hide();
			}else{
				data.userId = user.userIdStr;
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/web/user/updateInfo',
					type: 'post',
					dataType: 'json',
					data: data,
					success: function(result){
						if(result.status == 1){
							tip.show('修改成功',function(){
								location.href = location.href;
							},true);
						}else{
							tip.show(result.msg);
						}
					}
				});
			}
		}
	};

	return Editor
});