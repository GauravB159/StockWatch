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
        $.getJSON("http://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="+ticker+"&interval="+interval+"min&apikey=1977", wrapper(interval));
    });
    
    var form=function(date){
        var formDate=moment(date).format('YYYY-MM-DD HH:mm:ss');
        return formDate;
    }
    
    var setUpOrDown=function(one,two,arg){
        var prev=parseFloat(one[arg]);
        var curr=parseFloat(two[arg]);
        return prev-curr;
    }
    
    var wrapper =function(interval){
         return function(data) {
            var date2=new Date();
            var a = moment.tz(date2, "America/Toronto");
            var date=form(a);
            date=moment(date).subtract(moment(date).seconds(),'seconds');
            date=correct(date,9,16,interval);
            date=form(date);
            var stock=data["Time Series ("+ interval.toString() +"min)"][date.toString()];
            while(stock == undefined){
                date=moment(date).set('minutes',moment(date).minutes()-1);
                date=form(date);
                stock=data["Time Series ("+ interval.toString() +"min)"][date.toString()];
            }
            var comp=moment(date).set({'hours': 16 ,'minutes':0,'seconds': 0});
            comp=moment(comp).subtract(1,'days');            
            comp=form(comp);
            var stock2=data["Time Series ("+ interval.toString() +"min)"][comp.toString()];
            for(var property in stock2){
                var curr=setUpOrDown(stock,stock2,property);
                var cls=property.slice(3,property.length);
                if(cls=="close"){
                    cls="cl";
                }
                if(curr > 0){
                    $('.'+cls).addClass('green');
                }else{
                    $('.'+cls).addClass('red');
                }
            }
            date=moment(date).add(570, 'minutes');
            date=form(date);
            $('.date').html(date.toString() + " IST");
            $('.open').html(stock["1. open"]);
            $('.high').html(stock["2. high"]);
            $('.low').html(stock["3. low"]);
            $('.cl').html(stock["4. close"]);
            $('.volume').html(stock["5. volume"]);
        }
    }
    $.getJSON("http://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="+ticker+"&interval=60min&apikey=1977", wrapper(interval));
    $('[data-toggle="tooltip"]').tooltip(); 
});
