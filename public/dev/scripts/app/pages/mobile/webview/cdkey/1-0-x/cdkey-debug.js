/**
 * Created by Dillance on 16/9/30.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		tmpl = require('/common/tmpl@1-0-x'),
		Promise = require('promise@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		native = require('/common/native@1-1-x'),
		Stat = require('/common/Stat@1-0-x'),
		tip = require('/common/uiComponent/mobile/tip@1-0-x');

	var $formBox = $('.form-box'),
		$keyInput = $formBox.find('input'),
		$confirmBtn = $('.confirm-btn');

	var $inviteBox = $('#invite-box');
	var $ticketBox = $('#ticket-box');

  var testUser1 = {"userId":"5251462980618721814"}; // who
  var testUser2 = {"userId": "-5328010585034393675"}; // my-微博
  var testUser3 = {"userId":"4246325425602548266"}; // my-易信
  var testUser4 = {"userId":"6494226107539112671"};
  var testUser5 = {"userId":"7691633854771943245"};


	var testTickets = [
		{
			"id":147376593735219,
			"name":"免费看券",
			"intro":"可以免费看视频",
			"vids":"14604533648951,14604533648991,14604533649031",
			"pastDue":1480502942096,
			"type":0,//0:观看券 1:菠萝币券...
			"status":0  //0:正常 1:已失效
		},
		{
			"id":147376593735220,
			"name":"免费看券1",
			"intro":"可以免费看视频1",
			"vids":"14604533648951,14604533648991,14604533649031",
			"pastDue":1421985600000,
			"type":0,//0:观看券 1:菠萝币券...
			"status":1  //0:正常 1:已失效
		}
	];

	var testPrivilege = [{
		"userId":-4411691392427761856,//用户ID
		"userName":"女王驾到",//用户名
		"setId":14745530218291,//选集ID
		"setName":"《我们不捉 妖》第二季1",//选集名
		"blanceNum":3,//剩余兑换数量
		"numbers":"6",//第几集 4,5,6 则表示 第4集,第5集,第6集
		"code":"DBC12EFG",//邀请码
		"pastDue":1474387200000,//过期时间
		"status":2 //状态 0:可用 1:兑换次数已用完 2:已过期
	},{
		"userId":-4411691392427761856,//用户ID
		"userName":"女王驾到",//用户名
		"setId":14745530218291,//选集ID
		"setName":"《我们不捉 妖》第二季2",//选集名
		"blanceNum":3,//剩余兑换数量
		"numbers":"6",//第几集 4,5,6 则表示 第4集,第5集,第6集
		"code":"DBC12EFG",//邀请码
		"pastDue":1474387200000,//过期时间
		"status":0 //状态 0:可用 1:兑换次数已用完 2:已过期
	},{
		"userId":-4411691392427761856,//用户ID
		"userName":"女王驾到",//用户名
		"setId":14745530218291,//选集ID
		"setName":"《我们不捉 妖》第二季3",//选集名
		"blanceNum":0,//剩余兑换数量
		"numbers":"6",//第几集 4,5,6 则表示 第4集,第5集,第6集
		"code":"DBC12EFG",//邀请码
		"pastDue":1474387200000,//过期时间
		"status":0 //状态 0:可用 1:兑换次数已用完 2:已过期
	}];
	native.userPromise.then(function (userInfo) {
		if(!userInfo.userId) {
			native.call('loginApp');
			return false;
		}
		startApp(userInfo);
	}).catch(function (err) {
		// alert(err.toString());
		startApp(testUser1);
	});


	function startApp(userInfo) {

    // alert(userInfo.userId);

		// 格式化时间
		var dateParser = function(time) {
			var d = new Date(time);
			return d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate();
		};

		// 把观影券未失效(status==0)的放在前面,失效的放在后面
		function sortByStatus(result) {
			return result.sort(function (a, b) {
				return a.status - b.status;
			});
		}
		
		function exchangeTicket(code, sucessCallback, failCallback) {
      $.ajax({
        url: HttpHelper.getOrigin() + '/bolo/api/gift/exchange',
        dataType: 'json',
        method: 'post',
        data: {
          userId: userInfo.userId,
          redeemCode: code || 'SU968LSF'
        },
        success: function(result) {
          if(result.status == 1) {
            sucessCallback && sucessCallback(result);
          }
          else {
            failCallback && failCallback(result);
          }
        },
        error: function(xhr, errorType, error){
          console.log(error);
        }
      });
    }


		// 获取观影券列表
		$.ajax({
			url: HttpHelper.getOrigin() + '/bolo/api/gift/giftList.htm',
			dataType: 'json',
			data: {
				userId: userInfo.userId
			},
			success: function(result){
				$ticketBox.html(tmpl.render('coupon', {
					data: sortByStatus(result),
					dateParser: dateParser
				}));
			},
			error: function(xhr, errorType, error){
				console.log(error);
			}
		});

		// 获取特权列表
		$.ajax({
			url: HttpHelper.getOrigin() + '/bolo/api/gift/inviteList.htm',
			dataType: 'json',
			data: {
				userId: userInfo.userId
			},
			success: function(result){
				$inviteBox.html(tmpl.render('invitation',{
					data: sortByStatus(result),
					dateParser: dateParser
				}));
			},
			error: function(xhr, errorType, error){
				console.log(error);
			}
		});

		$keyInput.focus(function(){
			Stat.send('code_import');
		});

		$confirmBtn.tap(function(e){
			var code = $keyInput.val();
			if(!code) {
		        tip.show('请输入兑换码');
		        return;
			}
			exchangeTicket(code, function(data) {
				$keyInput.val('');
				$ticketBox.prepend(tmpl.render('coupon',{
				  data: [data.gift],
				  dateParser: dateParser
				}));
			},function(data){
				tip.show(data.msg);
			});
			Stat.send('code_confim');
		});

		$ticketBox.on('tap','.play-btn',function() {
			var $this = $(this),
					vids = $this.data('vids').toString().split(',');
			Stat.send('code_toLook',{
				label: $this.data('name')
			});
			native.call('openVideo',{
				videoId: vids[Math.floor(Math.random() * vids.length)]
			});
		});

		$inviteBox.on('tap','.share-btn',function() {
			var data = this.dataset;
			var params = 'code=' + data.code + '&title=' + data.setname + '&setId=' + data.setid + '&userName=' + data.username;
			location.href = '/m/invitation/code?' + params;
		});

		native.on('return',function() {
			location.href = location.href;
		});
	}

});