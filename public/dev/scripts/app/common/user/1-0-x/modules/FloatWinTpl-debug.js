define(function(require, exports, module) {

   return {
      win1: '<div class="dialogLayer popWidth"  id="winDialogLayer">\
               <div class="dialogLayer-hd">\
                  <a class="png24 btn-close js-close" href="javascript:;" title="关闭"></a>\
               </div>\
               <div class="dialogLayer-bd">\
   	            <h3><%=content%></h3>\
   	            <p class="cGray"><%=sub%></p>\
   	            <p><a class="orange-btnS js-confirm" href="javascript:;"><%=buttonText1%></a><a class="gray-btnS js-close js-cancel" href="javascript:;"><%=buttonText2%></a></p>\
               </div>\
            </div>',

      win2: '<div class="dialogLayer popWidth" id="winDialogLayer" style="_position:absolute">\
               <div class="dialogLayer-hd">\
                  <a class="png24 btn-close js-close" href="javascript:;" title="关闭"></a>\
               </div>\
               <div class="dialogLayer-bd js-bd">\
   	            <h3><%=content%></h3>\
   	            <p class="cGray"><%=sub%></p>\
   	            <%if(showButton){%>\
   	            <p><a class="orange-btnS js-close js-confirm" href="javascript:;"><%=buttonText1%></a></p>\
   	            <%}%>\
               </div>\
            </div>',
      win3: '<div class="dialogLayer popWidth" id="winDialogLayer" style="_position:absolute">\
               <div class="dialogLayer-hd">\
                  <a class="png24 btn-close js-close" href="javascript:;" title="关闭"></a>\
               </div>\
               <div class="dialogLayer-bd">\
   	            <h3><%=title%></h3>\
   	            <div>\
   	             <img src="<%=url%>" class="js-codeurl"/><a href="javascript:;" class="js-codefresh">点此刷新</a>\
   	             <div>\
   	             <input type="text" class="js-codeinput" style="width:100px;height:20px;border:1px solid #ccc; margin-bottom:10px;margin-top:10px;"/>\
   	             <span class="js-codeerror" style="color:#F44103;display:none;_position:relative;_top:-10px"> 验证码错误</span>\
   	             </div>\
   	            </div>\
   	            <p><a class="orange-btnS js-confirm" href="javascript:;">确定</a></p>\
               </div>\
            </div>',
      win: '<div class="dialogLayer">\
               <div class="dialogLayer-hd">\
                  <a class="png24 btn-close js-close" href="javascript:;" title="关闭"></a>\
               </div>\
               <div class="dialogLayer-bd clearfix js-bd">\
   	            <%=content%>\
               </div>\
            </div>'
   };



});