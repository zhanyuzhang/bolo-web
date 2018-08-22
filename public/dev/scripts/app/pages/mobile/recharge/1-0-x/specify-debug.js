/**
 * Created by Dillance on 16/9/20.
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

	var QUERY = qs.parse();
	QUERY.lack = QUERY.lack || 2;

	var productListPromise = native.userPromise.then(function(userInfo){
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
	});

	var Page = {
		$wrapper: $('.wrapper'),
		init: function(product){
			this.product = product;
			this.$infoBox = this.$wrapper.find('.info-box');
			this.userBalancePromise = this.getUserBalance();
			this.$payBox = this.$wrapper.find('.pay-box');
			this.render();
			this.bindEvents();
		},
		render: function(){
			this.$infoBox.html(tmpl.render('info-box',{
				data: this.product
			}));
			this.$payBox.html(tmpl.render('pay-box',{
				isIOS: uadetector.isOS('ios')
			}));
			this.$wrapper.show();
		},
		bindEvents: function(){
			var self = this;
			this.$payBox.on('tap','.pay-way',function(){
				var $this = $(this);
				//tip.show('服务器升级中,请稍后再试!');
				self.userBalancePromise.then(function(balance){
					native.call('confirmRecharge',{
						cashId: self.product.cash_id_str,
						money: self.product.cash,
						boCoin: balance,
						payWay: $this.data('type')
					});
				});
				Stat.send($this.data('type') == 'alipay' ? 'AndroidSpccharge_clickMoneyAlipay' : 'AndroidSpccharge_clickMoneyWechat',{
					label: 'value:' + self.product.cash
				});
			}).on('tap','.ios-confirm-btn',function(){
				//tip.show('服务器升级中,请稍后再试!');
				native.call('confirmRecharge',{
					productId: self.product.productid,
					cashId: self.product.cash_id_str
				});
				Stat.send('iOSspccharge_clickConfim',{
					label: 'value:' + self.product.cash
				});
			});
		},
		getUserBalance: function(){
			return native.userPromise.then(function(userInfo){
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
			});
		}
	};

	productListPromise.then(function(data){
		var matchProducts = data.cashList.filter(function(d){
			return d.c_currency >= QUERY.lack;
		});
		if(!matchProducts.length) matchProducts = [data.cashList[(data.cashList.length - 1)]];
		Page.init(matchProducts.sort(function(a,b){
			return a.c_currency - b.c_currency;
		})[0]);
	});


});