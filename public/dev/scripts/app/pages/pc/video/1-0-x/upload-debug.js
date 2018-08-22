/**
 * Created by Dillance on 16/6/16.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('jquery@1-11-x'),
		user = require('/common/user@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		tip = require('/pages/pc/video/1-0-x/modules/tip'),
		util = require('/common/util@1-0-x'),
		videoSelector = require('/pages/pc/video/1-0-x/modules/videoSelector'),
		InfoEditor = require('/pages/pc/video/1-0-x/modules/videoInfoEditor');

	//if(!user.isLogin()) user.login();
	//else{
		//videoSelector.init(function(file){
		//	videoEditor.init(file);
		//});
	//}

	var Upload = {
		$wrapper: $('.main-container'),
		init: function(){
			var self = this;
			this.$uploadPage = this.$wrapper.find('.upload.page-container');
			this.$uploadInfo = this.$wrapper.find('.upload-info');
			this.$progressBar = this.$uploadInfo.find('.progress-bar .body');
			this.$uploadData = this.$uploadInfo.find('.upload-data');
			this.$formContainer = this.$wrapper.find('.form-container');
			this.$agreement = $('.agreement');
			this.bindEvents();
			videoSelector.init(function(file){
				self.initUploader(file);
				self.initInfoEditor(file);
				self.$uploadPage.addClass('show');
			});
		},
		initUploader: function(file){
			var self = this;
			this.$uploadInfo.find('.title').text('正在上传：' + file.name.replace(/\.\w+$/,''));
			this.$uploadInfo.find('.progress-wrap,.upload-data').show();
			var formData = new FormData();
			formData.append('userName',encodeURIComponent(user.nickName));
			formData.append('userId',user.userIdStr);
			formData.append('videoFile',file);
			formData.append('fileName',encodeURIComponent(file.name));

			this.startTime = new Date();
			this.uploader = $.ajax({
				url: HttpHelper.getOrigin() + '/bolo/api/web/video/videoUpload.do',
				type: 'post',
				dataType: 'json',
				data: formData,
				contentType: false,    //不可缺
				processData: false,    //不可缺
				xhr: function(){
					var xhr = $.ajaxSettings.xhr();
					xhr.upload.addEventListener('progress', function(e){
						self.updateProgress(e);
					}, false);
					return xhr;
				},
				xhrFields: {
					withCredentials: true
				},
				success: function(result){
					if(result.status == 0){
						self.$uploadInfo.find('.title').text(self.$uploadInfo.find('.title').text().replace('正在上传','上传成功'));
						self.$uploadInfo.find('.progress-wrap,.upload-data').hide();
						self.videoInfoEditor.data.uploadId = result.uploadId;
					}else{
						tip.show(result.msg);
						self.abortUpload();
					}
				}
			});
		},
		initInfoEditor: function(file){
			var self = this;
			this.videoInfoEditor = new InfoEditor(this.$formContainer,{
				upload: true,
				title: file.name.replace(/\.\w+$/,'')
			},function(){
				self.abortUpload();
			});
		},
		bindEvents: function(){
			var self = this;
			this.$uploadPage.find('.cancel-btn').click(function(){
				tip.show('亲！您确定要放弃上传么？',function(){
					self.abortUpload();
				});
			});
			if(this.$agreement.length){
				this.$agreement.find('.agree-btn').click(function(){
					if(!user.isLogin()){
						user.login();
						return;
					}
					$.ajax({
						url: HttpHelper.getOrigin() + '/bolo/api/web/video/agree.do',
						dataType: 'jsonp',
						data: {
							userId: user.userIdStr
						},
						success: function(result){
							if(result.status == 0){
								self.$agreement.removeClass('show');
								setTimeout(function(){
									self.$agreement.remove();
								},500);
							}
						}
					})
				});
				this.$agreement.find('.disagree-btn').click(function(){
					self.$agreement.removeClass('show');
				});
			}
			$('.to-console-btn').click(function(e){
				if(user.userType != 1){
					tip.show('亲！你还不是UP主哦！');
					e.preventDefault();
				}
				if(self.$uploadPage.hasClass('show')){
					var $this = $(this);
					e.preventDefault();
					tip.show('您确定要放弃上传，跳到视频管理页？',function(){
						location.href = $this.attr('href');
					});
				}
			});
		},
		updateProgress: function(data){
			var self = this;

			var progress = (data.loaded * 100 / data.total).toFixed(0);

			var loadedByKB = data.loaded / 1024,
				loadedByMB = (loadedByKB / 1024).toFixed(2),
				totalByMB = (data.total / 1024 / 1024).toFixed(2),
				speed = (loadedByKB / (new Date - self.startTime) * 1000).toFixed(2),
				leftTime = util.secondsToDuration(((data.total - data.loaded) / 1024) / speed);

			if (speed > 1024) {
				speed = (speed / 1024).toFixed(2) + 'M/S';
			} else {
				speed += 'K/S';
			}

			if(progress >= 100) this.$progressBar.text('上传完成中...');
			else this.$progressBar.text(progress + '%');
			this.$progressBar.css('width',progress + '%');
			this.$uploadData.find('.left-time i').text(leftTime);
			this.$uploadData.find('.speed i').text(speed);
			this.$uploadData.find('.uploaded i').text(loadedByMB + 'M/' + totalByMB + 'M');
		},
		abortUpload: function(){
			if(this.uploader) this.uploader.abort();
			this.$uploadPage.removeClass('show');
			videoSelector.$fileInput.val('');
		}
	};

	Upload.init();


});