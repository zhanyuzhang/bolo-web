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
		danmakuTrack: 10,
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

					this.cleanRestBulletTimer.push(

						setTimeout(function(){
							self.shoot(list);
						},200)

					);
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
		init: function() {

			// 如果是加锁视频，则重定向
			if(+VIDEO_INFO.isLock === 2) {
				location.href = location.href.replace(/videoId=(\d+)/, 'videoId=' + VIDEO_INFO.previewVideoId) + '&isPreview=' + VIDEO_INFO.isLock;
			}

			this.isPreview = QUERY.isPreview ? +QUERY.isPreview : 0;
			this.$video = this.$wrapper.find('video');
			this.$replaceImg = this.$wrapper.find('.replace-img');
			this.video = this.$video.get(0);
			this.$controller = this.$wrapper.find('.controller');
			this.$authorInfo = this.$wrapper.find('.author-info');
			this.$firstPlayBtn = this.$wrapper.find('.first-play-btn');
			this.$playBtn = this.$controller.find('.play-btn');
			this.$progressBar = this.$controller.find('.progress-bar');
			this.$leftTime = this.$controller.find('.time');
			this.$videoBoxEnd = this.$wrapper.find('.video-box-end');
			this.duration = VIDEO_INFO.duration;
			this.$lockedVideoPlayingTips = this.$wrapper.find('.locked-video-playing-tips');
			this.$lockedVideoEndTips = this.$wrapper.find('.locked-video-end-tips');
			this.$buyBtn = this.$wrapper.find('.buy-btn');
			this.bindControllerEvents();

			if(!uadetector.isOS('ios')) {
				this.$lockedVideoPlayingTips.find('.wording').removeClass('bottom').addClass('top');
			}

			//this.video.play();
			if(VIDEO_INFO.isLock == 1) {
				$('.lock-dialog').show();
			}
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

			//尝试拉起菠萝app,在网易bobo内会被拦截
			if(!uadetector.is('NETEASEBOBO')){
				this.$wrapper.append('<iframe style="display:none;" src="bolo://com.netease.bolo.android/video?id=' + QUERY.videoId + '"></iframe>');
			}
		},
		bindControllerEvents: function(){
			var self = this;
			
			self.$buyBtn.tap(function (event) {

				Stat.send(event.target.dataset.stat);
				native.download('播放页');
			});
			
			this.$wrapper.singleTap(function(){
				if(self.hideControllerTimer) clearTimeout(self.hideControllerTimer);
				if(!self.$controller.hasClass('show')){
					self.$controller.addClass('show');
					self.$authorInfo.addClass('show');
					self.hideControllerTimer = setTimeout(function(){
						self.$controller.removeClass('show');
						self.$authorInfo.removeClass('show');
					},5000);
				}else{
					self.$controller.removeClass('show');
					self.$authorInfo.removeClass('show');
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
				self.$authorInfo.removeClass('show');
				Stat.send('play_player_clickPlay',{
					label: 'state:2'
				});
			});

			this.$video.on('play',function(){
				var $this = $(this);
				self.status = 'playing';
				self.$playBtn.addClass('pause');
				self.stat();
				if(Video.isPreview > 0) {
					self.$lockedVideoPlayingTips.removeClass('hidden');
				}
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
					},Video.duration / 60 > 5 ? 62000 : 22000);
				}
			}).on('pause',function(){
				self.status = 'pause';
				self.$playBtn.removeClass('pause');
			}).on('timeupdate',function(){
				self.updateVideoLeftTime();
			}).on('ended', function () {
				self.endVideo();
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
				leftTime = Video.duration - Math.floor(self.video.currentTime),
				minute = Math.floor(leftTime / 60),
				second = leftTime % 60;
			self.$leftTime.text((minute > 9 ? minute : '0' + minute) + ':' + (second > 9 ? second : '0' + second));
			if(!self.manipulating) self.$progressBar.find('.dynamic-bar').css('width',(self.video.currentTime / Video.duration) * 100 + '%');
			if(self.video.currentTime>=(Video.duration-1)){
				self.video.pause();
				self.endVideo();
			}
		},
		updateProgressBar: function(x,playWithNewPosition){
			var self = this,
				width = x - self.$progressBar.offset().left;
			self.$progressBar.find('.dynamic-bar').css('width',width + 'px');
			if(playWithNewPosition){
				self.manipulating = false;
				self.video.currentTime = width / self.$progressBar.width() * Video.duration;
				self.video.play();
			}
		},
		stat: function(){
			//后台播放量统计(非友盟)
			if(this.stated) return;
			this.stated = true;
			new Image().src = HttpHelper.getOrigin() + '/bolo/hit/video/' + qs.parse().videoId;
		},
		endVideo:function() {
			if(!uadetector.isOS('ios')) {
				this.$video.addClass('hidden');
				this.$replaceImg.removeClass('hidden');
			}
			if(Video.isPreview > 0) {
				this.$lockedVideoEndTips.removeClass('hidden');
				this.$lockedVideoPlayingTips.addClass('hidden');
			} else {
				this.$videoBoxEnd.removeClass('hidden');
			}
		}
	};

	Video.init();

	var comment = require('/common/uiComponent/mobile/comment@1-0-x');

	var Page = {
		$wrapper: $('.play-wrapper'),
		init: function(){
			this.$guideDialog = this.$wrapper.find('.share-guide');
			this.$downloadDialog = this.$wrapper.find('.download-dialog');
			this.$lockDialog = this.$wrapper.find('.lock-dialog');
			this.$shareDialog = this.$wrapper.find('.share-box');
			this.$downloadGuide = this.$wrapper.find('.download-guide');

			this.$authorBox = this.$wrapper.find('.author-info');
			this.$recommend = this.$wrapper.find('.recommend');
			this.$downloadBar = this.$wrapper.find('.download-bar');
			this.$openAppBtn = this.$downloadBar.find('.open-btn')
			this.$openAppGuide = this.$wrapper.find('.open-app-guide');

			this.$alwaysHere = this.$wrapper.find('.always-here');

			this.bindEvents();
			comment.initParms();
			comment.init(this.$wrapper);
			var num = Math.floor(Math.random()*3);
			if(num==1){
				this.$alwaysHere.find('.chat').find('p').html('2.5次元污萌贱视频社区，马上开启传送门！')
				this.$alwaysHere.find('.btn').html('下载聊聊')
			}else if(num==2){
				this.$alwaysHere.find('.chat').find('p').html('进可御姐，退可萝莉，重口清新这里全都有！')
				this.$alwaysHere.find('.btn').html('下载聊聊')
			}
			if(uadetector.isOS('ios')) {
				this.$openAppBtn.addClass('hidden');
			}
			
		},
		bindEvents: function(){
			var self = this;
			$('.banner-content .item a').tap(function(e){
				Stat.send('play_otherBanner');
				location.href = $(this).data('url');
			})
			this.$alwaysHere.find('.face').tap(function(e){

				if(self.$alwaysHere.find('.chat').hasClass('hide')){
					self.$alwaysHere.find('.chat').removeClass('hide');
				}else{
					self.$alwaysHere.find('.chat').addClass('hide');
				}
				Stat.send('play_bolo');
			})
			this.$alwaysHere.find('.chat').tap(function(e){

				if(self.$alwaysHere.find('.chat').hasClass('hide')){
					self.$alwaysHere.find('.chat').removeClass('hide');
				}else{
					self.$alwaysHere.find('.chat').addClass('hide');
				}
				Stat.send('play_bolo');
			})

			this.$alwaysHere.find('.btn').tap(function(e){
				e.preventDefault();
				//self.$downloadDialog.show();
				Stat.send('play_bolo_down');
				native.download('播放页');
				return false;
			})
			this.$wrapper.tap(function(){
				Stat.send('play_player_clickScreen');
			});

			this.$wrapper.find('.collect-btn,.tip-box').tap(function(){
				//self.$downloadDialog.show();
			});
			this.$wrapper.find('.rec-tip').tap(function(){
				Stat.send('play_otherVidio_down');
				//self.$downloadDialog.show();
			})
			this.$wrapper.find('.collect-btn').tap(function(){
				Stat.send('play_videoInfo_mark');
			});
			this.$wrapper.find('.tip-box').tap(function(){
				//Stat.send('play_player_wannerMore');
				Stat.send('play_lookall_down');
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
			this.$authorBox.find('.follow-btn').tap(function() {
				native.download('播放页');
				// self.$downloadDialog$downloadDialog.show();
				// Stat.send('play_IPinfo_follow');
			});

			this.$downloadDialog.find('.fuck-off,.remove-btn').tap(function(){
				self.$downloadDialog.hide();
				Stat.send('play_down_no');
			});
			this.$lockDialog.find('.fuck-off,.remove-btn').tap(function(){
				self.$lockDialog.hide();
				Stat.send('play_down_no');
			})
			this.$wrapper.find('.share-btn').tap(function(){
				self.$shareDialog.show();
				Stat.send('play_videoInfo_share');
				return false;
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
			this.$lockDialog.on('touchmove',function(e){
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

			this.$lockDialog.on('tap',function(){
				self.$lockDialog.hide();
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
				native.download('播放页');
			});

			this.$lockDialog.find('.download-btn').tap(function(){
				self.$lockDialog.hide();
				Stat.send('play_down_yes');
				native.download('播放页');
			})
			.add(this.$downloadBar.find('.download-btn'))
			.add(this.$wrapper.find('.collect-btn,.tip-box'))
			.add(this.$wrapper.find('.rec-tip'))
			.tap(function(){
				//if(uadetector.isOS('android') && uadetector.is('MicroMessenger')){
				//	self.$downloadGuide.show();
				//}else native.download('播放页');
				native.download('播放页');
			});

			$('.locked-video .download-btn').tap(function(){
				native.download('播放页');
			});

			this.$downloadGuide.tap(function(){
				self.$downloadGuide.hide();
			});
			
			this.$openAppBtn.tap(function () {
				if(uadetector.is('NETEASEBOBO')){
					native.download('播放页');
				}else{
					self.$openAppGuide.removeClass('hidden');
				}
				Stat.send('play_open');
			});
			this.$openAppGuide.tap(function () {
				$(this).addClass('hidden');
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

	var InfoScale = {
		$wrapper:$('.video-info-box'),
		init:function(){
			this.icon = this.$wrapper.find('.video-info-box-scale').find('.icon');
			this.des = this.$wrapper.find('.description');
			this.tags = this.$wrapper.find('.tags-box');
			this.title = this.$wrapper.find('.video-title');
			this.onEvents();
		},
		onEvents:function(){
			var self = this;

			this.$wrapper.tap(function(){
				if(self.des.hasClass('show')){
					self.des.removeClass('show');
					self.tags.removeClass('show');
					self.icon.removeClass('cur');
				}else{
					self.des.addClass('show');
					self.tags.addClass('show');
					self.icon.addClass('cur');
				}
				Stat.send('play_videoinfo');
			})
			
		}
	}

	InfoScale.init();

	var VideoEnd = {
		$wrapper:$('.video-box-end'),
		init:function(){
			this.$downloadDialog = $('.download-dialog');
			this.$items = this.$wrapper.find('.video-lists').find('.item');
			this.$rsBtn = this.$wrapper.find('.video-box-end-reset');
			this.video = $('.video-box').find('video').get(0);
			this.getData();
		},
		onEvents:function(){
			var self = this;
			this.$wrapper.find('.video-box-end-btn').tap(function() {
				//self.$downloadDialog.show();
				Stat.send('play_end_down');
				native.download('播放页');
			});
			this.$items.tap(function () {
				Stat.send('play_end_cover' + (this === self.$items[0]) ? 0 : 1);
				window.location.href = document.location.href.replace(/videoId=\d+/i, 'videoId=' + this.dataset.vid);
			});

			// this.$items.eq(0).tap(function(){
			// 	//location.href = '/m/play?videoId=' + $(this).data('vid') + '&bid=' + $(this).data('vid');
			// 	Stat.send('play_end_cover1');
			// 	self.$downloadDialog.show();
			// })
			// this.$items.eq(1).tap(function(){
			// 	//location.href = '/m/play?videoId=' + $(this).data('vid') + '&bid=' + $(this).data('vid');
			// 	Stat.send('play_end_cover2');
			// 	self.$downloadDialog.show();
			// })

			this.$rsBtn.tap(function() {
				location.reload();
				// self.$wrapper.addClass('hidden');
				// self.video.load();
				// self.video.play();
			})
		},
		getData:function() {
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
					var eachSet = function(i,data){
						self.$items.eq(i).attr('data-vid',data.videoId);
						self.$items.eq(i).find('img').attr('src',data.cover);
						self.$items.eq(i).find('.bottom p').html(data.title);
					}
					for(var i=0;i<result.length;i++){
						if(result[i].videoId==VIDEO_INFO.id){
							if(i>1){
								//前两集显示
								eachSet(0,result[i-1]);
								eachSet(1,result[i-2]);
							}
							if(i==1){
								eachSet(0,result[i-1]);
								if(result.length>2){
									eachSet(1,result[i+1]);
								}else{
									//更多推荐的第一个
									eachSet(1,REC_DATA[0]);
								}
							}
							if(i==0){
								if(result.length>2){
									eachSet(0,result[i+1]);
									eachSet(1,result[i+2]);
								}
								if(result.length==2){
									eachSet(0,result[i+1]);
									//更多推荐的第一个
									eachSet(1,REC_DATA[0]);
								}
								if(result.length==1){
									//更多推荐的两个
									eachSet(0,REC_DATA[0]);
									eachSet(1,REC_DATA[1]);
								}
							}
						}
					}
					self.onEvents();
					
				}
			})
		}
	};
	VideoEnd.init();

});