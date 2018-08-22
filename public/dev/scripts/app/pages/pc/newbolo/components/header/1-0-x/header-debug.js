define(function(require, exports, module) {
    'use strict';
    var user = require('/common/user/1-1-x/user.js');
    document.querySelector('.newbolo-header').addEventListener('click', function (e) {
        var target = e.target;
        if(target.classList.contains('register')) user.register();
        if(target.classList.contains('login')) user.login();
        if(target.classList.contains('logout')) user.logout();
    }, false);
});