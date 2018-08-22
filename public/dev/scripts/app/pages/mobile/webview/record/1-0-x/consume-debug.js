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

	var $window = $(window),
		$wrapper = $('.wrapper'),
		currentPage = 1,
		pageSize = 15,
		isloading = false,
		isAllLoaded = false;

	function getList(page){
		return native.userPromise.then(function(userInfo){
			return new Promise(function(resolve,reject){
				isloading = true;
				$.getJSON(HttpHelper.getOrigin() + '/bolo/api/web/user/getBolobiTradeHistory.htm',{
					userId: userInfo.userId,
					type: 2,
					pageNo: page,
					pageSize: pageSize
				},function(result){
					isloading = false;
					if(result.data.length < pageSize) isAllLoaded = true;
					if(!result.data.length){
						reject();
						return;
					}
					var list = {};
					result.data.forEach(function(d,i){
						var date = new Date(d.create_time),
							month = date.getMonth() + 1,
							dateId = date.getFullYear() + '年' + (month < 10 ? '0' + month : month) + '月';
						d.create_time = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日' + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':' + (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
						if(!list[dateId]) list[dateId] = [];
						list[dateId].push(d);
					});
					resolve(list);
				});
			});
		});
	}

	function render(data){
		$wrapper.append(tmpl.render('consume-list',{
			data: data,
			lastDate: $wrapper.find('.date-title:eq(-1)').text()
		}));
	}

	getList(1).then(function(data){
		render(data);
		$wrapper.addClass('show');
	},function(){
		$wrapper.addClass('show');
	});

	$window.scroll(function(){
		if(!isloading && !isAllLoaded && $window.scrollTop() > $wrapper.height() - $window.height() - 20){
			getList(++currentPage).then(function(data){
				render(data)
			});
		}
	});

	$wrapper.on('tap','.item',function(){
		native.call('openVideo',{
			videoId: $(this).data('id').toString()
		});
	});



});