/**
 * Created by Dillance on 16/2/3.
 */

'use strict';

var request = require('../_request'),
	HttpHelper = require('../common/HttpHelper');

exports.getInfo = function(req, res){

	var headers = JSON.parse(JSON.stringify(req.headers));

	headers.host = HttpHelper.getHost(req,'http://bobotest.live.163.com','http://www.bobo.com');

	var options = {
		method: 'GET',
		encoding: '',
		url: HttpHelper.getOrigin(req,'http://bobotest.live.163.com','http://www.bobo.com') + '/public/getUserCard',
		rejectUnauthorized: false,
		gzip:true,
		headers: headers
	};

	return request(options).then(function(body){
		body = JSON.parse(body.replace('var userJson =',''));
		//if(!res.data) res.data = {};
		//res.data.userInfo = body.userCard;
		return body.userCard;
	});
};

exports.getBoloInfo = function(req,res){
	var headers = JSON.parse(JSON.stringify(req.headers));
	headers.host = HttpHelper.getHost(req);

	var options = {
		method: 'GET',
		encoding: '',
		url: HttpHelper.getOrigin(req) + '/bolo/api/web/video/boloUserInfo.htm',
		rejectUnauthorized: false,
		gzip:true,
		headers: headers
	};

	return request(options).then(function(body){
		return JSON.parse(body);
	});
};

exports.getMinuteInfo = function(req, res){
	var cookies = req.cookies;

	if(!cookies['b-userid'] || !cookies['b-token']) return Promise.resolve({});

	var headers = JSON.parse(JSON.stringify(req.headers));

	headers.host = HttpHelper.getHost(req,'http://223.252.196.214:8081','http://www.bobo.com');

	var options = {
		method: 'GET',
		encoding: '',
		url: HttpHelper.getOrigin(req,'http://223.252.196.214:8081','http://www.bobo.com') + '/spe-data/api/getUserCard.htm',
		rejectUnauthorized: false,
		gzip:true,
		headers: headers,
		qs: {
			userId: cookies['b-userid'],
			loginUserId: cookies['b-userid'],
			random: cookies['b-random'],
			timeStamp: cookies['b-timestamp'],
			token: cookies['b-token'],
			placeDesc: 1
		}
	};


	return request(options).then(function(body){
		//body = JSON.parse(body.replace('var userJson =',''));
		var userInfo = JSON.parse(body);
		userInfo.userIdStr = cookies['b-userid'];

		return userInfo;
	});
};