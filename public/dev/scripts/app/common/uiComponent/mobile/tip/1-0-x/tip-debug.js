/**
 * Created by Dillance on 16/6/29.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4');

	var Tip = {
		$wrapper: $('.tip-dialog'),
		init: function(){
			if(!this.$wrapper.length) return false;
			this._inited = true;
			return this;
		},
		show: function(msg, liveTime){
			if(!this._inited) return false;
			this.$wrapper.text(msg).addClass('show');
			this._dieIn(liveTime);
		},
		_dieIn: function(time){
			var self = this;
			if(this.deadTimer) clearTimeout(this.deadTimer);
			this.deadTimer = setTimeout(function(){
				self.$wrapper.removeClass('show');
			},(time || 3000));
		}
	};

	return Tip.init();

});