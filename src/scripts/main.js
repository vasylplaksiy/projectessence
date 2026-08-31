// import initLoader from './loader.js';
// initLoader();
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import Swiper from 'swiper';
import { Thumbs, FreeMode, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

let global = {
    init: function () {
        this.nav();
        this.changePage();
    },
    nav: function () {
        let navTitle = document.querySelector('.header__nav_title');
        navTitle.addEventListener('click', function () {
            document.body.classList.toggle('showNav');
        });

        document.addEventListener('click', function (e) {
            if (!document.body.classList.contains('showNav')) return false;
            if (e.target.closest('.header__nav')) return false;
            document.body.classList.remove('showNav');
        });

        document.addEventListener('keydown', function (e) {
            if (e.key !== 'Escape') return false;
            document.body.classList.remove('showNav');
        });
    },
    changePage: function () {
        let navList = document.querySelectorAll('.header__nav_list a');
        navList.forEach(function (el) {
            el.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector('.inner-loader').classList.add('active');
                let href = this.getAttribute('href');
                setTimeout(function () {
                    window.location = href;
                }, 500);
            });
        });
    },
};

let services = {
    init: function () {
        if (!document.querySelector('.services')) return false;
        this.tabsDesktop();
        this.tabsMobile();
        this.list();
    },
    tabsDesktop: function () {
        let navList = document.querySelectorAll('.services__tabs_el');
        navList.forEach(function (el) {
            el.addEventListener('click', function (e) {
                e.preventDefault();
                let winWidth = window.innerWidth;
                let headerEl = this.closest('.services__tabs_header');
                if (winWidth < 768) {
                    if (!headerEl.classList.contains('active')) {
                        headerEl.classList.add('active');
                        return false;
                    }
                }
                let panelName = this.getAttribute('data-panel');
                document.querySelector('.services__tabs_el.active')
                    ? document
                          .querySelector('.services__tabs_el.active')
                          .classList.remove('active')
                    : true;
                document.querySelector('.services__panel.active')
                    ? document
                          .querySelector('.services__panel.active')
                          .classList.remove('active')
                    : true;
                this.classList.add('active');

                document
                    .querySelector(
                        '.services__panel[data-panel="' + panelName + '"]'
                    )
                    .classList.add('active');

                headerEl.classList.remove('active');
            });
        });
    },
    tabsMobile: function () {
        let counterTitle = document.querySelector('.services__tabs_counter');
        counterTitle.addEventListener('click', function () {
            this.closest('.services__tabs_header').classList.toggle('active');
        });
    },
    list: function () {
        if (!document.querySelector('.services__el_header')) return false;
        let navList = document.querySelectorAll('.services__el_header');
        navList.forEach(function (el) {
            el.addEventListener('click', function (e) {
                e.preventDefault();
                this.closest('.services__el').classList.toggle('active');
            });
        });
    },
};

let tooltip = {
    init: function () {
        if (!document.querySelector('*[data-tippy-content]')) return false;
        tippy('[data-tippy-content]', {
            interactive: true,
            allowHTML: true,
        });
    },
};

let locations = {
    init: function () {
        if (!document.querySelector('.locations')) return false;
        this.sliders();
    },
    sliders: function () {
        let slList = document.querySelectorAll('.locations__el');
        slList.forEach(function (el) {
            let main = el.querySelector('.locations__main');
            let preview = el.querySelector('.locations__preview');

            let previewSl = new Swiper(preview, {
                modules: [FreeMode, Thumbs],
                spaceBetween: 6,
                slidesPerView: 5,
                freeMode: true,
                watchSlidesProgress: true,
            });

            new Swiper(main, {
                modules: [Thumbs, Pagination, Autoplay],
                spaceBetween: 10,
                loop: true,
                autoplay: {
                    delay: 5000,
                    pauseOnMouseEnter: true,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: main.querySelector('.swiper-pagination'),
                    clickable: true,
                },
                thumbs: {
                    swiper: previewSl,
                },
            });
        });
    },
};

