/**
 * Created by gztimboy on 2016/4/12 0012.
 */


'use strict';

var express = require('express'),
    routeHelper = require('../../../lib/routeHelper'),
    router = express.Router();

router.get('/', function(req, res, next) {
    var task = [];
    Promise.all(task).then(function(){
        //res.send(JSON.stringify(req));
        routeHelper.render(req, res, 'mobile/pages/channel/1-0-x/channel');
    });
});

module.exports = router;