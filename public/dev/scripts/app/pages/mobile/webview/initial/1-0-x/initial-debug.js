/**
 * Created by Dillance on 16/12/2.
 */

define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		tmpl = require('/common/tmpl@1-0-x'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		native = require('/common/native@1-1-x'),
		Stat = require('/common/Stat@1-0-x'),
		Swiper = require('swiper@3-3-x'),
		wechat = require('/common/wechat@1-0-x'),
		uadetector = require('uadetector@1-0-x'),
		tip = require('/common/uiComponent/mobile/tip@1-0-x');

	native.call('setShareInfo',{
		default: {
			title: '大热IP独家首发|网易菠萝',
			description: '《梅嘲讽-啪啪寻爱夜》12月8日于网易菠萝APP强势登场！',
			image: '/dev/images/pages/mobile/webview/1-0-x/initial/chaofeng.png',
			url: location.href
		},
		weibo: {
			description: '《梅嘲讽-啪啪寻爱夜》12月8日于网易菠萝APP强势登场！@网易菠萝菌 ' + location.href,
			image: '/dev/images/pages/mobile/webview/1-0-x/initial/chaofeng.png'
		}
	});

	if(uadetector.is('MicroMessenger')){
		wechat.share({
			title: '大热IP独家首发|网易菠萝！',
			desc: '《梅嘲讽-啪啪寻爱夜》12月8日于网易菠萝APP强势登场！',
			link: location.href,
			imgUrl: '/dev/images/pages/mobile/webview/1-0-x/initial/chaofeng.png',
			success: function(){
				Stat.send('菠萝首发微信分享成功',{
					label: 0
				});
			},
			cancel: function(){
				Stat.send('菠萝首发微信取消了分享');
			}
		});
	}

	$('.swiper-wrapper').on('tap','.book-btn',function(){
		var vid = $(this).data('vid');
		Stat.send('戳我观看',{
			label: 'vid:' + vid
		});
		native.call('openVideo',{
			videoId: vid
		});
	}).on('tap','.exchange-btn',function(){
		var sid = $(this).data('sid')
		Stat.send('疯抢兑换码',{
			label: 'sid:' + sid
		});
		location.href = '/m/act/seckill?sourceFrom=initial&sid=' + sid;
	}).on('tap','.poster',function(){
		var video = $(this).hide().siblings('video').get(0);
		video.play();
		if(video.requestFullscreen) video.requestFullscreen();
		else if(video.webkitRequestFullscreen) video.webkitRequestFullscreen();
		else if(video.webkitEnterFullscreen) video.webkitEnterFullscreen();
	});

	$.ajax({
		url: HttpHelper.getOrigin() + '/bolo/api/videoSet/premiereList.htm',
		dataType: 'json',
		data: {
			pageSize: -1
		},
		success: function(result){
			$('.swiper-wrapper').html(tmpl.render('series-list',{
				data: result
			})).find('video').on('play',function(){
				if(this.requestFullscreen) this.requestFullscreen();
				else if(this.webkitRequestFullscreen) this.webkitRequestFullscreen();
				else if(this.webkitEnterFullscreen) this.webkitEnterFullscreen();
			});
			new Swiper('.swiper-container',{
				spaceBetween : 20,
				onSlideChangeEnd: function(swiper){
					$('.swiper-wrapper .item').each(function(i){
						var $this = $(this);
						$this.find('video').get(0).pause();

						if(swiper.activeIndex == i){
							native.call('setShareInfo',{
								default: {
									title: '大热IP独家首发|网易菠萝',
									description: $this.data('shareinfo'),
									image: $this.find('.banner img').attr('src'),
									url: location.href
								},
								weibo: {
									description: $this.data('shareinfo') + '@网易菠萝菌 ' + location.href,
									image: $this.find('.banner img').attr('src')
								}
							});

							if(uadetector.is('MicroMessenger')){
								wechat.share({
									title: '大热IP独家首发|网易菠萝！',
									desc: $this.data('shareinfo'),
									link: location.href,
									imgUrl: $this.find('.banner img').attr('src'),
									success: function(){
										Stat.send('菠萝首发微信分享成功',{
											label: i
										});
									},
									cancel: function(){
										Stat.send('菠萝首发微信取消了分享');
									}
								});
							}
						}
					});
				}
			});
		}
	});

	//native.call('showShareMenu',{
	//	flat: false
	//});


	if(!native.hello()){
		$('.download-bar--black').show();
		$('.wrapper').css('height',$(window).height() - $('.download-bar--black').height() + 'px')
	}
});