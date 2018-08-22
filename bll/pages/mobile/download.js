
'use strict';
var cms = require('../../cms');
exports.getBackgoundCmsInfo =function() {
  return cms.get('http://www.bobo.com/special/bolo/download-background.html');
};
// exports.getAnchorInfo = function(req,res) {
// 	return cms.get('/dev/static-data/liaoba.json');
// };
