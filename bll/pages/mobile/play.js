/**
 * Created by Dillance on 16/4/10.
 */
'use strict';

var request = require('../../_request'),
	HttpHelper = require('../../common/HttpHelper');

function getPageData(req, res, url){

	var videoId = req.query.videoId;

	var headers = JSON.parse(JSON.stringify(req.headers));

	headers.host = HttpHelper.getHost(req);

	return request({
		method: 'GET',
		encoding: '',
		url: HttpHelper.getOrigin(req) + url,
		rejectUnauthorized: false,
		gzip: true,
		headers: headers,
		qs: {
			videoId: videoId
		}
	});
}

exports.getVideoInfo = function(req, res){
	return getPageData(req, res, '/bolo/api/video/videoInfo.htm');

};

exports.getRelatedVideos = function(req, res){

	return getPageData(req, res, '/bolo/api/video/relations.htm');

};

exports.getDanmaku = function(req, res) {

	//return getPageData(req, res, '/bolo/api/video/bulletBroadcastHistory.htm').then(function(result){
	return getPageData(req, res, '/bolo/api/public/bulletBroadcastForH5.htm').then(function(result){
		var data = {};
		JSON.parse(result).forEach(function(d){
			var playTime = Math.floor(d.playTime / 1000);
			if(!data[playTime]) data[playTime] = [];
			data[playTime].push(d.content);
		});
		return data;
	});

};

exports.getBanner = function(req,res){
	return getPageData(req, res, '/bolo/api/index/headPic.htm');
}