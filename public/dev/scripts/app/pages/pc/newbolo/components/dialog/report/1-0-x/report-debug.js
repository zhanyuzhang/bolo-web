define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery@1-11-x');
    function Report() {
	    this.$wrapper = $('.report-modal');
        this.$reportDialog = this.$wrapper.find('.report-dialog');
    }
    Report.prototype = {
        // @params conf : object,包括3个属性：
        // title：标题 // 可选，默认是"意见反馈"
        // placeholder：文本框的placeholder，可选，默认是“请在此处输入内容”
        // callback: 点击发送按钮的回调函数
        init: function (conf) {
	        this.show();
	        if(this._inited) return;
	        this._inited = true;
            this.$successTips = this.$wrapper.find('.success-tips');
            this.$textArea = this.$wrapper.find('.report-body');
            this.$wrapper.find('.title').text(conf.title || '意见反馈');
            this.$wrapper.find('.report-body').attr('placeholder', conf.placeholder || '请在此处输入内容');
            this.callback = conf.callback;
            this.bindEvents();
            return this;
        },
        hide: function () {
            var self = this;
            this.$textArea.val('');
            this.$reportDialog.addClass('hidden');
            this.$successTips.show().fadeOut(2000, function () {
                self.$wrapper.addClass('hidden');
            });
        },
        show: function () {
            this.$wrapper.removeClass('hidden');
            this.$reportDialog.removeClass('hidden');
        },
        getValue: function () {
          return this.$textArea.val().trim();
        },
        bindEvents: function () {
            var self = this;
            this.$wrapper.on('click', '.close-btn, .cancel-btn', function () {
                self.hide();
            }).on('click', '.submit-btn', function () {
	            var msg = self.$textArea.val()
                self.callback && self.callback(msg);
	            self.hide();
            });
        }
    };

    return new Report();
});