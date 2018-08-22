define(function(require, exports, module) {

   var $ = require('jquery@1-11-x');

   var tplCache = {};

   var cache = {};
   var reg_space = /[\r\t\n]/g;
   var reg_trimLeft = /^\s+/;
   var reg_trimRight = /\s+$/;
   var reg_spaces = />\s*(.*?)\s*</g;
   var reg_right = /((^|%>)[^\t]*)'/g;
   var reg_equal = /\t=(.*?)%>/g;

   var tempYear, tempMonth, tempDate, tempHour, tempMinute, tempSecond;
   function toTwoDigit(num) { return num < 10 ? "0" + num : num; };
   function getDatePart(part) {
      switch (part) {
         case "yyyy": return tempYear;
         case "yy": return tempYear.toString().slice(-2);
         case "MM": return toTwoDigit(tempMonth);
         case "M": return tempMonth;
         case "dd": return toTwoDigit(tempDate);
         case "d": return tempDate;
         case "HH": return toTwoDigit(tempHour);
         case "H": return tempHour;
         case "hh": return toTwoDigit(tempHour > 12 ? tempHour - 12 : tempHour);
         case "h": return tempHour > 12 ? tempHour - 12 : tempHour;
         case "mm": return toTwoDigit(tempMinute);
         case "m": return tempMinute;
         case "ss": return toTwoDigit(tempSecond);
         case "s": return tempSecond;
         default: return part;
      }
   };

   function replaceString(str) {
      return "var p=[];" +

      // Introduce the data as local variables using with(){}
        "with(tmplData){p.push('" +

      // Convert the template into pure JavaScript
        str
        .replace(reg_trimLeft, '')
        .replace(reg_trimRight, '')
        .replace(reg_space, " ")
        .replace(reg_spaces, '>$1<')
        .split("<%").join("\t")
        .replace(reg_right, "$1\r")
        .replace(reg_equal, "',$1,'")
        .split("\t").join("');\n")
        .split("%>").join("\np.push('")
        .split("\r").join("\\'") + "');}return p.join('');";
   };


   function tmpl(str, data) {
      // Figure out if we're getting a template, or if we need to
      // load the template - and be sure to cache the result.
      //console.log(/\W\//.test('<img/>'));false
      // console.log(document.getElementById('tmpl_' + str));

      var funcBody = '', tmplElem = document.getElementById('tmpl_' + str);
      var fn = !/\W\//.test(str) && tmplElem ?
        cache[str] = cache[str] || tmpl(tmplElem.innerHTML) :

      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
        new Function("tmplData", "tmpl", replaceString(str));

      if (data) {
         try {
            return fn(data, formatByTmpl);
         } catch (exp) {
            // if (typeof console !== undefined && console.error) {
            // console.error('error in templates', str, ':', exp, exp.stack);
            //}
         }
      }
      return fn;
   };


   function formatByTmpl(str, data) {
      data = data || {};
      if (typeof str === 'function') {
         return str(data);
      }
      return tmpl(str, data);
   };
   var Util = {
      format: function(param) {
         if (typeof param == "undefined") {
            return ""
         }
         if (typeof param != "object") {
            throw new Error("data sended to the server must be 'object'");
         }
         var s = [];
         for (var j in param) {
            s.push(encodeURIComponent(j) + "=" + encodeURIComponent(param[j]));
         }
         return s.join("&").replace(/%20/g, "+");
      },
      log: function(obj) {
      },
      login: function() {
         $(document).trigger('error', ['needLogin']);
      },
      reg: function() {
         $(document).trigger('error', ['needReg']);
      },
      stripTime: function(dateStr) {
         return dateStr.replace(/\+0800|\S\S\S\+0800|CST/g, "");
      },
      replace: function(str, hash) {
         for (key in hash) {
            if (Object.prototype.hasOwnProperty.call(hash, key)) {
               str = str.replace(new RegExp(key, 'g'), hash[key]);
            }
         }
         return str;
      },
      getLength: function (e) {
         return Math.ceil(e.replace(/[\uFE30-\uFFA0\u2E80-\u9FFF\uac00-\ud7ff\u3000\u2018\u201c\u201d\u2019]/g, "**").length / 2)
      },
      getleftLength: function (e) {
         return Math.floor(e.replace(/[\uFE30-\uFFA0\u2E80-\u9FFF\uac00-\ud7ff\u3000\u2018\u201c\u201d\u2019]/g, "**").length / 2)
      },
      getsize: function (e) {
         return e.replace(/[\uFE30-\uFFA0\u2E80-\u9FFF\uac00-\ud7ff\u3000\u2018\u201c\u201d\u2019]/g, "**").length
      },
      isLegal: function(str) {
         for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 255) return false;
         }
         return true;
      },
      cutString: function(str, start, len) {
         var len = len * 2;
         if (!str || !len) { return ''; }
         //预期计数：中文2字节，英文1字节
         var a = 0;
         //循环计数
         var i = 0;
         //临时字串
         var temp = '';
         for (i = start; i < str.length; i++) {
            if (str.charCodeAt(i) > 255) {
               //按照预期计数增加2
               a += 2;
            }
            else {
               a++;
            }
            //如果增加计数后长度大于限定长度，就直接返回临时字符串
            if (a > len) { return temp; }
            //将当前内容加到临时字符串
            temp += str.charAt(i);
         }
         //如果全部是单字节字符，就直接返回源字符串
         return str;
      },
      subString: function(str, start, len) {
         var len = len * 2;
         if (!str || !len) { return ''; }
         //预期计数：中文2字节，英文1字节
         var a = 0;
         //循环计数
         var i = 0;
         //临时字串
         var temp = '';
         for (i = start; i < str.length; i++) {
            if (str.charCodeAt(i) > 255) {
               //按照预期计数增加2
               a += 2;
            }
            else {
               a++;
            }
            //如果增加计数后长度大于限定长度，就直接返回临时字符串
            if (a > len) {
               if (Util.getleftLength(str) > len - 1) {
                  temp = temp + "...";
               };
               return temp;
            }
            //将当前内容加到临时字符串
            temp += str.charAt(i);
         };

         if (Util.getleftLength(str) > len - 1) {
            str = str + "...";
         };
         //如果全部是单字节字符，就直接返回源字符串
         return str;
      },
      formatTemplate: formatByTmpl,
      follow: function(followId, func) {
         var fun = func || function() { };
         $.post("/user/follow", { followId: followId }, function(data) {
            if (data.status == 1) {
               func();
            } else {
               // alert("关注失败")
            }
         })
      },
      defollow: function(followId, func) {
         var fun = func || function() { };
         $.post("/user/unfollow", { followId: followId }, function(data) {
            if (data.status == 1) {
               func();
            } else {
               //alert("取消关注失败")
            }
         })
      },
      bubbleNode: function(elem, condition, callBack) {
         var con = false;
         do {
            if (condition(elem)) {
               con = true;
               break;
            } else {
               elem = elem.parentNode;
            }
         } while (elem.parentNode);
         con && callBack();
      },
      bubbleNodeNe: function(elem, condition, callBack) {
         var con = true;
         do {
            if (condition(elem)) {
               con = false;
               break;
            } else {
               elem = elem.parentNode;
            }
         } while (elem.parentNode);
         con && callBack();
      },
      getSelectText: (function() {
         if (document.selection) {
            return function() { return document.selection.createRange().text };          // for IE
         } else {
            return function() { return document.getSelection() };         // for firefox
         }
      })(),
      getLinkParam: function(linkNode) {
         return linkNode.getAttribute("href").replace('javascript://', '');
      },
      getImageUrl: function(url, width, height, corp) {
         var width = width, url = url && url || '', tail = url.split('.')[1];
         var height = height || width;
         var quality = 85;
         var q = 1;
         if (!corp && corp == 0) {
            q = corp;
         }

         var src = '';
         if (url.match(/bobo-public.nosdn.127.net\//i)) {
            if(url.match(/imageView/i) && url.match(/thumbnail/i)) {
               src = url;
            } else {
               src = url + '?imageView&quality=' + quality + '&thumbnail=' + width + (q === 1 ? 'y' : 'x') + height;
            }
         } else {
            src = '//imgsize.ph.126.net/?imgurl=' + url + '_' + width + 'x' + height + 'x' + q + 'x' + quality + '.' + tail;
         }
         return src;
      },
      formatDate: function(time, formation) {
         var date = new Date(time);
         tempYear = date.getFullYear();
         tempMonth = date.getMonth() + 1;
         tempDate = date.getDate();
         tempHour = date.getHours();
         tempMinute = date.getMinutes();
         tempSecond = date.getSeconds();
         return formation.replace(/y+|m+|d+|h+|s+|H+|M+/g, getDatePart);
      },
      refresh: function() {
         window.location.reload();
      },
      wealth: {
         0: "屌丝",
         1: "一富",
         2: "二富",
         3: "三富",
         4: "四富",
         5: "五富",
         6: "六富",
         7: "七富",
         8: "八富",
         9: "九富",
         10: "十富",
         11: "男爵",
         12: "子爵",
         13: "伯爵",
         14: "侯爵",
         15: "公爵",
         16: "郡公",
         17: "国公",
         18: "王爵",
         19: "藩王",
         20: "郡王",
         21: "亲王",
         22: "国王",
         23: "帝王",
         24: "皇帝",
         25: "天君",
         26: "帝君",
         27: "圣君",
         28: "主君",
         29: "仙君",
         30: "神",
         31: "超神1",
         32: "超神2",
         33: "超神3",
         34: "超神4",
         35: "超神5",
         36: "超神6",
         37: "超神7",
         38: "超神8",
         39: "超神9",
         40: "超神10",
         41: "超神11",
         42: "超神12",
         43: "超神13",
         44: "超神14",
         45: "超神15",
         46: "超神16",
         47: "超神17",
         48: "超神18",
         49: "超神19",
         50: "超神20",
         51: "众神之神1",
         52: "众神之神2",
         53: "众神之神3",
         54: "众神之神4",
         55: "众神之神5",
         56: "众神之神6",
         57: "众神之神7",
         58: "众神之神8",
         59: "众神之神9",
         60: "众神之神10",
         61: "众神之神11",
         62: "众神之神12",
         63: "众神之神13",
         64: "众神之神14",
         65: "众神之神15",
         66: "众神之神16",
         67: "众神之神17",
         68: "众神之神18",
         69: "众神之神19",
         70: "众神之神20"
      },
      anchor: {
         0: "0星",
         1: "1星",
         2: "2星",
         3: "3星",
         4: "4星",
         5: "5星",
         6: "1钻",
         7: "2钻",
         8: "3钻",
         9: "4钻",
         10: "5钻",
         11: "1皇冠",
         12: "2皇冠",
         13: "3皇冠",
         14: "4皇冠",
         15: "5皇冠",
         16: "6皇冠",
         17: "7皇冠",
         18: "8皇冠",
         19: "9皇冠",
         20: "10皇冠",
         21: "11皇冠",
         22: "12皇冠",
         23: "13皇冠",
         24: "14皇冠",
         25: "15皇冠",
         26: "16皇冠",
         27: "17皇冠",
         28: "18皇冠",
         29: "19皇冠",
         30: "20皇冠",
         31: "五彩冠",
         32: "五彩1星",
         33: "五彩2星",
         34: "五彩3星",
         35: "五彩4星",
         36: "五彩5星",
         37: "五彩1钻",
         38: "五彩2钻",
         39: "五彩3钻",
         40: "五彩4钻",
         41: "五彩5钻",
         42: "五彩1冠",
         43: "五彩2冠",
         44: "五彩3冠",
         45: "五彩4冠",
         46: "五彩5冠",
         47: "五彩6冠",
         48: "五彩7冠",
         49: "五彩8冠",
         50: "五彩9冠",
         51: "五彩10冠",
         52: "五彩11冠",
         53: "五彩12冠",
         54: "五彩13冠",
         55: "五彩14冠",
         56: "五彩15冠",
         57: "五彩16冠",
         58: "五彩17冠",
         59: "五彩18冠",
         60: "五彩19冠",
         61: "五彩20冠",
         62: "黄金冠",
         63: "黄金1星",
         64: "黄金2星",
         65: "黄金3星",
         66: "黄金4星",
         67: "黄金5星",
         68: "黄金1钻",
         69: "黄金2钻",
         70: "黄金3钻",
         71: "黄金4钻",
         72: "黄金5钻",
         73: "黄金1冠",
         74: "黄金2冠",
         75: "黄金3冠",
         76: "黄金4冠",
         77: "黄金5冠",
         78: "黄金6冠",
         79: "黄金7冠",
         80: "黄金8冠",
         81: "黄金9冠",
         82: "黄金10冠",
         83: "黄金11冠",
         84: "黄金12冠",
         85: "黄金13冠",
         86: "黄金14冠",
         87: "黄金15冠",
         88: "黄金16冠",
         89: "黄金17冠",
         90: "黄金18冠",
         91: "黄金19冠",
         92: "黄金20冠",
         93: "宝石冠"
      }
   };
   /**
   * 验证email地址的正确性
   */
   Util.EMAIL_REG = /^[a-zA-Z0-9_\-\.]{1,}@[a-zA-Z0-9_\-]{1,}\.[a-zA-Z0-9_\-.]{1,}$/;
   Util.validateEmail = function(email) {
      if (typeof email !== 'string') {
         return false;
      }
      return Util.EMAIL_REG.test(email);
   };


   /**
   * 截取固定长度字符串
   */
   Util.countChars = function(str, len, flag) {
      var strLen = str.replace(/[\u4e00-\u9fa5\s]/g, "**").length, newStr = [], totalCount = 0;

      if (strLen <= len) {
         return str;
      } else {
         for (var i = 0; i < strLen; i++) {
            var nowValue = str.charAt(i);
            if (/[^\x00-\xff]/.test(nowValue)) {
               totalCount += 2;
            } else {
               totalCount += 1;
            }
            newStr.push(nowValue);
            if (totalCount >= len) {
               break;
            }
         }
         if (flag) {
            return newStr.join("");
         } else {
            return newStr.join("") + "...";
         }
      }
   };

   /**
   * 转义字符串中的特殊HTML符号
   * @function Utils.encodeSpecialHtmlChar
   * @param {String}str 要替换的字符串
   * @return {String}
   */
   Util.encodeSpecialHtmlChar = function(str) {
      if (str) {
         var codingchar = ["&", "<", ">", "\""];
         var sepchar = ["&amp;", "&lt;", "&gt;", "&quot;"];
         var len = sepchar.length;

         for (var i = 0; i < len; i++) {
            str = str.replace(new RegExp(codingchar[i], "g"), sepchar[i]);
         }
         return str;
      } else {
         return "";
      }
   };

   /**
   * 反转义字符串中的特殊HTML符号
   * @function Utils.decodeSpecialHtmlChar
   * @param {String}str 要替换的字符串
   * @return {String}
   */
   Util.decodeSpecialHtmlChar = function(str) {
      if (str) {
         var codingchar = ["&amp;", "&lt;", "&gt;", "&quot;", "&#quot", "&#rmrow", "&#lmrow", "&apos;"];
         var sepchar = ["&", "<", ">", "\"", "'", "(", ")", "'"];
         var len = sepchar.length;

         for (var i = 0; i < len; i++) {
            str = str.replace(new RegExp(codingchar[i], "g"), sepchar[i]);
         }
         return str;
      } else {
         return "";
      }
   };

   Util.formatNumber = function(s, n) {
      n = n > 0 && n <= 20 ? n : 2;
      s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
      var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
      t = "";
      for (i = 0; i < l.length; i++) {
         t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
      }
      return t.split("").reverse().join("");
   };

   Util.recoverNumber = function(s) {
      return parseFloat(s.replace(/[^\d\.-]/g, ""));
   };

   /**
   * 去除URL中的特定参数
   * @function Utils.delQueStr
   * @param {String}ref 要去除的参数名
   * @return {String}
   */
   Util.delQueStr = function(url, ref) {
      var str = "";
      if (url.indexOf('?') != -1) {
         str = url.substr(url.indexOf('?') + 1);
      }
      else {
         return url;
      }
      var arr = "";
      var returnurl = "";
      var setparam = "";
      if (str.indexOf('&') != -1) {
         arr = str.split('&');
         for (i in arr) {
            if (arr[i].split('=')[0] != ref) {
               returnurl = returnurl + arr[i].split('=')[0] + "=" + arr[i].split('=')[1] + "&";
            }
         }
         return url.substr(0, url.indexOf('?')) + "?" + returnurl.substr(0, returnurl.length - 1);
      }
      else {
         arr = str.split('=');
         if (arr[0] == ref) {
            return url.substr(0, url.indexOf('?'));
         }
         else {
            return url;
         }
      }
   };

   /**
   * 获取URL中的全部参数
   * @function Utils.getUrlStrs
   * @param {String}url URL
   * @return {String}
   */
   Util.getUrlStrs = function(url){
      var vars = [], hash, str;
      if(url.indexOf('?') != -1){
         str = url.substr(url.indexOf('?') + 1);
         var hashes = str.split('&');
      } else {
         var hashes = [];
      };
      for(var i = 0; i < hashes.length; i++){
         hash = hashes[i].split('=');
         vars.push(hash[0]);
         vars[hash[0]] = hash[1];
      }
      return vars;
   };

   /**
   * 获取URL中的特定参数
   * @function Utils.getUrlStr
   * @param {String}url URL
   * @param {String}name 要获取的参数名
   * @return {String}
   */
   Util.getUrlStr = function(name, url){
      return Util.getUrlStrs(url)[name] || '';
   };

   return Util;
});
