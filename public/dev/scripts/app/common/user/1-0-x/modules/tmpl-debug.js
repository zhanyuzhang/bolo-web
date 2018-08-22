// 使 nodejs 可以载入这段代码
if (typeof process !== 'undefined' && (process.title === 'node' || process.title === 'grunt')) {
   define = function(factory) {
      exports.formatTemplate = factory().formatTemplate;
      exports.replaceString = factory().replaceString;
   };
}

define(function(require, exports, module) {
   // Simple JavaScript Templating
   // John Resig - http://ejohn.org/ - MIT Licensed
   var cache = {};
   var reg_space = /[\r\t\n]/g;
   var reg_trimLeft = /^\s+/;
   var reg_trimRight = /\s+$/;
   var reg_spaces = />\s*(.*?)\s*</g;
   var reg_right = /((^|%>)[^\t]*)'/g;
   var reg_equal = /\t=(.*?)%>/g;

   function clone() {
      var target = {};

      for (var i = 0; i < arguments.length; i++) {
         var src = arguments[i];
         if (src && typeof src === 'object') {
            for (var key in src) {
               if (src[key] !== undefined && src.hasOwnProperty(key)) {
                  target[key] = src[key];
               }
            }
         }
      }

      return target;
   }

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
   }

   function tmpl(str, data) {
      // Figure out if we're getting a template, or if we need to
      // load the template - and be sure to cache the result.
      var funcBody = '';
      var fn = /^[a-zA-Z0-9\/]+?$/.test(str) ?
         cache[str] = cache[str] || tmpl(document.getElementById('tmpl_' + str).innerHTML) :

      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("tmplData", "tmpl", replaceString(str));

      if (data) {
         try {
            return fn(data, formatByTmpl);
         } catch (exp) {
            if (typeof console !== undefined && console.error) {
               console.error('error in templates ', str, ':', exp, exp.stack);
            }

            // var Logger = require('utils/log/Logger');
            // Logger.doLog({
            //     keyFrom: Logger.keyFrom(document.body),
            //     action: 'tmplError',
            //     tmplName: str,
            //     message: exp.message,
            //     stack: exp.stack
            // });
         }
      }

      return fn;
   }

   function formatByTmpl(str, data) {
      data = data || {};
      if (typeof str === 'function') {
         return str(data);
      }
      return tmpl(str, data);
   }

   return {
      formatTemplate: formatByTmpl,
      replaceString: replaceString
   };
});