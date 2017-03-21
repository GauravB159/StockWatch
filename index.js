var express = require("express");
var app = express();
var port = process.env.PORT || 80;

app.use(express.static(__dirname ));

app.get('/stock.html', function(req, res){
    res.sendfile('stock.html', { root: __dirname} );
});
app.listen(port, function() {
  console.log("Listening on " + port);
});
