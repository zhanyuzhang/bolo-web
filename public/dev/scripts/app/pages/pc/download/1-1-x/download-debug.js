/**
 * Created by gztimboy on 2016/8/23 0023.
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery@1-11-x'),
        jQuery = require('jquery@1-11-x'),
        Tmpl = require('tmpl@2-1-x'),
	    Stat = require('/common/Stat@1-0-x'),
        uadetector = require('uadetector@1-0-x');

    if(uadetector.isDevice('mobile')) location.href = '/m/download';

    var dmVar;
    var defaultNum = 0;
    //var videoList = [{"videoUrl":"http://bobolive.nosdn.127.net/supergirl_1455547226583_33871145.mp4","title":"有点像鸡涌","img":"http://img3.cache.netease.com/news/2016/8/24/201608241522435715e.png","url":"http://www.bobo.com/11111/","commentNum":"45454","list":[{"nick":"bolo用户111","userImg":"http://img3.cache.netease.com/news/2016/8/24/201608241522435715e.png","text":"评论内容哈哈哈哈哈哈哈哈哈哈","digNum":"64646"},{"nick":"bolo用户111","userImg":"http://img3.cache.netease.com/news/2016/8/24/201608241522435715e.png","text":"评论内容哈哈哈哈哈哈哈哈哈哈","digNum":"64646"},{"nick":"bolo用户111","userImg":"http://img3.cache.netease.com/news/2016/8/24/201608241522435715e.png","text":"评论内容哈哈哈哈哈哈哈哈哈哈","digNum":"64646"}],"tmTitle":"<div>1-1我想打他，有一起的吗？</div><div>太萌噜66666</div><div>有点像鸡涌</div><div>怎么了我觉得挺好的呀</div><div>23333333</div><div>前方高能预警</div><div>卧槽！绿茶婊！</div><div>2223333</div><div>收下我的膝盖</div><div>6666666666</div>","tmTitle2":"<div>1-2我想打他，有一起的吗？</div><div>太萌噜66666</div><div>有点像鸡涌</div><div>怎么了我觉得挺好的呀</div><div>23333333</div><div>前方高能预警</div><div>卧槽！绿茶婊！</div><div>2223333</div><div>收下我的膝盖</div>"},{"videoUrl":"http://bobolive.nosdn.127.net/supergirl_1457493567248_86526166.mp4","title":"有点像鸡涌","img":"http://img3.cache.netease.com/news/2016/8/24/201608241522435715e.png","url":"http://www.bobo.com/11111/","commentNum":"45454","list":[{"nick":"bolo用户111","userImg":"http://img3.cache.netease.com/news/2016/8/24/201608241522435715e.png","text":"评论内容哈哈哈哈哈哈哈哈哈哈","digNum":"64646"},{"nick":"bolo用户111","userImg":"http://img3.cache.netease.com/news/2016/8/24/201608241522435715e.png","text":"评论内容哈哈哈哈哈哈哈哈哈哈","digNum":"64646"},{"nick":"bolo用户111","userImg":"http://img3.cache.netease.com/news/2016/8/24/201608241522435715e.png","text":"评论内容哈哈哈哈哈哈哈哈哈哈","digNum":"64646"}],"tmTitle":"<div>2-1我想打他，有一起的吗？</div><div>太萌噜66666</div><div>有点像鸡涌</div><div>怎么了我觉得挺好的呀</div><div>23333333</div><div>前方高能预警</div><div>卧槽！绿茶婊！</div><div>2223333</div><div>收下我的膝盖</div><div>6666666666</div><div>前面说绿茶婊的等等我</div><div>好妖！</div>","tmTitle2":"<div>2-2我想打他，有一起的吗？</div><div>太萌噜66666</div><div>有点像鸡涌</div><div>怎么了我觉得挺好的呀</div><div>23333333</div><div>前方高能预警</div><div>卧槽！绿茶婊！</div><div>2223333</div><div>收下我的膝盖</div><div>6666666666</div><div>前面说绿茶婊的等等我</div><div>好妖！</div>"},{"videoUrl":"http://bobolive.nosdn.127.net/supergirl_1455547226583_33871145.mp4","title":"有点像鸡涌","img":"http://img3.cache.netease.com/news/2016/8/24/201608241522435715e.png","url":"http://www.bobo.com/11111/","commentNum":"45454","list":[{"nick":"bolo用户111","userImg":"http://img3.cache.netease.com/news/2016/8/24/201608241522435715e.png","text":"评论内容哈哈哈哈哈哈哈哈哈哈","digNum":"64646"},{"nick":"bolo用户111","userImg":"http://img3.cache.netease.com/news/2016/8/24/201608241522435715e.png","text":"评论内容哈哈哈哈哈哈哈哈哈哈","digNum":"64646"},{"nick":"bolo用户111","userImg":"http://img3.cache.netease.com/news/2016/8/24/201608241522435715e.png","text":"评论内容哈哈哈哈哈哈哈哈哈哈","digNum":"64646"}],"tmTitle":"<div>3-1我想打他，有一起的吗？</div><div>太萌噜66666</div><div>有点像鸡涌</div><div>怎么了我觉得挺好的呀</div><div>23333333</div><div>前方高能预警</div><div>卧槽！绿茶婊！</div><div>2223333</div><div>收下我的膝盖</div><div>6666666666</div><div>前面说绿茶婊的等等我</div><div>好妖！</div>","tmTitle2":"<div>3-2我想打他，有一起的吗？</div><div>太萌噜66666</div><div>有点像鸡涌</div><div>怎么了我觉得挺好的呀</div><div>23333333</div><div>前方高能预警</div><div>卧槽！绿茶婊！</div><div>2223333</div><div>收下我的膝盖</div><div>6666666666</div><div>前面说绿茶婊的等等我</div><div>好妖！</div>"},{"videoUrl":"http://bobolive.nosdn.127.net/supergirl_1457493567248_86526166.mp4","title":"有点像鸡涌","img":"http://img3.cache.netease.com/news/2016/8/24/201608241522435715e.png","url":"http://www.bobo.com/11111/","commentNum":"45454","list":[{"nick":"bolo用户111","userImg":"http://img3.cache.netease.com/news/2016/8/24/201608241522435715e.png","text":"评论内容哈哈哈哈哈哈哈哈哈哈","digNum":"64646"},{"nick":"bolo用户111","userImg":"http://img3.cache.netease.com/news/2016/8/24/201608241522435715e.png","text":"评论内容哈哈哈哈哈哈哈哈哈哈","digNum":"64646"},{"nick":"bolo用户111","userImg":"http://img3.cache.netease.com/news/2016/8/24/201608241522435715e.png","text":"评论内容哈哈哈哈哈哈哈哈哈哈","digNum":"64646"}],"tmTitle":"<div>4-1我想打他，有一起的吗？</div><div>太萌噜66666</div><div>有点像鸡涌</div><div>怎么了我觉得挺好的呀</div><div>23333333</div><div>前方高能预警</div><div>卧槽！绿茶婊！</div><div>2223333</div><div>收下我的膝盖</div><div>6666666666</div><div>前面说绿茶婊的等等我</div><div>好妖！</div>","tmTitle2":"<div>4-2我想打他，有一起的吗？</div><div>太萌噜66666</div><div>有点像鸡涌</div><div>怎么了我觉得挺好的呀</div><div>23333333</div><div>前方高能预警</div><div>卧槽！绿茶婊！</div><div>2223333</div><div>收下我的膝盖</div><div>6666666666</div><div>前面说绿茶婊的等等我</div><div>好妖！</div>"}];
    var videoListNum=videoList.length;


    //jQuery("#focusVideo").html('<object width="522" height="305" data="http://swf.ws.126.net/bobo/player/NTESPlayer.swf" type="application/x-shockwave-flash"><param value="#000000" name="bgcolor"><param value="true" name="allowFullScreen"><param value="always" name="allowscriptaccess"><param name="wmode" value="opaque"><param name="allownetworking" value="all"><param value="'+videoList[defaultNum].videoUrl+'&amp;autoplay=0&amp;mute=0&amp;playerPath=http://swf.ws.126.net/bobo/player/NTESPlayer.swf&amp;pltype=-1&amp;autostart=1&amp;loop=0&amp;muted=0&amp;control=1&amp;url='+videoList[defaultNum].videoUrl+'" name="flashvars"></object>');


    var changeTime;
    jQuery(".dl-area-cnt").on("click","h2", function() {
        if(defaultNum<(videoListNum-1)){
            defaultNum=(defaultNum+1);
        } else {
            defaultNum=0;
        }
        dl.showVideo(defaultNum);
        //console.log(videoList[defaultNum].videoTime*1000);
        clearTimeout(changeTime);
        changeTime=setTimeout(changeVideo,videoList[defaultNum].videoTime*1000);
	    Stat.send('nextOne');
    })

    var dmRadom;
    var dl = new Object({
        init_screen : function (){
            var _top = 0;
            $(".dl-dm").find("div").show().each(function () {
                var _left = $(window).width() - $(this).width()+440;
                var _height = 305;
                _top = _top + 30;
                if (_top >= _height-26) {
                    _top = 0;
                }
                $(this).css({left: _left, top: _top});
                var time = 16000;
                if ($(this).index() % 10 == 0) {
                    time = 16000;
                }
                if ($(this).index() % 10 == 1) {
                    time = 12000;
                }
                if ($(this).index() % 10 == 2) {
                    time = 25000;
                }
                if ($(this).index() % 10 == 3) {
                    time = 19000;
                }
                if ($(this).index() % 10 == 4) {
                    time = 31000;
                }
                if ($(this).index() % 10 == 5) {
                    time = 16000;
                }
                if ($(this).index() % 10 == 6) {
                    time = 20000;
                }
                if ($(this).index() % 10 == 7) {
                    time = 17000;
                }
                if ($(this).index() % 10 == 8) {
                    time = 18000;
                }
                if ($(this).index() % 10 == 9) {
                    time = 23000;
                }
                 /*if ($(this).index() % 12 == 0) {
                    time = 12000;
                }
                if ($(this).index() % 13 == 0) {
                    time = 25000;
                }
                if ($(this).index() % 14 == 0) {
                    time = 19000;
                }
                if ($(this).index() % 15 == 0) {
                    time = 31000;
                }
                if ($(this).index() % 16 == 0) {
                    time = 16000;
                }
                if ($(this).index() % 17 == 0) {
                    time = 20000;
                }
                if ($(this).index() % 18 == 0) {
                    time = 17000;
                }
                if ($(this).index() % 19 == 0) {
                    time = 18000;
                }
                if ($(this).index() % 20 == 0) {
                    time = 23000;
                }
                */
                $(this).animate({left: "-" + _left + "px"}, time, function () {
                    //$(this).html("");
                    $(this).addClass("rollEnd")
                    //setTimeout("$(this).remove();",3000);
                    //$(this).remove();
                });
            });
        },
        startRequest : function (){
            var dmText
            var dmText2
            dmText=videoList[defaultNum].tmTitle;
            dmText2=videoList[defaultNum].tmTitle2;
            //console.log(defaultNum);
            if(dmRadom==1) {
                $(".dl-dm").append(dmText2);
                dmRadom=0;
            } else {
                $(".dl-dm").append(dmText);
                dmRadom=1;
            }
            dl.init_screen();
        },
        showVideo : function (num){
            jQuery("#focusVideo").html('<object width="522" height="305" data="//swf.ws.126.net/bobo/player/NTESPlayer.swf" type="application/x-shockwave-flash"><param value="#000000" name="bgcolor"><param value="true" name="allowFullScreen"><param value="always" name="allowscriptaccess"><param name="wmode" value="opaque"><param name="allownetworking" value="all"><param value="'+videoList[defaultNum].videoUrl+'&amp;autoplay=1&amp;mute=0&amp;playerPath=http://swf.ws.126.net/bobo/player/NTESPlayer.swf&amp;pltype=-1&amp;autostart=1&amp;loop=0&amp;muted=0&amp;control=1&amp;url='+videoList[defaultNum].videoUrl+'" name="flashvars"></object>');
            jQuery(".dl-dm").html("");
            //clearInterval(dmVar);
            dl.startRequest(defaultNum);
            //dmVar =  setInterval(function() {
            //    dl.startRequest(defaultNum);
            //}, 10000);
            jQuery("#videoIntro").html('<div class="intro-l"><h2><a href="'+videoList[defaultNum].url+'" target="_blank">'+videoList[defaultNum].title+'</a></h2><h3>评论（'+videoList[defaultNum].commentNum+'）</h3></div><div class="intro-r"><img src="'+videoList[defaultNum].img+'" width="148" height="100"><span class="icon"><a data-stat="'+ videoList[defaultNum].stat +'" href="'+videoList[defaultNum].url+'" target="_blank"></a></span></span></div>');
            var temp_str_2 ="";
            for (var j=0; j<videoList[defaultNum].list.length;j++){
                temp_str_2+='<li><div class="text clearfix"><div class="text-l"><img src="'+videoList[defaultNum].list[j].userImg+'" width="64" height="64"></div><div class="text-r"><h2>'+videoList[defaultNum].list[j].nick+'</h2><h3>'+videoList[defaultNum].list[j].text+'</h3><h4><span class="icon"></span><span class="num">'+videoList[defaultNum].list[j].digNum+'</span></h4></div></div></li>';
            }
            jQuery("#videoComment").html(temp_str_2);
        },
        showVideo2 : function (){
            if(defaultNum<(videoListNum-1)){
                defaultNum=(defaultNum+1);
            } else {
                defaultNum=0;
            }
            dl.showVideo(defaultNum);
        }
    });
    dl.startRequest(0);
    dmVar =  setInterval(function() {
        dl.startRequest(0);
        if($(".dl-dm .rollEnd").length>10){
            var allclear=true;
            for(var k=0;k<10;k++){
                if($(".dl-dm div").eq(k).attr('class')){
                } else{
                    allclear=false;
                }
            }
            //console.log(allclear);
            if(allclear==true){
                for(var k=0;k<10;k++){
                    $(".dl-dm .rollEnd").eq(0).remove();
                    //console.log(k);
                }
                //console.log("success");
            }
        }
    }, 10000);
    dl.showVideo(0);
    function changeVideo(){
        if(defaultNum<(videoListNum-1)){
            defaultNum=(defaultNum+1);
        } else {
            defaultNum=0;
        }
        //console.log(defaultNum+"=="+videoList[defaultNum].videoTime*1000);
        dl.showVideo(defaultNum);
        clearTimeout(changeTime);
        changeTime=setTimeout(changeVideo,videoList[defaultNum].videoTime*1000);
        //setTimeout(changeVideo,6000);
    }
    //setTimeout(changeVideo,videoList[defaultNum].videoTime);
    //console.log(videoList[defaultNum].videoTime);
    changeTime=setTimeout(changeVideo,videoList[defaultNum].videoTime*1000);

    var side_i = -1;
    var rTime = 6000;
    var autoRunTime = null;
    var sideDiv= "dl-area6";
    var sideNum = jQuery(".dl-area6 > .text > li").length;
    jQuery("."+sideDiv+"> .pot").on("click", "span", function() {
        clearTimeout(autoRunTime);
        side_i = jQuery(this).index();
        jQuery(".dl-area6 > .text > li").hide();
        jQuery(".dl-area6 > .text > li").removeClass("on");
        jQuery(".dl-area6 > .text > li").eq(side_i).fadeIn(1000);
        jQuery(".dl-area6 > .pot > span").removeClass("on");
        jQuery(".dl-area6 > .pot > span").eq(jQuery(this).index()).addClass("on");
        autoRunTime = window.setTimeout(dltext.autoChangeSide, rTime);
    })
    var dltext = new Object({
        autoChangeSide: function() {
            var n = sideNum - 1;
            side_i++;
            if (side_i > n) {
                side_i = 0;
            }
            jQuery(".dl-area6 > .text > li").hide();
            jQuery(".dl-area6 > .text > li").removeClass("on");
            jQuery(".dl-area6 > .text > li").eq(side_i).fadeIn(1000);
            jQuery(".dl-area6 > .pot > span").removeClass("on");
            jQuery(".dl-area6 > .pot > span").eq(side_i).addClass("on");
            autoRunTime = window.setTimeout(dltext.autoChangeSide, rTime);
        }
    });
    dltext.autoChangeSide();

    var temp_str="";
    for (var i = 0;i< bdList.length; i++) {
        temp_str+='<li><div class="pic"><a href="'+ bdList[i].url+'" target="_blank"><img src="'+ bdList[i].img+'" width="180" height="230"><h3 class="title">'+ bdList[i].title+'</h3></a></div></li>';
    }
    jQuery("#marquee1_1").html(temp_str);
    dlmove.marqueeStart(1, "left");

	$("#videoIntro").on('click','.intro-r a',function(){
		if($(this).data('stat')) Stat.send($(this).data('stat'));
	});

	$(".dl-area5-cnt").find('li').each(function(i){
		$(this).click(function(){
			Stat.send('IPCover_value_' + (i + 1));
		})
	});

});



