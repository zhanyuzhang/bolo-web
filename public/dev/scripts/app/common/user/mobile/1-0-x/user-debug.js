/**
 * Created by Dillance on 16/9/5.
 */
define(function(require, exports, module) {
	'use strict';
	var $ = require('zepto@1-1-4'),
		base = require('base@1-1-x'),
		cookie = require("cookie@1-0-x"),
		md5 = require('md5@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x');

	var userInfo = window.USER_INFO || {};

	var User = {
		token: cookie.get("b-token"),
		paytoken: cookie.get("b-pay-token"),
		userId: cookie.get("b-userid"),
		userid: cookie.get("b-userid"),
		timestamp: cookie.get("b-timestamp"),
		random: cookie.get("b-random"),
		loginUserId: null,
		isLogin: function() {
			return !!cookie.get("b-token");
		},

		login: function(url) {
			url = url || location.href;
			window.location.href = "/m/user/login?backurl=" + encodeURIComponent(url);
		},
		verifyToken: function(failcallback) {
			var self = this;
			$.ajax({
				url: HttpHelper.getOrigin('bobotest.live.163.com','www.bobo.com') + '/api/validateBoBoToken?var=verifyToken',
				dataType: "jsonp",
				jsonpCallback: "verifyToken",
				success: function(json) {
					if (json.isTokenValidate != 1) {
						self.delLoginCookie();
						typeof failcallback == 'function' && failcallback();
					}
				}
			});
		},
		encryptToken: function(token, timestamp, random) {
			var isPrime = function(n) {
				if (n % 2 == 0) {
					return false;
				}
				var circle = Math.sqrt(n);
				for (var i = 3; i <= circle; i += 2) {
					if (n % i == 0) {
						return false;
					}
				}
				return true;
			};
			var sb = [];
			var token = token + timestamp + random;
			for (var i = 0; i < token.length; i++) {
				if (!isPrime(i)) {
					sb.push(token.charAt(i));
				}
			}
			return md5(sb.join(''));
		},
		setLoginCookie: function(token, userId, ntes_sess) {
			var date = "1 month",
				paytoken = token,
				timestamp = new Date().getTime(),
				random = Math.random(),
				newToken = this.encryptToken(token, timestamp, random);

			['bobo.com','163.com'].forEach(function(d){
				if (token) {
					cookie.set('b-token', newToken, {
						expires: date,
						path: '/',
						domain: d
					});
					cookie.set('b-pay-token', paytoken, {
						expires: date,
						path: '/',
						domain: d
					});
					cookie.set('b-timestamp', timestamp, {
						expires: date,
						path: '/',
						domain: d
					});
					cookie.set('b-random', random, {
						expires: date,
						path: '/',
						domain: d
					});
				}
				ntes_sess && cookie.set('NTES_SESS', ntes_sess, {
					expires: date,
					path: '/',
					domain: d
				});
				userId && cookie.set('b-userid', userId, {
					expires: date,
					path: '/',
					domain: d
				});
			});
			userId && (this.loginUserId = userId);
		},

		delLoginCookie: function() {
			['bobo.com','163.com'].forEach(function(d) {
				cookie.remove("b-token", {
					path: '/',
					domain: d
				});
				cookie.remove("b-userid", {
					path: '/',
					domain: d
				});
				cookie.remove("b-timestamp", {
					path: '/',
					domain: d
				});
				cookie.remove("b-random", {
					path: '/',
					domain: d
				});
				cookie.remove("b-pay-token", {
					path: '/',
					domain: d
				});
				cookie.remove("NTES_SESS", {
					path: '/',
					domain: d
				});
			});
		},

		logout: function(url) {
			this.delLoginCookie();
			location.href = url || location.href;
		}
	};

	return base.extend(userInfo, User);
});