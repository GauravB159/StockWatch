var request = require("request")
var fs = require('fs');
var express=require('express');
var path    = require("path");
var app=express();
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
});

var url = "http://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=AAPL&interval=60min&apikey=1977"
request({
    url: url,
    json: true
}, function (error, response, body) {
    if (!error && response.statusCode === 200) {
        fs.writeFile("test.json", JSON.stringify(body), function(err) {
            if(err) {
                return console.log(err);
            }
        });
    }
})
