/**
 * Created by Dillance on 16/9/8.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		native = require('/common/native@1-1-x'),
		qs = require('querystring@1-0-x'),
		Promise = require('promise@1-0-x'),
		tip = require('/common/uiComponent/mobile/tip@1-0-x');

	var $wrapper = $('.wrapper');

	var wait = function(delay){
		return new Promise(function(resolve,reject){
			var timer = setTimeout(function(){
				resolve();
			},delay);
			if(delay > 1000){
				$wrapper.on('tap',function(){
					clearTimeout(timer);
					$wrapper.off('tap');
					setTimeout(function(){
						resolve();
					},300);
				});
			}
		});
	};

	var $bolo = $('.bolokun'),
		$boloDialog = $('.bolo-dialog'),
		$haofang = $('.haofang'),
		$haofangDialog = $('.haofang-dialog'),
		$startBtn = $('.start-btn');

	wait(1000).then(function(){
		$bolo.addClass('show');
		return wait(800);
	}).then(function(){
		$boloDialog.addClass('show');
		return wait(3000);
	}).then(function(){
		$boloDialog.removeClass('show');
		return wait(500);
	}).then(function(){
		$bolo.addClass('e02');
		$boloDialog.find('.content').addClass('col-02');
		$boloDialog.addClass('show');
		return wait(2000);
	}).then(function(){
		$boloDialog.removeClass('show');
		return wait(500);
	}).then(function(){
		$bolo.addClass('e03');
		$boloDialog.find('.content').addClass('col-03');
		$boloDialog.addClass('show');
		return wait(5000);
	}).then(function(){
		$boloDialog.removeClass('show');
		return wait(500);
	}).then(function(){
		//郝方出现
		$haofang.addClass('show');
		return wait(800);
	}).then(function(){
		$haofangDialog.addClass('show');
		return wait(2000);
	}).then(function(){
		$haofangDialog.removeClass('show');
		return wait(500);
	}).then(function(){
		$bolo.addClass('e04');
		$boloDialog.find('.content').addClass('col-04');
		$boloDialog.addClass('show');
		return wait(2000);
	}).then(function(){
		$boloDialog.removeClass('show');
		return wait(500);
	}).then(function(){
		$bolo.addClass('e05');
		$boloDialog.find('.content').addClass('col-05');
		$boloDialog.addClass('show');
		return wait(3000);
	}).then(function(){
		$boloDialog.removeClass('show');
		return wait(500);
	}).then(function(){
		$haofang.addClass('e02');
		$haofangDialog.find('.content').addClass('col-02');
		$haofangDialog.addClass('show');
		return wait(2000);
	}).then(function(){
		$haofangDialog.removeClass('show');
		return wait(500);
	}).then(function(){
		$boloDialog.find('.content').addClass('col-06');
		$boloDialog.addClass('show');
		return wait(3000);
	}).then(function(){
		$boloDialog.removeClass('show');
		return wait(500);
	}).then(function(){
		$haofang.addClass('e03');
		$haofangDialog.find('.content').addClass('col-03');
		$haofangDialog.addClass('show');
		return wait(2000);
	}).then(function(){
		$haofangDialog.removeClass('show');
		return wait(500);
	}).then(function(){
		$bolo.addClass('e06');
		$boloDialog.find('.content').addClass('col-07');
		$boloDialog.addClass('show');
		$startBtn.addClass('show');
	});

	var getRecommendVideo =  native.user.then(function(userInfo){
		return new Promise(function(resolve,reject){
			$.getJSON(HttpHelper.getOrigin() + '/bolo/api/task/videoRecommend.htm',{
				userId: userInfo.userId || -1
			},function(result){
				resolve(result);
			});
		});
	},function(){
		return new Promise(function(resolve,reject){
			$.getJSON(HttpHelper.getOrigin() + '/bolo/api/task/videoRecommend.htm',{
				userId: -1
			},function(result){
				resolve(result);
			});
		});
	});
	$startBtn.tap(function(){
		if(native.hello() && native.version < 10406){
			tip.show('需要更新到最新版才能开启菠萝任务哦！请移步应用商店下载最新版。');
			return false;
		}
		if(qs.parse().isfromlist){
			history.go(-1);
		}else if(qs.parse().gotolist){
			location.href = '/m/hybrid/mission/list';
		}else{
			getRecommendVideo.then(function(data){
				native.call('openTaskGuide',{
					videoId: data[0].videoId,
					closeH5: true
				});
			});
		}
	});
});