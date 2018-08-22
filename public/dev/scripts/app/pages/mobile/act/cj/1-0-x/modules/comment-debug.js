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
		qs = require('querystring@1-0-x'),
		stat = require('/common/Stat@1-0-x');

	var Comment = {
		$wrapper: $('.comment-box'),
		init: function(){
			this.$input = this.$wrapper.find('input');
			this.$sendBtn = this.$wrapper.find('.send-btn');
			this.$commentList = this.$wrapper.find('.comment-list');
			this.$moreBtn = this.$wrapper.find('.more-btn');
			this.currentPage = 1;
			this.render();
			this.bindEvents();
		},
		render: function(){
			this.renderCommentList(this.currentPage);
		},
		renderCommentList: function(page){
			var self = this;
			this.getCommentList(page).then(function(result){
				self.$wrapper.find('.total').data('total',result.totalCommentCount).text('(共有' + result.totalCommentCount + '条评论)');
				if(result.data.length){
					self.$commentList.append(tmpl.render('comment-list',{
						data: result.data,
						getImage: HttpHelper.getImage,
						timeParse: function(time){
							var d = new Date(time);
							return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes()
						}
					}));
				}
				if(!result.data.length || result.data.length < 10) self.$moreBtn.hide();
			})
		},
		bindEvents: function(){
			var self = this;
			this.$input.focus(function(){
				self.$input.addClass('focus');
				stat.send('commentclk_h5');
			}).blur(function(){
				if(!self.$input.val()) self.$input.removeClass('focus');
			});
			this.$sendBtn.tap(function(){
				if(!USER_INFO.userId) location.href = '/m/user/login/?backurl=' + location.href;
				else{
					if(!self.$input.val()){
						tip.show('请输入内容');
						return false;
					}
					var from = qs.parse().sourceFrom;
					$.ajax({
						url: HttpHelper.getOrigin() + '/bolo/api/video/activityComment',
						dataType: 'jsonp',
						data: {
							userId: USER_INFO.userIdStr,
							activityId: 999999,
							content: self.$input.val(),
							from: from == 'lofter' ? 1 : (from == 'gacha' ? 2 : 0)
						},
						success: function(result){
							if(result.status == 1){
								tip.show('评论成功');
								self.$input.val('').trigger('blur');
								self.$commentList.prepend(tmpl.render('comment-list',{
									data: [result.comment],
									getImage: HttpHelper.getImage,
									timeParse: function(time){
										var d = new Date(time);
										return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes()
									}
								}));
							}
						}
					});
					stat.send('comment_h5');
				}
			});
			this.$moreBtn.tap(function(){
				self.renderCommentList(++self.currentPage);
			});
		},
		getCommentList: function(page){
			var self = this;
			return new Promise(function(resolve,reject){
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/video/commentList.htm',
					dataType: 'jsonp',
					data: {
						videoId: 999999,
						pageNum: page,
						pageSize: 10,
						type: 4
					},
					success: function(result){
						if(result.status == 1){
							resolve(result);
						}
					}
				})
			});
		}
	}

	return Comment;

});