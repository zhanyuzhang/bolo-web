/**
 * Created by Dillance on 16/4/10.
 */
'use strict';

var request = require('../../_request'),
	HttpHelper = require('../../common/HttpHelper');
	var cms = require('../../cms');

function getPageData(req, res, url){

	var roomId = 32004;
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
			roomId: roomId
		}
	});
}

exports.getVideoInfo = function(req, res){
	return getPageData(req, res, '/bolo/api/anchor/getAnchorAndRoomInfo.htm');
};

exports.getArticleInfo = function(req,res){
	return getPageData(req, res, '/bolo/api/video/commentList.htm?videoId=888888&type=3&pageNum=1&pageSize=10');
};
exports.getVideoCmsInfo =function() {
	return cms.get('http://www.bobo.com/special/bolo/cjvideos.html');
};
exports.getCommentList = function(req,res){
	return getPageData(req, res, '/bolo/api/video/commentList.htm?videoId=999999&type=4&pageNum=1&pageSize=6');
};

// exports.getAnchorInfo = function(req,res) {
// 	return cms.get('/dev/static-data/liaoba.json');
// };
