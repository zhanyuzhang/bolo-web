/**
 * Created by Dillance on 16/4/29.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		tmpl = require('/common/tmpl@1-0-x'),
		qs = require('querystring@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		animation = require('animation@1-0-x'),
		native = require('/common/native@1-0-x'),
		comment = require('/common/uiComponent/mobile/comment@1-0-x');

	var Page = {
		id: qs.parse().aid,
		$wrapper: $('.wrapper'),
		$flyToTopBtn: $('.fly-to-top'),
		currentPage: 1,
		pageSize: 10,
		init: function(){
			this.$videoList = this.$wrapper.find('.video-list');
			this.getData();
			this.getVideoList(this.currentPage);
			this.bindEvents();
			this.stat();
		},
		render: function(data){
			this.$wrapper.find('.banner').html(tmpl.render('banner',{
				data: data
			}));
			this.$wrapper.find('.collection-info').html(tmpl.render('info',{
				data: data
			}));
			native.call('setShareInfo',{
				default: {
					title: '一本正经安利：菠萝专辑-' + data.name,
					description: '1个G的文件夹资源都在这',
					image: data.cover,
					url: location.href
				},
				weibo: {
					title: '动次打次，你的DJ菠萝已上线，为你分享专辑#' + data.name + '#' + location.href + ' @网易菠萝菌',
					image: data.cover
				}
			});
		},
		renderVideoList: function(data){
			this.$videoList.append(tmpl.render('video-list',{
				data: data,
				getImage: HttpHelper.getImage
			}));
			if(data.length < this.pageSize) this.$videoList.addClass('all-loaded');
		},
		getData: function(){
			var self = this;
			$.ajax({
				url: HttpHelper.getOrigin() + '/bolo/api/videoAlbum/albumInfo.htm',
				dataType: 'jsonp',
				data: {
					aid: self.id
				},
				success: function(result){
					if(result){
						self.render(result);
					}else alert('网络异常，请稍后再试')
				}
			});
		},
		getVideoList: function(page){
			var self = this;
			self.isLoading = true;
			$.ajax({
				url: HttpHelper.getOrigin() + '/bolo/api/videoAlbum/videoList.htm',
				dataType: 'jsonp',
				data: {
					aid: self.id,
					pageNum: page,
					pageSize: self.pageSize
				},
				success: function(result){
					self.isLoading = false;
					if(result){
						self.renderVideoList(result);
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
				if(!self.isLoading && !self.$videoList.hasClass('all-loaded') && scrollTop >= self.$videoList.height() - wrapperHeight){
					self.getVideoList(++self.currentPage)
				}
			});
			this.$videoList.on('tap','li.item',function(){
				if(native.hello()){
					native.call('openVideo',{
						videoId: $(this).data('vid')
					});
				}else{
					location.href = '/m/play?videoId=' + $(this).data('vid');
				}
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
		},
		stat: function(){
			//后台访问统计(非友盟)
			new Image().src = '//m.live.netease.com/bolo/hit/album/' + this.id;
		}
	};

	Page.init();

	setTimeout(function(){
		comment.init(Page.$wrapper);
	},50);

	native.on('refresh',function(){
		location.href = location.href;
	})

});