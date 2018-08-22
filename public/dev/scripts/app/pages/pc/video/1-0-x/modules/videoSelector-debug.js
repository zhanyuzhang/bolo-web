/**
 * Created by Dillance on 16/6/20.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('jquery@1-11-x'),
		user = require('/common/user@1-0-x'),
		tip = require('/pages/pc/video/1-0-x/modules/tip'),
		util = require('/common/util@1-0-x');

	var Page = {
		$wrapper: $('.page-container.start'),
		init: function(nextStep){
			this.nextStep = nextStep;
			this.$fileInput = this.$wrapper.find('input');
			this.bindeEvents();
		},
		bindeEvents: function(){
			var self = this;
			this.$fileInput.click(function(e){
				if(!util.isSupportAJAXUpload){
					tip.show('你的浏览器老掉牙了，为了您的生命财产安全，请使用Chrome、FireFox或IE9以上等高级浏览器上传文件');
					return false;
				}else if(!user.isLogin()){
					user.login();
					return false;
				}else if(user.userType != 1){
					tip.show('亲！你还不是UP主哦！');
					return false;
				}else if($('.agreement').length){
					$('.agreement').addClass('show');
					return false;
				}
			}).change(function(e){
				var file = this.files[0];
				if(self.check(file)){
					self.nextStep(file);
				}
			});
		},
		check: function(file){
			var format = ['.f4v','.flv','.wmv','.asf','.asx','.rm','.rmvb','.m2ts','.mpg','.mpeg','.mpeg2','.mpe','.dvix','.dat','.vob','.dv','.3gp','.3g2','.mod','.mov','.avi','.mkv','.mp4','.m4v','.ram','.ts','.mts','.ps','.tp','.webm'],
				name = file.name.toLowerCase();

			var nameValidate = format.some(function(d){
				return name.indexOf(d) >= 0;
			});

			if(nameValidate){
				if(file.size > 1 * 1024 * 1024 * 1024){
					this.$fileInput.val('');
					tip.show('sorry，视频大小不得超过1G');
					return false;
				}else{
					return true;
				}
			}
			else{
				this.$fileInput.val('');
				tip.show('请选择视频文件');
				return false;
			}
		}
	};

	return Page;

});