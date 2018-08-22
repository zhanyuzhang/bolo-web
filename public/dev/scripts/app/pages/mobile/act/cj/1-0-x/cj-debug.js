/**
 * Created by Dillance on 16/7/20.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		wx = require('//res.wx.qq.com/open/js/jweixin-1.0.0.js'),
		util = require('/common/util@1-0-x'),
		stat = require('/common/Stat@1-0-x'),
		uadetector = require('uadetector@1-0-x'),
		user = require('/common/userMobile/1-0-x/User'),
		native = require('/common/native@1-0-x');

	if(uadetector.isDevice('pc')){
		location.href = '/act/cj' + location.search;
		return;
	}

	var Live = require('/pages/mobile/act/cj/1-0-x/modules/live'),
		Pavilion = require('/pages/mobile/act/cj/1-0-x/modules/pavilion'),
		Periphery = require('/pages/mobile/act/cj/1-0-x/modules/periphery'),
		Girls = require('/pages/mobile/act/cj/1-0-x/modules/girls'),
		//Comment = require('/pages/mobile/act/cj/1-0-x/modules/comment'),
		Fun = require('/pages/mobile/act/cj/1-0-x/modules/fun');

	//$.ajax({
	//	url:HttpHelper.getOrigin() + '/bolo/api/wechat/getJsApiSignature.htm',
	//	dataType: 'jsonp',
	//	data: {
	//		url: 'bolo.bobo.com'
	//	},
	//	success: function(result){
	//		var data = result.data;
	//		wx.config({
	//			appId: data.appid, // 必填，公众号的唯一标识
	//			timestamp: data.timestamp, // 必填，生成签名的时间戳
	//			nonceStr: data.noncestr, // 必填，生成签名的随机串
	//			signature: data.signature,// 必填，签名，见附录1
	//			jsApiList: [
	//				'checkJsApi',
	//				'onMenuShareTimeline',
	//				'onMenuShareAppMessage',
	//				'onMenuShareQQ',
	//				'onMenuShareWeibo'
	//			] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	//		});
	//		wx.ready(function(){
	//			wx.checkJsApi({
	//				jsApiList: [
	//					'checkJsApi',
	//					'onMenuShareTimeline',
	//					'onMenuShareAppMessage',
	//					'onMenuShareQQ',
	//					'onMenuShareWeibo'
	//				]
	//			});
	//			wx.onMenuShareAppMessage({
	//				title: 'shit', // 分享标题
	//				link: encodeURIComponent(location.href), // 分享链接
	//				imgUrl: '', // 分享图标
	//				success: function () {
	//					// 用户确认分享后执行的回调函数
	//					alert('分享啦')
	//				},
	//				cancel: function () {
	//					// 用户取消分享后执行的回调函数
	//					alert('没分享啦')
	//				}
	//			});
	//			wx.onMenuShareTimeline({
	//				title: 'shit', // 分享标题
	//				link: encodeURIComponent(location.href), // 分享链接
	//				imgUrl: '', // 分享图标
	//				success: function () {
	//					// 用户确认分享后执行的回调函数
	//					alert('分享啦')
	//				},
	//				cancel: function () {
	//					// 用户取消分享后执行的回调函数
	//					alert('没分享啦')
	//				}
	//			});
	//		});
	//	}
	//});

	var Page = {
		$wrapper: $('.wrapper'),
		init: function(){
			this.$navPlaceholder = this.$wrapper.find('.nav-placeholder');
			this.$nav = this.$wrapper.find('.nav');
			this.$pageContainers = this.$wrapper.find('.page-container');
			Live.init();
			//Comment.init();
			Fun.init();
			this.render();
			this.bindEvents();
			native.call('setShareInfo',{
				default: {
					title: '2016ChinaJoy开车指南-网易菠萝出品',
					description: '#网易菠萝##ChinaJoy#我竟然在CJ上看这个！不能只有我一个人high',
					url: location.href,
					image: 'http://img1.cache.netease.com/bobo/2016/7/25/20160725185653b6a68.png'
				}
			});
		},
		render: function(){
			if(util.isSupportSticky) this.$navPlaceholder.addClass('sticky');
			if(uadetector.is(/MicroMessenger|QQ/)){
				$('.share-icons').addClass('in-tencent');
			}else if(uadetector.is(/Weibo/)){
				$('.share-icons').addClass('full');
			}
		},
		bindEvents: function(){
			var self = this,
				$window = $(window),
				navPlaceholderOriginTop = self.$navPlaceholder.offset().top;
			this.$nav.find('.item').tap(function(){
				var $this = $(this);
				if(!$this.hasClass('current')){
					$this.addClass('current').siblings('.current').removeClass('current');
					self.$pageContainers.filter('.show').removeClass('show');
					self.$pageContainers.eq($this.index()).addClass('show');
					if($this.index() == 1 && !Pavilion.inited){
						Pavilion.inited = true;
						Pavilion.init();
					}else if($this.index() == 3 && !Periphery.inited){
						Periphery.inited = true;
						Periphery.init();
					}else if($this.index() == 4 && !Girls.inited){
						Girls.inited = true;
						Girls.init();
					}

					if($window.scrollTop() >= navPlaceholderOriginTop) $window.scrollTop(navPlaceholderOriginTop);
					if($this.data('stat-key')) stat.send($this.data('stat-key'));
				}
			});

			this.$wrapper.on('tap','.sub-video-box .item',function(){
				location.href = $(this).attr('href');
			});

			if(!util.isSupportSticky){
				$window.scroll(function(){
					if($window.scrollTop() >= self.$navPlaceholder.offset().top && !self.$nav.hasClass('pinned')){
						self.$nav.addClass('pinned');
					}else if($window.scrollTop() < self.$navPlaceholder.offset().top && self.$nav.hasClass('pinned')){
						self.$nav.removeClass('pinned');
					}

				});
			}

			$('.ip-wall .item').tap(function(){
				stat.send('ip' + ($(this).index() + 1) + '_h5');
				location.href = $(this).data('href');
			});

			$('.header-placeholder .logout-btn').longTap(function(){
				if(user.isLogin()) user.logout();
			});

			$('.partners .logo').tap(function(){
				location.href = $(this).data('href');
			});

			$('.download-btn').tap(function(){
				stat.send('download_h5');
			});

		}
	};

	Page.init();

});