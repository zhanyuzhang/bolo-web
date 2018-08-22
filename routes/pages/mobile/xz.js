/**
 * Created by gztimboy on 2016/4/12 0012.
 */

'use strict';

var express = require('express'),
    routeHelper = require('../../../lib/routeHelper'),
    router = express.Router();

router.get('/', function(req, res, next) {
	res.redirect('/m/download');
    //var task = [];
    //Promise.all(task).then(function(){
    //    //res.send(JSON.stringify(req));
    //    routeHelper.render(req, res, 'mobile/pages/xz/1-0-x/xz');
    //});
});

module.exports = router;