/**
 * Created by Dillance on 16/9/7.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		tmpl = require('/common/tmpl@1-0-x'),
		Promise = require('promise@1-0-x'),
		Stat = require('/common/Stat@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		native = require('/common/native@1-1-x'),
		util = require('/common/util@1-0-x'),
		tip = require('/common/uiComponent/mobile/tip@1-0-x');

	var Details = {
		$wrapper: $('.details-wapper'),
		currentPage: 1,
		pageSize: 15,
		status: 'hide',
		init: function(){
			var self = this;
			if(!native.hello()) return false;
			this.$container = this.$wrapper.find('.mission-list.details');
			this.userInfo = {};
			native.user.then(function(data) {
				self.userInfo = data;
				self.render(this.currentPage);
				self.bindEvents();
			});
		},
		render: function(page){
			var self = this;
			this.getData(page).then(function(data){
				if(data.data.length < self.pageSize) self.allLoaded = true;
				self.$wrapper.find('.list-container').append(tmpl.render('details',{
					data: data.data,
					dateParser: function(time){
						var d = new Date(time);
						return (d.getMonth() + 1) + '月' + d.getDate() + '日'
					}
				}));
			});
		},
		getData: function(page){
			var self = this;
			return new Promise(function(resolve,reject){
				self.loading = true;
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/web/user/getSeedTradeHistory.htm',
					type: 'get',
					dataType: 'json',
					data: {
						userId: self.userInfo.userId,
						type: 0,
						pageNo: page,
						pageSize: self.pageSize
					},
					success: function(result){
						self.loading = false;
						resolve(result);
					}
				})
			});
		},
		bindEvents: function(){
			var self = this;
			this.$wrapper.on('touchmove',function(e){
				//e.stopPropagation();
				//e.preventDefault();
			});
			this.$wrapper.tap(function(){
				$('.detail-btn').text('种子明细');
				self.hide();
			});
			this.$container.on('tap',function(e){
				e.stopPropagation();
			}).on('scroll',function(){
				if(!self.allLoaded && !self.loading && self.$container.scrollTop() + self.$container.height > self.$container.find('.list-container').height() * 0.9){
					self.render(++self.currentPage);
				}
			});
		},
		show: function(){
			this.status = 'show';
			this.$wrapper.addClass('show');
		},
		hide: function(){
			this.status = 'hide';
			this.$wrapper.removeClass('show');
		}
	};
	Details.init();

	var Page = {
		$wrapper: $('.wrapper'),
		init: function(){
			var self = this;
			self.userInfo = {};
			this.$container = this.$wrapper.find('.container');
			if(native.hello()){
				native.user.then(function(data){
					self.userInfo = data;
					self.render();
				});
			}else{
				self.render();
			}
			self.bindEvents();
			this.recommendVideo = this.getRecommendVideo();
		},
		render: function(){
			var self = this,
				task = [];

			task.push(this.getMissionList());

			if(self.userInfo.userId) task.push(this.getUserDetailInfo().then(function(data){
				return $.extend(data,self.userInfo);
			}));

			Promise.all(task).then(function(data){
				self.$wrapper.find('.container').html(tmpl.render('page',{
					missionInfo: data[0],
					userInfo: data[1]
				}));
				self.$wrapper.addClass('show');
			});
		},
		bindEvents: function(){
			var self = this;

			this.$wrapper.on('tap','.detail-btn',function(){
				var $this = $(this);
				if(Details.status == 'hide'){
					$this.text('收起明细');
					self.$container.scrollTop(0);
					Details.show();
					Stat.send('taskList_seedDetail');
				}else{
					$this.text('种子明细');
					Details.hide();
				}
			});
			this.$wrapper.on('tap','.login-btn',function(){
				native.call('loginApp');
			});
			native.on('return',function(){
				native.call('getLoginInfo').then(function(data){
					if(data.userId) location.href = location.href;
				});
			});

			this.$wrapper.on('tap','.banner a',function(){
				Stat.send('taskList_introPic');
			});

			this.$wrapper.on('tap','.go-btn',function(){
				var $this = $(this),
					id = $this.data('id'),
					action = $this.data('action');
				if($this.hasClass('finished')) return;
				switch(action){
					case 1:
					case 4:
					case 5:
					case 6:
						self.recommendVideo.then(function(data){
							native.call('openVideo',{
								videoId: data[0].videoId
							});
						});
						break;
					case 7:
						native.call('loginApp');
						break;
					case 2:
						location.href = '/m/hybrid/partner';
						break;
					case 3:
						$.getJSON(HttpHelper.getOrigin() + '/bolo/api/task/doTask',{
							userId: self.userInfo.userId,
							action: 3
						},function(result){
							if(result.status == 1){
								$this.addClass('finished');
								$this.siblings('.progress').text('1/1');
							}else tip.show('签到失败，请重试');
						});
						break;
				}

				//统计
				switch(id){
					case 101:
						Stat.send('taskList_greenhandVideo');
						break;
					case 102:
						Stat.send('taskList_greenhandLogin');
						break;
					case 103:
						Stat.send('taskList_greenhandFollow');
						break;
					case 104:
						Stat.send('taskList_video');
						break;
					case 105:
						Stat.send('taskList_follow');
						break;
					case 106:
						Stat.send('taskList_signIn');
						break;
					case 107:
						Stat.send('taskList_comment');
						break;
					case 108:
						Stat.send('taskList_like');
						break;
					case 109:
						Stat.send('taskList_share');
						break;
				}
			});
		},
		getUserDetailInfo: function(){
			var self = this;
			return new Promise(function(resolve,reject){
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/public/userInfo.htm',
					type: 'get',
					dataType: 'json',
					data: {
						userId: self.userInfo.userId,
						targetUserId: self.userInfo.userId
					},
					success: function(result){
						resolve(result);
					}
				})
			});
		},
		getMissionList: function(){
			var self = this;
			return new Promise(function(resolve,reject){
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/task/userTaskList.htm',
					type: 'get',
					dataType: 'json',
					data: {
						userId: self.userInfo.userId || -1
					},
					success: function(result){
						var data = [{
							title: '新手任务',
							className: 'new',
							list: [],
							totalProgress: 0,
							totalLimit: 0
						},{
							title: '今日任务',
							className: 'daily',
							list: [],
							totalProgress: 0,
							totalLimit: 0
						}];
						result.forEach(function(d){
							var index = d.taskType - 1;
							data[index].list.push(d);
							data[index].totalLimit += d.upperLimit;
							data[index].totalProgress += d.progress;
						});
						resolve(data);
					}
				})
			});
		},
		getRecommendVideo: function(){
			var self = this;
			return new Promise(function(resolve,reject){
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/task/videoRecommend.htm',
					type: 'get',
					dataType: 'json',
					data: {
						userId: self.userInfo.userId || -1
					},
					success: function(result){
						resolve(result);
					}
				})
			});
		}
	};

	Page.init();

	//native.isLogin.then(function(){
	//	Page.init();
	//},function(){
	//	native.call('loginApp');
	//});


});