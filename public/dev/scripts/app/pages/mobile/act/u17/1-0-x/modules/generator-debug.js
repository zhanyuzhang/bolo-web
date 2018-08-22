/**
 * Created by Dillance on 16/11/14.
 */
define(function(require, exports, module) {
	'use strict';

	var Promise = require('promise@1-0-x'),
		uadetector = require('uadetector@1-0-x');

	var canvas = document.createElement('canvas'),
		ctx = canvas.getContext('2d');
	canvas.width = 750;
	canvas.height = 1511;

	ctx.font = '40px sans-serif';
	if(uadetector.isOS('android')) ctx.font = '40px SourceHanSans-Bold';
	ctx.textAlign = 'center';
	ctx.fillStyle = '#ffffff';
	ctx.strokeStyle = '#000000';

	var qrcodeImg = new Image();
	qrcodeImg.crossOrigin = 'anonymous';
	qrcodeImg.src = '/dev/images/pages/mobile/act/u17/1-0-x/qrcode.jpg';

	exports.get = function(imgs,words){
		var task = [];
		return new Promise(function(resolve){
			imgs.forEach(function(img,i){
				task.push(new Promise(function(resolve){
					var crossImg = new Image(),
						word = words[i];
					crossImg.crossOrigin = 'anonymous';
					crossImg.onload = function(){
						ctx.drawImage(crossImg, 0, i * 422, 750, 422);
						if(word){
							ctx.fillText(word, canvas.width/2, (i + 1) * 422 - 40);
							ctx.strokeText(word, canvas.width/2, (i + 1) * 422 - 40);
						}
						resolve();
					};
					crossImg.src = img.src;
				}));
			});
			ctx.drawImage(qrcodeImg, 0, 1266, 750, 245);
			Promise.all(task).then(function(){
				resolve(canvas.toDataURL('image/jpeg'))
			});
		});
	}

});