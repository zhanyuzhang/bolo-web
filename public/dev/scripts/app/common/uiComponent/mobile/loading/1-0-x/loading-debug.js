/**
 * Created by Dillance on 16/12/14.
 */
define(function(require, exports, module) {
	'use strict';

	var loadImg = function(array,callback){
		var self = this;
		array.forEach(function(d){
			var img = new Image();
			img.onload = function(){
				callback(img);
			};
			img.src = d;
		});
	};

	return {
		add: function(options){
			var queue = [];
			loadImg(options.imgArray,function(img){
				queue.push(img);
				options.progress && options.progress(queue.length,options.imgArray.length);
			});
		}
	}

});