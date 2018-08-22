'use strict';

var express = require('express'),
	routeHelper = require('../../../lib/routeHelper'),
	actBll = require('../../../bll/pages/pc/act_cj'),
	userBll = require('../../../bll/common/user'),
	router = express.Router();

router.get('/cj',function(req,res){
	var from = req.query.sourceFrom;
	var task = [];
	/*var obj = {status:0}
	res.data.roomInfo = obj;
	var obj = {count:0}
	res.data.artInfo = obj;
	var obj = {'totalCommentCount':0};
	res.data.commentList = obj;*/
	task.push(actBll.getVideoInfo(req, res).then(function(result,response){
		var data = JSON.parse(result);
		res.data.roomInfo = data;
	},function(error){
		console.log('error in videoInfo');
		var obj = {status:0}
		res.data.roomInfo = obj;
	}));

	task.push(actBll.getArticleInfo(req,res).then(function(result,response){
		var data = JSON.parse(result);
		for(var i=0;i<data.data.length;i++){
            var imgStr = data.data[i]['images'];
            if(imgStr!=null){
                var imgStra = imgStr.split(',');
                imgStr = imgStra[0];
            }else{
                imgStr = 'http://img1.cache.netease.com/love/image/app/wb_share.png';
            }
            data.data[i]['image'] = imgStr;
        }
		res.data.artInfo = data;
	},function(error){
		var obj = {count:0}
		res.data.artInfo = obj;
	}));

	task.push(userBll.getInfo(req,res).then(function(result){
		res.data.userInfo = result;
		if(from==null){
			from = 0;
		}else if(from=='lofter'){
			from = 1;
		}else if(from=='gacha'){
			from = 2;
		}
		res.data.userInfo.sourceFrom = from;
	}));
	task.push(actBll.getVideoCmsInfo().then(function(data){
		var videoInfo = data;
		res.data.videoCmsInfo = videoInfo;
	},function(err){
		console.log(new Error('error on act/actBll'));
		console.log(err);
	}));
	//var COM_COUNT = #{commentList.totalCommentCount};
	/*task.push(actBll.getCommentList(req,res).then(function(result){
		var csfommentList = JSON.parse(result);
		res.data.commentList = commentList;
	},function(err){
		console.log(new Error('error on act/actBll---commentList'));
		var obj = {'totalCommentCount':0};
		res.data.commentList = obj;
	}));*/
	Promise.all(task).then(function(data){
		routeHelper.render(req, res, 'pc/pages/act/cj/1-0-x/index');
	},function(err){
		routeHelper.render(req, res, 'pc/pages/act/cj/1-0-x/index');
	});

});

router.get('/share', function(req, res, next) {

	var task = [];

	task.push(userBll.getBoloInfo(req,res).then(function(result){
		res.data.userInfo = result;
	}));

	Promise.all(task).then(function(){
		routeHelper.render(req, res, 'pc/pages/act/share/1-0-x/index');
	},function(err){
		next(err);
	});

});

router.get('/share', function(req, res, next) {

	var task = [];

	task.push(userBll.getBoloInfo(req,res).then(function(result){
		res.data.userInfo = result;
	}));

	Promise.all(task).then(function(){
		routeHelper.render(req, res, 'pc/pages/act/share/1-0-x/index');
	},function(err){
		next(err);
	});

});

router.get('/liaoba', function (req, res, next) {
	routeHelper.render(req, res, 'pc/pages/act/bobo/liaoba/index');
});

router.get('/u17', function (req, res, next) {
	routeHelper.render(req, res, 'pc/pages/act/u17/1-0-x/index');
});

router.get('/chicken-page', function (req, res, next) {
	routeHelper.render(req, res, 'pc/pages/act/hangzhou/1-0-x/index');
});

router.get('/lottery/yinyang', function (req, res, next) {
	routeHelper.render(req, res, 'pc/pages/act/lottery/1-1-x/index');
});

router.get('/bobonewyear', function (req, res, next) {
	routeHelper.render(req, res, 'pc/pages/act/bobo/newyear/1-0-x/index');
});

module.exports = router;