/**
 * Created by Dillance on 16/7/21.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		tmpl = require('/common/tmpl@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		tip = require('/common/uiComponent/mobile/tip@1-0-x'),
		photo = require('/pages/mobile/act/cj/1-0-x/modules/photo');

	var Periphery = {
		$wrapper: $('.periphery-page'),
		init: function(){
			this.$imageDialog = this.$wrapper.find('.image-dialog');
			this.bindEvents();
		},
		bindEvents: function(){
			var self = this;
			this.$wrapper.find('.periphery-list .item').tap(function(){
				var $this = $(this);
				self.$imageDialog.find('img').attr('src',$this.find('img').attr('src'));
				self.$imageDialog.find('.name h5').text($this.find('.name').text());
				self.$imageDialog.find('.name p').text($this.find('.name').data('intro'));
				self.$imageDialog.show();
			});
			this.$imageDialog.tap(function(){
				self.$imageDialog.hide();
			});
		}
	};

	return Periphery;

});