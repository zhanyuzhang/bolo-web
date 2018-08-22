define(function(require, exports, module) {
   var $ = require('jquery@1-11-x');
   var Util = require('/common/user/1-1-x/modules/Util');
   var Win = require('/common/user/1-1-x/modules/Win');
   var Tpl = require('/common/user/1-1-x/modules/FloatWinTpl');

   function ConfirmsWin(options) {
      var t = this;
      var opts = {
         content: "",
         sub: "",
         buttonText1: "确定",
         buttonText2: "取消",
         confirmFunc: function() { },
         cancelFunc: function() { }
      };
      for (var o in options) {
         opts[o] = options[o];
      };
      t.opts = opts;
      this.$elem = $(Util.formatTemplate(Tpl.win1, opts)).appendTo("body");
      this.win = new Win(this.$elem, true, "display", true);

      this.$elem.find(".js-confirm").click(function(evt) {
         t.opts.confirmFunc(evt);
      });
      this.$elem.find(".js-cancel").click(function() {
         t.opts.cancelFunc();
      });
   };
   ConfirmsWin.prototype.show = function() {
      this.win.show();
   };
   ConfirmsWin.prototype.hide = function() {
      this.win.hide();
   };

   function AlertWin(options) {
      var t = this;
      var opts = {
         content: "",
         sub: "",
         buttonText1: "确定",
         confirmFunc: function() { },
         showButton: false,
         notAutoHide: false
      };
      for (var o in options) {
         opts[o] = options[o];
      };
      t.opts = opts;
      this.$elem = $(Util.formatTemplate(Tpl.win2, opts)).appendTo("body");
      this.win = new Win(this.$elem, true, "display", true);
      this.$elem.find(".js-confirm").click(function(evt) {
         t.opts.confirmFunc(evt);
      });
   };

   AlertWin.prototype.show = function() {
      var t = this;
      t.win.show();
      if (!t.opts.showButton && !t.opts.notAutoHide) {
         setTimeout(function() {
            t.hide();
         }, 1000)
      }
   };
   AlertWin.prototype.hide = function() {
      this.win.hide();
   };

   function CheckCodeWin(options) {
      var t = this;
      var opts = {
         title: "输入验证码",
         url: "",
         confirmFunc: function(valinput, error) { }
      };
      for (var o in options) {
         opts[o] = options[o];
      };
      t.opts = opts;
      this.$elem = $(Util.formatTemplate(Tpl.win3, opts)).appendTo("body");
      this.win = new Win(this.$elem, true, "display", true);

      var layer = $("#winDialogLayer");

      var codeimg = layer.find(".js-codeurl"),
      freshnode = layer.find(".js-codefresh"),
      codeinput = layer.find(".js-codeinput"),
      codeerror = layer.find(".js-codeerror");

      freshnode.click(function() {
         codeimg.attr("src", opts.url + "&timestamp=" + new Date().getTime());
         codeerror.hide();
         return false;
      });

      if ($.browser.msie && parseInt($.browser.version, 10) < 7) {
         setTimeout(function() {
            freshnode.click();
         }, 100)
      };
      
      layer.find(".js-confirm").click(function() {
         t.opts.confirmFunc(codeinput, codeerror, codeimg);
      });

      codeinput.keydown(function(e) {
         if (e.keyCode == 13) {
            t.opts.confirmFunc(codeinput, codeerror, codeimg);
            return false;
         };
      });

   };
   CheckCodeWin.prototype.show = function() {
      this.win.show();
   };
   CheckCodeWin.prototype.hide = function() {
      this.win.hide();
   };


   function PopWin(options) {
      var t = this;
      var opts = {
         preRender: function() { return { content: '', title: ''} },
         postRender: function() { }
      };
      for (var o in options) {
         opts[o] = options[o];
      };
      t.opts = opts;
      var preData = t.opts.preRender();
      var tpl = t.opts.tpl || Tpl.win;
      t.$elem = $(Util.formatTemplate(tpl, preData)).appendTo("body").hide();
      t.opts.postRender.apply(null, [t.$elem]);
      this.win = new Win(t.$elem, true, "display", true);
   };
   PopWin.prototype.show = function() {
      this.win.show();
   };
   PopWin.prototype.hide = function() {
      this.win.hide();
      this.$elem && this.$elem.detach();
   };

   var instance = null;
   function getInstance(obj, opt) {
      if (instance !== null) {
         instance.hide();
      }
      instance = new obj(opt);
      return instance;
   }

   return {
      ConfirmsWin: ConfirmsWin,
      AlertWin: AlertWin,
      CheckCodeWin: CheckCodeWin,
      PopWin: function(opt) {
         return getInstance(PopWin, opt);
      }
   };

});