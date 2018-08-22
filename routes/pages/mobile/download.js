/**
 * Created by Dillance on 16/5/6.
 */
'use strict';

var express = require('express'),
	routeHelper = require('../../../lib/routeHelper'),
	router = express.Router(),
	downloadBll = require('../../../bll/pages/mobile/download');

router.get('/', function(req, res, next) {
	var task = [];
	task.push(downloadBll.getBackgoundCmsInfo().then(function(data) {
		res.data.backgroundInfo = data;
	},function(err){
		res.data.backgroundInfo = {status: 0};
	}));
	Promise.all(task).then(function(data){
		routeHelper.render(req, res, 'mobile/pages/download/1-1-x/index');
	},function(err){
		routeHelper.render(req, res, 'mobile/pages/download/1-1-x/index');
	});
});

router.get('/jumping', function(req, res, next) {
	routeHelper.render(req, res, 'mobile/pages/download/1-1-x/jumping');
})

module.exports = router;