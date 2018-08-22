/**
 * Created by chesszhang on 17/01/03.
 */
'use strict';

var express = require('express'),
        routeHelper = require('../../../lib/routeHelper'),
        router = express.Router();

router.get('/link-game', function(req, res, next) {
    routeHelper.render(req, res, 'pc/pages/game/link-game/index');
});

module.exports = router;