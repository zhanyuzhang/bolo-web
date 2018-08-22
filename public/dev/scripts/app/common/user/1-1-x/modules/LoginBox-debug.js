define(function(require, exports, module) {
	var $ = require('jquery@1-11-x');
	var Module = require('/common/user/1-1-x/modules/Module');
	var FloatWin = require('/common/user/1-1-x/modules/FloatWin');
	var Util = require('/common/user/1-1-x/modules/Util');
	var tmpl = require('/common/user/1-1-x/modules/tmpl');
	var UrsConfig = require('/common/user/1-1-x/modules/Config');

	var LoginBox = Module.extend({
		preRender: function () {
			var data = {
				url: Util.encodeSpecialHtmlChar(window.location.href),
				isMainland: 1,
				loginType: this.options.loginType
			};
			data.encodeUrl = encodeURI(encodeURI(data.url));
			return {
				content: tmpl.formatTemplate('common/login/loginLayer', data)
			}
		},

		postRender: function($elem) {
			this.$elem = $elem;
			this.$elem.addClass('loginLayer');

			this.$elem.find('.dialogLayer-hd').find('.js-close').removeClass('btn-close').addClass('btn-login-close');
			//    马上参与
			this.$elem.find('.dialogLayer-hd').append('<a class="receive-now" href="http://www.bobo.com/special/bobopc/" target="_blank">马上参与</a>');
			var config = {};
			if (this.options.loginType === 'register') {
				config.page = 'register';
			}
			//if (!this.options.loginType === 'register') {
				new URS('', '', UrsConfig.getConfig(config));
			//}
		},

		show: function (options) {
			this.options = $.extend({}, options);
			FloatWin.PopWin({
				preRender: $.proxy(this.preRender, this),
				postRender: $.proxy(this.postRender, this)
			}).show();
		}
	});

	return LoginBox;
});