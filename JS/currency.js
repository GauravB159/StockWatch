$(document).ready(function(){
var demo = function(val,frm,too){
        return function(data) {
            data.rates.USD=1;
            fx.rates = data.rates;
            var rate = fx(val).from(frm).to(too);
            $('.answer').html(rate.toFixed(2));
        }
    }
    
$('.from').click(function(){
    $(this).addClass("o9");
    $(".from2").addClass("check");
    $(".to2").removeClass("check");
    $(".to").removeClass("o9");
});
$('.from').dblclick(function(){
    var temp=$('.to2').html();
    $('.to2').html($('.from2').html());
    $('.from2').html(temp);
});
$('.to').dblclick(function(){
    var temp=$('.to2').html();
    $('.to2').html($('.from2').html());
    $('.from2').html(temp);
});
$('.to').click(function(){
    $(this).toggleClass("o9");
    $(".to2").addClass("check");
    $(".from2").removeClass("check");
    $(".from").removeClass("o9");
});

$('.val').click(function(){
    $('.check').html($(this).html());
    $('td').removeClass("o9");
    $('td').removeClass("check");    
});

$('.conv').click(function(){
    $('td').removeClass("o9");
    var num= $(".frm").html();
    var from=$(".from2").children(".child").html();
    var to=$(".to2").children(".child").html();
    console.log(num);    
    $.getJSON("../currency.json", demo(num,from,to));
});
    $('[data-toggle="tooltip"]').tooltip().off("click"); 
});
