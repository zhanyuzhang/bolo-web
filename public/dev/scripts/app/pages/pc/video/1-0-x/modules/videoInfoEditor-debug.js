/**
 * Created by Dillance on 16/8/2.
 */
define(function(require, exports, module) {
	'use strict';

	var $ = require('jquery@1-11-x'),
		user = require('/common/user@1-0-x'),
		tagsEditor = require('/pages/pc/video/1-1-x/modules/tagsEditor'),
		HttpHelper = require('/common/HttpHelper@1-0-x'),
		tip = require('/pages/pc/video/1-0-x/modules/tip'),
		addSetDialog = require('/pages/pc/video/1-0-x/modules/add-set'),
		cookie = require('cookie@1-0-x'),
		tmpl = require('/common/tmpl@1-0-x');

	var InfoEditor = function($wrapper,data,callback){
		this.$wrapper = $wrapper;
		this.data = data;
		this.callback = callback;

		this.init();
	};

	InfoEditor.prototype = {
		init: function(){
			var self = this;
			this.lastData = this.getLastData();

			//if(this.data.upload && lastData){
			//	this.data = $.extend(JSON.parse(lastData),this.data);
			//}

			EDITOR_INFO.zoneList.forEach(function(z){
				if(z.name == self.data.zoneName) self.data.zoneId = z.id;
			});

			this.$containers = $(tmpl.render('info-editor',{
				data: this.data,
				isShowFillLastDataBtn: this.data.upload && this.lastData,
				currentExsistSequences: (function(){
					var currentSet = EDITOR_INFO.sets.filter(function(s){return s.id == self.data.sid})[0];
					if(currentSet) return currentSet.exsistSequences;
					else return [];
				}())
			}));

			this.$fillLastDataBtn = this.$containers.find('.fill-last-data-btn a');

			this.$titleForm = this.$containers.find('.title-form');
			this.$titleCount = this.$titleForm.find('.count');
			this.$zoneSelector = this.$containers.find('.selector.zone');
			this.$videoSetSelector = this.$containers.find('.selector.video-set');
			this.$episodesInput = this.$containers.find('.episodes input');

			this.formData = new FormData();
			this.bindEvents();
			this.render();
			tagsEditor.init(self.data);
			return this;
		},
		render: function(){
			var self = this;
			this.$wrapper.html(this.$containers);
			if(!this.$zoneSelector.find('.current-value').text()){
				this.$zoneSelector.find('.item:eq(0)').trigger('click');
			}
			if(!this.$videoSetSelector.find('.current-value').text()){
				this.$videoSetSelector.find('.item:eq(1)').trigger('click');
			}
			this.$titleCount.text(this.$titleForm.find('input').val().length + '/30');
		},
		bindEvents: function(){
			var self = this;

			this.$titleForm.find('input').focus(function(){
				var $this = $(this);
				if($this.data('countingInterval')){
					clearInterval($this.data('countingInterval'));
				}
				$this.data('countingInterval',setInterval(function(){
					self.$titleCount.text($this.val().length + '/30');
				},200));
			}).blur(function(){
				var $this = $(this);
				if($this.data('countingInterval')){
					clearInterval($this.data('countingInterval'));
				}
			});

			this.$containers.find('.return-btn').click(function(){
				if(self.callback) self.callback();
			});
			this.$containers.find('.submit-btn').click(function(){
				self.submit();
			});
			this.$containers.find('.category-list').on('click','.c-item',function(){
				var $this = $(this);
				if($this.hasClass('selected')){
					$this.removeClass('selected');
					//self.currentCategory.splice(self.currentCategory.indexOf($this.text()));
				}else if($this.siblings('.selected').length < 3){
					$this.addClass('selected');
				}else self.existedErrorTip($this.siblings('.selected'));
			});
			this.$containers.find('.selector').mouseenter(function(){
				$(this).addClass('hover');
			}).mouseleave(function(){
				$(this).removeClass('hover');
			}).filter('.zone').on('click','.item',function(){
				var $this = $(this);
				if(!$this.data('children-category')){
					var categoryList = [];
					EDITOR_INFO.categorys.forEach(function(c){
						if(c.parentId == $this.data('id')){
							categoryList.push(c);
						}
					});
					$this.data('children-category',JSON.stringify(categoryList));
				}
				self.$containers.find('.selector.zone').removeClass('hover').find('.current-value').text($this.text());
				self.$containers.find('.category-list').html(tmpl.render('category-item',{
					data: JSON.parse($this.data('children-category'))
				}));
			});
			self.$videoSetSelector.on('click','.item',function(){
				var $this = $(this),
					existSequences = $this.data('exist-sequences');
				if($this.hasClass('add-btn')){
					addSetDialog.show(function(data){
						if(data){
							self.$containers.find('.selector.video-set .current-value').text(data.name).data('id',data.id);
							$this.after('<li class="item" data-id="' + data.id + '">' + data.name + '</li>');
						}
					});
				}else{
					self.$videoSetSelector.removeClass('hover').find('.current-value').text($this.text())
						.data({
							id: $this.data('id')
						});
					self.$videoSetSelector.removeClass('hover').find('.current-value').text($this.text())
						.data({
							id: $this.data('id'),
							existSequences: existSequences
						});
					self.$episodesInput.val(existSequences.length ? (existSequences[existSequences.length - 1] + 1) : 1);
				}
			});

			self.$episodesInput.focus(function(){
				var $this = $(this),
					value = $this.val();
				$this.data('old-value',value);
			}).blur(function(){
				var $this = $(this),
					value = $this.val(),
					oldValue = $this.data('old-value'),
					existSequences = self.$videoSetSelector.find('.current-value').data('exist-sequences');
				if(existSequences.indexOf(parseInt(value)) >= 0){
					$this.val(oldValue);
					tip.show('此集数已存在');
				}
			});

			self.$fillLastDataBtn.click(function(){
				self.$fillLastDataBtn.parent().hide();
				self.fillLastData();
			});
		},
		existedErrorTip: function($node){
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
		},
		submit: function(){
			var self = this;
			if(this.data.upload && !this.data.uploadId){
				tip.show('请先完成上传');
				return false;
			}
			var title = this.$containers.find('input[name=title]').val(),
				categorys = this.$containers.find('.category-list .selected').map(function(){
					return $(this).data('id');
				}),
				categoryName = this.$containers.find('.category-list .selected').map(function(){
					return $(this).data('name');
				}),
				tags = this.$containers.find('.tags-form .input-wrap .tag-item').map(function(){
					return $(this).text();
				}),
				videoSetId = this.$containers.find('.video-set .current-value').data('id'),
				videoSetNum = this.$containers.find('.episodes input').val(),
				videoIntro = this.$containers.find('textarea').val();

			if(!title) tip.show('请输入标题');
			else if(title.length >= 30) tip.show('标题长度不能超过30');
			else if(!categorys.length) tip.show('请选择分类');
			else if(!tags.length) tip.show('请输入标签');
			else if(!videoSetId) tip.show('请选择选集');
			else if(!videoSetNum) tip.show('请输入集数');
			else if(videoSetNum.match(/[^0-9]/) || videoSetNum == 0) tip.show('集数只能是大于0的正整数');
			else if(!videoIntro) tip.show('请输入简介');
			else{
				this.formData.append('uploadId',this.data.uploadId);
				this.formData.append('videoId',this.data.id);
				this.formData.append('videoTitle',encodeURIComponent(title));
				this.formData.append('category',Array.prototype.join.call(categorys,','));
				this.formData.append('tags',encodeURIComponent(Array.prototype.join.call(tags,',')));
				this.formData.append('videoSet',videoSetId);
				this.formData.append('videoSetNum',videoSetNum);
				this.formData.append('videoIntro',encodeURIComponent(videoIntro));
				if(this.data.selfUploadCover){
					this.formData.append('selfUploadCover',this.data.selfUploadCover);
				}else if(this.data.cover){
					this.formData.append('cover',this.data.cover);
				}
				this.formData.append('userId',user.userIdStr);

				var type = this.data.uploadTime ? 'editVideo' : 'editUpload';
				$.ajax({
					url: HttpHelper.getOrigin() + '/bolo/api/web/video/' + type + '.do',
					type: 'post',
					data: this.formData,
					dataType: 'json',
					contentType: false,    //不可缺
					processData: false,    //不可缺
					xhrFields: {
						withCredentials: true
					},
					success: function(result){
						if(result.status == 0){
							if(self.data.upload){
								self.storeCurrentData({
									categoryName: Array.prototype.join.call(categoryName,',').split(','),
									tags: Array.prototype.join.call(tags,',').split(','),
									sid: videoSetId,
									setNum: videoSetNum,
									intro: videoIntro,
									zoneName: self.$zoneSelector.find('.current-value').text()
								});
								$('.submit-success-dialog').show();
							}else{
								tip.show('修改成功',function(){
									location.href = location.href;
								},true);
							}
						}else{
							tip.show(result.msg);
						}
					}
				});
			}

		},
		storeCurrentData: function(data){
			cookie.set('lastVideoData',JSON.stringify(data));
		},
		getLastData: function(){
			var lastData = cookie.get('lastVideoData');
			if(lastData){
				try{
					return JSON.parse(lastData);
				}catch(e){
					throw new Error('unacceptable lastVideoData::' + e);
					return false;
				}
			}else return lastData;
		},
		fillLastData: function(){
			var self = this;
			this.$zoneSelector.find('.item').each(function(){
				var $this = $(this);
				if($this.text() == self.lastData.zoneName) $this.trigger('click');
			});
			this.$containers.find('.category-list .c-item').each(function(){
				var $this = $(this);
				if(self.lastData.categoryName.indexOf($this.data('name')) >= 0) $this.trigger('click');
			});
			this.lastData.tags.forEach(function(t){
				tagsEditor.addTag(t);
			});
			this.$videoSetSelector.find('.item').each(function(){
				var $this = $(this);
				if($this.data('id') == self.lastData.sid) $this.trigger('click');
			});
			this.$containers.find('textarea').val(self.lastData.intro);
		}

	};

	return InfoEditor;

});