/**
 * Created by Dillance on 16/11/30.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		tmpl = require('/common/tmpl@1-0-x'),
		wechat = require('/common/wechat@1-0-x'),
		uadetector = require('uadetector@1-0-x'),
		animation = require('animation@1-0-x'),
		qs = require('querystring@1-0-x'),
		Stat = require('/common/Stat@1-0-x'),
		tip = require('/common/uiComponent/mobile/tip@1-0-x');

	var SOUP_MAP = {
		0: {
			title: '/dev/images/pages/mobile/act/poison-chicken/1-0-x/chicken01-title.png',
			share: '/dev/images/pages/mobile/act/poison-chicken/1-0-x/share-guide-01.png',
			content: [
				'/dev/images/pages/mobile/act/poison-chicken/1-0-x/chicken01-content01.png',
				'/dev/images/pages/mobile/act/poison-chicken/1-0-x/chicken01-content02.png'
			]
		},
		1: {
			title: '/dev/images/pages/mobile/act/poison-chicken/1-0-x/chicken02-title.png',
			share: '/dev/images/pages/mobile/act/poison-chicken/1-0-x/share-guide-02.png',
			content: [
				'/dev/images/pages/mobile/act/poison-chicken/1-0-x/chicken02-content01.png',
				'/dev/images/pages/mobile/act/poison-chicken/1-0-x/chicken02-content02.png'
			]
		},
		2: {
			title: '/dev/images/pages/mobile/act/poison-chicken/1-0-x/chicken03-title.png',
			share: '/dev/images/pages/mobile/act/poison-chicken/1-0-x/share-guide-03.png',
			content: [
				'/dev/images/pages/mobile/act/poison-chicken/1-0-x/chicken03-content01.png',
				'/dev/images/pages/mobile/act/poison-chicken/1-0-x/chicken03-content02.png'
			]
		},
		3: {
			title: '/dev/images/pages/mobile/act/poison-chicken/1-0-x/chicken04-title.png',
			share: '/dev/images/pages/mobile/act/poison-chicken/1-0-x/share-guide-04.png',
			content: [
				'/dev/images/pages/mobile/act/poison-chicken/1-0-x/chicken04-content01.png',
				'/dev/images/pages/mobile/act/poison-chicken/1-0-x/chicken04-content02.png'
			]
		}
	};

	var chichenIndex = 0;

	var Screen = function($wrapper){
		this.$wrapper = $wrapper;
		this.events = [];
	};

	Screen.histroy = [];

	Screen.prototype = {
		on: function(name, callback) {
			var self = this;

			name = name.split(' ');

			name.forEach(function(n){
				var list = self.events[n] || (self.events[n] = []);
				list.push(callback);
			});

			return this
		},
		emit: function(name, data) {
			var list = this.events[name];

			if (list) {
				list = list.slice();

				for(var i = 0, len = list.length; i < len; i++) {
					list[i](data)
				}
			}

			return this
		},
		find: function(sizzle){
			return this.$wrapper.find(sizzle);
		},
		show: function(){
			var self = this;
			if(this.$wrapper.hasClass('show')){
				this.$wrapper.removeClass('fade');
			}else{
				this.$wrapper.removeClass('hide');
				setTimeout(function(){
					self.$wrapper.addClass('show');
				},20);
				if(Screen.histroy.length) Screen.histroy[Screen.histroy.length - 1].fade();
				Screen.histroy.push(this);
			}
			this.emit('show');
		},
		fade: function(){
			this.$wrapper.addClass('fade');
		},
		return: function(){
			var self = this;
			this.$wrapper.removeClass('show');
			setTimeout(function(){
				self.$wrapper.addClass('hide');
			},300);
			Screen.histroy.pop();
			if(Screen.histroy.length) Screen.histroy[Screen.histroy.length - 1].show();
			this.emit('return');
		}
	};

	if($('.screen.page01--sp').length) var spScreen = new Screen($('.screen.page01--sp'));
	if(!spScreen) var firstScreen = new Screen($('.screen.page01'));
	var secondScreen = new Screen($('.screen.page02'));
	var thirdScreen = new Screen($('.screen.page03'));

	spScreen && spScreen.find('.start-btn').tap(function(){
		secondScreen.show();
		setTimeout(function () {
			$('.start-guide').removeClass('hidden').tap(function () {
				$(this).addClass('hidden');
			});
		}, 600);
	});

	firstScreen && firstScreen.on('show',function(){
		var img = new Image();
		img.onload = function(){
			firstScreen.$wrapper.addClass('zoom');
			setTimeout(function(){
				secondScreen.show();
			}, 2500);
		};
		img.src = '/dev/images/pages/mobile/act/poison-chicken/1-0-x/cover.png';
	});

	qs.parse().replay && secondScreen.show();

	//预加载要显示的按钮
	secondScreen.on('show',function(){
		new Image().src = '/dev/images/pages/mobile/act/poison-chicken/1-0-x/page02-confirm-btn.png';
	});

	secondScreen.$confirmBtn = secondScreen.find('.confirm-btn');
	secondScreen.find('.chichen').tap(function(){
		var $this = $(this);
		chichenIndex = $this.index();
		if(!$this.hasClass('clipped')){
			$this.addClass('clipped').siblings('.clipped').removeClass('clipped');
			if(secondScreen.strugglingChickenAnimation) animation.remove(secondScreen.strugglingChickenAnimation,true);
			secondScreen.strugglingChickenAnimation = animation.add({
				startValue: 1,
				endValue: 5,
				duration: 400,
				step: function(v){
					var x = Math.floor(Math.random() * 9 - 4),
						y = Math.floor(Math.random() * 9 - 4),
						d = Math.floor(Math.random() * 21 - 10);
					$this.css('-webkit-transform','translate3d(' + x + 'px,' + y + 'px,0) rotate(' + d + 'deg)');
				},
				oncomplete: function(){
					$this.css('-webkit-transform','translate3d(0,0,0) rotate(0deg)');
				}
			});
			Stat.send('点击四只鸡',{
				label: '毒鸡' + ($this.index() + 1) + '号'
			});
		}
		if(secondScreen.$confirmBtn.hasClass('disable')){
			secondScreen.$confirmBtn.removeClass('disable')
		}
	});

	secondScreen.$confirmBtn.tap(function(){
		if(secondScreen.$confirmBtn.hasClass('disable')) return false;
		var $selectedChicken = secondScreen.find('.chichen.clipped');
		animation.add({
			startValue: 0,
			endValue: 3,
			duration: 2000,
			step: function(v){
				$selectedChicken.css('-webkit-transform','translate3d(0,' + (-v * 100) + '%,0)');
			}
		});
		secondScreen.find('.loading-chicken').addClass('show');
		setTimeout(function(){
			thirdScreen.render($selectedChicken.index());
		},2000);
		Stat.send('点击生成毒鸡汤');
	});

	secondScreen.reset = function(){
		secondScreen.find('.chichen').removeClass('clipped').removeAttr('style');
		secondScreen.find('.loading-chicken').removeClass('show');
	};

	thirdScreen.render = function(index){
		var img = new Image(),
			title = SOUP_MAP[index].title,
			contentIndex = Math.floor(Math.random() * 2),
			content = SOUP_MAP[index].content[contentIndex];
		img.onload = function(){
			thirdScreen.find('.title img').attr('src',title);
			thirdScreen.find('.content img').attr('src',content);
			setTimeout(function(){
				thirdScreen.show();
			},1000);
		};
		img.src = content;
		if(uadetector.is('NewsApp')){
			Stat.send('在新闻客户端里点击毒害好友',{
				label: '鸡汤id:' +  index + '-' + contentIndex
			});
			$('#__newsapp_sharewxurl').text(qs.append(location.href.replace(location.search,''),{soup: index + '-' + contentIndex}));
		}else if(uadetector.is('MicroMessenger')){
			wechat.share({
				onMenuShareTimeline: {
					title: '来看我熬的这碗毒鸡汤,好像很适合你！'
				},
				title: '快来看我给你熬的毒鸡汤！',
				desc: '包治百病,喝完你一定会回来感谢我!',
				link: qs.append(location.href.replace(location.search,''),{soup: index + '-' + contentIndex}),
				imgUrl: '/dev/images/pages/mobile/act/poison-chicken/1-0-x/share-img.png',
				success: function(){
					Stat.send('毒鸡汤微信分享成功',{
						label: '鸡汤id:' +  index + '-' + contentIndex
					});
				},
				cancel: function(){
					Stat.send('毒鸡汤微信取消了分享',{
						label: '鸡汤id:' +  index + '-' + contentIndex
					});
				}
			});
		}
	};

	thirdScreen.on('show',function(){
		secondScreen.reset();
	});

	thirdScreen.$getRewardDialog = thirdScreen.find('.get-reward-dialog');

	thirdScreen.find('.share-btn').tap(function(){
		if(uadetector.is('NewsApp')){
			NAShare.share();
		}else {
			thirdScreen.find('.share-guide').css({backgroundImage: 'url(' + SOUP_MAP[chichenIndex].share + ')'}).show();
		}
	});

	thirdScreen.find('.replay-btn').tap(function(){
		thirdScreen.return();
		Stat.send('毒鸡汤重玩');
		// location.href = '/m/act/chicken?replay=true'
	});

	thirdScreen.find('.share-guide').tap(function(){
		thirdScreen.find('.share-guide').hide();
	});
	// thirdScreen.find('.get-reward-btn').tap(function(){
	// 	thirdScreen.$getRewardDialog.addClass('show');
	// 	Stat.send('点击领取新年礼');
	// });
	thirdScreen.$getRewardDialog.tap(function(e){
		if(['content','cdkey'].indexOf(e.target.className) < 0){
			thirdScreen.$getRewardDialog.removeClass('show');
		}
		if(e.target.className == 'download-btn'){
			Stat.send('点击跳转应用宝');
			location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.netease.bolo.android';
		}
	});

	if(firstScreen){
		Screen.histroy.push(firstScreen);
		firstScreen.emit('show');
	}else if(spScreen){
		var soupIndex = spScreen.find('img').data('index').split('-');
		spScreen.find('img').attr('src',SOUP_MAP[soupIndex[0]].content[soupIndex[1]]);
	}

	var $musicBtn = $('.music-btn'),
		audio = $musicBtn.find('audio').get(0);
	$musicBtn.tap(function(){
		if($musicBtn.hasClass('off')){
			$musicBtn.removeClass('off');
			audio.play();
		}else{
			$musicBtn.addClass('off');
			audio.pause();
		}
	});

	if(uadetector.is('NewsApp')){
		$('#__newsapp_sharephotourl').text('/dev/images/pages/mobile/act/poison-chicken/1-0-x/share-img.png');
		$('#__newsapp_sharewxthumburl').text('/dev/images/pages/mobile/act/poison-chicken/1-0-x/share-img.png');
		$('#__newsapp_sharewxurl').text(location.href.replace(location.search,''));
	}else if(uadetector.is('MicroMessenger')){
		wechat.share({
			onMenuShareTimeline: {
				title: '来看我熬的这碗毒鸡汤,好像很适合你！'
			},
			title: '快来看我给你熬的毒鸡汤！',
			desc: '包治百病,喝完你一定会回来感谢我!',
			link: location.href.replace(location.search,''),
			imgUrl: '/dev/images/pages/mobile/act/poison-chicken/1-0-x/share-img.png',
			success: function(){
				Stat.send('毒鸡汤微信分享成功');
			},
			cancel: function(){
				Stat.send('毒鸡汤 微信取消了分享');
			}
		});
	}




});