define(function(require, exports, module) {

	var $ = require('jquery@1-11-x');
	function ClickControl(container,options){
		this.container = container;
		this.options = $.extend({
			itemEle:'',
			callback:function(i){
				
			}
		},options);
		this.init();
	}
	ClickControl.prototype = {
		init:function(){
			var self = this;
			var links = $(self.container).find(self.options.itemEle);
			for(var i=0;i<links.length;i++){
				(function(i){
					$(links).eq(i).click(function(){

						self.options.callback(i);
					})
				})(i);
			}
		}
	}
	module.exports = ClickControl;
});