/**
 * Created by Dillance on 16/6/20.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('jquery@1-11-x');

	var Tip = {
		$wrapper: $('.tip-dialog'),
		init: function(){
			this.$content = this.$wrapper.find('.content');
			this.bindEvents();
			return this;
		},
		bindEvents: function(){
			var self = this;
			this.$wrapper.find('.confirm-btn').click(function(){
				self.hide();
				if(self.callback) self.callback('confirm');
			});
			this.$wrapper.find('.remove-btn').click(function(){
				self.hide();
				if(self.callback && self.isHardCallback) self.callback('cancel');
			});
			this.$wrapper.click(function(){
				self.hide();
				if(self.callback && self.isHardCallback) self.callback('cancel');
			}).find('.container').click(function(e){
				e.stopPropagation();
			});
		},
		show: function(msg,callback,isHardCallback){
			var self = this;
			this.callback = callback;
			this.isHardCallback = isHardCallback;
			this.$content.text(msg);
			this.$wrapper.show();
			setTimeout(function(){
				self.$wrapper.addClass('show');
			},10);
		},
		hide: function(){
			var self = this;
			this.$wrapper.removeClass('show');
			setTimeout(function(){
				self.$wrapper.hide();
			},200);
		}
	};

	return Tip.init();

});