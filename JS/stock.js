$(document).ready(function(){
    $('.boldem li').hover(function(){
        $(this).addClass('o3');
    }, function(){
        $(this).removeClass('o3');
    });
    let params =location.toString();
    var num=params.indexOf('?') + 8;
    var ticker="GOOG";   
    var interval="60";
    if(num>=8){
        ticker="";
        for(var i=num;i<params.length;i++){
            ticker=ticker+params[i];
        }
    }
    $(".ticker").html(ticker);
    var correct=function(date,minim,maxim,incr){
        if(parseInt(moment(date).hours()) > maxim){
                date=moment(date).set({'hours': maxim ,'seconds': 0});
            }else if(parseInt(moment(date).hours()) < minim){
                date=moment(date).set({'hours': 9,'seconds': 0});
            }
            var num=parseInt((moment(date).minutes())/incr);
            date=moment(date).set('minutes',incr*num);
            return date;
    }
    
    $(".ibcl").click(function(){
        $(".ibcl").removeClass("acti");
        $(this).addClass("acti");
        var interval= $(this).html();
        $(".data").html("");
        $(".ticker").html(ticker);
        $.getJSON("http://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="+ticker+"&interval="+interval+"min&apikey=1977", wrapper(interval));
    });
    
    var form=function(date){
        var formDate=moment(date).format('YYYY-MM-DD HH:mm:ss');
        return formDate;
    }
    
    var setUpOrDown=function(one,two,arg){
        var curr=parseFloat(one[arg]);
        var prev=parseFloat(two[arg]);
        return (curr-prev)/prev;
    }
    
    var wrapper =function(interval){
         return function(data) {
            var date=data["Meta Data"]["3. Last Refreshed"];
            var stock=data["Time Series ("+ interval.toString() +"min)"][date.toString()];
            var comp=moment(date).set({'hours': 16 ,'minutes':0,'seconds': 0});
            comp=moment(comp).subtract(1,'days');            
            comp=form(comp);
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
   $.getJSON("http://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="+ticker+"&interval=60min&apikey=1977", wrapper(interval));

    $('[data-toggle="tooltip"]').tooltip(); 
});
