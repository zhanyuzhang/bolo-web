define(function(require, exports, module) {
   var $ = require('jquery@1-11-x');
   var Class = require('/common/Header/1-0-x/Class');
   var FloatWin = require('/common/Header/1-0-x/FloatWin');
   var Util = require('/common/Header/1-0-x/Util');
   var tpl = require('/common/Header/1-0-x/tpl');
   var LoginSuggest = require('/common/Header/1-0-x/LoginSuggest');

   var LoginBox = Class.extend({
      init: function() {
         this.$elem = null;
      },
      preRender: function() {
         var data = {url: Util.encodeSpecialHtmlChar(window.location.href)};
         return {
            content: Util.formatTemplate(tpl.login, data)
         }
      },
      postRender: function($elem) {
         $elem.addClass('loginLayer');
         this.$elem = $elem;
         this.$inputElem = this.$elem.find('input:text');
         this.$passwordElem = this.$elem.find('input:password');
         this.$errorTip = this.$elem.find('.js-errorTip');
         this.$formElem = this.$elem.find('form');
         this.$formElem.delegate('input:text, input:password', 'focus', $.proxy(this.hideError, this));
         this.$formElem.submit($.proxy(this.onSubmit, this));

         this.$elem.find('.dialogLayer-hd').find('.js-close').removeClass('btn-close').addClass('btn-login-close');
         this.$elem.find('.dialogLayer-hd').append('<a class="receive-now" href="http://www.bobo.com/special/bobopc/" target="_blank">马上参与</a>');
      },
      show: function() {
         FloatWin.PopWin({
            preRender: $.proxy(this.preRender, this),
            postRender: $.proxy(this.postRender, this)
         }).show();
         this.onLoginSuggest();
         this.onPlaceHolder();
      },
      onLoginSuggest: function() {
         var nameNode = document.getElementById("poplayer_username"),
            passNode = document.getElementById("poplayer_passport");

         new LoginSuggest(nameNode, function() {
            $(passNode).focus();
         });
      },
      onPlaceHolder: function() {
         setTimeout($.proxy(function() {
            this.$inputElem.focus();
         }, this), 0);
         if ("placeholder" in document.createElement("input")) {
            this.$formElem.find('.js-defaultText').hide();
            return;
         }
         this.$formElem.delegate('.js-defaultText', 'click', function () {
            $(this).prev('input').focus();
         }).delegate('input', 'keyup', function () {
            if ($.trim($(this).val()) === '') {
               $(this).next('.js-defaultText').show();
            }else {
               $(this).next('.js-defaultText').hide();
            }
         });
      },
      onCheckVal: function() {
         var usernameVal = $.trim(this.$inputElem.val());
         var passwordVal = this.$passwordElem.val();
         if (usernameVal === '') {
            this.showError('邮箱帐号不能为空');
            return false;
         } else if (!Util.validateEmail(usernameVal)) {
            this.showError('邮箱格式有误');
            return false;
         } else if (passwordVal === '') {
            this.showError('密码不能为空');
            return false;
         }
         this.hideError();
         return true;
      },
      onSubmit: function(evt) {
         if (!this.onCheckVal()) {
            evt.preventDefault();
         }
      },
      showError: function(text) {
         this.$errorTip.show().find('span').text(text);
      },
      hideError: function() {
         this.$errorTip.hide();
      }
   });
   return LoginBox;
});