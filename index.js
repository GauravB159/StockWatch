var express = require("express");
var bodyParser=require("body-parser");
var $=require("jquery");
var app = express();
var port = process.env.PORT || 80;
app.use(bodyParser.urlencoded({ extended: true })); 
var wrapper =function(interval){
         return function(data) {
            var date=data["Meta Data"]["3. Last Refreshed"];
            console.log(date);
            var stock=data["Time Series ("+ interval.toString() +"min)"][date.toString()];
            var comp=moment(date).set({'hours': 16 ,'minutes':0,'seconds': 0});
            comp=moment(comp).subtract(1,'days');  
            while(true){
                comp=form(comp);
                if(data["Time Series ("+ interval.toString() +"min)"][comp.toString()] == undefined){
                    comp=moment(comp).subtract(1,'days');  
                }else{
                    break;
                }
            }          
            comp=form(comp);
            console.log(comp);
            $('.data').removeClass('green');
            $('.data').removeClass('red');            
            var stock2=data["Time Series ("+ interval.toString() +"min)"][comp.toString()];
            for(var property in stock2){
                var curr=setUpOrDown(stock,stock2,property);
                var cls=property.slice(3,property.length);
                var val=(100.0*curr).toFixed(2);
                if(cls=="close"){
                    cls="cl";
                }
                $('.'+cls).html("("+val+"%)");
                if(val > 0.0){
                    $('.'+cls).addClass('green');
                    console.log(cls);
                    if(cls=="cl"){
                        $('.ticker').html($('.ticker').html()+" <span class='green'><span class='glyphicon glyphicon-chevron-up'></span>"+"("+val+"%)"+"</span>");       
                    }
                }else{
                    $('.'+cls).addClass('red');
                    if(cls=="cl"){
                        $('.ticker').html($('.ticker').html()+" <span class='red'><span class='glyphicon glyphicon-chevron-down'></span>"+"("+val+"%)"+"</span>");    
                    }                       
                }
            }
            date=moment(date).add(570, 'minutes');
            date=form(date);
            $('.date').html(date.toString() + " IST");
            $('.open').html(stock["1. open"]+$('.open').html());
            $('.high').html(stock["2. high"]+$('.high').html());
            $('.low').html(stock["3. low"]+$('.low').html());
            $('.cl').html(stock["4. close"]+$('.cl').html());
            $('.volume').html(stock["5. volume"]+$('.volume').html());
        }
    }
app.use(express.static(__dirname ));

app.post('/stock', function(req, res){
    $.getJSON("http://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=GOOG&interval=60min&apikey=1977", wrapper(60));
    res.sendfile('stock.html', { root: __dirname} );
});
app.listen(port, function() {
  console.log("Listening on " + port);
});
