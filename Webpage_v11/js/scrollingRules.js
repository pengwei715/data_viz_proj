/******** Created by Maria Schwarz ********/

//$('body').addClass('noscroll');


$(function() {
    //caches a jQuery object containing the header element
    var header = $('.noBackground');
    $(window).scroll(function () {
        var scroll = $(window).scrollTop();

        if (scroll >= 500) {
            $('#navbar').css("visibility", "visible");
            header.removeClass('noBackground').addClass('blackBackground').fadeIn();
        } else {
            header.removeClass('blackBackground').fadeOut().addClass('noBackground');
        }
    });
});


$(".navbar-header").click(function(){
    $(".navselect").removeClass('navselect');
    $('#intro_nav').attr('class', 'navselect navbutton');
    var panelID = $('#intro_nav').attr('data_panelid');
    $('html, body').animate({
        scrollTop: $('#'+panelID).offset().top
    }, 1000);
});


$(".navbutton").click(function(){
    $(".navselect").removeClass('navselect');
    $(this).attr('class', 'navselect navbutton');
    var panelID = $(this).attr('data_panelid');
    $('html, body').animate({
        scrollTop: $('#'+panelID).offset().top
    }, 1000);
});


$("#fullpage").scroll(function(){
    /*$('html, body').animate({
        scrollTop: $(this).next().offset().top
    }, 1000);*/
});


/* Adjust navigation bar based on clicks */
$(".upbutton").click(function(){
    $('html, body').animate({
        scrollTop: $(this).closest('.section').prev('.section').offset().top
    }, 1000);

    var ID = $(this).closest('.section').prev('.section').attr("id");
    var string = function(d){return ".navbutton[data_panelid='"+d+"']"};
    var input = string(ID);
    var ID2 = $(input).attr("id");
    $(".navselect").removeClass('navselect');
    $('#'+ID2).attr('class', 'navselect navbutton');
});

$(".downbutton").click(function(){
    $('html, body').animate({
        scrollTop: $(this).closest('.section').next('.section').offset().top
    }, 1000);

    var ID = $(this).closest('.section').next('.section').attr("id");
    var string = function(d){return ".navbutton[data_panelid='"+d+"']"};
    var input = string(ID);
    var ID2 = $(input).attr("id");
    $(".navselect").removeClass('navselect');
    $('#'+ID2).attr('class', 'navselect navbutton');
});

