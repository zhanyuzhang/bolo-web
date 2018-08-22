/**
 * Created by gztimboy on 2016/8/26 0026.
 */
/**
 * Created by Dillance on 16/5/6.
 */
'use strict';

var express = require('express'),
    HttpHelper = require('../../../bll/common/HttpHelper'),
    cms = require('../../../bll/cms'),
    routeHelper = require('../../../lib/routeHelper'),
    userBll = require('../../../bll/common/user'),
    router = express.Router();

router.get('/', function(req, res, next) {

    var task = [];

    task.push(HttpHelper.getAndroidUrls().then(function(data){
        res.data.androidUrls = data;
    }));

    task.push(userBll.getBoloInfo(req,res).then(function(result){
        res.data.userInfo = result;
    }));



    task.push(cms.get('http://www.bobo.com/special/003500PF/bolojoin_gfbd.htm').then(function(result){
        res.data.gfbdHotList = result;
    }));
    task.push(cms.get('http://www.bobo.com/special/003500PF/bolojoin_gfbd2.htm').then(function(result){
        res.data.gfbdList = result;
    }));
    task.push(cms.get('http://www.bobo.com/special/003500PF/bolojoin_pj.htm').then(function(result){
        res.data.evaluateList = result;
    }));
    Promise.all(task).then(function(){
        routeHelper.render(req, res, 'pc/pages/join/1-0-x/index');
    },function(err){
        next(err);
    });
});

module.exports = router;