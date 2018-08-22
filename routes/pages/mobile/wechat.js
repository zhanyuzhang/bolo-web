/**
 * Created by chesszhang on 16/10/10.
 */
'use strict';

var express = require('express'),
    routeHelper = require('../../../lib/routeHelper'),
    router = express.Router();

router.get('/', function(req, res, next) {
    // routeHelper.render(req, res, 'mobile/pages/notfound/1-1-x/index');
    routeHelper.render(req, res, 'mobile/pages/wechat/1-0-x/index');
});

module.exports = router;