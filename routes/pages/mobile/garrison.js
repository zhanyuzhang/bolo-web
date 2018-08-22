/**
 * Created by gztimboy on 2016/4/12 0012.
 */

'use strict';

var express = require('express'),
    router = express.Router();

router.get('/', function(req, res, next) {
	res.redirect('/m/hybrid/join');
});

module.exports = router;