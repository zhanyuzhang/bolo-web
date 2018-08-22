/**
 * Created by Dillance on 16/6/14.
 */
'use strict';

var express = require('express'),
	routeHelper = require('../../../lib/routeHelper'),
	router = express.Router();

router.get('/operation', function(req, res, next) {
	routeHelper.render(req, res, 'mobile/pages/cms-include/bolo-operation/1-0-x/index');
});

module.exports = router;