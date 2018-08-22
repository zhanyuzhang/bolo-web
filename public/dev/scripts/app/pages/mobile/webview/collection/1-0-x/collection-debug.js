/**
 * Created by Dillance on 16/4/29.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		tmpl = require('/common/tmpl@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		animation = require('animation@1-0-x'),
		native = require('/common/native@1-0-x');

	var Page = {
		$wrapper: $('.wrapper'),
		$flyToTopBtn: $('.fly-to-top'),
		currentPage: 1,
		pageSize: 10,
		init: function(){
			this.$listContainer = this.$wrapper.find('.collection-list');
			this.getData(this.currentPage);
			this.bindEvents();

			native.call('setShareInfo',{
				default: {
					title: '一本正经安利：菠萝专辑',
					description: '1个G的文件夹资源都在这',
					url: location.href
				},
				weibo: {
					title: '1个G的文件夹资源都在这' + location.href + '@网易菠萝菌'
				}
			});
		},
		render: function(data){
			var list = tmpl.render('list',{
				data: data
			});
			this.$listContainer.append(list);
			if(data.length < this.pageSize) this.$listContainer.addClass('all-loaded')
		},
		getData: function(page){
			var self = this;
			self.isLoading = true;
			$.ajax({
				url: HttpHelper.getOrigin() + '/bolo/api/videoAlbum/list.htm',
				dataType: 'jsonp',
				data: {
					pageNum: page,
					pageSize: self.pageSize
				},
				success: function(result){
					self.isLoading = false;
					if(result){
						self.render(result);
					}else alert('网络异常，请稍后再试')
				}
			});
		},
		bindEvents: function(){
			var self = this;
			this.$wrapper.scroll(function(){
				var scrollTop = self.$wrapper.scrollTop(),
					wrapperHeight = self.$wrapper.height();
				if(scrollTop > 2 * self.$wrapper.height()){
					self.$flyToTopBtn.addClass('show');
				}else{
					self.$flyToTopBtn.removeClass('show');
				}
				if(!self.isLoading && !self.$listContainer.hasClass('all-loaded') && scrollTop >= self.$listContainer.height() - wrapperHeight - 10){
					self.getData(++self.currentPage)
				}
			}).on('tap','li.item',function(){
				location.href = '/m/hybrid/collection/details?aid=' + $(this).data('aid')
			});

			this.$flyToTopBtn.tap(function(){
				animation.add({
					startValue: self.$wrapper.scrollTop(),
					endValue: 0,
					duration: 300,
					step: function(v){
						self.$wrapper.scrollTop(v);
					}
				});
			});
		}
	};

	Page.init();

});