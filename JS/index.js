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
        $(".btn-rmr").toggleClass("rmr-red");
        $(".btn-rmr").toggleClass("rmr-green");        
        $('.rmr').toggle(200);
        $('.rmrd').toggle(200);
      });
    $("#rgb").click(function(){
        $.post("/register",$("#rg").serialize(), function(data){
            console.log(data);
        }).done(function() {
            alert( "User successfully created" );
            })
          .fail(function(response) {
            console.log(response.responseText);
          });
        });    
    $('[data-toggle="tooltip"]').tooltip(); 
});
