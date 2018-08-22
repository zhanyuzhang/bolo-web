/**
 * Created by NetEase on 2016/3/31 0031.
 */
define(function(require, exports, module) {
    'use strict';
    var base = require('base@1-1-x'),
        cookie = require("cookie@1-0-x");

    var userInfo = window.USER_INFO || {};

    return base.extend(userInfo,{
        isLogin: function(){
	        return !!cookie.get("b-token");
        },
        login: function(url){
	        url = url || location.href;
            window.location.href = "/m/user/login?backurl=" + encodeURIComponent(url);
        },
        logout: function(){
            cookie.remove("b-token",{path:'/',domain:'bobo.com'});
            cookie.remove("b-userid",{path:'/',domain:'bobo.com'});
            cookie.remove("b-timestamp",{path:'/',domain:'bobo.com'});
            cookie.remove("b-random",{path:'/',domain:'bobo.com'});
            cookie.remove("b-pay-token",{path:'/',domain:'bobo.com'});
            location.href = location.href;
        },
        token: cookie.get("b-token"),
        paytoken: cookie.get("b-pay-token"),
	    userId: cookie.get("b-userid"),
        userid: cookie.get("b-userid"),
        timestamp: cookie.get("b-timestamp"),
        random: cookie.get("b-random")
    });
});