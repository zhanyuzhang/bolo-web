/**
 * Created by Dillance on 17/1/12.
 */
define(function(require, exports, module) {
	'use strict';
	var $ = require('jquery@1-11-x'),
		tmpl = require('/common/tmpl@1-0-x'),
		Promise = require('promise@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x');

	var Recommend = {
		$wrapper: $('.video-recommend-wrap'),
		init: function(){
			this.render();
		},
		render: function(){

		},
		getData: function(){
			return new Promise(function(resolve){

			});
		}
	}

});