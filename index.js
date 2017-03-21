var express = require("express");
var app = express();
var port = process.env.PORT || 80;

app.use(express.static(__dirname ));

app.get("/stock.html",function(req,res){
    alert("Stock page");
});
app.listen(port, function() {
  console.log("Listening on " + port);
});
