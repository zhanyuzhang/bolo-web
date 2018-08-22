/**
 * Created by Dillance on 16/4/25.
 */
'use strict';

var express = require('express'),
	routeHelper = require('../../../lib/routeHelper'),
	cms = require('../../../bll/cms'),
	router = express.Router(),
	userBll = require('../../../bll/common/user'),
	uaDetector = require('../../../lib/uadetector'),
	cjBll = require('../../../bll/pages/mobile/act_cj');

router.get('/cj', function(req, res, next) {

	var task = [];

	task.push(cjBll.getVideoInfo(req,res).then(function(result) {
		res.data.videoInfo = JSON.parse(result);
	}));

	task.push(userBll.getMinuteInfo(req,res).then(function(result){
		res.data.userInfo = result;
	}));

	task.push(cms.get('http://www.bobo.com/special/bolo/cjvideos.html').then(function(result){
		res.data.videoList = result;
	}));

	Promise.all(task).then(function(){
		routeHelper.render(req, res, 'mobile/pages/act/cj/1-0-x/index');
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
		routeHelper.render(req, res, 'mobile/pages/act/share/1-0-x/index');
	},function(err){
		next(err);
	});

});

router.get('/share/rules', function(req, res, next) {

	var task = [];

	Promise.all(task).then(function(){
		routeHelper.render(req, res, 'mobile/pages/act/share/1-0-x/detail-rules');
	},function(err){
		next(err);
	});

});

router.get('/share/join', function(req, res, next) {

	var task = [];

	task.push(userBll.getBoloInfo(req,res).then(function(result){
		if(!result.userId) res.redirect('/m/act/share');
		res.data.userInfo = result;
	}));

	Promise.all(task).then(function(){
		routeHelper.render(req, res, 'mobile/pages/act/share/1-0-x/join');
	},function(err){
		next(err);
	});

});

router.get('/share/flow', function(req, res, next) {

	var task = [];

	Promise.all(task).then(function(){
		routeHelper.render(req, res, 'mobile/pages/act/share/1-0-x/apply-flow');
	},function(err){
		next(err);
	});

});

router.get('/lottery', function(req, res, next) {

	var task = [];

	Promise.all(task).then(function(){
		routeHelper.render(req, res, 'mobile/pages/act/lottery/1-0-x/index');
	},function(err){
		next(err);
	});

});

router.get('/lottery/halloween', function(req, res, next) {

	var task = [];

	Promise.all(task).then(function(){
		routeHelper.render(req, res, 'mobile/pages/act/lottery/1-0-x/halloween');
	},function(err){
		next(err);
	});

});

router.get('/lottery/double-eleven', function(req, res, next) {

	var task = [];

	Promise.all(task).then(function(){
		routeHelper.render(req, res, 'mobile/pages/act/lottery/1-0-x/double-eleven');
	},function(err){
		next(err);
	});

});

router.get('/lottery/yinyang', function(req, res, next) {

	var task = [];

	res.data.figureMap = {
		left: [{
			link: 'http://bolo.163.com/m/channel?userId=-182841557846182616',
			img: '01.png'
		},{
			link: 'http://bolo.163.com/m/channel?userId=-3664622527285983253',
			img: '02.png'
		}],
		right: [{
			link: 'http://bolo.163.com/m/channel?userId=-4668098751522678063',
			img: '03.png'
		},{
			link: 'http://bolo.163.com/m/channel?userId=-182841557846182616',
			img: '04.png'
		}]
	};

	Promise.all(task).then(function(){
		routeHelper.render(req, res, 'mobile/pages/act/lottery/1-1-x/yinyang');
	},function(err){
		next(err);
	});

});

router.get('/lottery/newyear', function(req, res, next) {

	var task = [];

	Promise.all(task).then(function(){
		routeHelper.render(req, res, 'mobile/pages/act/lottery/1-2-x/newyear');
	},function(err){
		next(err);
	});

});

router.get('/double-eleven', function(req, res, next) {

	var task = [];

	Promise.all(task).then(function(){
		routeHelper.render(req, res, 'mobile/pages/act/double-eleven/1-0-x/index');
	},function(err){
		next(err);
	});

});

router.get('/puppet-judge', function(req, res, next) {
	var task = [];
	uaDetector.setUA(req.headers['user-agent'].toLowerCase());
	var view = uaDetector.isDevice('mobile') ? 'index' : 'pc' ;
	Promise.all(task).then(function() {
		routeHelper.render(req, res, 'mobile/pages/act/puppet-judge/1-0-x/' + view);
	},function(err){
		next(err);
	});
});

router.get('/u17', function(req, res, next) {

	var task = [];

	Promise.all(task).then(function(){
		routeHelper.render(req, res, 'mobile/pages/act/u17/1-0-x/index');
	},function(err){
		next(err);
	});

});

router.get('/chicken', function(req, res, next) {
	var task = [];
	uaDetector.setUA(req.headers['user-agent'].toLowerCase());
	var view = uaDetector.isDevice('mobile') ? 'index' : 'pc' ;
	Promise.all(task).then(function() {
		routeHelper.render(req, res, 'mobile/pages/act/poison-chicken/1-0-x/' + view);
	},function(err){
		next(err);
	});
});

router.get('/seckill', function(req, res, next) {
	var task = [];
	// uaDetector.setUA(req.headers['user-agent'].toLowerCase());
	// var view = uaDetector.isDevice('mobile') ? 'index' : 'pc' ;
	Promise.all(task).then(function() {
		routeHelper.render(req, res, 'mobile/pages/act/seckill/1-0-x/index');
	},function(err){
		next(err);
	});
});

module.exports = router;