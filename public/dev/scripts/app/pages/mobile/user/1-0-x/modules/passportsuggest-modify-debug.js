/**
 * Created by NetEase on 2016/3/31 0031.
 */
define(function(require, exports, module) {
    'use strict';
    var $ = require('zepto@1-1-4');
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var PassportSuggest = function(){
        var Config = {
            divID:"",
            user:"",
            pass:"",
            selectIndex:-1,
            liElement:"",
            liLen:"",
            keydown:"",
            currentBg:"#ffffff",
            currentColor:"#ffffff",
            normalBg:"#ffffff",
            normalColor:"#000000",
            userinput_c_color:"#000000",
            userinput_n_color:"#bbbbbb",
            suggest:["163.com", "126.com","vip.126.com", "yeah.net", "188.com", "vip.163.com", "gmail.com", "qq.com", "sina.com","hotmail.com"]
        }
        var logoshow = $(".user-logo");
        var lg3 = $(".user-login-other");
        var handle = function(){
            $(Config.user).on("click, focus",function(e){
                if(Config.user.val() == "网易邮箱/手机号"){
                    Config.user.val("");
                }
                $(Config.divID).css("display","block");
                $(Config.divID).css("left","0rem");
                $(Config.divID).css("bottom","-0.01rem");
                //logoshow.css("display","none");
                //lg3.css("display","none");
                Config.user.css("color",Config.userinput_c_color);
                suggestList();
                listEvent();
                e.stopPropagation();
            });
            $(Config.user).on("blur",function(e){
                if(Config.user.val().indexOf("@") == -1 || Config.user.val().indexOf("com") == -1){
                    Config.user.val(Config.user.val() + "@" + Config.suggest[0]);
                }
                $(document).on("click",function(e){
                    $(Config.divID).css("display","none");
                    //lg3.css("display","none");
                });
                PassportSuggest.index = PassportSuggest.input.indexOf(this);
                e.stopPropagation();
            });
            $(Config.user).on("keyup",function(e){
                suggestList();
                listEvent();
            });
            $(Config.user).tap(function(e){
                if(Config.user.val() == "网易邮箱/手机号"){
                    Config.user.val("");
                }
                suggestList();
                listEvent();
            });
        }
        var listEvent = function(){
            if(Config.liElement.length != 0){
                Config.liElement.on("click",function(e){
                    Config.selectIndex = Config.liElement.indexOf(this);
                    Config.user.val(Config.liElement[Config.selectIndex].innerHTML) ;
                    $(Config.divID).css("display","none");
                    if(bIsAndroid){
                        //lg3.css("display","block");
                    }
                    //logoshow.css("display","block");
                    //lg3.css("display","block");
                });
            }
        }
        var suggestList = function(){
            var len = Config.suggest.length,
                i = -1,
                arr = [],
                userName = Config.user.val().split("@")[0],
                userMailType = Config.user.val().split("@")[1];
            while(++ i < len){
                if(!userMailType || Config.suggest[i].indexOf(userMailType) == 0) {
                    arr.push("<li><span>" + userName + "@" + Config.suggest[i] + "</span></li>");
                }
            }
            if(arr.length == 0) {
                Config.selectIndex = -1;
                //logoshow.css("display","block");
                //lg3.css("display","block");
                $(Config.divID).css("display","none");
            } else{
                $(Config.divID + " ul")[0].innerHTML = arr.join('');
                $(Config.divID).css("display","block");
                if(bIsAndroid){
                    //lg3.css("display","none");
                }
                Config.liElement = $(Config.divID + " li span");
                Config.liLen = Config.liElement.length;
                if(Config.liLen > 1){
                    $(Config.divID).css("height",'2.88rem');
                }else{
                    $(Config.divID).css("height",'100%');
                }
                //logoshow.css("display","none");
                //lg3.css("display","none");
                if(Config.liElement[Config.selectIndex]){
                    $(Config.liElement[Config.selectIndex]).css("color",Config.currentColor);
                }
            }
        }
        var enterSelect = function(e){
            if(Config.liElement){
                e.cancelBubble = true;
                e.preventDefault();
                if(Config.liElement[Config.selectIndex]){
                    PassportSuggest.inputpass[PassportSuggest.index][0].value = Config.liElement[Config.selectIndex].innerHTML;
                }
                $(Config.divID).css("display","none");
                //logoshow.css("display","block");
                //lg3.css("display","block");
                //PassportSuggest.inputpass[PassportSuggest.index][1].focus();
            }
        }
        this.init = function(user,passport,dom){
            Config.user = user;
            Config.pass = passport;
            Config.divID = dom;
            Config.selectIndex = 0;
            PassportSuggest.input.push(user);
            PassportSuggest.inputpass.push(new Array(user,passport));
            handle();
        }
    }
    PassportSuggest.index = 0;//默认163邮箱
    PassportSuggest.inputpass = [];
    PassportSuggest.input = [];

	return PassportSuggest;
});
