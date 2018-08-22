define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		tmpl = require('/common/tmpl@1-0-x'),
		uadetector = require('uadetector@1-0-x'),
		animation = require('animation@1-0-x'),
		Promise = require('promise@1-0-x'),
		native = require('/common/native@1-1-x'),
		tip = require('/common/uiComponent/mobile/tip@1-0-x'),
		wechat = require('/common/wechat@1-0-x'),
		dialog = require('/common/uiComponent/mobile/dialog@1-0-x');

	var $listDialog = $('.list-dialog'),
		$rulesDialog = $('.rules-dialog'),
		$winDialog = $('.win-dialog'),
		$winDialogContainer = $winDialog.find('.body-wrap'),
		$getRewardDialog = $('.get-reward-dialog');

	var Page = {
		$wrapper: $('.wrapper'),
		init: function(){
			this.$balance = $('.balance .num');
			this.$leftCount = $('.left-time .num');
			this.$startBtn = $('.start-btn');
			this.$pointer = this.$startBtn.find('.pointer');
			this.$operation = $('.operation');
			this.render();
			this.bindEvents();
		},
		render: function(){
			var self = this;

			setTimeout(function(){
				native.isLoginPromise.then(function(){
					return self.getData();
				}).then(function(data){
					self.$balance.text(data.seedNum);
					self.$leftCount.text(data.times);
				});
			},300);

			if(!native.hello()) dialog.Download.init();

			this.getWinnersData().then(function(data){
				$listDialog.find('.winners-list').html(tmpl.render('winners-list',{
					data: data
				}));
			});
		},
		bindEvents: function(){
			var self = this;
			this.$startBtn.tap(function(){
				if(!native.hello()){
					dialog.Download.show();
					return false;
				}
				//self.startRolling(1).then(function(){
				//	self.proceeding = false;
				//	$winDialogContainer.html(tmpl.render('win-dialog',{
				//		reward: 1
				//	}));
				//	$winDialog.removeClass('hide');
				//});
				if(self.proceeding) return false;
				self.proceeding = true;
				native.isLogin.then(function(){
					self.getLotteryResult().then(function(data){
						if(data.status == 0){
							self.$balance.text(self.$balance.text() - 20);
							self.$leftCount.text(data.times);
							self.startRolling(data.reward).then(function(){
								self.proceeding = false;
								self.$balance.text(data.seedNum);
								$winDialogContainer.html(tmpl.render('win-dialog',{
									reward: data.reward
								}));
								$winDialog.removeClass('hide');
							});
						}else{
							self.proceeding = false;
							$winDialogContainer.html(tmpl.render('win-dialog',{
								reward: data.status
							}));
							$winDialog.removeClass('hide');
						}
					});
				},function(){
					native.call('loginApp');
				});
			});

			this.$operation.on('tap','.btn',function(){
				var $this = $(this);
				if(!$this.hasClass('activated')){
					$this.addClass('activated').siblings('.activated').removeClass('activated');
				}
			}).on('tap','.list',function(){
				$listDialog.removeClass('hide');
			}).on('tap','.rules',function(){
				$rulesDialog.removeClass('hide');
			});
		},
		startRolling: function(reward,seedNum){
			var self = this;
			return new Promise(function(resolve,reject){
				animation.add({
					startValue: 0,
					endValue: 3600 + (360 / 8) * self.rewardMap[reward],
					duration: 5000,
					easing: 'easeOutQuad',
					step: function(v){
						self.$pointer.css('-webkit-transform','rotate(' + v + 'deg)');
					},
					oncomplete: function(){
						resolve();
						//self.$balance.text(seedNum);
						//if(reward != 0){
							//$winDialog.html(tmpl.render('win-dialog',{
							//	reward: reward
							//})).addClass('show');
						//}
					}
				});
			});
		},
		getLotteryResult: function(){
			return native.userPromise.then(function(userInfo){
				return new Promise(function(resolve) {
					$.getJSON(HttpHelper.getOrigin() + '/bolo/api/user/draw', {
						userId: userInfo.userId,
						encryptToken: userInfo.encryptToken,
						timeStamp: userInfo.timeStamp,
						random: userInfo.random
					}, function (result) {
						resolve(result);
					});
				});
			});
		},
		getData: function(){
			return native.userPromise.then(function(userInfo){
				return new Promise(function(resolve){
					$.getJSON(HttpHelper.getOrigin() + '/bolo/api/user/drawLeftTimes.htm',{
						userId: userInfo.userId,
						encryptToken: userInfo.encryptToken,
						timeStamp: userInfo.timeStamp,
						random: userInfo.random
					},function(result){
						resolve(result);
					});
				});
			});
		},
		getWinnersData: function(){
			return new Promise(function(resolve){
				$.getJSON(HttpHelper.getOrigin() + '/bolo/api/public/drawRecord.htm',function(result){
					resolve(result);
				});
			});
		},
		rewardMap: {
			0: 6,
			1: 1,
			2: 2,
			3: 4,
			4: 5,
			5: 3,
			6: 7
		}
	};

	$listDialog.add($rulesDialog).on('tap',function(e){
		$(this).addClass('hide');
		Page.$operation.find('.home').trigger('tap');
	}).find('.container').tap(function(e){
		if(e.target.className != 'remove-btn'){
			e.stopPropagation();
		}
	});

	$winDialog.on('tap',function(e){
		$winDialog.addClass('hide');
	}).find('.container').tap(function(e){
		if(e.target.className != 'remove-btn'){
			e.stopPropagation();
		}
	}).on('tap','.confirm-btn',function(){
		var $this = $(this);
		$winDialog.addClass('hide');
		if($this.hasClass('get-seed')) location.href = '/m/hybrid/mission/list';
		else if($this.hasClass('win')) $getRewardDialog.removeClass('hide');
	});

	$getRewardDialog.on('tap',function(e){
		$getRewardDialog.addClass('hide');
	}).find('.container').tap(function(e){
		if(e.target.className != 'remove-btn'){
			e.stopPropagation();
		}
	}).on('tap','.confirm-btn',function(){
		$getRewardDialog.addClass('hide');
	});

	Page.init();

	native.on('refresh',function(){
		location.reload();
	});
	native.on('return',function(){
		location.reload();
	});


	setTimeout(function(){
		native.call('setShareInfo',{
			default: {
				title: '菠萝新年开运大转盘！',
				description: '2017一键转运！',
				image: 'http://img1.cache.netease.com/bobo/release/images/pages/mobile/act/lottery/1-2-x/share-img_2705c414eb.png',
				url: location.href
			},
			weibo: {
				description: '菠萝新年开运大转盘！2017一键转运！ @网易菠萝菌',
				image: 'http://img1.cache.netease.com/bobo/release/images/pages/mobile/act/lottery/1-2-x/share-img_2705c414eb.png',
				url: location.href
			}
		});
	},1000);

	wechat.share({
		title: '菠萝新年开运大转盘！',
		desc: '2017一键转运！',
		link: location.href,
		imgUrl: 'http://img1.cache.netease.com/bobo/release/images/pages/mobile/act/lottery/1-2-x/share-img_2705c414eb.png'
	});
});