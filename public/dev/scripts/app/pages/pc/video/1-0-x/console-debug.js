/**
 * Created by Dillance on 16/7/29.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('jquery@1-11-x'),
		base = require('base@1-1-x'),
		user = require('/common/user@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		Promise = require('promise@1-0-x'),
		tmpl = require('/common/tmpl@1-0-x'),
		tip = require('/pages/pc/video/1-0-x/modules/tip'),
		coverEditor = require('/pages/pc/video/1-0-x/modules/coverEditor'),
		InfoEditor = require('/pages/pc/video/1-0-x/modules/videoInfoEditor'),
		QRCode = require('qrcode@1-0-x');

	var Page = {
		$wrapper: $('.main-container'),
		init: function(){
			this.$filterOptions = $('.filter-options');
			this.$searchInput = $('input[name=search]');
			this.$searchBtn = $('.search-btn');
			this.$videoConsole = this.$wrapper.find('.video-console');
			this.$videoList = this.$videoConsole.find('.video-list');
			this.$countTip = $('.count-tip');
			this.videoPage = 1;
			this.videoPageSize = 10;
			this.videoAllLoaded = false;

			this.$videoInfoEditor = this.$wrapper.find('.video-info');

			this.render();
			this.bindEvents();
		},
		render: function(){
			var self = this;
			this.renderVideoList(this.videoPage).then(function(data){
				self.$countTip.find('.total').text(data.total);
				self.$countTip.find('.up-total').text(data.upCount);
			});
		},
		renderVideoList: function(page,keyword,status){
			var self = this;
			this.loadingVideoList = true;
			return this.getVideoList({
				page: page,
				keyword: keyword,
				status: status || ''
			}).then(function(result){
				self.loadingVideoList = false;
				if(page == 1) self.$videoList.html('');
				if(result.data.length){
					self.$videoList.append(tmpl.render('video-list',{
						data: result.data,
						user: user,
						formatDate: function(time){
							var date = new Date(time);
							return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日' + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
						}
					}));
				}
				if(result.data.length < self.videoPageSize){
					self.videoAllLoaded = true;
					self.$videoList.addClass('all-loaded');
				}
				return result;
			});
		},
		getVideoList: function(options){
			options = $.extend({
				keyword: '',
				page: 1,
				status: ''
			},options);
			var self = this;
			return new Promise(function(resolve,reject){
				$.ajax(HttpHelper.getOrigin() + '/bolo/api/web/video/videoList.htm',{
					xhrFields: {
						withCredentials: true
					},
					//type: 'post',
					dataType: 'jsonp',
					data: {
						userId: user.userIdStr,
						title: options.keyword,
						pageNum: options.page,
						status: options.status,
						pageSize: self.videoPageSize
					},
					success: function(result){
						if(result){
							resolve(result);
						}
					}
				});
			})
		},
		bindEvents: function(){
			var self = this;

			this.$videoList.scroll(function(){
				if(!self.loadingVideoList && !self.videoAllLoaded && self.$videoList.scrollTop() > self.$videoList.get(0).scrollHeight - self.$videoList.height() - 50){
					self.renderVideoList(++self.videoPage,self.currentKeyword,self.currentStatus);
				}
			});

			this.$filterOptions.find('input').change(function(){
				var $this = $(this);
				if($this.prop('checked')){
					self.loadingVideoList = false;
					self.$videoList.removeClass('all-loaded');
					self.currentStatus = $this.val();
					self.renderVideoList(self.videoPage = 1,self.currentKeyword,self.currentStatus);
				}
			});

			this.$searchInput.keypress(function(e){
				if(e.keyCode == 13){
					self.loadingVideoList = false;
					self.$videoList.removeClass('all-loaded');
					self.currentKeyword = self.$searchInput.val();
					self.renderVideoList(self.videoPage = 1,self.currentKeyword,self.currentStatus);
				}
			});

			this.$searchBtn.click(function(){
				self.loadingVideoList = false;
				self.$videoList.removeClass('all-loaded');
				self.currentKeyword = self.$searchInput.val();
				self.renderVideoList(self.videoPage = 1,self.currentKeyword,self.currentStatus);
			});

			this.$videoList.on('click','.edit-btn',function(){
				var videoInfo = $(this).data('info');
				self.$videoInfoEditor.addClass('show');
				self.$videoInfoEditor.find('.cover-edit-btn img').attr('src',videoInfo.cover);
				self.$videoInfoEditor.find('.upload-info .title').text('已上传：' + videoInfo.title);
				self.currentInfoEditor = new InfoEditor(self.$videoInfoEditor.find('.form-container'),videoInfo,function(){
					self.$videoInfoEditor.removeClass('show');
				});
			});

			this.$videoList.on('click','.delete-btn',function(){
				var $this = $(this);
				tip.show('亲！您确定要删除此视频么？',function(){
					$.ajax({
						url: HttpHelper.getOrigin() + '/bolo/api/web/video/delVideo.do',
						dataType: 'jsonp',
						data: {
							userId: user.userIdStr,
							ids: $this.data('id')
						},
						success: function(result){
							if(result.status == 0){
								$this.parents('.item').slideUp(400,function(){
									$this.parents('.item').remove();
								});
							}
						}
					});
				});
			});

			this.$videoList.on('click','.reason-btn',function(){
				var $parent = $(this).parents('.options');
				if($parent.hasClass('deleted')){
					tip.show('该视频经审核不符合规范，如有异议请联系客服QQ：3530721286')
				}else tip.show('请重试');
			});

			this.$videoList.on('click','.cover',function(){
				var $this = $(this),
					videoData = $this.data('info');
				coverEditor.init(videoData,function(result){
					if(!result) return;
					var formData = new FormData();
					formData.append('videoId',videoData.id);
					if(result instanceof Object){
						formData.append('selfUploadCover',result.blob);
					}else{
						formData.append('cover',result);
					}
					$this.addClass('loading');
					$.ajax({
						url: HttpHelper.getOrigin() + '/bolo/api/web/video/editCover.do',
						type: 'post',
						data: formData,
						dataType: 'json',
						contentType: false,    //不可缺
						processData: false,    //不可缺
						xhrFields: {
							withCredentials: true
						},
						success: function(result){
							$this.removeClass('loading');
							if(result.status == 0){
								tip.show('修改成功');
								$this.find('img').attr('src',result.cover);
								videoData.cover = result.cover;
								$this.data('info',videoData);
								$this.siblings('.options').find('.edit-btn').data('info',videoData);
							}else{
								tip.show(result.msg);
							}
						}
					});
				});
			});

			this.$videoInfoEditor.find('.cover-edit-btn').click(function(){
				coverEditor.init(self.currentInfoEditor.data,function(result){
					if(!result) return;
					if(result instanceof Object){
						self.currentInfoEditor.data.selfUploadCover = result.blob;
						self.currentInfoEditor.data.cover = result.base64;
						self.$videoInfoEditor.find('.cover-edit-btn img').attr('src',result.base64);
						//self.currentInfoEditor.formData.append('selfUploadCover',result);
					}else{
						self.currentInfoEditor.data.selfUploadCover = '';
						self.currentInfoEditor.data.cover = result;
						self.$videoInfoEditor.find('.cover-edit-btn img').attr('src',result);
						//self.currentInfoEditor.formData.append('cover',result);
					}
				});
			});

			this.$videoList.on('mouseenter','.share-box',function(){
				var $this = $(this),
					$qrWrap = $this.find('.qr-box .content');
				if(!$this.hasClass('hover')){
					$this.addClass('hover');
					$this.parents('li.item').css('z-index',3);
					if(!$this.data('qrcode')){
						$this.data('qrcode',new QRCode($qrWrap.get(0), {
							text: $this.find('input').val() + '&sourceFrom=qr',
							width: $qrWrap.width(),
							height: $qrWrap.height(),
							colorDark : "#000000",
							colorLight : "#ffffff",
							correctLevel : QRCode.CorrectLevel.H
						}));
					}
				}
			}).on('mouseleave','.share-box',function(){
				var $this = $(this);
				if($this.hasClass('hover')){
					$this.removeClass('hover');
					$this.parents('li.item').css('z-index',1);
				}
			});

			this.$videoList.on('click','.p-item',function(){
				var $this = $(this),
					$parent = $this.parents('.share-box'),
					url = $parent.find('input').val(),
					title = $parent.data('title');

				if($this.hasClass('weibo')){
					window.open('http://v.t.sina.com.cn/share/share.php?title=' + encodeURIComponent('【' + title + '】上了哦！赶紧来网易菠萝抢新观看哇！@网易菠萝菌') + '&pic=' + encodeURIComponent($parent.data('cover')) + '&url=' + encodeURIComponent(url + '&sourceFrom=wb'));
				}else if($this.hasClass('qzone')){
					window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + encodeURIComponent(url + '&sourceFrom=qz') + '&title=' + encodeURIComponent('#网易菠萝#') + '&desc=' + encodeURIComponent('【' + title + '】上了哦！赶紧来网易菠萝抢新观看哇！') + '&pics=' + encodeURIComponent($parent.data('cover')));
				}else if($this.hasClass('qq')){
					window.open('http://connect.qq.com/widget/shareqq/index.html?url=' + encodeURIComponent(url + '&sourceFrom=qq') + '&title=' + encodeURIComponent('#网易菠萝#') + '&desc=' + encodeURIComponent('【' + title + '】上了哦！赶紧来网易菠萝抢新观看哇！') + '&pics=' + encodeURIComponent($parent.data('cover')));
				}else if($this.hasClass('baidu')){
					window.open('http://tieba.baidu.com/f/commit/share/openShareApi?url=' + encodeURIComponent(url + '&sourceFrom=ba') + '&title=' + encodeURIComponent('【' + title + '】上了哦！赶紧来网易菠萝抢新观看哇！') + '&pic=' + encodeURIComponent($parent.data('cover')))
				}

			});

		}
	};

	Page.init();


});