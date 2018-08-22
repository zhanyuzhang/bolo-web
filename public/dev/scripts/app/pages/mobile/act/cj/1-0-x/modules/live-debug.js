/**
 * Created by Dillance on 16/7/20.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		Promise = require('promise@1-0-x'),
		tmpl = require('/common/tmpl@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		tip = require('/common/uiComponent/mobile/tip@1-0-x'),
		dialog = require('/common/uiComponent/mobile/dialog@1-0-x'),
		uadetector = require('uadetector@1-0-x'),
		stat = require('/common/Stat@1-0-x'),
		native = require('/common/native@1-0-x');

	var Live = {
		$wrapper: $('.live-page'),
		init: function(){
			this.$video = this.$wrapper.find('video');
			this.$videoList = this.$wrapper.find('.video-list');
			this.$joinBtn = this.$wrapper.find('.join-btn');
			this.$liveReport = this.$wrapper.find('.live-report');
			this.$moreReportBtn = this.$liveReport.find('.more-btn');

			this.$shareDialogs = $('.share-dialog');
			this.$normalShareDialog = this.$shareDialogs.eq(0);
			this.$giftShareDialog = this.$shareDialogs.filter('.gift');
			this.$phoneNumDialog = this.$shareDialogs.filter('.success');
			this.$succeededDialog = this.$shareDialogs.filter('.download');
			this.wechatShareGuide = dialog.WechatShareGuide.init();

			this.currentReportPage = 1;
			this.render();
			this.bindEvent();
		},
		render: function(){
			this.renderReportList(this.currentReportPage);
		},
		renderReportList: function(page){
			var self = this;
			this.getReportList(page).then(function(result){
				if(result.data.length){
					self.$liveReport.find('.report-list').append(tmpl.render('report-list',{
						data: result.data,
						getImage: HttpHelper.getImage,
						timeParse: function(time){
							var d = new Date(time);
							return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
						}
					}));
				}
				if(!result.data.length || result.data.length < 15) self.$moreReportBtn.hide();
			})
		},
		bindEvent: function(){
			var self = this;
			this.$videoList.find('.item').tap(function(){
				var $this = $(this);
				if($this.data('href')){
					location.href = $this.data('href');
					return;
				}
				if(!$this.hasClass('current')){
					$this.addClass('current').siblings('.current').removeClass('current');
					self.$video.attr('poster',$this.find('img').attr('src'));
					self.$video.attr('src',$this.data('src')).get(0).play();
				}
			});

			this.$video.on('play',function(){
				var currentIndex = self.$videoList.find('.item.current').index();
				stat.send('vedio' + (VIDEO_INFO.liveId > 0 ? currentIndex : currentIndex + 1) + '_h5');
			});

			this.$liveReport.on('tap','.share-btn',function(){
				if(uadetector.is(/MicroMessenger|QQ|Weibo/)){
					self.wechatShareGuide.show();
				}else{
					self.$normalShareDialog.show();
				}
				stat.send('share1_h5');
			});

			this.$normalShareDialog.find('.btn').tap(function(){
				var $this = $(this);
				if($this.hasClass('weibo')){
					location.href = 'http://v.t.sina.com.cn/share/share.php?title=' + encodeURIComponent('#网易菠萝##ChinaJoy#我竟然在CJ上看这个！不能只有我一个人high') + '&pic=' + encodeURIComponent('http://img1.cache.netease.com/bobo/2016/7/25/20160725185653b6a68.png') + '&url=' + encodeURIComponent(location.href);
				}else if($this.hasClass('qzone')){
					location.href = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + encodeURIComponent(location.href) + '&title=' + encodeURIComponent('#网易菠萝##ChinaJoy#') + '&desc=' + encodeURIComponent('我竟然在CJ上看这个！不能只有我一个人high') + '&pics=' + encodeURIComponent('http://img1.cache.netease.com/bobo/2016/7/25/20160725185653b6a68.png');
				}else{
					self.wechatShareGuide.show();
				}
				self.$normalShareDialog.hide();
				stat.send($(this).data('stat-key'));
			});

			self.$moreReportBtn.tap(function(){
				self.renderReportList(++self.currentReportPage);
			});

			this.$joinBtn.tap(function(){
				if(native.hello()){
					self.$phoneNumDialog.show();
					native.call('openShareView');
				}else{
					self.$giftShareDialog.show();
				}
				stat.send('act_h5');
			});

			this.$giftShareDialog.find('.btn').tap(function(){
				var $this = $(this);
				self.$phoneNumDialog.show();
				if(uadetector.is(/MicroMessenger|QQ|Weibo/)){
					self.wechatShareGuide.show();
				}else if($this.hasClass('weibo')){
					window.open('http://v.t.sina.com.cn/share/share.php?title=' + encodeURIComponent('#网易菠萝##ChinaJoy#我竟然在CJ上看这个！不能只有我一个人high') + '&pic=' + encodeURIComponent('http://img1.cache.netease.com/bobo/2016/7/25/20160725185653b6a68.png') + '&url=' + encodeURIComponent(location.href));
				}else if($this.hasClass('qzone')){
					window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + encodeURIComponent(location.href) + '&title=' + encodeURIComponent('#网易菠萝##ChinaJoy#') + '&desc=' + encodeURIComponent('我竟然在CJ上看这个！不能只有我一个人high') + '&pics=' + encodeURIComponent('http://img1.cache.netease.com/bobo/2016/7/25/20160725185653b6a68.png'));
				}else{
					self.wechatShareGuide.show();
				}
				self.$giftShareDialog.hide();
				stat.send($(this).data('stat-key'));
			});

			this.$phoneNumDialog.find('.submit-btn').tap(function(){
				var $this = $(this),
					$error = self.$phoneNumDialog.find('.error-tip'),
					value = self.$phoneNumDialog.find('input').val();
				if(!value || !/\d{11}/.test(value)){
					$error.text('请输入正确手机号');
				}else{
					$error.text('');
					$.ajax({
						url: HttpHelper.getOrigin() + '/bolo/api/activity/joinChinaJoyActivity.htm',
						dataType: 'jsonp',
						data: {
							mobile: value
						},
						success: function(result){
							if(result.status == 1){
								self.$phoneNumDialog.hide();
								self.$succeededDialog.show();
							}else{
								$error.text(result.msg);
							}
						}
					})
				}
			});

			this.$shareDialogs.tap(function(){
				$(this).hide();
			}).find('.container').tap(function(e){
				e.stopPropagation();
			});
			this.$shareDialogs.find('.remove-btn').tap(function(){
				$(this).parents('.share-dialog').hide();
			});
		},
		getReportList: function(page){
			var self = this;
			return new Promise(function(resolve,reject){
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/video/commentList.htm',
					dataType: 'jsonp',
					data: {
						videoId: 888888,
						pageNum: page,
						pageSize: 15,
						type: 3
					},
					success: function(result){
						if(result.status == 1){
							resolve(result);
						}
					}
				})
			});
		}
	};

	return Live;

});