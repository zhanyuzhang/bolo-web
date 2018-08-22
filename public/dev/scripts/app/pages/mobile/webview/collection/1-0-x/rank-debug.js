/**
 * Created by Dillance on 16/7/1.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		tmpl = require('/common/tmpl@1-0-x'),
		native = require('/common/native@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		Stat = require('/common/Stat@1-0-x');

	var $wrapper = $('.wrapper');

	$.ajax({
		url: HttpHelper.getOrigin() + '/bolo/api/index/dailyPopList.htm',
		dataType: 'jsonp',
		data: {
			pageSize: 10
		},
		success: function(result){
			if(result && result.length){
				$('.rank-list').html(tmpl.render('rank-list',{
					data: result,
					getImage: HttpHelper.getImage
				})).on('tap','.item',function(){
					Stat.send('mainRecommend_RankWeek',{
						label: 'position:' + $(this).index()
					});
					native.call('openChannel',{
						channelId: $(this).attr('data-id'),
						sid: $(this).attr('data-sid')
					});
				});
				if(result.length >= 7) $wrapper.scrollTop($wrapper.find('.item').eq(6).offset().top);
			}
		}
	});


});