/**
 * Created by chesszhang on 2016/12/12
 */
define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery@1-11-x'),
        HttpHelper = require('/common/HttpHelper@1-0-x'),
	    videoCardList = require('/pages/pc/newbolo/components/video-card-list@1-0-x'),
        qs = require('querystring@1-0-x'),
        user = require('/common/user/1-0-x/user-debug.js');

    var GameBgList = {
        swxf: '/dev/images/pages/pc/newbolo/game/1-0-x/bg_swxf.jpg',
        lscs: '/dev/images/pages/pc/newbolo/game/1-0-x/bg_lscs.jpg',
        lol: '/dev/images/pages/pc/newbolo/game/1-0-x/bg_lol.jpg',
        gx: '/dev/images/pages/pc/newbolo/game/1-0-x/bg_fun.jpg',
        dh: '/dev/images/pages/pc/newbolo/game/1-0-x/bg_fun.jpg'
    };


    var App = {
        init: function () {
            this.$wrapper = $('.wrapper');
            this.$channel = $('.channel');
            this.$video = $('video');
            this.$videoInfo = $('.video-info');
            this.$progress = $('.progress');
            this.$cover = $('.header .cover');
            this.$danmakuWrapper = $('.player .danmaku')
            this.danmakuSet = $.extend(true, {}, DANMAKU);
            this.channelStatus = new Array(this.$channel.length).join(',').split(',').map(function () {
                return 0;
            });
            this.$controlBar = $('.control');
            this.showControlForMoment();
            this.$cover.css({background: 'url(' + GameBgList[qs.parse().zoneName] + ') no-repeat center / cover'});
            this.bindEvents();
        },
        replaceTpl: function (tpl, data) {
            return tpl.replace(/\${(\w+)}/, function ($0, $1) {
                return data[$1];
            });
        },
        showControlForMoment: function () {
            var self = this;
            this.$controlBar.addClass('show');
            setTimeout(function () {
                self.$controlBar.removeClass('show');
            }, 5000);
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
        
        playVideo: function () {
            this.$video[0].play();
        },

        bindEvents: function () {
            var self = this;
            var video = self.$video[0];
            this.$wrapper.on('click', '.player .play-btn', function () {
                video.paused ? video.play() : video.pause();
            }).on('click', '.muted-btn', function () {
                video.muted = video.muted ? false : true;
            }).on('click', '.danmaku-btn', function () {
                location.href = '/new/play?videoId=' + VIDEO_INFO.videoId;
            }).on('click', '.card-box .menu .title', function () {
	            var $this = $(this);
	            $this.addClass('active').siblings('.title').removeClass('active');
	            self.$wrapper.find('.' + $this.data('type')).removeClass('hide').siblings('.game-video-list').addClass('hide');
            });

            this.$danmakuWrapper.on('click', function () {
               location.href = '/new/play?videoId=' + VIDEO_INFO.videoId;
            });

            this.$video.on('timeupdate', function () {
                // 更新进度条
                var currentWidth = self.$progress.width();
                self.$progress.find('.pass').css({width: currentWidth * (this.currentTime / this.duration)});
                // 更新弹幕
                self.createDanmaku(parseInt(this.currentTime));
            }).on('ended', function () {
                self.danmakuSet = $.extend(true, {}, DANMAKU);
                // $('#play-checkbox')[0].checked = true;
            });
        }
    };

    App.init();
	videoCardList.init();
});