let faq = {
    init: function () {
        if (!document.querySelector('.faq')) return false;
        this.question();
        this.tabs();
    },
    tabs: function () {
        let navList = document.querySelectorAll('.faq__header_el');
        navList.forEach(function (el) {
            el.addEventListener('click', function (e) {
                e.preventDefault();
                let panelName = this.getAttribute('data-panel');
                document.querySelector('.faq__header_el.active')
                    ? document
                          .querySelector('.faq__header_el.active')
                          .classList.remove('active')
                    : true;
                document.querySelector('.faq__panel.active')
                    ? document
                          .querySelector('.faq__panel.active')
                          .classList.remove('active')
                    : true;
                this.classList.add('active');

                document
                    .querySelector(
                        '.faq__panel[data-panel="' + panelName + '"]'
                    )
                    .classList.add('active');
            });
        });
    },
    question: function () {
        let questionList = document.querySelectorAll('.faq__question_title');
        questionList.forEach(function (el) {
            el.addEventListener('click', function (e) {
                e.preventDefault();
                this.closest('.faq__question').classList.toggle('active');
            });
        });
    },
};

let lngTabs = {
    init: function () {
        if (!document.querySelector('.lng-tabs')) return false;
        this.tabs();
    },
    tabs: function () {
        let navList = document.querySelectorAll('.lng-tabs__header button');
        navList.forEach(function (el) {
            el.addEventListener('click', function (e) {
                e.preventDefault();
                let panelName = this.getAttribute('data-panel');
                this.closest('.lng-tabs').querySelector(
                    '.lng-tabs__header button.active'
                )
                    ? this.closest('.lng-tabs')
                          .querySelector('.lng-tabs__header button.active')
                          .classList.remove('active')
                    : true;
                this.closest('.lng-tabs').querySelector(
                    '.lng-tabs__panel.active'
                )
                    ? this.closest('.lng-tabs')
                          .querySelector('.lng-tabs__panel.active')
                          .classList.remove('active')
                    : true;
                this.classList.add('active');

                this.closest('.lng-tabs')
                    .querySelector(
                        '.lng-tabs__panel[data-panel="' + panelName + '"]'
                    )
                    .classList.add('active');
            });
        });
    },
};

let experience = {
    mediaSliders: [],
    init: function () {
        if (!document.querySelector('.experience')) return false;
        this.media();
        this.tabs();
    },
    tabs: function () {
        let navList = document.querySelectorAll('.experience__tabs_el');
        navList.forEach(function (el) {
            el.addEventListener('click', function (e) {
                e.preventDefault();
                let panelName = this.getAttribute('data-panel');
                let panelId = this.getAttribute('data-ind') * 1;
                document.querySelector('.experience__tabs_el.active')
                    ? document
                          .querySelector('.experience__tabs_el.active')
                          .classList.remove('active')
                    : true;
                document.querySelector('.experience__tabs_panel.active')
                    ? document
                          .querySelector('.experience__tabs_panel.active')
                          .classList.remove('active')
                    : true;
                this.classList.add('active');

                document
                    .querySelector(
                        '.experience__tabs_panel[data-panel="' +
                            panelName +
                            '"]'
                    )
                    .classList.add('active');

                experience.mediaSliders.forEach(function (sl) {
                    sl.slideTo(panelId);
                });
            });
        });
    },
    media: function () {
        let self = this;
        let slList = document.querySelectorAll('.experience__media');
        slList.forEach(function (el) {
            self.mediaSliders.push(
                new Swiper(el, {
                    spaceBetween: 10,
                })
            );
        });
    },
};

let livetime = {
    format: new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Toronto',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }),
    init: function () {
        if (!document.querySelector('.js__livetime')) return false;
        this.refresh();
        this.tick();
    },
    tick: function () {
        let self = this;
        setTimeout(
            function () {
                self.refresh();
                setInterval(function () {
                    self.refresh();
                }, 60000);
            },
            60000 - (Date.now() % 60000)
        );
    },
    refresh: function () {
        let time = this.format
            .formatToParts(new Date())
            .filter(function (part) {
                return part.type !== 'dayPeriod' && part.type !== 'literal';
            })
            .map(function (part) {
                return part.value;
            })
            .join(':');

        document.querySelectorAll('.js__livetime').forEach(function (el) {
            el.textContent = time;
        });
    },
};

global.init();
services.init();
locations.init();
tooltip.init();
faq.init();
experience.init();
lngTabs.init();
livetime.init();
