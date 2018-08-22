define(function(require, exports, module) {
	var $ = require('zepto@1-1-4'),
	HttpHelper = require('/common/HttpHelper@1-0-x'),
	native = require('/common/native@1-0-x');
	var Util = require('./Util');
	var uadetector = require('uadetector@1-0-x');
	native.call('getLoginInfo',function(result){
		if(result.length!=0&result!=null){
			var userInfo = result;
			$.ajax({
				url:HttpHelper.getOrigin()+'/bolo/api/message/getMsgDetail.htm',
				//url:HttpHelper.getOrigin()+'/bolo/api/message/getMsgDetail.htm'+'?encryptToken=e9a791baf382bf8628b4fadacc14f688&userId=-5747154175132691530&timeStamp=1468897899943&random=0.9513541199135983&readTimeStamp=1468897899943&type=3&_=1468992726235&callback=jsonp1',
				data:{
					encryptToken:userInfo.encryptToken,
					userId:userInfo.userId,
					timeStamp:userInfo.timeStamp,
					random:userInfo.random,
					readTimeStamp:-(-new Date),
					type:'3',
					platform:uadetector.isOS('ios')?'ios':'android'
				},
				dataType: 'jsonp',
				success:function(result){
					if(result.status==1){
						var systemMsgList = result.systemMsgList;
						var dataList = systemMsgList.dataList;
						for(var i=0;i<dataList.length;i++){
							var time = dataList[i]['createTime'];
							var date = new Date();
							var date2 = new Date(time);
							var dis = date.getTime() - date2.getTime();
							var oneDay = 1000*60*60*24;
							var num =  Math.floor(dis/oneDay);
							if(num==0){
								dataList[i]['dateStr'] = '今天';
							}else{
								dataList[i]['dateStr'] = num+'天前';
							}
						}
						var html = $(Util.tpl($('#tpl').html(),dataList));
						$('.sysNList').html(html).addClass('remove-loading');
						var links = $('.sysNList').find('.item');
						for(var i=0;i<links.length;i++){
							$(links).eq(i).click(function(){
								var type = $(this).attr('data-type');
								var value = $(this).attr('data-value');
								if(type==0){
									window.location.href = value;
								}else if(type==1){
									native.call('openVideo',{
										"videoId":value
									});
								}else if(type==2){
									native.call('openChannel',{
										"channelId":value
									})
								}else if(type==4){
									native.call('openLiveRoom',{
										"roomId":value
									})
								}
							})
						}
					}else{

					}
				}

			})	
		}else{
			native.call('loginApp');
		}
		
	})
	
		

	
});