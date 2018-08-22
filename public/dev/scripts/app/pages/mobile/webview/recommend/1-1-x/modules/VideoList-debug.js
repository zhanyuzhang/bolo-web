/**
 * Created by Dillance on 16/4/30.
 */
define(function(require, exports, module) {
	'use strict';

	var HttpHelper = require('/common/HttpHelper@1-0-x'),
		tmpl = require('/common/tmpl@1-0-x'),
		animation = require('animation@1-0-x'),
		qs = require('querystring@1-0-x'),
		Promise = require('promise@1-0-x'),
		Stat = require('/common/Stat@1-0-x'),
		tip = require('/common/uiComponent/mobile/tip@1-0-x');

	var VideoList = function($wrapper,isHome){
		this.$wrapper = $wrapper;
		this.isHome = !!isHome;
		this.init();
	};

	VideoList.prototype = {
		init: function(){
			this.$scrollWrap = this.$wrapper.find('.scroll-wrap');
			this.$hotVideoList = this.$wrapper.find('.hot-video-list');
			this.$allvideoList = this.$wrapper.find('.all-video-list');
			this.$flyToTopBtn = this.$wrapper.find('.fly-to-top');
			this.zid = qs.parse().zid;
			this.cid = this.$wrapper.data('cid');
			this.pageSize = 10;
			this.render();
			this.bindEvents();
			this.$wrapper.data('inited',true);
		},
		render: function(data){
			var self = this;
			this.currentPage = 1;

			return new Promise(function(resolve,reject){
				self.getHotData().then(function(data){
					self.$hotVideoList.html(tmpl.render('hot-video-list',{
						data: data,
						getImage: HttpHelper.getImage
					})).addClass('all-loaded');
				});

				var task;
				if(self.isHome){
					task = self.getDailyData();
				}else{
					task = self.getAllData(self.currentPage);
				}
				task.then(function(data){
					self.$allvideoList.html(tmpl.render('all-video-list',{
						data: data,
						getImage: HttpHelper.getImage,
						isHome: self.isHome
					}));
					if(data.length < self.pageSize) self.$allvideoList.addClass('all-loaded');
					if(self.isHome) self.$allvideoList.addClass('all-loaded');
					resolve();
				});
			});

		},
		getHotData: function(){
			var self = this;
			return new Promise(function(resolve,reject){
				var data = {};
				if(self.isHome) data.zoneId = self.zid;
				else data.categoryId = self.cid;
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/zone/zoneHotVideoList.htm',
					dataType: 'jsonp',
					data: data,
					success: function(result){
						if(result){
							resolve(result);
						}else{
							reject();
						}
					}
				});
			});
		},
		getDailyData: function(){
			var self = this;
			return new Promise(function(resolve,reject){
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/zone/zoneNewVideoList.htm',
					dataType: 'jsonp',
					data: {
						zoneId: self.zid
					},
					success: function(result){
						if(result){
							if(result.length) resolve(result);
							else self.$wrapper.find('.all-area').hide();
						}else{
							reject();
						}
					}
				});
			});
		},
		getAllData: function(page){
			var self = this;
			return new Promise(function(resolve,reject){
				self.isLoading = true;
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/zone/categoryAllVideoList.htm',
					dataType: 'jsonp',
					data: {
						categoryId: self.cid,
						pageNum: page,
						pageSize: self.pageSize
					},
					success: function(result){
						self.isLoading = false;
						if(result){
							resolve(result);
						}else{
							reject();
						}
					}
				});
			});
		},
		bindEvents: function(){
			var self = this;

			this.$hotVideoList.on('click','.item',function(){
				Stat.send('classPage_' + self.zid + '_' + self.cid + '_hot',{
					label: 'position:' + $(this).index()
				});
			});

			this.$allvideoList.on('click','.item',function(){
				if(self.isHome){
					Stat.send('classPage_' + self.zid + '_new',{
						label: 'position:' + $(this).index()
					});
				}else{
					Stat.send('classPage_' + self.zid + '_' + self.cid + '_all',{
						label: 'position:' + $(this).index()
					});
				}

			});

			this.$scrollWrap.scroll(function(){
				var scrollTop = self.$scrollWrap.scrollTop(),
					scrollHeight = self.$scrollWrap.get(0).scrollHeight,
					viewHeight = self.$scrollWrap.height();

				if(!self.isLoading && !self.$allvideoList.hasClass('all-loaded') && scrollTop >= scrollHeight - viewHeight - 10){
					self.getAllData(++self.currentPage).then(function(data){
						self.$allvideoList.append(tmpl.render('all-video-list',{
							data: data,
							getImage: HttpHelper.getImage,
							isHome: self.isHome
						}));
						if(data.length < self.pageSize) self.$allvideoList.addClass('all-loaded');
					});
				}

				if(scrollTop >= 2 * viewHeight){
					self.$flyToTopBtn.addClass('show');
				}else{
					self.$flyToTopBtn.removeClass('show');
				}
			});

			this.$flyToTopBtn.click(function(){
				animation.add({
					startValue: self.$scrollWrap.scrollTop(),
					endValue: 0,
					duration: 300,
					step: function(v){
						self.$scrollWrap.scrollTop(v);
					}
				});
			});
		},
		refresh: function(){
			var self = this;
			this.render().then(function(){
				self.$scrollWrap.scrollTop(0);
				tip.show('已刷新');
			});
		}
	};

	return VideoList;

});