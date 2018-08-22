/**
 * Created by Dillance on 16/11/16.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		tmpl = require('/common/tmpl@1-0-x'),
		qs = require('querystring@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		Promise = require('promise@1-0-x'),
		animation = require('animation@1-0-x'),
		Danmaku = require('/pages/mobile/collection/1-0-x/modules/danmaku'),
		comment = require('/common/uiComponent/mobile/comment@1-0-x'),
		wechat = require('/common/wechat@1-0-x');

	var QUERY = qs.parse();

	var Video = {
		$wrapper: $('.video-dialog'),
		init: function(){
			this.$video = this.$wrapper.find('video');
			this.video = this.$video.get(0);
		},
		show: function(){
			this.$wrapper.addClass('show');
		}
	};

	var $fullCover = $('.full-cover');

	var Page = {
		$wrapper: $('.wrapper'),
		currentPage: 1,
		size: 8,
		init: function(){
			this.$likeBtn = this.$wrapper.find('.like-btn');
			this.$videoList = this.$wrapper.find('.video-list');
			this.$moreBtn = this.$wrapper.find('.more-btn');
			this.$toCommentBtn = $('.to-comment-btn');
			this.render();
			this.bindEvents();
		},
		render: function(){
			var self = this;
			this.getVideos(self.currentPage, self.size).then(function(data){
				self.addVideos(data);
			});
		},
		addVideos: function(data){
			var self = this;
			this.$videoList.append(tmpl.render('video-item',{
				data: data,
				getImage: HttpHelper.getImage
			}));
			data.forEach(function(d){
				self.getDanmaku(d.videoId).then(function(danmaku){
					self.$videoList.find('#video-' + d.videoId).find('.danmaku-wrap').data('list',JSON.stringify(danmaku));
				});
			});
		},
		bindEvents: function(){
			var self = this;
			this.$moreBtn.tap(function(){
				if(self.$moreBtn.hasClass('no-more')) return false;
				self.getVideos(++self.currentPage, self.size).then(function(data){
					if(data.length){
						self.addVideos(data);
					}else{
						self.$moreBtn.addClass('no-more');
					}
				});
			});
			this.$videoList.on('tap','.cover',function(){
				var $this = $(this),
					$thisItemWrap = $this.parents('.video-item'),
					$thisVideoBox = $this.siblings('.video-box'),
					$thisDanmakuWrap = $this.siblings('.danmaku-wrap'),
					danmaku = $thisDanmakuWrap.data('list');

				if(danmaku) danmaku = JSON.parse(danmaku);
				else return false;

				var $playingVideo = self.$videoList.find('video');
				if($playingVideo.length){
					$playingVideo.parent('.video-box').siblings('.cover').show();
					$playingVideo.remove();
				}

				$thisVideoBox.html(tmpl.render('video',{url: $this.data('url')}));
				var $thisVideo = $thisVideoBox.find('video');
				//$thisVideo.on('play',function(){
				//	$this.parents('.play-box').addClass('stick');
				//	$fullCover.show();
				//	$fullCover.tap(function(){
				//		$thisVideo.get(0).pause();
				//	});
				//}).on('pause',function(){
				//	$this.parents('.play-box').removeClass('stick');
				//	$fullCover.hide();
				//	$fullCover.off('tap');
				//});

				new Danmaku($thisDanmakuWrap,danmaku);

				$thisVideo.get(0).play();
				$this.hide();

				if($thisItemWrap.offset().top != self.$wrapper.height() / 2 - $thisVideoBox.height() / 2){
					animation.add({
						startValue: self.$wrapper.scrollTop(),
						endValue: $thisItemWrap.offset().top - (self.$wrapper.height() / 2 - $thisVideoBox.height() / 2) + self.$wrapper.scrollTop(),
						duration: 200,
						step: function(v){
							self.$wrapper.scrollTop(v);
						}
					})
				}

			});
			this.$toCommentBtn.tap(function(){
				var currentScrollTop = self.$wrapper.scrollTop();
				animation.add({
					startValue: currentScrollTop,
					endValue: currentScrollTop + comment.$wrapper.offset().top,
					duration: 200,
					step: function(v){
						self.$wrapper.scrollTop(v);
					}
				})
			});
			this.$wrapper.scroll(function(){
				if(comment.$wrapper.offset().top > 2 && !self.$toCommentBtn.hasClass('show')) self.$toCommentBtn.addClass('show');
				else if(comment.$wrapper.offset().top <= 2 && self.$toCommentBtn.hasClass('show')) self.$toCommentBtn.removeClass('show');
			});
			this.$likeBtn.tap(function(){
				if(!self.$likeBtn.hasClass('ed')){
					self.$likeBtn.addClass('ed');
					self.$likeBtn.text(self.$likeBtn.data('count') + 1 + '次');
				}
			});
		},
		getVideos: function(page, size){
			return new Promise(function(resolve,reject){
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/videoAlbum/videoList.htm',
					dataType: 'jsonp',
					data: {
						aid: QUERY.aid,
						pageNum: page,
						pageSize: size
					},
					success: function(result){
						resolve(result);
					},
					error: function(xhr, errorType, error){
						reject(error);
					}
				});
			});
		},
		getDanmaku: function(id){
			return new Promise(function(resolve,reject){
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/public/bulletBroadcastForH5.htm',
					dataType: 'json',
					data: {
						videoId: id
					},
					success: function(result){
						var data = {};
						result.forEach(function(d){
							var playTime = Math.floor(d.playTime / 1000);
							if(!data[playTime]) data[playTime] = [];
							data[playTime].push(d.content);
						});
						resolve(data);
					},
					error: function(xhr, errorType, error){
						reject(error);
					}
				});
			});
		}
	};

	Page.init();

	comment.onhotlistloaded = function(data){
		if(data.totalCommentCount > 0) Page.$toCommentBtn.text(data.totalCommentCount > 99999 ? '99999+' : data.totalCommentCount);
	};
	comment.init(Page.$wrapper);

	wechat.share({
		title: COLLECTION_INFO.name,
		desc: COLLECTION_INFO.intro,
		link: location.href,
		imgUrl: HttpHelper.getImage(COLLECTION_INFO.cover,[100,100],1)
	});

	console.log(HttpHelper.getImage(COLLECTION_INFO.cover,[100,100],1))


});