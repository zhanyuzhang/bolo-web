define(function(require, exports, module) {

	var $ = require('jquery@1-11-x');
	function SeqTab(container,options){
		this.container = container;
		this.options = $.extend({
			linkEle:'',
			linkCurClass:'',
			itemELe:'',
			itemCurClass:'',
			callback:function(i,ele){
				console.log(i);
			}
		},options);
		this.init();
	}
	SeqTab.prototype = {
		init:function(){
			var self = this;
			var links = $(self.container).find(self.options.linkEle);
			var items = $(self.container).find(self.options.itemELe);
			for(var i=0;i<links.length;i++){
				(function(i){
					$(links).eq(i).click(function(){
						$(self.container).find('.'+self.options.linkCurClass).removeClass(self.options.linkCurClass);
						$(self.container).find('.'+self.options.itemCurClass).removeClass(self.options.itemCurClass);
						$(this).addClass(self.options.linkCurClass);
						$(items).eq(i).addClass(self.options.itemCurClass);
						self.options.callback(i,$(this));
					})
				})(i);
			}
		}
	}
	module.exports = SeqTab;
});