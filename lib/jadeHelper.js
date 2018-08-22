/**
 * Created by Dillance on 16/1/17.
 */

var url = require('url');

module.exports = {
	stringifyJSON: function(data){
		return JSON.stringify(data);
	},
	getImage: function(path,size){
        size = size || [50,50];

		if(!path) return path;
		if(!path.match('http')) path = 'http:' + path;

        var suffix = path.match('png');
		suffix = suffix ? 'png' : 'jpg';
        // 如果是nosdn的就用蜂巢压缩，参考：http://support.c.163.com/md.html#!平台服务/对象存储/富媒体手册/图片缩略.md
        // 否则使用imgsize压缩
        return /nosdn/.test(path)
            ? path + '?imageView&thumbnail=' + size[0] + 'x' + size[1]
            : '//imgsize.ph.126.net/?imgurl=' + path + '_' + size[0] + 'x' + size[1] + 'x0x80.' + suffix;
        // return 'http://imgsize.ph.126.net/?imgurl=' + path + '_' + size[0] + 'x' + size[1] + 'x0x80.' + suffix;
   }
};