/**
 * Created by gztimboy on 2016/4/12 0012.
 */


define(function(require, exports, module) {
    'use strict';
    var jQuery = require('jquery@1-11-x'),
        uadetector = require('uadetector@1-0-x');
    if(uadetector.isDevice("mobile")==false) {
        document.location = "http://www.bobo.com/special/bolodownload/";
    }
    var ua = navigator.userAgent.toLowerCase();
    var dmRadom;
    var xz = new Object({
        init_screen : function (){
            var _top = 0;
            jQuery(".xz-dm").find("div").show().each(function () {
                var _left = jQuery(window).width() - jQuery(this).width()+240;
                var _height = jQuery(window).height()+100;
                _top = _top + 33;
                if (_top >= _height - 120) {
                    _top = 40;
                }
                jQuery(this).css({left: _left, top: _top});
                var time = 16000;
                if (jQuery(this).index() % 2 == 0) {
                    time = 12000;
                }
                if (jQuery(this).index() % 3 == 0) {
                    time = 25000;
                }
                if (jQuery(this).index() % 4 == 0) {
                    time = 19000;
                }
                if (jQuery(this).index() % 5 == 0) {
                    time = 31000;
                }
                if (jQuery(this).index() % 6 == 0) {
                    time = 16000;
                }
                if (jQuery(this).index() % 7 == 0) {
                    time = 20000;
                }
                if (jQuery(this).index() % 8 == 0) {
                    time = 17000;
                }
                if (jQuery(this).index() % 9 == 0) {
                    time = 18000;
                }
                if (jQuery(this).index() % 10 == 0) {
                    time = 23000;
                }
                if (jQuery(this).index() % 11 == 0) {
                    time = 14000;
                }
                if (jQuery(this).index() % 12 == 0) {
                    time = 18500;
                }
                jQuery(this).animate({left: "-" + _left + "px"}, time, function () {
                });
            });
        },
        startRequest : function (){
            var dmText
            var dmText2
            dmText="<div>我想打他，有一起的吗？</div>";
            dmText+="<div>太萌噜66666</div>";
            dmText+="<div>有点像鸡涌</div>";
            dmText+="<div>怎么了我觉得挺好的呀</div>";
            dmText+="<div>23333333</div>";
            dmText+="<div>前方高能预警</div>";
            dmText+="<div>卧槽！绿茶婊！</div>";
            dmText+="<div>2223333</div>";
            dmText+="<div>收下我的膝盖</div>";
            dmText+="<div>6666666666</div>";
            dmText+="<div>前面说绿茶婊的等等我</div>";
            dmText+="<div>好妖！</div>";
            dmText2="<div>前面说鸡涌的我保证不打死你</div>";
            dmText2+="<div>我只想说，孙悟空在哪里？？？</div>";
            dmText2+="<div>吃点河豚精囊就滋润了</div>";
            dmText2+="<div>妖孽啊！！</div>";
            dmText2+="<div>这是一场战争！</div>";
            dmText2+="<div>这剧这么污真的大丈夫吗！</div>";
            dmText2+="<div>自取其辱</div>";
            dmText2+="<div>三观竟毁！！！</div>";
            dmText2+="<div>截图成功！</div>";
            dmText2+="<div>为啥只有我觉得严肃</div>";
            dmText2+="<div>吓得我瑟瑟发抖</div>";
            dmText2+="<div>哈哈哈哈哈哈哈~</div>";
            if(dmRadom==1) {
                jQuery(".xz-dm").append(dmText2);
                dmRadom=0;
            } else {
                jQuery(".xz-dm").append(dmText);
                dmRadom=1;
            }
            xz.init_screen();
        },
        wxdlTips : function (closeDivName){
            jQuery("#popmask").show();
            jQuery('.xz-tips').show();
        }
    });
    xz.startRequest();
    setInterval(function() {
        xz.startRequest();
    }, 10000);
    jQuery(".xz-dl").click(function() {

	    if(uadetector.isOS('android')) location.href = bolo_android_url;
	    else if(ua.match(/MicroMessenger/i)) xz.wxdlTips();
	    else alert('菠萝菌正在玩命开发IOS版本');

        //if (ua.match(/MicroMessenger/i)) {
        //    xz.wxdlTips();
        //} else {
        //    if (ua.match(/android/i)) {
        //        //alert("android下载");
        //        //alert(bolo_android_url);
        //        document.location = bolo_android_url;
        //        //document.location = "http://file.ws.126.net/tie/bolo/android/release/Bolo_Bolo0OO1_online_v1.0.apk";
        //    } else {
        //        //document.location = "http://file.m.163.com/app/bobo_android/vshow-BoBo" + qd + "-release.apk";
        //    }
        //}
    });
    jQuery("#popmask, .xz-tips").click(function() {
        jQuery("#popmask").hide();
        jQuery('.xz-tips').hide();
    });
});