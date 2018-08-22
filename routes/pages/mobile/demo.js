/**
 * Created by Dillance on 16/7/6.
 */

'use strict';

var express = require('express'),
	routeHelper = require('../../../lib/routeHelper'),
	router = express.Router();

router.get('/iscroll', function(req, res, next) {

	var task = [];

	Promise.all(task).then(function(){
		routeHelper.render(req, res, 'mobile/pages/demo/iscroll');
	},function(err){
		next(err);
	});

});

router.get('/wechat-share', function(req, res, next) {

	var task = [];

	Promise.all(task).then(function(){
		routeHelper.render(req, res, 'mobile/pages/demo/wechat-share');
	},function(err){
		next(err);
	});

});

module.exports = router;