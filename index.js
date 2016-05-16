var request = require("request");
var urlparse = require('url');
var cheerio = require('cheerio');
var fs = require("fs");
var url = 'http://www.51voa.com/VOA_Standard_English/';
if(url == ''){
    console.log('请输入要下载的页面url');
    return;
}
var option = {
    targetNumber: 100000,
    fileNames: {
        crawled: 'urlCrawled.txt',
        allURLsFound: 'allURLsFound.txt'
    }
}
function parse_mdfy(url){
    request.get(url,function(err,response,body){
        if(err){
            console.log('解析失败',err.message);return;
        }
        var $ = cheerio.load(body.toString());
        var hrefs = [];
        var fileNames = [];
        $('#list>ul>li>a').each(function(){   //将页面的所有链接存储在数组里
            var $me = $(this);
            hrefs.push('http://www.51voa.com' + $me.attr('href'));
            fileNames.push($me.text().replace(/\s/g,'_'));
        });
        if(hrefs.length == 0){
            console.log('本页面未爬取到链接');
        }else{
            hrefs.forEach(function(entry,index){
                request.get(entry,function(err,response,body){
                    if(err){
                        console.log(entry + '解析失败');return;
                    }
                    var $ = cheerio.load(body.toString());
                    var text = $('#content').text();
                    fs.appendFile('./voa_standard_english/txt/' + fileNames[index] + '.txt',text,function(err) { if (err) throw err });
                    /*
                    var fileUrl = $('#mp3').attr('href');
                    console.log(fileNames[index] + '开始下载，下载完成后会自动退出进程，请等待');
                    request(fileUrl).pipe(fs.createWriteStream('./go_english/' + fileNames[index]+ '.mp3'));
                    */
                });
                //fs.appendFile(option.fileNames.crawled,entry + '\r\n',function(err){ if (err) throw err });
            });
        }
    });
}
parse_mdfy(url);
//downloadmp3(url);
