define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery@1-11-x'),
        qs = require('querystring@1-0-x'),
        HttpHelper = require('/common/HttpHelper@1-0-x'),
        report = require('/pages/pc/newbolo/components/dialog/report@1-0-x');

    var App = {
        init: function () {
            this.$wrapper = $('.side-bar');
            this.$items = this.$wrapper.find('.nav .item');
            this.sendReport.bind(this);
            this.bindEvents();
            this.showActiveItem();
        },
        showActiveItem: function () {
            var QUERY = qs.parse();
            if(document.location.href.indexOf('/home') !== -1)
                this.$items.eq(0).addClass('current');
            this.$items.each(function ($menu) {
                if(this.dataset.page === QUERY.zoneName) $(this).addClass('current');
            });
        },
        sendReport: function () {
            var self = this;
            var value = report.getValue();
            var userId = USER_INFO.userIdStr || -1
            if(!value) return; // 内容为空
            console.log(userId);
            $.ajax({
                url: HttpHelper.getOrigin() + '/bolo/api/user/feedback',
                dataType: 'json',
                data: {
                    message: value,
                    userId: USER_INFO.userIdStr || -1
                },
                success: function(result) {
                    if(!result.success) return alert('保存失败！');
                    report.hide();
                },
                failure: function () {
                    alert('保存失败！');
                }
            });
        },
        bindEvents: function () {
            var self = this;
            this.$wrapper.find('.feedback').on('click', function () {
                report.init({
                    title: '意见反馈',
                    placeholder: '有任何建议都欢迎您的反馈；欢迎留下联系方式，我们会及时与您沟通',
                    callback: self.sendReport
                });
            });
        }
    }
    App.init();
});