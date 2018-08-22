/**
 * Created by Dillance on 16/4/30.
 */
define(function(require, exports, module) {
	'use strict';

	var base = require('base@1-1-x'),
		Promise = require('promise@1-0-x'),
		uadetector = require('uadetector@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		qs = require('querystring@1-0-x'),
		md5 = require('md5@1-0-x'),
		cookie = require('cookie@1-0-x'),
		Stat = require('/common/Stat@1-0-x');

	var QUERY = qs.parse();

	function call(cmd,params){

		return new Promise(function(resolve,reject){

			if(!uadetector.is('BOLO')){
				reject('I am not in bolo app');
				return;
			}

			if(uadetector.isOS('android')){

				var result;
				if(params) result = html5Util[cmd](JSON.stringify(params));
				else result = html5Util[cmd]();
				resolve(result && JSON.parse(result));

			}else if(uadetector.isOS('ios')){

				var data = {
					cmd: cmd
				};
				if(params) data.params = JSON.stringify(params);

				var callbackName = base.randomStr('nativeCallback');
				window[callbackName] = function(result){
					resolve(result);
					delete window[callbackName];
				};
				data.callback = callbackName;

				location.href = qs.append('bololive://js',data);

			}
		});

	}


	exports.call = function(cmd,params){
		switch(cmd){
			case 'openVideo':
				if(uadetector.isOS('android')) html5Util[cmd](parseInt(params.videoId));
				else if(uadetector.isOS('ios')) location.href = 'bololive://js?cmd=' + cmd + '&params=' + JSON.stringify(params);
				break;
			case 'getLoginInfo':
				//安卓用了小写
				if(uadetector.isOS('android')){
					return call('getLogininfo',params);
					break;
				}
			default:
				return call(cmd,params);
		}
	};

	exports.hello = function(){
		return uadetector.is('BOLO');
	};

	exports.user = exports.call('getLoginInfo');
	exports.userPromise = exports.user;

	exports.isLogin = exports.userPromise.then(function(userInfo){
		if(userInfo.userId) return Promise.resolve();
		return Promise.reject();
	});
	exports.isLoginPromise = exports.isLogin;

	var events = {};
	exports.on = function(name, callback){
		var list = events[name] || (events[name] = []);
		list.push(callback);
		return this;
	};
	exports.off = function(name, callback) {
		// Remove *all* events
		if (!(name || callback)) {
			events = {};
			return this;
		}

		var list = events[name];
		if (list) {
			if (callback) {
				for (var i = list.length - 1; i >= 0; i--) {
					if (list[i] === callback) {
						list.splice(i, 1)
					}
				}
			}
			else {
				delete this.events[name]
			}
		}

		return this;
	};
	exports.emit = function(name, data) {
		var list = events[name];

		if (list) {
			// Copy callback lists to prevent modification
			list = list.slice();

			// Execute event callbacks, use index because it's the faster.
			for(var i = 0, len = list.length; i < len; i++) {
				list[i](data)
			}
		}

		return this;
	};

	exports.version = (function(){
		var ua = navigator.userAgent,
			version,
			parsedVersion = '';
		if(exports.hello()){
			if(uadetector.isOS('android')){
				version = ua.match(/\/\d+\.\d+\.\d+/);
				version = version ? (version[0] || 0) : 0;
			}else{
				version = ua.match(/iOS[ ](\d+\.\d+\.\d+)/);
				version = version ? (version[1] || 0) : 0;
			}

			if(version) version = version.split('.');
			else return version;

			version.forEach(function(d,i){
				parsedVersion += i > 0 && d < 10 ? ('0' + d) : d;
			});
			return parsedVersion;
		}else{
			return 'not in bolo';
		}
	}());


	window.onnativemessage = function(type, data){
		exports.emit(type, data);
	};

});