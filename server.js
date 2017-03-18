var request = require("request")
var fs = require('fs');
var express=require('express');
var app = express()
var url = "http://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=60min&apikey=1977"
app.use(express.static('HTML/', {index: 'index.html'}));
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
