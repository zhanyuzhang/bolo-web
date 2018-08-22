/**
 * Created by Dillance on 16/9/26.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		Stat = require('/common/Stat@1-0-x'),
		native = require('/common/native@1-1-x');

	$('.suc_btn').tap(function(){
		Stat.send('chargesuccess_confim');
		native.call('closeMe');
	});

	setTimeout(function(){
		native.call('closeMe');
	},4000);
});