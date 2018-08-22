/**
 * Created by Dillance on 16/5/18.
 */

'use strict';

var express = require('express'),
	routeHelper = require('../../../lib/routeHelper'),
	playBll = require('../../../bll/pages/pc/play'),
	userBll = require('../../../bll/common/user'),
	router = express.Router();

/* GET play page. */
router.get('/', function(req, res, next) {
	var task = [];

	task.push(userBll.getBoloInfo(req,res).then(function(result){
		res.data.userInfo = result;
	}));

	task.push(playBll.getVideoInfo(req, res).then(function(result,response){
		var userId = result.match(/userId\"\:(\-?\d{0,})/)[1];
		var data = JSON.parse(result);
		data.videoInfo.userId = userId;
		res.data.videoInfo = data.videoInfo;
		res.data.channelInfo = data.channelInfo;
	}));

	task.push(playBll.getRelatedVideos(req, res).then(function(result){
		res.data.relatedVideos = JSON.parse(result);
	}));

	task.push(playBll.getDanmaku(req, res).then(function(result){
		res.data.danmaku = result;
	}));

	task.push(playBll.getComment(req, res).then(function(result){
		res.data.commentList = JSON.parse(result).data;
	}));

	Promise.all(task).then(function(){
		routeHelper.render(req, res, 'pc/pages/play/1-0-x/index');
	},function(err){
		next(err);
	});

});

router.get(/\/\d+$/, function(req, res, next) {
	var task = [],
		videoId = req.originalUrl.match(/\d+/);

	if(!videoId.length) next('缺少videoId');
	else videoId = videoId[0];
	req.query.videoId = videoId;

	task.push(userBll.getBoloInfo(req,res).then(function(result){
		res.data.userInfo = result;
	}));

	task.push(playBll.getVideoInfo(req, res).then(function(result,response){
		var userId = result.match(/userId\"\:(\-?\d{0,})/)[1];
		var data = JSON.parse(result);
		data.videoInfo.userId = userId;
		res.data.videoInfo = data.videoInfo;
		res.data.channelInfo = data.channelInfo;
	}));

	task.push(playBll.getRelatedVideos(req, res).then(function(result){
		res.data.relatedVideos = JSON.parse(result);
	}));

	task.push(playBll.getDanmaku(req, res).then(function(result){
		res.data.danmaku = result;
	}));

	task.push(playBll.getComment(req, res).then(function(result){
		res.data.commentList = JSON.parse(result).data;
	}));

	Promise.all(task).then(function(){
		routeHelper.render(req, res, 'pc/pages/play/1-0-x/index');
	},function(err){
		next(err);
	});

});

module.exports = router;