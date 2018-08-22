/**
 * Created by Dillance on 16/7/8.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		tmpl = require('/common/tmpl@1-0-x'),
		qs = require('querystring@1-0-x'),
		cookie = require('cookie@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		animation = require('animation@1-0-x'),
		md5 = require('md5@1-0-x'),
		Socket = require('/common/Socket@1-0-x'),
		Promise = require('promise@1-0-x'),
		dialog = require('/common/uiComponent/mobile/dialog@1-0-x');

	var PiecePineapple = function(options){
		this.options = options;
		this.init();
	};

	PiecePineapple.prototype = {
		$wrapper: $('.like-box'),
		colors: ['green','red','yellow'],
		easings: ['easeInOutExpo'],
		init: function(){
			this.$body = $(tmpl.render('piece-pineapple',{
				color: this.colors[Math.floor(Math.random()*this.colors.length)]
			}));
			this.$wrapper.append(this.$body);
			this.animate();
		},
		animate: function(){
			var self = this,
				wrapperWidth = self.$wrapper.width(),
				toTopDistance = self.$body.offset().top - self.$wrapper.offset().top,
				endValue = toTopDistance + self.$body.height(),
				stageTwoStartValue = toTopDistance / 3,
				stageThreeStartValue = toTopDistance / 3 * 2;

			var xRange = wrapperWidth - self.$body.width();

			var x1 = Math.floor(Math.random() * (xRange + 1 + xRange) - xRange),
				x2 = Math.floor(Math.random() * (xRange + 1 + xRange) - xRange);

			self.$body.css('transform','scale(0.5)');

			var firstStage = function(){
				var easings = ['easeOutQuad','easeOutCubic','easeOutQuart'],
					duration = 600 + Math.floor(Math.random() * 400);
				return new Promise(function(resolve,reject){
					self.$body.find('.container').addClass('first-rotate');
					animation.add({
						startValue: 0,
						endValue: stageTwoStartValue,
						duration: duration,
						//easing: easings[Math.floor(Math.random() * easings.length)],
						step: function(value){
							var progress = value / stageTwoStartValue,
								totalProgress = value / endValue;
							self.$body.css({
								transform: 'translate3d(' + self.bezier(0,x1,x2,0,totalProgress) + 'px,' + (-value) + 'px,0) scale(' + (0.5 + 0.5 * progress) + ')'
							});
						},
						oncomplete: function(){
							resolve();
						}
					});
				});
			};

			var secondStage = function(){
				var easings = ['easeOutCubic','linear','easeOutSine'],
					duration = 800 + Math.floor(Math.random() * 800);
				return new Promise(function(resolve,reject){
					self.$body.find('.container').addClass('second-rotate');
					animation.add({
						startValue: stageTwoStartValue,
						endValue: stageThreeStartValue,
						duration: duration,
						//easing: easings[Math.floor(Math.random() * easings.length)],
						step: function(value){
							var totalProgress = value / endValue;
							self.$body.css({
								transform: 'translate3d(' + self.bezier(0,x1,x2,0,totalProgress) + 'px,' + (-value) + 'px,0)'
							});
						},
						oncomplete: function(){
							resolve();
						}
					});
				});
			};

			var thirdStage = function(){
				var duration = 600 + Math.floor(Math.random() * 400);
				return new Promise(function(resolve,reject){
					self.$body.find('.container').addClass('third-rotate');
					animation.add({
						startValue: stageThreeStartValue,
						endValue: endValue,
						duration: duration,
						//easing: self.easings[Math.floor(Math.random() * self.easings.length)],
						step: function(value){
							var progress = value / endValue;
							self.$body.css({
								transform: 'translate3d(' + self.bezier(0,x1,x2,0,progress) + 'px,' + (-value) + 'px,0)',
								opacity: 1 - progress
							});
						},
						oncomplete: function(){
							resolve();
						}
					});
				});
			};

			firstStage().then(secondStage).then(thirdStage).then(function(){
				self.$body.remove();
			});

		},
		bezier: function(p0,p1,p2,p3,t){
			//贝塞尔三次方曲线公式
			return p0 * Math.pow((1 - t),3) + 3 * p1 * t * Math.pow((1 - t),2) + 3 * p2 * Math.pow(t,2) * (1 - t) + p3 * Math.pow(t,3);
		}
	};

	function encryptToken(redisToken, timestamp, random) {
		var isPrime = function(n) {
			if (n % 2 == 0) {
				return false;
			}
			var circle = Math.sqrt(n);
			for (var i = 3; i <= circle; i += 2) {
				if (n % i == 0) {
					return false;
				}
			}
			return true;
		};
		var sb = [];
		var token = redisToken + timestamp + random;
		//var token = '9122f3191f9d0ccc8946ec7c2536350a' + '1401176306854' + '8246026488884602';
		for (var i = 0; i < token.length; i++) {
			if (!isPrime(i)) {
				sb.push(token.charAt(i));
			}
		}
		//require('common/Md5');
		return md5(sb.join(''));
	}

	var Message = {
		$wrapper: $('.message-box'),
		init: function(){
			var self = this;
			this.$content = this.$wrapper.find('.content');
			this.bindEvents();

			this.insert({
				respType: 'noticeMsg',
				respBody: ''
			});

			setInterval(function(){
				var $items = self.$content.find('.message-item');
				if($items.length >= 50){
					$item.filter(function(index){
						return index < 50
					}).remove();
				}
			},30000);
		},
		bindEvents: function(){
			var self = this;
			Socket.on('groupChatMsg followMsg enter noticeMsg',function(data){
				if(data.respCode == 200){
					self.insert(data);
				}
			});
		},
		insert: function(data){
			var self = this;
			var $messageItem = $(tmpl.render('message',{
				type: data.respType,
				data: data.respBody
			}));
			this.$content.append($messageItem);
			setTimeout(function(){
				self.scrollToBottom($messageItem.height());
			},50);
		},
		scrollToBottom: function(addedHeight){
			var scrollHeight = this.$content.get(0).scrollHeight - (addedHeight || 0),
				viewHeight = this.$content.height(),
				scrollDistance = scrollHeight - viewHeight;
			if(scrollHeight > viewHeight && this.$content.scrollTop() >= scrollDistance - 20){
				this.$content.scrollTop(scrollDistance + 2);
			}
		}
	};

	var Page = {
		$wrapper: $('.wrapper'),
		roomId: qs.parse().roomId,
		init: function(){
			this.$mainContainer = this.$wrapper.find('.main-container');
			this.$pageContainers = this.$mainContainer.find('.page-container');
			this.$videoBox = this.$mainContainer.find('.video-box');
			this.$video = this.$videoBox.find('video');
			this.video = this.$video.get(0);
			this.$restTip = this.$videoBox.find('.rest-tip');
			this.$authorBox = this.$mainContainer.find('.author-box');
			this.$liveCount = this.$videoBox.find('.live-count');
			this.$likeBtn = this.$wrapper.find('.like-btn');
			this.$messageBox = this.$wrapper.find('.message-box .content');

			this.$relevanceBox = $('.relevance');
			this.$recommendBox = $('.recommend');

			this.$downloadTip = $('.download-tip');
			this.downloadDialog = dialog.Download.init();

			this.render();
			this.bindEvents();

			Message.init();

			this.enderRoom();

			this.getMoreVideo();
		},
		render: function(){
			var self = this;
			this.$pageContainers.eq(0).css('height',this.$wrapper.height());
			//this.$mainContainer.css('height',this.$pageContainers.length * this.$wrapper.height());

			this.autoLike();

			setTimeout(function(){
				if(!cookie.get('isShowedToday')){
					self.$video.hide();
					self.$downloadTip.show();
					cookie.set('isShowedToday','true',{
						expires: '1 day'
					});
				}
			},30000);
		},
		bindEvents: function(){
			var self = this;

			//this.$wrapper.swipeUp(function(){
			//	if(!self.$mainContainer.hasClass('second-page')) self.$mainContainer.addClass('second-page');
			//}).swipeDown(function(){
			//	if(self.$mainContainer.hasClass('second-page')) self.$mainContainer.removeClass('second-page');
			//});

			//this.$messageBox.data('is-bottom',true).scroll(function(){
			//	var $this = $(this),
			//		thisHeight = $this.height(),
			//		scrollHeight = $this.get(0).scrollHeight;
			//	if(scrollHeight > thisHeight && $this.scrollTop >= scrollHeight - thisHeight - 2){
			//		self._setMessageScrollableTimer = setTimeout(function(){
			//			$this.data('is-bottom',true);
			//		},100);
			//	}else{
			//		if(self._setMessageScrollableTimer) clearTimeout(self._setMessageScrollableTimer);
			//		$this.data('is-bottom',false);
			//	}
			//}).swipeUp(function(e){
			//	e.stopPropagation();
			//	if($(this).data('is-bottom')){
			//		if(!self.$mainContainer.hasClass('second-page')) self.$mainContainer.addClass('second-page');
			//	}
			//});

			this.$authorBox.tap(function(){
				location.href = $(this).data('href');
			}).find('.follow-btn').tap(function(e){
				e.stopPropagation();
			});

			this.$likeBtn.tap(function(){
				new PiecePineapple();
			});

			this.$wrapper.find('.follow-btn,.tip-bar,.send-btn').tap(function(){
				self.downloadDialog.show();
			});

			this.$downloadTip.on('touchmove',function(e){
				e.stopPropagation();
				e.preventDefault();
			}).find('.remove-btn').tap(function(){
				self.$video.show();
				self.$downloadTip.hide();
			});

			Socket.on('dashboard roomNumberUpdateMsg',function(data){
				if(data.respCode == 200){
					self.$liveCount.text(data.respBody.roomNum);
				}
			});
			Socket.on('supportMsg',function(data){
				if(data.respCode == 200){
					new PiecePineapple();
				}
			});
			Socket.on('noticeMsg',function(data){
				if(data.respCode == 200){
					if(data.respBody.type == 1){
						self.video.pause();
					}else if(data.respBody.type == 2){
						self.video.play();
					}
				}
			});
			Socket.on('roomBroadcastEnd',function(data){
				if(data.respCode == 200){
					self.video.pause();
					self.$video.hide();
					self.$restTip.show();
				}
			});
			Socket.on('roomBroadcastStart',function(data){
				if(data.respCode == 200){
					self.video.play();
					self.$video.show();
					self.$restTip.hide();
				}
			});


			this.$relevanceBox.add(this.$recommendBox).on('tap','.item',function(){
				location.href = '/m/play?videoId=' + $(this).data('id');
			});

		},
		enderRoom: function(){
			var self = this;
			this.getVisitorData().then(function(userInfo){
				return self.getSocketAddress(userInfo);
			}).then(function(socketAddr){
				Socket.init(socketAddr.domain + ':' + socketAddr.wsPort + '/websocket');
				//进房
				Socket.send({
					random: self.userInfo.random,
					roomId: parseInt(self.roomId),
					userId: self.userInfo.userId,
					action: 'enter',
					captchaCode: '',
					token: self.userInfo.token,
					captchaToken: '',
					timestamp: self.userInfo.timestamp,
					platform: 'android',
					region: 'zh_cn',
					fp: ''
				});
			});
		},
		getVisitorData: function(roomId){
			var self = this;
			return new Promise(function(resolve,reject){
				$.ajax({
					url: HttpHelper.getOrigin('test.bobo.com','www.bobo.com') + '/api/accessToken?type=anon',
					dataType: 'jsonp',
					success: function(result){
						self.userInfo = {
							userId: result.userId,
							timestamp: Math.round(new Date().getTime() / 1000).toString(),
							random: Math.random().toString()
						};
						self.userInfo.token = encryptToken(result.token,self.userInfo.timestamp,self.userInfo.random);
						resolve(self.userInfo);
					}
				});
			});
		},
		autoLike: function(){
			var self = this;
			var count = 0;
			var timer = function(){
				new PiecePineapple();
				setTimeout(function(){
					count++;
					if(count >= 15){
						timer = '';
					}else timer();
				},50 + Math.floor(Math.random() * 150));
			};
			timer();

			setTimeout(function(){
				self.autoLike();
			},10000 + Math.floor(Math.random() * 10000));

		},
		getSocketAddress: function(userInfo){
			var self = this;
			return new Promise(function(resolve,reject){
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/loginserver/distribute.do',
					dataType: 'jsonp',
					data: {
						data: JSON.stringify({
							userId: userInfo.userId,
							roomId: self.roomId
						})
					},
					success: function(result){
						resolve(result.data);
					}
				});
			});
		},
		getMoreVideo: function(){
			var self = this;
			$.ajax({
				url: HttpHelper.getOrigin() + '/bolo/api/channel/videoList.htm',
				dataType: 'jsonp',
				data: {
					userId: ROOM_INFO.userIdStr,
					pageNum: 1,
					pageSize: 4
				},
				success: function(result){
					if(result && result.length){
						self.$relevanceBox.find('.list-wrap').html(tmpl.render('video-item',{
							data: result,
							getImage: HttpHelper.getImage
						}));
					}
				}
			});
			$.ajax({
				url: HttpHelper.getOrigin() + '/bolo/api/index/videoRecommend.htm',
				dataType: 'jsonp',
				data: {
					isFirst: 1,
					pageNum: 1,
					pageSize: 4
				},
				success: function(result){
					if(result && result.length){
						self.$recommendBox.find('.list-wrap').html(tmpl.render('video-item',{
							data: result,
							getImage: HttpHelper.getImage
						}));
					}
				}
			});
		}
	};

	Page.init();

});