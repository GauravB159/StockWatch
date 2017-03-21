var express = require("express");
var bodyParser=require("body-parser");
var app = express();
var port = process.env.PORT || 80;
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(express.static(__dirname ));

app.post('/stock', function(req, res){
    res.send('<h1>You sent the name "' + req.body.ticker + '".</h1>');
    res.sendfile('stock.html', { root: __dirname} );
});
app.listen(port, function() {
  console.log("Listening on " + port);
});
