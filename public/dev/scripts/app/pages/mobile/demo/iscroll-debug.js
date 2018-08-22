/**
 * Created by Dillance on 16/7/6.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		IScroll = require('iscroll/5-1-3/iscroll-probe'),
		Swiper = require('swiper@3-3-x');

	var scroll = new Swiper('.wrapper',{
		onProgress: function(me){
			console.log(me);
		}
	});

	//var mainScroll = new IScroll($('.wrapper').get(0),{
	//	scrollX: true,
	//	scrollY: false,
	//	momentum: false,
	//	snap: false,
	//	snapSpeed: 300,
	//	keyBindings:false,
	//	indicators: false,
	//	eventPassthrough: true,
	//	probeType: 0
	//});

//$('.container').on('touchmove',function(e){
//	$('.container').css({
//		'transition-timing-function': 'cubic-bezier(0.1, 0.57, 0.1, 1)',
//		'transform': 'translate(' + e.changedTouches[0].pageX + 'px,0) translateZ(0px)',
//		'transition-duration': '0ms'
//	});
//});

});