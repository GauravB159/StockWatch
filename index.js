var express = require("express");
var bodyParser=require("body-parser");
var http=require("http");
var $=require("jquery");
var app = express();
var fs = require('fs');

var port = process.env.PORT || 5000;
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());

var interval=60;
function writeStock(res,url){
http.get(url, function(res){
        var body = '';
        res.on('data', function(chunk){
        body += chunk;
    });
    res.on('end', function(){
        var tJson = JSON.parse(body);
        fs.writeFileSync('test.json', JSON.stringify(tJson));
    });

    }).on('error', function(e){
          console.log("Got an error: ", e);
    });
}
app.use(express.static(__dirname ));
var ticker=0;
app.post('/stock', function(req, res){
    ticker=req.body.ticker;
    res.sendFile('stock.html', { root: __dirname} );
});
app.get('/ticker',function(req,res){
    res.send(ticker);
});
app.post('/time',function(req, res){ 
      var body = req.body;
      interval=body.number;
      var url = 'http://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol='+ticker+'&interval='+interval+'min&apikey=1977';
            console.log(url);
      writeStock(res,url)
setTimeout(function() {
      res.send("OK");
    }, 15000);

});

app.listen(port, function() {
  console.log("Listening on " + port);
});
