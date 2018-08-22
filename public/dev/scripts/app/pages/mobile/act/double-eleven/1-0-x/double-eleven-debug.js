/**
 * Created by Dillance on 16/11/2.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		native = require('/common/native@1-1-x'),
		Promise = require('promise@1-0-x'),
		Stat = require('/common/Stat@1-0-x');

	native.call('showShareMenu',{
		flag: false
	});

	var $statementBtn = $('.statement-btn'),
		$input = $('input'),
		$confirmBtn = $('.confirm-btn'),
		$codeDialog = $('.code-dialog'),
		$statementDialog = $('.statement-dialog');

	function getCode(){
		return new Promise(function(resolve){
			$.get(HttpHelper.getOrigin() + '/bolo/api/public/randomCode.htm',function(result){
					resolve(result);
				}
			);
		});
	}

	$confirmBtn.tap(function(){
		var value = $input.val();
		if(value && ['pp助手','PP助手'].indexOf(value) > -1){
			getCode().then(function(data){
				$codeDialog.removeClass('hide').find('.code').text(data);
			});
		}else{
			$input.blur();
			native.call('showToast',{
				message: '请输入正确口令'
			});
		}
	});

	$codeDialog.find('.go-exchange-btn').tap(function(){
		location.href = '/m/hybrid/cdkey?code=' + $codeDialog.find('.code').text();
	});
	$codeDialog.find('.remove-btn').tap(function(){
		$codeDialog.addClass('hide');
	});

	$statementDialog.find('.remove-btn,.fuck-off-btn').tap(function(){
		$statementDialog.addClass('hide');
	});

	$statementBtn.tap(function(){
		$statementDialog.removeClass('hide');
	});

	$('.to-play-page').tap(function(){
		//location.href = 'http://bolo.163.com/m/play?videoId=' + 14734218219671;
		Stat.send('play_double11');
		native.call('openVideo',{
			videoId: 14734218219671
		});
	});

});