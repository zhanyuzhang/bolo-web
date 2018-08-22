/**
 * Created by Dillance on 16/4/10.
 */
'use strict';

var request = require('../../_request'),
	HttpHelper = require('../../common/HttpHelper');

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


