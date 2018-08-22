define(function(require, exports, module) {
	var $ = require('jquery@1-11-x');
	//按顺序滚
	function SeqScroll(container,options){
		this.container = container;
		this.options = $.extend({
			offsetEle:'',
		},options);
		//this.init();

	}
	SeqScroll.prototype = {
		getPosA:function(){
			var self = this;
			var offsetPos = [];
			var offsetEles = $(self.container).find(self.options.offsetEle);
			for(var i=0;i<offsetEles.length;i++){
				offsetPos.push($(offsetEles).eq(i).offset().top);
			}
			return offsetPos;
		}
	}
	module.exports = SeqScroll;
});