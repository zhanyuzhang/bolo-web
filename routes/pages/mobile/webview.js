/**
 * Created by Dillance on 16/4/25.
 */
'use strict';

var express = require('express'),
	routeHelper = require('../../../lib/routeHelper'),
	router = express.Router();

router.get('/popular', function(req, res, next) {

	routeHelper.render(req, res, 'mobile/pages/webview/1-0-x/popular/index');

});

router.get('/collection', function(req, res, next) {

	routeHelper.render(req, res, 'mobile/pages/webview/1-0-x/collection/index');

});

router.get('/collection/details', function(req, res, next) {

	routeHelper.render(req, res, 'mobile/pages/webview/1-0-x/collection/details');

});

router.get('/collection/week-rank', function(req, res, next) {

	routeHelper.render(req, res, 'mobile/pages/webview/1-0-x/collection/week-rank');

});


router.get('/recommend', function(req, res, next) {

	routeHelper.render(req, res, 'mobile/pages/webview/1-0-x/recommend/index');

});

router.get('/category', function(req, res, next) {

	routeHelper.render(req, res, 'mobile/pages/webview/1-1-x/recommend/index');

});

router.get('/join', function(req, res, next) {

	routeHelper.render(req, res, 'mobile/pages/webview/1-0-x/join/index');

});

router.get('/access', function(req, res, next) {

	routeHelper.render(req, res, 'mobile/pages/webview/1-0-x/access/index');

});

router.get('/partner', function(req, res, next) {

	routeHelper.render(req, res, 'mobile/pages/webview/1-0-x/partner/index');

});

router.get('/sysinfo',function(req,res,next){
	routeHelper.render(req, res, 'mobile/pages/webview/1-0-x/sysinfo/index');
});

router.get('/mission/list',function(req,res,next){
	routeHelper.render(req, res, 'mobile/pages/webview/1-0-x/mission/index');
});

router.get('/mission/intro',function(req,res,next){
	routeHelper.render(req, res, 'mobile/pages/webview/1-0-x/mission/intro');
});

router.get('/record/consume',function(req,res,next){
	routeHelper.render(req, res, 'mobile/pages/webview/1-0-x/record/consume');
});

router.get('/record/recharge',function(req,res,next){
	routeHelper.render(req, res, 'mobile/pages/webview/1-0-x/record/recharge');
});

router.get('/cdkey',function(req,res,next){
	routeHelper.render(req, res, 'mobile/pages/webview/1-0-x/cdkey/index');
});

router.get('/initial',function(req,res,next){
	routeHelper.render(req, res, 'mobile/pages/webview/1-0-x/initial/index');
});

module.exports = router;