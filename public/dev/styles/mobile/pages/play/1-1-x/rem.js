/**
 * Created by NetEase on 2016/9/7 0007.
 */
var fs = require('fs');
fs.readFile('relace.txt',{encoding:'utf8'},function(e,file){
    var ok = file.replace(/([0-9.]{0,})rem/g,function(w,f,s,c){
       /* console.log(w);
        console.log(f);
        console.log(s);
        console.log(c);*/
        return (f*(750/1080)).toFixed(2)+'rem';
    })
    fs.writeFile('replace-result.txt',ok,'utf8');
});