var cms = require('../../cms');
exports.getsetsInfo =function() {
  return cms.get('http://www.bobo.com/special/bolo/cover_danmaku.html');
};