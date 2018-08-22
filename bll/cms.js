/**
 * Created by Dillance on 16/2/3.
 */

'use strict';

var request = require('./_request'),
	util = require('../lib/util'),
	iconv = require('iconv-lite');

module.exports = {
	get: function(url){
		return request({
			method: 'GET',
			url: url,
			//让request返回buffer
			encoding : null
		}).then(function(body){
			//cms为gb2312编码
			try{
				var data = iconv.decode(body,'gb2312');
				return JSON.parse(data);
			}catch(e){
				var err = new Error(e + ' in ' + 'cms.js ');
				return Promise.reject(err);
			}
			
		});

		//options = util.extend({
		//	duplicate: false,
		//	q: '',
		//	channelid: '0035',
		//	topicid: '003500L7',
		//	start: 0,
		//	size: 3,
		//	//listnum: 3,
		//	//titlelength: 12,
		//	//digestlength: 100,
		//	'sort[]': 'ptime:desc',
		//	//权重
		//	pointstart: 60,
		//	pointend: 90
		//},options);
		//
		//return request({
		//	method: 'GET',
		//	url: 'http://index.ws.netease.com/searchArticleNoScoreFull.htm',
		//	qs: options
		//}).then(function(body,response){
		//	console.log(body);
		//	return body;
		//});
	}
};