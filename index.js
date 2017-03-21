var express = require("express");
var bodyParser=require("body-parser");
var http=require("http");
var $=require("jquery");
var app = express();
var fs = require('fs');

var port = process.env.PORT || 80;
app.use(bodyParser.urlencoded({ extended: true })); 


app.use(express.static(__dirname ));

app.post('/stock', function(req, res){
    var url = 'http://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol='+res.body.ticker+'&interval=60min&apikey=1977';
    res.sendfile('stock.html', { root: __dirname} );
    http.get(url, function(res){
        var body = '';
        res.on('data', function(chunk){
        body += chunk;
    });
    res.on('end', function(){
        var tJson = JSON.parse(body);
        fs.writeFile('test.json', JSON.stringify(tJson), function (err) {
            if (err) return console.log(err);
        });
    });

    }).on('error', function(e){
          console.log("Got an error: ", e);
    });
    
});

app.listen(port, function() {
  console.log("Listening on " + port);
});
