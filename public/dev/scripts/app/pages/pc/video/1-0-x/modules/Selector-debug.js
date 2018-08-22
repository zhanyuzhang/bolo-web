/**
 * Created by Dillance on 16/7/28.
 */

define(function(require, exports, module) {
	'use strict';

	var $ = require('jquery@1-11-x');

	var Selector = function($wrapper){
		this.$wrapper = $wrapper;
		this.init();
	};

	Selector.prototype = {
		init: function(){
			this.$currentValue = this.$wrapper.find('.current-value');
			this.bindEvents();
		},
		bindEvents: function(){
			var self = this;
			this.$wrapper.on('click','.item',function(){
				self.currentValue = $(this).text();
				self.$currentValue.text(self.currentValue).data('id',$(this).data('id'));
			});
		}
	};

	return Selector;

});