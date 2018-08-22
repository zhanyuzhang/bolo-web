/**
 * Created by Dillance on 16/4/27.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		tmpl = require('/common/tmpl@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		animation = require('animation@1-0-x'),
		//IScroll = require('iscroll/5-1-3/iscroll-probe'),
		VideoList = require('/pages/mobile/webview/recommend/1-1-x/modules/VideoList'),
		native = require('/common/native@1-0-x'),
		uadetector = require('uadetector@1-0-x'),
		qs = require('querystring@1-0-x'),
		Promise = require('promise@1-0-x'),
		Stat = require('/common/Stat@1-0-x'),
		Swiper = require('swiper@3-3-x');


	var Page = {
		$wrapper: $('.wrapper'),
		zid: qs.parse().zid,
		init: function(){
			this.$navBar = this.$wrapper.find('.nav-bar');
			this.$navBarContainer = this.$navBar.find('.list-container');
			this.$navListAll = $('.nav-list-all');

			this.$mainContainer = this.$wrapper.find('.main-container');
			this.listArr = [];
			this.render();
		},
		render: function(){
			var self = this;
			self.listArr[0] = new VideoList(this.$mainContainer.find('.list-wrap').eq(0),'home');
			this.getCategoryList().then(function(data){
				self.renderCategoryList(data);
				//self.generateIScroll();
				self.generateSwiper();
				self.bindEvents();
				if(qs.parse().cid){
					self.$navBarItems.each(function(){
						var $this = $(this);
						if($this.data('cid') == qs.parse().cid) $this.trigger('tap');
					});
				}else self.listArr[1] = new VideoList(self.$mainContainer.find('.list-wrap').eq(1));
			});
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
			this.$mainContainer.find('.content').append(listWrap).css('width',(data.length + 1) * $(window).width());

		},
		getCategoryList: function(){
			return new Promise(function(resolve,reject){
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/zone/categoryList.htm',
					dataType: 'jsonp',
					data: {
						zoneId: qs.parse().zid
					},
					success: function(result){
						if(result && result.length) resolve(result);
						else reject();
					}
				})
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
					//self.mainScroll.targetPage = $this.index();
					//self.mainScroll.navCurrentIndex = self.$navBarItems.filter('.current').index();
					//self.mainScroll.navCurrentScrollLeft = self.$navBarContainer.scrollLeft();
					self.navScrollTo($this.index(),200);
					self.mainScroll.slideTo($this.index(),200);

					Stat.send('classPage_' + self.zid + '_tab',{
						label: 'position:' + $this.index()
					});
				}
			});

			this.$navListAll.find('.item').tap(function(){
				$(this).addClass('current').siblings('.current').removeClass('current');
				self.$navBarItems.eq($(this).index()).trigger('tap');
			});

			this.$mainContainer.on('click','li.item',function(){
				if(native.hello()){
					native.call('openVideo',{
						videoId: $(this).data('vid')
					});
				}else{
					location.href = '/m/play?videoId=' + $(this).data('vid');
				}
			});

			native.on('refresh',function(){
				if(self.listArr[self.mainScroll.activeIndex]) self.listArr[self.mainScroll.activeIndex].refresh();
			});
		},
		generateSwiper: function(){
			var self = this;

			this.mainScroll = new Swiper('.main-container',{
				onSlideChangeEnd: function(me,e){
					self.navScrollTo(me.activeIndex);

					var $listWrap = self.$mainContainer.find('.list-wrap').eq(me.activeIndex),
						$nextListWrap = self.$mainContainer.find('.list-wrap').eq(me.activeIndex + 1);
					if(!$listWrap.data('inited')) self.listArr[me.activeIndex] = new VideoList($listWrap);
					if($nextListWrap.length && !$nextListWrap.data('inited')) self.listArr[me.activeIndex + 1] = new VideoList($nextListWrap);
				}
			});

		},
		navScrollTo: function(index,speed){
			var self = this;
			//this.navContainerWidth = this.navContainerWidth || self.$navBarContainer.width();
			//this.navOffsetWidth = this.navOffsetWidth || (this.navContainerWidth / 2 - self.$navBarItems.eq(0).width() / 2);
			//this.navScrollWidth = this.navScrollWidth || (this.navOffsetWidth + self.$navBarContainer.get(0).scrollWidth + (this.navContainerWidth / 2 - self.$navBarItems.last().width() / 2));
			//this.navScrollDistance = this.navScrollDistance || (this.navScrollWidth - this.navContainerWidth);

			var $targetNavItem = this.$navBarContainer.find('.item').eq(index);
			animation.add({
				startValue: this.$navBarContainer.scrollLeft(),
				endValue: $targetNavItem.offset().left + this.$navBarContainer.scrollLeft() - (this.$navBarContainer.width() / 2 - $targetNavItem.width() / 2),
				duration: speed || 200,
				step: function(value){
					self.$navBarContainer.scrollLeft(value)
				},
				oncomplete: function(){
					$targetNavItem.addClass('current').siblings('.current').removeClass('current');
					self.$navListAll.find('.item').eq(index).addClass('current').siblings('.current').removeClass('current');
				}
			});
		},
		generateIScroll: function(){
			var self = this;
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

				var $listWrap = self.$mainContainer.find('.list-wrap').eq(this.currentPage.pageX),
					$nextListWrap = self.$mainContainer.find('.list-wrap').eq(this.currentPage.pageX + 1);
				if(!$listWrap.data('inited')) new VideoList($listWrap);
				if($nextListWrap.length && !$nextListWrap.data('inited')) new VideoList($nextListWrap);
			});

			this.mainScroll.on('scrollCancel',function(){
				//self.mainScroll.scrollTo(-self.mainScroll.currentPage.pageX * self.mainScroll.wrapperWidth,0,200);
				self.mainScroll.goToPage(self.mainScroll.currentPage.pageX,0,200);
			});
		}
	};

	Page.init();

});