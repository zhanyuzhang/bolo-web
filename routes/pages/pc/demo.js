/**
 * Created by Dillance on 16/7/6.
 */

'use strict';

var express = require('express'),
	routeHelper = require('../../../lib/routeHelper'),
	router = express.Router();

router.get('/three', function(req, res, next) {

	var task = [];

	Promise.all(task).then(function(){
		routeHelper.render(req, res, 'pc/pages/demo/three/index');
	},function(err){
		next(err);
	});

});

router.get('/three/obj', function(req, res, next) {

	var task = [];

	Promise.all(task).then(function(){
		routeHelper.render(req, res, 'pc/pages/demo/three/obj');
	},function(err){
		next(err);
	});

});

router.get('/three/vr', function(req, res, next) {

	var task = [];

	Promise.all(task).then(function(){
		routeHelper.render(req, res, 'pc/pages/demo/three/vr');
	},function(err){
		next(err);
	});

});

router.get('/three/vrdemo', function(req, res, next) {

	var task = [];

	Promise.all(task).then(function(){
		routeHelper.render(req, res, 'pc/pages/demo/three/vrdemo');
	},function(err){
		next(err);
	});

});

router.get('/nativeConnection/pull', function(req, res, next) {

	var task = [];

	Promise.all(task).then(function(){
		routeHelper.render(req, res, 'pc/pages/demo/nativeConnection/pull');
	},function(err){
		next(err);
	});

});

router.get('/imgcut', function(req, res, next) {

	var task = [];

	Promise.all(task).then(function(){
		routeHelper.render(req, res, 'pc/pages/demo/imgcut/index');
	},function(err){
		next(err);
	});

});

module.exports = router;