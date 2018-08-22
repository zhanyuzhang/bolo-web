/**
 * Created by gztimboy on 2016/4/12 0012.
 */

'use strict';

var express = require('express'),
    routeHelper = require('../../../lib/routeHelper'),
    router = express.Router();

router.get('/', function(req, res, next) {
    routeHelper.render(req, res, 'mobile/pages/xz/1-0-x/xzios');
});

module.exports = router;