/**
 * Created by chesszhang on 2016/9/22
 */

define(function(require, exports, module) {
    'use strict';
    var $ = require('zepto@1-1-4'),
        native = require('/common/native@1-0-x');

    $('.android-btn').tap(function(){
        native.download('404页面', 'android');
    });

    $('.ios-btn').tap(function() {
        native.download('404页面', 'ios');
    })
});
