/**
 * Created by Dillance on 16/7/27.
 */

define(function(require, exports, module) {
	'use strict';

	var $ = require('jquery@1-11-x'),
		animation = require('animation@1-0-x'),
		tip = require('/pages/pc/video/1-0-x/modules/tip'),
		util = require('/common/util@1-0-x'),
		tmpl = require('/common/tmpl@1-0-x');

	var Editor = {
		maximum: 5,
		init: function(){
			this.$wrapper = $('.tags-form');
			this.$inputWrap = this.$wrapper.find('.input-wrap');
			this.$input = this.$wrapper.find('input');
			this.$count = this.$inputWrap.find('.count');
			this.$tagsList = this.$wrapper.find('.tags-list').eq(0);
			this.$tagsListMore = this.$wrapper.find('.tags-list--more');
			this.currentCount = this.$inputWrap.find('.tag-item').length;
			this.render();
			this.bindEvents();
		},
		render: function(){

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
					self.addTag(value);
					$this.val('');
				}
			}).keydown(function(e){
				var $this = $(this),
					value = $this.val();
				if(e.keyCode == 8 && !value && self.currentCount){
					var $lastItem = self.$inputWrap.find('.tag-item:last');
					$this.data('deleted-value',$lastItem.text());
					$lastItem.trigger('click');
				}
			}).keyup(function(e){
				var $this = $(this);
				if($this.data('deleted-value')){
					$this.val($this.data('deleted-value'));
					$this.data('deleted-value','');
				}
			});

			this.$tagsList.on('click','.more',function(){
				self.$tagsListMore.show();
			});

			this.$tagsListMore.add(this.$tagsList).on('click','.item',function(){
				var $this = $(this);
				if($this.hasClass('selected')){
					self.removeExistedTag($this.text());
				}else if(!$this.hasClass('more')){
					self.addTag($this.text());
				}
			}).on('click','.confirm-btn',function(){
				self.$tagsListMore.hide();
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

				this.$tagsListMore.find('.item').each(function(){
					if($(this).text() == value) $(this).addClass('selected');
				});
				this.$tagsList.find('.item').each(function(){
					if($(this).text() == value) $(this).addClass('selected');
				});

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
			this.$tagsListMore.find('.item').each(function(){
				if($(this).text() == value) $(this).removeClass('selected');
			});
			this.$tagsList.find('.item').each(function(){
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
		}
	};

	return Editor;

});