/**
 * Created by Dillance on 16/6/29.
 */
define(function(require, exports, module) {
    'use strict';
    var $ = require('zepto@1-1-4'),
        util = require('/common/util@1-0-x');

    var Tip = {
        init: function (style) {
            var tipHtml = '<div id="tip-box-${now}"><span class="content"></span><span class="angle"></span></div>';
            var $tipBox = $(util.replaceTpl(tipHtml, {now: Date.now()}));
            this.baseStyle = {
                fontSize:  style.fontSize || '.3rem',
                background: style.background || '#ebcd02',
                color: style.color || '#000',
                position: 'fixed',
                maxWidth: style.maxWidth || '6rem',
                left: 0,
                right: 0,
                margin: '0 auto',
                padding: '.1rem',
                borderRadius: '.1rem',
                border: '1px solid #ccc'
            };
            $('body').append($tipBox);
        }
    };

    return Tip;

});