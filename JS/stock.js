$(document).ready(function(){
    var valid=true;
    var ticker="GOOG";   
    var interval="60";
    $.get('/ticker',function(data){
        ticker=data;
        $(".ticker").html(ticker);
    });
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
    var wrapper =function(interval,caller){
         return function(data) {
            $.getJSON("../daily/"+ticker+".json",function(daily){
                if(data == undefined){
                    counter+=1;
                    $(caller).click();
                }else{
                    var intCheck=data["Meta Data"]["4. Interval"];  
                    var symbol=data["Meta Data"]["2. Symbol"]; 
                    var sym2=daily["Meta Data"]["2. Symbol"]; 
                    var inter=interval+"min";
                    if(intCheck != inter || symbol != ticker || symbol != sym2){
                        counter+=1;
                        $(caller).click();
                    }else{
                        var date=data["Meta Data"]["3. Last Refreshed"];
                        counter=0;
                        var stock=data["Time Series ("+ interval.toString() +"min)"][date.toString()];
                        var comp=moment(date);
                        comp=form(comp,'YYYY-MM-DD');
                        comp=moment(comp).subtract(1,'days');  
                        while(true){
                            comp=form(comp,'YYYY-MM-DD');
                            if(daily["Time Series (Daily)"][comp.toString()] == undefined){
                                comp=moment(comp).subtract(1,'days');  
                            }else{
                                break;
                            }
                        }          
                        comp=form(comp,'YYYY-MM-DD');
                        $('.data').removeClass('green');
                        $('.data').removeClass('red');            
                        var stock2=daily["Time Series (Daily)"][comp.toString()];
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
                                if(cls=="cl"){
                                    $('.ticker').html($('.ticker').html()+"<span class='green'><span class='glyphicon glyphicon-chevron-up'></span>"+"("+val+"%)"+"</span>");       
                                }
                            }else{
                                $('.'+cls).addClass('red');
                                if(cls=="cl"){
                                    $('.ticker').html($('.ticker').html()+" <span class='red'><span class='glyphicon glyphicon-chevron-down'></span>"+"("+val+"%)"+"</span>");    
                                }                       
                            }
                        }
                        date=moment(date).add(570, 'minutes');
                        date=form(date,'YYYY-MM-DD HH:mm:ss');
                        $('.date').html(date.toString() + " IST");
                        $('.open').html(parseFloat(stock["1. open"]).toFixed(2)+$('.open').html());
                        $('.high').html(parseFloat(stock["2. high"]).toFixed(2)+$('.high').html());
                        $('.low').html(parseFloat(stock["3. low"]).toFixed(2)+$('.low').html());
                        $('.cl').html(parseFloat(stock["4. close"]).toFixed(2)+$('.cl').html());
                        $('.volume').html(stock["5. volume"]+$('.volume').html());
                    }
                }
            });
        }
    }
    var counter=0;
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    $(".ib,.sixty").click(function(){   
        $(".ib").removeClass("acti");
        $(this).addClass("acti");
        var interval= $(this).html();
        if(interval != "Daily" && interval != "Weekly" && interval != "Monthly"){
            $(".data").html("");
            $(".ticker").html(ticker);
            if(counter == 0){
                $.post('/time', {number:interval},function(){
                    valid = true;
                }).fail(function(response){
                    alert(response.responseText);
                    valid = false;
                });
            }
            $.getJSON("../interval.json", wrapper(interval,this));
        }
    });
    if(width > 768){
        $('.sixty').click();
    }else{
        $('.sixtymob').click();
    }
    $(".watch").click(function(){
        if(valid == true){
            $.post("/watch",{ticker:ticker}, function(data){
                $(".watch").toggleClass("hide");
                $(".unwatch").toggleClass("hide");
                alert( "Stock added to watchlist" );
            }).fail(function(response) {
                alert(response.responseText);
              });
        }else{
            alert("This stock is not available to watch, sorry.");
        }
    });  
    $(".unwatch").click(function(){
        $.post("/unwatch",{ticker:ticker}, function(data){
            $(".watch").toggleClass("hide");
            $(".unwatch").toggleClass("hide");
            alert("Stock removed from watchlist");
        }).fail(function(response) {
            alert(response.responseText);
          });
    });        
    var form=function(date,dformat){
        var formDate=moment(date).format(dformat);
        return formDate;
    }
    
    var setUpOrDown=function(one,two,arg){
        var curr=parseFloat(one[arg]);
        var prev=parseFloat(two[arg]);
        return (curr-prev)/prev;
    }
    $('[data-toggle="tooltip"]').tooltip(); 
    $('#popover1').popover({ 
        html : true,
        title: function() {
          return $("#popover-head").html();
        },
        content: function() {
          return $("#popover-content").html();
        }
    });
    $(document).on('show.bs.popover', function() {
        $('.popover').not(this).popover('hide');
    });
    $('#popover2').popover({ 
        html : true,
        title: function() {
          return $("#popover-head2").html();
        },
        content: function() {
          return $("#popover-content2").html();
        }
    });
    $(document).on('click', '#buys', function(){
        var qty=$("#qty").val();
        var price=$(".cl").html();
        if(valid == true){
            if(price == ""){
                alert("Price has not loaded yet, please try again after price loads");
            }else{
                $.post("/buy",{qty:qty,ticker:ticker}, function(data){
                    alert(data);
                }).fail(function(response) {
                    alert(response.responseText);
                  });
              }
        }else{
            alert("This stock is not available to buy, sorry.");
        }
    }); 
    
    $('.buymob').click(function(){
        var qty=prompt("Enter number of stocks to buy: ");
        var price=$(".cl").html();
        if(valid == true){ 
            if(price == ""){
                alert("Price has not loaded yet, please try again after price loads");
            }else{
                $.post("/buy",{qty:qty,ticker:ticker,price:price}, function(data){
                    alert(data);
                }).fail(function(response) {
                    alert(response.responseText);
                  });
            }
         }else{
            alert("This stock is not available to buy, sorry.");
         }      
    });
    $(document).on('click', '#sells', function(){
        var qty=$("#qtys").val();
        var price=$(".cl").html();
        if(valid == true){
            if(price == ""){
                alert("Price has not loaded yet, please try again after price loads");
            }else{
                $.post("/sell",{qty:qty,ticker:ticker}, function(data){
                    alert(data);
                }).fail(function(response) {
                    alert(response.responseText);
                  });
              }
         }else{
            alert("This stock is not available to buy, sorry.");
         }    
    }); 
        
    $('.sellmob').click(function(){
        var qty=prompt("Enter number of stocks to sell: ");
        var price=$(".cl").html();
        if(valid == true){
            if(price == ""){
                alert("Price has not loaded yet, please try again after price loads");
            }else{
                $.post("/sell",{qty:qty,ticker:ticker}, function(data){
                    alert(data);
                }).fail(function(response) {
                    alert(response.responseText);
                  });
              }
         }else{
            alert("This stock is not available to buy, sorry.");
         }         
    });
    var lastmin;
    var chart=function(data,today,checker){
                var width1 = (window.innerWidth > 0) ? window.innerWidth : screen.width;
                if(width1<768){
                    width1=900;
                }else{
                    width1=width1-100;
                }   
                var col1=[];
                for(var i=0;i<5;i++){
                    col1[i]=[];
                }
                var format="";
                var yform="";
                if(checker == true){
                    format='%Y-%m-%d %H:%M:%S';
                    yform='%H:%M';
                }else{
                    format='%Y-%m-%d';
                    yform='%Y-%m-%d';
                }
                for(var val in data){
                    var hold=val;
                    if(checker == true){
                        var comp=val[8]+val[9];
                    }else{
                        hold=moment(val).format("YYYY-MM-DD");
                    }
                    col1[0].push(hold);
                    col1[1].push(data[val]["1. open"]);
                    col1[2].push(data[val]["2. high"]);
                    col1[3].push(data[val]["3. low"]);
                    col1[4].push(data[val]["4. close"]);
                }
                var chart = c3.generate({
                size:{
                    width:width1
                },
                bindto: '#chart',
                padding: {
                    right: 20,
                    left:80,
                    top:5
                },
                data: {
                      x: 'date',
                      xFormat: format,
                      json: {
                            date: col1[0],
                            Open: col1[1],
                            Close: col1[4],
                            High: col1[2],
                            Low: col1[3]
                     }
                },
                axis : {
                        x : {
                            type : 'timeseries',
                            label: "Time",
                            tick : {
                                format : yform
                        }
                    },
                        y: {
                            label: "Value",
                            tick: {
                                format: d3.format('.2f')
                            }
                        }
                    }
                });
            }
    var graphGen=function(val,checker){
            $.getJSON(val+".json",function(data){
                var interval=$('.acti').html();
                var today=data["Meta Data"]["3. Last Refreshed"];
                console.log(checker);
                if(checker == true){
                    var check=moment().tz("America/Toronto").format('DD');
                    /*today=today[8]+today[9];
                    if(check != today){
                        alert("The stock market was closed today so no intraday data available");
                        return;
                    }*/ 
                    data=data["Time Series ("+interval+"min)"];
                }else{
                    if(interval == "Daily"){
                        data=data["Time Series ("+interval+")"];
                    }else{
                        data=data[interval+" Time Series"];
                    }
                }
                chart(data,today,checker);
            }); 
        }
    $(".graph").click(function(){
        graphGen("interval",true);
        $('.graph').css("border-left","3px solid black");
        $('.bod').toggleClass("hidden");
        $('.sh').toggleClass("hidden");
        $('.watch').toggleClass("hidden");
        $('.buy').toggleClass("hidden");  
        $('.sell').toggleClass("hidden");  
        $('.unwatch').toggleClass("hidden"); 
        $('.char').toggleClass("hidden");
        if($('.ibcl').hasClass("checker") && !(lastmin.hasClass("acti"))){
            $('.ib').removeClass("acti");
            lastmin.addClass("acti");
        }
        $('.ibcl').toggleClass("checker");
    });
    $(".ibcl").click(function(){
        lastmin=$(this);
        if($(this).hasClass("checker")){
            graphGen("interval",true);
        }
    });
    $(".sh").click(function(){
        var str=$(this).html();
        if( str == "Daily"){
            str = "../daily/"+ticker;
        }else{
            str=str.toLowerCase();
        }
        graphGen(str,false);
    });
});
