( function($) { 
    /** утанавливаем слайдеры */
    $('.slider__wrap').slick( {slidesToShow: 3} ); 
    $('.offices__wrap').slick( {infinite: false} );
    setTimeout( () => $('.offices__wrap').addClass('section'), 2000 );

    /** открытие мобильного меню */
    let mobile = document.querySelector('.nav__mobile');
    mobile.addEventListener('click', (e) => {mobile.classList.toggle('open');console.log(e)} );
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('desktop__item')) {
            e.target.classList.toggle('open');
        };

        if (e.target.parentNode.classList.contains('desktop__item')) {
            e.target.parentNode.classList.toggle('open');
        }
    });
} )(jQuery)
