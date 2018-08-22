/**
 * Created by Dillance on 17/1/13.
 */
define(function(require, exports, module) {
	'use strict';
	var $ = require('jquery@1-11-x'),
		tmpl = require('/common/tmpl@1-0-x'),
		Promise = require('promise@1-0-x'),
		user = require('/common/user@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		base = require('base@1-1-x'),
		util = require('/common/util@1-0-x');

	var $window = $(window),
		$body = $('body');


	return {
		$videoCardListWrap: $('.video-card-list-wrap'),
		init: function(){
			this.render(true);
			this.bindEvents();
		},
		render: function(isFirst){
			var self = this;
			this.$videoCardListWrap.each(function(){
				var $thisWrap = $(this),
					data = $thisWrap.data(),
					rendomId = base.randomStr().substr(0,6);

				if(data.allLoaded || data.rendering || (!isFirst && $thisWrap.hasClass('hide'))) return;
				$thisWrap.data('rendering',true);

				self.getData(data).then(function(result){
					var task = [],
						arrayData;

					if(base.isArray(result)) arrayData = result;
					else if(result.list && base.isArray(result.list)) arrayData = result.list;

					if(!arrayData || !arrayData.length){
						$thisWrap.data('all-loaded',true).addClass('zero-data');
						if(data.hideIfZero) $thisWrap.hide().prev('.module-title').hide();
						return Promise.reject('数据为空');
					}
					if(data.length != 'infinite'){
						$thisWrap.data('all-loaded',true);
						if(arrayData.length > data.length) arrayData.length = data.length;
					}else if(data.pageSize > 0 && arrayData.length < data.pageSize){
						$thisWrap.data('all-loaded',true);
					}

					arrayData.forEach(function(d){
						task.push(self.getVideoInfo(d.videoId).then(function(videoInfo){
							$.extend(d,videoInfo.videoInfo);
							d.channelInfo = videoInfo.channelInfo;
							return d;
						}));
					});

					if(data.pageSize == -1){
						$thisWrap.prev('.module-title .count').text(arrayData.length);
					}

					return Promise.all(task);
				}).then(function(finalData){

					var $videoCardList = $(tmpl.render('video-card-list',{
						rendomId: rendomId,
						data: finalData,
						dateParser: util.dateParser,
						getImage: HttpHelper.getImage
					}));

					var $grids = $thisWrap.find('.grid');

					$grids.each(function(gridIndex){
						var $thisGrid = $(this);
						$thisGrid.append($videoCardList.filter(function(cardIndex){
							return cardIndex % $grids.length == gridIndex;
						}));
					});

					if(data.pageNum) $thisWrap.data('page-Num',data.pageNum + 1);
					$thisWrap.data('rendering',false);

					return self.getComment(finalData.map(function(d){
						return d.videoId;
					}));
				}).then(function(commentData){
					commentData.forEach(function(c,i){
						if(!c.comment.length) return;
						$thisWrap.find('#' + rendomId + '-' + c.videoId + '-' + i).append(tmpl.render('video-card-comment-list',{
							videoId: c.videoId,
							data: c.comment
						}));
					});
				});
			});
		},
		bindEvents: function(){
			var self = this;
			this.$videoCardListWrap.on('click','.like-btn',function(){
				var $this = $(this);
				if($this.hasClass('liked')) return;
				if(user.isLogin()){
					self.favor($this.data('videoId')).then(function(result){
						if(result.status == 1){
							$this.addClass('liked');
							$this.find('.num').text(parseInt($this.find('.num').text()) + 1).show();
						}
					});
				}else{
					user.login();
				}
			});
			this.$videoCardListWrap.on('click','.follow-btn',function(){
				var $this = $(this);
				if(user.isLogin()){
					if($this.hasClass('ed')){
						self.unfollow($this.data('id')).then(function(result){
							if(result.status == 1){
								$this.removeClass('ed');
							}
						});
					}else{
						self.follow($this.data('id')).then(function(result){
							if(result.status == 1){
								$this.addClass('ed');
							}
						});
					}
				}else{
					user.login();
				}
			});
			$window.scroll(function(){
				//console.log($window.scrollTop());
				if($window.scrollTop() + $window.height() >=  $body.height() - 120){
					self.render();
				}
			});
		},
		getData: function(data){
			var ajaxData = JSON.parse(JSON.stringify(data));
			delete ajaxData.length;
			delete ajaxData.interface;
			return new Promise(function(resolve){
				$.ajax({
					url: HttpHelper.getOrigin() + data.interface,
					dataType: 'json',
					data: ajaxData,
					xhrFields: {
						withCredentials: true
					},
					success: function(result){
						resolve(result);
					}
				})
			});
		},
		getVideoInfo: function(videoId){
			return new Promise(function(resolve){
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/video/videoInfo.htm',
					dataType: 'json',
					data: {
						userId: user.userIdStr,
						videoId: videoId
					},
					success: function(result){
						resolve(result);
					}
				})
			});
		},
		getComment: function(videoIds){
			return new Promise(function(resolve){
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/web/video/commentList.htm',
					dataType: 'json',
					data: {
						videoIds: videoIds.join(',')
					},
					success: function(result){
						resolve(result);
					}
				})
			});
		},
		follow: function(followedId){
			return new Promise(function(resolve){
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/web/user/follow',
					dataType: 'json',
					data: {
						follow: true,
						followedId: followedId
					},
					xhrFields: {
						withCredentials: true
					},
					success: function(result){
						resolve(result);
					}
				})
			});
		},
		unfollow: function(followedId){
			return new Promise(function(resolve){
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/web/user/follow',
					dataType: 'json',
					data: {
						follow: false,
						followedId: followedId
					},
					xhrFields: {
						withCredentials: true
					},
					success: function(result){
						resolve(result);
					}
				})
			});
		},
		favor: function(videoId){
			return new Promise(function(resolve){
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/video/favor',
					dataType: 'json',
					data: {
						userId: user.userIdStr,
						favor: true,
						videoId: videoId
					},
					xhrFields: {
						withCredentials: true
					},
					success: function(result){
						resolve(result);
					}
				})
			});
		}
	}



});