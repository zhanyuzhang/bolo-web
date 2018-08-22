/**
 * Created by Dillance on 16/4/30.
 */
define(function(require, exports, module) {
	'use strict';

	var HttpHelper = require('/common/HttpHelper@1-0-x'),
		tmpl = require('/common/tmpl@1-0-x'),
		animation = require('animation@1-0-x');

	var VideoList = function($wrapper){
		this.$wrapper = $wrapper;
		this.init();
	};

	VideoList.prototype = {
		init: function(){
			this.$scrollWrap = this.$wrapper.find('.scroll-wrap');
			this.$videoList = this.$wrapper.find('.video-list');
			this.$flyToTopBtn = this.$wrapper.find('.fly-to-top');
			this.currentPage = 1;
			this.cid = this.$wrapper.data('cid');
			this.pageSize = 10;
			this.getData(this.currentPage);
			this.bindEvents();
		},
		render: function(data){
			if(data.length < this.pageSize) this.$videoList.addClass('all-loaded');
			this.$videoList.append(tmpl.render('video-list',{
				data: data,
				getImage: HttpHelper.getImage
			}));
		},
		getData: function(page){
			var self = this;
			$.ajax({
				url: HttpHelper.getOrigin() + '/bolo/api/video/categoryVideoList.htm',
				dataType: 'jsonp',
				data: {
					cid: self.cid,
					pageNum: page,
					pageSize: self.pageSize
				},
				success: function(result){
					if(result){
						self.render(result);
					}
				}
			});
		},
		bindEvents: function(){
			var self = this;
			this.$scrollWrap.scroll(function(){
				var scrollTop = self.$scrollWrap.scrollTop(),
					scrollHeight = self.$videoList.height(),
					viewHeight = self.$scrollWrap.height();
				if(!this.isLoading && !self.$videoList.hasClass('all-loaded') && scrollTop >= scrollHeight - viewHeight - 10){
					self.getData(++self.currentPage);
				}
				if(scrollTop >= 2 * viewHeight){
					self.$flyToTopBtn.addClass('show');
				}else{
					self.$flyToTopBtn.removeClass('show');
				}
			});

			this.$flyToTopBtn.tap(function(){
				animation.add({
					startValue: self.$scrollWrap.scrollTop(),
					endValue: 0,
					duration: 300,
					step: function(v){
						self.$scrollWrap.scrollTop(v);
					}
				});
			});
		}
	};

	return VideoList;

});