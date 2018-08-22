/**
 * Created by Dillance on 16/5/19.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('jquery@1-11-x'),
		base = require('base@1-1-x'),
		cookie = require('cookie@1-0-x'),
		tmpl = require('/common/tmpl@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		QRCode = require('qrcode@1-0-x'),
		Stat = require('/common/Stat@1-0-x'),
		qs = require('querystring@1-0-x'),
		flashPlayer = require('/pages/pc/play/1-0-x/modules/flashPlayer'),
		md5 = require('md5@1-0-x');

	var QUERY = qs.parse();

	var Danmaku = {
		$wrapper: $('.video-box .danmaku-wrap'),
		danmakuTrack: 8,
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
						$bullet.css('transform','translate(-' + totalDistance + 'px,0)');
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

	var _video = document.createElement('video');
	if(_video.play) Danmaku.init();
	else{
		$('.video-box').html(flashPlayer.render({
			width: 720,
			height: 405,
			flashvars: {
				videoadv: "",
				sd: VIDEO_INFO.linkMp4,
				hd: "",
				shd: "",
				per: "0.4$$0.3",
				vid: VIDEO_INFO.linkMp4,
				autoPlay: 1,
				ipLimit: 0,
				liveIcon: 0,
				liveQuality: 0,
				defaultLive: 0,
				startTime: "201210311100",
				pltype: -1,
				needReplay: 0,
				cl: "cltest",
				mid: "midtest",
				coverpic: "",
				hds: "0"
			}
		}));
	}

	var Episodes = {
		$wrapper: $('.sub-wrap'),
		init: function(){
			this.getData();
			this.bindEvents();
		},
		render: function(data){
			var total = data.length;
			for(var i = 0;i < data.length;i++){
				if(data[i].videoId == VIDEO_INFO.id){
					data = data.slice(data.indexOf(data[i]));
					break;
				}
			}
			if(data.length > 4) data.length = 4;

			this.$wrapper.html(tmpl.render('episodes',{
				data: data,
				total: total
			}));
		},
		bindEvents: function(){
			this.$wrapper.delegate('a','click',function(){
				Stat.send('Webplay_clickEpisode',{
					label: 'position:' + ($(this).parents('.item').index() + 1)
				});
			});
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
					if(result) self.render(result);
				}
			})
		}
	};

	Episodes.init();

	var Comment = {
		$wrapper: $('.comment-box'),
		init: function(){
			this.getReplyData();
		},
		getReplyData: function(){
			this.$wrapper.find('.item').each(function(){
				var $this = $(this);
				if($this.data('reply-count') == 0) return false;
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/video/commentReplyList.htm',
					dataType: 'jsonp',
					data: {
						cid: $this.data('id')
					},
					success: function(result){
						if(result.status == 1){
							if(result.data.length){
								$this.find('.reply-box').html(tmpl.render('comment-reply-list',{
									data: result.data
								}))
							}
						}
					}
				})
			});
		}
	};

	Comment.init();

	$(document).click(function(){
		Stat.send('Webplay_player_clickScreen');
	});

	$('.header .download-btn').click(function(){
		Stat.send('Webplay_Top_down');
	});
	$('.header .join-btn').click(function(){
		Stat.send('Webplay_Top_join');
	});

	//分享计划统计
	if(QUERY.sharedby){
		//浏览量
		if(!cookie.get('visiteuid')) cookie.set('visiteuid',base.randomStr('vuid'),{
			expires: '1 day'
		});
		new Image().src = qs.append(HttpHelper.getOrigin() + '/bolo/api/share/record.htm',{
			actionType: 0,
			cookieId: cookie.get('visiteuid'),
			videoId: QUERY.videoId,
			userId: QUERY.sharedby,
			s: md5('actionType0cookieId' + cookie.get('visiteuid') + 'uaHidNsVv8Q3x4llxKiKCxTrjYkDeBRi').toLowerCase()
		});
		//下载量
		$('.download-btn').click(function(){
			var data = {
				actionType: 3,
				cookieId: cookie.get('visiteuid'),
				videoId: QUERY.videoId,
				userId: QUERY.sharedby,
				s: md5('actionType3cookieId' + cookie.get('visiteuid') + 'uaHidNsVv8Q3x4llxKiKCxTrjYkDeBRi').toLowerCase()
			};
			new Image().src = qs.append(HttpHelper.getOrigin() + '/bolo/api/share/record.htm',data);
		});
	}

	$('.download-bar .download-btn').click(function(){
		Stat.send('Webplay_play_down');
	});


	$('video').on('play',function(){
		var $this = $(this);
		Stat.send('Webplay_player_clickPlay',{
			label: 'state:2'
		});

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
		Stat.send('Webplay_player_clickPlay',{
			label: 'state:1'
		});
	});


	var $tipDialog = $('.play-tip-dialog');
	$tipDialog.find('.remove-btn,.cancel-btn').click(function(){
		Stat.send('Webplay_down_no');
		$tipDialog.hide();
	});
	$tipDialog.find('.confirm-btn').click(function(){
		Stat.send('Webplay_down_yes');
	});

	$('.wrapper').delegate('.follow-btn,.collect-btn,.send-comment-btn,.like-btn,.comment-btn','click',function(){
		var $this = $(this);
		if($this.hasClass('collect-btn')){
			Stat.send('Webplay_videoInfo_mark');
		}else if($this.hasClass('follow-btn')){
			Stat.send('Webplay_IPinfo_follow');
		}else if($this.hasClass('like-btn')){
			Stat.send('Webplay_comment_like');
		}else if($this.hasClass('comment-btn')){
			Stat.send('Webplay_comment_replycomment');
		}else if($this.hasClass('send-comment-btn')){
			Stat.send('Webplay_comment');
		}
		$tipDialog.show();
	});

	var $shareDialog = $('.share-dialog');
	$shareDialog.find('.remove-btn').click(function(){
		Stat.send('Webplay_share_back');
		$shareDialog.hide();
	});
	$('.share-btn').click(function(){
		Stat.send('Webplay_videoInfo_share');
		$shareDialog.show();
	});
	$shareDialog.find('.item').click(function(){
		switch($(this).data('type')){
			case 'wechat':
			case 'moment':
				break;
			case 'weibo':
				Stat.send('Webplay_share_platform',{
					label: 'platform:weibo'
				});
				window.open('http://v.t.sina.com.cn/share/share.php?title=' + encodeURIComponent('我正在看《' + SHARE_INFO.title + '》 @网易菠萝菌 ' + location.href) + '&pic=' + encodeURIComponent(SHARE_INFO.img || ''));
				break;
			case 'qzone':
				Stat.send('Webplay_share_platform',{
					label: 'platform:qzone'
				});
				window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + encodeURIComponent(location.href) + '&title=' + encodeURIComponent(SHARE_INFO.title + ' |网易菠萝') + '&desc=' + encodeURIComponent(SHARE_INFO.intro) + '&pics=' + encodeURIComponent(SHARE_INFO.img || ''));
				break;
		}
	}).mouseenter(function(){
		switch($(this).data('type')) {
			case 'wechat':
			case 'moment':
				$shareDialog.find('.qrcode').show();
				break;
		}
	}).mouseleave(function(){
		switch($(this).data('type')) {
			case 'wechat':
			case 'moment':
				$shareDialog.find('.qrcode').hide();
				break;
		}
	});

	var $qrcode = $shareDialog.find('.qrcode .body');
	var qrcode = new QRCode($qrcode.get(0), {
		text: location.href,
		width: $qrcode.width(),
		height: $qrcode.height(),
		colorDark : "#000000",
		colorLight : "#ffffff",
		correctLevel : QRCode.CorrectLevel.H
	});
});