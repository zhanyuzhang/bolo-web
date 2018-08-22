/**
 * Created by Dillance on 16/11/10.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('zepto@1-1-4'),
		tmpl = require('/common/tmpl@1-0-x'),
		wechat = require('/common/wechat@1-0-x'),
		uadetector = require('uadetector@1-0-x'),
		tip = require('/common/uiComponent/mobile/tip@1-0-x'),
		generator = require('/pages/mobile/act/u17/1-0-x/modules/generator'),
		SCENE_MAP = require('/pages/mobile/act/u17/1-0-x/modules/scene-map');

	if(uadetector.isDevice('pc')) location.href = '/act/u17';

	var Screen = function($wrapper){
		this.$wrapper = $wrapper;
		this.events = [];
	};

	Screen.histroy = [];

	Screen.prototype = {
		on: function(name, callback) {
			var self = this;

			name = name.split(' ');

			name.forEach(function(n){
				var list = self.events[n] || (self.events[n] = []);
				list.push(callback);
			});

			return this
		},
		emit: function(name, data) {
			var list = this.events[name];

			if (list) {
				list = list.slice();

				for(var i = 0, len = list.length; i < len; i++) {
					list[i](data)
				}
			}

			return this
		},
		find: function(sizzle){
			return this.$wrapper.find(sizzle);
		},
		show: function(){
			var self = this;
			if(this.$wrapper.hasClass('show')){
				this.$wrapper.removeClass('fade');
			}else{
				this.$wrapper.removeClass('hide');
				setTimeout(function(){
					self.$wrapper.addClass('show');
				},20);
				if(Screen.histroy.length) Screen.histroy[Screen.histroy.length - 1].fade();
				Screen.histroy.push(this);
			}
			this.emit('show');
		},
		fade: function(){
			this.$wrapper.addClass('fade');
		},
		return: function(){
			var self = this;
			this.$wrapper.removeClass('show');
			setTimeout(function(){
				self.$wrapper.addClass('hide');
			},300);
			Screen.histroy.pop();
			if(Screen.histroy.length) Screen.histroy[Screen.histroy.length - 1].show();
			this.emit('return');
		}
	};

	var firstScreen = new Screen($('.first-screen'));
	var secondScreen = new Screen($('.second-screen'));
	var thirdScreen = new Screen($('.third-screen'));
	thirdScreen.$confirmBtn = thirdScreen.$wrapper.find('.confirm-btn');
	var editorScreen = new Screen($('.editor-screen'));
	editorScreen.$subtitle = editorScreen.$wrapper.find('.subtitle');
	editorScreen.$confirmBtn = editorScreen.$wrapper.find('.confirm-btn');
	var finishScreen = new Screen($('.finish-screen'));


	thirdScreen.render = function(data){
		thirdScreen.$wrapper.find('.img-wrap').html(tmpl.render('grid-list',{
			data: data
		}));
	};

	editorScreen.render = function(data,index,currentSubtitle) {
		editorScreen.currentIndex = index;
		editorScreen.find('img').attr('src', data.img);
		editorScreen.find('.default-dialogue').html(tmpl.render('dialogue-list',{
			data: data.words
		}));
		editorScreen.find('.subtitle').text(currentSubtitle)
	};

	finishScreen.render = function(base64){
		finishScreen.$wrapper.find('.output').attr('src',base64);
	};


	Screen.histroy.push(firstScreen);


	firstScreen.$startBtn = $('.start-btn').tap(function(){
		secondScreen.show();
	});


	secondScreen.$wrapper.find('.btn').tap(function(){
		thirdScreen.render(SCENE_MAP[$(this).data('type')]);
		thirdScreen.show();
	});


	thirdScreen.$wrapper.on('tap','.grid',function(){
		var $this = $(this);
		if($this.find('.subtitle').length){
			editorScreen.render($this.data('info'),$this.index(),$this.find('.subtitle').text());
			editorScreen.show();
		}
	});
	thirdScreen.$wrapper.find('.back-btn').tap(function(){
		thirdScreen.return();
	});
	thirdScreen.on('edited',function(data){
		var $currentGrid = thirdScreen.$wrapper.find('.grid').eq(data.index);
		$currentGrid.find('.subtitle').text(data.subtitle).removeClass('hide');
		$currentGrid.find('.select-btn').addClass('hide');
	}).on('show',function(){
		thirdScreen.dialogueInterval = setInterval(function(){
			if(thirdScreen.$wrapper.find('.subtitle').filter(function(){
					return !!$(this).text();
				}).length == 2){
				thirdScreen.$confirmBtn.removeClass('disable');
			}else{
				thirdScreen.$confirmBtn.addClass('disable');
			}
		},200);
	}).on('return',function(){
		clearInterval(thirdScreen.dialogueInterval);
	});
	thirdScreen.$confirmBtn.tap(function(){
		if(thirdScreen.$confirmBtn.hasClass('disable')) return false;
		var imgs = [],
			words = [];
		thirdScreen.$wrapper.find('img').forEach(function(img){
			imgs.push(img);
			if($(img).siblings('.subtitle').length){
				words.push($(img).siblings('.subtitle').text());
			}
		});
		generator.get(imgs, words).then(function(base64){
			finishScreen.render(base64);
			finishScreen.show();
		});
	});


	editorScreen.$wrapper.find('.default-dialogue').on('tap','.item',function(){
		editorScreen.$subtitle.text($(this).text());
		editorScreen.$wrapper.find('input').val('');
	});
	editorScreen.$wrapper.find('input').on('input',function(e){
		var value = $(this).val();
		if(value.length > 15){
			e.preventDefault();
			tip.show('最多只能输入15个字哦~');
		}else editorScreen.$subtitle.text(value);
	});
	editorScreen.$confirmBtn.tap(function(){
		if(editorScreen.$confirmBtn.hasClass('disable')) return false;
		editorScreen.return();
		thirdScreen.emit('edited',{
			index: editorScreen.currentIndex,
			subtitle: editorScreen.$subtitle.text()
		});
	});
	editorScreen.$wrapper.find('.back-btn').tap(function(){
		editorScreen.return();
	});
	editorScreen.on('show',function(){
		editorScreen.find('input').val('');
		editorScreen.dialogueInterval = setInterval(function(){
			if(editorScreen.$subtitle.text()) editorScreen.$confirmBtn.removeClass('disable');
			else editorScreen.$confirmBtn.addClass('disable');
		},100);
	}).on('return',function(){
		clearInterval(editorScreen.dialogueInterval);
	});

	finishScreen.find('.get-reward-btn').tap(function(){
		finishScreen.find('.reward-intro').show();
	});
	finishScreen.find('.reward-intro').tap(function(){
		finishScreen.find('.reward-intro').hide();
	}).find('.to-play-btn').tap(function(){
		location.href = 'http://bolo.163.com/m/play?videoId=14787714775161&source=h5';
	});
	finishScreen.find('.save-btn').tap(function(){
		finishScreen.find('.save-tip').show();
	});
	finishScreen.find('.again-btn').tap(function(){
		//location.href = location.href;
		finishScreen.return();
		thirdScreen.return();
	});


	var $musicBtn = $('.music-btn'),
		audio = $musicBtn.find('audio').get(0);
	$musicBtn.tap(function(){
		if($musicBtn.hasClass('off')){
			$musicBtn.removeClass('off');
			audio.play();
		}else{
			$musicBtn.addClass('off');
			audio.pause();
		}
	});



	wechat.share({
		title: '十万个脑残对话悬赏令！',
		desc: '知名漫画家竟拿亲笔签名周边贿赂粉丝！？',
		link: location.href,
		imgUrl: '/dev/images/pages/mobile/act/u17/1-0-x/share.jpg'
	});



});