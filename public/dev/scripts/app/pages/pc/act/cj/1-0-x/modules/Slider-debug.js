define(function(require, exports, module) {
	var $ = require('jquery@1-11-x');
	function Slider(container,options){
		this.container = container;
		this.options = $.extend({
			preBtnEle:'',
			nextBtnELe:'',
			moveEle:'',
			itemEle:'',
			index:0,
			callback:function(){

			}
		},options);
		this.init();
		
	}
	Slider.prototype = {
		init:function(){
			
			var self = this;
			var index = self.options.index;
			var items = $(self.container).find(self.options.itemEle);
			var itemWidth = $(items).eq(0).width();
			var hander = function(index){
				$(self.container).find(self.options.moveEle).stop().animate({
					left:(itemWidth*index*-1)+'px'
				},'slow',function(){
					self.options.callback();
				})
				if(index==0){
					$(self.container).find(self.options.preBtnEle).css('display','none');
				}else{
					$(self.container).find(self.options.preBtnEle).css('display','block');
				}
				if(index==items.length-1){
					$(self.container).find(self.options.nextBtnELe).css('display','none');
				}else{
					$(self.container).find(self.options.nextBtnELe).css('display','block');
				}
			}
			$(self.container).find(self.options.preBtnEle).unbind('click');
			$(self.container).find(self.options.preBtnEle).click(function(){
				if(index==0){
					return;
				}
					index--;
					hander(index);
			})
			$(self.container).find(self.options.nextBtnELe).unbind('click');
			$(self.container).find(self.options.nextBtnELe).click(function(){
				if(index==(items.length-1)){
					return;
				}
					index++;
					hander(index);
				
			})
			hander(index);

		},

	}
	module.exports = Slider;
});