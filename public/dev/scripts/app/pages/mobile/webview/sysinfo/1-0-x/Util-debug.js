define(function(require, exports, module) {

	function Util(){}
	Util.tpl = function(html,options){
	var re = /<%([^@>]+)?%>/g,reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,code = 'var r=[];\n',cursor = 0;
        var add = function(line, js) {
        js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
        (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
            return add;
        }
        while(match = re.exec(html)) {
            add(html.slice(cursor, match.index))(match[1], true);
            cursor = match.index + match[0].length;
        }
        add(html.substr(cursor, html.length - cursor));
        code += 'return r.join("");';
        return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
	}
    Util.format = function (self,fmt) { //author: meizz 

    var o = {
        "M+": self.getMonth() + 1, //月份 
        "d+": self.getDate(), //日 
        "h+": self.getHours(), //小时 
        "m+": self.getMinutes(), //分 
        "s+": self.getSeconds(), //秒 
        "q+": Math.floor((self.getMonth() + 3) / 3), //季度 
        "S": self.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (self.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
    }
	module.exports = Util;
});