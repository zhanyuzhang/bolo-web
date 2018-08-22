/**
 * Created by chesszhang on 2016/12/12
 */
define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery@1-11-x'),
        uadetector = require('uadetector@1-0-x'),
        user = require('/common/user@1-0-x'),
        HttpHelper = require('/common/HttpHelper@1-0-x');

    var VIDEO_LIST = [
        {
            previewUrl: 'http://flv.bn.netease.com/videolib3/1612/14/NzSYj3422/SD/NzSYj3422-mobile.mp4',
            videoId: '14800587094951',
            cover: 'http://bobolive.nosdn.127.net/aac_bobo_1481617970479_32917822.mp4?vframe&offset=18&type=jpg',
            title: '【我们不捉妖】你以为起个名叫李昂纳多，就会变帅吗？',
            commentCount: 222,
            commentList: [
                {
                    'text': '虽然是常见的妖怪题材，但是剧情很有意思啊，支持良心国产动画！',
                    "nick": "Huisa",
                    "userImg": "http://imgsize.ph.126.net/?imgurl=http://bobo-public.nosdn.127.net/bobo_1471602114269_38616918_46x46x0x80.jpg",
                    "digNum": "145"
                },
                {
                    "nick": "去胡同溜达",
                    "userImg": "http://img1.cache.netease.com/bobo/img16/bolo1607/u=102168928,4160083900&fm=23&gp=0.jpg",
                    "text": "23333小李子老年发福就长这个样吧……",
                    "digNum": "128"
                },
                {
                    "nick": "今天学习了吗",
                    "userImg": "http://img1.cache.netease.com/bobo/img16/bolo1607/u=1022676371,1113372005&fm=23&gp=0.jpg",
                    "text": "听说导演真人超帅，期待菠萝的第三集首发！",
                    "digNum": "86"
                }
            ]
        },{
            previewUrl: 'http://flv.bn.netease.com/videolib3/1612/14/xEVKd7188/SD/xEVKd7188-mobile.mp4',
            videoId: '14627905312781',
            cover: 'http://bobolive.nosdn.127.net/aac_bobo_1463740477407_48396047.mp4?vframe&offset=25&type=jpg',
            title: '【大力金刚精选集】老爸我真的考了九十8！',
            commentCount: 872,
            commentList: [
                {
                    "nick": "伦吹",
                    "userImg": "http://img1.cache.netease.com/bobo/img16/bolo1607/u=1027851289,1567953988&fm=23&gp=0.jpg",
                    "text": "哈哈哈我小时候才没那么蠢",
                    "digNum": "79"
                },
                {
                    "nick": "你猜我猜不猜",
                    "userImg": "http://bobolive.nosdn.127.net/aac_bobo_1481617998156_91228995.mp4?vframe&offset=45&type=jpg",
                    "text": "从小到大……每任同桌都是学霸",
                    "digNum": "46"
                },
                {
                    "nick": "守护kk笑颜",
                    "userImg": "http://img1.cache.netease.com/bobo/img16/bolo1607/u=1031405470,3246262865&fm=23&gp=0.jpg",
                    "text": "记起小时候每次找家长签名的恐怖回忆！",
                    "digNum": "33"
                }
            ]
        },{
            previewUrl: 'http://flv.bn.netease.com/videolib3/1612/14/ZVyMP3512/SD/ZVyMP3512-mobile.mp4',
            videoId: '14611213739591',
            cover: 'http://bobolive.nosdn.127.net/aac_bobo_1481617998156_91228995.mp4?vframe&offset=45&type=jpg',
            title: '【大力金刚精选集】战胜广场舞大神是需要代价的！',
            commentCount: 709,
            commentList: [
                {
                    "nick": "叫我路人sama",
                    "userImg": "http://img1.cache.netease.com/bobo/img16/bolo1607/u=1033649457,1987438146&fm=23&gp=0.jpg",
                    "text": "要不是今天又更新了 我差点就信了",
                    "digNum": "105"
                },
                {
                    "nick": "英俊的小男生",
                    "userImg": "http://img1.cache.netease.com/bobo/img16/bolo1607/u=1038237434,427646412&fm=23&gp=0.jpg",
                    "text": "真•心疼大力！没女朋友就算了，连手都没了..",
                    "digNum": "69"
                },
                {
                    "nick": "霸气总裁小方",
                    "userImg": "http://img1.cache.netease.com/bobo/img16/bolo1607/u=1042571727,3806961099&fm=23&gp=0.jpg",
                    "text": "这部动画绝壁有毒",
                    "digNum": "27"
                }
            ]
        },{
            previewUrl: 'http://flv.bn.netease.com/videolib3/1612/14/gmDOu3613/SD/gmDOu3613-mobile.mp4',
            videoId: '14800587095201',
            cover: 'http://bobolive.nosdn.127.net/aac_bobo_1481618023210_12876057.mp4?vframe&offset=58&type=jpg',
            title: '【废柴狐阿桔】为什么没人救你呢？因为英雄只救美啊。',
            commentCount: 272,
            commentList: [
                {
                    "nick": "男神哒胖次",
                    "userImg": "http://imgsize.ph.126.net/?imgurl=http://wx.qlogo.cn/mmopen/xibGVES00rEpwHt9NEmNOh5o7HTEib5hKibrs4MHRTutSLoN9ibXBs87xq2weficiaYKJe5qhYSibZXU3ZYat6V8QVPriasGDa0JZ7gj/0_46x46x0x80.jpg",
                    "text": "这标题起的……大写的服！",
                    "digNum": "118"
                },
                {
                    "nick": "超绝可爱auauto",
                    "userImg": "http://img1.cache.netease.com/bobo/img16/bolo1607/u=1008555201,2782901761&fm=23&gp=0.jpg",
                    "text": "阿汤和阿桔都好萌，希望作者多多更新！",
                    "digNum": "95"
                },
                {
                    "nick": "欲望之眼土司君",
                    "userImg": "http://img1.cache.netease.com/bobo/img16/bolo1607/u=1010677766,3620252671&fm=23&gp=0.jpg",
                    "text": "最喜欢这集阿桔的男友力max",
                    "digNum": "52"
                }
            ]
        },{
            previewUrl: 'http://flv.bn.netease.com/videolib3/1612/14/QiWTR3659/SD/QiWTR3659-mobile.mp4',
            videoId: '14800587113201',
            cover: 'http://bobolive.nosdn.127.net/aac_bobo_1481618033781_51358920.mp4?vframe&offset=68&type=jpg',
            title: '【废柴狐阿桔】尝尝我做的薄荷味夹心饼干',
            commentCount: 947,
            commentList: [
                {
                    "nick": "叫我路人sama",
                    "userImg": "http://img1.cache.netease.com/bobo/img16/bolo1607/u=1033649457,1987438146&fm=23&gp=0.jpg",
                    "text": "666666恶搞新招get！",
                    "digNum": "105"
                },
                {
                    "nick": "英俊的小男生",
                    "userImg": "http://img1.cache.netease.com/bobo/img16/bolo1607/u=1038237434,427646412&fm=23&gp=0.jpg",
                    "text": "年度虐狗动画《废柴狐阿桔》，单身狗慎看。",
                    "digNum": "69"
                },
                {
                    "nick": "霸气总裁小方",
                    "userImg": "http://img1.cache.netease.com/bobo/img16/bolo1607/u=1042571727,3806961099&fm=23&gp=0.jpg",
                    "text": "看完立刻跑去菠萝看了完整的第六集",
                    "digNum": "27"
                }
            ]
        },{
            previewUrl: 'http://flv.bn.netease.com/videolib3/1612/14/uwUjJ7774/SD/uwUjJ7774-mobile.mp4',
            videoId: '14800593979271',
            cover: 'http://bobolive.nosdn.127.net/aac_bobo_1481618013556_26625833.mp4?vframe&offset=29&type=jpg',
            title: '【梅嘲讽】别自作多情了，喂你吃橘子是因为…',
            commentCount: 368,
            commentList: [
                {
                    "nick": "伦吹",
                    "userImg": "http://img1.cache.netease.com/bobo/img16/bolo1607/u=1004194926,1693471297&fm=23&gp=0.jpg",
                    "text": "看到开头就猜到了结局",
                    "digNum": "79"
                },
                {
                    "nick": "你猜我猜不猜",
                    "userImg": "http://img1.cache.netease.com/bobo/img16/bolo1607/u=1027851289,1567953988&fm=23&gp=0.jpg",
                    "text": "这个故事告诉我们，内心戏不要太多……",
                    "digNum": "46"
                },
                {
                    "nick": "守护kk笑颜",
                    "userImg": "http://img1.cache.netease.com/bobo/img16/bolo1607/u=1031405470,3246262865&fm=23&gp=0.jpg",
                    "text": "你以为自己收获了爱情，到头来发现是个套路",
                    "digNum": "33"
                }
            ]
        },{
            previewUrl: 'http://flv.bn.netease.com/videolib3/1612/14/qWoiM3782/SD/qWoiM3782-mobile.mp4',
            videoId: '14750729864491',
            cover: 'http://bobolive.nosdn.127.net/aac_bobo_1481618052210_88732133.mp4?vframe&offset=72&type=jpg',
            title: '【异次元战姬】把妖怪当成你的烦恼狠狠斩杀吧！',
            commentCount: 678,
            commentList: [
                {
                    "nick": "Huisa",
                    "userImg": "http://imgsize.ph.126.net/?imgurl=http://wx.qlogo.cn/mmopen/ajNVdqHZLLBLcAhvLDEMIWiappMUibQsib7MI4KHXRbgyF88VhN8I8C6cGicibHsmwgCfWuwricCic35icncb477oOicXTw/0_46x46x0x80.jpg",
                    "text": "360度的打斗系统做得很流畅",
                    "digNum": "145"
                },
                {
                    "nick": "去胡同溜达",
                    "userImg": "http://img1.cache.netease.com/bobo/img16/bolo1607/u=102168928,4160083900&fm=23&gp=0.jpg",
                    "text": "山新竟然是配音！！表白山新大大！",
                    "digNum": "128"
                },
                {
                    "nick": "今天学习了吗",
                    "userImg": "http://img1.cache.netease.com/bobo/img16/bolo1607/u=1022676371,1113372005&fm=23&gp=0.jpg",
                    "text": "心情烦躁的时候上去坎坎怪巨爽",
                    "digNum": "86"
                }
            ]
        },{
            previewUrl: 'http://flv.bn.netease.com/videolib3/1612/14/MarjT7863/SD/MarjT7863-mobile.mp4',
            videoId: '14750729864491',
            cover: 'http://bobolive.nosdn.127.net/aac_bobo_1481618023870_42737899.mp4?vframe&offset=84&type=jpg',
            title: '【梅嘲讽】大丈夫摆地摊，能砍能涨！',
            commentCount: 406,
            commentList: [
                {
                    "nick": "菠萝蜜",
                    "userImg": "http://img1.cache.netease.com/bobo/img16/bolo1607/u=1004194926,1693471297&fm=23&gp=0.jpg",
                    "text": "没见过这么蠢萌的买家",
                    "digNum": "118"
                },
                {
                    "nick": "超绝可爱auauto",
                    "userImg": "http://img1.cache.netease.com/bobo/img16/bolo1607/u=1008555201,2782901761&fm=23&gp=0.jpg",
                    "text": "请收下我微不足道的膝盖",
                    "digNum": "95"
                },
                {
                    "nick": "欲望之眼土司君",
                    "userImg": "http://img1.cache.netease.com/bobo/img16/bolo1607/u=1010677766,3620252671&fm=23&gp=0.jpg",
                    "text": "旁边那个小哥一脸懵逼的样子好搞笑啊",
                    "digNum": "52"
                }
            ]
        },{
            previewUrl: 'http://flv.bn.netease.com/videolib3/1612/14/bFTho3855/SD/bFTho3855-mobile.mp4',
            videoId: '14816193794541',
            cover: 'http://bobolive.nosdn.127.net/aac_bobo_1481618042143_33696561.mp4?vframe&offset=45&type=jpg',
            title: '【阴阳师手游】现在入坑也不迟！',
            commentCount: 161,
            commentList: [
                {
                    "nick": "叫我路人sama",
                    "userImg": "http://img1.cache.netease.com/bobo/img16/bolo1607/u=1033649457,1987438146&fm=23&gp=0.jpg",
                    "text": "网易爸爸你到底什么时候给我SSR！！",
                    "digNum": "105"
                },
                {
                    "nick": "英俊的小男生",
                    "userImg": "http://img1.cache.netease.com/bobo/img16/bolo1607/u=1038237434,427646412&fm=23&gp=0.jpg",
                    "text": "送你99个勾玉，剩下那1个自己讨吧",
                    "digNum": "69"
                },
                {
                    "nick": "霸气总裁小方",
                    "userImg": "http://img1.cache.netease.com/bobo/img16/bolo1607/u=1042571727,3806961099&fm=23&gp=0.jpg",
                    "text": "周末可以躺在床上玩一天",
                    "digNum": "27"
                }
            ]
        }
    ];

    var INTRODUCE_LIST = [
        '12月16日-12月18日，网易菠萝将在杭州湖滨银泰in77三周年庆露面！在C区中庭参与舞台游戏，还有阴阳师抱枕、凹凸君限量单肩包等超精美周边等你抱回家喔！在2楼B、C区与创意相框合影，还可直接领走精美小礼包一份！',
        '#新年来碗毒鸡汤#微博活动：转发 @网易菠萝 #新年来碗毒鸡汤#置顶微博，即可参与网易菠萝年末回馈活动，有机会领走99元现金大红包1个喔！',
        '#阴阳师#抽奖活动：扫一扫右边那个blingbling的大礼包，参与网易菠萝与阴阳师合作推出的画符抽奖活动，即有机会领走阴阳师独家周边、电动牙刷、现金大礼、零食礼包等福利年货！'
    ]

    // 视频播放相关
    var Video = {
        init: function () {
            this.videoIndex = 0;
            this.$playerArea = $('.player-area');
            this.$commentArea = $('.comment-area');
            this.$videoName = $('.video-name');

            this.$video = this.$playerArea.find('video');
            this.$nextBtn = this.$playerArea.find('.next-btn');

            this.$commentCount = this.$commentArea.find('.comment-count');
            this.$postImage = this.$commentArea.find('.post-img');
            this.$commentList = this.$commentArea.find('.comment-list li');

            this.playVideo();
            this.bindEvents();
        },
        playVideo: function () {
            var self = this;
            var video = self.$video[0];
            var videoInfo = VIDEO_LIST[self.videoIndex];
            video.src = videoInfo.previewUrl;
            video.play();
            self.$videoName.text(videoInfo.title);
            self.$commentCount.text(videoInfo.commentCount);
            self.$postImage.find('a').attr('href', 'http://bolo.163.com/play?videoId=' + videoInfo.videoId);
            self.$postImage.css({backgroundImage: 'url(' + videoInfo.cover + ')'});
            
            videoInfo.commentList.forEach(function (e, i) {
                self.$commentList.eq(i).find('img').attr('src', e.userImg);
                self.$commentList.eq(i).find('.user-name').text(e.nick);
                self.$commentList.eq(i).find('.comment-content').text(e.text);
                self.$commentList.eq(i).find('.like .count').text(e.digNum);
            })
        },
        bindEvents: function () {
            var self = this;
            self.$nextBtn.on('click', function () {
               self.videoIndex = (self.videoIndex + 1) % VIDEO_LIST.length;
                self.playVideo();
            });
            self.$video.on('ended', function () {
                self.videoIndex = (self.videoIndex + 1) % VIDEO_LIST.length;
                self.playVideo();
            })
        }
    }


    // 底部文字轮播相关
    var Introduce = {
        init: function () {
            var self = this;
            this.praiseIndex = 0;
            this.$praiseArea = $('.praise-area');
            this.$potArea = $('.pot');
            this.bindEvents();

            this.changePraise();

            setInterval(function () {
                self.changePraise();
            }, 5000);
        },

        changePraise: function () {
            var self = this;
            self.$praiseArea.fadeOut(50, function () {
                self.$praiseArea.find('.wording').text(INTRODUCE_LIST[self.praiseIndex]);
                self.$potArea.find('.btn').removeClass('active');
                self.$potArea.find('.btn').eq(self.praiseIndex).addClass('active');
                self.$praiseArea.fadeIn(50);
                self.praiseIndex = (self.praiseIndex + 1) % INTRODUCE_LIST.length;
            });
        },
        
        bindEvents: function () {
            var self = this;
            self.$potArea.find('.btn').on('click', function () {
               self.praiseIndex = $(this).index();
               self.changePraise();
            });

            $('.official-qrcode .close-btn').on('click', function () {
               $(this).parent('.official-qrcode').remove();
            });
        }
    }


    // 图片轮播相关
    var ScrollGallery = {
        init: function () {
            var self = this;
            self.increment = 2;
            self.$channelContainer = $('.channel-container');
            self.$currentChannel = $('.channel').eq(0);
            self.viewWidth = $('.gallery-area').width();
            self.channelWidth = self.$currentChannel.width();
            self.$channelContainer.append(self.$currentChannel.clone());
            self.slide();
            this.interval = setInterval(self.slide, 30);

            self.bindEvents();
        },
        slide: function () {
            var self = ScrollGallery;
            var left = parseInt(self.$currentChannel.css('margin-left'));
            self.$currentChannel.css({marginLeft: left - self.increment});
            if(-left > self.channelWidth) {
                self.$channelContainer.append(self.$currentChannel.css({'margin-left': 0}));
                self.$currentChannel = $('.channel').eq(0);
            }
        },
        bindEvents: function () {
            var self = this;
            $('.gallery-area .wrap').on('mouseenter', function () {
               clearInterval(self.interval);
            }).on('mouseleave', function () {
                self.interval = setInterval(self.slide, 30);
            });
        }
    }


    $(function () {
        Video.init();
        Introduce.init();
        ScrollGallery.init()
    })

});



