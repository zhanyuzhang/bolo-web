/**
 * Created by Dillance on 16/5/6.
 */
'use strict';

var express = require('express'),
	HttpHelper = require('../../../bll/common/HttpHelper'),
	cms = require('../../../bll/cms'),
	routeHelper = require('../../../lib/routeHelper'),
	userBll = require('../../../bll/common/user'),
	router = express.Router();

router.get('/', function(req, res, next) {

	var task = [];

	task.push(HttpHelper.getAndroidUrls().then(function(data){
		res.data.androidUrls = data;
	}));
	task.push(userBll.getBoloInfo(req,res).then(function(result){
		res.data.userInfo = result;
	}));

	task.push(cms.get('http://www.bobo.com/special/003500OQ/bolodl_bdfm.htm').then(function(result){
		res.data.bdList = result;
	}));
	task.push(cms.get('http://www.bobo.com/special/003500OQ/bolodl_video.htm').then(function(result){
		res.data.videoList = result;
	}));

	Promise.all(task).then(function(){
		routeHelper.render(req, res, 'pc/pages/download/1-1-x/index');
	},function(err){
		next(err);
	});
});

module.exports = router;