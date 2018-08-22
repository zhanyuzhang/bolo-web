/**
 * Created by Dillance on 16/7/25.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		stat = require('/common/Stat@1-0-x');

	return {
		init: function(){
			$('.fun-page').on('tap','.item',function(){
				if($(this).data('stat-key')) stat.send($(this).data('stat-key'));
			});
		}
	}

});