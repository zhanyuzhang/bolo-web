/**
 * Created by Dillance on 16/8/19.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('jquery@1-11-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		Promise = require('promise@1-0-x'),
		dialog = require('/common/uiComponent/pc/dialog@1-0-x'),
		tmpl = require('/common/tmpl@1-0-x');

	var $briefing = $('.briefing'),
		$detailsList = $('.details-list'),
		currentPage = 1,
		gettingData = false;

	var dateParser = function(time){
		var date = new Date(time);
		return date.getFullYear() + '-' + (date.getMonth() > 8 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) + '-' + (date.getDate() > 9 ? date.getDate() : '0' + date.getDate());
	};

	var getData = function(page){
		return new Promise(function(resolve,reject){
			gettingData = true;
			$.ajax({
				url: HttpHelper.getOrigin() + '/bolo/api/web/user/getShareData.htm',
				dataType: 'jsonp',
				data: {
					pageNo: page,
					pageSize: 10
				},
				success: function(result){
					gettingData = false;
					if(result.data.length < 10) $detailsList.addClass('all-loaded');
					resolve(result);
				}
			});
		});
	};

	var firstRender = getData(currentPage);
	firstRender.then(function(data){
		$briefing.html(tmpl.render('briefing',{
			data: data
		}));
		$detailsList.html(tmpl.render('details-list',{
			data: data.data,
			dateParser: dateParser
		}));
	});

	$detailsList.scroll(function(){
		if(!$detailsList.hasClass('all-loaded') && !gettingData && $detailsList.scrollTop > $detailsList.get(0).scrollHeight - $detailsList.height() - 50){
			getData(++currentPage).then(function(data){
				if(data.data.length){
					$detailsList.append(tmpl.render('details-list',{
						data: data.data,
						dateParser: dateParser
					}));
				}
			});
		}
	});

	$('.rules-btn').click(function(){
		dialog.intro.setSize(400);
		dialog.intro.show('规则说明','rules');
	});

});