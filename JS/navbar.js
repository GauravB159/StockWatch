$('#tickers').keyup(function(){
    var value=$(this).val();
    value=value.toUpperCase();
    $(this).val(value);
});
$('#tickers2').keyup(function(){
    var value=$(this).val();
    value=value.toUpperCase();
    $(this).val(value);
});
$('.boldem li').hover(function(){
        $(this).addClass('o3');
    }, function(){
        $(this).removeClass('o3');
});
