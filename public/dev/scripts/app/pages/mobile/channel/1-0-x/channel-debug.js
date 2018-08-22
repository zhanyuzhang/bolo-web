/**
 * Created by gztimboy on 2016/4/12 0012.
 */

define(function(require, exports, module) {
    'use strict';
    var $ = require('zepto@1-1-4'),
        Tmpl = require('tmpl@2-1-x'),
	    uadetector = require('uadetector@1-0-x'),
	    native = require('/common/native@1-0-x'),
	    qs = require('querystring@1-0-x'),
        HttpHelper = require('/common/HttpHelper@1-0-x'),
	    Stat = require('/common/Stat@1-0-x');

	var QUERY = qs.parse();
    var host = HttpHelper.getOrigin();
    var tmpl = new Tmpl(Tmpl.fromScripts());
    var b_domain = "m.live.netease.com";
    //b_domain = "223.252.196.214";
    var us_a = QUERY.userId;
    //var us_a = "6494226107539112671"; //测试用户信息userid
    //var us_a_2 = "7691633854771943245"; //测试视频userid
    var ua = navigator.userAgent.toLowerCase();
    var channel = new Object({

        // 初始化
        init: function () {
            this.pageSize = 10;
            this.resetStatus();
            this.bindEvents();
            this.resetStatus();
            this.getDataInfo();//读取主创个人信息
            this.getDataSetList(); // 读取选集列表
        },

        // 重置对象的状态
        resetStatus: function (sid) {
            this.currentPage = 1;
            this.isAll = false;
            this.isLoading = false;
            this.activeSetId = sid || null;
        },

        // html字符串模板替换
        replaceTpl: function(tpl, data) {
            return tpl.replace(/\$\{(\w+)\}/g, function(match, capture) {
                return data[capture];
            });
        },

        // 判断滚动条是否已经到达了底部
        isScrollToBottom: function () {
            if($(window).scrollTop() + $(window).height() > $(document).height() - 10){
                console.log("you are in the bottom");
                return true;
            }
            return false;
        },

        openTipsDiv : function (openDivName){
            var openDivName = "#" + openDivName;
            var openDiv_height_1 = -($(openDivName).height())/2;
            $(openDivName).css("margin-top",openDiv_height_1);
            $("#popmask").show();
            $(openDivName).show();
            $("body").bind("touchmove",function(e){e.preventDefault();});
        },
        openTipsDiv2 : function (openDivName){
            var openDivName = "#" + openDivName;
            $("#popmask").show();
            $(openDivName).show();
            $("body").bind("touchmove",function(e){e.preventDefault();});
        },
        closeTipsDiv : function (closeDivName){
            var closeDivName = "#" + closeDivName;
            $(closeDivName).hide();
            $("#popmask").hide();
            $("body").unbind("touchmove");
        },
        wxdlTips : function (closeDivName){
            $('.channel-tips-text').html("点击这里去浏览器下载吧");
            channel.openTipsDiv2('channel-tips');
            $("body").unbind("touchmove");
        },
        wxShareTips : function (closeDivName){
            $('.channel-tips-text').html("点击这里安利给朋友吧");
            channel.openTipsDiv2('channel-tips');
            $("body").unbind("touchmove");
        },
        formatSeconds : function (value){
            var theTime = parseInt(value);// 秒
            var theTime1 = 0;// 分
            var theTime2 = 0;// 小时
            if(theTime > 60) {
                theTime1 = parseInt(theTime/60);
                theTime = parseInt(theTime%60);
                if(theTime1 > 60) {
                    theTime2 = parseInt(theTime1/60);
                    theTime1 = parseInt(theTime1%60);
                }
            }
            if(theTime < 10 ){
                theTime= "0" + theTime;
            }
            var result = ""+theTime;
            if(theTime1 > 0) {
                if(theTime1 < 10 ){
                    theTime1= "0" + theTime1;
                }
                result = ""+theTime1+":"+result;
            }
            if(theTime2 > 0) {
                if(theTime2 < 10 ){
                    theTime2= "0" + theTime2;
                }
                result = ""+theTime2+":"+result;
            }
            return result;
        },
        getMomentsCreateTimeStr : function (timeMillis){
            var differStr = "";
            var nowTime = new Date();
            var nowMillis = nowTime.getTime();
            var differSeconds = (nowMillis - timeMillis)/1000;
            var differMinutes = Math.floor(differSeconds / 60);
            if (differMinutes < 0) {
                differMinutes=1;
            }
            if (differMinutes <= 59) {
                differStr = differMinutes + "分钟前";
            } else if (differMinutes >59 && differMinutes < 1440) {
                differStr = Math.floor(differMinutes/60) + "小时前";
            } else if (differMinutes >=1440 && differMinutes < 43200) {
                differStr = Math.floor(differMinutes/60/24) + "天前";
            } else {
                differStr = Math.floor(differMinutes/60/24/30) + "个月前";
            }
            return differStr;
        },
        getDataInfo : function (){
            $.ajax({
                url: "//" + b_domain + "/bolo/api/public/userInfo.htm?targetUserId="+us_a,
                dataType: "jsonp",
                jsonpCallback:"getDataInfo",
                success: function(data){
                    $(document).attr("title",data.nick.replace("'", "").replace("&apos;", "")+"的视频部落 | 网易菠萝");
                    //$(".channel-shareimg").html('<img src="http://imgsize.ph.126.net/?imgurl='+data.avatar+'_300x300x1x85.jpg">');
                    $(".channel-shareimg").html('<img src="'+data.avatar+'">');
                    $(".channel-info").html(tmpl.render("channelInfo",{data: data}));
                },
                error: function(){
                    //  alert('fail');
                }
            });
        },

        // 获取选集列表
        getDataSetList: function (){
            var me = this;
            $.ajax({
                url: host + "/bolo/api/channel/setList.htm?userId=" + us_a,
                dataType: "jsonp",
                jsonpCallback:"getSetList",
                success: function(data){
                    var active_sid;
                    // 遍历返回的所有选集，并拼成html字符串
                    var lists = data.map(function (e, i) {
                        var tpl = '<div class="channel-set-list ${active}" data-sid="${sid}" data-display="${isDisplaySetNum}">${name}</div>';
                        e.active = (i === 0 ? 'channel-set-list-active' : '');
                        return me.replaceTpl(tpl, e);
                    });
                    // 如果选集列表为空或者只有一个，则隐藏掉
                    if(lists.length === 0 || lists.length === 1) {
                        $('.channel-set').addClass('hidden');
                    // 否则，渲染选集列表，并且把第一个选集的ID传给channel.resetStatus()进行重置状态
                    } else {
                        $('.channel-set').html(lists.join(''));
                        me.resetStatus(data[0].sid);
                    }
                    // 获取视频列表
                    me.getDataVideoList();
                },
                error: function(){
                    //  alert('fail');
                }
            });
        },

        // 获取视频列表
        getDataVideoList: function () {
            var me = this;
            me.isLoading = true;
            var url = host + (me.activeSetId ? '/bolo/api/channel/setVideoList.htm' : '/bolo/api/channel/videoList.htm');
            $.ajax({
                url: url,
                dataType: "jsonp",
                jsonpCallback:"getVideoList",
                data: {
                    pageNum: me.currentPage++,
                    pageSize: me.pageSize,
                    sid: me.activeSetId || null,
                    userId: us_a
                },
                success: function(data2){
                    var temp_str="";
                    me.isLoading = false;
                    // 如果返回的数据比pageSize小，则说明已经全部加载完了
                    (data2.length < me.pageSize) && (me.isAll = true);
                    for (var i = 0; i<data2.length;i++) {
                        var temp_str_vtime="";
                        var temp_str_ltime="";
                        var temp_str_tag="";
                        temp_str_vtime= channel.formatSeconds(data2[i].duration);
                        temp_str_ltime= channel.getMomentsCreateTimeStr(data2[i].uploadTime);
                        if(data2[i].tag!=null) {
                            var arr = data2[i].tag.split(',');
                            for (var j = 0; j<arr.length;j++) {
                                if( j < 3 ) {
                                    temp_str_tag+="<span>#"+arr[j]+"</span>";
                                }
                            }
                        }
	                    var urlData = {
		                    videoId: data2[i].videoId,
		                    sourceFrom: 'up' + (QUERY.sourceFrom ? '-' + QUERY.sourceFrom : '')
	                    };
	                    if(QUERY.sharedby){
		                    urlData.sharedby = QUERY.sharedby
	                    }
                        console.log(data2[i].isLock);
	                    temp_str += '<div class="channel-video"><a href="/m/play?' + qs.stringify(urlData) + '" class="channel-video-cover"><img src="'+data2[i].cover+'"><span class="channel-video-cover-bg"></span><span class="channel-video-cover-playic"></span><span class="channel-video-cover-text"><span class="channel-video-cover-text-update">'+temp_str_ltime+'</span><span class="channel-video-cover-text-time">'+temp_str_vtime+'</span></span></a><h2><a href="/m/play?' + qs.stringify(urlData) + '">'+data2[i].title+'</a></h2><div class="channel-video-type">'+temp_str_tag+'</div><a href="http://www.bobo.com" class="channel-video-pt ' + (data2[i].isLock > 0 ? 'hidden' : '') + '"><span class="channel-video-pt-ic"></span><span class="channel-video-pt-num">'+data2[i].playCount+'</span><span>次</span></a><div class="channel-video-bline"></div></div>';
                    }
                    $(".channel-video-list").append(temp_str);
	                if(uadetector.isDevice('pc')) $(".channel-video-list .channel-video-cover:eq(0)").trigger('click');
                },
                error: function(){
                    //  alert('fail');
                }
            });
        },

        // 绑定事件
        bindEvents: function () {
            var me = this;
            //是微信才显示分享提示按钮
            if (ua.match(/micromessenger/i) == "micromessenger") {
                $(".channel-info-share").show();
            }
            $(".channel-info-follows").click(function() {
                Stat.send('IPhome_clickFollow');
                me.openTipsDiv('channel-dl-tips');
            });
            $("#popmask ,.channel-tips").click(function() {
                me.closeTipsDiv('channel-tips');
                me.closeTipsDiv('channel-dl-tips');
            });
            $(".channel-dl-tips-but-l,.channel-dl-tips-but-r ,.channel-dl-tips-close-ic").click(function() {
                me.closeTipsDiv('channel-dl-tips');
            });
            $(".channel-dl-tips-but-r").click(function() {
                Stat.send('IPhome_down_yes');
            });
            $(".channel-dl-tips-but-l,.channel-dl-tips-close-ic").click(function() {
                Stat.send('IPhome_down_no');
            });
            $(".channel-dl,.channel-dl-tips-but-r").click(function() {
                Stat.send('IPhome_down');
                if(uadetector.isOS('android') && uadetector.is('MicroMessenger')){
                    me.wxdlTips();
                }else native.download('主创页');
            });
            $(".channel-info-share").click(function() {
                me.wxShareTips();
            });

            $('.channel-video-list').on('tap','.channel-video-cover,h2',function(){
                Stat.send('IPhome_clickVideo',{
                    label: 'position:' + ($(this).parents('.channel-video').index() + 1)
                });
            });

            // 单击选集时，加载相应的视频列表。因为选集是动态生成的，需要通过事件委托绑定到body
            $('body').on('touchstart', function(e) {
                var target = e.target;
                if($(target).hasClass('channel-set-list')) {
                    if(target === $('.channel-set-list-active')[0]) {
                        return;
                    }
                    $('.channel-video-list').html('');
                    $('.channel-set-list-active').removeClass('channel-set-list-active');
                    $(target).addClass('channel-set-list-active');
                    me.resetStatus(target.dataset.sid);
                    me.getDataVideoList();
                }
            });

            // 滚动加载
            $(window).scroll(function () {
                if(me.isScrollToBottom() && !me.isAll && !me.isLoading) {
                    me.getDataVideoList();
                }
            });
        }

    });

    $(document).ready(function(){
        channel.init(); // 初始化
    });
});