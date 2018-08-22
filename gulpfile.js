/**
 * Created by Dillance on 15/10/10.
 */
var gulp = require( 'gulp' ),
    jraiser = require('jraiser-mdk'),
    path = require('path'),
    gulpFilter = require('gulp-filter'),
    gulpMD5 = require('./gulp-lib/gulp-md5-withmap'),
    gulpReplace = require('gulp-replace'),
    gulpMinifyCss = require('gulp-minify-css'),
    gulpRename = require('gulp-rename'),
    colors = require('colors'),
    Ftp = require('ftp'),
    ProgressBar = require('progress'),
    fs = require('fs');


//var releaseFolder = 'release/';
var staticResourcesReleasePath = './public/release/';

// 为了兼容https，将全部的"http://"替换成"//"
function removeHttpProtocal() {
    return gulpReplace(
            /http:\/\//ig,
            function(match, $1, $2) {
                return '//';
            }
    );
}

// 将静态资源的相对路径替换成cdn的绝对路径
// 为了提高并发加载的数量，把图片、css和js分别替换成不同的域名：img1、img2和img3
function replaceHostname() {
    // var hostList = {
    //     'png': '//img1.cache.netease.com/bobo/release/',
    //     'jpg': '//img1.cache.netease.com/bobo/release/',
    //     'gif': '//img1.cache.netease.com/bobo/release/',
    //     'css': '//img2.cache.netease.com/bobo/release/',
    //     'js': '//img3.cache.netease.com/bobo/release/',
    //     'default': '//img3.cache.netease.com/bobo/release/'
    // }
    return gulpReplace(
            /\/dev\/(\S[^\'\";,]+)/igm,
            function(match, $1) {
                return '/release/' + $1;
                // var suffixExec = /\.(png|jpg|gif|js|css)/i.exec($1);
                // var type = (suffixExec && suffixExec[1]) ? suffixExec[1] : 'default';
                // return hostList[type] + $1;
            }
    );
}

var md5Mapping = {}, modJSMD5Mapping = {};
function md5(map, addStaticBuildFolder) {
    return gulpMD5({
        size: 10,
        exportPaths: function(src, target) {
            if (map) {
                //if (addStaticBuildFolder) {
                //    src = staticBuildFolder + '/' + src;
                //    target = staticBuildFolder + '/' + target;
                //}
                map[src] = target;
            }
        }
    });
}

// 替换静态资源地址
function replaceStaticURL() {
    return gulpReplace(
        /(\/release\/)([\w%\-.\/]*)/ig,
        function(match, $1, $2) {
            var hash = '', search = '';
            $2 = $2
                .replace(/#.*$/, function(match) {
                    hash = match;
                    return '';
                })
                .replace(/\?.*$/, function(match) {
                    search = match;
                    return '';
                });
            if (md5Mapping[$2]) { $2 = md5Mapping[$2];}

            return $1 + $2 + search + hash;
        }
    );
}


// 图片文件名加MD5戳
gulp.task('img-md5', function() {
    return gulp
        .src(['./public/dev/**/*.@(png|jpg|gif)'])
        // 加MD5戳
        .pipe( md5(md5Mapping, true) )
        .pipe( gulp.dest(staticResourcesReleasePath) );
});

//// 编译scss样式文件
//gulp.task('scss-compile', ['img-md5'], function() {
//	return gulp
//		.src(['./public/dev/**/*.scss'])
//		.pipe(gulpScss().on('error', gulpScss.logError))
//		.pipe( gulp.dest('./public/dev/') );
//});
//
//// 监听scss样式文件
//gulp.task('scss-monitor',function(){
//	return gulp
//		.src(['./public/dev/**/*.scss'])
//		.pipe(gulpScss())
//		.pipe( gulp.dest('./public/dev/') );
//});
//gulp.task('watch', function() {
//	gulp.watch('./public/dev/**/*.scss',['scss-monitor']);
//});

// 编译样式文件
gulp.task('css-compile', ['img-md5'], function() {
    return gulp.src(['./public/dev/**/*.css'])
    // 相对路径转绝对路径
    //.pipe( relative2Root() )
    // 替换资源引用路径
        .pipe( replaceHostname() )
        .pipe( replaceStaticURL() )
        // 压缩代码
        .pipe( gulpMinifyCss() )
        // 加MD5戳
        .pipe( md5(md5Mapping, true) )
        .pipe( gulp.dest(staticResourcesReleasePath) );
});


// 编译模块化非debug脚本文件
gulp.task('modjs-compile', ['css-compile'], function() {

    jraiser.compile('./public/dev/scripts/','./public/dev/scripts/package.settings');

    var stream =  gulp.src(['./public/dev/**/*.js'])
    // 过滤出非debug文件和bowl-config.js
        .pipe( gulpFilter(function(file) { return !/(-debug)|(bowl)/i.test(file.path); }) )
        // 替换资源引用路径
        .pipe( replaceHostname() )
        .pipe( replaceStaticURL() )
        // 加MD5戳
        .pipe( md5(modJSMD5Mapping) )
        .pipe( gulp.dest(staticResourcesReleasePath) );

    return stream;
});

// 编译模块化debug脚本文件
gulp.task('modjs-debug-compile', ['modjs-compile'], function() {
    return gulp
        .src(['./public/dev/**/*-debug.js'])
        // 过滤出bowl-debug.js
        .pipe( gulpFilter(function(file) { return !/bowl-debug.js$/i.test(file.path); }) )
        // 替换资源引用路径
        .pipe( replaceHostname() )
        .pipe( replaceStaticURL() )
        // 加MD5戳，必须与非debug文件保持一致，所以不能直接调用md5
        .pipe( gulpRename(function(p) {
            var replacement = modJSMD5Mapping[
                path.join(p.dirname, p.basename.replace(/-debug$/, '') + p.extname).replace(/\\/g, '/')
                ];
            if (replacement) {
                p.basename = path.basename(replacement, p.extname).replace(/(_[a-z0-9]+)$/i, '-debug$1');
            }
        }) )
        .pipe( gulp.dest(staticResourcesReleasePath) );
});

// 模块化脚本文件增加MD5戳后，加载器无法知道该戳，需要增加一个映射表
gulp.task('generate-modjs-map', ['modjs-debug-compile'], function() {
    var keys = Object.keys(modJSMD5Mapping);

    // 先排序，保证多次调用下顺序的一致性
    keys.sort();

    return gulp
        .src(['./public/dev/**/bowl.js'])
        .pipe( gulpReplace(/^(\s*var\s+md5Map\s*=\s*)\{\s*\};?\s*$/m, function(match, $1) {
            var result = '{';
            keys.forEach(function(key, i) {
                var value = modJSMD5Mapping[key];
                if ( /_([a-z0-9]+).js$/.test(value) ) {
                    // 缩减长度，仅保留md5戳
                    value = RegExp.$1;
                    // 缩减长度，移除modjs这一层目录
                    key = key.replace(/^modjs\//, '');

                    if (i) { result += ','; }
                    result += '"' + key + '"' + ':' + '"' + value + '"';
                }
            });
            result += '}';
            return $1 + result + ';';
        }) )
        // 替换资源引用路径
        .pipe( replaceHostname() )
        .pipe( replaceStaticURL() )
        // 压缩代码
        //.pipe( uglify() )
        // 加MD5戳
        .pipe( md5(md5Mapping, true) )
        .pipe( gulp.dest(staticResourcesReleasePath) );
});

gulp.task('template-compile', ['generate-modjs-map'], function() {
    return gulp
        .src( ['./views/dev/**/*.jade'] )
        .pipe( replaceHostname() )
        .pipe( replaceStaticURL() )
        .pipe( gulp.dest('./views/release/') );
});

gulp.task('default', ['template-compile'], function(){

    //console.log('hello'.green);
    //
    //var ftp = new Ftp();
    //
    //ftp.on('ready', function() {
    //	console.log('ftp is ready');
    //});
    //
    //pem.createCertificate({}, function(err, keys) {
    //	keys = keys || {};
    //	ftp.connect({
    //		host: '61.135.251.132',
    //		port: 16321,
    //		user: 'gztandilun',
    //		password: 'qwer1234!@#$',
    //		secure: true,
    //		secureOptions: {
    //			key: keys.clientKey,
    //			cert: keys.certificate,
    //			requestCert: true,
    //			rejectUnauthorized: false
    //		}
    //	});
    //});

});

// 把文件上传到ftp服务器
gulp.task('upload', function() {
    // 遍历本地文件
    function eachFile(p, callback){
        if(fs.statSync(p).isFile()) callback(p);
        else{
            var files = fs.readdirSync(p);
            if(files) files.forEach(function(sub){
                eachFile(path.join(p, sub),callback);
            });
        }
    }

    // 读取并解析缓存文件
    function getCachedFileList(path) {
        var text;
        try {
            text = fs.readFileSync(path, 'utf8');
        }catch(err) {
            text = '';
        }
        return text ? JSON.parse(text) : [];
    }

    /**
     * @method checkFiles: 检查当前文件是否存在于FTP中
     * @param String localDirPath: 文件的本地路径
     * @param String remoteDirPath: 文件对应的远程路径
     * @param Array cachedFileList: 缓存文件清单数组
     * @param Object bar: 进度条实例
     * @return Object: 返回的对象包含下面3个属性：
     *  localDirPath: 文件的本地路径
     *  remoteDirPath: 文件对应的远程路径
     *  status: 取值为0或1，1为FTP上存在该文件，0则不存在
     *
     */
    var checkFiles = process.argv.indexOf('--cache') !== -1
        ? function (localDirPath, remoteDirPath, cachedFileList, bar) {
            return new Promise(function (resolve, reject) {
                var fileInfo = {
                    localDirPath: localDirPath,
                    remoteDirPath: remoteDirPath
                };
                fileInfo.status = cachedFileList.indexOf(remoteDirPath) === -1 ? 0 : 1;
                bar.tick({
                    filename: path.basename(localDirPath)
                });
                resolve(fileInfo);
            });
        }
        : function (localDirPath, remoteDirPath, cachedFileList, bar) {
             // console.log(remoteDirPath);
            return new Promise(function (resolve, reject) {
                var fileInfo = {
                    localDirPath: localDirPath,
                    remoteDirPath: remoteDirPath
                };
                ftp.list(remoteDirPath, function (err) {
                    fileInfo.status = err ? 0 : 1;
                    bar.tick({
                        filename: path.basename(localDirPath)
                    });
                    resolve(fileInfo);
                });
            });
        };

    // 调用ftp.mkdir()创建目录，参数fileInfo的格式和checkFiles()的返回值一致，参数bar为进度条实例
    function makeDir(fileInfo, bar) {
        return new Promise(function (resolve, reject) {
            ftp.mkdir(path.dirname(fileInfo.remoteDirPath), true, function() {
                bar.tick({
                    filename: path.basename(fileInfo.localDirPath)
                });
                resolve(fileInfo);
            });
        });
    }

    // 调用ftp.mkdir()创建目录，参数fileInfo的格式和checkFiles()的返回值一致，bar为进度条实例
    function putFile(fileInfo, bar) {
        return new Promise(function (resolve, reject) {
            ftp.put(fileInfo.localDirPath, fileInfo.remoteDirPath, function (err) {
                bar.tick({
                    filename: path.basename(fileInfo.localDirPath)
                });
                if(err) {
                    console.log((err.toString()).red);
                    reject(err);
                } else {
                    resolve(fileInfo);
                }
            });
        });
    }

    function upload() {
        var uploadDirectory = path.resolve(__dirname, './public/release/');
        var files = [];
        eachFile(uploadDirectory, function(p){
            files.push(p);
        });
        var startTime = Date.now();
        var cachedFileList = getCachedFileList('cachedFileList.txt');
        var barMsg = 'progress[:bar] percent[:percent] elapsed[:elapsed] remaining[:etas] filename[:filename]';
        var barConfig = {
            total: files.length,
            complete: '=',
            incomplete: '-',
            width: 20
        };
        console.log('[INFO] 正在检查文件...');
        var bar = new ProgressBar(barMsg, barConfig);
        var tasks = files.map(function (p, i) {
            return checkFiles(p, p.replace(uploadDirectory, '').slice(1).replace(/\\/g, '/'), cachedFileList, bar);
        });
        Promise.all(tasks)
            .then(function (res) {
                // 把已经存在FTP上的文件(即status==1的文件)给过滤掉
                var notExistedFiles = res.filter(function (e) {
                    return e.status === 0;
                });
                // 如果cachedFileList不为空，就只把FTP不存在的文件push进去；否则，把本地所有的文件都push进去
                (cachedFileList.length ? notExistedFiles : res).forEach(function (e) {
                    cachedFileList.push(e.remoteDirPath);
                });
                barConfig.total = notExistedFiles.length;
                var bar = new ProgressBar(barMsg, barConfig);
                var tasks = notExistedFiles.map(function (fileInfo) {
                    return makeDir(fileInfo, bar);
                });
                console.log('[INFO] 正在创建目录...');
                return Promise.all(tasks);
            })
            .then(function (res) {
                barConfig.total = res.length;
                var bar = new ProgressBar(barMsg, barConfig);
                var tasks = res.map(function (fileInfo, i) {
                    return putFile(fileInfo, bar);
                });
                console.log('[INFO] 正在上传文件...');
                return Promise.all(tasks);
            })
            .then(function (res) {
                fs.writeFileSync('cachedFileList.txt', JSON.stringify(cachedFileList), 'utf8');
                res.forEach(function (fileInfo) {
                    console.log('[INFO] ' + ' 成功上传 ' + (fileInfo.localDirPath).green);
                });
                console.log('[INFO]' + ' 上传完成!!!'.green + ' 共上传了' + (res.length + '').cyan + '个文件！');
                console.log('[INFO]' + ' 本次总耗时为' + ((Date.now() - startTime) / 1000 + '').cyan + '秒!!!');
                ftp.end();
            })
            .catch(function (err) {
                ftp.end();
                console.log('gulp ' + 'ERROR'.red + ' !!!');
            });
    }

    var ftp = new Ftp();

    ftp.on('ready', function() {
        console.log('ftp connect success!!!'.green);
        // 在--cache模式下，如果getCachedFileList()返回的数组为空（即cachedFileList.txt不存在），报错！
        if(!getCachedFileList('cachedFileList.txt').length && process.argv.indexOf('--cache') !== -1) {
            console.log('gulp', 'ERR! '.red, 'argv'.magenta, 'cachedFileList.txt不存在，必须使用--remote参数!!!');
            ftp.end();
            return ;
        }
        ftp.cwd('/bobo/release', function (err) {
            if (err) {
                console.log('[INFO] ftp mkdir /bobo/release'.green);
                ftp.mkdir('/bobo/release', true, function() {
                    upload();
                });
            } else {
                upload();
            }
        });

    });

    ftp.connect({
        host: '',
        port: 16321,
        user: '',
        password: '',
        secure: true,
        secureOptions: {
            key: undefined,
            cert: undefined,
            requestCert: true,
            rejectUnauthorized: false
        }
    });

});