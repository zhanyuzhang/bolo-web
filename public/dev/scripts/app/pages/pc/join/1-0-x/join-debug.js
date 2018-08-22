/**
 * Created by gztimboy on 2016/8/23 0023.
 */
define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery@1-11-x'),
        Tmpl = require('tmpl@2-1-x'),
	    Stat = require('/common/Stat@1-0-x'),
        user = require('/common/user@1-0-x'),
        uadetector = require('uadetector@1-0-x'),
        dialog = require('/common/uiComponent/pc/dialog@1-0-x');
    var curNum=2;
    var join = new Object({
        loadDefaultData : function (){
            if(gfbdHotList.length>0) {
                $(".jo-report-l").html('<div class="pic"><a href="'+gfbdHotList[0].url+'" target="_blank" data-stat="' + gfbdHotList[0].stat + '"><img src="'+gfbdHotList[0].img+'" width="495" height="300"></a></div><h2><a href="'+gfbdHotList[0].url+'" target="_blank">'+gfbdHotList[0].title+'</a></h2>');
            }
            if(gfbdList.length>0) {
                var temp_str="";
                for(var i= 0;i<gfbdList.length;i++){
                    temp_str+='<dt><a href="'+gfbdList[i].url+'" target="_blank" data-stat="' + gfbdList[i].stat + '"><div class="pic"><img src="'+gfbdList[i].img+'" width="145" height="90"></div><div class="title">'+gfbdList[i].title+'</div></a></dt>';
                }
                $(".jo-report-r dl").html(temp_str);
            }
            if(evaluateList.length>0){
                var temp_str2="";
                var maxNum=3;
                if (evaluateList.length>3){
                    maxNum=3;
                } else {
                    maxNum=evaluateList.length;
                }
                for(var i= 0;i<maxNum;i++){
                    temp_str2+='<div class="evaluate clearfix"><div class="evaluate-l"><h3>'+evaluateList[i].text+'</h3></div><div class="evaluate-r"><div class="avatar"><img src="'+evaluateList[i].img+'" width="108" height="108"></div><div class="nick">'+evaluateList[i].nick+'</div></div></div>';
                }
                $(".jo-evaluate li").html(temp_str2);

            }
        },
        form : function (){
            alert("333");
        },
        moveEvaluate : function (){
            $(".jo-evaluate li .evaluate:eq(0)").fadeTo("slow", 0.01, function() {
                $(".jo-evaluate li .evaluate:eq(0)").slideUp("slow", function() {
                    $(".jo-evaluate li .evaluate:eq(0)").remove();
                });
            });
            curNum=(curNum+1);
            if(curNum==6){
                curNum=0;
            }
            var temp_str3="";
            temp_str3='<div class="evaluate clearfix"><div class="evaluate-l"><h3>'+evaluateList[curNum].text+'</h3></div><div class="evaluate-r"><div class="avatar"><img src="'+evaluateList[curNum].img+'" width="108" height="108"></div><div class="nick">'+evaluateList[curNum].nick+'</div></div></div>';
            $(".jo-evaluate li").append(temp_str3);
        }
    });
    join.loadDefaultData();
    setInterval(function() {
        join.moveEvaluate();
    }, 3000);
    $(".joinNow").click(function() {
        if(USER_INFO.status==-1){
            user.login();
        } else {
            dialog.joinBolo.show();
        }
	    Stat.send('Enter' + $(this).data('index'));
    });
	$(".jo-report-l").find('a').click(function(){
		Stat.send($(this).data('stat'));
	})
});
