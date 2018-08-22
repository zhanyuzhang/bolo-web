/**
 * Created by Dillance on 16/9/22.
 */
'use strict';

var express = require('express'),
	routeHelper = require('../../../lib/routeHelper'),
	setsInfoBll = require('../../../bll/pages/mobile/setsInfo'),
	// actBll = require('../../../bll/pages/pc/act_cj'),
	router = express.Router();

router.get('/video',function(req,res,next) {
	var task = [];
	task.push(setsInfoBll.getsetsInfo().then(function(data){
		var setsInfo = data;
		res.data.setsInfo = setsInfo || [];
	},function(err){
    res.data.setsInfo = [];
		console.log(new Error('error on act/actBll'));
		console.log(err);
	}));

	Promise.all(task).then(function() {
		routeHelper.render(req, res, 'mobile/pages/invitation/1-0-x/video');
	},function(err){
		next(err);
	});
});

router.get('/code',function(req,res,next){
  var task = [];
  task.push(setsInfoBll.getsetsInfo().then(function(data){
    var setsInfo = data;
    res.data.setsInfo = setsInfo || [];
  },function(err){
    res.data.setsInfo = [];
    console.log(new Error('error on act/actBll'));
    console.log(err);
  }));

  Promise.all(task).then(function() {
    routeHelper.render(req, res, 'mobile/pages/invitation/1-0-x/code');
  },function(err){
    next(err);
  });
});

var a = [{ "length":1, "index":1, "title":"test", "alt":"test", "subTitle":"", "summary":"13421 23234 4234 555 543 34324 2342 324332 432432 43242 432342 424 225245 244342 23424 422432 4324324", "pic":"http://img4.cache.netease.com/news/2016/12/1/2016120120273452f5e.png", "url":"https://cms.ws.163.com/index.jsp" }]
module.exports = router;