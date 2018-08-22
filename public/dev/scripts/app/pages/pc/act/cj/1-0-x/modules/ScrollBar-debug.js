define(function(require, exports, module) {
	  var EventUtil = require('./EventUtil');
	  function ScrollBar(tip, scrollBar, section, article) {
          this.oTip = document.getElementById(tip);
          this.oScrollBar = document.getElementById(scrollBar);
          this.oSection = document.getElementById(section);
          this.oArticle = document.getElementById(article);
          var _this = this;
          this.init();
          this.oTip.onmousedown = function(ev) {
              _this.Down(ev);
              return false;
          };
         //给需要加滚动事件的元素加滚动事件
         EventUtil.addHandler(this.oSection, 'mousewheel', function(ev) {
             _this.onMouseWheel(ev);
         }); //ie,chrome
         EventUtil.addHandler(this.oSection, 'DOMMouseScroll', function(ev) {
             _this.onMouseWheel(ev);
          }); //ff
         EventUtil.addHandler(this.oScrollBar, 'mousewheel', function(ev) {
             _this.onMouseWheel(ev);
          }); //ie,chrome
         EventUtil.addHandler(this.oScrollBar, 'DOMMouseScroll', function(ev) {
              _this.onMouseWheel(ev);
          }); //ff
      };
      //初始化滚动条，内容不够时隐藏滚动条，滚动条按钮长度由内容长度决定
      ScrollBar.prototype.init = function() {
        
          if(this.oSection.offsetHeight >= this.oArticle.offsetHeight){
              this.oScrollBar.style.display = 'none';
          }else{
              //this.oTip.style.height = 100 * this.oScrollBar.offsetHeight / (this.oArticle.offsetHeight - this.oSection.offsetHeight) + 'px';
              this.oTip.style.height = this.oScrollBar.offsetHeight - (this.oArticle.offsetHeight - this.oSection.offsetHeight) + 'px';
              
              //document.title = this.oTip.style.height;
          }
          //各浏览器行高，字体大小，字体类型，不一致，要想初始化滚动条一致，先统一样式
       };
      ScrollBar.prototype.Down = function(ev) {
          var oEvent = EventUtil.getEvent(ev);
          var _this = this;
          this.maxH = this.oScrollBar.offsetHeight - this.oTip.offsetHeight;
          this.disY = oEvent.clientY - this.oTip.offsetTop;
          document.onmousemove = function(ev) {
            _this.fnMove(ev);
             return false;
         }
         document.onmouseup = function(ev) {
             _this.Up(ev);
         }
       };
      ScrollBar.prototype.fnMove = function(ev) {
         var oEvent = EventUtil.getEvent(ev);
         var t = oEvent.clientY - this.disY;
         this.Move(t);
       };
      ScrollBar.prototype.onMouseWheel = function(ev) {
        var oEvent = EventUtil.getEvent(ev);
        this.maxH = this.oScrollBar.offsetHeight - this.oTip.offsetHeight;
        this.disY = oEvent.clientY - this.oTip.offsetTop;
        if (EventUtil.getWheelDelta(oEvent) > 0) {
            var t = this.oTip.offsetTop - 10;
            this.Move(t);
        }else {
             var t = this.oTip.offsetTop + 10;
             this.Move(t);
        }
        EventUtil.preventDefault(oEvent);
       };
      ScrollBar.prototype.Move = function(t) {
         if (t < 0) {
             t = 0;
         } else if (t > this.maxH) {
             t = this.maxH;
         }
         this.oTip.style.top = t + 'px';
         this.contentH = this.oArticle.offsetHeight - this.oSection.offsetHeight;
         this.oArticle.style.top = -this.contentH * this.oTip.offsetTop / this.maxH + 'px';
      };
      ScrollBar.prototype.Up = function(ev) {
         document.onmousemove = document.onmouseup = null;
      };
     module.exports = ScrollBar;
});