/**
 * Created by Dillance on 16/7/12.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		uadetector = require('uadetector@1-0-x');

	var Download = {
		init: function(source){
			if(this._inited) return this;
			this._inited = true;
			this.source = source;
			this.$video = $('video');
			this.$wrapper = $('.download-dialog');
			this.bindEvents();
			return this;
		},
		bindEvents: function(){
			var self = this;

			this.$wrapper.on('touchmove',function(e){
				e.stopPropagation();
				e.preventDefault();
			}).on('tap',function(){
				self.hide();
			}).find('.container').on('tap',function(e){
				e.stopPropagation();
			});

			this.$wrapper.find('.fuck-off,.remove-btn').tap(function(){
				self.hide();
			});

			this.$wrapper.find('.download-btn').tap(function(){
				location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.netease.bolo.android';
			});
		},
		show: function(){
			if(this.$video.length) this.$video.hide();
			this.$wrapper.show();
		},
		hide: function(){
			if(this.$video.length) this.$video.show();
			this.$wrapper.hide();
		}
	};

	var WechatShareGuide = {
		init: function(){
			if(this._inited) return this;
			this._inited = true;
			this.$video = $('video');
			this.$wrapper = $('.wechat-share-guide');
			this.bindEvents();
			return this;
		},
		show: function(){
			if(this.$video.length) this.$video.hide();
			this.$wrapper.show();
		},
		hide: function(){
			if(this.$video.length) this.$video.show();
			this.$wrapper.hide();
		},
		bindEvents: function(){
			var self = this;
			this.$wrapper.tap(function(){
				self.hide();
			});
		}
	};


	return {
		Download: Download,
		WechatShareGuide: WechatShareGuide
	}

});