// 参数要求：
// http://local.bobo.com:3000/m/invitation/code?title=大力金刚第3季&code=12345&debug&setId=13234
define(function(require, exports, module) {
    'use strict';

    var $ = require('zepto@1-1-4'),
        qs = require('querystring@1-0-x'),
        HttpHelper = require('/common/HttpHelper@1-0-x'),
        native = require('/common/native@1-0-x');
        // stat = require('/common/Stat@1-0-x');

    var QUERY = qs.parse(location.search);

    // 获取配置的选集信息
    SETS_INFO = SETS_INFO || [];
    var configSetInfo = SETS_INFO.filter(function (e, i) {
      return e.subTitle == QUERY.setId;
    })[0];

    var App = {
        init: function () {
            this.$wrapper = $('.wrapper');
            this.$invitationCode = $('.code-box .code');
            this.$restChannce = $('.code-box .usage-tip i');
            this.$videoName = $('.tip-box .intro i');
            this.$shareBtn = $('.code-box .share-btn');

            this.$videoName.text('《' + QUERY.userName + '》' + QUERY.title);
            this.$invitationCode.text(QUERY.code);

            this.getRestChance();
            this.setShareInfo();
            this.bindEvents();
        },
        bindEvents: function () {
            this.$shareBtn.tap(function () {
                native.call('openShareView');
                // stat.send("test");
            });
        },
        setShareInfo: function () {
            var self = this;
            var params = 'code=' + QUERY.code + '&title=' + QUERY.title + '&setId=' + QUERY.setId + '&userName=' + QUERY.userName;
            native.call('setShareInfo',{
                default: {
                    title: '看片有价真爱无价！',
                    description: '《' + QUERY.userName + QUERY.title +  '》已登陆网易菠萝。这是我送你的免费观影券！请收下吧~',
                    url: location.origin + '/m/invitation/video?' + params,
                    image: configSetInfo ? configSetInfo.pic : null
                },
                weibo:{
                    title: '看片有价真爱无价！',
                    description: '《' + QUERY.userName + QUERY.title +  '》已登陆网易菠萝。这是我送你的免费观影券！请收下吧~@网易菠萝' + encodeURIComponent(location.origin + '/m/invitation/video?' + params),
                    image: configSetInfo ? configSetInfo.pic : null,
                    url: location.origin + '/m/invitation/video?' + params
                }
            });
        },
        getRestChance: function () {
            var self = this;
            $.ajax({
            	url: HttpHelper.getOrigin() + '/bolo/api/gift/leftUseTimes',
            	data: {
            		code: QUERY.code
            	},
            	success: function(result) {
                    self.$restChannce.text(JSON.parse(result).times);
            	}
            });
        }
    };

    $(function () {
        App.init();
    });

});