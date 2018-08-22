/**
 * Created by Dillance on 16/9/22.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		tmpl = require('/common/tmpl@1-0-x'),
		Promise = require('promise@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		qs = require('querystring@1-0-x'),
		Stat = require('/common/Stat@1-0-x'),
		uadetector = require('uadetector@1-0-x'),
		tip = require('/common/uiComponent/mobile/tip@1-0-x'),
		native = require('/common/native@1-1-x');


	var Page = {
		$wrapper: $('.wrapper'),
		init: function(){
			this.$balanceBox = this.$wrapper.find('.balance-box');
			this.$productsList = this.$wrapper.find('.products-list');
			this.$totalPrice = this.$wrapper.find('.total-price');
			this.$payBox = this.$wrapper.find('.pay-box ');
			this.render();
			this.bindEvents();
		},
		render: function(){
			var self = this;
			Promise.all([
				this.userBalancePromise.then(function(balance){
					self.$balanceBox.find('.number i').text(balance);
				}),
				this.productListPromise.then(function(data){
					self.$productsList.html(tmpl.render('products-list',{
						data: data.cashList
					}));
				})
			]).then(function(){
				self.$payBox.html(tmpl.render('pay-box',{
					isIOS: uadetector.isOS('ios')
				}));
				self.$wrapper.addClass('show');
				self.$productsList.find('.item:eq(0)').trigger('tap');
			});
		},
		bindEvents: function(){
			var self = this;

			this.$productsList.on('tap','.item',function(){
				var $this = $(this);
				if(!$this.hasClass('current')){
					$this.siblings('.current').removeClass('current');
					$this.addClass('current');
					self.$totalPrice.find('i').text($this.data('cash'));
					self.currentCashid = $this.attr('data-cashid');
					self.currentCash = $this.data('cash');
					self.currentProductId = $this.data('productid');
					Stat.send(uadetector.isOS('ios') ? 'iOScharge_clickMoney' : 'AndroidCharge_clickMoney',{
						label: 'value:' + $this.data('cash')
					});
				}
			});

			this.$payBox.on('tap','.pay-way',function(){
				var $this = $(this);
				//tip.show('服务器升级中,请稍后再试!');
				self.userBalancePromise.then(function(balance){
					//alert(JSON.stringify({
					//	cashId: self.currentCashid,
					//	money: self.currentCash,
					//	boCoin: balance,
					//	payWay: $this.data('type')
					//}))
					native.call('confirmRecharge',{
						cashId: self.currentCashid,
						money: self.currentCash,
						boCoin: balance,
						payWay: $this.data('type')
					});
				}).catch(function(err){
					alert(err);
				});
				if($this.data('type') == 'alipay') Stat.send('AndroidCharge_clickMoneyAlipay');
				else Stat.send('AndroidCharge_clickMoneyWechat');
			}).on('tap','.ios-confirm-btn',function(){
				//tip.show('服务器升级中,请稍后再试!');
				native.call('confirmRecharge',{
					productId: self.currentProductId,
					cashId: self.currentCashid
				});
				Stat.send('iOScharge_clickConfim');
			});

			native.on('return',function(){
				location.href = location.href;
			});
		},
		userBalancePromise: native.userPromise.then(function(userInfo){
			return new Promise(function(resolve){
				$.getJSON(HttpHelper.getOrigin() + '/bolo/api/user/getUserBalance.htm',{
					userId: userInfo.userId,
					encryptToken: userInfo.encryptToken,
					timeStamp: userInfo.timeStamp,
					random: userInfo.random
				},function(result){
					if(result.code == 200) resolve(result.balance);
					else alert('获取余额失败')
				});
			});
		}),
		productListPromise: native.userPromise.then(function(userInfo){
			return new Promise(function(resolve){
				$.getJSON(HttpHelper.getOrigin() + '/bolo/api/recharge/cashList.htm',{
					platType: uadetector.isOS('ios') ? 1 : 0,
					source: 'app',
					userId: userInfo.userId,
					encryptToken: userInfo.encryptToken,
					timeStamp: userInfo.timeStamp,
					random: userInfo.random
				},function(result){
					resolve(result);
				});
			});
		})
	};

	Page.init();

});