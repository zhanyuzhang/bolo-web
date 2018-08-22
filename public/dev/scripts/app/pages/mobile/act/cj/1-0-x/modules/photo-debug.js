/**
 * Created by Dillance on 16/7/21.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		tmpl = require('/common/tmpl@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		tip = require('/common/uiComponent/mobile/tip@1-0-x'),
		Swiper = require('swiper@3-3-x');

	function slideBox($parent,data){
		var $box = $(tmpl.render('photos-box',data));
		$parent.append($box);
		$box.swiper = new Swiper($box.find('.swiper-container').get(0),{
			pagination: '.indicator',
			paginationElement : 'div'
		});
	}

	return {
		slideBox: slideBox
	}
});