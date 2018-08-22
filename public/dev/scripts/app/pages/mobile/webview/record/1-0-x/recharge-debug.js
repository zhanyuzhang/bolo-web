/**
 * Created by Dillance on 16/9/21.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		tmpl = require('/common/tmpl@1-0-x'),
		Promise = require('promise@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		native = require('/common/native@1-1-x');

	var $wrapper = $('.wrapper');

	function getList(){
		return native.userPromise.then(function(userInfo){
			return new Promise(function(resolve,reject){
				$.getJSON(HttpHelper.getOrigin() + '/bolo/api/recharge/rechargeRecord.htm',{
					userId: userInfo.userId,
					encryptToken: userInfo.encryptToken,
					timeStamp: userInfo.timeStamp,
					random: userInfo.random
				},function(result){
					if(!result.rechargeList.length){
						reject();
						return;
					}
					resolve(result.rechargeList);
				});
			});
		});
	}

	function render(data){
		$wrapper.append(tmpl.render('consume-list',{
			data: data,
			dateParser: function(date){
				var d = new Date(date);
				return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日' + ' ' + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) + ':' + (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds());
			}
		}));
	}

	getList().then(function(data){
		render(data);
		$wrapper.addClass('show');
	},function(){
		$wrapper.addClass('show');
	});

	native.on('refresh',function(){
		location.href = location.href;
	})


});