/**
 * Created by Dillance on 16/7/4.
 */

'use strict';

var express = require('express'),
	routeHelper = require('../../../lib/routeHelper'),
	liveBll = require('../../../bll/pages/mobile/live'),
	router = express.Router();

router.get('/', function(req, res, next) {

	var task = [];

	task.push(liveBll.getVideoInfo(req, res).then(function(result,response){
		var data = JSON.parse(result);
		res.data.roomInfo = data;
	}));

	Promise.all(task).then(function(){
		routeHelper.render(req, res, 'mobile/pages/live/1-0-x/index');
	},function(err){
		next(err);
	});

});

module.exports = router;