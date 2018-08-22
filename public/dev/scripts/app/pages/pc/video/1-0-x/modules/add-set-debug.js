/**
 * Created by Dillance on 16/6/20.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('jquery@1-11-x'),
		user = require('/common/user@1-0-x'),
		tip = require('/pages/pc/video/1-0-x/modules/tip'),
		HttpHelper = require('/common/HttpHelper@1-0-x');

	var Tip = {
		$wrapper: $('.add-set-dialog'),
		init: function(){
			this.$content = this.$wrapper.find('.content');
			this.$input = this.$wrapper.find('input');
			this.bindEvents();
			return this;
		},
		bindEvents: function(){
			var self = this;
			this.$wrapper.find('.remove-btn').click(function(){
				self.hide();
				if(self.callback) self.callback();
			});
			this.$wrapper.find('.confirm-btn').click(function(){
				var value = self.$input.val();
				if(!value) self.hide();
				else if(value.length > 10){
					alert('请输入小于10个字的选集')
				}else{
					$.ajax({
						url: HttpHelper.getOrigin() + '/bolo/api/web/video/createSet.do',
						dataType: 'jsonp',
						data: {
							name: value,
							userId: user.userIdStr
						},
						success: function(result){
							self.hide();
							if(result.status == 0){
								self.callback && self.callback(result.sets);
							}else{
								tip.show(result.msg)
							}
						}
					})
				}
			});
			this.$wrapper.click(function(){
				self.hide();
			}).find('.container').click(function(e){
				e.stopPropagation();
			});
		},
		show: function(callback){
			var self = this;
			this.callback = callback;
			this.$wrapper.show();
			this.$input.focus();
			setTimeout(function(){
				self.$wrapper.addClass('show');
			},10);
		},
		hide: function(){
			var self = this;
			this.$wrapper.removeClass('show');
			setTimeout(function(){
				self.$wrapper.hide();
				self.$input.val('');
			},200);
		}
	};

	return Tip.init();

});