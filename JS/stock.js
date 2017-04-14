$(document).ready(function(){
    $('.boldem li').hover(function(){
        $(this).addClass('o3');
    }, function(){
        $(this).removeClass('o3');
    });
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
                                            console.log(data);
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
                $.post('/time', {number:interval});
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
        $.post("/watch",{ticker:ticker}, function(data){
            console.log(data);
        }).done(function() {
            alert( "User successfully created" );
            })
          .fail(function(response) {
            console.log(response.responseText);
          });
    });
    $(document).on('click', '.buys', function(){
        var qty=$("#qty").val();
        var price=$(".cl").html();
        
        if(price == ""){
            alert("Price has not loaded yet, please try again after price loads");
        }else{
            $.post("/buy",{qty:qty,ticker:ticker,price:price}, function(data){
                console.log(data);
            }).done(function() {
                alert( "User successfully created" );
                })
              .fail(function(response) {
                console.log(response.responseText);
              });
          }
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
    $('#popover').popover({ 
    html : true,
    title: function() {
      return $("#popover-head").html();
    },
    content: function() {
      return $("#popover-content").html();
    }
});
});
