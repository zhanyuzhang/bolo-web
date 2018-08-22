define(function(require, exports, module) {
	'use strict';
	var $ = require('jquery@1-11-x'),
		uadetector = require('uadetector@1-0-x');


	if(uadetector.isDevice('mobile')){
		location.href = '/m/act/cj' + location.search;
		return;
	}

    var HttpHelper = function(){
    }
    HttpHelper.getOrigin = function(testHost,officialHost){
        testHost = testHost || '223.252.196.87';
        officialHost = officialHost || 'm.live.netease.com';
        var isTest = function(){
            if(location.host.match(/test|local|dev/)){
                return true;
            }else{
                return false;
            }
        }
        if(isTest()) return '//' + testHost;
        else return '//' + officialHost
    };
	var Util = require('./modules/Util');
	var User = require('/common/user@1-0-x');
    var ShareTip = require('./modules/Share');
    var stat = require('/common/Stat@1-0-x');
    //弹框组合
    function CjAlert(container,options){
        this.container = container;
        this.options = $.extend({
            mapAlertEle:'.cj_alert_zbdh',
            mapShowClass:'n_c_cur',
            mapHoverEle:'.n_i',
            aroundAlertEle:'.cj_alert_zbpd',
            coserAlertEle:'.cj_alert_nstj',
            shareAlertEle:'.cj_alert_nsb',
            shareAlertEle2:'.cj_alert_a_share',
            imgAlertEle:'.cj_alert_imgContainer'
        },options);
        this.init();
    }
    CjAlert.prototype = {
        init:function(){
            var self = this;
            var hander = function(){
                $(self.container).css('display','none');
                $(self.container).find(self.options.shareAlertEle).css('display','none');
                $(self.container).find(self.options.shareAlertEle).find('.item1').css('display','none');
                $(self.container).find(self.options.mapAlertEle).css('display','none');
                $(self.container).find(self.options.coserAlertEle).css('display','none');
                $(self.container).find(self.options.imgAlertEle).css('display','none');
                $(self.container).find(self.options.aroundAlertEle).css('display','none');
            }
            $(this.container).find('.close').click(function(){
                hander();
            });
            $(this.container).find('.bar').click(function(){
                hander();
            })
            var dis = $(window).width() - 1000;
                $(this.container).find(this.options.mapAlertEle).find('.clickLeft').css('left',dis/2-20).click(function(){
                var title = $(this).attr('title');
                var num = parseInt(title[1]);
                num--;
                self.showMap('n'+num);
                $(this).attr('title','n'+num);
                $(self.container).find(self.options.mapAlertEle).find('.clickRight').attr('title','n'+num);
                if(num==2){
                     $(self.container).find(self.options.mapAlertEle).find('.clickRight').css('display','block');
                    $(self.container).find(self.options.mapAlertEle).find('.clickLeft').css('display','none');
                }else{
                    $(self.container).find(self.options.mapAlertEle).find('.clickLeft').css('display','block');
               
                }
            })
            $(this.container).find(this.options.mapAlertEle).find('.clickRight').css('right',dis/2+20).click(function(){
                var title = $(this).attr('title');
                var num = parseInt(title[1]);
                num++;
                self.showMap('n'+num);
                $(this).attr('title','n'+num);
                $(self.container).find(self.options.mapAlertEle).find('.clickLeft').attr('title','n'+num);
                if(num==5){
                      $(self.container).find(self.options.mapAlertEle).find('.clickLeft').css('display','block');
                     $(self.container).find(self.options.mapAlertEle).find('.clickRight').css('display','none');
                }else{
                    $(self.container).find(self.options.mapAlertEle).find('.clickRight').css('display','block');
                }
            })

        },
        initMap:function(){
            var self = this;
            var links = $(self.container).find(self.options.mapHoverEle);
            for(var i=0;i<links.length;i++){
                $(links).eq(i).hover(function(){
                    $(this).removeClass('nbg');
                },function(){
                    if($(this).attr('class').indexOf('curClass')==-1){
                        $(this).addClass('nbg');
                    }
                    
                });
                (function(i){
                    $(links).eq(i).click(function(){
                        $(this).removeClass('nbg');
                        self.showMapInfo(i);
                        $(self.container).find('.curClass').removeClass('curClass').addClass('nbg');
                        $(this).addClass('curClass');
                    })

                })(i);
                
            }
        },
        showMap:function(name){
            var self = this;
            $(self.container).css('display','block');
            $(self.container).find(self.options.mapAlertEle).css('display','block');
            $(self.container).find('.'+self.options.mapShowClass).removeClass(self.options.mapShowClass);
            $(self.container).find('.'+name+'_c').addClass(self.options.mapShowClass);
            $(self.container).find(self.options.mapAlertEle).find('.n').css('top',self.getPos());
            $(self.container).find(self.options.mapAlertEle).find('.n_show').css('top',self.getPos()+728);

            $(self.container).find(self.options.mapAlertEle).find('.clickLeft').attr('title',name);
            $(self.container).find(self.options.mapAlertEle).find('.clickRight').attr('title',name);
            var num = parseInt(name[1]);
            if(num==5){
                 $(self.container).find(self.options.mapAlertEle).find('.clickRight').css('display','none');
            }else{
                $(self.container).find(self.options.mapAlertEle).find('.clickRight').css('display','block');
            }
            if(num==2){
                 $(self.container).find(self.options.mapAlertEle).find('.clickLeft').css('display','none');
            }else{
                $(self.container).find(self.options.mapAlertEle).find('.clickLeft').css('display','block');
            }
        },
        showMapInfo:function(i){
            var self = this;
            var dis = $(window).height() - 480;
            if((self.getPos()+dis-728)<=0){
                 $(self.container).find(self.options.mapAlertEle).find('.n').css('top',0);
                $(self.container).find(self.options.mapAlertEle).find('.n_show').css('top',728);
            }else{
                $(self.container).find(self.options.mapAlertEle).find('.n').css('top',self.getPos()+dis-728);
                $(self.container).find(self.options.mapAlertEle).find('.n_show').css('top',self.getPos()+dis);
            }
            $(this.container).find('.n_show_cur').removeClass('n_show_cur');
            $(this.container).find('.n_show').eq(i).addClass('n_show_cur');
        },
        showAround:function(){
            var self = this;
            $(self.container).css('display','block');
            $(self.container).find(self.options.aroundAlertEle).css('display','block').css('top',self.getPos()+20);
        },
        showCoser:function(){
            var self = this;
            $(self.container).css('display','block');
            $(self.container).find(self.options.coserAlertEle).css('display','block').css('top',self.getPos()+20);
        },
        initShare:function(){
            var self = this;
            var userInfo = User.getInfo();
            var shareAlerContainer = $(self.container).find(self.options.shareAlertEle);
            $(shareAlerContainer).find('.item3').find('.btn').click(function(){
                 $(shareAlerContainer).find('.item3').css('display','none');
                 $(shareAlerContainer).find('.item2').css('display','block');
            });
            $(shareAlerContainer).find('.item2').find('.btn').click(function(){
                var phone = $(shareAlerContainer).find('.item2').find('#phone').val();
                    if(Util.isPhone(phone)){
                        $.ajax({
                            url:HttpHelper.getOrigin()+'/bolo/api/activity/joinChinaJoyActivity.htm',
                            data:{
                                mobile:phone
                            },
                            dataType:'jsonp',
                            success:function(data){
                                if(data.status==1){
                                   if(data.data.status==1){
                                    $(shareAlerContainer).find('.item2').css('display','none');
                                    $(shareAlerContainer).find('.item1').css('display','block');
                                   }else if(data.data.status==0){
                                    alert('提交失败');
                                   }else if(data.data.status==2){
                                    alert('此号码已经提交过了');
                                   }else if(data.data.status==3){
                                    alert('手机号码格式不正确');
                                   }else if(data.data.status==4){
                                    alert('找不到该用户');
                                   }
                                    
                                }
                            }
                        })
                       
                    }else{
                        alert('请填写正确的手机号');
                    }
                
                
            });
            var Share = require('./modules/Share');

            $(shareAlerContainer).find('.wb').click(function(){
                Share.sharetosina('%23网易菠萝%23%23ChinaJoy#我竟然在CJ上看这个！不能只有我一个人high！','//bolo.bobo.com/act/cj','//img1.cache.netease.com/love/image/app/wb_share.png');
            });
            $(shareAlerContainer).find('.qz').click(function(){
                Share.sharetoqqzone('网易菠萝ChinaJoy','//bolo.bobo.com/act/cj','//img1.cache.netease.com/love/image/app/wb_share.png',' 我竟然在CJ上看这个~~不能只有我一个人high!','2016CJ开车指南');
            });
        },
        initShare2:function(){
            var self = this;
            var shareAlerContainer = $(self.container).find(self.options.shareAlertEle2);
            $(shareAlerContainer).find('.item').find('.btn').click(function(){
                $(shareAlerContainer).css('display','none');
                $(self.container).css('display','none');
                
            });
            var Share = require('./modules/Share');
            $(shareAlerContainer).find('.wb').click(function(){
                Share.sharetosina('%23网易菠萝%23%23ChinaJoy#我竟然在CJ上看这个！不能只有我一个人high!','//bolo.bobo.com/act/cj',$('.article_box').find('#imgUrl').val());
            })
            $(shareAlerContainer).find('.qz').click(function(){
                Share.sharetoqqzone('网易菠萝ChinaJoy','//bolo.bobo.com/act/cj',$('.article_box').find('#imgUrl').val(),'我竟然在CJ上看这个~~不能只有我一个人high!','2016CJ开车指南');
            })
        },
        showShare:function(){
            var self = this;
            $(self.container).css('display','block');
            var shareAlerContainer = $(self.container).find(self.options.shareAlertEle);
            $(shareAlerContainer).css('display','block').css("top",self.getPos()+50);
            $(shareAlerContainer).find('.item3').css('display','block');
            $(shareAlerContainer).find('.item2').css('display','none');
        },
        showShare2:function(){
             var self = this;
              $(self.container).css('display','block');
               var shareAlerContainer = $(self.container).find(self.options.shareAlertEle2);
               $(shareAlerContainer).css('display','block').css("top",self.getPos()+50);
               $(shareAlerContainer).find('.item').css('display','block');
        },
        getPos:function(){
            var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
            return scrollTop;
        },
        initImgBig:function(){
            var self = this;
            $('.article_list').delegate('.jsImgBig','click',function(){
                var url = $(this).find('img').attr('src');
                self.showImgBig(url);
            });
        },
        showImgBig:function(url){
            var self = this;
            $(self.container).css('display','block');
            $(self.container).find(self.options.imgAlertEle).css('display','block').css("top",self.getPos()+20);
            $(self.container).find(self.options.imgAlertEle).find('img').attr('src',url);
        }
    }


	function Nav(container,options){
	 	this.container = container;
	 	this.options = $.extend({
	 		zkBtn:'.controlzk',
	 		sqBtn:'.controlsq',
	 		item:'.item',
	 		sqBtnClass:'controlsq',
	 		zkBtnClass:'controlzk',
	 		itemCur:'.itemcur',

	 	},options);
	 	this.init();
	}
	Nav.prototype.init = function(){
	 	var self = this;
	 	var zkHander = function(ele){
	 		$(self.container).find(self.options.item).css('display','block');
	 		$(self.container).find(self.options.itemCur).css('display','block');
	 		$(ele).removeClass(self.options.zkBtnClass)
	 	    .addClass(self.options.sqBtnClass)
	 	    
	 	}
	 	var sqHander = function(ele){
	 		$(self.container).find(self.options.item).css('display','none');
	 		$(self.container).find(self.options.itemCur).css('display','block');
	 		$(ele).removeClass(self.options.sqBtnClass)
	 	    .addClass(self.options.zkBtnClass)
	 	    
	 	}
	 	$(self.container).delegate(self.options.zkBtn,'click',function(){
            zkHander(this);
        });
	 	$(self.container).delegate(self.options.sqBtn,'click',function(){
            sqHander(this);
        });

        var minZkHander = function(){
            $('.cj_hand_min').css('display','none');
            $('.cj_hand').css('display','block');
        }
        var minSqHaner = function(){
            $('.cj_hand_min').css('display','block');
            $('.cj_hand').css('display','none');
        }
        $('.cj_hand_min .control').click(function(){
            minZkHander();
            clearTimeout(window.yellow);
        })
        $('.cj_hand .control').click(function(){
            minSqHaner();
            yellow();
        })
        var yellow = function(){
            window.yellow = setTimeout(function(){
                $('.cj_hand_min').find('.sbtn').addClass('btny');
                setTimeout(function(){
                    $('.cj_hand_min').find('.sbtn').removeClass('btny');
                    yellow();
                },1000)
            },1000)
        }
	 	var navPosition = function(){
	 		var hdis = $(window).height() - 695;
            if(hdis<0){
                hdis = 0;
            }
            var hdis2 = $(window).height() - 362;
	 		var ww = $(window).width();
            var cjHandW = $('.cj_hand').width();
            var cjNavW = $(self.container).width();
            if(ww>1430){
                $('.cj_hand').css('display','block');
                $('.cj_hand_min').css('display','none');
                $('.cj_hand_min').css({
                    "left":($(window).width()-1000)/2-cjHandW-20 +'px',
                     "top":(hdis2/2)+'px',
                })
                $('.cj_hand').css({
                    "top":(hdis2/2)+'px',
                    "left":($(window).width()-1000)/2-cjHandW-20 +'px'
                })
                $(self.container).css({
                    "top":(hdis/2)+'px',
                    "right":($(window).width()-1000)/2-cjNavW-38 + 'px'
                })
                zkHander($(self.container).find(self.options.zkBtn));
            }else{
                $('.cj_hand_min').css('display','block');
                $('.cj_hand').css('display','none');
                $('.cj_hand_min').css({
                    "top":(hdis2/2)+'px',
                    "left":0
                })
                 $('.cj_hand').css({
                    "top":(hdis2/2)+'px',
                    "left":0
                })
                $(self.container).css({
                    "top":(hdis/2)+'px',
                    "right":0
                })
                sqHander($(self.container).find(self.options.sqBtn));
                yellow();
            }

	 	}
        

	 	$(window).resize(function(){
	 		navPosition();
	 	})
	 	navPosition();
	}
	//导航
	new Nav('.cj_nav',{});

	 //内容切换
    function Tab(){
     	$('.cj_content_tabs').delegate('a','click',function(){
     		var className = $(this).attr('class');
     		if(className.indexOf('live')!=-1){
     			$('.cj_content_item').eq(0).addClass('cj_content_item_cur');
     			$('.cj_content_item').eq(1).removeClass('cj_content_item_cur');
     			$('.cj_content_tabs').find('.int_cur').removeClass('int_cur');
     			$(this).addClass('live_cur');
     		}else{
     			$('.cj_content_item').eq(0).removeClass('cj_content_item_cur');
     			$('.cj_content_item').eq(1).addClass('cj_content_item_cur');
     			$('.cj_content_tabs').find('.live_cur').removeClass('live_cur');
     			$(this).addClass('int_cur');
     		}
     	})
    }
    Tab();

    //直播视频
    var flashPlayer = require('/pages/pc/play/1-0-x/modules/flashPlayer');
    function VideoBox(container,options){
    	this.container = container;
    	this.options = $.extend({},options);
    	this.init();
    }
    VideoBox.prototype = {
    	init:function(){
    		 //自定义滚动条
     		var ScrollBar = require('./modules/ScrollBar');
     		new ScrollBar('tip','scrollBar','section','article');
     		//浮动遮罩
     		var HoverControl = require('./modules/HoverControl');
     		new HoverControl('.video_box_content_right_top',{
     			itemEle:'.video_box_content_right_top_item',
     			itemCurClass:'video_box_content_right_top_item_cur'
     		})
     		//初始化视频
     		this.initVideo();
     		this.initVideoRight();
    	},
    	initVideo:function(){
    		if(VIDEO_INFO.status==1){
                if(VIDEO_INFO.liveId>0){
                    var userNum = VIDEO_INFO.userNum;
                    var videoUrl = HttpHelper.getOrigin('223.252.196.85:8280') + '/bolo/api/live/redirect/video/'+userNum;
                    $('.btn_live').css('display','block');

                }else{
                    var videoUrl = 'http://flv.bn.netease.com/'+VCI[0]['summary'];
                }
     		}else{
     		     var videoUrl = 'http://flv.bn.netease.com/'+VCI[0]['summary'];
            }
     		this.render(videoUrl);

        },
    	initVideoRight:function(){
    	  var self = this;
          var links = $(self.options.videoRightContainer).find('.info');
          if(VIDEO_INFO.liveId>0){
            $(links).eq(links.length-1).html('直播美少女攻占CJ现场').parent().addClass('video_box_content_right_top_item_cur2').find('img').attr('src','http://imgsize.ph.126.net/?imgurl=http://img4.cache.netease.com/love/image/activities/cj/live.jpg_168x114x1x85.jpg');
          }
          for(var i=0;i<links.length;i++){
            (function(i){
                $(links).eq(i).click(function(){
                    if(i==0){
                        stat.send('vedio1_web');
                    }else if(i==1){
                        stat.send('vedio2_web');
                    }else if(i==2){
                        stat.send('vedio3_web');
                    }else if(i==3){
                        stat.send('vedio4_web');
                    }else if(i==4){
                        stat.send('vedio5_web');
                    }
                    $('.btn_live').css('display','none');
                    var url = $(this).attr('title');
                    if(i==links.length-1){
                         if(VIDEO_INFO.liveId>0){
                            var userNum = VIDEO_INFO.userNum;
                            url = HttpHelper.getOrigin('223.252.196.85:8280') + '/bolo/api/live/redirect/video/'+userNum;
                            $('.btn_live').css('display','block');
                         }
                    }
                    self.render(url);
                    $(self.container).find('.video_box_content_right_top_item_cur2').removeClass('video_box_content_right_top_item_cur2')
                    $(this).parent().addClass('video_box_content_right_top_item_cur2');
                })
            })(i);
          }
    	},
    	render:function(url){
    		var self = this;
    		$(self.options.videoContainer).html(flashPlayer.render({
				width: 747,
				height: 506,
				flashvars:{
					videoadv: "",
					sd: url,
					hd: "",
					shd: "",
					per: "0.4$$0.3",
					vid: url,
					autoPlay: 1,
					ipLimit: 0,
					liveIcon: 0,
					liveQuality: 0,
					defaultLive: 0,
					startTime: "201210311100",
					pltype:-1,
					needReplay: 0,
					cl: "cltest",
					mid: "midtest",
					coverpic: "",
					hds: "0"
				}}));
    	}
    }
    new VideoBox('.video_box',{
    	videoContainer:'.video_box_content_left',
    	videoRightContainer:'.video_box_content_right'
    })
    var cjAlert = new CjAlert('.cj_alert');
    //现场报道
    var Page = require('./modules/Page');
    function ArtBox(container,options){
    	this.container = container;
    	this.options = $.extend({
    		artListEle:'.article_list'
    	},options);
    	this.init();
    }
    ArtBox.prototype = {
    	init:function(){
    		var self = this;
    		new Page(self.container+' .page_box_container',{
			    centerPageContainer:'.page_box_container_center',//中间页数样式
			    preEle:'.pre',//上一页
			    nextEle:'.next',//下一页
			    count:ART_COUNT,//总数
				perPageCount:10,//每页数目
				callback:function(index){
					self.render(index);
                    $(window).scrollTop(1200);
				}
    		});
    	},
    	render:function(index){
    		var self  =this;
    		$.ajax({
    			url:HttpHelper.getOrigin()+'/bolo/api/video/commentList.htm',
    			dataType:'jsonp',
    			data:{
    				videoId:888888,
    				type:3,
    				pageNum:index,
    				pageSize:10
    			},
    			success:function(data){
    				for(var i=0;i<data.data.length;i++){
    					var date = new Date(data.data[i]['createTime']);
    					var str = Util.format(date,"yyyy-MM-dd hh:mm:ss");
    					data.data[i]['dateStr'] = str;
                        var imgStr = data.data[i]['images'];
                        if(imgStr!=null){
                            var imgStra = imgStr.split(',');
                            imgStr = imgStra[0];
                        }else{
                            imgStr = 'http://img1.cache.netease.com/love/image/app/wb_share.png';
                        }
                        data.data[i]['image'] = imgStr;
                        
    				}
    				var html = Util.tpl($('#article-list-tpl').html(),data.data);
    				$(self.container).find(self.options.artListEle).html(html);
    			}
    		})
    	}
    }
    new ArtBox('.article_box',{})
    cjAlert.initImgBig();

    //评论框
    function LoginBox(container,options){
    	this.container = container;
    	this.options = $.extend({
    		holderEle:'.holder',
    		btn:'.btn',
    		faceContainer:'.login_left'
    	},options);
    	this.init();
    	this.onEvents();
    }
    LoginBox.prototype = {
    	init:function(){
    		var self = this;
    		var faceContainer = $(self.container).find(self.options.faceContainer);
    		if(User.isLogin()){
    			var userInfo = User.getInfo();
    			$(faceContainer).html('<img src="'+userInfo['avatar']+'" />')
    		}
    	},
    	onEvents:function(){
    		var self = this;
    		var holder = $(self.container).find(self.options.holderEle);
    		var btn = $(self.container).find(self.options.btn);
    		var tta = $(self.container).find('textarea');
    		$(holder).click(function(){
    			$(tta).focus();
    			$(this).css('display','none');
    		});
    		$(tta).blur(function(){
    			
    			if($(this).val().length==0){
    				$(holder).css('display','block');
    			}
    		})
    		$(tta).focus(function(){
                stat.send('commentclk_web');
                if(User.isLogin()){
                    $(holder).css('display','none');
                }else{
                    User.login();
                }
    		})
    		$(btn).click(function(){
               var userInfo = User.getInfo();
    			if(User.isLogin()){
                    var value = $(self.container).find('#content').val();
                    if($.trim(value).length==0){
                        alert('评论内容不能为空');
                        return false;
                    }
    				$.ajax({
                        url:HttpHelper.getOrigin()+'/bolo/api/video/activityComment',
                        dataType:'jsonp',
                        data:{
                            userId:userInfo['userIdStr'],
                            activityId:999999,
                            content:$(self.container).find('#content').val(),
                            from:userInfo['sourceFrom']
                        },
                        success:function(data){
                            if(data.status==1){
                                stat.send('comment_web');
                                var list = [];
                                list.push(data.comment);
                                for(var i=0;i<list.length;i++){
                                    var date = new Date(list[i]['createTime']);
                                    var str = Util.format(date,"yyyy-MM-dd hh:mm:ss");
                                    list[i]['dateStr'] = str;
                                }
                                var html = Util.tpl($('#comment-list-tpl').html(),list);
                                $('.comment_box').find('.comment_list').find('.comment_list_item').eq($('.comment_box').find('.comment_list').find('.comment_list_item').length-1).remove();
                                $(html).insertBefore($('.comment_box').find('.comment_list').find('.comment_list_item').eq(0));
                                $(self.container).find('#content').val('').blur();
                            }
                        }
                    })
    			}else{
    				User.login();
    			}
    		})
    	}
    }


    function CommentBox(container,options){
    	this.container = container;
    	this.options = $.extend({
    		listEle:'.comment_list'
    	},options);
    	this.init();
    }
    CommentBox.prototype = {
    	init:function(){
    		var self = this;
    		new Page(self.container+' .page_box_container',{
			    centerPageContainer:'.page_box_container_center',//中间页数样式
			    preEle:'.pre',//上一页
			    nextEle:'.next',//下一页
			    count:COM_COUNT,//总数
				perPageCount:6,//每页数目
				callback:function(index){
					self.render(index);
                    if($('.live_cur').length!=0){
                        $(window).scrollTop(2600);
                    }else{
                        $(window).scrollTop(4500);
                    }
                    
				}
    		});
    		new LoginBox(self.container+' .flogin');
    	},
    	render:function(index){
            var self = this;
            $.ajax({
                url:HttpHelper.getOrigin()+'/bolo/api/video/commentList.htm',
                data:{
                    videoId:999999,
                    pageNum:index,
                    pageSize:6,
                    type:4,
                },
                dataType:'jsonp',
                success:function(data){
                   var list = data.data;
                   for(var i=0;i<data.data.length;i++){
                        var date = new Date(data.data[i]['createTime']);
                        var str = Util.format(date,"yyyy-MM-dd hh:mm:ss");
                        data.data[i]['dateStr'] = str;
                    }
                   var html = Util.tpl($('#comment-list-tpl').html(),list);
                   $(self.container).find(self.options.listEle).html(html);
                }
            })
    	}
    }
    
    //new CommentBox('.comment_box',{})
    

    //地图
    function Map(container,options){
    	this.container = container;
    	this.options = $.extend({
    		item:'div'
    	},options);
    	this.init();
    }
    Map.prototype = {
    	init:function(){
    		var self = this;
    		var links = $(self.container).find(self.options.item);
    		
    		cjAlert.initMap();
    		for(var i=0;i<links.length;i++){
    			$(links).eq(i).hover(function(){
    				$(this).removeClass('nbg');
    			},function(){
    				$(this).addClass('nbg');
    			});
    			$(links).eq(i).click(function(){
    				var className = $(this).attr('class');
    				if(className.indexOf('n2')!=-1){
    					cjAlert.showMap('n2');
    				}else if(className.indexOf('n3')!=-1){
    					cjAlert.showMap('n3');
    				}else if(className.indexOf('n4')!=-1){
    					cjAlert.showMap('n4');
    				}else if(className.indexOf('n5')!=-1){
    					cjAlert.showMap('n5');
    				}
    			})
    		}


    	}
    }
    new Map('.mapCC',{})

    //吃喝玩乐
    var SeqTab = require('./modules/SeqTab');
    var ScrollBar = require('./modules/ScrollBar');
    new ScrollBar('tip1','scrollBar1','section1','article1');
    new SeqTab('.chwl_c',{
    		linkEle:'.chwl_tab',
			linkCurClass:'curTab',
			itemELe:'.chwl_r_i',
			itemCurClass:'cur',
			callback:function(i,ele){
				$(ele).parent().removeClass('chwl_l_chi')
				$(ele).parent().removeClass('chwl_l_zhu')
				$(ele).parent().removeClass('chwl_l_xin')
				if(i==0){
					$(ele).parent().addClass('chwl_l_chi')
					new ScrollBar('tip1','scrollBar1','section1','article1');
				
				}else if(i==1){
					$(ele).parent().addClass('chwl_l_zhu')
					//new ScrollBar('tip2','scrollBar2','section2','article2');
				}else if(i==2){
					$(ele).parent().addClass('chwl_l_xin')
					new ScrollBar('tip3','scrollBar3','section3','article3');
				
				}
			}
    });
    var HoverControl = require('./modules/HoverControl');
    new HoverControl('.cj_chwl',{
        itemEle:'.chwl_r_r_i',
        itemCurClass:'chwl_r_r_i_cur'
    })
    $('.chwl_c').find('.chwl_tab').hover(function(){
        var className = $(this).attr('class');
        $(this).parent().removeClass('chwl_l_zhu');
        $(this).parent().removeClass('chwl_l_chi');
        $(this).parent().removeClass('chwl_l_xin');
        if(className.indexOf('tab1')!=-1){
            $(this).parent().addClass('chwl_l_chi');
        }else if(className.indexOf('tab2')!=-1){
            $(this).parent().addClass('chwl_l_zhu');
        }else{
            $(this).parent().addClass('chwl_l_xin');
        }
    })
     var Slider = require('./modules/Slider');
    //周边盘点
   
    new HoverControl('.zbpd_c',{
    	itemEle:'.zbpd_i',
		itemCurClass:'zbpd_i_cur'
    })
    var ClickControl = require('./modules/ClickControl');
    new ClickControl('.zbpd_c',{
    	itemEle:'.zbpd_i',
    	callback:function(i){
                new Slider('.cj_alert_zbpd',{
                    preBtnEle:'.clickLeft',
                    nextBtnELe:'.clickRight',
                    moveEle:'.slider_c',
                    itemEle:'.item',
                    index:i,
                    callback:function(){
                        cjAlert.showAround();
                    }
                })
    		  
    	}
    });
    $('.cj_content_bg').height(3413);
    //女神特辑
    new HoverControl('.nstj_c',{
    	itemEle:'.nstj_i_c',
		itemCurClass:'nstj_i_c_cur'
    })
    new ClickControl('.nstj_c',{
    	itemEle:'.nstj_i_c',
    	callback:function(i){
            new Slider('.cj_alert_nstj',{
                preBtnEle:'.clickLeft',
                nextBtnELe:'.clickRight',
                moveEle:'.slider_c',
                itemEle:'.item2',
                index:i,
                callback:function(){
                    cjAlert.showCoser();
                }
            })
    		
    	}
    });
    new Slider('.nstj_c',{
            preBtnEle:'.clickLeft',
            nextBtnELe:'.clickRight',
            moveEle:'.nstj_c_container',
            itemEle:'.nstj_i',
    })
    

    //分享
    cjAlert.initShare();
    cjAlert.initShare2();
    var shareHander = function(){
        cjAlert.showShare();
    }
    var shareHander2 = function(){
        cjAlert.showShare2();
        $(this).addClass('sharecur');
        $('.article_box').find('#imgUrl').val($(this).parent().parent().parent().find('.article_item_left').find('img').attr('src'));
    }
    $('.cj_hand').find('.sbtn').click(shareHander);
    $('.cj_hand_min').find('.sbtn').click(shareHander);
    $('.article_box').delegate('.share','click',shareHander2);

    //右边滚动
    new HoverControl('.cj_nav',{
        itemEle:'.item',
        itemCurClass:'itemcur',
        callback1:function(i,ele){

        },
        callback2:function(i,ele){
            if($(ele).attr('class').indexOf('itemcur2')!=-1){
                $(ele).addClass('itemcur');
            }
        }
    })
    var SeqScroll = require('./modules/SeqScroll');
    var seqScroll = new SeqScroll('.cj_content',{
        offsetEle:'.scrollItem'
    })
    new ClickControl('.cj_nav',{
        itemEle:'.item',
        callback:function(i){
            $('.cj_nav').find('.itemcur2').removeClass('itemcur2').removeClass('itemcur');
            $('.cj_nav').find('.item').eq(i).addClass('itemcur2');
            if(i==0){
                $('.cj_content_tabs .live').addClass('live_cur');
                $('.cj_content_tabs .introduce').removeClass('int_cur');
                $('.cj_content_int').removeClass('cj_content_item_cur');
                $('.cj_content_live').addClass('cj_content_item_cur');
            }else{
                $('.cj_content_tabs .live').removeClass('live_cur');
                $('.cj_content_tabs .introduce').addClass('int_cur');
                $('.cj_content_int').addClass('cj_content_item_cur');
                $('.cj_content_live').removeClass('cj_content_item_cur');
            }
            var array = seqScroll.getPosA();
            $(window).scrollTop(array[i]);

        }
    })

    $(window).scroll(function(){
        var dist = document.documentElement.scrollTop||document.body.scrollTop;
        var items = $('.cj_nav').find('.item');
        var returnIndex = function(){
            var array = seqScroll.getPosA();
            for(var i=1;i<array.length-1;i++){
                var cdis = dist+($(window).height()/2);
                if(cdis>array[array.length-1]){
                    return array.length-1;
                }
                if(cdis>array[i]&&cdis<array[i+1]){
                    return i;
                }
            }
        }
        if($('.live_cur').length!=0){
            $('.cj_nav').find('.itemcur').removeClass('itemcur');
            $(items).eq(0).addClass('itemcur');
        }else{
            $('.cj_nav').find('.itemcur').removeClass('itemcur');
            $(items).eq(returnIndex()).addClass('itemcur');
        }
        if($('.n_c_cur').css('display')=='block'){
            var n_show_cur_top = parseInt($('.n_show_cur').eq(0).css('top'));
            if(dist>(n_show_cur_top+954)){
                $('.cj_alert_zbdh').find('.clickLeft').css('display','none');
                $('.cj_alert_zbdh').find('.clickRight').css('display','none');

                $('.cj_alert_zbdh').find('.close_c').css('display','none');
            }else{

                
                var title =  $('.cj_alert_zbdh').find('.clickRight').attr('title');
                var num = parseInt(title[1]);
                if(num==5){
                    $('.cj_alert_zbdh').find('.clickRight').css('display','none');
                }else{
                    $('.cj_alert_zbdh').find('.clickRight').css('display','block');
                }
                var title = $('.cj_alert_zbdh').find('.clickRight').attr('title');
                var num = parseInt(title[1]);
                if(num==2){
                    $('.cj_alert_zbdh').find('.clickLeft').css('display','none');
                }else{
                    $('.cj_alert_zbdh').find('.clickLeft').css('display','block');
                }
                $('.cj_alert_zbdh').find('.close_c').css('display','block');
            }
        }
    })
    //统计代码
    $('body').delegate('.js-tj','click',function(){
        var key = $(this).attr('data-key');
        stat.send(key);
    })

});