define(function(require, exports, module) {

	var EventUtil = {
         addHandler: function(obj, type, handler) {
             if (obj.addEventListener) {
                 obj.addEventListener(type, handler, false);
             } else if (obj.attachEvent) {
                  obj.attachEvent("on" + type, handler);
              } else {
                 obj["on" + type] = handler;
            }
         },
        removeHandler: function(obj, type, handler) {
              if (obj.removeEventListener) {
                  obj.removeEventListener(type, handler, false);
              } else if (obj.detachEvent) {
                  obj.detachEvent("on" + type, handler);
              } else {
                  obj["on" + type] = null;
              }
          },
          getEvent: function(event) {
              return event ? event : window.event;
          },
          getTarget: function(event) {
              return event.target || event.srcElement;
          },
          preventDefault: function(event) {
              if (event.preventDefault) {
                  event.preventDefault();
              } else {
                  event.returnValue = false;
              }
          },
          stopPropagation: function(event) {
              if (event.stopPropagation) {
                  event.stopPropagation();
              } else {
                 event.cancelBubble = true;
             }
         },
         getWheelDelta: function(event) {
             if (event.wheelDelta) {
                 return event.wheelDelta;
            } else {
              return -event.detail * 40;
           }
       }
    };
    module.exports = EventUtil;
});