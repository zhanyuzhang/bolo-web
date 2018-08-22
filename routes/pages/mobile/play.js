/**
 * Created by Dillance on 16/3/21.
 */

'use strict';

var express = require('express'),
	routeHelper = require('../../../lib/routeHelper'),
	playBll = require('../../../bll/pages/mobile/play'),
	router = express.Router();

/* GET play page. */
//router.get('/', function(req, res, next) {
//	var task = [];
//
//	task.push(playBll.getVideoInfo(req, res).then(function(result,response){
//		var userId = result.match(/userId\"\:(\-?\d{0,})/)[1];
//		var data = JSON.parse(result);
//		data.videoInfo.userId = userId;
//		res.data.videoInfo = data.videoInfo;
//		res.data.channelInfo = data.channelInfo;
//	}));
//
//	task.push(playBll.getRelatedVideos(req, res).then(function(result){
//		res.data.relatedVideos = JSON.parse(result);
//	}));
//
//	task.push(playBll.getDanmaku(req, res).then(function(result){
//		res.data.danmaku = result;
//	}));
//	Promise.all(task).then(function(){
//		routeHelper.render(req, res, 'mobile/pages/play/index');
//	},function(err){
//		next(err);
//	});
//
//});

function formatHits(hits) {
	return (+hits > 10000) ? (hits / 10000).toFixed(1) + '万' : hits;
}

router.get('/', function(req, res, next) {
	var task = [];
	task.push(playBll.getVideoInfo(req, res).then(function(result,response){
		var userId = result.match(/userId\"\:(\-?\d{0,})/)[1];
		var data = JSON.parse(result);
		data.videoInfo.userId = userId;
		data.videoInfo.playCount = formatHits(data.videoInfo.playCount);
		res.data.videoInfo = data.videoInfo;
		res.data.channelInfo = data.channelInfo;
	}));

	task.push(playBll.getRelatedVideos(req, res).then(function(result){
		res.data.relatedVideos = JSON.parse(result);
	}));

	task.push(playBll.getDanmaku(req, res).then(function(result){
		res.data.danmaku = result;
	}));

	task.push(playBll.getBanner(req,res).then(function(result){
		var banners = JSON.parse(result);
		var banner = {};
		for(var i=0;i<banners.length;i++){
			if(banners[i].status==1){
				banner = banners[i];
				break;
			}
		}
		res.data.banner = banner;
	}));
	Promise.all(task).then(function(){
		routeHelper.render(req, res, 'mobile/pages/play/indexNew');
	},function(err){
		next(err);
	});

});

module.exports = router;