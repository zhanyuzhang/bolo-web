/// 用户名联想
define(function(require, exports, module) {

   var $ = require('jquery@1-11-x');
   var Util = require('/common/user/1-1-x/modules/Util'),
       ua = require('uadetector@1-0-x');

   var count = 0, initobj=null;

   function getXY(elem) {
      var sumTop = 0, sumLeft = 0;
      while (elem != document.body && elem != null) {
         sumLeft += elem.offsetLeft;
         sumTop += elem.offsetTop;
         elem = elem.offsetParent;
      }
      return {
         x: sumLeft,
         y: sumTop
      };
   };

   function resizeFunc() {
      var t = this;
      var ds = document.getElementById("passportusernamelist"+count);
      var username_x = getXY(t.usernameInputElement).x;
      var username_y = getXY(t.usernameInputElement).y;
      ds.style.left = username_x + "px";
      ds.style.top = (username_y + t.usernameInputElement.offsetHeight) + "px";
   };

   function getPosition() {
      var t = this;
      var ds = $("#passportusernamelist"+count);
      var username_x = $(t.usernameInputElement).position().left;
      var username_y = $(t.usernameInputElement).position().top;
      ds.css({'left': username_x});
      ds.css({'top': username_y + $(t.usernameInputElement).outerHeight(true)});
   }


   function LoginSuggest(obj, runFuc, toscroll) {
      if (!arguments.length) {
         return;
      }
      if (!initobj || obj.id!==initobj.id) {
         count++;
         initobj=obj;
      }
      var t = this;
      t.constructor = arguments.callee;

      t.toscroll = false;
      if (toscroll) {
         t.toscroll = true;
      };
      t.usernameInputElement = false;
      t.usernameInputElementX = false;
      t.usernameInputElementY = false;
      t.usernameInputHeight = false;
      t.usernameListElement = false;
      t._initWidth = 0;
      t._runFuc = runFuc;
      t.currentSelectIndex = -1;
      t.domainSelectElmentString = "<div style=\"padding:0px;\"><table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\"><tbody><tr><td class=\"title\" style=\"title\" >请选择或继续输入...</td></tr><tr><td><td /></tr></tbody></table></div><div style=\"display: none;\"></div><div id=\"passport_111\"></div>";
      t.domainSelectElement = false;
      t.domainArray = ["163.com", "126.com", "yeah.net", "qq.com", "vip.163.com", "vip.126.com", "188.com", "gmail.com", "sina.com", "hotmail.com"];
      t.helpDivString = "<div style=\"width:100%;\" id=\"passport_helper_div\"></div>";
      t.bind(obj);
   };

   LoginSuggest.prototype = {
      bind: function(obj) {
         var t = this;
         $(obj).unbind();
         t.usernameInputElement = obj;
         var xy = getXY(t.usernameInputElement);
         t.usernameInputElementX = xy.x;
         t.usernameInputElementY = xy.y;
         t.handle();
         $(t.usernameInputElement).focus(function() {
            t._initWidth = (t.usernameInputElement.offsetWidth - 2);
            t.domainSelectElement.style.width = (t.usernameInputElement.offsetWidth - 2) + "px";
         });
      },
      handle: function() {
         var t = this;
         var suggestId = "passportusernamelist"+count;
         if (!document.getElementById(suggestId)) {
            var divElement = document.createElement("DIV");
            divElement.id = suggestId;
            divElement.className = "domainSelector";
            divElement.style.display = "none";
            if(ua.isBrowser('ie') && parseInt(ua.browserVer(), 10) < 7 || t.toscroll) {
               divElement.style.position = "absolute";
               $(t.usernameInputElement).parent().css({'position': 'relative'}).append($(divElement));
            } else {
               divElement.style.position = "fixed";
               document.body.appendChild(divElement);
            }

            divElement.innerHTML = t.domainSelectElmentString;
         };

         t.domainSelectElement = document.getElementById(suggestId);

         t.usernameListElement = t.domainSelectElement.firstChild.firstChild.rows[1].firstChild;
         t.currentSelectIndex = 0;
         t.usernameInputElement.onblur = function() {
            t.doSelect.call(t);
         };
         try {
            this.usernameInputElement.addEventListener("keydown", t.keydownProc.bind(t), false);
            this.usernameInputElement.addEventListener("keyup", t.keyupProc.bind(t), false);
         } catch (e) {
            try {
               this.usernameInputElement.attachEvent("onkeydown", t.keydownProc.bind(t));
               this.usernameInputElement.attachEvent("onkeyup", t.keyupProc.bind(t));
            }
            catch (e) {
            }
         }
         if (ua.isBrowser('ie') && parseInt(ua.browserVer(), 10) < 7 || t.toscroll) {
            getPosition.call(t);
            return;
         }

         //----------------解决用户名自动提示div在窗口大小发生变化时的位置偏移的bug.-----------
         resizeFunc.call(t);
         if (ua.isBrowser('ie')) {
            window.attachEvent("onresize", resizeFunc.bind(t));
            // 针对IE6做特别处理
            if (parseInt(ua.browserVer(), 10) < 7 && t.noscroll) {
               t.doc = document.documentElement;
               t._tempTop = t.doc.scrollTop;
               t._tempScroll = t._scroll.bind(t);
               window.attachEvent("scroll", t._tempScroll);
            }
         } else {
            window.onresize = resizeFunc.bind(t);
         };

         //----------------解决用户名自动提示div在窗口大小发生变化时的位置偏移的bug.-----------
      },
      preventEvent: function(event) {
         event.cancelBubble = true;
         event.returnValue = false;
         if (event.preventDefault) {
            event.preventDefault();
         };
         if (event.stopPropagation) {
            event.stopPropagation();
         };
      },
      /// 随屏滚动(for ie6 only)
      _scroll: function() {
         var t = this;
         t.domainSelectElement.style.top = parseInt(t.domainSelectElement.style.top) + t.doc.scrollTop - t._tempTop;
         t._tempTop = t.doc.scrollTop;
      },
      keyupProc: function(event) {
         var t = this;
         var keyCode = event.keyCode;
         if (keyCode == 13) {
            t.doSelect();
         } else if (keyCode == 38 || keyCode == 40) {
             t.clearFocus();
             if (keyCode == 38) {
                t.upSelectIndex();
             } else {
                t.downSelectIndex();
             }
             t.setFocus();
          } else {
             t.changeUsernameSelect();
          }
      },
      keydownProc: function(event) {
         var t = this;
         var keyCode = event.keyCode;
         if (keyCode == 13) {
            if ($.trim(t.usernameInputElement.value) != "")
            t.preventEvent(event);
         } else if (keyCode == 38 || keyCode == 40) {
            t.preventEvent(event);
         }
      },
      clearFocus: function(index) {
         var t = this;

         var index = t.currentSelectIndex;
         try {
            var x = t.findTdElement(index);
            x.style.backgroundColor = "white";
         } catch (e) {
         }
      },
      findTdElement: function(index) {
         var t = this;

         try {
            var x = t.usernameListElement.firstChild.rows;
            for (var i = 0; i < x.length; ++i) {
               if (x[i].firstChild.idx == index) {
                  return x[i].firstChild;
               }
            }
         }
         catch (e) {
         }
         return false;
      },
      upSelectIndex: function() {
         var t = this;

         var index = t.currentSelectIndex;
         if (t.usernameListElement.firstChild == null) {
            return;
         }
         var x = t.usernameListElement.firstChild.rows;
         var i;
         for (i = 0; i < x.length; ++i) {
            if (x[i].firstChild.idx == index) {
               break;
            }
         };
         if (i == 0) {
            t.currentSelectIndex = (x.length - 1);
         } else {
            t.currentSelectIndex = x[i - 1].firstChild.idx;
         }
      },
      downSelectIndex: function() {
         var t = this;

         var index = t.currentSelectIndex;
         if (t.usernameListElement.firstChild == null) {
            return;
         }
         var x = t.usernameListElement.firstChild.rows;
         var i = 0;
         for (; i < x.length; ++i) {
            if (x[i].firstChild.idx == index) {
               break;
            }
         }
         if (i >= x.length - 1) {
            t.currentSelectIndex = x[0].firstChild.idx;
         } else {
            t.currentSelectIndex = x[i + 1].firstChild.idx;
         }
      },
      setFocus: function() {
         var t = this;
         var index = t.currentSelectIndex;
         try {
            var x = t.findTdElement(index);
            x.style.backgroundColor = "#D5F1FF";
         } catch (e) {
         }
      },
      changeUsernameSelect: function() {
         var t = this;
         var userInput = Util.encodeSpecialHtmlChar(this.usernameInputElement.value);
         if ($.trim(userInput) == "") {
            this.domainSelectElement.style.display = "none";
         } else {
            var username = "", hostname = "";
            var pos;
            if ((pos = userInput.indexOf("@")) < 0) {
               username = userInput;
               hostname = "";
            } else {
               username = userInput.substr(0, pos);
               hostname = userInput.substr(pos + 1, userInput.length);
            }
            var countUserName = Util.countChars(username, 28);
            var usernames = [], countUserNames = [];
            if (hostname == "") {
               for (var i = 0; i < this.domainArray.length; ++i) {
                  usernames.push(username + "@" + this.domainArray[i]);
                  countUserNames.push(countUserName + "@" + this.domainArray[i]);
               }
            } else {
               for (var i = 0; i < this.domainArray.length; ++i) {
                  if (this.domainArray[i].indexOf(hostname) == 0) {
                     usernames.push(username + "@" + this.domainArray[i]);
                     countUserNames.push(countUserName + "@" + this.domainArray[i]);
                  }
               }
            }
            if (usernames.length > 0) {
               if (!t.toscroll) resizeFunc.call(t);

               t.domainSelectElement.style.zIndex = "10000";
               t.domainSelectElement.style.backgroundColor = "white";
               t.domainSelectElement.style.display = "block";
               var myTable = document.createElement("TABLE");
               myTable.cellSpacing = 0;
               myTable.cellPadding = 3;
               var tbody = document.createElement("TBODY");
               myTable.appendChild(tbody);
               for (var i = 0; i < usernames.length; ++i) {
                  var tr = document.createElement("TR");
                  var td = document.createElement("TD");
                  td.nowrap = "true";
                  td.align = "left";
                  td.setAttribute('userName', usernames[i]);
                  td.innerHTML = countUserNames[i];
                  td.idx = i;
                  td.onmouseover = function() {
                     t.clearFocus();
                     t.currentSelectIndex = this.idx;
                     t.setFocus();
                     this.style.cursor = "hand";
                  };
                  td.onmouseout = function() {
                  };
                  td.onclick = function() {
                     t.doSelect();
                  };
                  tr.appendChild(td);
                  tbody.appendChild(tr);
               }
               t.usernameListElement.innerHTML = "";
               t.usernameListElement.appendChild(myTable);

               //取提示的最大用户名长度。
               var maxlength = 0;
               for (var j = 0; j < usernames.length; ++j) {
                  if (usernames[j].length > maxlength) {
                     maxlength = usernames[j].length;
                  }
               };
               maxlength = maxlength * 7.4;
               if (maxlength < t._initWidth) {
                  maxlength = t._initWidth;
               }
               if(maxlength > 306) maxlength = 306;
               //maxlength = t._initWidth;
               myTable.style.width = maxlength + "px";
               this.domainSelectElement.style.width = myTable.style.width;
               this.setFocus();
               $(document).keydown(t.keydownListionEvent.bind(t));
            } else {
               this.domainSelectElement.style.display = "none";
               this.currentSelectIndex = -1;
            }
            //修改div的宽度
         }
      },
      doSelect: function() {
         var t = this;

         t.domainSelectElement.style.display = "none";
         if ($.trim(t.usernameInputElement.value) == "") {
            return;
         };
         var currentUsernameTd = t.findTdElement(t.currentSelectIndex);
         if (currentUsernameTd) {
            t.usernameInputElement.value = Util.decodeSpecialHtmlChar(currentUsernameTd.getAttribute('userName'));
         };
         t._runFuc();
      },

      keydownListionEvent: function(e) {
         var t = this;
         if (e.keyCode == 27) {
            this.domainSelectElement.style.display = "none";
            $(document).unbind("keydown", t.keydownListionEvent.bind(t));
         }
      }
   };

   return LoginSuggest;

});