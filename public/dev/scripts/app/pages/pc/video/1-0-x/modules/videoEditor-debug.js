/**
 * Created by Dillance on 16/6/20.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('jquery@1-11-x'),
		tip = require('/pages/pc/video/1-0-x/modules/tip'),
		coverEditor = require('/pages/pc/video/1-0-x/modules/coverEditor'),
		tagsEditor = require('/pages/pc/video/1-0-x/modules/tagsEditor');

	var UploadInfo = {
		$wrapper: $('.upload-info'),
		init: function(file){
			//this.render(file);
			this.bindEvents();
		},
		render: function(file){
			this.$wrapper.find('.title').text('正在上传：' + file.name);
		},
		bindEvents: function(){
			var self = this;
			this.$wrapper.find('.cover-edit-btn').click(function(){
				coverEditor.init();
			});
		}
	};

	var Page = {
		$wrapper: $('.page-container.upload'),
		init: function(file){
			UploadInfo.init(file);
			tagsEditor.init();

			this.currentCategory = [];
			this.$categoryList = this.$wrapper.find('.category-list');

			this.currentTags = [];
			this.$tagsForm = this.$wrapper.find('.tags-form');
			//this.$tagsInputList = this.$tagsForm.find('.inputs-list');
			//this.$tagInputs = this.$tagsInputList.find('input');
			//this.$tagsList = this.$tagsInputList.siblings('.tags-list');
			//this.$tagsListMore = this.$tagsForm.find('.tags-list--more');

			this.$wrapper.addClass('show');
			this.bindEvents();
		},
		bindEvents: function(){
			var self = this;
			this.$categoryList.on('click','.c-item',function(){
				var $this = $(this);
				if($this.hasClass('selected')){
					$this.removeClass('selected');
					self.currentCategory.splice(self.currentCategory.indexOf($this.text()));
				}else if(self.currentCategory.length < 3){
					$this.addClass('selected');
					self.currentCategory.push($this.text());
				}else self.shakeTheBox($this.siblings('.selected'));
			});

			//this.$tagsList.on('click','.more',function(){
			//	self.$tagsListMore.show();
			//});
			//
			//this.$tagsListMore.on('click','.item',function(){
			//	var $this = $(this);
			//	if($this.hasClass('selected')){
			//		$this.removeClass('selected');
			//		self.$tagInputs.each(function(){
			//			if(this.value == $this.text()) this.value = '';
			//		});
			//		self.currentCategory.splice(self.currentCategory.indexOf($this.text()));
			//	}else if(self.currentCategory.length < 3){
			//		$this.addClass('selected');
			//		self.currentCategory.push($this.text());
			//		for(var i = 0;i < 3;i++){
			//			if(!self.$tagInputs.eq(i).val()){
			//				self.$tagInputs.eq(i).val($this.text());
			//				break;
			//			}
			//		}
			//	}else{
			//		self.$tagsListMore.hide();
			//		self.shakeTheBox(self.$tagsInputList.find('.input-wrap'));
			//	}
			//}).find('.confirm-btn').click(function(){
			//	self.$tagsListMore.hide();
			//});

			//this.$tagInputs.focus(function(){
			//	$(this).data('last-value',this.value);
			//}).blur(function(){
			//	var $this = $(this);
			//	if($this.val() != $this.data('last-value')){
			//		for(var i = 0;i < self.$tagInputs.length;i++){
			//			if(self.$tagInputs.eq(i).get(0) != this && $this.val() == self.$tagInputs.eq(i).val()){
			//				self.shakeTheBox(self.$tagInputs.eq(i).parent('.input-wrap'));
			//				$this.val('');
			//				return false;
			//			}
			//		}
			//		var isMatch = self.$tagsListMore.find('.item').filter(function(){
			//			var $thisItem = $(this);
			//			if($thisItem.text() == $this.data('last-value')) $thisItem.trigger('click');
			//			else if($thisItem.text() == $this.val()){
			//				$thisItem.trigger('click');
			//				return true;
			//			}
			//		});
			//		if(!isMatch) self.currentCategory.push($this.val());
			//	}
			//});

		},
		shakeTheBox: function($node){
			$node.each(function(){
				var $this = $(this);
				var count = 12;
				var interval = setInterval(function(){
					if(count <= 0){
						$this.css('transform','translate(0,0)');
						clearInterval(interval);
						return false;
					}
					count--;
					var x = Math.floor(Math.random()*(3+2)-2),
						y = Math.floor(Math.random()*(3+2)-2);
					$this.css('transform','translate(' + x + 'px,' + y + 'px)');
				},40);
			});
		}
	};



	return Page;

});