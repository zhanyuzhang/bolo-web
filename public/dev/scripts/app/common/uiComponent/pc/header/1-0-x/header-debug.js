/**
 * Created by Dillance on 16/8/22.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('jquery@1-11-x'),
		user = require('/common/user@1-0-x'),
		Stat = require('/common/Stat@1-0-x'),
		dialog = require('/common/uiComponent/pc/dialog@1-0-x');

	var $container = $('.bolo-header .container');

	/*$container.find('.join-btn').click(function(){
		if(user.isLogin()){
			if(dialog.enter.exist) dialog.enter.show();
			else dialog.joinBolo.show();
		}else{
			user.login();
		}
	});*/

	$container.find('.login-btn').click(function(){
		user.login();
		Stat.send('logIn');
	});

	$container.find('.res-btn').click(function(){
		user.register();
		Stat.send('register');
	});

	$container.find('.logout-btn').click(function(){
		user.logout();
		Stat.send('logOut');
	});

	$container.find('.join-btn').click(function(){
		Stat.send('Enter1');
	});

	$container.find('.download-btn').click(function(){
		Stat.send('download');
	});

	$container.find('.manage').click(function(){
		Stat.send('enter');
	});


});