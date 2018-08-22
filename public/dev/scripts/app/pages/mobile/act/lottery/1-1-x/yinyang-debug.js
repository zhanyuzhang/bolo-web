define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		base = require('base@1-1-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		cookie = require('cookie@1-0-x'),
		tmpl = require('/common/tmpl@1-0-x'),
		uadetector = require('uadetector@1-0-x'),
		animation = require('animation@1-0-x'),
		Promise = require('promise@1-0-x'),
		dialog = require('/pages/mobile/act/lottery/1-1-x/modules/dialog'),
		wechat = require('/common/wechat@1-0-x'),
		loading = require('/common/uiComponent/mobile/loading@1-0-x'),
		Stat = require('/common/Stat@1-0-x'),
		qs = require('querystring@1-0-x'),
		native = require('/common/native@1-1-x');

	if(uadetector.isDevice('pc')) location.href = '/act/lottery/yinyang';

	var QUERY = qs.parse();

	var $window = $(window);
	$window.resize(function(){
		if($window.width() > $window.height()){
			$('.wrapper').addClass('horizontal');
		}else{
			$('.wrapper').removeClass('horizontal');
		}
	}).trigger('resize');

	$.ajax({
		url: HttpHelper.getOrigin() + '/bolo/api/public/awardList.htm',
		dataType: 'json',
		success:function(result){
			var data = {};
			result.forEach(function(r){
				if(!data[r.awardRank]){
					data[r.awardRank] = [];
				}
				data[r.awardRank].push(r);
			});
			dialog.prizeList.find('.prize-list').html(tmpl.render('prize-list',{
				data: data
			}));
		}
	});

	var Page = {
		$wrapper: $('.wrapper'),
		init: function(){
			this.$startNrBtn = this.find('.start-nr-btn');
			this.$startSsrBtn = this.find('.start-ssr-btn');
			this.$lotteryAnimation = this.find('.lottery-animation');
			this.$drawingBoard = $('.drawing-board');
			this.$prizeListBtn = this.find('.prize-list-btn');

			this.$resultBox = this.find('.result-box');
			this.$unluckyBox = this.find('.unlucky-box');

			this.$shareGuide = $('.share-guide');

			this.$musicBtn = this.find('.music-btn');
			this.$bgm = this.find('.bgm');
			this.$lotterySound = this.find('.lottery-sound');

			this.userInfoPromise = this.getUserInfo();

			this.render();
			this.bindDialogEvents();
			this.bindEvents();
			this.bindCanvasEvents();
		},
		find: function(selector){
			return this.$wrapper.find(selector);
		},
		render: function(){
			var self = this;
			this.$startNrBtn.css('display','block');
			this.$startSsrBtn.css('display','block');
			this.find('.firework').show();
			if(native.hello()){
				this.$startSsrBtn.removeClass('disable');
				this.getSSRLeftTime().then(function(data){
					self.$startSsrBtn.find('.num').text(data.times);
					return data.times;
				});
			}
			this.getNRLeftTime().then(function(data){
				self.$startNrBtn.find('.num').text(data.times);
				return data.times;
			});

			if(this.$bgm.get(0).paused) this.$musicBtn.addClass('off');
		},
		bindDialogEvents: function(){
			var self = this;
			dialog.phone.find('.submit-btn').tap(function(){
				var value = dialog.phone.find('input').val();
				if(value.length == 11){
					self.userInfoPromise.then(function(userInfo){
						var data = {};
						if(dialog.phone.data.type == 'nr') data.cookieId = userInfo.cookieId;
						else data.userId = userInfo.userId;
						data.awardId = dialog.phone.data.id;
						data.phone = value;
						$.getJSON(HttpHelper.getOrigin() + '/bolo/api/public/drawRegister.htm',data,function(result){
							if(result.status == 1){
								alert('提交成功');
								dialog.phone.hide();
							}else{
								alert('提交失败,请重试')
							}
						});
					});
				}else{
					alert('请输入正确手机号')
				}
			});
			dialog.exchange.find('.download-btn').tap(function(){
				location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.netease.bolo.android';
			});
			dialog.limitTip.find('.come-tomorrow-btn').tap(function(){
				dialog.limitTip.hide();
				Stat.send('award_toast_sure');
			});
			dialog.openBolo.find('.open-btn').tap(function(){
				Stat.send('award_toast_open');
				location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.netease.bolo.android';
			});
		},
		bindEvents: function(){
			var self = this;
			this.$prizeListBtn.tap(function(){
				dialog.prizeList.show();
				Stat.send('award_main_gift');
			});
			this.$startNrBtn.tap(function(){
				if(self.lotteryLoading) return false;
				if(self.$startNrBtn.find('.num').text() <= 0){
					dialog.limitTip.show();
					return false;
				}
				self.$lotteryAnimation.hide().removeClass('start').show().data('type','nr');
				self.$drawingBoard.show();
				Stat.send('award_main_small');
			});
			this.$startSsrBtn.tap(function(){
				if(self.lotteryLoading) return false;
				if(self.$startSsrBtn.hasClass('disable')){
					dialog.openBolo.show();
					return false;
				}else if(self.$startSsrBtn.find('.num').text() <= 0){
					dialog.limitTip.show();
					return false;
				}else{
					self.userInfoPromise.then(function(userInfo){
						if(!userInfo.userId) native.call('loginApp');
						else{
							self.$lotteryAnimation.hide().removeClass('start').show().data('type','ssr');
							self.$drawingBoard.show();
						}
					});
				}
				Stat.send('award_main_big');

			});
			this.$lotteryAnimation.tap(function(e){
				e.stopPropagation();
			});
			this.$drawingBoard.on('touchend',function(){
				var type = self.$lotteryAnimation.data('type');
				if(self.lotteryLoading) return false;
				self.lotteryLoading = true;
				self.userInfoPromise.then(function(userInfo){
					var data = {};
					if(type == 'nr') data.cookieId = userInfo.cookieId;
					else data.userId = userInfo.userId;
					data.type = type;
					return data;
				}).then(function(userData){
					Promise.all([self.getLotteryResult(userData),self.startLotteryAnimation()]).then(function(array){
						var result = array[0];
						if(result.status != 1){
							alert(result.errorMsg);
							return false;
						}
						if(result.awardRank == 'N'){
							self.$unluckyBox.find('.advice').text(result.awardName);
							self.$unluckyBox.addClass('show').data('type',type);
						}else{
							self.$resultBox.find('.prize-wrap').html(tmpl.render('result',{
								data: result
							}));
							self.$resultBox.addClass('show').data({
								type: type,
								id: result.awardId
							});
						}
						if(userData.type == 'nr') self.$startNrBtn.find('.num').text(result.times);
						else self.$startSsrBtn.find('.num').text(result.times);

						self.lotteryLoading = false;
					});
				}).catch(function(err){
					alert(err)
				});
			});

			this.$resultBox.tap(function(e){
				e.stopPropagation();
			});
			this.$resultBox.find('.confirm-btn').tap(function(){
				var data = self.$resultBox.data();
				self.$resultBox.removeClass('show');
				if(data.id == 20){
					if(native.hello()){
						location.href = '/m/hybrid/cdkey?code=bolo2017';
					}else{
						dialog.exchange.show();
					}
				}else{
					dialog.phone.data = data;
					dialog.phone.show();
				}
				self.$lotterySound.get(0).pause();
				self.$lotterySound.get(0).currentTime = 0;
				self.$bgm.get(0).play();

				Stat.send('award_result_sure');
			});
			this.$resultBox.find('.remove-btn').tap(function(){
				self.$resultBox.removeClass('show');
				self.$lotterySound.get(0).pause();
				self.$lotterySound.get(0).currentTime = 0;
				self.$bgm.get(0).play();
				if(self.$resultBox.data('type') == 'nr') self.$startNrBtn.trigger('tap');
				else self.$startSsrBtn.trigger('tap');

				Stat.send('award_result_again');
			});
			this.$resultBox.find('.share-btn').tap(function(){
				self.$shareGuide.show();
				Stat.send('award_result_share');
			});

			self.$shareGuide.tap(function(){
				self.$shareGuide.hide();
			});

			this.$unluckyBox.tap(function(e){
				e.stopPropagation();
				self.$unluckyBox.removeClass('show');
				self.$lotterySound.get(0).pause();
				self.$lotterySound.get(0).currentTime = 0;
				self.$bgm.get(0).play();
			}).find('.container').tap(function(e){
				e.stopPropagation();
			});
			this.$unluckyBox.find('.remove-btn').tap(function(){
				self.$unluckyBox.removeClass('show');
				self.$lotterySound.get(0).pause();
				self.$lotterySound.get(0).currentTime = 0;
				self.$bgm.get(0).play();
				if(self.$unluckyBox.data('type') == 'nr') self.$startNrBtn.trigger('tap');
				else self.$startSsrBtn.trigger('tap');
			});
			this.$unluckyBox.find('.confirm-btn').tap(function(){
				self.$shareGuide.show();
			});

			this.find('.rules-btn').tap(function(){
				dialog.rules.show();
				Stat.send('award_main_rule');
			});
			this.find('.soup-btn,.video-btn,.more-btn,.figure img').tap(function(){
				var data = $(this).data();
				data.stat && Stat.send(data.stat);
				location.href = data.url;
			});

			this.$musicBtn.tap(function(e){
				e.stopPropagation();
				if(self.$musicBtn.hasClass('off')){
					self.$bgm.get(0).play();
					self.$musicBtn.removeClass('off');
				}else{
					self.$bgm.get(0).pause();
					self.$musicBtn.addClass('off');
				}
				Stat.send('award_main_voice');
			});

			self.$bgm.on('play',function(){
				self.$musicBtn.removeClass('off');
			}).on('pause',function(){
				self.$musicBtn.addClass('off');
			});

			//this.$wrapper.tap(function(){
			//	self.$bgm.get(0).play();
			//});
		},
		getUserInfo: function(){
			var cookieId;
			if(QUERY.unlimited != 'yes') cookieId = cookie.get('visitorId');
				if(!cookieId){
				cookieId = base.randomStr();
				cookie.set('visitorId',cookieId,{
					expires: '1 day'
				});
			}
			if(native.hello()){
				return native.userPromise.then(function(userInfo){
					if(!userInfo) userInfo = {};
					userInfo.cookieId = cookieId;
					return userInfo;
				});
			}else{
				return Promise.resolve({
					cookieId: cookieId
				});
			}
		},
		getNRLeftTime: function(){
			return this.userInfoPromise.then(function(userInfo){
				return new Promise(function(resolve,reject){
					$.getJSON(HttpHelper.getOrigin() + '/bolo/api/public/drawByAllLeftTimes.htm',{
						cookieId: userInfo.cookieId
					},function(result){
						if(result.status == 1){
							resolve(result);
						}else{
							reject(result.errorMsg);
						}
					})
				});
			})
		},
		getSSRLeftTime: function(){
			return this.userInfoPromise.then(function(userInfo){
				if(!userInfo.userId) return Promise.reject('未登录');
				return new Promise(function(resolve,reject){
					$.getJSON(HttpHelper.getOrigin() + '/bolo/api/public/drawByAllLeftTimes.htm',{
						userId: userInfo.userId
					},function(result){
						if(result.status == 1){
							resolve(result);
						}else{
							reject(result.errorMsg);
						}
					})
				});
			})
		},
		getLotteryResult: function(data){
			return new Promise(function(resolve,reject){
				var d = $.extend(true,{},data);
				d.type = QUERY.from == 'netease' ? 1 : 0;
				$.getJSON(HttpHelper.getOrigin() + '/bolo/api/public/drawByAll',d,function(result){
					if(result.status == 1){
						resolve(result);
					}else{
						reject(result.errorMsg);
					}
				})
			});
		},
		startLotteryAnimation: function(){
			this.$lotteryAnimation.addClass('start');
			this.$lotterySound.get(0).play();
			this.$bgm.get(0).pause();
			return new Promise(function(resolve){
				setTimeout(function(){
					resolve();
				},2000);
			});
		},
		bindCanvasEvents: function(){
			var self = this,
				canvas = this.$drawingBoard.get(0);
			this.ctx = canvas.getContext('2d');
			this.ctx.lineWidth = 10;
			this.$drawingBoard.on('touchstart',function(e){
				e.preventDefault();
				canvas.width = $window.width();
				canvas.height = $window.height();
				self.lastX = e.touches[0].clientX;
				self.lastY = e.touches[0].clientY;
				self.drawRound(self.lastX,self.lastY);
			}).on('touchmove',function(e){
				e.preventDefault();
				var currentX, currentY;
				currentX = e.touches[0].clientX;
				currentY = e.touches[0].clientY;
				self.drawLine(self.lastX,self.lastY,currentX,currentY);
				self.lastX = currentX;
				self.lastY = currentY;
			}).on('touchend',function(){
				canvas.width = canvas.width;
				self.$drawingBoard.hide();
			});
		},
		drawRound: function(x,y){
			this.ctx.fillStyle="#fffabc";
			this.ctx.beginPath();
			this.ctx.arc(x,y,5,0,Math.PI*2,true);
			this.ctx.closePath();
			this.ctx.fill();
		},
		drawLine: function(startX,startY,endX,endY){
			this.ctx.lineWidth = 10;
			this.ctx.strokeStyle = '#fffabc';
			this.ctx.lineCap = 'round';
			this.ctx.beginPath();
			this.ctx.moveTo(startX,startY);
			this.ctx.lineTo(endX,endY);
			this.ctx.stroke();
		}
	};


	var $loadingMask = $('.loading-mask'),
		imgArray = [
			'/dev/images/common/loading.gif',
			'/dev/images/pages/mobile/act/lottery/1-1-x/bg.png',
			'/dev/images/pages/mobile/act/lottery/1-1-x/firework.png',
			'/dev/images/pages/mobile/act/lottery/1-1-x/amulet.png',
			'/dev/images/pages/mobile/act/lottery/1-1-x/explode.png',
			'/dev/images/pages/mobile/act/lottery/1-1-x/result-box.png',
			'/dev/images/pages/mobile/act/lottery/1-1-x/unlucky-box.png',
			'/dev/images/pages/mobile/act/lottery/1-1-x/start-nr-btn.png',
			'/dev/images/pages/mobile/act/lottery/1-1-x/start-ssr-btn.png'
		];
	if(QUERY.from == 'netease') imgArray.unshift('/dev/images/pages/mobile/act/lottery/1-1-x/splash.png');
	loading.add({
		imgArray: imgArray,
		progress: function(value,total){
			$loadingMask.find('.progress').text(value + '/' + total);
			if(value >= total){
				setTimeout(function(){
					animation.add({
						startValue: 1,
						endValue: 0,
						step: function(v){
							$loadingMask.css('opacity',v);
						},
						oncomplete: function(){
							Page.init();

								$loadingMask.remove();
						}
					});
				},3000);
			}
		}
	});


	if(native.hello()){
		native.on('refresh',function(){
			location.href = location.href;
		});
		native.on('return',function(){
			location.href = location.href;
		});
		setTimeout(function(){
			native.call('setShareInfo',{
				default: {
					title: '我画出一个神秘符咒，召唤出了限量周边！',
					description: '网易菠萝年末放送，打开领取阴阳师等爆火IP周边',
					image: '/dev/images/pages/mobile/act/lottery/1-1-x/share-icon.jpg',
					url: location.href
				},
				weibo: {
					description: '网易菠萝年末放送，打开领取阴阳师等爆火IP周边 @网易菠萝菌',
					image: '/dev/images/pages/mobile/act/lottery/1-1-x/share-icon.jpg',
					url: location.href
				}
			});
		},1000);
	}


	wechat.share({
		title: '我画出一个神秘符咒，召唤出了限量周边！',
		desc: '网易菠萝年末放送，打开领取阴阳师等爆火IP周边',
		link: location.href,
		imgUrl: '/dev/images/pages/mobile/act/lottery/1-1-x/share-icon.jpg'
	});

});