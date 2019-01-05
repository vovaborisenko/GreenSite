( function($) {
    /** утанавливаем слайдеры */
    $('.slider__wrap').slick( {
        slidesToShow: 3,
        responsive: [
            {
                breakpoint: 767,
                settings: {
                  slidesToShow: 2
                }
            },
            {
              breakpoint: 700,
              settings: {
                slidesToShow: 1
              }
            }
        ]
    });
    $('.offices__wrap').slick( {} );

    /** открытие мобильного меню */
    let mobile = document.querySelector('.nav__mobile');

    mobile.addEventListener('click', () => { 
        mobile.classList.toggle('open') 
    } );

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('desktop__item')) {
            e.target.classList.toggle('open');
        }

        if (e.target.parentNode.classList.contains('desktop__item')) {
            e.target.parentNode.classList.toggle('open');
        }
    });

    /** ввод номера телефона */
    let phone = document.querySelectorAll('.input-phone');

    phone.forEach( (el) => {
        el.addEventListener( 'focus' , e => {
            if ( !e.target.value ) {
                e.target.value = '+7 (';
            }
        })

        el.addEventListener( 'keyup', e => {
            console.log(e);
            let pattern = '+7 (ddd) ddd-dd-dd';
            pattern = pattern.replace(/\s/g, 's');
            pattern = pattern.replace(/(.)/g,'\\$1');
            for (let i = 8; i < pattern.length; i += 2) {
                const substr = pattern.substr(0, i);
                console.log(new RegExp(substr));
                
            }
            if ( e.target.value.length < 4 ) {
                e.target.value = '+7 (';
            }
            if (e.which < 47 || e.which > 58) {
                e.target.value = e.target.value.replace(/[^\d\+\(\)-\s]/g, '');
            }
            if (e.target.value.length === 7) {
                e.target.value += ') ';
            }
            if (e.target.value.length === 12 || e.target.value.length === 15) {
                e.target.value += '-';
            }
            if (e.target.value.length > 18) {
                e.target.value = e.target.value.replace(/(.{18}).+/g, '$1');
            }
            if (e.target.value.search(/\s/g)) {
                
            }
        })
    } )
} )(jQuery);
