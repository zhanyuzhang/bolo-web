/**
 * Created by Dillance on 16/7/25.
 */

var express = require('express'),
	routeHelper = require('../../../lib/routeHelper'),
	router = express.Router();

router.get('/login', function(req, res, next) {

	var task = [];

	Promise.all(task).then(function(){
		routeHelper.render(req, res, 'mobile/pages/user/1-1-x/login');
	},function(err){
		next(err);
	});

});

module.exports = router;