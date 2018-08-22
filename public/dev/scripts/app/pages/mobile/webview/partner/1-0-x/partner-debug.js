/**
 * Created by Dillance on 16/6/24.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		tmpl = require('/common/tmpl@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		animation = require('animation@1-0-x'),
		Promise = require('promise@1-0-x'),
		native = require('/common/native@1-0-x'),
		Stat = require('/common/Stat@1-0-x'),
		util = require('/common/util@1-0-x'),
		tip = require('/common/uiComponent/mobile/tip@1-0-x');

	var Page = {
		$wrapper: $('.wrapper'),
		init: function(){
			var self = this;
			this.$newPartnerList = $('.new-partner .partner-list');
			this.$categoryListPlaceholder = $('.category-list-placeholder');
			this.$categoryList = $('.category-list');
			this.$allPartner = $('.all-partner');
			this.$partnerBox = this.$allPartner.find('.partner-box');
			this.$allPartnerList = this.$partnerBox.find('.partner-list');
			this.pageSize = 10;

			this.$flyToTopBtn = $('.fly-to-top');

			this.followList = [];
			if(native.isLogin()) this.getFollowList(function(){
				self.getPartnerList();
			});
			else self.getPartnerList();

			this.render();
			this.bindEvents();

		},
		getFollowList: function(callback){
			var self = this;
			$.ajax({
				url: HttpHelper.getOrigin() + '/bolo/api/user/followUids.htm',
				dataType: 'jsonp',
				data: {
					userId: native.userInfo.userId,
					encryptToken: native.userInfo.encryptToken,
					timeStamp: native.userInfo.timeStamp || native.userInfo.timestamp,
					random: native.userInfo.random
				},
				success: function(result){
					if(result && result.length) self.followList = result;
					if(callback) callback();
				}
			});
		},
		render: function(){
			var self = this;

			if(util.isSupportSticky){
				this.$categoryListPlaceholder.addClass('sticky');
			}

			$.ajax({
				url: HttpHelper.getOrigin() + '/bolo/api/index/hotChannel.htm',
				dataType: 'jsonp',
				data: {
					pageSize: 8,
					userId: native.userInfo.userId || ''
				},
				success: function (result) {
					if (result && result.length) {
						self.$newPartnerList.html(tmpl.render('new-partner-list', {
							data: result,
							getImage: HttpHelper.getImage
						}));
					}
				}
			});

			$.ajax({
				url: HttpHelper.getOrigin() + '/bolo/api/channel/tagList.htm',
				dataType: 'jsonp',
				success: function(result){
					if(result && result.length){
						console.log(result);
						self.$categoryList.html(tmpl.render('category-list',{
							data: result
						}));
						self.$categoryListPlaceholder.css('height',self.$categoryListPlaceholder.height());
					}
				}
			});
		},
		bindEvents: function(){
			var self = this;
			this.$wrapper.scroll(function(){
				var wrapperScrollTop = self.$wrapper.scrollTop(),
					categoryListPlaceholderOffsetTop = self.$categoryListPlaceholder.offset().top;

				if(util.isSupportSticky){
					//if(categoryListPlaceholderOffsetTop <= 0 && !self.$categoryListPlaceholder.hasClass('sticked')){
					//	self.$categoryListPlaceholder.addClass('sticked');
					//}else if(categoryListPlaceholderOffsetTop > 0 && self.$categoryListPlaceholder.hasClass('sticked')){
					//	self.$categoryListPlaceholder.removeClass('sticked');
					//}
				}else{
					if(categoryListPlaceholderOffsetTop <= 0 && !self.$categoryList.hasClass('pinned')){
						self.$categoryList.addClass('pinned');
					}else if(categoryListPlaceholderOffsetTop > 0 && self.$categoryList.hasClass('pinned')){
						self.$categoryList.removeClass('pinned');
					}
				}

				if(wrapperScrollTop > self.$wrapper.height()) self.$flyToTopBtn.addClass('show');
				else self.$flyToTopBtn.removeClass('show');

				self.$partnerBox.find('.partner-wrap').each(function(){
					var $this = $(this),
						//viewPortHeight = self.$wrapper.height(),
						thisHeight = $this.height(),
						thisOffsetTop = $this.offset().top,
						placeholderHeight = self.$categoryListPlaceholder.height();
					if(thisOffsetTop - placeholderHeight < 5 && -thisOffsetTop - placeholderHeight <= thisHeight){
						var $currentCategoryItem = self.$categoryList.find('.item').eq($this.index());
						if(!$currentCategoryItem.hasClass('current')) $currentCategoryItem.addClass('current').siblings('.current').removeClass('current');
					}
				});

			});

			this.$flyToTopBtn.tap(function(){
				animation.add({
					startValue: self.$wrapper.scrollTop(),
					endValue: 0,
					duration: 300,
					step: function(v){
						self.$wrapper.scrollTop(v);
					}
				})
			});

			this.$categoryList.on('tap','.item',function(){
				var $this = $(this),
					id = $this.attr('data-id');
				if($this.hasClass('current')) return;

				Stat.send('IpTotalPage_IPclass',{
					label: 'position:' + $this.index()
				});

				$this.addClass('current').siblings('.current').removeClass('current');

				self.$partnerBox.find('.header').each(function(){
					var $thisHeader = $(this);
					if($thisHeader.data('tag') == $this.text()){
						animation.add({
							startValue: self.$wrapper.scrollTop(),
							endValue: self.$wrapper.scrollTop() + $thisHeader.offset().top - self.$categoryListPlaceholder.height(),
							duration: 100,
							step: function(v){
								self.$wrapper.scrollTop(v);
							}
						})
					}
				});
			});

			this.$partnerBox.on('tap','.follow-btn',function(e){
				e.stopPropagation();

				Stat.send('IpTotalPage_follow');

				var $this = $(this);
				if(!native.isLogin()) native.call('loginApp');
				else if(!$this.data('following')){
					$this.data('following',true);
					var isFollowed = $this.hasClass('followed');
					$.ajax({
						url: HttpHelper.getOrigin() + '/bolo/api/user/follow',
						dataType: 'jsonp',
						data: {
							userId: native.userInfo.userId,
							encryptToken: native.userInfo.encryptToken,
							timeStamp: native.userInfo.timeStamp || native.userInfo.timestamp,
							random: native.userInfo.random,
							follow: !isFollowed,
							followedId: $this.attr('data-id')
						},
						success: function(result){
							$this.data('following',false);
							if(result.status == 1){
								if(isFollowed){
									tip.show('取消关注成功');
									$this.removeClass('followed').find('.text').text('关注');
								}else{
									$this.addClass('followed').find('.text').text('已关注');

									self.doMission().then(function(data){
										if(data.status == 1 && data.changeList.length){
											native.call('showToast',{
												message: '任务完成：' + data.changeList[0].taskName + ',增加' + data.changeList[0].award + '种子'
											});
										}else{
											tip.show('关注成功');
										}
									});

								}
								native.call('onFollowUpdated',{
									userId: $this.attr('data-id'),
									follow: !isFollowed
								});
							}else{
								tip.show(result.msg);
							}
						}
					});
				}
			});

			this.$newPartnerList.on('tap','.item',function(){
				Stat.send('IpTotalPage_newIP',{
					label: 'position:' + $(this).index()
				});
				native.call('openChannel',{
					channelId: $(this).attr('data-id')
				});
			});

			this.$allPartner.on('tap','.partner-card',function(e){
				native.call('openChannel',{
					channelId: $(this).attr('data-id')
				});
			});
			this.$partnerBox.on('tap','.video-item',function(e){
				e.stopPropagation();
				native.call('openVideo',{
					videoId: $(this).attr('data-id')
				});
			});

			native.on('return',function(){
				if(native.isLogin()) self.getFollowList(function(){
					self.$partnerBox.find('.follow-btn').each(function(){
						var $this = $(this);
						if(self.followList.indexOf($this.attr('data-id')) >= 0 && !$this.hasClass('followed')){
							$this.addClass('followed').find('.text').text('已关注');
						}else if(self.followList.indexOf($this.attr('data-id')) < 0 && $this.hasClass('followed')){
							$this.removeClass('followed').find('.text').text('关注');
						}
					});
				});
			});

		},
		getPartnerList: function(){
			var self = this;
			$.ajax({
				url: HttpHelper.getOrigin() + '/bolo/api/channel/channelList.htm',
				dataType: 'jsonp',
				success: function(result){
					if(result){
						if(self.followList.length){
							result.forEach(function(d){
								if(d.channels.length){
									d.channels.forEach(function(c){
										if(self.followList.indexOf(c.userIdStr) >= 0) c.isFollowed = true;
									});
								}
							});
						}
						self.$partnerBox.html(tmpl.render('all-partner-list',{
							data: result,
							getImage: HttpHelper.getImage
						}));
						self.lazyload(self.$partnerBox.find('.video-img'));
					}
				}
			});
		},
		lazyload: function($videoImgs){
			var self = this;
			if($videoImgs && $videoImgs.length){
				this.$wrapper.scroll(function(){
					if(!$videoImgs.length) return;
					$videoImgs = $videoImgs.map(function(){
						var $this = $(this);
						if($this.offset().top <= self.$wrapper.height()){
							$this.on('load',function(){
								$this.addClass('show');
							}).attr('src',$this.data('origin'));
						}else return $this;
					});
				});
			}
		},
		doMission: function(){
			return new Promise(function(resolve,reject){
				$.getJSON(HttpHelper.getOrigin() + '/bolo/api/task/doTask',{
					userId: native.userInfo.userId,
					action: 2
				},function(result){
					resolve(result);
				});
			});
		}
	};

	//native.call('getLoginInfo',function(userInfo) {
	//	native.userInfo = userInfo;
	//	Page.init();
	//});
	setTimeout(function(){
		Page.init();
	},50);

});