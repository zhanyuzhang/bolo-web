/**
 * Created by NetEase on 2016/3/30 0030.
 */
define(function(require, exports, module) {

    'use strict';
	var $ = require('zepto@1-1-4'),
		cookie = require("cookie@1-0-x"),
		Urs = require("/pages/mobile/user/1-1-x/modules/Urs"),
		user = require("/common/user/mobile/1-0-x/user"),
		qs = require('querystring@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x');

	var QUERY = qs.parse(),
		backurl = QUERY.backurl || cookie.get('backurl') || '/m/download';

	backurl && cookie.set('backurl',backurl,{
		expires: '1 day'
	});

	var $body = $(document.body);

	if (!user.isLogin()) {
		var ursConfig = {
			logincb: function(username) {

				$.ajax({
					url: HttpHelper.getOrigin('bobotest.live.163.com','www.bobo.com') + '/api/accessToken',
					dataType: 'jsonp',
					jsonpCallback:"tokendata",
					data: {
						type: 'cookie'
					},
					success: function(tokendata) {
						user.setLoginCookie(tokendata.token, tokendata.userId);
						location.href = backurl;
					}
				});

			},
			regcb: function(){

				$.ajax({
					url: HttpHelper.getOrigin('bobotest.live.163.com','www.bobo.com') + '/api/accessToken',
					dataType: 'jsonp',
					jsonpCallback:"tokendata",
					data: {
						type: 'cookie'
					},
					success: function(tokendata) {
						user.setLoginCookie(tokendata.token, tokendata.userId);
						location.href = backurl;
					}
				});

			}
		};

		new Urs(ursConfig);
	} else {
		if(QUERY.userId && QUERY.token){
			user.setLoginCookie(QUERY.token, QUERY.userId);
		}
		location.href = backurl;
	}

	$body.delegate('.back-trigger', 'tap', function() {
		history.go(-1);
	});
 	$body.delegate('.login-trigger', 'tap', function(evt) {
		var type = $(evt.currentTarget).data('type'),
			qd = cookie.get("b-qd") || 'channel_is_null';
		location.href = HttpHelper.getOrigin('bobotest.live.163.com','www.bobo.com') + '/mobile/third-login?platform=7&type=' + type +'&distChannel=' + qd + '&redirectUrl=' + location.href;
	});
    // getScript = function(src, callback) {
    // 	var script = document.createElement('script');
    // 	script.async = 'async';
    // 	script.src = src;
    // 	callback && (script.onload = callback);
    // 	document.querySelector('head').appendChild(script);
    // };
    //
    // getScript('https://webzj.reg.163.com/webapp/javascript/message.js?v=20160823', createFun);
    // var url3 = ' http://reg.163.com/outerLogin/oauth2/connect.do?target=6&id=&product=&url=&display=mobile&scope=';
    // var url = 'http://reg.163.com/outerLogin/oauth2/connect.do?target=13&product=kaola&url=http%3A%2F%2Fbolo.bobo.com%2Fdownload';
    // var url2 = 'http://reg.163.com/outerLogin/oauth2/connect.do?target=13&product=kaola&url=http%3A%2F%2Fbolo.bobo.com%2Fdownload&display=mobile';
    // function createFun() {
    // 	var _config = {
    // 		autoFocus:1,
    // 		version:2,
    // 		unLoginTime:0,
    // 		lazyCheck:0,
    // 		regCapLazyload:0,
    // 		domainSuffixs:'',
    // 		domains:'',
    // 		regDomains:'',
    // 		frameSize:'',// 当使用自定义样式窗体在加载后宽高改变导致初始化位置不居中，传入框体加载后的实际宽高，是为了在初始化时保证框体居中，而非改变窗体大小
    // 		notFastReg:'',// 和single功能相似，相当于single=1
    // 		regDomainSuffixs:'', // 注册成功后需要设置的cookie的域名列表
    // 		regCookieDomain:'',// 指定passport代理注册的域名
    // 		crossDomainUrl:'',// 指定首层iframe的域名
    // 		server:0, // 滑块验证码地址配置
    // 		productkey:'8infaddo36mtuzseml0wohs6omu4v5lo', // 滑块验证码key
    // 		swidth:'320',// 滑块验证码宽度
    // 		autoSuffix:0,// 登录是否根据后缀设置cookie
    // 		noMobileReg:0,// 是否屏蔽手机邮注册
    // 		unLoginText:'二十天免登录', // 十天免登录
    // 		skin : 1,// 皮肤
    // 		prdomain:'',//当产品需要指定登入域名时传入预填域名如@163.com邮箱
    // 		isHttps: 0,// 是否用https，优先级高于PROTOCOL和REGPROTOCOL
    // 		PROTOCOL:'http',// 登录，是否用http
    // 		REGPROTOCOL:'http',// 注册，是否用http
    // 		gotoRegText:'去注册的文案',
    // 		gotoLoginText:'去登录的文案',
    // 		product : 'urs', // 产品ID
    // 		promark : 'zCqdWsL',// 组件ID
    // 		host : 'dl.reg.163.com',// 组件所在域名
    // 		cookieDomain : '', // 指定passport代理登录的域名
    // 		single : 0,// 是否只用一个模块，1是，0否
    // 		page : 'login',// 首屏
    // 		regUrl : 'http://reg.163.com/reg/reg.jsp?product=urs', //产品自定义注册入口
    // 		regPlaceholder:{account:'注册用户名',pwd:'注册密码'},
    // 		placeholder : {account:'登录用户名',pwd:'登录密码'},
    // 		needUnLogin : 1 ,//【可选】是否需要十天免登按钮
    // 		defaultUnLogin : 1,//【可选】十天免登初始化状态，默认为0
    // 		needQrLogin : 1 ,//【可选】是否需要二维码登录，默认为0
    // 		toolName : "自定义扫码App",//【扫码配置】自定义扫码工具
    // 		toolUrl : "http://mail.163.com/dashi/?from=urs",//【扫码配置】自定义扫码工具的下载地址
    // 		needPrepare : 0,//【可配】是否需要预加载（针对弹框式，在产品方DOM加载完成后初始化加载组件先行资源，保证显示时间在50ms内，会有一定的带宽占用，按需配置）
    // 		needanimation : 1,//是否需要反转动画
    // 		coverBackground : "background:-webkit-radial-gradient(center,rgba(0,0,0,0.3),#000 75%);",
    // 		iframeShowAnimation : "showAnimation .5s",
    // 		errMode : 1,
    // 		noGaq : 0,
    // 		otherThirdLink:'<div><a target="_blank" href="https://reg.163.com">其他登录方式<a></div>',// 1.0.1版本属性
    // 		doLoginLockStyle:'',
    // 		loginText:'包含2个模块同上',
    // 		doRegLockStyle:'',
    // 		regText:'只有注册模块',
    // 		hasIdCard:0,
    // 		oauthLoginConfig : [
    // 			{  'name' : 'yixin' },
    // 			{  'name' : 'qq'  },
    // 			{  'name' : 'weibo' },
    // 			{  'name' : 'weixin','url':'http://reg.163.com/outerLogin/oauth2/connect.do?target=13&scope=snsapi_login&domains=global.163.com&product=kaola&url=https%3A%2F%2Fwww.zhihu.com%2F%23signin' },
    // 			{
    // 				'name' : 'renren',
    // 				'url' : 'http://reg.163.com/outerLogin/oauth2/connect.do?target=2&product=urs'
    // 			},
    // 			{'name' : 'alipay'}
    // 		],
    // 		terms :[
    // 			{
    // 				'name' : '《自定义服务条款01》',
    // 				'url'  : 'http://reg.163.com/agreement.shtml'
    // 			},
    // 			{
    // 				'name' : '《自定义服务条款02》',
    // 				'url'  : 'http://reg.163.com/agreement.shtml'
    // 			}
    // 		],
    // 		regcb:function(_username,_url){
    // 			console.log(_username);
    // 			console.log(_url);
    // 		},
    // 		logincb : function(_username,_isOther){
    // 			// console.log('用户名:'+_username);
    // 			// console.log('是否第三方登录:' + _isOther);
    // 			window.refresh();
    // 		},
    // 		closecb : function(){
    // 			// console.log('用户放弃操作');
    // 		},
    // 		afterShow:function(){
    // 			var MGID1 = this.MGID;
    // 			document.getElementById('x-panel'+MGID1).style.left = '50%';
    // 			document.getElementById('x-panel'+MGID1).style.top = '30%';
    // 		}
    // 	};
    // 	_config['errMsg']='我是自定义首屏错误信息';        // 首屏错误传参方式二（推荐）
    // 	var urs = new URS(_config);         // 实例初始化 : URS('配置文件')，传入一个config即可，new URS(_config)
    // 	urs.logincb = function(username){
    // 		//Do Something
    // 	};
    // 	urs.regcb = function(username){
    // 		//Do Something
    // 	};
    // 	urs.showIframe();   // 实例加载
    // 	// urs.closeIframe();  // 实例回收,内嵌版本无用。内嵌版本可使用prepareIframe，重新load
    // }


});