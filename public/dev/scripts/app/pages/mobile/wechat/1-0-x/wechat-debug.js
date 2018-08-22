/**
 * Created by chesszhang on 2016/10/10
 */
define(function(require, exports, module) {
    'use strict';
    var share = require('/common/wechat@1-0-x').share;
    share({
        eventType: 0,
        title: '网易菠萝',
        desc: '网易菠萝，精品无广告原创视频内容，好玩吐槽神奇社区，只做年轻人最爱的（超趣味）2.5次元内容。',
        link: '//bolo.163.com/m/download',
        imgUrl: 'http://img4.cache.netease.com/bobo/release/images/common/bolo-logo-header_7efc353212.jpg',
        success: function (res) {
            alert('分享成功！');
        },
        fail: function (res) {
            alert('分享失败！');
        },
        cancel: function (res) {
            alert('已取消分享！');
        }
    });
});