/**
 * Created by Dillance on 16/7/21.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		Promise = require('promise@1-0-x'),
		tmpl = require('/common/tmpl@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		tip = require('/common/uiComponent/mobile/tip@1-0-x'),
		photo = require('/pages/mobile/act/cj/1-0-x/modules/photo'),
		Swiper = require('swiper@3-3-x');

	var Pavilion = {
		$wrapper: $('.pavilion-page'),
		init: function(){
			this.render();
		},
		render: function(){
			photo.slideBox(this.$wrapper.find('.pavilion-n2 .content'),{
				data: [{
					image: 'http://img4.cache.netease.com/bobo/2016/7/18/20160718190913eed45.jpg',
					intro: '2016CJ完美世界展台俯瞰图'
				},{
					image: 'http://img1.cache.netease.com/bobo/2016/7/18/20160718190929be0c7.jpg',
					intro: '浴室迷魂体验区'
				},{
					image: 'http://img4.cache.netease.com/bobo/2016/7/18/20160718190703db267.jpg',
					intro: '2016盛大游戏CJ展台'
				},{
					image: 'http://img6.cache.netease.com/bobo/2016/7/18/2016071819071693166.jpg',
					intro: '2016盛大游戏CJ展台'
				},{
					image: 'http://img4.cache.netease.com/bobo/2016/7/18/20160718190806fafc1.png',
					intro: '2016腾讯CJ展台'
				},{
					image: 'http://img1.cache.netease.com/bobo/2016/7/18/20160718190822a362c.png',
					intro: '2015腾讯CJ展台'
				}],
				getImage: HttpHelper.getImage
			});

			photo.slideBox(this.$wrapper.find('.pavilion-n3 .content'),{
				data: [{
					image: 'http://img5.cache.netease.com/bobo/2016/7/18/20160718184632a839a.jpg',
					intro: '2015 37游戏CJ展台'
				},{
					image: 'http://img4.cache.netease.com/bobo/2016/7/18/2016071818464952f91.jpg',
					intro: '2015 37游戏CJ展台'
				},{
					image: 'http://img3.cache.netease.com/bobo/2016/7/18/201607181908365b997.jpg',
					intro: '2016西山居古色古香的展台'
				},{
					image: 'http://img1.cache.netease.com/bobo/2016/7/18/20160718190858b5492.jpg',
					intro: '2016西山居showgirl'
				}],
				getImage: HttpHelper.getImage
			});

			photo.slideBox(this.$wrapper.find('.pavilion-n4 .content'),{
				data: [{
					image: 'http://img5.cache.netease.com/bobo/2016/7/18/20160718185626dc220.jpg',
					intro: 'Minecraft x 网易游戏展台'
				},{
					image: 'http://img6.cache.netease.com/bobo/2016/7/18/201607181906466f6ae.jpg',
					intro: '《风暴英雄》新英雄奥莉尔'
				},{
					image: 'http://img1.cache.netease.com/bobo/2016/7/21/20160721214214aeab7.jpg',
					intro: '2016网易游戏红色主场'
				},{
					image: 'http://img4.cache.netease.com/bobo/2016/7/21/201607212142552e656.jpg',
					intro: '《梦幻西游无双版》、《大话西游手游》游戏画面'
				},{
					image: 'http://img4.cache.netease.com/bobo/2016/7/21/20160721214314410ad.jpg',
					intro: '《倩女幽魂2》、《天下3》游戏画面'
				},{
					image: 'http://img5.cache.netease.com/bobo/2016/7/26/201607262028117f83c.jpg',
					intro: '萌萌哒菠萝周边'
				},{
					image: 'http://img2.cache.netease.com/bobo/2016/7/18/20160718185213bb3ee.png',
					intro: '大力金刚携女票亮相CJ'
				}],
				getImage: HttpHelper.getImage
			});

			photo.slideBox(this.$wrapper.find('.pavilion-n5 .content'),{
				data: [{
					image: 'http://img1.cache.netease.com/bobo/2016/7/18/201607181848281f638.jpg',
					intro: '《奇葩说》女神来了手游'
				},{
					image: 'http://img2.cache.netease.com/bobo/2016/7/18/201607181849004e508.jpg',
					intro: '古典美的showgirl'
				},{
					image: 'http://img4.cache.netease.com/bobo/2016/7/18/201607181853217611c.jpg',
					intro: '2015支付宝CJ展台'
				},{
					image: 'http://img4.cache.netease.com/bobo/2016/7/18/2016071818535080440.jpg',
					intro: '出动无人机高调送餐'
				}],
				getImage: HttpHelper.getImage
			});

			this.$wrapper.find('.area-intro').each(function(){
				new Swiper(this,{
					pagination: '.indicator',
					paginationElement : 'div'
				});
			});
		}
	};

	return Pavilion;

});