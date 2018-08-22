/**
 * Created by Dillance on 17/1/16.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('jquery@1-11-x'),
		qs = require('querystring@1-0-x'),
		user = require('/common/user/1-0-x/user-debug.js'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		Promise = require('promise@1-0-x'),
		tmpl = require('/common/tmpl@1-0-x'),
		videoCardList = require('/pages/pc/newbolo/components/video-card-list@1-0-x');

	var QUERY = qs.parse();

	var Page = {
		$wrapper: $('.wrapper'),
		find: function(selector){
			return this.$wrapper.find(selector);
		},
		init: function(){
			this.$personAvatar = this.find('.person-info .avatar');
			this.$avatarFileInput = this.$personAvatar.find('input[type=file]');
			this.$followBtn = this.find('.follow-btn');
			this.$editBtn = this.find('.edit-btn');
			this.$myConcernCount = this.find('.my-concern .count');
			this.$concernList = this.find('.concern-list');
			this.$userInfoEditor = $('.user-info-editor');
			this.render();
			this.bindEvents();
		},
		render: function(){
			var self = this;
			this.getFollowData().then(function(result){
				if(result.length){
					self.$concernList.html(tmpl.render('concern-list',{
						data: result,
						getImage: HttpHelper.getImage
					}));
					self.$myConcernCount.text(result.length);
				}else{
					self.$concernList.addClass('zero-data');
				}
			});

		},
		bindEvents: function(){
			var self = this;
			this.$followBtn.click(function(){
				var $this = $(this);
				if(user.isLogin()){
					if($this.hasClass('ed')){
						self.unfollow($this.data('id')).then(function(result){
							if(result.status == 1){
								$this.removeClass('ed');
							}
						});
					}else{
						self.follow($this.data('id')).then(function(result){
							if(result.status == 1){
								$this.addClass('ed');
							}
						});
					}

				}else{
					user.login();
				}
			});

			this.$avatarFileInput.change(function() {
				if (!this.files.length) return;
				self.checkImage(this.files[0]).then(function(img){
					return self.cutImage(img);
				}).then(function (data) {
					self.$personAvatar.find('img').attr('src', data.base64);
					return self.uploadAvatar(data.blob);
				}).then(function(result){
					if(result.status != 1) return Promise.reject('头像修改失败,请稍后重试');
					return self.updateUserInfo($.extend({},TARGET_USER_INFO,{
						avatar: result.url
					}));
				}).catch(function (err) {
					self.$avatarFileInput.val('');
					alert(err);
				});
			});

			this.$editBtn.click(function(){
				self.$userInfoEditor.show();
			});

			this.$userInfoEditor.click(function(){
				self.$userInfoEditor.hide();
			}).find('.container').click(function(e){
				e.stopPropagation();
			}).on('click','.cancel-btn,.remove-btn',function(){
				self.$userInfoEditor.hide();
				self.$userInfoEditor.find('input,textarea').each(function(){
					$(this).val($(this).data('default-val'));
				});
			}).on('click','.confirm-btn',function(){
				var data = {
					nick: self.$userInfoEditor.find('input').val(),
					intro: self.$userInfoEditor.find('textarea').val()
				};
				if(data.nick && data.intro){
					self.updateUserInfo($.extend({},TARGET_USER_INFO,data)).then(function(result){
						if(result.status == 1){
							location.href = location.href;
						}else{
							alert('修改失败,请稍后重试')
						}
					});
				}else{
					alert('请正确填写资料')
				}
			});
		},
		getFollowData: function(){
			return new Promise(function(resolve){
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/web/user/myFollows.htm',
					dataType: 'json',
					data: {
						targetUserId: QUERY.id,
						pageNum: 1,
						pageSize: -1
					},
					xhrFields: {
						withCredentials: true
					},
					success: function(result){
						resolve(result);
					}
				})
			});
		},
		follow: function(followedId){
			return new Promise(function(resolve){
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/web/user/follow',
					dataType: 'json',
					data: {
						follow: true,
						followedId: followedId
					},
					xhrFields: {
						withCredentials: true
					},
					success: function(result){
						resolve(result);
					}
				})
			});
		},
		unfollow: function(followedId){
			return new Promise(function(resolve){
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/web/user/follow',
					dataType: 'json',
					data: {
						follow: false,
						followedId: followedId
					},
					xhrFields: {
						withCredentials: true
					},
					success: function(result){
						resolve(result);
					}
				})
			});
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
						resolve(img);
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
		updateUserInfo: function(data){
			data.userId = user.userIdStr;
			return new Promise(function(resolve) {
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/web/user/updateInfo',
					type: 'post',
					dataType: 'json',
					data: data,
					success: function (result) {
						resolve(result);
					}
				});
			});
		}
	};

	Page.init();
	videoCardList.init();

});