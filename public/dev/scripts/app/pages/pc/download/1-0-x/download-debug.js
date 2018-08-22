/**
 * Created by Dillance on 16/5/6.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('jquery@1-11-x'),
		Tmpl = require('tmpl@2-1-x'),
		uadetector = require('uadetector@1-0-x');

	if(uadetector.isDevice('mobile')) location.href = '/m/download';

	var DANMAKU_LIST = ['我饭的CP全世界最甜不接受反驳','我已经猜到了结局','都停一下！','让我静静','听说有人想骂他 我只希望有人出来打他','还能不能愉快地追番了','哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈','真的要笑死了','编剧的脑洞我也真的是服气了','想嫁QAQQQQ','噗哈哈哈笑出声','饭对了CP每天都在过情人节','妈的智障','为什么可以这么搞笑','希望编剧不要欺负我们这些拥有正常审美的女孩','妈妈问我为什么跪着看手机屏幕','十块钱扔下了不要找了赶紧去民政局吧','囍囍囍囍囍囍囍','双手奉上膝盖','你听，是心碎的声音','这集真的巨好笑哈哈哈哈哈哈哈哈哈哈','恕我直言，在座的各位都是辣鸡','真的要笑死了'];

	var Danmaku = {
		$wrapper: $('.danmaku-wrap'),
		danmakuTrackNum: 12,
		cleanRestBulletTimer: [],
		data: DANMAKU_LIST,
		init: function(){
			this.render();
		},
		render: function(){
			var self = this;
			var eachHeight = this.$wrapper.height() / this.danmakuTrackNum;
			var track = Tmpl.render(
				'<% for(var i = 0;i < ' + this.danmakuTrackNum + ';i++){ %>' +
					'<li class="item-track" style="height:' + eachHeight + 'px;line-height:' + eachHeight + 'px;"></li>' +
				'<% } %>'
			);
			this.$wrapper.html(track);
			this.consumeBullet();
			this.cleanBulletInterval = setInterval(function(){
				self.cleanBullet();
			},10000);
		},
		consumeBullet: function(){
			this.shoot(this.data);
		},
		shoot: function(list){
			var self = this;
			if(list && list.length){
				list = list.slice();

				this.$wrapper.find('.item-track').each(function(i){
					var $this = $(this);
					if(!list.length) return;
					if(!$this.data('occupied')){
						$this.data('occupied',true);
						var $bullet = $('<span class="bullet">' + list.shift() + '</span>');
						$this.append($bullet);
						var bulletWidth = $bullet.width(),
							trackWidth = self.$wrapper.width(),
							totalDistance = trackWidth + bulletWidth,
							bulletSpeed = totalDistance / 7000,
							unoccupiedDistance = trackWidth / 3 + bulletWidth,
							unoccupiedTime = unoccupiedDistance / bulletSpeed;
						$bullet.animate({
							left: -bulletWidth
						},7000,'linear',function(){
							$bullet.addClass('finished');
						});
						setTimeout(function(){
							$this.data('occupied',false);
						},unoccupiedTime);
						////每条弹幕4秒结束
						//setTimeout(function(){
						//	$bullet.addClass('finished');
						//},4000);
					}
				});

				setTimeout(function(){
					if(list.length) self.shoot(list);
					else self.shoot(self.data);
				},500);

			}
		},
		cleanBullet: function(){
			this.$wrapper.find('.bullet.finished').remove();
		}
	};

	Danmaku.init();

	//$.ajax({
	//	url: 'http://www.bobo.com/special/003500MG/boloandroidurl.js',
	//	dataType: 'jsonp',
	//	jsonpCallback: 'getUrlCallback',
	//	success: function(result){
	//		$('.android-btn').attr('href',result);
	//	}
	//});

});