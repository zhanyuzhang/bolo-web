/**
 * Created by Dillance on 17/1/6.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('jquery@1-11-x'),
		Promise = require('promise@1-0-x'),
		tmpl = require('/common/tmpl@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x');

	var testHost = 't05.bobo.com',
		officialHost = 'www.bobo.com';

	var Page;

	var resultDialog = {
		$wrapper: $('.result-dialog'),
		find: function(selector){
			return this.$wrapper.find(selector);
		},
		init: function(){
			var self = this;
			this.find('.container').on('click','.confirm-btn',function(){
				self.hide();
				if($(this).hasClass('check')){
					Page.renderLuckCardNum();
				}
			});
			this.find('.remove-btn').click(function(){
				self.hide();
			})
		},
		hide: function(){
			this.$wrapper.hide();
		},
		show: function(){
			this.$wrapper.show();
		}
	};

	$('.preview-dialog').click(function(){
		$('.preview-dialog').hide();
	}).find('.container').click(function(e){
		e.stopPropagation();
	}).find('.remove-btn').click(function(){
		$('.preview-dialog').hide();
	});

	var getLuckybagDialog = {
		$wrapper: $('.get-luckybag-dialog'),
		find: function(selector){
			return this.$wrapper.find(selector);
		},
		init: function(){
			var self = this;
			this.find('.get-btn').click(function(){
				if(!CONFIG.userId) return;
				self.hide();
				self.openLuckBag().then(function(result){
					if(result.status == 1){
						resultDialog.find('.content').html(tmpl.render('lucky-bag-result',{
							type: result.data.LuckGift
						}));
						resultDialog.show();
					}else{
						alert(result.msg || '网络错误,请稍后重试')
					}
				});
			})
		},
		openLuckBag: function(){
			return new Promise(function(resolve,reject){
				$.ajax({
					url: HttpHelper.getOrigin(testHost,officialHost) + '/activity/newYear/openLuckBag',
					dataType: 'jsonp',
					data: {
						userId: CONFIG.userIdStr
					},
					success: function(result){
						resolve(result)
					}
				})
			});
		},
		hide: function(){
			this.$wrapper.hide();
		},
		show: function(){
			this.$wrapper.show();
		}
	};

	resultDialog.init();
	getLuckybagDialog.init();

	Page = {
		$wrapper: $('.wrapper'),
		find: function(selector){
			return this.$wrapper.find(selector);
		},
		init: function(){
			this.$bannerContainer = this.find('.banner-container');
			this.$sideBar = $('.side-bar');
			//this.render();
			this.renderLuckCardNum();
			this.bindEvents();
		},
		render: function(){
			var self = this;
			if(CONFIG.userId){
				this.getLuckBagStatus().then(function(result){
					if(!result.data.hasGet){
						getLuckybagDialog.show();
					}
				});

				this.renderLuckCardNum();

			}else{
				getLuckybagDialog.show();
			}
		},
		renderLuckCardNum: function(){
			var self = this;
			this.getLuckCardNum().then(function(result){
				self.$bannerContainer.html(tmpl.render('main-data',{
					data: result.data
				}));
			});
		},
		bindEvents: function(){
			var self = this;
			this.$bannerContainer.on('click','.exchange-btn',function(){
				var $this = $(this),
					data = $this.data();
				if($this.hasClass('exchanged') || data.loading || !CONFIG.userId) return;
				if(data.canexchange && data.giftenough){
					$this.data('loading',true);
					self.exchangeGift(data.type).then(function(result){
						$this.data('loading',false);
						if(result.status == 1){
							$this.addClass('exchanged');
							self.renderLuckCardNum();
						}else{
							alert(result.msg || '网络错误,请重试')
						}
					});
				}else if(!data.canexchange){
					alert('福气卡不足')
				}else if(!data.giftenough){
					alert('礼物余量不足')
				}
			}).on('click','.prediction-btn',function(){
				$('.preview-dialog').show();
			});
			this.$sideBar.on('click','.item',function(){
				if($(this).data('type')) $(window).scrollTop($('.' + $(this).data('type')).offset().top);
			});
			this.$sideBar.on('click','.go-to-top',function(){
				$(window).scrollTop(0);
			}).on('click','.preview',function(){
				$('.preview-dialog').show();
			});
		},
		exchangeGift: function(type){
			var url = '/activity/newYear/exchangeGift' + type + 'ByLuckCard';
			return new Promise(function(resolve,reject){
				$.ajax({
					url: HttpHelper.getOrigin(testHost,officialHost) + url,
					dataType: 'jsonp',
					data: {
						userId: CONFIG.userIdStr
					},
					success: function(result){
						resolve(result)
					}
				})
			})
		},
		getLuckCardNum: function(){
			return new Promise(function(resolve,reject){
				$.ajax({
					url: HttpHelper.getOrigin(testHost,officialHost) + '/activity/newYear/getLuckCardNum',
					dataType: 'jsonp',
					data: {
						userId: CONFIG.userIdStr
					},
					success: function(result){
						resolve(result)
					}
				})
			})
		},
		getLuckBagStatus: function(){
			return new Promise(function(resolve,reject){
				$.ajax({
					url: HttpHelper.getOrigin(testHost,officialHost) + '/activity/newYear/getLuckBagStatus',
					dataType: 'jsonp',
					data: {
						userId: CONFIG.userIdStr
					},
					success: function(result){
						resolve(result)
					}
				})
			});
		}
	};

	Page.init();

});