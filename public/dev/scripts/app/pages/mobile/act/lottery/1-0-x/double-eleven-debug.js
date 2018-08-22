/**
 * Created by Dillance on 16/10/21.
 */
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
		dialog = require('/common/uiComponent/mobile/dialog@1-0-x');


	var $wrapper = $('.wrapper'),
		$seedDetailsDialog = $('.seed-dialog'),
		$winDialog = $('.win-dialog'),
		$awardDialog = $('.award-dialog');

	$seedDetailsDialog.tap(function(e){
		$seedDetailsDialog.removeClass('show')
	});
	$seedDetailsDialog.find('.container').tap(function(e){
		if(e.target.className != 'remove-btn') e.stopPropagation();
	});

	$winDialog.on('tap','.reject-btn,.remove-btn,.get-btn,.confirm-btn',function(){
		$winDialog.removeClass('show');
	});
	$winDialog.on('tap','.get-btn',function(){
		$awardDialog.addClass('show');
	});
	$winDialog.on('tap','.get-seed-btn',function(){
		location.href = '/m/hybrid/mission/list';
	});

	$awardDialog.tap(function(e){
		$awardDialog.removeClass('show')
	});
	$awardDialog.find('.container').tap(function(e){
		if(e.target.className != 'remove-btn' && e.target.className != 'confirm-btn') e.stopPropagation();
	});

	var Home = {
		$container: $wrapper.find('.page-container.home'),
		init: function(){
			this.$balance = this.$container.find('.balance .num');
			this.$svgBalance = this.$container.find('.svg-balance');
			this.$leftCount = this.$container.find('.count-tip .num');
			this.$startBtn = this.$container.find('.start-btn');
			this.render();
			this.bindEvents();
		},
		render: function(){
			var self = this;

			this.$svgBalance.css({
				'-webkit-transform': 'scale(' + ($(window).width() / 1080) + ')',
				display: 'block'
			});

			native.isLogin.then(function(){
				return self.getData();
			}).then(function(data){
				self.$balance.text('种子余额: ' + data.seedNum).data('seed-num',data.seedNum);
				self.$leftCount.text(data.times);
			});

			if(!native.hello()) dialog.Download.init();
			else{
				native.call('showShareMenu',{
					flag: false
				});
			}

		},
		bindEvents: function(){
			var self = this;
			this.$startBtn.tap(function(){
				if(!native.hello()){
					dialog.Download.show();
					return false;
				}
				native.isLogin.then(function(){
					if(self.proceeding) return false;
					self.proceeding = true;
					//self.startRolling(6,99700);
					self.getLotteryResult().then(function(data){
						if(data.status == 0){
							self.$balance.text('种子余额: ' + (self.$balance.data('seed-num') - 20));
							self.$leftCount.text(data.times);
							self.startRolling(data.reward,data.seedNum);
						}else{
							self.proceeding = false;
							if(data.status == -1){
								$winDialog.html(tmpl.render('win-dialog',{
									reward: -2
								})).addClass('show');
							}else if(data.status == -2){
								$winDialog.html(tmpl.render('win-dialog',{
									reward: -1
								})).addClass('show');
							}
						}
					});
				},function(){
					native.call('loginApp');
				});
			});
			//this.$container.find('.seed-details-btn').tap(function(){
			//	$seedDetailsDialog.addClass('show');
			//});
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
		startRolling: function(reward,seedNum){
			var self = this;
			animation.add({
				startValue: 0,
				endValue: 3600 + (360 / 8) * self.rewardMap[reward],
				duration: 5000,
				easing: 'easeOutQuad',
				step: function(v){
					self.$startBtn.css('-webkit-transform','rotate(' + v + 'deg)');
				},
				oncomplete: function(){
					self.proceeding = false;
					self.$balance.text('种子余额: ' + seedNum).data('seed-num',seedNum);
					if(reward != 0){
						$winDialog.html(tmpl.render('win-dialog',{
							reward: reward
						})).addClass('show');
					}
				}
			});
		},
		show: function(){
			$wrapper.find('.page-container').hide();
			this.$container.show();
		},
		rewardMap: {
			0: 1,
			1: 5,
			2: 2,
			3: 6,
			4: 4,
			5: 3,
			6: 7
		}
	};

	var Win = {
		$container: $wrapper.find('.page-container.win'),
		init: function(){
			if(this._inited) return;
			this._inited = true;
			this.$winList = this.$container.find('.win-list');
			this.render();
		},
		render: function(){
			var self = this;
			this.getData().then(function(data){
				self.$winList.html(tmpl.render('win-list',{
					data: data
				}));
				self.startScrolling();
			});
		},
		getData: function(){
			return new Promise(function(resolve){
				$.getJSON(HttpHelper.getOrigin() + '/bolo/api/public/drawRecord.htm',function(result){
					resolve(result);
				});
			});
		},
		startScrolling: function(){
			var self = this,
				height = self.$winList.find('.item').eq(0).height();
			self.currentPos = self.currentPos || 0;
			self.count = self.count || 0;
			setTimeout(function(){
				animation.add({
					startValue: self.count * height,
					endValue: ++self.count * height,
					duration: 400,
					easing: 'linear',
					step: function(v){
						self.$winList.css('-webkit-transform','translate(0,-' + v + 'px)');
					},
					oncomplete: function(){
						if(self.count < self.$winList.find('.item').length - 8) self.startScrolling();
					}
				});
			},2000);
		},
		show: function(){
			if(!this._inited) this.init();
			$wrapper.find('.page-container').hide();
			this.$container.show();
		}
	};

	var Rules = {
		$container: $wrapper.find('.page-container.rules'),
		init: function(){

		},
		show: function(){
			$wrapper.find('.page-container').hide();
			this.$container.show();
		}
	};

	$('.nav .btn').tap(function(){
		var $this = $(this);
		$this.addClass('current').siblings('.current').removeClass('current');
		if($this.hasClass('home')) Home.show();
		else if($this.hasClass('win')) Win.show();
		else if($this.hasClass('rules')) Rules.show();
	});

	Home.init();

	native.on('refresh',function(){
		location.href = location.href;
	});
	native.on('return',function(){
		location.href = location.href;
	});

});