/**
 * Created by Dillance on 16/5/25.
 */

var express = require('express'),
	routeHelper = require('../../../lib/routeHelper'),
	router = express.Router(),
	userBll = require('../../../bll/common/user'),
	videoBll = require('../../../bll/pages/pc/video');

router.get('/upload', function(req, res, next) {

	var task = [];

	var userInfo = userBll.getBoloInfo(req,res).then(function(result){
		res.data.userInfo = result;
		return result;
	});

	task.push(userInfo.then(function(result){
		if(result.userId){
			return videoBll.getEditorInfo(req,res,result.userIdStr);
		}
	}).then(function(result){
		if(result) res.data.editorInfo = result;
	}));

	task.push(userInfo.then(function(result){
		if(result.userId){
			return videoBll.getAgreementStatus(req,res,result.userIdStr);
		}
	}).then(function(result){
		if(result) res.data.hasAgreed = JSON.parse(result).hasAgree;
	}));

	task.push(userInfo.then(function(result){
		if(result.userId){
			return videoBll.getHistroyTags(req,res,result.userIdStr);
		}
	}).then(function(result){
		if(result) res.data.histroyTags = result;
	}));

	Promise.all(task).then(function(){
		routeHelper.render(req, res, 'pc/pages/video/1-0-x/upload');
	},function(err){
		next(err);
	});

});

router.get('/console', function(req, res, next) {

	var task = [];

	var boloUserInfoPromise = userBll.getBoloInfo(req,res).then(function(result){
		if(result.userId){
			res.data.userInfo = result;
			return result;
		}else{
			res.redirect('/video/upload');
		}
	});

	task.push(boloUserInfoPromise.then(function(result){
		return videoBll.getEditorInfo(req, res, result.userIdStr);
	}).then(function(result){
		if(result) res.data.editorInfo = result;
	}));

	//task.push(boloUserInfoPromise.then(function(result){
	//	return videoBll.getHistroyTags(req, res, result.userIdStr);
	//}).then(function(result){
	//	if(result) res.data.histroyTags = result;
	//}));

	task.push(boloUserInfoPromise.then(function(result){
		if(result.userId){
			return videoBll.getHistroyTags(req,res,result.userIdStr);
		}
	}).then(function(result){
		if(result) res.data.histroyTags = result;
	}));

	Promise.all(task).then(function(){
		routeHelper.render(req, res, 'pc/pages/video/1-0-x/console');
	},function(err){
		next(err);
	});

});

router.get('/shareinfo', function(req, res, next) {

	var task = [];

	task.push(userBll.getBoloInfo(req,res).then(function(result){
		if(result.userId) {
			if (result.shareUserStatus != 1) res.redirect('/video/console');
			res.data.userInfo = result;
		}else{
			res.redirect('/video/upload');
		}
	}));

	Promise.all(task).then(function(){
		routeHelper.render(req, res, 'pc/pages/video/1-0-x/share-info');
	},function(err){
		next(err);
	});

});

module.exports = router;