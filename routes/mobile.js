/**
 * Created by Dillance on 16/4/8.
 */

'use strict';

var express = require('express'),
    router = express.Router();

var user = require('./pages/mobile/user'),
    play = require('./pages/mobile/play'),
    channel = require('./pages/mobile/channel'),
    xz = require('./pages/mobile/xz'),
    xzios = require('./pages/mobile/xzios'),
    garrison = require('./pages/mobile/garrison'),
    webview = require('./pages/mobile/webview'),
    download = require('./pages/mobile/download'),
    live = require('./pages/mobile/live'),
    act = require('./pages/mobile/act'),
    demo = require('./pages/mobile/demo'),
	recharge = require('./pages/mobile/recharge'),
	collection = require('./pages/mobile/collection'),
	invitation = require('./pages/mobile/invitation'),
    notfound = require('./pages/mobile/notfound');


router.use('/user',user);
router.use('/play',play);
router.use('/channel',channel);
router.use('/xz',xz);
router.use('/xzios',xzios);
router.use('/join',garrison);
router.use('/hybrid',webview);
router.use('/download',download);
router.use('/live',live);
router.use('/act',act);
router.use('/recharge',recharge);
router.use('/collection',collection);
router.use('/invitation',invitation);
router.use('/demo',demo);
router.use('/notfound', notfound);


module.exports = router;