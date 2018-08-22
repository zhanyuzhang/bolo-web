/**
 * Created by Dillance on 15/11/30.
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery@1-11-x'),
        LoginBox = require('/common/Header/1-0-x/LoginBox'),
        RegBox = require('/common/Header/1-0-x/RegBox');

    var User = {
        $wrapper: $('.common-header__user-box'),
        init: function(){
            this.$loginedUser = this.$wrapper.find('.common-header__user-box_avatar-wrap');
            this.$userInfoPanel = this.$loginedUser.find('.common-header__user-info-panel');
            this.render();
            return this;
        },
        render: function(){
            var self = this;
            if(!USER_INFO.userId){
                this.$wrapper.find('.common-header__user-box_login-btn').click(function(e){
                    e.preventDefault();
                    var loginBox = new LoginBox();
                    loginBox.show();
                });
                this.$wrapper.find('.common-header__user-box_reg-btn').click(function(e){
                    e.preventDefault();
                    var regBox = new RegBox();
                    regBox.show();
                });
            }
            //if(CONFIG['islogined']){
            //    this.$loginedUser.find('.common-header__user-box_avatar').attr('title',CONFIG.nick).find('img').attr('src','http://imgsize.ph.126.net/?imgurl=' + userJson.userCard.avatar + '_50x50x1x85.jpg');
            //    this.$loginedUser.find('.common-header__user-info-panel_bigger-avater img').attr('src','http://imgsize.ph.126.net/?imgurl=' + userJson.userCard.avatar + '_50x50x1x85.jpg');
            //    this.$loginedUser.find('.common-header__user-info-panel_user-name').text(CONFIG.nick);
            //    this.$loginedUser.find('.common-header__user-info-panel_balance_num').text(CONFIG.balance);
            //    this.$loginedUser.show().siblings().remove();
            //    this.$loginedUser.mouseenter(function(){
            //        self.$userInfoPanel.show();
            //    }).mouseleave(function(){
            //        self.$userInfoPanel.hide();
            //    });
            //    this.$loginedUser.find('.common-header__user-info-panel_logout-btn').attr('href','https://reg.163.com/Logout.jsp?product=bobo&url=' + location.href);
            //}else{
            //    this.$wrapper.find('.common-header__user-box_login-btn').click(function(e){
            //        e.preventDefault();
            //        var loginBox = new LoginBox();
            //        loginBox.show();
            //    });
            //    this.$wrapper.find('.common-header__user-box_reg-btn').click(function(e){
            //        e.preventDefault();
            //        var regBox = new RegBox();
            //        regBox.show();
            //    });
            //}
        }
    };

    var Header = {
        $wrapper: $('.common-header'),
        init: function(){
            this.$nav = this.$wrapper.find('.common-header__nav');
            this.navRender();

            this.user = User.init();

            $('.common-header__search-box_input').blur(function(){
                if(!this.value) $('.common-header__search-box_placeholder').show();
            }).focus(function(){
                $('.common-header__search-box_placeholder').hide();
            }).keyup(function(e){
                if(e.keyCode == 13){
                    if(this.value) location.href = 'http://www.bobo.com/search/nick/hot?searchWord=' + encodeURIComponent(this.value);
                }
            });
            $('.common-header__search-box_placeholder').click(function(){
                $('.common-header__search-box_input').focus();
            });

            $('.common-header__search-box_search-btn').click(function(e){
                e.preventDefault();
                var value = $('.common-header__search-box_input').val();
                if(value) location.href = 'http://www.bobo.com/search/nick/hot?searchWord=' + encodeURIComponent(value);
            });

            $(window).resize(function(){
                if(document.documentElement.clientWidth > 1600) $('.common-header__bobo-logo').show();
                else $('.common-header__bobo-logo').hide();
            }).resize();
        },
        navRender: function(){
            var self = this;
            if(!location.href.match('/zhibo')){
                this.showPrediction();
                $.ajax('//www.bobo.com/api/live/topicRooms.htm',{
                    dataType: 'jsonp',
                    jsonp: 'callback',
                    success: function(result){
                        for(var k in result){
                            var hasLive = result[k].some(function(d){
                                if(d.isLive == 1) return true;
                                else return false;
                            });
                            if(hasLive){
                                self.showTopicNav();
                            }
                        }
                    }
                });
            }
        },
        showTopicNav: function(){
            this.$wrapper.find('.common-header__nav_item:eq(2)').show();
        },
        showPrediction: function(){
            this.$wrapper.find('.common-header__nav_item:eq(1)').show();
        }
    };

    return Header;
});