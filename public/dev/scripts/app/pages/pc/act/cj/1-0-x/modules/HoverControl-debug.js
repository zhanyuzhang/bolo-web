define(function(require, exports, module) {

	var $ = require('jquery@1-11-x');
	function HoverControl(container,options){
		this.container = container;
		this.options = $.extend({
			itemEle:'',
			itemCurClass:'',
			callback1:function(i,ele){

			},
			callback2:function(i,ele){

			}
		},options);
		this.init();
	}
	HoverControl.prototype = {
		init:function(){
			var self = this;
			var links = $(self.container).find(self.options.itemEle);
			for(var i=0;i<links.length;i++){
				(function(i){
					$(links).eq(i).hover(function(){
						$(this).addClass(self.options.itemCurClass);
						self.options.callback1(i,$(this));
					},function(){
						$(this).removeClass(self.options.itemCurClass);
						self.options.callback2(i,$(this));
					})
				})(i);
			}
			
		}
	}
	module.exports = HoverControl;
});