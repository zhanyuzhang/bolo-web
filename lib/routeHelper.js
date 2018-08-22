/**
 * Created by Dillance on 16/2/29.
 */

'use strict';

exports.render = function(req, res, path){
	var viewPath;

	if(req.query.source == 'cdn'){
		viewPath = 'release/'
	}else if(req.headers.host.match(/test|develop|local|preview/) || req.query.source == 'origin'){
		viewPath = 'dev/';
	}else{
		viewPath = 'release/'
	}

	res.render(viewPath + path, res.data);
};