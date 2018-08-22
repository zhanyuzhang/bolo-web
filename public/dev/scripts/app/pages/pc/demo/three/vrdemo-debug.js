/**
 * Created by Dillance on 16/8/20.
 */
define(function(require, exports, module) {
	'use strict';

	var qs = require('querystring@1-0-x');

	var QUERY = qs.parse();

	if(QUERY.demo01){
		require.async('/pages/pc/demo/three/modules/demo01',function(demo){
			demo.init();
		});
	}else if(QUERY.demo02){
		require.async('/pages/pc/demo/three/modules/demo02',function(demo){
			demo.init();
		});
	}else if(QUERY.demo03){
		require.async('/pages/pc/demo/three/modules/demo03',function(demo){
			demo.init();
		});
	}else if(QUERY.demo04){
		require.async('/pages/pc/demo/three/modules/demo04',function(demo){
			//demo.init();
		});
	}else if(QUERY.demo05){
		require.async('/pages/pc/demo/three/modules/demo05',function(demo){
			//demo.init();
		});
	}else if(QUERY.demo06){
		require.async('/pages/pc/demo/three/modules/demo06',function(demo){
			//demo.init();
		});
	}else if(QUERY.demo07){
		require.async('/pages/pc/demo/three/modules/demo07',function(demo){
			//demo.init();
		});
	}



});