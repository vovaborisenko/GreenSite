( function($) { 
    $('.slider__wrap').slick({slidesToShow: 3}); 
    $('.offices__wrap').slick();
    setTimeout(() =>$('.offices__wrap').addClass('section'), 2000);
} )(jQuery)