/**
 * Created by chesszhang on 2016/01/11
 */
define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery@1-11-x'),
        user = require('/common/user/1-0-x/user-debug.js'),
        HttpHelper = require('/common/HttpHelper@1-0-x'),
	    comment = require('/pages/pc/newbolo/play/1-0-x/modules/comment'),
	    videoCardList = require('/pages/pc/newbolo/components/video-card-list@1-0-x');

    var App = {
        init: function () {
            this.showDanmaku = true;
            this.isSliding = false;
            this.hasFollow = CHANNEL_INFO.hasFollow;
            this.hasFavor = VIDEO_INFO.hasFavor;
            this.$wrapper = $('.wrapper');
            this.$danmaku = $('.danmaku');
            this.$danmakuBar = $('.danmaku-bar');
            this.$channel = $('.channel');
            this.$video = $('video');
            this.$videoInfo = $('.video-info');
            this.$progress = $('.progress-area');
            this.$controlBar = $('.control-bar');
            this.$progressSlideBar = this.$progress.find('.slide-bar');
            this.$buttonBar = $('.info .button-bar');
            this.$playCheckbox = $('#play-checkbox');
            this.$curProgress = this.$progress.find('.current');
            this.$curTime = this.$wrapper.find('.time .current');
            this.$volumeBox = $('.volume-box');
            this.$totalVolume = this.$volumeBox.find('.total-volume');
            this.$curVolume = this.$volumeBox.find('.current-volume');
            this.$volumeSlideBar = this.$volumeBox.find('.slide-bar');
            this.danmakuSet = $.extend(true, {}, DANMAKU);
            this.channelStatus = new Array(this.$channel.length).join(',').split(',').map(function () {
                return 0;
            });
            this.showControlForMoment();
            this.setActiveMenu();
            this.moveProgress = this.moveProgress.bind(this);
            this.stopMoveProgress = this.stopMoveProgress.bind(this);
            this.moveVolume = this.moveVolume.bind(this);
            this.stopMoveVolume = this.stopMoveVolume.bind(this);
            this.bindEvents();
        },
        setActiveMenu: function () {
            $('.side-bar .item').each(function () {
                if(this.dataset.name === VIDEO_INFO.zoneName) {
                    this.classList.add('current');
                    console.log(VIDEO_INFO.zoneName, this.dataset.name)
                }
            })
        },
        formatCurrentTime: function(duration) {
            duration = parseInt(duration);
            var minute = parseInt(duration / 60),
                    second = duration % 60;
            return  (minute >= 10 ? minute : '0' + minute) + ':' + (second >= 10 ? second : '0' + second);
        },
        // 通过enter键发送信息
        sendMsgByEnterKey: function ($input, $btn) {
            $input.on('focus', function () {
                $(document).on('keydown', function (e) {
                    if((e.keyCode || e.which) === 13) {
                        $btn.trigger('click');
                    }
                });
            }).on('blur', function () {
                $(document).off('keydown');
            });
        },
        createDanmaku: function(time) {
            var self = this;
            if(!this.danmakuSet[time]) {
                return;
            }
            this.danmakuSet[time].forEach(function (danmaku) {
                var marquee = document.createElement('div');
                marquee.innerHTML = danmaku;
                marquee.className = 'marquee';
                for(var i = 0; i < self.channelStatus.length; i++) {
                    if(self.channelStatus[i] === 0) {
                        break;
                    }
                }
                if(i > self.channelStatus.length) {
                    i = Math.min.apply(null, self.channelStatus);
                }
                self.$channel.eq(i).append(marquee);
                self.channelStatus[i]++;
                $(marquee).animate({left: '-' + (18 * danmaku.length) + 'px'}, 8000, function () {
                    self.channelStatus[i]--;
                    $(this).remove();
                });
            });
            delete this.danmakuSet[time]; // 把弹幕删除掉
        },
        showControlForMoment: function () {
            var self = this;
            this.$controlBar.addClass('show');
            setTimeout(function () {
                self.$controlBar.removeClass('show');
            }, 5000);
        },
        // 拖动视频进度条滑块
        moveProgress: function (e) {
            var offsetLeft = this.$progress.offset().left;
            var pageX = e.pageX;
            var totalWidth = this.$progress.width();
            var curWidth = pageX - offsetLeft;
            curWidth = curWidth <= 0 ? 0 : curWidth >= totalWidth ? totalWidth : curWidth;
            this.$progressSlideBar.css({'left': curWidth + 'px'});
            this.$curProgress.css({width: curWidth + 'px'});
        },
        // 停止拖动时，更新视频的currentTime
        stopMoveProgress: function () {
            // 移除事件
            $(document).off('mousemove', this.moveProgress).off('mouseup', this.stopMoveProgress);
            this.isSliding = false;
            var curWidth = parseInt(this.$progressSlideBar.css('left'));
            var totalWidth = this.$progress.width();
            var curTime = (curWidth / totalWidth) * (this.$video[0].duration);
            this.$video[0].currentTime = curTime.toFixed(2);
            this.danmakuSet = $.extend(true, {}, DANMAKU);
        },
        // 更新进度条
        updateProgress: function () {
            var totalWidth = this.$progress.width();
            var curTime = this.$video[0].currentTime;
            var totalTime = this.$video[0].duration;
            if(!this.isSliding) {
                this.$curProgress.css({width: totalWidth * (curTime / totalTime)});
                this.$progressSlideBar.css({left: totalWidth * (curTime / totalTime)});
            }
            this.$curTime.html(this.formatCurrentTime(this.$video[0].currentTime));
        },

        // 移动音量滑块
        moveVolume: function (e) {
            var offsetTop = this.$totalVolume.offset().top;
            var pageY = e.pageY;
            var totalHeight = this.$totalVolume.height();
            var curHeight = (offsetTop + totalHeight) - pageY;
            if(curHeight >= totalHeight || curHeight <= 0) return;
            this.$video[0].volume = (curHeight / totalHeight).toFixed(1);
            this.$video[0].muted = false;
            $('#muted-checkbox')[0].checked = false;
            this.updateVolume(curHeight);
        },
        stopMoveVolume: function () {
            $(document).off('mousemove', this.moveVolume).off('mouseup', this.stopMoveVolume);
        },
        updateVolume: function (curHeight) {
            this.$volumeSlideBar.css({'bottom': (curHeight + parseInt(this.$totalVolume.css('bottom')) - 1) + 'px'});
            this.$curVolume.css({height: curHeight + 'px'});
        },

        sendDanmaku: function () {
            var self = this,
                $danmakuInput = $('.danmaku-bar .danmaku-input'),
                content = $danmakuInput.val().trim(),
                currentTime = parseInt(this.$video[0].currentTime) + 1; // 延迟一秒
            if(!content) return; // 内容为空
            if(!user.isLogin()) return user.login(); // 没有登陆
            $danmakuInput.val('');
            $.ajax({
                url: HttpHelper.getOrigin() + '/bolo/api/video/comment',
                dataType: 'json',
                data: {
                    userId: user.getInfo().userIdStr,
                    videoId: VIDEO_INFO.videoId,
                    content: content,
                    videoPlayTime: currentTime * 1000,
                    type: 1
                },
                success: function(result) {
                    if(!result.success) return  $danmakuInput.val(content); // 失败
                    DANMAKU[currentTime] = (DANMAKU[currentTime] ? DANMAKU[currentTime] : []).concat(content);
                    self.danmakuSet[currentTime] = DANMAKU[currentTime];
                },
                failure: function () {
                    $danmakuInput.val(content);
                }
            });
        },
        favorVideo: function ($likeBtn) {
            var self = this;
            if(!user.isLogin()) return user.login(); // 没有登陆
            if(self.hasFavor) return;
            $.ajax({
                url: HttpHelper.getOrigin() + '/bolo/api/video/favor',
                dataType: 'json',
                data: {
                    userId: user.getInfo().userIdStr,
                    videoId: VIDEO_INFO.videoId,
                    favor: true
                },
                success: function(result) {
                    if(!result.success) return;
                    var likeCount = parseInt($likeBtn.text().trim() || 0);
                    $likeBtn.text(likeCount + 1);
                    $likeBtn.addClass('active');
                    self.hasFavor = true;
                },
                failure: function () {
                    alert('失败')
                }
            });
        },

        follow: function ($followBtn) {
            var self = this;
            if(!user.isLogin()) return user.login(); // 没有登陆
            $.ajax({
                url: HttpHelper.getOrigin() + '/bolo/api/web/user/follow',
                dataType: 'json',
                data: {
                    userId: user.getInfo().userIdStr,
                    follow: !self.hasFollow,
                    followedId: VIDEO_INFO.userIdStr,
                },
                xhrFields: {
                    withCredentials: true
                },
                success: function(result) {
                    if(!result.success) return;
                    self.hasFollow = !self.hasFollow;
                    self.hasFollow ? $followBtn.addClass('followed').removeClass('to-follow') :
                            $followBtn.addClass('to-follow').removeClass('followed')
                },
                failure: function () {
                    alert('失败')
                }
            });


        },

        bindEvents: function () {
            var self = this;
            var video = self.$video[0];
            self.sendMsgByEnterKey($('.danmaku-bar .danmaku-input'), $('.danmaku-bar .submit-btn'));
            // 控制条相关
            self.$controlBar.on('click', '.play-btn', function () { // 播放开关
                video.paused ? video.play() : video.pause();
            }).on('click', '.muted-btn', function () { // 静音开关
                video.muted = !video.muted;
                self.updateVolume(video.muted ? 0 : video.volume * self.$totalVolume.height());
            }).on('click', '.danmaku-btn', function () { // 弹幕开关
                self.showDanmaku ? self.$danmaku.hide() : self.$danmaku.show();
                self.showDanmaku = !self.showDanmaku;
            });
            // 评论、点赞和关注按钮
            self.$buttonBar.on('click', '.comment-btn', function () { // 点击评论
                $('.play-comment-box')[0].scrollIntoView(true);
                $('.say-box input')[0].focus();
            }).on('click', '.like-btn', function () { // 点赞（收藏）
                self.favorVideo($(this));
            }).on('click', '.follow-btn', function () { // 加关注
                self.follow($(this));
            });

            self.$channel.on('click', function () {
                video.paused ? video.play() : video.pause();
                self.$playCheckbox[0].checked = !self.$playCheckbox[0].checked
            });

            // 发弹幕
            self.$danmakuBar.on('click', '.submit-btn.enabled', function () {
                self.sendDanmaku();
            });


            // 视频事件
            this.$video.on('timeupdate', function () {
                self.updateProgress();
                self.createDanmaku(parseInt(this.currentTime));
            }).on('ended', function () {
                self.danmakuSet = $.extend(true, {}, DANMAKU);
                $('#play-checkbox')[0].checked = true;
            });

            // 拖动进度条相关
            self.$progress.on('mousedown', function (e) {
                self.isSliding = true;
                self.moveProgress(e);
                $(document).on('mousemove', self.moveProgress).on('mouseup', self.stopMoveProgress);
            });

            // 拖动音量条
            self.$volumeBox.on('mousedown', function (e) {
                self.moveVolume(e);
                $(document).on('mousemove', self.moveVolume).on('mouseup', self.stopMoveVolume);
            });
        }
    };

    App.init();
	comment.init();
	videoCardList.init();

});




