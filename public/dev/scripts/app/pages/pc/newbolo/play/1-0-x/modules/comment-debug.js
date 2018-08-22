/**
 * Created by Dillance on 17/1/14.
 */

define(function(require, exports, module) {
	'use strict';

	var $ = require('jquery@1-11-x'),
		tmpl = require('/common/tmpl@1-0-x'),
		Promise = require('promise@1-0-x'),
		user = require('/common/user@1-0-x'),
		qs = require('querystring@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		base = require('base@1-1-x'),
		util = require('/common/util@1-0-x'),
		reportDialog = require('/pages/pc/newbolo/components/dialog/report@1-0-x');

	var QUERY = qs.parse(),
		VIDEO_ID = QUERY.videoId;

	return {
		$wrapper: $('.play-comment-box'),
		init: function(){
			this.$commentTotalNum = this.$wrapper.find('.comment-total-num');
			this.$container = this.$wrapper.find('.comment-list');
			this.$sendBtn = this.$wrapper.find('.send-btn');
			this.$inputWrap = this.$wrapper.find('.input-wrap');
			this.$input = this.$wrapper.find('input');
			this.render();
			this.bindEvents();
		},
		render: function(){
			var self = this;
			this.getData().then(function(result){
				var task = [];

				self.$container.html(tmpl.render('comment-item',{
					data: result.data,
					dateParser: util.dateParser
				}));

				result.data.forEach(function(d){
					if(d.commentCount) task.push(self.getReplyData(d.id).then(function(replyData){
						replyData.cid = d.id;
						return replyData;
					}));
				});

				return Promise.all(task);
			}).then(function(replyList){
				replyList.forEach(function(r){
					self.$wrapper.find('#' + r.cid).html(tmpl.render('reply',{
						data: r.data,
						dateParser: util.dateParser
					}));
				});

				if(self.$container.find('.comment-body').length > 3) self.$wrapper.find('.switch').show();

				if(QUERY.targetTo == 'comment'){
					$(window).scrollTop(self.$wrapper.offset().top);
				}
			});

		},
		bindEvents: function(){
			var self = this;
			this.$sendBtn.click(function(){
				var value = self.$input.val(),
					data = self.$input.data();

				if(!user.isLogin()){
					user.login();
					return;
				}
				if(!value){
					alert('请输入评论内容');
					return;
				}

				self.$input.val('');
				if(data.replyUserId){
					data.content = value;
					self.reply(data).then(function(result){
						if(result.status == 1){
							self.$wrapper.find('#' + data.cid).append(tmpl.render('reply',{
								data: [result.replyComment],
								dateParser: util.dateParser
							}));
						}else{
							alert(result.msg)
						}
					});
				}else{
					self.comment(value).then(function(result){
						if(result.status == 1){
							self.$container.prepend(tmpl.render('comment-item',{
								commentType: 'main',
								data: [result.comment],
								dateParser: util.dateParser
							}));
							self.$commentTotalNum.text(parseInt(self.$commentTotalNum.text()) + 1);
						}else{
							alert(result.msg)
						}
					});
				}
				setTimeout(function(){
					if(self.$container.find('.comment-body').length > 3) self.$wrapper.find('.switch').show();
				},200);

			});
			this.$input.keypress(function(e){
				if(e.keyCode == 13) self.$sendBtn.trigger('click');
			}).blur(function(){
				if(!self.$input.val()){
					self.$input.attr('placeholder','发表评论').data('reply-user-id','');
				}
				self.$inputWrap.removeClass('activated');
			}).focus(function(e){
				if(user.isLogin()){
					self.$inputWrap.addClass('activated');
				}else{
					e.preventDefault();
					user.login();
				}
			});
			this.$container.on('click','.reply-btn',function(){
				var $this = $(this),
					data = $this.parents('.comment-body').data();
				if(!user.isLogin()){
					user.login();
					return;
				}
				self.$input.val('').attr('placeholder','回复 ' + data.nick).data({
					replyUserId: data.userId,
					cid: data.cid
				}).focus();
			}).on('click','.like-btn',function(e){
				e.stopPropagation();
				var $this = $(this);
				if($this.hasClass('ed')) return;
				if(!user.isLogin()){
					user.login();
					return;
				}
				$this.addClass('ed').text(parseInt($this.text()) + 1);
				self.like($this.data('cid'));
			}).on('click','.report-btn',function(){
				var cid = $(this).data('cid');
				if(!user.isLogin()){
					user.login();
					return;
				}
				reportDialog.init({
					title: '举报',
					placeholder: '请输入举报原因',
					callback: function(msg){
						if(msg) self.report(cid,msg).then(function(result){
							if(result.status == 1) alert('举报成功')
						});
					}
				});
			});
			this.$wrapper.on('click','.switch',function(){
				var $this = $(this);
				if($this.hasClass('opened')){
					$this.removeClass('opened');
					self.$container.removeClass('opened');
				}else{
					$this.addClass('opened');
					self.$container.addClass('opened');
				}
			});

		},
		getData: function(){
			return new Promise(function(resolve){
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/video/commentList.htm',
					dataType: 'json',
					data: {
						userId: user.userIdStr || '',
						videoId: VIDEO_ID,
						pageNum: 1,
						pageSize: -1,
						type: 0
					},
					success: function(result){
						resolve(result);
					}
				})
			});
		},
		getReplyData: function(cid){
			return new Promise(function(resolve){
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/video/commentReplyList.htm',
					dataType: 'json',
					data: {
						cid: cid
					},
					success: function(result){
						resolve(result);
					}
				})
			});
		},
		comment: function(content){
			return new Promise(function(resolve){
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/video/comment',
					dataType: 'json',
					data: {
						userId: user.userIdStr,
						videoId: VIDEO_ID,
						type: 0,
						content: content
					},
					success: function(result){
						resolve(result);
					}
				});
			});
		},
		reply: function(data){
			return new Promise(function(resolve){
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/video/replyComment',
					dataType: 'json',
					data: {
						userId: user.userIdStr,
						videoId: VIDEO_ID,
						type: 0,
						cid: data.cid,
						replyUserId: data.replyUserId,
						content: data.content
					},
					success: function(result){
						resolve(result);
					}
				});
			});
		},
		like: function(cid){
			return new Promise(function(resolve){
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/video/supportComment',
					dataType: 'json',
					data: {
						userId: user.userIdStr,
						videoId: VIDEO_ID,
						cid: cid
					},
					success: function(result){
						resolve(result);
					}
				});
			});
		},
		report: function(cid,content){
			return new Promise(function(resolve){
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/web/video/report',
					dataType: 'json',
					data: {
						videoId: VIDEO_ID,
						cid: cid,
						content: content
					},
					xhrFields: {
						withCredentials: true
					},
					success: function(result){
						resolve(result);
					}
				});
			});
		}
	}

});