/**
 * Created by Dillance on 16/4/6.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		base = require('base@1-1-x'),
		qs = require('querystring@1-0-x'),
		tmpl = require('/common/tmpl@1-0-x'),
		cookie = require('cookie@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		uadetector = require('uadetector@1-0-x'),
		Stat = require('/common/Stat@1-0-x'),
		native = require('/common/native@1-0-x'),
		md5 = require('md5@1-0-x');

	var QUERY = qs.parse();

	if(native.hello()){
		native.call('openVideo',{
			videoId: qs.parse().videoId
		});
	}

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
			this.$firstPlayBtn = this.$wrapper.find('.first-play-btn');
			this.$playBtn = this.$controller.find('.play-btn');
			this.$progressBar = this.$controller.find('.progress-bar');
			this.$leftTime = this.$controller.find('.time');

			this.duration = this.$wrapper.data('duration');

			this.bindControllerEvents();
			//this.video.play();

			//分享计划统计
			if(QUERY.sharedby) {
				//浏览量
				if(!cookie.get('visiteuid')) cookie.set('visiteuid',base.randomStr('vuid'),{
					expires: '1 day'
				});
				new Image().src = qs.append(HttpHelper.getOrigin() + '/bolo/api/share/record.htm', {
					actionType: 0,
					cookieId: cookie.get('visiteuid'),
					videoId: QUERY.videoId,
					userId: QUERY.sharedby,
					s: md5('actionType0cookieId' + cookie.get('visiteuid') + 'uaHidNsVv8Q3x4llxKiKCxTrjYkDeBRi').toLowerCase()
				});
			}
		},
		bindControllerEvents: function(){
			var self = this;

			this.$wrapper.singleTap(function(){
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

			this.$wrapper.doubleTap(function(){
				self.video.pause();
				self.$wrapper.trigger('singleTap');
				Stat.send('play_player_clickPlay',{
					label: 'state:1'
				});
			});

			this.$controller.tap(function(e){
				e.stopPropagation();
			});

			this.$playBtn.tap(function(){
				if(self.$playBtn.hasClass('pause')){
					self.video.pause();
					Stat.send('play_player_clickPlay',{
						label: 'state:1'
					});
				}else{
					self.video.play();
					Stat.send('play_player_clickPlay',{
						label: 'state:2'
					});
				}
			});

			this.$firstPlayBtn.tap(function(e){
				e.stopPropagation();
				self.video.play();
				self.$firstPlayBtn.remove();
				Stat.send('play_player_clickPlay',{
					label: 'state:2'
				});
			});

			this.$video.on('play',function(){
				var $this = $(this);
				self.status = 'playing';
				self.$playBtn.addClass('pause');
				self.stat();
				//分享计划统计播放时长
				if(QUERY.sharedby && !$this.data('play-started')){
					if(!cookie.get('shareuid')) cookie.set('shareuid',base.randomStr('uid'),{
						expires: '10 min'
					});
					new Image().src = qs.append(HttpHelper.getOrigin() + '/bolo/api/share/record.htm',{
						actionType: 1,
						videoId: QUERY.videoId,
						cookieId: cookie.get('shareuid'),
						userId: QUERY.sharedby,
						s: md5('actionType1cookieId' + cookie.get('shareuid') + 'uaHidNsVv8Q3x4llxKiKCxTrjYkDeBRi').toLowerCase()
					});
					$this.data('play-started',true);
					setTimeout(function(){
						new Image().src = qs.append(HttpHelper.getOrigin() + '/bolo/api/share/record.htm',{
							actionType: 2,
							videoId: QUERY.videoId,
							cookieId: cookie.get('shareuid'),
							userId: QUERY.sharedby,
							s: md5('actionType2cookieId' + cookie.get('shareuid') + 'uaHidNsVv8Q3x4llxKiKCxTrjYkDeBRi').toLowerCase()
						});
					},VIDEO_INFO.duration / 60 > 5 ? 62000 : 22000);
				}
			}).on('pause',function(){
				self.status = 'pause';
				self.$playBtn.removeClass('pause');
			}).on('timeupdate',function(){
				self.updateVideoLeftTime();
			});

			this.$progressBar.on('touchstart',function(e){
				self.manipulating = true;
				self.updateProgressBar(e.changedTouches[0].pageX);
				Stat.send('play_player_progressBar');
			}).on('touchmove',function(e){
				self.updateProgressBar(e.changedTouches[0].pageX);
			}).on('touchend',function(e){
				self.updateProgressBar(e.changedTouches[0].pageX,true);
			});

			this.$controller.find('.full-screen-btn').tap(function(){
				if(self.video.requestFullscreen) self.video.requestFullscreen();
				else if(self.video.webkitRequestFullscreen) self.video.webkitRequestFullscreen();
				else if(self.video.webkitEnterFullscreen) self.video.webkitEnterFullscreen();
				Stat.send('play_player_fullScreen');
			});

			this.$controller.find('.danmaku-switch').tap(function(){
				var $this = $(this);
				if($this.hasClass('closed')){
					$this.removeClass('closed');
					Danmaku.continueSpeak();
					Stat.send('play_bullet_switch',{
						label: 'state:1'
					});
				}else{
					$this.addClass('closed');
					Danmaku.shutUp();
					Stat.send('play_bullet_switch',{
						label: 'state:2'
					});
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
		},
		stat: function(){
			//后台播放量统计(非友盟)
			if(this.stated) return;
			this.stated = true;
			new Image().src = 'http://m.live.netease.com/bolo/hit/video/' + qs.parse().videoId;
		}
	};

	Video.init();

	var Episodes = {
		$wrapper: $('.episodes'),
		init: function(){
			this.getData();
		},
		render: function(data){
			this.$wrapper.html(tmpl.render('episodes',{
				data: data
			}));
			this.episodesListContainer = this.$wrapper.find('.content');
			var $item = this.$wrapper.find('.item').eq(0);
			if(!$item.length){
				this.$wrapper.hide();
				return;
			}
			this.episodesListContainer.width(this.episodesListContainer.get(0).scrollWidth).on('tap','.item',function(){
				if(!$(this).hasClass('current')){
					Stat.send('play_clickEpisode',{
						label: 'position:' + ($(this).index() + 1)
					});
					location.href = '/m/play?videoId=' + $(this).data('vid');
				}
			});
			this.$wrapper.find('.list-container').scrollLeft(this.$wrapper.find('.item.current').offset().left)
		},
		getData: function(){
			var self = this;
			$.ajax({
				url: HttpHelper.getOrigin() + '/bolo/api/channel/setVideoList.htm',
				dataType: 'jsonp',
				data: {
					sid: VIDEO_INFO.sid,
					pageNum: 1,
					pageSize: -1
				},
				success: function(result){
					console.log(result);
					if(result) self.render(result);
					else self.$wrapper.hide();
				}
			})
		}
	};

	Episodes.init();


	var Comment = {
		$wrapper: $('.comment'),
		currentPage: 1,
		pageSize: 10,
		isFull: false,
		init: function(){
			this.totalComment = this.$wrapper.find('.comment-num').text();
			this.getData(this.currentPage);
			this.bindEvents();
		},
		getData: function(page){
			var self = this;

			if(self.gettingData) return;
			self.gettingData = true;

			$.ajax({
				url: HttpHelper.getOrigin() + '/bolo/api/video/commentList.htm',
				dataType: 'jsonp',
				data: {
					videoId: qs.parse().videoId,
					pageNum: page,
					pageSize: self.pageSize
				},
				success: function(result){
					self.gettingData = false;
					if(result.status == 1){
						self.currentPage = page;
						var html = tmpl.render('comment',{
							data: result.data
						});
						self.$wrapper.find('.comment-container').append(html);
						if(result.data.length < self.pageSize) self.isFull = true;
						if(result.data.length) self.getReplyData(result.data);
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
					self.getData(self.currentPage + 1);
				}
			});
		},
		getReplyData: function(data){
			var self = this;
			data.forEach(function(d){
				if(!d.commentCount) return false;
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/video/commentReplyList.htm',
					dataType: 'jsonp',
					data: {
						cid: d.id
					},
					success: function(result){
						if(result.status == 1){
							var list = tmpl.render('comment-reply-list',{
								data: result.data
							});
							self.$wrapper.find('#c-' + d.id + ' .reply-list').html(list);
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

			this.$authorBox = this.$wrapper.find('.author-info');
			this.$recommend = this.$wrapper.find('.recommend');
			this.$downloadBar = this.$wrapper.find('.download-bar');

			this.bindEvents();
		},
		bindEvents: function(){
			var self = this;

			this.$wrapper.tap(function(){
				Stat.send('play_player_clickScreen');
			});

			this.$wrapper.find('.collect-btn,.tip-box').tap(function(){
				self.$downloadDialog.show();
			});
			this.$wrapper.find('.collect-btn').tap(function(){
				Stat.send('play_videoInfo_mark');
			});
			this.$wrapper.find('.tip-box').tap(function(){
				Stat.send('play_player_wannerMore');
			});

			this.$wrapper.find('.comment-container').delegate('.operation','tap',function(){
				self.$downloadDialog.show();
			});
			this.$wrapper.find('.comment-container').on('tap','.like-btn',function(){
				Stat.send('play_comment_like',{
					label: 'position:' + ($(this).parents('.comment-item').index() + 1)
				});
			});
			this.$wrapper.find('.comment-container').on('tap','.reply-num',function(){
				Stat.send('play_comment_replycomment',{
					label: 'position:' + ($(this).parents('.comment-item').index() + 1)
				});
			});

			this.$authorBox.find('.avatar').tap(function(){
				location.href = '/m/channel?userId=' + self.$authorBox.attr('uid');
				Stat.send('play_IPinfo_clickAvatar');
			});
			this.$authorBox.find('.name').tap(function(){
				location.href = '/m/channel?userId=' + self.$authorBox.attr('uid');
			});
			this.$authorBox.find('.follow-btn').tap(function(){
				self.$downloadDialog.show();
				Stat.send('play_IPinfo_follow');
			});

			this.$downloadDialog.find('.fuck-off,.remove-btn').tap(function(){
				self.$downloadDialog.hide();
				Stat.send('play_down_no');
			});

			this.$wrapper.find('.share-btn').tap(function(){
				self.$shareDialog.show();
				Stat.send('play_videoInfo_share');
			});

			this.$shareDialog.find('.cancel-btn,.remove-btn').tap(function(){
				self.$shareDialog.hide();
			});

			this.$shareDialog.find('.item').tap(function(){
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

			this.$downloadDialog.on('tap',function(){
				self.$downloadDialog.hide();
			}).find('.container').on('tap',function(e){
				e.stopPropagation();
			});

			this.$shareDialog.on('tap',function(){
				self.$shareDialog.hide();
			}).find('.container').on('tap',function(e){
				e.stopPropagation();
			});

			this.$recommend.find('.poster').click(function(e){
				e.preventDefault();
			}).tap(function(){
				Stat.send('play_other_video',{
					label: 'position:' + ($(this).index() + 1)
				});
				location.href = this.href;
			});
			this.$recommend.find('.category-list .item').tap(function(){
				Stat.send('play_other_category',{
					label: 'position:' + ($(this).index() + 1)
				});
				location.href = $(this).data('href');
			});

			this.$downloadBar.find('.download-btn').tap(function(){
				Stat.send('play_down');
			});
			this.$downloadDialog.find('.download-btn').tap(function(){
				self.$downloadDialog.hide();
				Stat.send('play_down_yes');
			}).add(this.$downloadBar.find('.download-btn')).tap(function(){
				if(uadetector.isOS('android') && uadetector.is('MicroMessenger')){
					self.$downloadGuide.show();
				}else native.download('播放页');
			});

			this.$downloadGuide.tap(function(){
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
					location.href = 'http://v.t.sina.com.cn/share/share.php?title=' + encodeURIComponent('我正在看《' + SHARE_INFO.title + '》 @网易菠萝菌” ' + location.href) + '&pic=' + encodeURIComponent(SHARE_INFO.img || '');
					break;
				case 'qzone':
					location.href = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + encodeURIComponent(location.href) + '&title=' + encodeURIComponent(SHARE_INFO.title + ' |网易菠萝') + '&desc=' + encodeURIComponent(SHARE_INFO.intro) + '&pics=' + encodeURIComponent(SHARE_INFO.img || '');
					break;
			}
		}
	};

	Page.init();

});