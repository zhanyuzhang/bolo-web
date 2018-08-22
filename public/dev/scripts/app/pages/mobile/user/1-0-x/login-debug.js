/**
 * Created by NetEase on 2016/3/30 0030.
 */
define(function(require, exports, module) {
    'use strict';
    var $ = require("zepto@1-1-4"),
		md5 = require("md5@1-0-x"),
		Des = require("/common/Des/1-0-x/Des.js"),
		cookie = require("cookie@1-0-x"),
		userCard = require("/common/userMobile/1-0-x/User"),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
	    qs = require('querystring@1-0-x'),
	    PassportSuggest = require('/pages/mobile/user/1-0-x/modules/passportsuggest-modify');

	var QUERY = qs.parse();

	if(QUERY.backurl){
		cookie.set('backurl',QUERY.backurl,{
			expires: '1 day'
		});
	}

	//第三方登录
	function isPrime(n){
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
	}
	function thirdPartyLogin(userId,token){
		var timestamp = new Date().getTime();
		var tokenRandom = Math.random();

		var sb = '';
		var encryptedToken = token + timestamp + tokenRandom;
		for (var i = 0; i < encryptedToken.length; i++) {
			if (!isPrime(i)) {
				sb += encryptedToken.charAt(i);
			}
		}

		//把参数写入cookie
		var date = "1 month";
		cookie.set('b-token',md5(sb),{expires:date,path:'/',domain:'bobo.com'});
		//支付用的不需要md5加密的token
		cookie.set('b-pay-token',token,{expires:date,path:'/',domain:'bobo.com'});
		cookie.set('b-userid',userId,{expires:date,path:'/',domain:'bobo.com'});
		cookie.set('b-timestamp',timestamp,{expires:date,path:'/',domain:'bobo.com'});
		cookie.set('b-random',tokenRandom,{expires:date,path:'/',domain:'bobo.com'});

		if(cookie.get('backurl')){
			var backurl = cookie.get('backurl');
			cookie.remove('backurl');
			location.href = backurl;
		}
	}
	if(QUERY.userId && QUERY.token){
		thirdPartyLogin(QUERY.userId,QUERY.token);
		return;
	}


    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var usertips =  $(".user-tips"),
        usertipsp = $(".user-tips p"),
        username = $(".user-name"),
        userpassword = $(".user-password");
    //获取到焦点的时候隐藏logo
    var logoshow = $(".user-logo"),
        lg3 = $(".user-login-other");
    //获取url上参数
    $.getUrlParam = function(name){
        var reg= new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r!=null) return unescape(r[2]); return null;}
    var pageUrl = window.location.search;
    var isBackurl = pageUrl.indexOf("backurl"); //是否有backurl这个字段
    var backurl = "";
    var qd = cookie.get("b-qd");
    if(qd === null || qd === undefined){
        qd = "channel_is_null";
    }
    if(!userCard.isLogin()) {
        //点击用户名输入框
        username.bind("focus",function (e) {
            usertips.css("display", "none");
            usertips.val("");
            if (username.val() == "网易邮箱/手机号") {
                username.val("");
            }
            e.stopPropagation();
        });
        //点击密码输入框
        userpassword.bind("focus",function (e) {
            usertips.css("display", "none");
            usertipsp.val("");
            if(bIsAndroid){
               // lg3.css("display","none");
            }

            //e.stopPropagation();
        }).bind("blur",function(e){
            if(bIsAndroid){
               // lg3.css("display","block");
            }

            e.stopPropagation();
        });
        //点击登录按钮
        $('.userbtn').tap(function () {
            var nameval = username.val();
            var password = userpassword.val();
            if (nameval == "" || nameval == "网易邮箱/手机号") {
                usertipsp.text("请输入网易邮箱/手机号");
                usertips.css("display", "block");
                username.val("");
                $(username).focus(); //光标定位，待定
                return false;
            } else if (password == "") {
                usertipsp.text("请输入密码");
                usertips.css("display", "block");
                $(password).focus(); //光标定位，待定
                return false;
            } else {
                usertipsp.text("");
                usertips.css("display", "none");
	            username.blur();
	            userpassword.blur();
                $(".user-loading").css("display", "block");
                new TokenUtil();
            }
        });
        //点击第三方登录按钮
        $(".login-other-qq").on("tap",function(){
            window.location.href = HttpHelper.getOrigin('bobotest.live.163.com','www.bobo.com') + "/mobile/third-login?platform=7&type=qq&distChannel="+ qd +"&redirectUrl=http://" + location.host + location.pathname;
        });
        $(".login-other-wb").on("tap",function(){
            window.location.href = HttpHelper.getOrigin('bobotest.live.163.com','www.bobo.com') + "/mobile/third-login?platform=7&type=weibo&distChannel="+ qd +"&redirectUrl=http://" + location.host + location.pathname;
        });
    }else{
	    history.go(-1);
    }
    //获取token各类参数
    function TokenUtil(){
        this.des =  Des.encrypt($.trim(username.val()),md5($.trim(userpassword.val())));
        this.uname = $.trim(username.val());
        this.token = "";
        this.userId = "";
        var self = this;
        $.ajax({
            //url:'http://www.bobo.com/api/accessToken',
            url: HttpHelper.getOrigin('bobotest.live.163.com','www.bobo.com') + '/api/accessToken',
            dataType: 'jsonp',
            jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
            jsonpCallback:"tokendata",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"
            data: {
                type: 'password',
                username: this.uname,
                password: this.des,
                distChannel:qd,
                platform:7
            },
            success: function(tokendata, status) {
                //这里获取返回的token,userID
                if(tokendata.status != 0){
                    $(".user-loading").css("display","none");
                    var token = tokendata.token;
                    var userId = tokendata.userId;
                    self.getNewToken(token,userId);
                }else{
                    $(".user-loading").css("display","none");
                    usertipsp.text("登录失败，请重新登录");
                    usertips.css("display","block");
                }
            }
        });
    }
    TokenUtil.prototype = {
        getNewToken: function (token,userId) {
            var self = this;
            self.token = token;
            self.userId = userId;
            self.timeStamp = new Date().getTime();
            self.tokenRandom = Math.random();
            self.encrypt(self.token,self.userId, self.timeStamp, self.tokenRandom);
        },
        encrypt: function (token,userid, timestamp, tokenRandom) {
            var sb = '';
            var mytoken = token;
            var token = token + timestamp + tokenRandom;
            var len = token.length;
            for (var i = 0; i < len; i++) {
                if (!this.isPrime(i)) {
                    sb += token.charAt(i);
                }
            }
            //拿到token之后再进行md5加密
            this.encryptToken = md5(sb);
            //支付用的不需要md5加密的token
            this.encryptToken2 = mytoken;
            //把参数写入cookie
            var date = "1 month";
            cookie.set('b-token',this.encryptToken,{expires:date,path:'/',domain:'bobo.com'});
            cookie.set('b-pay-token',this.encryptToken2,{expires:date,path:'/',domain:'bobo.com'});
            cookie.set('b-userid',userid,{expires:date,path:'/',domain:'bobo.com'});
            cookie.set('b-timestamp',timestamp,{expires:date,path:'/',domain:'bobo.com'});
            cookie.set('b-random',tokenRandom,{expires:date,path:'/',domain:'bobo.com'});
            //地址栏是否有返回地址
            if(isBackurl != -1){
                backurl = $.getUrlParam("backurl");
                window.location.href = backurl;
            }else{
                window.location.href = "/";
            }
        },
        isPrime: function (n) {
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
        }
    }
    //获取屏幕高度，自适应
    var screenHeight = document.body.offsetHeight /100;
    var formHeight = $("#js-form").height();
    var showHeight = (screenHeight - (formHeight/100))/2;
    $("#js-form").css("padding-top",(showHeight/3) + "rem");
    var login = new PassportSuggest();
    login.init(username,userpassword,"#user-passport-username-list");
    $(".user-back").on("click",function(){
        history.go(-1);
    });
});