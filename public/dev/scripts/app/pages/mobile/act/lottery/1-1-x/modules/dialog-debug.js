/**
 * Created by Dillance on 16/12/12.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		tmpl = require('/common/tmpl@1-0-x');

	var Dialog = function(selector){
		this.$wrapper = $(selector);
		this.bindEvents();
	};

	Dialog.prototype.bindEvents = function(){
		var self = this;
		this.$wrapper.tap(function(){
			self.hide();
		}).find('.container').tap(function(e){
			e.stopPropagation();
		});
	};

	Dialog.prototype.find = function(selector){
		return this.$wrapper.find(selector);
	};

	Dialog.prototype.show = function(){
		this.$wrapper.removeClass('hide');
	};

	Dialog.prototype.hide = function(){
		this.$wrapper.addClass('hide');
	};

	return {
		phone: new Dialog('.phone-dialog'),
		exchange: new Dialog('.exchange-dialog'),
		openBolo: new Dialog('.open-bolo-dialog'),
		limitTip: new Dialog('.limit-tip-dialog'),
		rules: new Dialog('.rules-dialog'),
		prizeList: new Dialog('.prize-list-dialog')
	}

});