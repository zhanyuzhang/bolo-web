'use strict';

var request = require('../../_request'),
        HttpHelper = require('../../common/HttpHelper'),
        util = require('../../../lib/util');

function getData(req, res, url, data) {
    var headers = JSON.parse(JSON.stringify(req.headers));
    headers.host = HttpHelper.getHost(req);
    var qs = util.extend({}, data);
    return request({
        method: 'GET',
        encoding: '',
        url: HttpHelper.getOrigin(req) + url,
        rejectUnauthorized: false,
        gzip: true,
        headers: headers,
        qs: qs
    });
}

function formatTime(timestamp) {
    var date = new Date(timestamp);
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}

function formatDanmaku(danmakuList) {
    var data = {};
    danmakuList.forEach(function(d) {
        var playTime = Math.floor(d.playTime / 1000);
        if(!data[playTime]) data[playTime] = [];
        data[playTime].push(d.content);
    });
    return data;
}

function formatDuration(duration) {
    var minute = parseInt(duration / 60),
        second = duration % 60;
    return  (minute >= 10 ? minute : '0' + minute) + ':' + (second >= 10 ? second : '0' + second);
}

// 获取视频信息和和弹幕
// @params videoId，可选。如果没有传入，则默认是获取banner视频的信息
// exports.getVideoInfo = function (req, res, params) {
//     var data = {},
//         params = params || {};
//     var videoPromise = typeof params.videoId === 'undefined' ?
//         getData(req, res, '/bolo/api/index/bannerVideoNew.htm').then(function(result) {
//             params.videoId = JSON.parse(result).filter(function (e) { return +e.videoId !== -1; })[2].videoId;
//             return getData(req, res, '/bolo/api/video/videoInfo.htm', params);
//         }) : getData(req, res, '/bolo/api/video/videoInfo.htm', params);
//     return videoPromise.then(function (result) {
//         data.videoInfo = JSON.parse(result).videoInfo;
//         data.channelInfo = JSON.parse(result).channelInfo;
//         data.videoInfo.formatUploadTime = formatTime(data.videoInfo.uploadTime);
//         data.videoInfo.formatDuration = formatDuration(data.videoInfo.duration);
//         data.videoInfo.videoId = params.videoId;
//         return getData(req, res, '/bolo/api/video/bulletBroadcastHistory.htm', params);
//     }).then(function(result) {
//         data.danmaku = formatDanmaku(JSON.parse(result));
//         return  data;
//     }).catch(function (err) {
//         console.log(err);
//     });
// };

// 获取头屏视频的id
exports.getBannerVideoId = function (req, res) {
    return  getData(req, res, '/bolo/api/index/bannerVideoNew.htm').then(function(result) {
        console.log('bannerVideoList: ', JSON.parse(result));
        return JSON.parse(result).filter(function (e) {
            return + e.videoId !== -1;
        })[0].videoId;
    });
};

exports.getZoneVideoId = function (req, res, params) {
    return  getData(req, res, '/bolo/api/zone/zoneHotVideoList.htm', params).then(function(result) {
        console.log('zoneVideoList: ', 'params: ', params, 'data: ',  JSON.parse(result));
        return JSON.parse(result).filter(function (e) {
            return + e.videoId !== -1;
        })[0].videoId;
    });
}

// 通过zoneName获取zoneId , {zoneName: req.query.zoneName}
exports.getZoneIdByZoneName = function (req, res, params) {
    return  getData(req, res, '/bolo/api/web/video/getZoneId.htm?', params).then(function(result) {
        return JSON.parse(result).zoneId;
    });
};

// 通过videoI获取视频信息
exports.getVideoInfo = function (req, res, params) {
    return getData(req, res, '/bolo/api/video/videoInfo.htm', params).then(function(result) {
        var data = {};
        data.videoInfo = JSON.parse(result).videoInfo;
        data.channelInfo = JSON.parse(result).channelInfo;
        data.videoInfo.formatUploadTime = util.formatChinaDate(data.videoInfo.uploadTime);
        data.videoInfo.formatDuration = formatDuration(data.videoInfo.duration);
        data.videoInfo.videoId = params.videoId;
        data.videoInfo.formatTags = data.videoInfo.tags.split(',');
        return data;
    });
};

// 获取弹幕信息
exports.getDanmaku = function (req, res, params) {
    return getData(req, res, '/bolo/api/video/bulletBroadcastHistory.htm', params).then(function (result) {
        return formatDanmaku(JSON.parse(result));
    });
};

exports.getUserInfo = function(req, res, data){
	var headers = JSON.parse(JSON.stringify(req.headers));

	headers.host = HttpHelper.getHost(req);

	return request({
		method: 'GET',
		encoding: '',
		url: HttpHelper.getOrigin(req) + '/bolo/api/public/userInfo.htm',
		rejectUnauthorized: false,
		gzip: true,
		headers: headers,
		qs: {
			userId: data.userId,
			targetUserId: data.targetUserId
		}
	});
};