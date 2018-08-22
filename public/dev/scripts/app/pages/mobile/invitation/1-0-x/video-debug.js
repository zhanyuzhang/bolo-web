// 参数要求：
// http://local.bobo.com:3000/m/invitation/code?title=大力金刚第3季&code=12345&setId=13234&userName
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		qs = require('querystring@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		wechat = require('/common/wechat@1-0-x'),
		native = require('/common/native@1-0-x');
	// stat = require('/common/Stat@1-0-x');

	var QUERY = qs.parse(location.search);

	// 获取配置的选集信息
	SETS_INFO = SETS_INFO || [];
	var configSetInfo = SETS_INFO.filter(function (e, i) {
		return e.subTitle == QUERY.setId;
	})[0];

	var App = {
		init: function () {
			this.$wrapper = $('.wrapper');
			this.$videoCover = $('.video-cover');
			this.$invitationCode = $('.ticket .info .code');
			this.$restChannce = $('.ticket .info .usage-tip i');
			this.$setName = $('.set-name');

			// this.$videoName.text(QUERY.title);
			this.$invitationCode.text(QUERY.code);
			this.$setName.text(QUERY.userName +  QUERY.title);
			this.initDanmaku();
			this.getRestChance();

			if(configSetInfo) {
				this.$videoCover.css({backgroundImage: 'url(' + configSetInfo.pic + ')'});
			}

			wechat.share({
				title: '送你1个G的高清无码资源！点开白捡一个亿！',
				link: document.location.href,
				imgUrl: 'http://img1.cache.netease.com/bobo/2016/12/6/20161206192006c8fe8.png'
			});

		},
		getRestChance: function () {
			var self = this;
			$.ajax({
				url: HttpHelper.getOrigin() + '/bolo/api/gift/leftUseTimes', // createInviteCode
				data: {
					code: QUERY.code
				},
				success: function(result) {
					self.$restChannce.text(JSON.parse(result).times);
				}
			});
		},
		initDanmaku: function () {
			if(!configSetInfo) return;
			var i = 0;
			var self = this;
			var danmaku = configSetInfo.summary.split('||');
			var count = danmaku.length;

			var interval = setInterval(function () {
				self.createDanmaku(danmaku, i++);
				if(i >= count ) {
					i = 0;
				}
			}, 1000);
		},
		createDanmaku: function(danmaku, index) {
			var self = this;
			var top = .5;
			var speed = [2500, 3000, 3500, 4000, 4500, 5000]; // 6种不同的速度，随机的选择一种

			var marquee = document.createElement('div');
			marquee.innerHTML = danmaku[index];
			marquee.style.top = (top + (Math.floor(Math.random() * 6)) * .6) + 'rem'; // 有6条通道，随机先把一条
			marquee.className = 'marquee';
			self.$videoCover.append(marquee);
			$(marquee).animate({'marginLeft': '-10.8rem'}, speed[Math.floor(Math.random() * 6)], function () {
				$(marquee).remove();
			});

		}
	};
	$(document).on('touchmove', function(e) {
		var touch = e.touches[0];
		console.log('test');
		e.preventDefault();
		e.stopPropagation();
	});

	$(function () {
		App.init();
	});

});