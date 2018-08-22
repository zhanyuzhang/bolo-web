/**
 * Created by chesszhang on 2016/9/22
 */
define(function(require, exports, module) {
  'use strict';
  var $ = require('zepto@1-1-4'),
      uadetector = require('uadetector@1-0-x'),
      Stat = require('/common/Stat@1-0-x'),
      wechat = require('/common/wechat@1-0-x'),
      HttpHelper = require('/common/HttpHelper@1-0-x'),
      native = require('/common/native@1-1-x');

  var Timmer = {
    init: function (timmerConfig) {
      var self = this;
      this.onlineTime = timmerConfig.onlineTime;
      this.offlineTime = timmerConfig.offlineTime;
      this.type = timmerConfig.type; // 1未开始，2已开始
      this.targetTime = this.type === 1 ? this.onlineTime : timmerConfig.offlineTime;
      this.$day = $('.day');
      this.$hour = $('.hour');
      this.$minute = $('.minute');
      this.$minute = $('.minute');
      this.$second = $('.second');

      if(self.type === 1) {
        $('.header .wording').text('距离活动开始还剩');
      }

      this.interval =  setInterval(function () {
        self.updateCountdown();
      }, 1000);
    },

    // 更新倒计时
    updateCountdown: function () {
      var self = this;
      var dayRate = 1000 * 60 * 60 * 24,
          hourRate = 1000 * 60 * 60,
          minuteRate = 1000 * 60,
          secondRate = 1000,
          rateList = [dayRate, hourRate, minuteRate, secondRate],
          $elList = [this.$day, this.$hour, this.$minute, this.$second],
          timeGap = self.targetTime - Date.now();

      if(timeGap <= 1) {
        clearInterval(self.interval); // 清除定时器
        App.$ticketBeforeClick.find('.get-btn').removeClass('disabled');
        $('.high-bit').text(0);
        $('.low-bit').text(0);

        if(self.type === 1) {
          self.targetTime = self.offlineTime;
          self.type = 2;
          $('.get-btn').removeClass('disabled');
          $('.header .wording').text('距离活动结束还剩');
          self.interval = setInterval(function () {
            self.updateCountdown();
          }, 1000);
        }
      }

      rateList.forEach(function (e, i) {
        self.updateView(parseInt(timeGap / e), $elList[i]);
        timeGap %= e;
      });

    },

    // 更新定时器的DOM
    updateView: function (value, $el) {
      value = value < 0 ? 0 : value;
      value = value >= 10 ? value + '' : '0' + value;
      $el.find('.high-bit').text(value[0]);
      $el.find('.low-bit').text(value[1]);
    }
  }



  var App = {
    init: function (userInfo) {
      this.activityCode = '20161208';
      userInfo.activityCode = this.activityCode;
      this.userInfo = userInfo;
      this.$wrapper = $('.wrapper');
      this.$header = $('.header');
      this.$ticketBeforeClick = $('.ticket-before-click');
      this.$ticketAfterClick = $('.ticket-after-click');
      this.$recommend = $('.recommend');
      this.$warnWindow = $('.warn-window');
      this.$endedWarnWindow = $('#is-ended');
      this.$notStartWarnWindow = $('#not-start');
      this.$modalWindow = $('.modal-window');

      this.bindEvents();
      this.getActivityInfo(this.activityCode);
    },

    // 获取活动相关信息
    getActivityInfo: function (activityCode) {
      var self = this;
      $.ajax({
        url: HttpHelper.getOrigin() + '/bolo/api/gift/timeLimitedActivityInfo',
        dataType: 'json',
        data: {
          activityCode: activityCode
        },
        success: function(result) {
          if(result.success) {
            self.activityInfo = result;
            if(result.onlineTime > Date.now()) {
              self.$header.find('.count').text(result.redeemCodeSize);
              Timmer.init({
                onlineTime: result.onlineTime,
                offlineTime: result.offlineTime,
                type: 1
              });
            } else if(result.onlineTime < Date.now() && result.offlineTime > Date.now()) {
              self.$ticketBeforeClick.find('.get-btn').removeClass('disabled');
              self.$header.find('.count').text(result.redeemCodeSize);
              Timmer.init({
                onlineTime: result.onlineTime,
                offlineTime: result.offlineTime,
                type: 2
              });
            }
          }
        }
      })
    },

    // 抢购
    seckill: function (userInfo) {
      var self = this;
      $.ajax({
        url: HttpHelper.getOrigin() + '/bolo/api/gift/timeLimitedActivity',
        dataType: 'json',
        data: userInfo,
        success: function(result) {
          if(result.success) {
            self.$ticketBeforeClick.addClass('hidden');
            self.$ticketAfterClick.removeClass('hidden').find('.code').text(result.redeemCode);
          }
        }
      });
    },

    bindEvents: function () {
      var self = this;

      self.$ticketBeforeClick.find('.get-btn').tap(function (event) {
        Stat.send(event.target.dataset.stat);
        if(!native.hello()) {
          location.href = '/m/download';
          return;
        }

        if(!self.userInfo.userId) {
          native.call('loginApp');
        } else if(Date.now() < self.activityInfo.onlineTime) {
          self.$notStartWarnWindow.removeClass('hidden');
          self.$modalWindow.removeClass('hidden');
        } else if(Date.now() > self.activityInfo.offlineTime) {
          self.$endedWarnWindow.removeClass('hidden');
          self.$modalWindow.removeClass('hidden');
        } else  {
          self.seckill(self.userInfo);
        }
      });

      self.$ticketAfterClick.find('.get-btn').tap(function (event) {
        Stat.send(event.target.dataset.stat);
        location.href = '/m/hybrid/cdkey';
      });

      self.$recommend.find('.read-more').tap(function (event) {
        if(!native.hello()) {
          location.href = '/m/channel?userId=' + '-182841557846182616';
          return;
        }
        native.call('openChannel', {
          channelId: '-182841557846182616'
        });
      });

      self.$recommend.find('.recommend-video').tap(function (event) {
        var target = event.target;
        Stat.send(target.dataset.stat);
        if(!native.hello()) {
          location.href = '/m/play?videoId=' + target.dataset.vid;
          return;
        }
        native.call('openVideo', {
          videoId: target.dataset.vid
        });
      });

      self.$warnWindow.find('.close-btn').tap(function (event) {
        self.$warnWindow.addClass('hidden');
        self.$modalWindow.addClass('hidden');
      });

      self.$warnWindow.find('.stay-btn').tap(function (event) {
        self.$warnWindow.addClass('hidden');
        self.$modalWindow.addClass('hidden');
      });

      self.$warnWindow.find('.leave-btn').tap(function (event) {
        Stat.send(event.target.dataset.stat);
        if(!native.hello()) {
          location.href = '/m/channel?userId=' + '-182841557846182616';
          return;
        }
        native.call('openChannel', {
          channelId: '-182841557846182616'
        });
      });
    }
  };

  $(function () {
    native.userPromise.then(function(userInfo) {
      if(!userInfo.userId) {
        userInfo = {};
      }
      native.call('showShareMenu', {
        flag: true
      });
      native.call('setShareInfo', {
        "default":{
          "title": "梅嘲讽免费观影券限时秒杀ing！",
          "description":"梅嘲讽特别篇在网易菠萝独家上线啦~来，这里有菠萝菌珍藏多年的一张免费观影券，送给你了！",
          "image":"http://img2.cache.netease.com/bobo/2016/12/8/20161208151028b125a.png",
          "url": location.href
        },
        "weibo":{
          "title": "梅嘲讽免费观影券限时秒杀ing！",
          "description":"梅嘲讽特别篇在网易菠萝独家上线啦~来，这里有菠萝菌珍藏多年的一张免费观影券，送给你了！ " + location.href,
          "image":"http://img2.cache.netease.com/bobo/2016/12/8/20161208151028b125a.png",
          "url": location.href
        }
      });
      App.init(userInfo);
    }, function () { // 在外部打开
      wechat.share({
        title: '梅嘲讽免费观影券限时秒杀ing！',
        desc: '梅嘲讽特别篇在网易菠萝独家上线啦~来，这里有菠萝菌珍藏多年的一张免费观影券，送给你了！',
        link: document.location.href,
        imgUrl: 'http://img2.cache.netease.com/bobo/2016/12/8/20161208151028b125a.png'
      });
      App.init({});
    });
  });
});