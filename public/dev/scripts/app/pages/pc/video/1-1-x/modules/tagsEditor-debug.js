/**
 * Created by Dillance on 16/7/27.
 */

define(function(require, exports, module) {
	'use strict';

	var $ = require('jquery@1-11-x'),
		animation = require('animation@1-0-x'),
		tip = require('/pages/pc/video/1-0-x/modules/tip'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		user = require('/common/user@1-0-x'),
		util = require('/common/util@1-0-x'),
		tmpl = require('/common/tmpl@1-0-x'),
		Promise = require('promise@1-0-x');

	var Editor = {
		maximum: 5,
		init: function(data){
			this.videoData = data;
			this.$wrapper = $('.tags-form');
			this.$inputWrap = this.$wrapper.find('.input-wrap');
			this.$input = this.$wrapper.find('input');
			this.$count = this.$inputWrap.find('.count');
			this.$tagsList = this.$wrapper.find('.tags-list').eq(0);
			this.$tagsListMore = this.$wrapper.find('.tags-list--more');

			this.$autoComplete = this.$wrapper.find('.auto-complete');

			this.$tagsBox = this.$wrapper.find('.tags-box');
			this.$customBox = this.$tagsBox.find('.custom');
			this.$customManageBtn = this.$customBox.find('.manage-btn');
			this.$officialBox = this.$tagsBox.find('.official');

			this.currentCount = this.$inputWrap.find('.tag-item').length;
			this.render();
			this.bindEvents();
		},
		render: function(){
			var self = this;
			if(this.videoData.id){
				this.getVideoTags(this.videoData.id).then(function(result){
					result.forEach(function(d){
						self.addTag(d.tag);
					});
					//self.$officialBox.html(tmpl.render('histroy-tag',{
					//	videoData: self.videoData,
					//	data: result
					//}));
				});
			}
		},
		bindEvents: function(){
			var self = this;
			this.$inputWrap.click(function(){
				self.$input.focus();
			}).on('click','.tag-item',function(e){
				e.stopPropagation();
				self.removeExistedTag(this);
			});
			this.$input.click(function(e){
				e.stopPropagation();
			}).keypress(function(e){
				var $this = $(this),
					value = $this.val();
				if(e.keyCode == 13 && value){
					if(util.chStrLength(value) > 18){
						tip.show('请勿超过9个字');
						return false;
					}
					if(self.$autoComplete.data('current')){
						self.addTag(self.$autoComplete.data('current'));
						//self.$autoComplete.data('current','');
						//self.$autoComplete.hide();
					}else{
						self.addTag(value);
					}
					$this.val('');
				}
			}).keydown(function(e){
				var $this = $(this),
					value = $this.val();
				if(e.keyCode == 8 && !value && self.currentCount){
					var $lastItem = self.$inputWrap.find('.tag-item:last');
					$this.data('deleted-value',$lastItem.text());
					$lastItem.trigger('click');
				}else if(e.keyCode == 38){
					self.selectOptions('up');
				}else if(e.keyCode == 40){
					self.selectOptions('down');
				}
			}).keyup(function(e){
				var $this = $(this);
				if($this.data('deleted-value')){
					$this.val($this.data('deleted-value'));
					$this.data('deleted-value','');
				}
				if([13,27,37,38,39,40].indexOf(e.keyCode) < 0){
					self.autoComplete($this.val());
				}
			});

			this.$tagsList.on('click','.more',function(){
				self.$tagsListMore.show();
			});

			//this.$tagsListMore.add(this.$tagsList).on('click','.item',function(){
			//	var $this = $(this);
			//	if($this.hasClass('selected')){
			//		self.removeExistedTag($this.text());
			//	}else if(!$this.hasClass('more')){
			//		self.addTag($this.text());
			//	}
			//}).on('click','.confirm-btn',function(){
			//	self.$tagsListMore.hide();
			//});

			this.$tagsBox.on('click','.tag-item',function(){
				var $this = $(this);
				if($this.hasClass('selected')){
					self.removeExistedTag($this.text());
				}else if(!$this.hasClass('switch-btn')){
					self.addTag($this.text());
				}
			}).on('click','.switch-btn',function(){
				if(self.$officialBox.hasClass('unfold')){
					self.$officialBox.removeClass('unfold');
					$(this).text('更多');
				}else{
					self.$officialBox.addClass('unfold');
					$(this).text('收起');
				}
			});

			this.$autoComplete.on('click','.item',function(){
				self.addTag($(this).text());
				self.$input.val('');
				self.$autoComplete.hide();
			}).mouseenter(function(){
				self.$autoComplete.find('.selected').removeClass('selected');
			});
		},
		addTag: function(value){
			if(this.currentCount >= this.maximum){
				tip.show('最多只能5个标签哦~');
				return false;
			}
			if(!this.getExistedTag(value).length) {
				this.$input.before(tmpl.render('tag-item', {
					data: value
				}));
				this.updateCount();
				if (this.currentCount >= this.maximum) this.$input.blur().hide();

				//this.$tagsListMore.find('.item').each(function(){
				//	if($(this).text() == value) $(this).addClass('selected');
				//});
				//this.$tagsList.find('.item').each(function(){
				//	if($(this).text() == value) $(this).addClass('selected');
				//});

				this.$officialBox.find('.tag-item').each(function(){
					if($(this).text() == value){
						$(this).addClass('selected');
					}
				});

				this.$autoComplete.data('current','').hide();

				return true;
			}
		},
		removeExistedTag: function(value){
			var self = this,
				$node;
			if(value.nodeType){
				$node = $(value);
				value = $node.text();
				$node.remove();
			}else{
				this.getExistedTag(value).each(function(){
					self.removeExistedTag(this);
				});
				return;
			}
			//this.$tagsListMore.find('.item').each(function(){
			//	if($(this).text() == value) $(this).removeClass('selected');
			//});
			//this.$tagsList.find('.item').each(function(){
			//	if($(this).text() == value) $(this).removeClass('selected');
			//});
			this.$officialBox.find('.tag-item').each(function(){
				if($(this).text() == value) $(this).removeClass('selected');
			});
			if(this.currentCount >= 5) this.$input.show();
			this.updateCount();
		},
		getExistedTag: function(value){
			var self = this,
				$existedItem = self.$inputWrap.find('.tag-item').map(function(){
					if(value == $(this).text()){
						self.existedError(this);
						return this;
					}
				});
			return $existedItem;
		},
		updateCount: function(){
			this.currentCount = this.$inputWrap.find('.tag-item').length;
			this.$count.text(this.currentCount + '/' + this.maximum);
		},
		existedError: function(node){
			var $node = $(node);
			animation.add({
				startValue: 0,
				endValue: 10,
				duration: 600,
				step: function(v){
					var x = Math.floor(Math.random() * 5 - 2),
						y = Math.floor(Math.random() * 5 - 2);
					$node.css('transform','translate(' + x + 'px,' + y + 'px)');
				},
				oncomplete: function(){
					$node.css('transform','translate(0,0)');
				}
			})
		},
		getVideoTags: function(videoId){
			return new Promise(function(resolve){
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/tag/videoTagList.htm',
					dataType: 'json',
					data: {
						videoId: videoId
					},
					success: function(result){
						resolve(result);
					}
				})
			});
		},
		autoComplete: function(value){
			var self = this;
			if(self.autoCompleteTimer) clearTimeout(self.autoCompleteTimer);
			if(value){
				self.autoCompleteTimer = setTimeout(function(){
					$.ajax({
						url: HttpHelper.getOrigin() + '/bolo/api/tag/searchTag.htm',
						dataType: 'json',
						data: {
							key: value
						},
						success: function(result){
							if(result.length){
								if(result.length > 5) result.length = 5;
								self.$autoComplete.html(tmpl.render('auto-complete',{
									data: result
								})).css('left',self.$input.offset().left - self.$wrapper.offset().left + 'px').show();
							}else{
								self.$autoComplete.hide();
							}
						}
					})
				},300);
			}else{
				self.$autoComplete.hide();
			}
		},
		selectOptions: function(direction){
			var self = this,
				$currentSelectedItem = this.$autoComplete.find('.selected'),
				$nextSelectedItem;
			if(direction == 'down'){

				$currentSelectedItem.length ?
					$nextSelectedItem = $currentSelectedItem.next() :
					$nextSelectedItem = this.$autoComplete.find('.item:eq(0)');
				$nextSelectedItem.length || ($nextSelectedItem = this.$autoComplete.find('.item:eq(0)'));

			}else if(direction == 'up'){

				$currentSelectedItem.length ?
					$nextSelectedItem = $currentSelectedItem.prev() :
					$nextSelectedItem = this.$autoComplete.find('.item:eq(-1)');
				$nextSelectedItem.length || ($nextSelectedItem = this.$autoComplete.find('.item:eq(-1)'));

			}
			$currentSelectedItem.length && $currentSelectedItem.removeClass('selected');
			$nextSelectedItem.addClass('selected');
			self.$autoComplete.data('current',$nextSelectedItem.text());
		}
	};

	return Editor;

});