/**
 * Created by Dillance on 16/5/25.
 */

var express = require('express'),
	routeHelper = require('../../../lib/routeHelper'),
	router = express.Router(),
	userBll = require('../../../bll/common/user'),
	videoBll = require('../../../bll/pages/pc/video'),
	newboloBll = require('../../../bll/pages/pc/newbolo');

router.get('/home', function(req, res, next) {
	var task = [];
	task.push(userBll.getBoloInfo(req,res).then(function(result){
		res.data.userInfo = result;
		return result;
	}));
	task.push(newboloBll.getBannerVideoId(req, res).then(function(videoId) {
		return newboloBll.getVideoInfo(req, res, {videoId: videoId});
	}).then(function (result) {
		res.data.videoInfo = result.videoInfo;
		res.data.channelInfo = result.channelInfo;
		return newboloBll.getDanmaku(req, res, {videoId: result.videoInfo.videoId});
	}).then(function (danmaku) {
		res.data.danmaku = danmaku;
	}));

	Promise.all(task).then(function() {
		routeHelper.render(req, res, 'pc/pages/newbolo/home/1-0-x/index');
	},function(err) {
		next(err);
	});
});

router.get('/play', function (req, res, next) {
    var task = [];
    task.push(userBll.getBoloInfo(req,res).then(function(result){
        res.data.userInfo = result;
        return newboloBll.getVideoInfo(req, res, {
            videoId: req.query.videoId,
            userId: result.userIdStr
        });
    }).then(function (result) {
        res.data.videoInfo = result.videoInfo;
        res.data.channelInfo = result.channelInfo;
        return newboloBll.getDanmaku(req, res, {videoId: result.videoInfo.videoId});
    }).then(function (danmaku) {
        res.data.danmaku = danmaku;
    }));

	Promise.all(task).then(function() {
		routeHelper.render(req, res, 'pc/pages/newbolo/play/1-0-x/index');
	},function(err) {
		next(err);
	});
});

router.get('/game', function (req, res, next) {
    var zoneHash = {
        swxf: '守望先锋',
        lscs: '炉石传说',
        lol: '英雄联盟',
        gx: '搞笑',
        dh: '动画'
    };
	var task = [];
    task.push(userBll.getBoloInfo(req,res).then(function(result){
        res.data.userInfo = result;
        return result;
    }));
    task.push(newboloBll.getZoneIdByZoneName(req, res, {zoneName: zoneHash[req.query.zoneName]}).then(function (zoneId) {
        res.data.zoneId = zoneId;
        res.data.name = zoneHash[req.query.zoneName];
    	return newboloBll.getZoneVideoId(req,res, {zoneId: zoneId});
    }).then(function (videoId) {
        return newboloBll.getVideoInfo(req, res, {videoId: videoId});
    }).then(function (result) {
        console.log('fuck1',result.videoInfo);
        res.data.videoInfo = result.videoInfo;
        res.data.channelInfo = result.channelInfo;
        return newboloBll.getDanmaku(req, res, {videoId: result.videoInfo.videoId});
    }).then(function (danmaku) {
        res.data.danmaku = danmaku;
    }));


	Promise.all(task).then(function() {
		routeHelper.render(req, res, 'pc/pages/newbolo/game/1-0-x/index');
	},function(err) {
		next(err);
	});
});

router.get('/person', function (req, res, next) {
	var task = [];

	task.push(userBll.getBoloInfo(req,res).then(function(result){
		res.data.userInfo = result;
		return result;
	}).then(function(userInfo){
		return newboloBll.getUserInfo(req,res,{
			userId: userInfo.userIdStr || '',
			targetUserId: req.query.id || userInfo.userIdStr
		});
	}).then(function(targetUserInfo){
		res.data.targetUserInfo = JSON.parse(targetUserInfo);
		return targetUserInfo;
	}));

	Promise.all(task).then(function() {
		routeHelper.render(req, res, 'pc/pages/newbolo/person/1-0-x/index');
	},function(err) {
		next(err);
	});
});


module.exports = router;