( function($) { 
    $('.slider__wrap').slick( {slidesToShow: 3} ); 
    $('.offices__wrap').slick( {infinite: false} );
    setTimeout( () => $('.offices__wrap').addClass('section'), 2000 );
} )(jQuery)