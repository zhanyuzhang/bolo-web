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
		photo = require('/pages/mobile/act/cj/1-0-x/modules/photo');

	var Girls = {
		$wrapper: $('.girls-page'),
		init: function(){
			this.render();
		},
		render: function(){
			photo.slideBox(this.$wrapper.find('.content'),{
				data: [{
					title: '网易GACHA coser 妍酱：',
					image: 'http://img2.cache.netease.com/bobo/2016/7/18/201607181722545446b.jpg',
					intro: '一个身材热辣的超性感索尼子！还有老司机最喜欢的邪恶俯拍视角耶~ <a href="http://gacha.163.com/detail/post/c78633ab19a3433a816d8488e0e60593">去GACHA看她</a>'
				},{
					title: '网易GACHA coser 一诺:',
					image: 'http://img2.cache.netease.com/bobo/2016/7/18/20160718172351bb391.jpg',
					intro: 'LL人妻东条希梦幻公主装，美艳不可方物。 <a href="http://gacha.163.com/detail/post/c78633ab19a3433a816d8488e0e60593">去GACHA看她：</a>'
				},{
					title: 'Yuuto',
					image: 'http://img2.cache.netease.com/bobo/2016/7/20/201607201640455846a.png',
					intro: '身材劲爆的CoserYuuto也是专业营养师一枚~玩得最多的游戏是LOL和音游。Yuuto说，熟的人都叫她知心爸爸，需排位带飞或者想调理一下身体的时候都可以找她噢！<a href="https://www.oneniceapp.com/user/rsDsXG?uid=rsDsXG&nfrom=wechat_contact&app_version=3.9.13">去nice看她</a>'
				},{
					title: '瓶子',
					image: 'http://img1.cache.netease.com/bobo/2016/7/20/2016072016442414277.png',
					intro: '瓶子，一个外向乐观的妹纸，喜欢跳舞喜欢动漫喜欢杰尼斯，学习舞蹈已经有13年了，并且获得过大大小小的奖项。温柔可人的她，会在今年CJ网易游戏展区舞台大秀舞技噢。 <a href="https://www.oneniceapp.com/user/8hVDVS?uid=8hVDVS&nfrom=wechat_contact">去nice看她</a>'
				},{
					title: '祺祺',
					image: 'http://img1.cache.netease.com/bobo/2016/7/20/2016072016413877ce3.png',
					intro: '娇小可爱的祺祺，自称是一枚自带逗比属性的喵星人。偶尔神经质的双子座，平时主要在跳宅舞，有时也会玩cosplay。祺祺说，要登台啦好紧张，希望能得到菠萝原住民们的支持哟！'
				},{
					title: '黄靖翔',
					image: 'http://img1.cache.netease.com/bobo/2016/7/18/20160718171814b2224.jpg',
					intro: '靖翔欧巴在动漫圈人气爆棚，曾获2014ChinaJoy封面角色大赛银奖，被新浪微博评选位2015年度二次元最具影响力大V。除了当coser，还参演过网剧《男神执事团》，网络大电影《双程》。 <a href="http://huangjingxiang.lofter.com">去LOFTER看他</a>'
				},{
					title: '小孽',
					image: 'http://img5.cache.netease.com/bobo/2016/7/20/2016072016430919068.png',
					intro: '超美精灵小孽，一个听到音乐身体就会情不自禁的跟着摇摆摇摆的萌妹纸，最喜欢宅舞，希望带给大家一个元气满满的自己！她和瓶子、祺祺将组成3人宅舞团出现在CJ现场，菠萝老司机已经准备好前排板凳啦~！'
				},{
					title: '小小白',
					image: 'http://img4.cache.netease.com/bobo/2016/7/21/20160721162155153f1.jpg ',
					intro: 'cos圈美颜盛世的知名coser，出版过《福》、《洛幕》、《潋心》等cosplay图集，同时还是负责3D动画《秦时明月》等作品宣传企划工作的高手噢。 <a href="http://175569734.lofter.com/">去LOFTER看他</a>'
				},{
					title: '金大玮',
					image: 'http://img3.cache.netease.com/bobo/2016/7/18/2016071817172416aa0.jpg',
					intro: '170cm长腿女神金大玮去年也参加过CJ，今年是网易游戏展区showgirl之一'
				},{
					title: '王茹',
					image: 'http://img4.cache.netease.com/bobo/2016/7/18/2016071817175103afd.jpg',
					intro: '大眼睛萌妹子王茹，有着白皙皮肤甜美笑容，也是今年网易游戏展区的showgirl之一'
				}],
				getImage: HttpHelper.getImage
			});
		}
	};

	return Girls;

});