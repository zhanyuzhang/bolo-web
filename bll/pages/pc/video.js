/**
 * Created by Dillance on 16/4/10.
 */
'use strict';

var request = require('../../_request'),
	HttpHelper = require('../../common/HttpHelper');

exports.getEditorInfo = function(req, res, userId){

	var headers = JSON.parse(JSON.stringify(req.headers));

	headers.host = HttpHelper.getHost(req);

	return request({
		method: 'GET',
		encoding: '',
		url: HttpHelper.getOrigin(req) + '/bolo/api/web/video/info.htm',
		rejectUnauthorized: false,
		gzip: true,
		headers: headers,
		qs: {
			userId: userId
		}
	});

};

exports.getAgreementStatus = function(req, res, userId){

	var headers = JSON.parse(JSON.stringify(req.headers));

	headers.host = HttpHelper.getHost(req);

	return request({
		method: 'GET',
		encoding: '',
		url: HttpHelper.getOrigin(req) + '/bolo/api/web/video/hasAgree.htm',
		rejectUnauthorized: false,
		gzip: true,
		headers: headers,
		qs: {
			userId: userId
		}
	});

};

exports.getHistroyTags = function(req, res, userId){

	var headers = JSON.parse(JSON.stringify(req.headers));

	headers.host = HttpHelper.getHost(req);

	return request({
		method: 'GET',
		encoding: '',
		url: HttpHelper.getOrigin(req) + '/bolo/api/tag/historyTagList.htm',
		rejectUnauthorized: false,
		gzip: true,
		headers: headers,
		qs: {
			userId: userId
		}
	});

};
