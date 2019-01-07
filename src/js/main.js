( function($) {
    /** lazyLoad */
    $('.lazy').Lazy();
    /** plyr video */
    new Plyr('#player');
    /** утанавливаем слайдеры */
    $('.slider__wrap').slick( {
        lazyLoad: 'ondemand',
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
    $('.offices__wrap').slick( {
        infinite: false
    } );

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

/**  работы над картой*/
var offices = [],
    markers = [];
var map;

function initMap() {
    var office = document.querySelectorAll('.office__data');
    var image = '/img/pin.png';
    var moscow = {lat: 55.73946, lng: 37.6541889};
    map = new google.maps.Map(
        document.getElementById('map'),
        {zoom: 10, center: moscow});
    
    office.forEach((el,ind,arr) => {
        if (el.dataset.latlng){
            let [Lat, Lng] = el.dataset.latlng.split(',');
            offices[ind] = {position: {lat:0,lng:0},slickIndex:'',region:''};
            offices[ind].position = {lat: Number(Lat), lng: Number(Lng)};
            offices[ind].slickIndex = el.dataset.slickIndex;
            offices[ind].region = el.dataset.region;
        }        
        
    });
    
    offices.forEach((office, ind) => {
        markers[ind] = {marker:'',region:'',slickIndex:''};
        markers[ind].marker = new google.maps.Marker({
            position: office.position,
            map: map,
            icon: image,
            // animation: google.maps.Animation.BOUNCE
        });
        markers[ind].region = office.region;
        markers[ind].slickIndex = office.slickIndex;
        markers[ind].marker.addListener('click', (ev) => {
            let slickIndex = Number(markers[ind].slickIndex);

            map.panTo(markers[ind].marker.position);

            if (document.querySelectorAll('.office__data').length < markers.length && slickIndex > document.querySelectorAll('.office__data').length-1) {
                slickIndex -=  markers.length - document.querySelectorAll('.office__data').length;
            };

            $('.offices__wrap').slick('slickGoTo', slickIndex);  
        })
    }); 
    updateCenterMap();
}

document.addEventListener('change', (e) => {
    if (e.target.id) {
        let offices__wrap = $('.offices__wrap');
        offices__wrap.slick('slickUnfilter');
        if (e.target.id !== 'placeAll') {
            offices__wrap.slick('slickFilter',`[data-region=${e.target.id}]`);
        } else {
            offices__wrap.slick('slickFilter','.office__data');
        };
        markers.forEach(marker => {
            marker.marker.setVisible(false);
            if (e.target.id === 'placeAll') {
                marker.marker.setVisible(true);
            } else if (marker.region === e.target.id) {
                marker.marker.setVisible(true);
            }
        });
        updateCenterMap();
    }
})
$('.offices__wrap').on('afterChange', () => {
    updateCenterMap();
});
/** функция считывает значение текущего слайда и перемещает центр карты */
const updateCenterMap = () => {
    let [Lat, Lng] = document.querySelector('.offices__wrap .slick-active').dataset.latlng.split(',');

    map.panTo({lat: Number(Lat), lng: Number(Lng)});
}