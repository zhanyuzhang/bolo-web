/**
 * Created by Dillance on 16/7/18.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		qs = require('querystring@1-0-x'),
		native = require('/common/native@1-0-x'),
		Stat = require('/common/Stat@1-0-x'),
		Promise = require('promise@1-0-x'),
		tmpl = require('/common/tmpl@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		tip = require('/common/uiComponent/mobile/tip@1-0-x'),
		dialog = require('/common/uiComponent/mobile/dialog@1-0-x'),
		uadetector = require('uadetector@1-0-x');

	var PAGE_TYPE = qs.parse().aid ? 2 : 3;

	//2:专辑评论
	//3:专题评论
	var comment = {
		$wrapper: $('.comment-wrapper'),
		bid: qs.parse().bid || qs.parse().aid || qs.parse().videoId,
		initParms:function(){
			this.$isPlayNew = true;
		},
		init: function($scrollWrapper){
			if(native.hello() && !this.isSupport()) return false;
			this.$scrollWrapper = $scrollWrapper || $(window);
			this.$title = this.$wrapper.children('.title');
			this.$sendBtn = this.$wrapper.find('.send-btn');
			this.$sendBox = this.$wrapper.find('.send-box');
			this.$hotBox = this.$wrapper.find('.hot-comment-box');
			this.$newBox = this.$wrapper.find('.new-comment-box');
			this.$commentPanel = this.$wrapper.find('.comment-panel');
			this.$tipsWord = $('.tip-words');
			this.currentPage = 1;
			this.commentInputSelector = '.comment-input-field';
			this.replyInputSelector = '.reply-input-field';
			this.downloadDialog = dialog.Download.init();
			if(!this.$isPlayNew || typeof this.$isPlayNew =='undefined'){
				this.$isPlayNew = false;
			}
			this.render();
			this.bindEvents();
			this.$wrapper.css('display','block');
		},
		isSupport: function(){
			//var version;
			//if(uadetector.isOS('ios')){
			//	version = navigator.userAgent.match(/\d\.\d\.\d$/);
			//	if(version.length) version = version[0].replace(/\./g,'');
			//}else{
			//	version = navigator.userAgent.match(/\/(\d\.\d\.\d)/);
			//	if(version.length) version = version[1].replace(/\./g,'');
			//}
			//return version >= 140;
			return native.version >= 10400;
		},
		render: function(){
			var self = this;
			this.renderHotList();
			this.renderNewList(this.currentPage);
			if(native.isLogin()){
				this.getUserInfo().then(function(data){
					self.$wrapper.find('.send-box .avatar img').attr('src',HttpHelper.getImage(data.avatar,[50,50]));
				});
			}
			if(native.hello()){
				this.$wrapper.addClass('show-panel');
			}
			if(self.$isPlayNew){
				this.$sendBox.hide();
				$('<div class="rec-tip">下载APP，查看更多热评<div class="icon"></div></div>').appendTo(this.$wrapper).tap(function(){
					//self.downloadDialog.show();
					Stat.send('play_comment_down');
					native.download('播放页');
				});
			}
		},
		// 检测是否为App,并且是否已经登陆
		isNativeAndLogin: function () {
			var self = this;
			if(!native.hello()) {
				self.downloadDialog.show();
				return false;
			}
			if(!native.isLogin()) {
				native.call('loginApp');
				return false;
			}
			return true;
		},
		// 动态创建回复评论的输入框，replyer为被回复者，params为提交回复时的相应的参数
		createSendBox: function (replyer, params) {
			var sendBox = document.createElement('div');
			sendBox.className = 'send-box reply-box';
			sendBox.innerHTML = '<textarea placeholder="回复' + replyer + ':" class="reply-input-field"></textarea>' +
				'<div class="submit-btn reply-btn">发送</div>';
			params && (sendBox.dataset.params = JSON.stringify(params));
			return sendBox;
		},
		// 使输入框滚动到顶部显示(防止键盘的遮挡)，并且使其获得焦点
		showAndFocusInputField: function ($inputField) {
			this.$wrapper.css({'margin-bottom': window.innerHeight + 'px'});
            // 使输入框行到可视区域
			$inputField[0].scrollIntoView(true);
			this.$scrollWrapper[0].scrollTop -= window.innerHeight / 6;
            // 直接通过focus()方法是无法调出虚拟键盘的，必须是用户的手点击输入框才可以显示键盘
            // 所以用了投机取巧的方法，增加输入框的行数（让它占满整个屏幕）
			$inputField[0].rows = 30;
			setTimeout(function () {
				$inputField[0].rows = 4;
			}, 50);
			$inputField[0].focus();
		},
		getUserInfo: function(){
			return new Promise(function(resolve,reject){
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/public/userInfo.htm',
					dataType: 'jsonp',
					data: {
						userId: native.userInfo.userId,
						targetUserId: native.userInfo.userId
					},
					success: function(result){
						if(result.userId){
							resolve(result);
						}
					}
				})
			});
		},
		renderHotList: function(){
			var self = this;
			this.getHotList().then(function(result){
				if(result.data.length) self.$hotBox.show();
				self.$hotBox.find('.comment-list').html(tmpl.render('comment-list',{
					data: result.data,
					getImage: HttpHelper.getImage
				}));
				if(self.onhotlistloaded) self.onhotlistloaded(result);
				return result.data;
			}).then(function(data){
				data.forEach(function(d,i){
					self.getReplyList(d.id).then(function(replyData){
						if(d.commentCount > 0){
							self.$hotBox.find('.comment-item').eq(i).find('.reply-list').html(tmpl.render('reply-list',{
								data: replyData,
								getImage: HttpHelper.getImage
							}));
						}
					});
				});
			});
		},
		renderNewList: function(page){
			var self = this;
			self.isLoading = true;
			this.getNewList(page).then(function(data){
				if(self.$isPlayNew){
					if(data.length==0){

						self.$newBox.remove();
						self.$tipsWord.addClass('show');

						self.$wrapper.find('.rec-tip').remove();
					}
				}
				self.isLoading = false;
				var $commentList = $(tmpl.render('comment-list',{
					data: data,
					getImage: HttpHelper.getImage
				}));
				self.$newBox.find('.comment-list').append($commentList);
				if(data.length < 10) self.newListAllLoaded = true;
				return $commentList;
			}).then(function($commentList){
				$commentList.each(function(i){
					var $this = $(this);
					if($this.attr('data-commentCount') > 0) {
						self.getReplyList($this.data('id')).then(function (replyData) {
							$this.find('.reply-list').html(tmpl.render('reply-list', {
								data: replyData,
								getImage: HttpHelper.getImage
							}));
						});
					}
				});
			});
		},
		resetNewList: function(){
			this.$newBox.find('.comment-list').html('');
			this.newListAllLoaded = false;
			this.currentPage = 1;
			this.renderNewList(this.currentPage);
		},
		bindEvents: function(){
			var self = this;
			this.$scrollWrapper.scroll(function(){
				if(!self.isLoading && !self.newListAllLoaded && self.$scrollWrapper.scrollTop() > $('body').height() - self.$scrollWrapper.height() - 30) {
					self.renderNewList(++self.currentPage);
				}
			});

			this.$wrapper.on('tap','.like-btn',function(e) {
				e.stopPropagation();
				if(!self.isNativeAndLogin()) {
					return;
				}
				var $this = $(this),
					cid = $this.data('cid');
				if ($this.data('cid') && !$this.hasClass('ed')) {
					$.ajax({
						url: HttpHelper.getOrigin() + '/bolo/api/video/supportComment',
						dataType: 'jsonp',
						data: {
							videoId: self.bid,
							cid: cid,
							userId: native.userInfo.userId,
							encryptToken: native.userInfo.encryptToken || native.userInfo.encryptedToken,
							timeStamp: native.userInfo.timeStamp || native.userInfo.timestamp,
							random: native.userInfo.random
						},
						success: function (result) {
							if (result && result.status == 1) {
								self.$wrapper.find('.like-btn').each(function(){
									var $thisBtn = $(this);
									if($thisBtn.data('cid') == cid){
										$thisBtn.addClass('ed');
										var currentCount = parseInt($thisBtn.data('count')) + 1;
										$thisBtn.data('count', currentCount).text(currentCount);
									}
								});
								tip.show('点赞成功')
							} else {
								$this.addClass('ed');
							}
						}
					})
				}
			});
			this.$wrapper.on('focus', self.commentInputSelector + ',' + self.replyInputSelector, function () {
				self.showAndFocusInputField($(this));
			});
			this.$wrapper.on('blur', self.commentInputSelector + ',' + self.replyInputSelector, function () {
				this.rows = 1;
                self.$wrapper.css({'margin-bottom': 0});
			});
			this.$commentPanel.find('.share-btn').tap(function(){
				native.call('openShareView');
			});
			// 提交评论
			this.$wrapper.on('tap', '.submit-btn', function (e) {
				var $this = $(this),
					$sendBox = $this.parents('.send-box'),
					isReply = $this.hasClass('reply-btn'),
					$inputField = $sendBox.find(isReply ? self.replyInputSelector : self.commentInputSelector),
					data = {
						success: true,
						content: $inputField.val().trim(),
						params: isReply ? JSON.parse($sendBox[0].dataset.params) : {code: 100},
						callback: function () {
							$inputField.val('');
							$inputField.blur();
							self.$wrapper.css({'margin-bottom': 0 + 'px'});
							if(isReply) { // 如果是回复评论，则把回复框删除
								$sendBox.remove();
							} else { // 否则就是发布评论，跳到最新评论，并把输入框变成1行！
								$('.new-comment-box')[0].scrollIntoView(true);
								$inputField[0].rows = 1;
							}
						}
					};

				if(!self.isNativeAndLogin()) { // 判断是否为App并且已经登陆了
					return;
				}
				if(!$inputField.val().trim()) { // 判断内容是否为空
					tip.show('评论内容不能为空！');
					return;
				}
				// 调用sendComment()提交评论！
				self.sendComment(data);
			});

			// 单击评论或者回复的内容时，创建一个输入框，并初始化提交评论时用到的参数
			this.$wrapper.on('tap','.host-comment, .reply-item',function(e) {
				if(!self.isNativeAndLogin() || this.classList.contains('like-btn')) return;
				var $this = $(this),
					$commentItem = $this.parents('.comment-item'),
					isHostComment = this.classList.contains('host-comment'),
					params = {
						code: 200,
						mainCid: $commentItem.data('id'),
						isFollowStick: isHostComment ? 1 : 0,
						replyUserId: isHostComment ? $commentItem[0].dataset.userid : $this[0].dataset.userid
					},
					replyer = isHostComment ?
							$this.find('.author-name').text() :
							$this.find('.replyer-name').text().split('回复')[0],
					sendBoxDom = self.createSendBox(replyer, params);

				$('.reply-box').length && $('.reply-box').remove(); // 如果已经存在了回复框，则把它移除掉
				$(sendBoxDom).insertAfter($commentItem); //插入新的回复框
				$(sendBoxDom).find(self.replyInputSelector).trigger('focus');
			});

			// 这是旧版的提交评论的事件，现在没用了???
			native.on('comment', self.sendComment);
		},
		getHotList: function(){
			var self = this;
			return new Promise(function(resolve,reject){

				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/video/commentList.htm',
					dataType: 'jsonp',
					data: {
						userId: native.userInfo.userId || '',
						videoId: self.bid,
						pageNum: 1,
						pageSize: 5,
						type: 2
					},
					success: function(result){

						if(result && result.status == '1'){
							self.totalCommentCount = result.totalCommentCount;
							self.$title.find('i').text('(' + result.totalCommentCount + ')');
							self.$commentPanel.find('.comment-btn').text(result.totalCommentCount);
							//result.data = [];
							if(self.$isPlayNew){
								if(result.data.length==0){
									self.$newBox.show();
								}else{
									result.data.splice(3,2);
								}
							}else{
								if(result.totalCommentCount > 0) self.$newBox.show();
							}
							resolve(result);

						}
					}
				})
			});
		},
		getNewList: function(page){
			var self = this;
			return new Promise(function(resolve,reject){
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/video/commentList.htm',
					dataType: 'jsonp',
					data: {
						userId: native.userInfo.userId || '',
						videoId: self.bid,
						pageNum: page,
						pageSize: 10,
						type: 0
					},
					success: function(result){
						if(result && result.status == '1'){
							//result.data = [];
							if(self.$isPlayNew){
								result.data.splice(3,result.data.length);
							}
							resolve(result.data);
						}
					}
				})
			});
		},
		getReplyList: function(cid){
			var self = this;
			return new Promise(function(resolve,reject){
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/video/commentReplyList.htm',
					dataType: 'jsonp',
					data: {
						cid: cid
					},
					success: function(result){
						if(result && result.status == '1'){
							resolve(result.data);
						}
					}
				})
			});
		},
		// 提交评论
		sendComment: function(data) {
			var self = this;
			if(data.success){
				if(data.params.code == 100){
					$.ajax({
						url: HttpHelper.getOrigin() + '/bolo/api/video/comment',
						dataType: 'jsonp',
						data: {
							userId: native.userInfo.userId,
							encryptToken: native.userInfo.encryptToken || native.userInfo.encryptedToken,
							timeStamp: native.userInfo.timeStamp || native.userInfo.timestamp,
							random: native.userInfo.random,
							videoId: self.bid,
							type: PAGE_TYPE,
							content: data.content
						},
						success: function(result){
							if(result && result.status == 1){
								tip.show('评论成功');
								self.totalCommentCount++;
								self.$title.find('i').text('(' + self.totalCommentCount + ')');
								self.$commentPanel.find('.comment-btn').text(self.totalCommentCount);
								self.$newBox.show().find('.comment-list').prepend(tmpl.render('comment-list',{
									data: [result.comment],
									getImage: HttpHelper.getImage
								}));
								data.callback && data.callback(); // 如果有回调，就执行
							}
						}
					});
				}else if(data.params.code == 200){
					$.ajax({
						url: HttpHelper.getOrigin() + '/bolo/api/video/replyComment',
						dataType: 'jsonp',
						data: {
							userId: native.userInfo.userId,
							encryptToken: native.userInfo.encryptToken || native.userInfo.encryptedToken,
							timeStamp: native.userInfo.timeStamp || native.userInfo.timestamp,
							random: native.userInfo.random,
							cid: data.params.mainCid,
							replyUserId: data.params.isFollowStick ? -1 : data.params.replyUserId,
							videoId: self.bid,
							type: PAGE_TYPE,
							content: data.content
						},
						success: function(result){
							if(result && result.status == 1){
								tip.show('回复成功');
								self.$wrapper.find('.comment-item').each(function(){
									var $this = $(this);
									if($this.data('id') == data.params.mainCid){
										$this.find('.reply-list').append(tmpl.render('reply-list',{
											data: [result.replyComment],
											getImage: HttpHelper.getImage
										}));
										data.callback && data.callback()
									}
								});
							}
						}
					});
				}
			}
		}
	};

	return comment;

});