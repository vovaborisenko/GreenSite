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
    /** Ввод имени пользователя */
    let name = document.querySelectorAll('.input-user');

    name.forEach(el => {
        el.addEventListener('paste', e => {
            e.preventDefault();
        })
        el.addEventListener('input', e => {
            clearInputName(e);
        })
    })

    /** ввод номера телефона */
    let phone = document.querySelectorAll('.input-phone');
    
    /** фукнция принимает строку, а выводит массив объектов {reg: RegExp, length: RegExp.toString.length} */
    const getPatterns = pattern => {
        let arrPatterns = [];

        pattern = pattern.replace(/\s/g, 's');
        pattern = pattern.replace(/(.)/g,'\\$1');
        for (let i = 0; i <= pattern.length; i = i + 2) {
            const substr = pattern.substr(0, i);
            arrPatterns.push({reg: new RegExp(`(${substr})`), length: substr.length/2});
            // console.log(substr);            
        }

        return arrPatterns;
    }
    /** выводит часть строки, соответсвующая части патерна */
    const searchStringWithPattern = (string, pattern) => {
        let value = string,
          patterns = getPatterns(pattern);  
        
        for (let i = value.length; i > -1 ; i--) {
            /** удаляет все символы не входящие в паттерн */
            if (value.length >= patterns.length) {
                value = value.replace(/(.{18}).+/, '$1');
                i = 17;
            }
            
            if (value.search(patterns[i].reg)>-1) {
                break;
            } else {
            value = value.slice(0,value.length-1); 
            }                    
        } 

        return value;
    }

    const clearInputPhone = (event) => {
        let value = event.target.value;
        if ( !value ) {
            value = '+7 (';
        }
        value = value.replace(/[^\d\+\(\)\s-]|^\s|\s\s$|^-|--$/g, '');
        value = value.replace(/(\s)\s/g, '$1');
        value = value.replace(/(-)-|-\s|\s-/g, '$1');
        event.target.value = value;
    }
    const clearInputName = (event) => {
        let value = event.target.value;
        value = value.replace(/\s\s/g, ' ');
        value = value.replace(/__/g, '_');
        value = value.replace(/--|-\s|\s-/g, '-');
        value = value.replace(/[^\wа-яА-Я\s-]|^\s|\s\s$|^-|--$/g, '');
        event.target.value = value;
    }


    /** обработчик на каждое поле с номером телефона */
    phone.forEach( (el) => {
        el.addEventListener( 'focus' , e => {
            clearInputPhone(e);
        })
        el.addEventListener('keyup', e => {
            clearInputPhone(e);
        })
        el.addEventListener('paste', e => {
            e.preventDefault();
            clearInputPhone(e);
            e.target.value = searchStringWithPattern(e.target.value, '+d (ddd) ddd-dd-dd');
        })

        el.addEventListener( 'input', e => {
            let value = e.target.value;

            if (e.data) {
                value = searchStringWithPattern(value, '+d (ddd) ddd-dd-dd');
                if ( value.length < 5 ) {
                    value = '+7 (';
                }
                
                if (value.length === 7) {
                    value += ')';
                }
                if (value.length === 8) {
                    value += ' ';
                }
                if (value.length === 12 || value.length === 15) {
                    value += '-';
                }
                
                
            } else {
                //e.preventDefault;
                if ( value.length < 5 ) {
                    value = '+7 (';
                }                
            }
            e.target.value = value;
        })
    } )
} )(jQuery);
var offices = [];
var map;

function initMap() {
    var office = document.querySelectorAll('.office__data');
    var image = '/img/pin.png';
    var moscow = {lat: 55.73946, lng: 37.6541889};
    map = new google.maps.Map(
        document.getElementById('map'),
        {zoom: 15, center: moscow});
    
    office.forEach((el,ind,arr)=>{
        if (el.dataset.latlng){
           let el1 = el.dataset.latlng.split(',');
            offices[ind] = {lat: Number(el1[0]), lng: Number(el1[1])};
        }
        
        
    })
    console.log(offices);

    
    // The marker, positioned at Uluru
    //var marker = new google.maps.Marker({position: moscow, map: map, icon: image, animation: google.maps.Animation.DROP});
    
    offices.forEach(office => {
        new google.maps.Marker({
            position: office,
            map: map,
            icon: image,
            // animation: google.maps.Animation.BOUNCE
            });
        }) 
    }
    document.addEventListener('click', () => {
        if (document.querySelectorAll('.offices__wrap')[0].offsetHeight == 0) {
            var latlng = document.querySelectorAll('.offices__wrap')[1].querySelector('.office__data.slick-current').dataset.latlng;
            let el1 = latlng.split(',');
            map.setCenter({lat: Number(el1[0]), lng: Number(el1[1])});

        } else {
            map.setCenter({lat: 55.735152, lng: 37.436084})
        }
    }, false);

//   let offices = [
//     {lat: 55.7337722, lng: 37.6676417},
//     {lat: 55.734536, lng: 37.670839},
//     {lat: 55.770434, lng: 37.662193},
//     {lat: 55.936948, lng: 37.2271271},
//     {lat: 55.6331196, lng: 37.4338186},
//     {lat: 55.735152, lng: 37.436084},
//   ]
