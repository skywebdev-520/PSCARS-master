
function selectPrevImg(img,reset){
    if(reset){
        $(".main-product-image").css("background-image","url(/uploads/"+img+")")
    }else{
        let imgSrc = window.data[img]
        $(".main-product-image").css("background-image","url(/uploads/"+imgSrc.id+"."+imgSrc.location+")")
    }
}

function scrolltoclass(sel){
    var $container = $("html,body");
var $scrollTo = $(sel);

$container.animate({scrollTop: $scrollTo.offset().top - $container.offset().top + $container.scrollTop()-90, scrollLeft: 0},300); 
}


$(document).ready(function () {
    $('[data-fancybox="gallery"]').fancybox({
        infobar: false,
        toolbar: false,
        loop: true,
        animationDuration: 666,
        buttons: [
            //"zoom",
            //"share",
            //"slideShow",
            //"fullScreen",
            //"download",
            //"thumbs",
            "close"
          ],
          transitionEffect: "circular",
          clickContent: function(current, event) {
            return false
          },

    });

    $(".owl-carousel").owlCarousel({
        items: 6,
        loop: true,
        nav: true,
        autoplay: true,
        responsive: {
            0: {
                items: 1,
            },
            480: {
                items: 1,
            },
            768: {
                items: 3,
            },
            1600: {
                items: 3,
            }
        }
    });
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
    $('#closeNavbar').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

});


var ssb_ui_data = {"z_index":"1"};

// SSB UI $
$(function ($) {

    // Animation Slide
    var ssb_panel = $('#ssb-container'),
        ssb_panel_w = ssb_panel.width(),
        sbb_display_margin = 50,
        window_width = $(window).width();

    ssb_panel.css('z-index', ssb_ui_data.z_index);

    if (ssb_panel.hasClass('ssb-btns-left') && (ssb_panel.hasClass('ssb-anim-slide') || ssb_panel.hasClass('ssb-anim-icons'))) {

        ssb_panel.css('left', '-' + (ssb_panel_w - sbb_display_margin) + 'px');

    } else if (ssb_panel.hasClass('ssb-btns-right') && (ssb_panel.hasClass('ssb-anim-slide') || ssb_panel.hasClass('ssb-anim-icons'))) {

        ssb_panel.css('right', '-' + (ssb_panel_w - sbb_display_margin) + 'px');

    }

    // Slide when hover
    if (window_width >= 768) {
        ssb_panel.hover(function () {

            if (ssb_panel.hasClass('ssb-btns-left') && ssb_panel.hasClass('ssb-anim-slide')) {

                ssb_panel.stop().animate({'left': 0}, 300);

            } else if (ssb_panel.hasClass('ssb-btns-right') && ssb_panel.hasClass('ssb-anim-slide')) {

                ssb_panel.stop().animate({'right': 0}, 300);

            }

        }, function () {

            if (ssb_panel.hasClass('ssb-btns-left') && ssb_panel.hasClass('ssb-anim-slide')) {

                ssb_panel.animate({'left': '-' + (ssb_panel_w - sbb_display_margin) + 'px'}, 300);

            } else if (ssb_panel.hasClass('ssb-btns-right') && ssb_panel.hasClass('ssb-anim-slide')) {

                ssb_panel.animate({'right': '-' + (ssb_panel_w - sbb_display_margin) + 'px'}, 300);

            }

        });

    } else {
        ssb_panel.click(function (e) {

            if ($(this).hasClass('ssb-open')) {
                $(this).removeClass('ssb-open');
                if (ssb_panel.hasClass('ssb-btns-left') && ssb_panel.hasClass('ssb-anim-slide')) {

                    ssb_panel.animate({'left': '-' + (ssb_panel_w - sbb_display_margin) + 'px'}, 300);

                } else if (ssb_panel.hasClass('ssb-btns-right') && ssb_panel.hasClass('ssb-anim-slide')) {

                    ssb_panel.animate({'right': '-' + (ssb_panel_w - sbb_display_margin) + 'px'}, 300);

                }
            } else {
                e.preventDefault();
                $(this).addClass('ssb-open');

                if (ssb_panel.hasClass('ssb-btns-left') && ssb_panel.hasClass('ssb-anim-slide')) {

                    ssb_panel.stop().animate({'left': 0}, 300);

                } else if (ssb_panel.hasClass('ssb-btns-right') && ssb_panel.hasClass('ssb-anim-slide')) {

                    ssb_panel.stop().animate({'right': 0}, 300);

                }
            }

        });
    }


});