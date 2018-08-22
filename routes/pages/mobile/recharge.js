/**
 * Created by Dillance on 16/9/19.
 */
'use strict';

var express = require('express'),
	routeHelper = require('../../../lib/routeHelper'),
	router = express.Router();

router.get('/',function(req,res,next){
	routeHelper.render(req, res, 'mobile/pages/recharge/1-0-x/index');
});

router.get('/specify',function(req,res,next){
	routeHelper.render(req, res, 'mobile/pages/recharge/1-0-x/specify');
});

router.get('/success',function(req,res,next){
	routeHelper.render(req, res, 'mobile/pages/recharge/1-0-x/success');
});

module.exports = router;