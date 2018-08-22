/*!
 * gulp插件 - 文件名添加MD5戳
 * 与原版的区别是，可以把文件地址映射输出到一个指定的object
 */

'use strict';

var path = require('path'),
	through = require('through2'),
	crypto = require('crypto');


function calcMd5(file, size) {
	var md5 = crypto.createHash('md5');
	md5.update(file.contents, 'utf8');

	var result = md5.digest('hex');
	if (size > 0) { result = result.slice(0, size); }

	return result;
}

function getPath(file) {
	return file.base ? path.relative(file.base, file.path) : file.path;
}


module.exports = function(options) {
	options = options || { };
	options.separator = options.separator || '_';
	options.size = options.size || 0;

	return through.obj(function(file, enc, cb) {
		if ( file.isBuffer() ) {
			var md5Hash = calcMd5(file, options.size),
				filename = path.basename(file.path),
				srcPath = getPath(file),
				dir;

			if (file.path[0] == '.') {
				dir = path.join(file.base, file.path);
			} else {
				dir = file.path;
			}
			dir = path.dirname(dir);

			filename = filename.split('.').map(function(item, i, arr) {
				return i == arr.length - 2 ? item + options.separator + md5Hash : item;
			}).join('.');

			file.path = path.join(dir, filename);

			if (options.exportPaths) {
				// 输出文件地址映射
				options.exportPaths( srcPath.replace(/\\/g, '/'), getPath(file).replace(/\\/g, '/') );
			}

			this.push(file);

			cb();
		}
	});
};