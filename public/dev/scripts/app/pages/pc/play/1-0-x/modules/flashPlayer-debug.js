/**
 * Created by Dillance on 15/12/14.
 */
define(function(require, exports, module) {
    'use strict';

    var base = require('base@1-1-x');

    var Player = {};

    Player.src = "http://swf.ws.126.net/live/LivePlayer.swf";

    Player.render = function(options){

        Player.options = base.extend({
            width: 720,
            height: 405,
            flashvars: {}
        },options);

        var UA = navigator.userAgent,
            is360se = UA.toLowerCase().indexOf('msie') > -1 ? true : false,
            params = [];

        for(var k in Player.options.flashvars){
            params.push(k + '=' + Player.options.flashvars[k]);
        }
        params = params.join('&');

        if(is360se){
            return '<object  classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"  width="' + Player.options.width + '" height="' + Player.options.height + '" id="FPlayer" ><param value="#000000" name="bgcolor"><param value="true" name="allowFullScreen"><param value="always" name="allowscriptaccess"><param name="allownetworking" value="all" /><param name="wmode" value="opaque"><param value="' + Player.src + '" name="movie"><param value="' + params + '" name="flashvars"></object>';
        }else{
            return '<object width="' + Player.options.width + '" height="' + Player.options.height + '" id="FPlayer" data="' + Player.src + '" type="application/x-shockwave-flash"><param value="#000000" name="bgcolor"><param value="true" name="allowFullScreen"><param value="always" name="allowscriptaccess"><param name="wmode" value="opaque"><param name="allownetworking" value="all" /><param value="' + params + '" name="flashvars"></object>';
        }
    };

    return Player;

});