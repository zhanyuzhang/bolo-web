/**
 * Created by chess on 17/1/16.
 */
define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery@1-11-x'),
            HttpHelper = require('/common/HttpHelper@1-0-x');
    var Player = {
        init: function (config) {
            this.width = config.width || 1020;
            this.channeCounts = config.channelCount || 14;
            this.canSendDanmaku = config.canSendDanmaku || true;
            this.showDuration = config.showDuration || true;
        },


    };
    return Player;
});