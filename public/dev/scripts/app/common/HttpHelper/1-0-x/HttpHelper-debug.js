/**
 * Created by Dillance on 15/12/9.
 */
define(function(require, exports, module) {
    'use strict';

    var qs = require('querystring@1-0-x');

	var QUERY = qs.parse();

	//var defaultTestHost = 'test.bolo.bobo.com',
	var defaultTestHost = location.host.match(/test\.bolo\.bobo\.com/) ? 'test.bolo.bobo.com' : (/local/.test(location.href) ? 'testbolo.163.com' : 'preview.bobo.com:85'),
		defaultOfficialHost = 'bolo.163.com',
		newOfficialHost = 'bolo.163.com';

	function isTest(){
		if(QUERY.host == 'official') return false;
		else if(location.host.match(/test|local|dev|preview/) || qs.parse().host == 'test') return true;
		else return false;
	}

	function isNew(){
		return /bolo\.163\.com/.test(location.host);
	}

    //exports.host = qs.parse().test ? 'http://test.bolo.bobo.com' : 'http://m.live.netease.com';

	exports.getHost = function(testHost,officialHost){

		testHost = testHost || defaultTestHost;
		officialHost = officialHost || (isNew() ? newOfficialHost : defaultOfficialHost);

		if(isTest()) return testHost;
		else return officialHost
	};

	exports.getOrigin = function(testHost,officialHost){

		testHost = testHost || defaultTestHost;
		officialHost = officialHost || (isNew() ? newOfficialHost : defaultOfficialHost);

		if(isTest()) return '//' + testHost;
		else return '//' + officialHost
	};

	exports.getImage = function(path,size,type){
		size = size || [50,50];

		if(!path || !path.match('http')) return path;

		var suffix = path.match('png');
		suffix = suffix ? 'png' : 'jpg';
        // 如果是nosdn的就用蜂巢压缩，参考："http://support.c.163.com/md.html#!平台服务/对象存储/富媒体手册/图片缩略.md"
		// 否则使用imgsize压缩
		return /nosdn/.test(path)
			? path + '?imageView&thumbnail=' + size[0] + 'x' + size[1]
			: '//imgsize.ph.126.net/?imgurl=' + path + '_' + size[0] + 'x' + size[1] + 'x' + (type || 0) + 'x80.' + suffix;
	}

});