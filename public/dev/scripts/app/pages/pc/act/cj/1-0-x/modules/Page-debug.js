define(function(require, exports, module) {
	var $ = require('jquery@1-11-x');
	function Page(container,options){
		this.container = container;
		this.options = $.extend({
			centerPageContainer:'',//中间页数样式
			preEle:'',//上一页
			nextEle:'',//下一页
			preMoreEle:'.pagelmore',
			nextMoreEle:'.pagermore',
			count:'',//总数
			perPageCount:'',//每页数目,
			pageSize:'',//总页数 初始化时候已算
			maxPage:5,//最多展示几页
			callback:function(index){
				console.log('this is callback'+index);
			}//回调函数
		},options);
		this.init();
		this.onEvents();
	}
	Page.prototype = {
		init:function(){
			var self = this;
			var str = '';
			self.options.pageSize = Math.ceil(self.options.count/self.options.perPageCount);
			for(var i=1;i<=self.options.pageSize;i++){
				if(i>self.options.maxPage){
					if((self.options.pageSize-self.options.maxPage)>=(self.options.maxPage-1)){
						str+='<a class="page pagermore">...</a>';
					}
					str+='<a href="javascript:void(0)" class="page pageclick">'+self.options.pageSize+'</a>';
					break;
				}else{
					if(i==1){
						str+='<a href="javascript:void(0)" class="page pageclick cur">'+i+'</a>';
						str+='<a class="page pagelmore">...</a>';
					}else{
						str+='<a href="javascript:void(0)" class="page pageclick">'+i+'</a>';
					}
					
				}
			}
			$(self.container).find(self.options.centerPageContainer).html(str);
		},
		onEvents:function(){
			var self = this;
			var index = 1;
			var tempIndex = 0;
			var links = $(self.container).find(self.options.centerPageContainer).find('.pageclick');
			var preEle = $(self.container).find(self.options.preEle);
			var nextEle = $(self.container).find(self.options.nextEle);
			var preMoreEle = $(self.container).find(self.options.preMoreEle);
			var nextMoreEle = $(self.container).find(self.options.nextMoreEle);
			self.controlNPBtn(index,preEle,nextEle);
			self.controlMBtn(index,preMoreEle,nextMoreEle);
			var curTarge = null;
			var hander = function(){
						self.controlNPBtn(index,preEle,nextEle);
						self.controlMBtn(index,preMoreEle,nextMoreEle);
						if(index==1){
							self.renderStart();
						}else if(self.options.pageSize>self.options.maxPage){
								if((self.options.pageSize-index)<=(self.options.maxPage-2)){
								  self.renderEnd(index);
								}else if((index-self.options.maxPage)%(self.options.maxPage-2)==0){
										self.render(index);
								}else if(index==self.options.pageSize){
									self.renderEnd(index);
								}   
						}
			}
			for(var i=0;i<links.length;i++){
					$(links).eq(i).click(function(){
						$(self.container).find(self.options.centerPageContainer).find('.cur').removeClass('cur');
						$(this).addClass('cur');
						index = parseInt($(this).html());
						hander();
						self.callback(index);
					})
				
			}
			$(preEle).click(function(){
				tempIndex = index;
				if((index-self.options.maxPage)%(self.options.maxPage-2)==0){
					index = index-(self.options.maxPage-2);
					hander();
				}
				index = tempIndex;
				index--;
				hander();
				self.addCurByIndex(index);
				self.callback(index);

			});
			$(nextEle).click(function(){
				index++;
				hander();
				self.addCurByIndex(index);
				self.callback(index);
			});


		},
		controlNPBtn:function(index,preEle,nextEle){
			if(index==1){
				$(preEle).css('display','none');
				$(nextEle).css('display','block');
				if(index==this.options.pageSize){
					$(nextEle).css('display','none');
				}
			}else if(index==this.options.pageSize){
				$(preEle).css('display','block');
				$(nextEle).css('display','none');
			}else{
				$(preEle).css('display','block');
				$(nextEle).css('display','block');
			}
		},
		controlMBtn:function(index,preEle,nextEle){
			if(index>=1&index<this.options.maxPage){
				$(preEle).css('display','none');
				$(nextEle).css('display','block');
			}else if(index<=this.options.pageSize&index>(this.options.pageSize-this.options.maxPage)){
				$(preEle).css('display','block');
				$(nextEle).css('display','none');
			}else{
				$(preEle).css('display','block');
				$(nextEle).css('display','block');
			}
		},
		render:function(index){
			var self = this;
			var links = $(self.container).find(self.options.centerPageContainer).find('.pageclick');
			for(var i=0;i<links.length;i++){
				if(i!=0&i!=links.length-1){
					$(links).eq(i).html(index+i-1);
					if(i==1){
						$(self.container).find(self.options.centerPageContainer).find('.cur').removeClass('cur');
						$(links).eq(i).addClass('cur');
					}
				}
			}
		},
		renderEnd:function(index){
			var self = this;
			var links = $(self.container).find(self.options.centerPageContainer).find('.pageclick');
			for(var i=0;i<links.length;i++){
				if(i!=0&i!=links.length-1){

					var num = self.options.pageSize-links.length+1+i;
					if(num==index){
						$(self.container).find(self.options.centerPageContainer).find('.cur').removeClass('cur');
						$(links).eq(i).addClass('cur');
					}
					$(links).eq(i).html(num);
					
					
				}
			}
		},
		renderStart:function(){
			var self = this;
			var links = $(self.container).find(self.options.centerPageContainer).find('.pageclick');
			for(var i=0;i<links.length;i++){
				if(i!=0&i!=links.length-1){
					$(links).eq(i).html(i+1);
				}
			}
		},
		addCurByIndex:function(index){
			var self = this;
			var links = $(self.container).find(self.options.centerPageContainer).find('.pageclick');
			for(var i=0;i<links.length;i++){
					var num = parseInt($(links).eq(i).html());
					if(num==index){
						$(self.container).find(self.options.centerPageContainer).find('.cur').removeClass('cur');
						$(links).eq(i).addClass('cur');
					}
			}
		},
		callback:function(index){
			var self = this;
			self.options.callback(index);
		}

	}
	module.exports = Page;
});