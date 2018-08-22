define(function(require, exports, module) {
   var $ = require('jquery@1-11-x');
   var Class = require('/common/user/1-1-x/modules/Class');
   var FloatWin = require('/common/user/1-1-x/modules/FloatWin');
   var Util = require('/common/user/1-1-x/modules/Util');
   var tpl = require('/common/user/1-1-x/modules/RegTpl');

   var RegBox = Class.extend({
      preRender: function() {
         var data = {url: Util.encodeSpecialHtmlChar(window.location.href)};
         return {
            content: Util.formatTemplate(tpl.reg, data)
         }
      },
      postRender: function($elem) {
         $elem.addClass('loginLayer');
         this.$elem = $elem;

         this.$elem.find('.dialogLayer-hd').find('.js-close').removeClass('btn-close').addClass('btn-login-close');
         this.$elem.find('.dialogLayer-hd').append('<a class="receive-now" href="http://www.bobo.com/special/bobopc/" target="_blank">马上参与</a>');
      },
      show: function() {
         FloatWin.PopWin({
            preRender: $.proxy(this.preRender, this),
            postRender: $.proxy(this.postRender, this)
         }).show();
      }
   });
   return RegBox;
});