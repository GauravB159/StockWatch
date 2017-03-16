$(document).ready(function(){
    $('#result').load('../HTML/navbar.html');
    $('.red').click(function(){
        $('.login').toggle(500);
        $('.register').toggle(500);
    });
    $('.boldem li').hover(function(){
        $(this).addClass('o3');
    }, function(){
        $(this).removeClass('o3');
    });
    $(".bcl").click(function(){
        var bgcolor=$(".btn-rmr").css("background-color");
        if(bgcolor === "rgba(180, 0, 0, 0.85098)"){
            $(".btn-rmr").css("background-color","rgba(0,180,0,0.85)");
        }else{
            $(".btn-rmr").css("background-color","rgba(180,0,0,0.85)");        
        }
        $('.rmr').toggle(200);
        $('.rmrd').toggle(200);
      });
    $('[data-toggle="tooltip"]').tooltip(); 
});
