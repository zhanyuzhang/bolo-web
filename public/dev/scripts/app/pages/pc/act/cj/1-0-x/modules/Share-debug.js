define(function(require, exports, module) {
		var ShareTip = function(){  }  
//分享到腾讯微博  
ShareTip.sharetoqq = function(content,url,picurl){
	content = encodeURIComponent(content);
	var shareqqstring = 'http://v.t.qq.com/share/share.php?title=' + content + '&url=' + url + '&pic=' + picurl;  
	window.open(
		shareqqstring,
		'newwindow',
		'height='+ShareTip.height+',width='+ShareTip.width+',top='+ShareTip.top()+',left='+ShareTip.left()
	);  
}  
//分享到新浪微博  
ShareTip.sharetosina = function(title,url,picurl){
	title = encodeURIComponent(title);
	var sharesinastring = 'http://v.t.sina.com.cn/share/share.php?count=1&title=' + title + '&url=' + url + '&content=utf-8&sourceUrl=' + url + '&pic=' + picurl;  
	window.open(
		sharesinastring,
		'newwindow',
		'height='+ShareTip.height+',width='+ShareTip.width+',top='+ShareTip.top()+',left='+ShareTip.left()
	);  
}  
//分享到QQ空间  
ShareTip.sharetoqqzone = function(title,url,picurl,desc,summary){
	title = encodeURIComponent(title);
	var shareqqzonestring = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title=' + title + '&url=' + url + '&pics=' + picurl +'&desc='+desc +'&summary='+summary;  
	window.open(
		shareqqzonestring,
		'newwindow',
		'height='+ShareTip.height+',width='+ShareTip.width+',top='+ShareTip.top()+',left='+ShareTip.left()
	);
}
ShareTip.top = function(){
	var iWidth=ShareTip.width; //弹出窗口的宽度;
	var iHeight=ShareTip.height; //弹出窗口的高度;
	var iTop = (window.screen.availHeight-iHeight)/2; //获得窗口的垂直位置;
	return iTop;
}
ShareTip.left = function(){
	var iWidth=ShareTip.width; //弹出窗口的宽度;
	var iHeight=ShareTip.height; //弹出窗口的高度;
	var iLeft = (window.screen.availWidth-iWidth)/2; //获得窗口的水平位置;
	return iLeft;
	
}
ShareTip.width =400;
ShareTip.height = 400;
module.exports = ShareTip;

	/*
		新浪微博：
		http://service.weibo.com/share/share.php?url=
		count=表示是否显示当前页面被分享数量(1显示)(可选，允许为空)
		&url=将页面地址转成短域名，并显示在内容文字后面。(可选，允许为空)
		&appkey=用于发布微博的来源显示，为空则分享的内容来源会显示来自互联网。(可选，允许为空)
		&title=分享时所示的文字内容，为空则自动抓取分享页面的title值(可选，允许为空)
		&pic=自定义图片地址，作为微博配图(可选，允许为空)
		&ralateUid=转发时会@相关的微博账号(可选，允许为空)
		&language=语言设置(zh_cn|zh_tw)(可选)
		http://service.weibo.com/share/share.php?url=bolo.bobo.com/act/cj&title=网易菠萝CHINAJOY 我竟然在CJ上看这个~~不能只有我一个人high!&pic=http://img1.cache.netease.com/love/image/app/wb_share.png

		腾讯微博：
		http://share.v.t.qq.com/index.php?c=share&a=index
		&title=默认的文本内容或RICH化转播时的消息体标题，RICH化时最多15个全角字符的长度
		&url=转播页的url
		&pic=需要转播的图片url，多张以|连接
		&appkey=填写正确的appkey，转播后将显示该key的来源
		&line1=消息体第一行的文字，最多15个全角字符的长度
		&line2=消息体第二行的文字，最多15个全角字符的长度
		&line3=消息体第三行的文字，最多15个全角字符的长度
		API文档：http://wiki.open.t.qq.com/index.php/一键转播rich化参数详解

		人人网：
		http://widget.renren.com/dialog/share?
		resourceUrl=分享的资源Url
		&srcUrl=分享的资源来源Url,默认为header中的Referer,如果分享失败可以调整此值为resourceUrl试试
		&pic=分享的主题图片Url
		&title=分享的标题
		&description=分享的详细描述
		API文档：http://dev.renren.com/website/?widget=rrshare&content=use
		

		QQ空间：
		http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?
		url=分享的网址
		&desc=默认分享理由(可选)
		&summary=分享摘要(可选)
		&title=分享标题(可选)
		&site=分享来源 如：腾讯网(可选)
		&pics=分享图片的路径(可选)
		API文档：http://connect.qq.com/intro/share/
		
		http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=bolo.bobo.com/act/cj&title=网易菠萝CHINAJOY 我竟然在CJ上看这个~~不能只有我一个人high!&pics=http://img1.cache.netease.com/love/image/app/wb_share.png
		豆瓣：
		http://shuo.douban.com/!service/share?
		image=分享图片
		&href=分享网址
		&name=分享标题
		&text=分享内容
		API文档：http://open.weixin.qq.com/document/api/timeline/?lang=zh_CN
*/

});