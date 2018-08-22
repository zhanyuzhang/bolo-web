/**
 * Created by chesszhang on 2016/9/22
 */

define(function(require, exports, module) {
    'use strict';
    var $ = require('zepto@1-1-4'),
        uadetector = require('uadetector@1-0-x'),
        Stat = require('/common/Stat@1-0-x'),
        wechat = require('/common/wechat@1-0-x'),
        native = require('/common/native@1-0-x');

    var App = {
        init: function () {
            // 获取常用的JQuery实例
            this.$wrapper = $('.wrapper');
            this.$homePage = $('.home-page');
            this.$playbackPage = $('.playback-page');
            this.$puzzlePage = $('.puzzle-page');
            this.$congratulatePage = $('.congratulate-page');
            this.$murderPage = $('.murder-page');
            this.$figurePage = $('.figure-page');
            this.$sharePage = $('.share-page');
            this.$inputWindow = $('.input-window');
            this.$modalWindow = $('.modal-window');
            this.$gestureWindow = $('.gesture-window');
            this.$player = $('.player');
            this.$video = this.$player.find('video');
            this.$musicPlayer = $('.music-player');
            this.$audio = $('.music-player audio');
            this.$musicPlayerSwitch = $('.music-player-switch');
            this.$leftImgs = $('.left-img');
            this.$tips = $('.tips');
            this.$tipsAngle = this.$tips.find('.tips-angle');
            this.$downloadBtn = this.$sharePage.find('.download-btn .btn');
            this.isCorrectOrder = false;
            this.roleNumber = 0; //角色编号：0-沈凡；1-班主任；2-蛤蛤；3-反犬
            this.roleFeature = [
               '#原来我是福尔摩斯#我正在调查一宗校园连环杀人案',
               '#原来我是意识流派#我正在调查一宗校园连环杀人案',
               '#原来我是狗腿王#我正在调查一宗校园连环杀人案',
               '#原来我是西方记者#我正在调查一宗校园连环杀人案',
            ];
            this.pageNumber = 1; // 页码
            this.evidence = null; // 用户输入的证词，分享时会用到
            this.isPlayingMusic = true;
            this.part = 1;
            this.$video[0].load(); // 加载视频
            this.animateInterval(); //
            this.bindEvents(); // 绑定事件
            Stat.send('木偶判定二次推广', {
                label: '第' + this.pageNumber + '页'
            });
            // this.$bottom[0].scrollIntoView(false);

        },
        wechatShareInfo: {
            title: '#我达成了【初级侦探】成就# 你有一宗未解的校园连环杀人案',
            desc: '杀完3个人之后，他距离死亡还有3个小时',
            link: document.location.href,
            imgUrl: 'http://img1.cache.netease.com/bobo/2016/11/12/20161112191743e9da6.png',
            success: function (res) {
                Stat.send('木偶判定二次推广', {
                    label: '微信分享：第' + App.part + '关'
                });
                // App.showTips('分享成功！',{top: '1rem'}).hideTips(2000);
            },
            cancel: function (res) {
                App.showTips('已取消分享！',{top: '1rem'}).hideTips(2000);
            },
            fail: function (res) {
                App.showTips('分享失败！',{top: '1rem'}).hideTips(2000);
            }
        },
        weiboShareInfo: {
            title: '#我达成了【初级侦探】成就#你有一宗未解的校园连环杀人案',
            pic: 'http://img1.cache.netease.com/bobo/2016/11/12/20161112191743e9da6.png'
        },
        bindEvents: function () {
            var me = this;
            me.$wrapper.on('touchstart', function (e) {
                var target = e.target;
                switch (target) {
                    case me.$homePage.find('.next-btn')[0]:
                        me.nextPage(me.$homePage, me.$playbackPage);
                        clearInterval(me.animateInterval);
                        me.playVideo();
                        break;
                    case me.$playbackPage.find('.next-btn')[0]:
                        me.stopVideo();
                        me.nextPage(me.$playbackPage, me.$puzzlePage);
                        me.$modalWindow.removeClass('hidden');
                        me.$gestureWindow.removeClass('hidden');
                        me.$puzzlePage.find('.img-container img').each(function () {
                            $(this).attr('src', this.dataset.src);
                        });
                        Drag.init(me.checkImgOrder.bind(me));
                        break;
                    case me.$puzzlePage.find('.replay-btn')[0]:
                        me.playVideo();
                        me.$player.find('.close-player').removeClass('transparent');
                        uadetector.isOS('android') && me.$modalWindow.removeClass('hidden');
                        break;
                    case me.$player.find('.close-player')[0]:
                        me.stopVideo();
                        uadetector.isOS('android') && me.$modalWindow.addClass('hidden');
                        break;
                    case me.$puzzlePage.find('.next-btn')[0]:
                        me.stopVideo();
                        if(me.isCorrectOrder) {
                            me.nextPage(me.$puzzlePage, me.$congratulatePage);
                            me.registShareEvent('#我达成了【初级侦探】成就# 你有一宗未解的校园连环杀人案');
                            me.hideTips(0);
                        } else {
                            var msg = '事件顺序不对，无法进入一关！请拖动红框内的图片交接顺序！';
                            me.showTips(msg, {bottom: '2rem'});
                            me.hideTips(2000);
                        }
                        break;
                    case me.$congratulatePage.find('.next-btn')[0]:
                        me.nextPage(me.$congratulatePage, me.$murderPage);
                        me.part++;
                        break;
                    case me.$congratulatePage.find('.share-btn')[0]:
                        me.share();
                        break;
                    case me.$murderPage.find('.murder')[0]:
                    case me.$murderPage.find('.murder')[1]:
                    case me.$murderPage.find('.murder')[2]:
                    case me.$murderPage.find('.murder')[3]:
                        me.nextPage(me.$murderPage, me.$figurePage);
                        me.roleNumber = [].indexOf.call(me.$murderPage.find('.murder'), target);
                        var figure = me.$figurePage.find('.figure')[me.roleNumber];
                        figure.classList.remove('hidden');
                        $(figure).find('img')[0].src = $(figure).find('img')[0].dataset.src;
                        break;
                    case me.$murderPage.find('.pre-btn')[0]:
                        me.prePage(me.$murderPage, me.$congratulatePage);
                        break;
                    case me.$figurePage.find('.pre-btn')[0]:
                        me.prePage(me.$figurePage, me.$murderPage);
                        me.$figurePage.find('.figure')[me.roleNumber].classList.add('hidden');
                        break;
                    case me.$figurePage.find('.input-btn')[0]:
                        me.showInputWindow();
                        break;
                    case me.$inputWindow.find('.submit-btn')[0]:
                        me.evidence = me.$inputWindow.find('.input-field').val().trim();
                        if(me.evidence) {
                            var msg = '保存成功，点击"完成"进入下一页，分享之后别人会看到你的证词哦！';
                            me.showTips(msg, {bottom: '1.8rem'}, 2);
                            me.hideTips(3000);
                        }
                    case me.$inputWindow.find('.cancel-btn')[0]:
                        me.$inputWindow.find('.input-field')[0].blur();
                        me.$inputWindow.addClass('hidden');
                        me.$modalWindow.addClass('hidden');
                        break;
                    case me.$figurePage.find('.next-btn')[0]:
                        me.nextPage(me.$figurePage, me.$sharePage);
                        me.$musicPlayerSwitch.addClass('hidden');
                        var shareImg = me.$sharePage.find('.share-img')[me.roleNumber];
                        shareImg.classList.remove('hidden');
                        shareImg.src = shareImg.dataset.src;
                        var title = me.roleFeature[me.roleNumber];
                        me.evidence && (title += '#' + me.evidence + '#');
                        me.registShareEvent(title);
                        break;
                    case me.$sharePage.find('.share-btn')[0]:
                        me.share();
                        break;
                    case me.$downloadBtn[0]:
                        native.download('木偶判定推广页');
                        break;
                    case me.$musicPlayerSwitch[0]:
                        me.isPlayingMusic ? me.$audio[0].pause() : me.$audio[0].play();
                        break;
                    case me.$gestureWindow[0]:
                        me.$modalWindow.addClass('hidden');
                        me.$gestureWindow.addClass('hidden');
                        break;
                    default:
                        break;
                }
            });
            this.$video[0].onpause = function () {
                if(!me.$puzzlePage.hasClass('hidden') && uadetector.isOS('ios')) {
                    me.$player.addClass('hidden');
                }
                me.$audio[0].play();
            };
            this.$video[0].onplay = function () {
                me.$audio[0].pause();
            };
            this.$audio[0].onpause = function () {
                me.$musicPlayerSwitch.removeClass('music-player-switch-on').addClass('music-player-switch-off');
                me.isPlayingMusic = false;
            };
            this.$audio[0].onplay = function () {
                me.$musicPlayerSwitch.removeClass('music-player-switch-off').addClass('music-player-switch-on');
                me.isPlayingMusic = true;
            };
        },
        animateInterval: function () {
            var boxSize = [{width: '4rem', height: '4rem'}, {width: '3.9rem', height: '3.9rem'}],
                me = this,
                index = 1;
           me.animateInterval = setInterval(function () {
                me.$homePage.find('.next-btn').animate(boxSize[index], 200);
               index = +(!index);
            }, 200);
        },
        nextPage: function ($current, $next) {
            $current.addClass('hidden');
            $next.removeClass('hidden');
            $(window).scrollTop(0);
            Stat.send('木偶判定二次推广', {
                label: '第' + (++this.pageNumber) + '页'
            });
            // this.$bottom[0].scrollIntoView(false);
        },
        prePage: function ($current, $pre) {
            $current.addClass('hidden');
            $pre.removeClass('hidden');
            $(window).scrollTop(0);
            Stat.send('木偶判定二次推广', {
                label: '第' + (--this.pageNumber) + '页'
            });
            // this.$bottom[0].scrollIntoView(false);
        },
        playVideo: function () {
            this.$player.removeClass('hidden');
            if(!this.$puzzlePage.hasClass('hidden')) {
                this.$video[0].play();
            }
        },
        stopVideo: function () {
            this.$player.addClass('hidden');
            var video = this.$video[0];
            video.readyState !== 0 && (video.currentTime = 0);
            video.pause();
        },
        // 检查图片的顺序是否正确
        checkImgOrder: function (Drag) {
            var me = this;
            var count = 0;
            me.$leftImgs.each(function (i) {
                if(i === +this.dataset.order) {
                    $(this).removeClass('draggable').removeClass('wrong-img').addClass('correct-img');
                    if(++count === 3) {
                        me.isCorrectOrder = true;
                        // me.$puzzlePage.find('.next-btn')[0].scrollIntoView(false);
                        $(document).off('touchstart', Drag.touchStart); // 解除拖动
                        me.showTips('事件顺序正确！请点击"完成"按钮进入下一环节！', {bottom: '1.5rem'}, 2);
                    }
                }
            });
        },
        showTips: function (msg, position, type) {
            // this.$tips.removeClass('hidden');
            this.$tips.find('.content').text(msg);
            this.$tips.removeClass('hidden');
            this.style = null;
            this.$tips.css(position);
            if(type === 1) {
                this.$tipsAngle.addClass('tips-angle-right-up');
            } else if(type === 2) {
                this.$tipsAngle.addClass('tips-angle-right-down');
            }
            return this;
        },
        showInputWindow: function () {
            var me = this,
                $inputField = me.$inputWindow.find('.input-field');
            me.$inputWindow.removeClass('hidden');
            me.$modalWindow.removeClass('hidden');
            $inputField[0].rows = 20;
            setTimeout(function () {
                $inputField[0].rows = 4;
            }, 50);
            $inputField[0].focus();
        },
        hideTips: function (delay) {
            var me = this;
            delay = delay || 0;
            setTimeout(function () {
                me.$tips.addClass('hidden');
                me.$tips.removeAttr('style');
                me.$tipsAngle.removeClass('tips-angle-right-up').removeClass('tips-angle-right-down');
            }, delay);
        },

        registShareEvent: function (title) {
            var me = this;
            me.weiboShareInfo.title = title;
            me.wechatShareInfo.title = title;
            wechat.share(me.wechatShareInfo);
        },

        share: function (title) {
            var me = this;
          if(uadetector.is('MicroMessenger')) {
              me.showTips('请点击右上角，选择"分享到朋友圈"或者"发送给好友"！', {top: '1rem'}, 1).hideTips(3000);
          } else if(uadetector.is('Weibo')) {
              me.shareByWeibo(me.weiboShareInfo);
          } else {
              // me.shareByWeibo(me.weiboShareInfo);
              // me.shareByWeibo(me.weiboShareInfo);
              me.showTips('亲，需要复制链接到微信或微博打开才可以分享哦！', {top: '3rem'}).hideTips(2000);
          }
        },

        shareByWeibo: function(conf) {
            var _shareUrl = 'http://v.t.sina.com.cn/share/share.php?&appkey=895033136';
            _shareUrl += '&url='+ encodeURIComponent(conf.url||document.location);
            _shareUrl += '&title=' + encodeURIComponent(conf.title||document.title);
            _shareUrl += '&source=' + encodeURIComponent(conf.source ||'');
            _shareUrl += '&sourceUrl=' + encodeURIComponent(conf.sourceUrl|| '');
            _shareUrl += '&content=' + 'utf-8';
            _shareUrl += '&pic=' + encodeURIComponent(conf.pic||'');
            document.location.href = _shareUrl;
            Stat.send('木偶判定二次推广', {
                label: '微博分享：第' + App.part + '关'
            });
        }
    };

    // 拖拽
    var Drag = {
        init: function (dragCallback) {
            this.srcImg = null;
            this.clonedImg = null;
            this.diffX = 0;
            this.diffY = 0;
            this.clientX = 0;
            this.clientY = 0;
            // 把事件方法的上下文绑定到Drag对象
            this.touchStart = this.touchStart.bind(this);
            this.touchEnd = this.touchEnd.bind(this);
            this.touchMove = this.touchMove.bind(this);
            dragCallback && (this.dragCallback = dragCallback);
            $(document).on('touchstart', this.touchStart);
        },
        touchStart: function(e) {
            if(!$(e.target).hasClass('draggable')) {
                return;
            }
            var touch = e.touches[0],
                img = e.target;

            this.srcImg = img;
            this.clonedImg = $(img).clone().addClass('dragging-img').insertAfter($(img))[0];
            this.clientX = touch.clientX;
            this.clientY = touch.clientY;
            this.diffX = this.clientX - img.offsetLeft;
            this.diffY = this.clientY - img.offsetTop;
            this.moveImg();
            $(document).on('touchmove', this.touchMove);
            $(document).on('touchend', this.touchEnd);
            e.preventDefault();
            e.stopPropagation();
        },
        touchMove: function (e) {
            var touch = e.touches[0];
            this.clientX = touch.clientX;
            this.clientY = touch.clientY;
            this.moveImg();
            e.preventDefault();
            e.stopPropagation();
        },
        touchEnd: function (e) {
            var touch = e.touches[0];
            //移除在document上添加的两个事件
            $(document).off("touchend", this.touchEnd);
            $(document).off("touchmove", this.touchMove);
            this.stopMoveImg();
            e.preventDefault();
        },

        moveImg: function () {
            this.clonedImg.style.top = (this.clientY - this.diffY) + 'px';
            this.clonedImg.style.left = (this.clientX - this.diffX) + 'px';
        },
        // 停止移动图片时，进行判断，看是否符合交换图片的条件！
        stopMoveImg: function () {
            var me = this,
                clonedImg = me.clonedImg,
                halfWidth = $(clonedImg).width() / 2,
                halfHeight = $(clonedImg).height() / 2;

            if(clonedImg.offsetLeft > halfWidth) {
                $(me.clonedImg).remove();
                return;
            }
            $('.draggable').each(function () {
                var img = this;
                var offsetY = clonedImg.offsetTop - img.offsetTop;
                if(img !== me.srcImg) {
                    if(offsetY > 0 && offsetY < halfHeight || offsetY < 0 && offsetY > -halfHeight) {
                        me.swapProperty(me.srcImg, img, 'src');
                        me.swapProperty(me.srcImg.dataset, img.dataset, 'order');
                        me.dragCallback && me.dragCallback(me);
                    }
                }
            });
            $(me.clonedImg).remove();
        },
        // 交换两个对象的属性
        swapProperty: function(obj1, obj2, proprety) {
            var temp = obj1[proprety];
            obj1[proprety] = obj2[proprety];
            obj2[proprety] = temp;
        }
    };

    $(function () {
        App.init();
    });
});
