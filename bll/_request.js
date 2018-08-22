/**
 * Created by Dillance on 16/1/31.
 */

'use strict';


var request = require('request');

function _request(options){
	return new Promise(function(resolve, reject){
		request(options,function(error, response, body){
			
			if(error){
				reject(error);
			}else if(response.statusCode != 200){
				reject(options.url + ': ' + response.statusCode);
			}else{
				resolve(body);
			}
		});
	});
}

module.exports = _request;