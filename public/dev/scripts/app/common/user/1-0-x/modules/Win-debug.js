/*
弹窗
*/

define(function(require, exports, module, undefined) {

   var $ = require('jquery@1-11-x'),
       ua = require('uadetector@1-0-x');
   var doc = document.documentElement, body = document.body;

   var slice = Array.prototype.slice;

   Function.prototype.bind = function() {
      if (!arguments.length) { return this; }
      var method = this, args = slice.call(arguments), object = args.shift();
      return function() {
         return method.apply(object, args.concat(slice.call(arguments)));
      };
   };

   var Shade = new (function() {
      // 常用对象
      var elem = document.createElement("div"), isShowed = false;
      elem.id = "shade";
      body.appendChild(elem);
      if (ua.isBrowser('ie') && parseInt(ua.browserVer(), 10) < 7) {
         elem.innerHTML = "<iframe style='position:absolute;width:100%;height:100%;_filter:alpha(opacity=0);opacity=0;border:1px solid #DDD;z-index:-1;top:100;left:0;'></iframe>";
      };
      /**
      * 显示遮盖层
      */
      this.show = function() {
         var t = this;
         t._setposEvent = null;
         if (!isShowed) {
            t.shadeResize(elem);
            if (ua.isBrowser('ie') && parseInt(ua.browserVer(), 10) < 7) {
               var setPos = function() {
                  t.IE6Position();
               }
               t.IE6Position();
               t._setposEvent && window.detachEvent("scroll", setPos);
               t._setposEvent = window.attachEvent("scroll", setPos);
            };
            elem.style.display = "block";
            isShowed = true;
         }

         t.shadeSizeFunc = function() { t.shadeResize(elem) };
         $(window).bind("resize", t.shadeSizeFunc);

      };
      this.shadeResize = function(elem) {
         elem.style.width = Math.max(doc.scrollWidth, doc.clientWidth) + "px";
         elem.style.height = Math.max(doc.scrollHeight, doc.clientHeight) + "px";
         elem.style.top = "0px";
      },
      this.IE6Position = function() { //计算IE6遮罩层的位置
         var bodyHeight = Math.max(doc.scrollHeight, doc.clientHeight);
         elem.style.width = Math.max(doc.scrollWidth, doc.clientWidth) + "px";
         elem.style.position = "absolute";
         elem.style.height = Math.min(bodyHeight, 3000) + "px";
         elem.style.top = Math.min(Math.max((bodyHeight - 3000), 0), Math.max((doc.scrollTop - 3000) + window.screen.availHeight, 0)) + "px";
      };
      /**
      * 隐藏遮盖层
      */
      this.hide = function() {
         var t = this;
         //if (isShowed) {
            elem.style.display = "none";
            isShowed = false;
            $(window).unbind("resize", t.shadeSizeFunc);
         //};
      };
   })();

   /// 拖动类
   /// @param {HtmlElement} 被拖动元素
   /// @param {HtmlElement,HtmlElementArray,HtmlCollection} 触发拖动的元素(一个或多个)
   var DragHandler = function(element, triggers) {
      // 更改构造函数
      this.constructor = arguments.callee;

      var isFixed = element.css("position").toLowerCase() === "fixed",
      // position是否为fixed
       origPos = {
          x: element.offset().left || 0 - (isFixed ? document.body.scrollLeft : 0),
          y: element.offset().top || 0 - (isFixed ? document.body.scrollTop : 0)
       },
       diffPos, onDragStart, onDrag, onDragStop;


      /// 拖动
      /// @param {Event} 事件对象


      function drag(e) {
         var newPos = {
            x: Math.max(0, Math.min(doc.scrollWidth - element.width(), e.pageX - diffPos.x)),
            y: Math.max(0, Math.min(doc.scrollHeight - element.height(), e.pageY - diffPos.y))
         };
         element.css("left", newPos.x + "px");
         element.css("top", newPos.y + "px");
         origPos = {
            x: newPos.x - (isFixed ? document.body.scrollLeft : 0),
            y: newPos.y - (isFixed ? document.body.scrollTop : 0)
         };

         onDrag && onDrag(element, this, newPos);

         e.cancelBubble = true;
      }

      /// 停止拖动


      function stopDragging() {
         if (element.releaseCapture) {
            element.releaseCapture();
         } else if (window.captureEvents) {
            window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
         }
         $(body).unbind("mousemove", drag);
         $(body).unbind("mouseup", stopDragging);

         onDragStop && onDragStop(element);
      }

      /// 开始拖动
      /// @param {Event} 事件对象


      function startDragging(e) {

         if (element.setCapture) {
            element.setCapture();
         } else if (window.captureEvents) {
            window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
         }
         diffPos = {
            x: e.pageX - element.offset().left,
            y: e.pageY - element.offset().top
         };
         $(body).mousemove(drag);
         $(body).mouseup(stopDragging);

         onDragStart && onDragStart(element, this);

         e.preventDefault();
      }

      /// 设置开始拖动时执行的事件
      /// @param {Function} 事件
      this.setOnDragStart = function(fn) {
         onDragStart = fn;
      };

      /// 设置拖动时执行的事件
      /// @param {Function} 事件
      this.setOnMove = function(fn) {
         onMove = fn;
      };

      /// 设置停止拖动时执行的事件
      /// @param {Function} fn
      this.setOnStopMove = function(fn) {
         onStopMove = fn;
      };

      /// 开始监听拖动相关事件
      this.init = function() {
         //$.event.addEvent(triggers, "mousedown", startDragging);
         triggers.mousedown(function(e) {
            startDragging(e);
         })
      };
   };

   /// 弹窗类2
   /// @param {HtmlElement} 弹窗的最外围元素
   /// @param {Boolean} 是否显示遮罩层
   /// @param {String} 显示类型display||visibility
   /// @param {Boolean} 是否关闭时删除节点
   /// @param {Boolean} 是否点击弹窗意外区域关闭
   var Win = function(wrapper, isShade, showType, isDeleteNode, isClickClose) {
      if (!arguments.length) {
         return;
      };
      var t = this;
      t.constructor = arguments.callee;

      t._wrapper = wrapper;
      t._showType = showType || "display";
      t._showTypeObject = {
         "display": {
            show: "block",
            hidden: "none"
         },
         "visibility": {
            show: "visible",
            hidden: "hidden"
         }
      };
      t._isShade = isShade || false;
      t._isDeleteNode = isDeleteNode || false;
      t._isShowed = wrapper.css(t._showType).toLowerCase() != t._showTypeObject[t._showType].hidden;
      t._isFixed = true;
      wrapper.css("position", "fixed");
      if (ua.isBrowser('ie') && parseInt(ua.browserVer(), 10) < 7) {
         t._isFixed = false;
         wrapper.css("position", "absolute");
      }
      //t._isFixed = wrapper.css("position").toLowerCase() == "fixed";


      t.isClickClose = isClickClose;

      (new DragHandler(wrapper, wrapper.find(".js-move"))).init(); // 启用拖动功能

      // 关闭窗口
      wrapper.delegate(".js-close",'click',function(e) {
         t.hide();
         return false;
      }).bind("drag", function(e) { e.cancelBubble = true; });
   };

   // 弹窗类原型(方法定义)
   Win.prototype = {

      /// 获取窗口宽度
      /// @return {Number} 窗口宽度
      getWidth: function() {
         return this._wrapper.width();
      },

      /// 获取窗口高度
      /// @return {Number} 窗口高度
      getHeight: function() {
         return this._wrapper.height();
      },

      /// 显示窗口
      /// @param {Number} 水平位置，默认居中
      /// @param {Number} 垂直位置，默认居中靠上
      /// @param {Number} 自动关闭迟延时间(秒)，0或省略时为不启用自动关闭
      show: function(x, y, closeDelay) {
         var t = this;
         if (!t._isShowed) {
            var wrapper = t._wrapper;

            if (ua.isBrowser('ie') && parseInt(ua.browserVer(), 10) < 7) { // 针对IE6做特别处理
               t._tempTop = doc.scrollTop;
               t._tempScroll = t._scroll;
               // $(window).bind("scroll", t._tempScroll);
            }

            wrapper.css(t._showType, t._showTypeObject[t._showType].show)

            t.resize(x, y, wrapper);

            t.onShow && t.onShow();

            t._isShowed = true;

            closeDelay && (t._hideTimer = setTimeout(function() {
               t.hide();
            }, closeDelay * 1000));




            $(document).keydown(t.keydownListionEvent.bind(t));
            if (t.isClickClose) {
               $(document).click(t.clickListionEvent.bind(t));
            }

            t.sizeFunc = function() { t.resize(x, y, wrapper); };

            $(window).bind("resize", t.sizeFunc);
         }
      },

      resize: function(x, y, wrapper) {
         var t = this;
         var left, top;
         if (t._isFixed) {
            left = null == x || isNaN(x) ? parseInt((doc.clientWidth - wrapper.width()) / 2) : x - doc.scrollLeft;
            top = null == y || isNaN(y) ? parseInt((doc.clientHeight - wrapper.height()) / 2.3) : y - (doc.scrollTop == 0 ? body.scrollTop : doc.scrollTop);
         } else {
            var scrolly = self.pageYOffset || document.documentElement && document.documentElement.scrollTop || document.body.scrollTop;
            left = null == x || isNaN(x) ? parseInt((doc.clientWidth - wrapper.width()) / 2 + doc.scrollLeft) : x;
            top = null == y || isNaN(y) ? parseInt((doc.clientHeight - wrapper.height()) / 2.3 + scrolly) : y;
         }
         wrapper.css("left", left + "px");
         wrapper.css("top", top + "px");


         t._isShade && Shade.show();
      },

      /// 隐藏窗口
      hide: function() {
         var t = this;
         if (t._isShowed) {
            //t._tempScroll && window.removeEvent("scroll", t._tempScroll);

            t.onHide && t.onHide();

            t._isShowed = false;

            if (t._hideTimer) {
               clearTimeout(t._hideTimer);
               t._hideTimer = null;
            }
            t._isShade && Shade.hide();
            $(document).unbind("keydown", t.keydownListionEvent.bind(t));
            if (t.isClickClose) {
               $(document).unbind("click", t.clickListionEvent.bind(t));
            };

            if (t._isDeleteNode) {
               t._wrapper.detach();
            } else {
               var hs = t._showTypeObject[t._showType].hidden;
               t._wrapper.css(t._showType, hs);
               t._wrapper.css({ "left": "0", "top": "0" });
            };

            $(window).unbind("resize", t.sizeFunc);
         }
      },

      /// 随屏滚动(for ie6 only)
      _scroll: function() {
         var t = this;
         t._wrapper.css("top", parseInt(t._wrapper.style.top) + doc.scrollTop - t._tempTop + "px");
         t._tempTop = doc.scrollTop;
      },

      keydownListionEvent: function(e) {
         var t = this;
         if (e.keyCode == 27) {
            t.hide();
         }
      },
      clickListionEvent: function(e) {
         var t = this, thisObj = e.target ? e.target : event.srcElement;
         do {
            if (thisObj.className == "dialog") return;
            if (thisObj.tagName.toUpperCase() == 'BODY' || thisObj.tagName.toUpperCase() == 'HTML') {
               t.hide();
               return;
            };
            thisObj = thisObj.parentNode;
         } while (thisObj.parentNode);
      }
   };

   return Win;

});

//需要拖动加js-move 需要关闭加js-close
//var win = new Win($("#testwin"), true)
//win.show();