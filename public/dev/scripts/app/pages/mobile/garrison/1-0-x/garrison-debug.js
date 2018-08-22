/**
 * Created by gztimboy on 2016/4/12 0012.
 */

define(function(require, exports, module) {
    'use strict';
    var jQuery = require('jquery@1-11-x'),
        zepto = require('zepto@1-1-4');

    var b_domain = "m.live.netease.com";
    //b_domain = "223.252.196.214";
    var ua = navigator.userAgent.toLowerCase();
    var bolo = ua.match(/bolo/i) == "bolo";
    var ios = ua.match(/ios/i) == "ios";
    jQuery("body").css("height",(window.screen.availHeight-58));
    var us_a = "";
    var us_b = "";
    var us_c = "";
    var us_d = "";
    var r_time = "";
    var gar = new Object({
        subForm : function (){
            var name = jQuery("#name").val();
            var weibo = jQuery("#weibo").val();
            var phone = jQuery("#phone").val();
            //var photo1 = jQuery("#photo1").val();
            //var photo2 = jQuery("#photo2").val();
            var video1 = jQuery("#video1").val();
            var video2 = jQuery("#video2").val();
            if(name.length<1 || name=="请填写团队名称"){
                jQuery("#name").addClass("gar-input-content-input01-tips");
                jQuery("#name").val("请填写团队名称");
                return;
            }
            if(weibo.length<1 || name=="请填写微博账号"){
                jQuery("#weibo").addClass("gar-input-content-input01-tips");
                jQuery("#weibo").val("请填写微博账号");
                return;
            }
            if(phone.length<1 || name=="请填写联系方式"){
                jQuery("#phone").addClass("gar-input-content-input01-tips");
                jQuery("#phone").val("请填写联系方式");
                return;
            }
            var reg1 = new RegExp("^([-.+0-9]+)$");
            if(!reg1.test(phone)){
                jQuery("#phone").addClass("gar-input-content-input01-tips");
                jQuery("#phone").val("请填写联系方式");
                return;
            }
            if(video1.length<1 && video2.length<1){
                jQuery("#video1").addClass("gar-input-content-input02-tips");
                jQuery("#video1").val("请填写视频链接");
                return;
            }
            if(/.*[\u4e00-\u9fa5]+.*$/.test(video1)){
                jQuery("#video1").addClass("gar-input-content-input02-tips");
                jQuery("#video1").val("请填写视频链接");
                return;
            }

            if(video1=="请填写视频链接" && video2.length<1){
                jQuery("#video1").addClass("gar-input-content-input02-tips");
                jQuery("#video1").val("请填写视频链接");
                return;
            }
            if(video1=="") {
                video1=video2;
                video2="";
            }
            //alert("success");
            //alert("http://" + b_domain + "/bolo/api/user/enterApply?userId="+us_a+"&encryptToken="+us_b+"&timeStamp="+us_c+"&random="+us_d+"&name="+name+"&weibo="+weibo+"&phone="+phone+"&video1="+video1+"&video2="+video2);
            jQuery.ajax({
                url: "//" + b_domain + "/bolo/api/user/enterApply?userId="+us_a+"&encryptToken="+us_b+"&timeStamp="+us_c+"&random="+us_d+"&name="+name+"&weibo="+weibo+"&phone="+phone+"&video1="+video1+"&video2="+video2,
                dataType: "jsonp",
                //type: 'get',
                jsonp: "callback",
                jsonpCallback:"data",
                success: function(data){
                    //alert("success");
                    if(data.status==1) {
                        jQuery(".gar-area").hide();
                        jQuery(".gar-tips-text").html("进驻申请提交成功！你将在3个工作日之内收到回复！");
                        jQuery(".gar-tips").show();
                    } else {
                        jQuery(".gar-area").hide();
                        jQuery(".gar-tips-text").html(data.msg);
                        jQuery(".gar-tips").show();
                    }
                }
            });
        },
        login : function (){
            if (bolo) {
                if (ios) {
                    document.location = "bololive://js?cmd=login";
                } else {
                    html5Util.loginApp(true);
                }
            }

        },
        checkLogin : function (){
            //alert(ua);
            if (bolo) {
                //alert("bolo");
                if (ios) {
                    //alert("ios");
                    gar.callNativeInBOLOLive("getLoginInfo",function(result){
                    });
                } else {
                    if (html5Util.getLogininfo()) {
                        var tinfo = jQuery.parseJSON(html5Util.getLogininfo());
                        us_a = tinfo.userId;
                        us_b = tinfo.encryptToken;
                        us_c = tinfo.timeStamp;
                        us_d = tinfo.random;
                        //已登录
                        //alert("安卓已登录=us_a"+us_a+"=us_b="+us_b+"=us_c="+us_c+"=us_d="+us_d);
                    } else {
                        //未登录
                        //alert("安卓未登录");
                        gar.login();
                    }
                }
            }
        },
        callNativeInBOLOLive : function (cmd,callback){
            if(callback){
                var callbackName = "boloioslogin";
                window[callbackName] = function(result){
                    if(result.loggedIn==true) {
                        us_a = result.userId;
                        us_b = result.encryptedToken;
                        us_c = result.timestamp;
                        us_d = result.random;
                        //alert("ios已登录=us_a"+us_a+"=us_b="+us_b+"=us_c="+us_c+"=us_d="+us_d);
                    } else {
                        //alert("ios未登录");
                        gar.login();
                    }
                    delete window[callbackName];
                };
            }
            document.location.href = 'bololive://js?cmd=' + cmd + '&callback=' + callbackName;
        }
    });
    jQuery(".gar-but").click(function() {
        gar.subForm();
    });
    zepto('#name').bind("touchstart",function(event){
        if(jQuery(this).val()=="请填写团队名称") {
            jQuery("#name").removeClass("gar-input-content-input01-tips");
            jQuery("#name").val("");
        }
    });
    zepto('#weibo').bind("touchstart",function(event){
        if(jQuery(this).val()=="请填写微博账号") {
            jQuery("#weibo").removeClass("gar-input-content-input01-tips");
            jQuery("#weibo").val("");
        }
    });
    zepto('#phone').bind("touchstart",function(event){
        if(jQuery(this).val()=="请填写联系方式") {
            jQuery("#phone").removeClass("gar-input-content-input01-tips");
            jQuery("#phone").val("");
        }
    });
    zepto('#video1').bind("touchstart",function(event){
        if(jQuery(this).val()=="请填写视频链接") {
            jQuery("#video1").removeClass("gar-input-content-input02-tips");
            jQuery("#video1").val("");
        }
    });
    zepto('.gar-input-content-clear-1').bind("touchstart",function(event){
        zepto("#name").removeClass("gar-input-content-input01-tips");
        zepto("#name").val("");
        zepto("#name").focus();
    });
    zepto('.gar-input-content-clear-2').bind("touchstart",function(event){
        zepto("#weibo").removeClass("gar-input-content-input01-tips");
        zepto("#weibo").val("");
        zepto("#weibo").focus();
    });
    zepto('.gar-input-content-clear-3').bind("touchstart",function(event){
        zepto("#phone").removeClass("gar-input-content-input01-tips");
        zepto("#phone").val("");
        zepto("#phone").focus();
    });
    gar.checkLogin();

});