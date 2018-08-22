/**
 * Created by Dillance on 16/4/6.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		base = require('base@1-1-x'),
		qs = require('querystring@1-0-x'),
		tmpl = require('/common/tmpl@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		uadetector = require('uadetector@1-0-x'),
		native = require('/common/native@1-0-x');

	var Danmaku = {
		$wrapper: $('.video-box .danmaku-wrap'),
		danmakuTrack: 6,
		currentPlayTime: -1,
		cleanRestBulletTimer: [],
		list: DANMAKU,
		init: function(){
			var self = this;

			if(!this.list || base.isEmptyObject(this.list)) return false;
			this.$video = this.$wrapper.siblings('video');
			this.video = this.$video.get(0);
			this.render();
			this.bindEvents();

			this.cleanBulletInterval = setInterval(function(){
				self.cleanBullet();
			},30000);
		},
		render: function(){
			var self = this,
				content = [],
				eachHeight = this.$wrapper.height() / this.danmakuTrack + 'px';

			for(var i = 0;i < this.danmakuTrack;i++){
				content.push('<li class="track" style="height:' + eachHeight + ';line-height:' + eachHeight + '"></li>');
			}

			this.$wrapper.html(content.join(''));
		},
		bindEvents: function(){
			var self = this;
			this.$video.on('timeupdate',function(){
				if(self.status != 'silence') self.consumeBullet();
			});
		},
		consumeBullet: function(){
			var videoCurrentTime = Math.floor(this.video.currentTime);

			if(videoCurrentTime == this.currentPlayTime) return;
			else this.currentPlayTime = videoCurrentTime;

			this.shoot(this.list[videoCurrentTime]);

		},
		shoot: function(bulletList){
			var self = this;
			if(bulletList && bulletList.length){

				var list = bulletList.slice();

				this.$wrapper.find('.track').each(function(i){
					var $this = $(this);
					if(!list.length) return;
					if(!$this.data('occupied')){
						$this.data('occupied',true);
						var $bullet = $('<span class="bullet">' + list.shift() + '</span>');
						$this.append($bullet);
						var bulletWidth = $bullet.width(),
							trackWidth = self.$wrapper.width(),
							totalDistance = trackWidth + bulletWidth,
							bulletSpeed = totalDistance / 4000,
							unoccupiedDistance = trackWidth / 3 + bulletWidth,
							unoccupiedTime = unoccupiedDistance / bulletSpeed;
						$bullet.css('-webkit-transform','translate3d(-' + totalDistance + 'px,0,0)');
						setTimeout(function(){
							$this.data('occupied',false);
						},unoccupiedTime);
						//每条弹幕4秒结束
						setTimeout(function(){
							$bullet.addClass('finished');
						},4000);
					}
				});

				if(list.length){
					this.cleanRestBulletTimer.push(setTimeout(function(){
						self.shoot(list);
					},200));
				}
			}
		},
		cleanBullet: function(){
			this.$wrapper.find('.bullet.finished').remove();
		},
		shutUp: function(){
			this.status = 'silence';
			this.cleanRestBulletTimer.forEach(function(d){
				clearTimeout(d);
			});
			this.cleanRestBulletTimer = [];
		},
		continueSpeak: function(){
			this.status = 'noisy';
		}
	};

	Danmaku.init();

	var Video = {
		$wrapper: $('.video-box'),
		init: function(){
			this.$video = this.$wrapper.find('video');
			this.video = this.$video.get(0);
			this.$controller = this.$wrapper.find('.controller');
			this.$playBtn = this.$controller.find('.play-btn');
			this.$progressBar = this.$controller.find('.progress-bar');
			this.$leftTime = this.$controller.find('.time');

			this.duration = this.$wrapper.data('duration');

			this.bindControllerEvents();
			this.video.play();
		},
		bindControllerEvents: function(){
			var self = this;

			this.$wrapper.tap(function(){
				if(self.hideControllerTimer) clearTimeout(self.hideControllerTimer);
				if(!self.$controller.hasClass('show')){
					self.$controller.addClass('show');
					self.hideControllerTimer = setTimeout(function(){
						self.$controller.removeClass('show');
					},5000);
				}else{
					self.$controller.removeClass('show');
				}
			});

			this.$controller.tap(function(e){
				e.stopPropagation();
			});

			this.$playBtn.tap(function(){
				if(self.$playBtn.hasClass('pause')) self.video.pause();
				else self.video.play();
			});

			this.$video.on('play',function(){
				self.status = 'playing';
				self.$playBtn.addClass('pause');
			}).on('pause',function(){
				self.status = 'pause';
				self.$playBtn.removeClass('pause');
			}).on('timeupdate',function(){
				self.updateVideoLeftTime();
			});

			this.$progressBar.on('touchstart',function(e){
				self.manipulating = true;
				self.updateProgressBar(e.changedTouches[0].pageX);
			}).on('touchmove',function(e){
				self.updateProgressBar(e.changedTouches[0].pageX);
			}).on('touchend',function(e){
				self.updateProgressBar(e.changedTouches[0].pageX,true);
			});

			this.$controller.find('.full-screen-btn').tap(function(){
				if(self.video.requestFullscreen) self.video.requestFullscreen();
				else if(self.video.webkitRequestFullscreen) self.video.webkitRequestFullscreen();
				else if(self.video.webkitEnterFullscreen) self.video.webkitEnterFullscreen();
			});

			this.$controller.find('.danmaku-switch').tap(function(){
				var $this = $(this);
				if($this.hasClass('closed')){
					$this.removeClass('closed');
					Danmaku.continueSpeak();
				}else{
					$this.addClass('closed');
					Danmaku.shutUp();
				}
			});

		},
		updateVideoLeftTime: function(){
			var self = this,
				leftTime = self.duration - Math.floor(self.video.currentTime),
				minute = Math.floor(leftTime / 60),
				second = leftTime % 60;
			self.$leftTime.text((minute > 9 ? minute : '0' + minute) + ':' + (second > 9 ? second : '0' + second));
			if(!self.manipulating) self.$progressBar.find('.dynamic-bar').css('width',(self.video.currentTime / self.duration) * 100 + '%');
		},
		updateProgressBar: function(x,playWithNewPosition){
			var self = this,
				width = x - self.$progressBar.offset().left;
			self.$progressBar.find('.dynamic-bar').css('width',width + 'px');
			if(playWithNewPosition){
				self.manipulating = false;
				self.video.currentTime = width / self.$progressBar.width() * self.duration;
				self.video.play();
			}
		}
	};

	Video.init();


	var Comment = {
		$wrapper: $('.comment'),
		currentPage: 0,
		pageSize: 10,
		isFull: false,
		init: function(){
			this.totalComment = this.$wrapper.find('.comment-num').text();
			this.getData(++this.currentPage);
			this.bindEvents();
		},
		getData: function(page){
			var self = this;

			if(self.gettingData) return;
			self.gettingData = true;

			$.ajax({
				url: HttpHelper.host + '/bolo/api/video/commentList.htm',
				dataType: 'jsonp',
				data: {
					videoId: qs.parse().videoId,
					pageNum: page,
					pageSize: self.pageSize
				},
				success: function(result){
					self.gettingData = false;
					if(result.status == 1){
						var html = tmpl.render('comment',{
							data: result.data
						});
						self.$wrapper.find('.comment-container').append(html);
						if(self.$wrapper.find('.comment-item').size >= self.totalComment) self.isFull = true;
						self.getReplyData(result.data);
					}else{
						alert(result.msg)
					}
				}
			});
		},
		bindEvents: function(){
			var self = this;
			$(window).scroll(function(){
				if(self.isFull) return;
				var $this = $(this),
					scrollDistance = $('body').height() - $this.height();
				if($this.scrollTop() >= scrollDistance * 0.9){
					self.getData(++self.currentPage);
				}
			});
		},
		getReplyData: function(data){
			var self = this;
			data.forEach(function(d){
				$.ajax({
					url: HttpHelper.host + '/bolo/api/video/commentReplyList.htm',
					dataType: 'jsonp',
					data: {
						cid: d.id
					},
					success: function(result){
						if(result.status == 1){
							var list = tmpl.render('comment-reply-list',{
								data: result.data
							});
							self.$wrapper.find('c-' + d.id + ' .reply-list').html(list);
						}
					}
				})
			});
		}
	};

	Comment.init();

	var Page = {
		$wrapper: $('.play-wrapper'),
		init: function(){
			this.$guideDialog = this.$wrapper.find('.share-guide');
			this.$downloadDialog = this.$wrapper.find('.download-dialog');
			this.$shareDialog = this.$wrapper.find('.share-box');
			this.$downloadGuide = this.$wrapper.find('.download-guide');

			this.$authorBox = this.$wrapper.find('.author-box');
			this.$recommend = this.$wrapper.find('.recommend');
			this.$downloadBar = this.$wrapper.find('.download-bar');
			this.bindEvents();
		},
		bindEvents: function(){
			var self = this;

			this.$wrapper.find('.collect-btn,.tip-box').click(function(){
				self.$downloadDialog.show();
			});

			this.$wrapper.find('.comment-container').delegate('.operation','click',function(){
				self.$downloadDialog.show();
			});

			this.$authorBox.find('.avatar,.title,.name').click(function(){
				location.href = '/m/channel?userId=' + self.$authorBox.attr('uid');
			});

			this.$downloadDialog.find('.fuck-off,.remove-btn').click(function(){
				self.$downloadDialog.hide();
			});

			this.$wrapper.find('.share-btn').click(function(){
				self.$shareDialog.show();
			});

			this.$shareDialog.find('.cancel-btn,.remove-btn').click(function(){
				self.$shareDialog.hide();
			});

			this.$shareDialog.find('.item').click(function(){
				self.share($(this).data('type'));
			});

			this.$guideDialog.on('touchend',function(){
				self.$guideDialog.hide();
			});

			this.$downloadDialog.on('touchmove',function(e){
				e.stopPropagation();
				e.preventDefault();
			});
			this.$shareDialog.on('touchmove',function(e){
				e.stopPropagation();
				e.preventDefault();
			});

			this.$downloadDialog.on('click',function(){
				self.$downloadDialog.hide();
			}).find('.container').on('click',function(e){
				e.stopPropagation();
			});

			this.$shareDialog.on('click',function(){
				self.$shareDialog.hide();
			}).find('.container').on('click',function(e){
				e.stopPropagation();
			});

			this.$recommend.find('.poster').click(function(e){
				e.preventDefault();
			}).click(function(){
				location.href = this.href;
			});

			this.$downloadDialog.find('.download-btn').add(this.$downloadBar.find('.download-btn')).click(function(){
				location.href = '/download'
			});

			this.$downloadGuide.click(function(){
				self.$downloadGuide.hide();
			});

		},
		share: function(type){
			switch(type){
				case 'wechat':
				case 'moment':
					this.$shareDialog.hide();
					this.$guideDialog.show();
					break;
				case 'weibo':
					location.href = 'http://v.t.sina.com.cn/share/share.php?title=' + encodeURIComponent('我正在看《' + SHARE_INFO.title + '》 @网易菠萝” ' + location.href) + '&pic=' + encodeURIComponent(SHARE_INFO.img || '');
					break;
				case 'qzone':
					location.href = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title=' + encodeURIComponent(SHARE_INFO.title + ' |网易菠萝') + '&desc=' + encodeURIComponent(SHARE_INFO.intro) + '&pics=' + encodeURIComponent(SHARE_INFO.img || '');
					break;
			}
		}
	};

	Page.init();

});