var dlmove = new Object({
    marquee: function(i, direction) {
        var obj = document.getElementById("marquee" + i);
        var obj1 = document.getElementById("marquee" + i + "_1");
        var obj2 = document.getElementById("marquee" + i + "_2");
        if (direction == "up"){
            if (obj2.offsetTop - obj.scrollTop <= 0){
                obj.scrollTop -= (obj1.offsetHeight + 20);
            }else{
                var tmp = obj.scrollTop;
                obj.scrollTop++;
                if (obj.scrollTop == tmp){
                    obj.scrollTop = 1;
                }
            }
        }else{
            if (obj2.offsetWidth - obj.scrollLeft <= 0){
                obj.scrollLeft -= obj1.offsetWidth;
            }else{
                obj.scrollLeft++;
            }
        }
    },
    marqueeStart: function(i, direction) {
        var obj = document.getElementById("marquee" + i);
        var obj1 = document.getElementById("marquee" + i + "_1");
        var obj2 = document.getElementById("marquee" + i + "_2");
        obj2.innerHTML = obj1.innerHTML;
        var marqueeVar = window.setInterval("dlmove.marquee("+ i +", '"+ direction +"')", 20);
        obj.onmouseover = function(){
            window.clearInterval(marqueeVar);
        }
        obj.onmouseout = function(){
            marqueeVar = window.setInterval("dlmove.marquee("+ i +", '"+ direction +"')", 20);
        }
    }
});



