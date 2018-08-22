/**
 * Created by chesszhang on 2016/9/28
 */

define(function(require, exports, module) {
    window.location = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.netease.bolo.android';
    setTimeout(function () {
        var imgs = document.querySelectorAll('.wrapper img'),
            wording = document.querySelector(('.wrapper .wording'));
        imgs[0].classList.add('hidden');
        imgs[1].classList.remove('hidden');
        wording.innerHTML = '菠萝菌跳转失败啦TOT';
    }, 6000);
});

