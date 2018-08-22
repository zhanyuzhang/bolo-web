/**
 * Created by Dillance on 16/7/12.
 */
define(function(require, exports, module) {
	'use strict';

	function isSupportSticky() {
		if ( window.CSS && window.CSS.supports ) {
			return window.CSS.supports('(position: sticky) or (position: -webkit-sticky)');
		}
		var t = document.createElement('div');
		t.style.position = 'sticky';
		if ('sticky' === t.style.position) {
			return !0;
		}
		t.style.position = '-webkit-sticky';
		if ('-webkit-sticky' === t.style.position) {
			return !0;
		}
		t = null;
		return !1;
	}

	/**
	 * 当前浏览器是否支持AJAX文件上传
	 * @property supportAJAXUpload
	 */
	function supportAJAXUpload() {
		var result, xhr;
		try {
			xhr = new XMLHttpRequest();
		} catch(e) { }

		result = xhr && ('withCredentials' in xhr) && typeof FormData !== 'undefined';
		xhr = null;

		return result;
	}

	/**
	 * 把数字格式化为千分位形式
	 * @method toThousands
	 * @param {Number} num 要格式化的数字
	 * @return {String} 千分位形式的数字
	 */
	function toThousands(num) {
		var num = (num || 0).toString(), result = '';
		while (num.length > 3) {
			result = ',' + num.slice(-3) + result;
			num = num.slice(0, num.length - 3);
		}
		if (num) { result = num + result; }
		return result;
	}

	/**
	 * 当数字大于等于10万时，将其格式化成以万为单位，否则不改变其格式
	 * @method toWan
	 * @deprecated
	 * @param {Number} num 要格式化的数字
	 * @return {String} 格式化后的数字
	 */
	function toWan(num) {
		return num >= 100000 ? (num / 10000).toFixed(1) + '万' : num.toString();
	}

	/**
	 * 当数字小于10万时，返回带千分位的数字；
	 * 当数字大于等于10万小于一亿时，返回以万为单位的数字；
	 * 当数字大于等于一亿时，返回以亿为单位的数字
	 * @method formatNumber
	 * @param {Number} num 要格式化的数字
	 * @return {String} 格式化后的数字
	 */
	function formatNumber(num) {
		num = Number(num);
		if ( isNaN(num) ) { return num; }
		return num < 100000 ? toThousands(num) :
			(num < 100000000 ?
			(num / 10000).toFixed(1) + '万' :
			(num / 100000000).toFixed(1) + '亿'
			);
	}


	/**
	 * 把对象转换为数组
	 * @method objectToArray
	 * @param {Object} obj 要转换的对象
	 * @return {Array} 转换后的数组
	 */
	function objectToArray(obj) {
		var result = [ ];
		for (var i in obj) {
			if ( /^\d+$/.test(i) ) { result[i] = obj[i]; }
		}
		return result;
	}

	/**
	 * 移除URL中的锚点
	 * @method removeHash
	 * @param {string} url 要移除的url
	 * @return {string} 移除后的url
	 */
	function removeHash(url) { return url.replace(/#.*$/, ''); }


	/**
	 * 把时间格式化为“n分钟前”、“n小时前”、“n天前”、“n个月前”的格式，
	 *   如果时间在一年以前，则格式化为“yyyy年M月d日”格式
	 * @method iFormatDate
	 * @param {Date} date 要格式化的时间
	 * @return {String} 格式化结果
	 */
	function iFormatDate(date) {
		var timespan = (new Date - date) / 1000;
		if (timespan < 365 * 24 * 60 * 60) {
			var result;
			if (timespan < 60) {
				result = '1分钟前';
			} else if (timespan < 60 * 60) {
				result = parseInt(timespan / 60) + '分钟前';
			} else if (timespan < 60 * 60 * 24) {
				result = parseInt( timespan / (60 * 60) ) + '小时前';
			} else if (timespan < 60 * 60 * 24 * 30) {
				result = parseInt( timespan / (60 * 60 * 24) ) + '天前';
			} else {
				result = parseInt( timespan / (60 * 60 * 24 * 30) ) + '个月前';
			}
			return result;
		} else {
			return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
		}
	}


	/**
	 * 获取字符串长度（全角字符按2算）
	 * @method chStrLength
	 * @param {String} str 字符串
	 * @return {Number} 字符串长度
	 */
	function chStrLength(str) {
		var result = 0;
		for (var i = str.length - 1; i >= 0; i--) {
			result += str.charCodeAt(i) > 255 ? 2 : 1;
		}
		return result;
	}

	/**
	 * 从指定字符串开头开始截取一定长度的子字符串
	 * @method chSubstr
	 * @param {String} str 指定字符串
	 * @param {Number} length 截取长度（全角字符按2算）
	 * @return {String} 子字符串
	 */
	function chSubstr(str, length) {
		str = String(str);
		var len = str.length;

		var result = '', i = -1;
		while (length > 0 && ++i < len) {
			length -= str.charCodeAt(i) > 255 ? 2 : 1;
			if (length >= 0) { result += str.charAt(i); }
		}

		return result;
	}


	/**
	 * 把秒数转换成指定时间格式
	 * @method formatTime
	 * @param {Number} seconds 秒数
	 * @param {String|Function} pattern 时间格式。传入函数时以函数返回值作为结果
	 * @return {String} 格式化结果
	 */
	function formatTime(seconds, pattern) {
		var date = new Date();
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);

		date.setSeconds(seconds);

		var data = {
			hours: date.getHours(),
			minutes: date.getMinutes(),
			seconds: date.getSeconds()
		};

		return typeof pattern === 'function' ?
			pattern(data.hours, data.minutes, data.seconds) :
			pattern.replace(/<%=(\w+)%>/g, function(match, $1) {
				return data[$1] || '';
			});
	}

	/**
	 * 把秒数转换为 HH:mm:ss 格式字符串（仅对一天以下的时间有效）
	 * @method secondsToDuration
	 * @param {Number} seconds 总秒数
	 * @param {Number} [digit=2] 位数，可以为2或3
	 * @return {String} 时间字符串
	 */
	function secondsToDuration(seconds, digit) {
		var times = [1, 60, 3600], result = [ ], temp;
		digit = digit || 2;
		digit = Math.min(digit, times.length);
		while (--digit >= 0) {
			temp = seconds / times[digit];
			if (temp >= 1) {
				temp = parseInt(temp);
				result.push(temp < 10 ? '0' + temp : temp);
				seconds -= temp * times[digit];
			} else {
				result.push('00');
			}
		}
		return result.join(':');
	}


// HTML编码
	var re_entity = [ ], entityMap = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#x27;',
		'/': '&#x2F;'
	};
	for (var key in entityMap) { re_entity.push(key); }
	var re_entity = new RegExp('[' + re_entity.join('') + ']', 'g');

	/**
	 * 把特殊字符编码为HTML实体
	 * @method htmlEncode
	 * @param {String} str 要编码的字符串
	 * @return {String} 编码结果
	 */
	function htmlEncode(str) {
		return str.replace(re_entity, function(match) {
			return entityMap[match];
		});
	}

	// html字符串模板替换
	function replaceTpl(tpl, data) {
		return tpl.replace(/\$\{(\w+)\}/g, function(match, capture) {
			return data[capture];
		});
	}

	/**
	 * 格式化时间
	 * @method dateParser
	 * @param {String} time 要格式化的毫秒
	 * @return {String} 格式化结果
	 */
	function dateParser(time){
		var now = new Date(),
			date = new Date(time),
			differSeconds = Math.floor((now.getTime() - time) / 1000),
			differMinutes = Math.floor(differSeconds / 60),
			differHours = Math.floor(differMinutes / 60),
			defferDays = Math.floor(differHours / 24);
		if(differSeconds < 60) return '刚才';
		else if(differMinutes < 60) return differMinutes + '分钟前';
		else if(differHours < 24) return differHours + '小时前';
		else if(defferDays <= 7) return defferDays + '天前';
		else return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
	}

	return {
		isSupportSticky: isSupportSticky(),
		isSupportAJAXUpload: supportAJAXUpload(),
		toThousands: toThousands,
		toWan: toWan,
		formatNumber: formatNumber,
		objectToArray: objectToArray,
		removeHash: removeHash,
		iFormatDate: iFormatDate,
		chStrLength: chStrLength,
		chSubstr: chSubstr,
		formatTime: formatTime,
		secondsToDuration: secondsToDuration,
		htmlEncode: htmlEncode,
		replaceTpl: replaceTpl,
		dateParser: dateParser
	}

});