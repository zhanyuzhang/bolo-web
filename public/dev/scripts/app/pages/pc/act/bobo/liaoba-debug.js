define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery@1-11-x');
    $(function() {
        var timer;
        // 鼠标移进时，隐藏主播信息、显示分页按钮，移出时相反
        $('.card .img-container').hover(function () {
            var $card = $(this).parent('.card');
            var $imgs = $card.find('img'),
                index = [].findIndex.call($imgs, function (e) {
                    return !e.classList.contains('hidden');
                });
            $card.find('.anchor-info').addClass('hidden');
            $imgs.eq(index % 3).addClass('hidden');
            $imgs.eq(++index % 3).removeClass('hidden');
            timer = setInterval(function () {
                $imgs.eq(index % 3).addClass('hidden');
                $imgs.eq(++index % 3).removeClass('hidden');
            }, 2000);
        }, function () {
            $(this).parent('.card').find('.anchor-info').removeClass('hidden');
            clearInterval(timer);
        });

        // 进入主播房间
        $('.enter-btn').on('click', function () {
            // var id = $(this).parent('.card').find('.user-id').text().trim().slice(2);
            // window.open('http://www.bobo.com/' + id);
            window.open('http://www.bobo.com/98');
        })
    });
});