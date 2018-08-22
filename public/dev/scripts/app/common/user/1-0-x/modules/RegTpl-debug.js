define(function(require, exports, module) {
   var tpl = {
      reg:
         '<div class="login-area">\
            <h2>海量直播，线上娱乐</h2>\
            <p><a class="ntes-regist" href="http://reg.163.com/reg/reg.jsp?product=bobo&url=<%=url%>&loginurl=<%=url%>" data-keyfrom="navi.reg163">注册网易邮箱</a></p>\
            <p>已有帐号，<a class="cBlue js-need-login" href="javascript:;">登录</a></p>\
         </div>\
         <div class="no-account">\
         <p>或者用社交帐号登录</p>\
         <p><a class="qq-login no-account-login" href="http://reg.163.com/outerLogin/oauth2/connect.do?target=1&domains=bobo.com,163.com&product=bobo&url=<%=url%>&url2=<%=url%>" data-keyfrom="navi.regqq"><em class="png24 icon-qq"></em>使用腾讯QQ登录</a></p>\
         <p><a class="sina-login no-account-login" href="http://reg.163.com/outerLogin/oauth2/connect.do?target=3&domains=bobo.com,163.com&product=bobo&url=<%=url%>&url2=<%=url%>" data-keyfrom="navi.regsina"><em class="png24 icon-sina"></em>使用新浪微博登录</a></p>\
         </div>'
   }
   return tpl;
});