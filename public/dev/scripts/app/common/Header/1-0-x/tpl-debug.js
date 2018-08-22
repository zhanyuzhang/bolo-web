define(function(require, exports, module) {
   var tpl = {
      login: '<form action="https://reg.163.com/logins.jsp" method="POST" id="minLoginForm" name="loginform" target="_self">\
                <div class="login-area">\
                   <h2>海量直播，线上娱乐</h2>\
                   <p class="login-error-tip js-errorTip" style="display: none;"><em class="png24 icon-error"></em><span></span></p>\
                   <p class="login-item">\
                      <input class="login-mail" type="text" name="username" id="poplayer_username" autocomplete="off" placeholder="网易邮箱帐号">\
                      <label class="login-default-text js-defaultText">网易邮箱帐号</label>\
                   </p>\
                   <p class="login-item">\
                      <input class="login-pwd" type="password" name="password" id="poplayer_passport" placeholder="密码">\
                      <label class="login-default-text js-defaultText">密码</label>\
                   </p>\
                   <p class="login-check"><label class="fl"><input type="checkbox" value="1" name="savelogin" checked="checked">下次自动登录</label><a href="http://reg.163.com/RecoverPasswd1.shtml">忘记密码</a></p>\
                   <input type="hidden" name="url" value="<%=url%>"/>\
                   <input type="hidden" value="bobo" name="product"/>\
                   <input type="hidden" value="bobo.com,163.com" name="domains"/>\
                   <input type="hidden" name="type" value="1"/>\
                   <p><button class="login-btn" type="submit" href="javascript:;">登录</button></p>\
                </div>\
              </form>\
              <div class="no-account">\
                 <p>还没有账号？</p>\
                 <p><a class="regist-ntes no-account-login" href="http://reg.163.com/reg/reg.jsp?product=bobo&url=<%=url%>&loginurl=<%=url%>" data-keyfrom="navi.login163"><em class="png24 icon-ntes"></em>注册网易邮箱</a></p>\
                 <p>或者用社交账号登录</p>\
                 <p><a class="qq-login no-account-login" href="http://reg.163.com/outerLogin/oauth2/connect.do?target=1&domains=bobo.com,163.com&product=bobo&url=<%=url%>&url2=<%=url%>" data-keyfrom="navi.loginqq"><em class="png24 icon-qq"></em>使用腾讯QQ登录</a></p>\
                 <p><a class="sina-login no-account-login" href="http://reg.163.com/outerLogin/oauth2/connect.do?target=3&domains=bobo.com,163.com&product=bobo&url=<%=url%>&url2=<%=url%>" data-keyfrom="navi.loginsina"><em class="png24 icon-sina"></em>使用新浪微博登录</a></p>\
              </div>',
      improUserInfo: '<form action="/user/userEdit?action=edit" method="post" id="userEdit" target="_self">\
                     <div class="loginLayer-info">\
                        <h2>欢迎来到BoBo!完善个人信息，即可开始精彩bo生活</h2>\
                        <p><label for="nickName"><em></em>昵称：</label>\
                        <input name="nick" class="login-nickname" id="nickName" type="text" value="<%=nick%>">\
                        <input type="hidden"  name="avatar" value="http://img2.cache.netease.com/bobo/image/avatar150.png"/>\
                        <span class="nickname-error-tip" id="nicknameTip" style="display:none;"><em class="png24 icon-error"></em>昵称长度要在2-10个字之间</span>\
                        <span class="nickname-error-tip" id="nicknameErrorTip" style="display:none;"><em class="png24 icon-error"></em>用户名重复</span>\
                        <span class="nickname-error-tip" id="nicknameIllegalTip" style="display:none;"><em class="png24 icon-error"></em>涉及敏感词语，请重新编辑</span>\
                        </p>\
                        <p>\
                           <label><em></em>性别：</label><span class="user-sex"><input type="radio" class="js-gender" name="sex" checked="checked" value="1"> 男</span><span class="user-sex"><input class="js-gender" name="sex" type="radio" value="2">女</span>\
                        </p>\
                        <p>\
                        <label><em></em>生日：</label>\
                        <select class="login-select-year" name="userYear" id="year">\
                        </select>\
                        <input type="hidden" value="2014" id="yearhd"/>\
                        <select class="login-select-date" name="userMonth" id="month">\
                        </select>\
                        <input type="hidden" value="01" id="monthhd"/>\
                        <select class="login-select-date" name="userDay" id="day">\
                        </select>\
                        <input type="hidden" value="01" id="dayhd"/>\
                     </p>\
                     <p>\
                        <label><em></em>所在地：</label>\
                        <select class="login-select-place" name="pid" id="province">\
                        </select>\
                        <input type="hidden" value="1" id="provincehd"/>\
                        <select class="login-select-place" name="cid" id="city">\
                        </select>\
                        <input type="hidden" value="1" id="cityhd"/>\
                        <select class="login-select-city" name="aid" id="county">\
                        </select>\
                        <input type="hidden" value="1" id="countyhd"/>\
                     </p>\
                     <input type="hidden" name="url" value="<%=url%>"/>\
                     <p><input type="submit" class="orange-btn loginLayer-info-confirm" href="javascript:;" value="确定"/></p>\
                     </div>\
                     </form>'
   }
   return tpl;
});