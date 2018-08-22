/**
 * Created by Dillance on 16/1/15.
 */

'use strict';

var jadeHelper = require('../lib/jadeHelper'),
	mobile = require('./mobile'),
	pc = require('./pc');

var cmsIncludeMobile = require('./pages/mobile/cmsInclude');

module.exports = function(express, app) {

	app.use(function(req, res, next){
		if(!res.data) res.data = {};
		res.data.host = req.headers.host;
		res.data.originalUrl = req.originalUrl;
		res.data.jadeHelper = jadeHelper;
		res.data.query = req.query;
		next();
	});

	app.use(function(req, res, next) {
		res.locals.ua = req.get('User-Agent');
		next();
	});

	app.use('/', pc);
	app.use('/m', mobile);

	app.use('/spe-data/bolo/m',cmsIncludeMobile);
	app.use('/spe-data/bolo',pc);


	//异常处理
	app.use(function(err, req, res, next) {
		if (typeof err === 'string') { err = new Error(err); }
		res.send(err.message);
	});

};