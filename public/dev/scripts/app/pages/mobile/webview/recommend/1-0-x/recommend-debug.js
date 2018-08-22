/**
 * Created by Dillance on 16/4/27.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		tmpl = require('/common/tmpl@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		animation = require('animation@1-0-x'),
		IScroll = require('iscroll/5-1-3/iscroll-probe'),
		VideoList = require('/pages/mobile/webview/recommend/1-0-x/modules/VideoList'),
		native = require('/common/native@1-0-x'),
		uadetector = require('uadetector@1-0-x'),
		qs = require('querystring@1-0-x');


	var Page = {
		$wrapper: $('.wrapper'),
		init: function(){
			this.$navBar = this.$wrapper.find('.nav-bar');
			this.$navBarContainer = this.$navBar.find('.list-container');

			this.$navListAll = $('.nav-list-all');

			this.$mainContainer = this.$wrapper.find('.main-container');

			this.getCategoryList();

			native.call('setShareInfo',{
				default: {
					title: '一本正经安利：菠萝菌的力荐清单',
					description: '种草星人菠萝菌向你疯狂安利',
					url: location.href
				},
				weibo: {
					title: '种草星人@网易菠萝菌 向你疯狂安利这些视频，一起来看吧' + location.href
				}
			});
		},
		renderScroll: function(){

			var options;
			if(uadetector.isOS('ios')){
				options = {
					scrollX: true,
					scrollY: false,
					momentum: false,
					snap: true,
					snapSpeed: 300,
					keyBindings:false,
					indicators: false,
					eventPassthrough: true,
					probeType: 3
				}
			}else{
				options = {
					scrollX: true,
					scrollY: false,
					momentum: false,
					bounce: false,
					snap: true,
					snapSpeed: 300,
					keyBindings:false,
					indicators: false,
					eventPassthrough: true,
					probeType: 0
				}
			}

			this.mainScroll = new IScroll(this.$mainContainer.get(0),options);
			this.bindScrollEvents();
		},
		renderCategoryList: function(data){
			var categoryList = tmpl.render('category-list',{
				data: data
			});
			this.$navBarContainer.html(categoryList);
			this.$navBar.addClass('show');
			this.$navBarItems = this.$navBarContainer.find('.item');
			this.$navListAll.find('.list-wrap').html(categoryList);
			this.$navListAllItems = this.$navListAll.find('.item');

			var listWrap = tmpl.render('video-wrap',{
				data: data
			});
			this.$mainContainer.find('.content').html(listWrap).css('width',data.length * $(window).width());

			this.renderScroll();
			this.bindEvents();
			this.renderVideoLists(data);

			if(qs.parse().cid){
				this.$navListAll.find('.item').each(function(){
					var $this = $(this);
					if($this.data('cid') == qs.parse().cid) $this.trigger('tap');
				});
			}
		},
		getCategoryList: function(){
			var self = this;
			$.ajax({
				url: HttpHelper.getOrigin() + '/bolo/api/video/categoryList.htm',
				dataType: 'jsonp',
				success: function(result){
					if(result){
						if(result.length > 8) result.length = 8;
						self.renderCategoryList(result);
					}else alert('网络异常，请稍后再试')
				}
			});
		},
		renderVideoLists: function(data){
			var self = this;
			this.categoryList = data;
			//this.categoryList.forEach(function(d){
			//	d.currentPage = 0;
			//});
			this.$mainContainer.find('.list-wrap').each(function(i){
				if(self.categoryList[i]) self.categoryList[i].videoList = new VideoList($(this));
			});
		},
		bindEvents: function(){
			var self = this;

			this.$navBar.find('.open-btn').tap(function(e){
				e.stopPropagation();
				self.$navListAll.addClass('show');
			});

			this.$navListAll.find('.close-btn').add(this.$wrapper).tap(function(){
				if(self.$navListAll.hasClass('show')) self.$navListAll.removeClass('show');
			});

			this.$navBarItems.tap(function(){
				var $this = $(this);
				if(!$this.hasClass('current')){
					self.mainScroll.targetPage = $this.index();
					self.mainScroll.navCurrentIndex = self.$navBarItems.filter('.current').index();
					self.mainScroll.navCurrentScrollLeft = self.$navBarContainer.scrollLeft();
					self.mainScroll.goToPage($this.index(),0,200);
				}
			});

			this.$navListAll.find('.item').tap(function(){
				$(this).addClass('current').siblings('.current').removeClass('current');
				self.$navBarItems.eq($(this).index()).trigger('tap');
			});

			this.$mainContainer.on('tap','li.item',function(){
				if(native.hello()){
					native.call('openVideo',{
						videoId: $(this).data('vid')
					});
				}else{
					location.href = '/m/play?videoId=' + $(this).data('vid');
				}
			})

		},
		bindScrollEvents: function(){
			var self = this;

			var containerWidth = self.$navBarContainer.width();
			var offsetWidth = containerWidth / 2 - self.$navBarItems.eq(0).width() / 2;
			var navScrollWidth = containerWidth / 2 - self.$navBarItems.eq(0).width() / 2 + self.$navBarContainer.get(0).scrollWidth + (containerWidth / 2 - self.$navBarItems.last().width() / 2);
			var navScrollDistance = navScrollWidth - containerWidth;

			this.mainScroll.on('scrollStart',function(){
				if(!this.targetPage) return;
				this.navCurrentIndex = self.$navBarItems.filter('.current').index();
				this.navCurrentScrollLeft = self.$navBarContainer.scrollLeft();
			});

			this.mainScroll.on('scroll',function(){
				if(self.mainScroll.x >= 0 || self.mainScroll.x <= self.mainScroll.wrapperWidth - self.mainScroll.scrollerWidth) return;
				//self.$navBarContainer.scrollLeft(-self.mainScroll.x / (self.mainScroll.scrollerWidth - self.mainScroll.wrapperWidth) * (self.$navBarContainer.get(0).scrollWidth - self.$navBarContainer.width()));
				var linkageScroll = -self.mainScroll.x / (self.mainScroll.scrollerWidth - self.mainScroll.wrapperWidth) * navScrollDistance - offsetWidth;

				if(this.targetPage){
					if(this.navCurrentIndex < this.targetPage && linkageScroll < this.navCurrentScrollLeft) return;
					else if(this.navCurrentIndex > this.targetPage && linkageScroll > this.navCurrentScrollLeft) return
				}

				self.$navBarContainer.scrollLeft(linkageScroll);
			});

			this.mainScroll.on('scrollEnd',function(){
				//self.$navBarContainer.scrollLeft(-self.mainScroll.x / (self.mainScroll.scrollerWidth - self.mainScroll.wrapperWidth) * (self.$navBarContainer.get(0).scrollWidth - self.$navBarContainer.width()));
				self.$navBarItems.filter('.current').removeClass('current');
				self.$navBarItems.eq(self.mainScroll.currentPage.pageX).addClass('current');
				self.$navListAllItems.filter('.current').removeClass('current');
				self.$navListAllItems.eq(self.mainScroll.currentPage.pageX).addClass('current');
				if(this.targetPage) this.targetPage = '';

				var linkageScroll = -self.mainScroll.x / (self.mainScroll.scrollerWidth - self.mainScroll.wrapperWidth) * navScrollDistance - offsetWidth;
				self.$navBarContainer.scrollLeft(linkageScroll);
			});

			this.mainScroll.on('scrollCancel',function(){
				//self.mainScroll.scrollTo(-self.mainScroll.currentPage.pageX * self.mainScroll.wrapperWidth,0,200);
				self.mainScroll.goToPage(self.mainScroll.currentPage.pageX,0,200);
			});
		}
	};

	Page.init();

});