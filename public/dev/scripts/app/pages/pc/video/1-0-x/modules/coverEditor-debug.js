/**
 * Created by Dillance on 16/6/20.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('jquery@1-11-x'),
		tip = require('/pages/pc/video/1-0-x/modules/tip'),
		Promise = require('promise@1-0-x'),
		tmpl = require('/common/tmpl@1-0-x');

	var Page = {
		$wrapper: $('.page-container.cover-editor'),
		init: function(data,callback){
			if(!this._inited){
				this._inited = true;
				this.$modeRadios = this.$wrapper.find('[name=img-editor-mode]');
				this.$imgSelector = this.$wrapper.find('.img-selector');
				this.$imgInput = this.$imgSelector.find('input');

				this.$screenshotBox = this.$wrapper.find('.img-list');
				this.$changeBtn = this.$wrapper.find('.change-btn');

				this.$cancelBtn = this.$wrapper.find('.cancel-btn');
				this.$confirmBtn = this.$wrapper.find('.confirm-btn');
				this.bindeEvents();
			}
			this.callback = callback;
			this.render(data);
		},
		render: function(data){
			this.data = data;
			this.$imgSelector.find('img').attr('src',data.cover);
			this.renderScreenshot();
			this.$wrapper.addClass('show');
		},
		renderScreenshot: function(){
			var self = this,
				screenshotList = [],
				frames = self.generateFrame(self.data.duration);
			frames.forEach(function(f){
				screenshotList.push('http://' + self.data.linkMp4.replace('http://','') + '?vframe&offset=' + f + '&type=jpg&wsiphost=local');
			});
			this.$screenshotBox.html(tmpl.render('screenshot-item',{
				data: screenshotList
			}));
		},
		generateFrame: function(maximum){
			var frames = [];
			if(maximum < 5){
				alert('视频帧数不足');
				return false;
			}
			while(frames.length < 4){
				var frame = Math.floor(Math.random() * maximum + 1);
				if(!frames.some(function(f){
						return f == frame;
					})){
					frames.push(frame);
				}
			}
			return frames;
		},
		bindeEvents: function(){
			var self = this;
			this.$imgInput.change(function(){
				if(!this.files.length) return;
				self.checkImage(this.files[0]).then(function(data){
					self.currentFile = data;
					self.setCurrentImage(data.base64);
					self.isModified = true;
				},function(err){
					self.$imgInput.val('');
					tip.show(err);
				});
			});

			this.$cancelBtn.click(function(){
				self.hide();
			});
			this.$confirmBtn.click(function(){
				self.hide();
				if(!self.isModified) return;
				if(self.$modeRadios.eq(0).prop('checked')){
					self.callback(self.currentFile);
				}else{
					self.callback(self.$screenshotBox.find('input:checked').siblings('img').attr('src'));
				}
			});

			this.$modeRadios.eq(0).change(function(){
				if(self.$modeRadios.eq(0).prop('checked')){
					self.$screenshotBox.find('input:checked').prop('checked',false);
				}
			});
			this.$modeRadios.eq(1).change(function(){
				if(self.$modeRadios.eq(1).prop('checked')){
					self.isModified = true;
					self.$screenshotBox.find('input:eq(0)').prop('checked','checked');
				}
			});

			this.$changeBtn.click(function(){
				self.renderScreenshot();
			});
			this.$screenshotBox.on('change','input',function(){
				var $this = $(this);
				self.isModified = true;
				if($this.prop('checked') && !self.$modeRadios.eq(1).prop('checked')){
					self.$modeRadios.eq(1).prop('checked','checked');
				}
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
					reader.onload = function(){
						var img = new Image();
						//img.crossOrigin = "anonymous";
						img.onload = function(){
							self.cutImage(img).then(function(data){
								resolve(data);
							});
						};
						img.src = this.result;
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
				canvas.width = 960;
				canvas.height = 540;

				var width, height;
				if(img.width / img.height > 960 / 540){
					width = img.width / (img.height / canvas.height);
					height = 0;
					ctx.drawImage(img, -(width - canvas.width) / 2, height, width, canvas.height);
				}else{
					width = 0;
					height = img.height / (img.width / canvas.width);
					ctx.drawImage(img, width, -(height - canvas.height) / 2, canvas.width, height);
				}

				var base64 = canvas.toDataURL('image/jpeg',0.6);
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
		setCurrentImage: function(url){
			this.$imgSelector.find('img').attr('src',url);
		},
		hide: function(){
			this.$imgInput.val('');
			this.$imgSelector.find('img').attr('src','');
			this.$wrapper.removeClass('show');
		}
	};

	return Page;

});