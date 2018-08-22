/**
 * Created by Dillance on 16/4/10.
 */
'use strict';

var request = require('../../_request'),
	HttpHelper = require('../../common/HttpHelper');


exports.getCollectionInfo = function(req, res){

	var aid = req.query.aid;

	if(!aid) return Promise.reject('缺少aid');

	var headers = JSON.parse(JSON.stringify(req.headers));

	headers.host = HttpHelper.getHost(req);

	return request({
		method: 'GET',
		encoding: '',
		url: HttpHelper.getOrigin(req) + '/bolo/api/videoAlbum/albumInfo.htm',
		rejectUnauthorized: false,
		gzip: true,
		headers: headers,
		qs: {
			aid: aid
		}
	});

};
