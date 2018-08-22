/**
 * Created by Dillance on 16/9/19.
 */
'use strict';

var express = require('express'),
	routeHelper = require('../../../lib/routeHelper'),
	router = express.Router();

var collectionBll = require('../../../bll/pages/mobile/collection');

router.get('/details',function(req,res,next){

	var task = [];

	task.push(collectionBll.getCollectionInfo(req, res).then(function(result){
		res.data.collectionInfo = JSON.parse(result);
	}));

	Promise.all(task).then(function() {
		routeHelper.render(req, res, 'mobile/pages/collection/1-0-x/details');
	}).catch(function(err){
		next(err);
	});

});


module.exports = router;