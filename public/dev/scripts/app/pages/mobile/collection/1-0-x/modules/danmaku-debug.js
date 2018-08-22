/**
 * Created by Dillance on 16/11/17.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		base = require('base@1-1-x');

	var Danmaku = function($wrapper,data){
		this.$wrapper = $wrapper;
		this.danmakuTrack = 10;
		this.currentPlayTime = -1;
		this.cleanRestBulletTimer = [];
		this.list = data;
		this.init();
	};

	Danmaku.prototype = {
		init: function(){
			var self = this;

			if(!this.list || base.isEmptyObject(this.list)) return false;
			this.$video = this.$wrapper.siblings('.video-box video');
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
				content.push('<div class="track" style="height:' + eachHeight + ';line-height:' + eachHeight + '"></div>');
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
	}

	return Danmaku;
});