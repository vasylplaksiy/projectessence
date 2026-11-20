function easyEach(array, func) {
    var arrayLength = array.length;
    for (var i = 0; i < arrayLength; i++) {
        func(array[i], i);
    }
}

var modal = {
    init: function () {
        this.open();
        this.close();
    },
    simple: function (text, popupClass, title, size) {
        var obj = this;
        var modalEl = document.createElement("div");
        modalEl.classList.add("modal");
        modalEl.classList.add("active");
        modalEl.classList.add("modalMiddle");
        modalEl.classList.add("modalSimple");
        var modalElOverlay = document.createElement("div");
        modalElOverlay.classList.add("modal__overlay");
        var modalElBody = document.createElement("div");
        modalElBody.classList.add("modalBody");
        var modalElClose = document.createElement("div");
        modalElClose.classList.add("modal__close");


        var modalElTitle = "";
        var modalElContent = "";

        if (typeof popupClass != "undefined" && popupClass != "") {
            modalEl.classList.add(popupClass);
        }

        if (typeof title != "undefined" && title != "") {
            modalElTitle = document.createElement("div");
            modalElTitle.classList.add("modalTitle");
            modalElTitle.innerHTML = title;
            modalElBody.appendChild(modalElTitle);
        }

        if (typeof text != "undefined" && text != "") {
            modalElContent = document.createElement("div");
            modalElContent.classList.add("modalContent");
            modalElContent.innerHTML = text;
            modalElBody.appendChild(modalElContent);
        }

        modalElBody.appendChild(modalElClose);
        modalEl.appendChild(modalElOverlay);
        modalEl.appendChild(modalElBody);
        pageScroll.disable();
        document.querySelector("body").classList.add("modalOnPage");
        document.body.appendChild(modalEl);

        obj.close();

    },
    open: function () {
        if (!document.querySelector(".showModal:not(.modalInit)")) return false;
        easyEach(document.querySelectorAll(".showModal:not(.modalInit)"), function (el, i) {
            el.classList.add("modalInit");
            el.addEventListener("click", function (e) {
                // e.preventDefault();
                var modalAttr = this.getAttribute("data-modal");
                pageScroll.disable();
                document.querySelector("body").classList.add("modalOnPage");
                document.querySelector(".modal" + modalAttr).classList.add("active");
                // lazyLoad.init();
                if (document.querySelector(".modal" + modalAttr + " iframe.lazy")) {
                    var src = document.querySelector(".modal" + modalAttr + " iframe.lazy").getAttribute("data-src");
                    document.querySelector(".modal" + modalAttr + " iframe.lazy").setAttribute("src", src);
                    // document.querySelector(".modal"+modalAttr+ " iframe.lazy").classList.add("loaded");
                }
            })
        });
    },
    makeActive: function (modalClass) {
        if (!document.querySelector(".modal." + modalClass).classList.contains("modal_second")) {
            pageScroll.disable();
        }
        document.querySelector("body").classList.add("modalOnPage");
        document.querySelector(".modal." + modalClass).classList.add("active");
    },
    close: function () {
        if (!document.querySelector(".modal__overlay")) return false;

        easyEach(document.querySelectorAll(".modal__overlay:not(.modalInit), .modal__close:not(.modalInit), .modal__close_js:not(.modalInit)"), function (el, i) {
            el.classList.add("modalInit");
            el.addEventListener("click", function (e) {
                e.preventDefault();
                if (!el.closest(".modal").classList.contains("modal_second") && !document.querySelector("body").classList.contains("showNav")) {
                    pageScroll.enable();
                    document.querySelector("body").classList.remove("modalOnPage");
                }
                if (el.closest(".modal").classList.contains("modalSimple")) {
                    el.closest(".modal").remove();
                }
                el.closest(".modal").classList.remove("active");
                if (el.closest(".modal").querySelector("iframe.lazy")) {
                    el.closest(".modal").querySelector("iframe.lazy").setAttribute("src", "");
                }
            })
        });
    }
};


var pageScroll = {
    state: false,
    init: function () {
        this.scrollTop = 0;
        window.pageScroll = this;
    },
    isMobile: function () {
        var checkMobile = window.innerWidth < 1024;
        return checkMobile;
    },
    getScrollBarWidth: function () {
        return window.innerWidth - document.body.clientWidth;
    },
    disable: function () {
        if (this.state) {
            return;
        }
        var obj = this,
            scrollWidth = obj.getScrollBarWidth();
        obj.scrollTop = window.pageYOffset;
        //console.log("disable " + obj.scrollTop);

        if (this.disabled) {
            return;
        }

        document.body.style.position = "fixed";
        document.body.style.marginTop = "-" + this.scrollTop + "px";
        document.body.style.width = '100%';
        document.body.style.paddingRight = scrollWidth + "px";
        document.body.style.overflowY = scrollWidth && !obj.isMobile() ? 'hidden' : '';
        this.state = true;
    },
    enable: function () {
        var obj = this;
        if (!this.state) {
            return;
        }
        if (this.disabled) {
            return;
        }
        //console.log("enable " + obj.scrollTop);

        document.body.style.position = '';
        document.body.style.marginTop = '';
        document.body.style.width = '';
        document.body.style.paddingRight = '';
        document.body.style.overflowY = 'inherit';
        window.scroll(0, obj.scrollTop);
        this.state = false;
    }
};

modal.init();
pageScroll.init();

function autoOpenPopup(){
    if(document.querySelector(".autoOpenPopup") && !sessionStorage.getItem('auto_open_popup')){
        let modalTime = parseInt(document.querySelector(".autoOpenPopup").getAttribute("data-time"));

        setTimeout(() => {
            sessionStorage.setItem('auto_open_popup', '1');
            modal.makeActive("autoOpenPopup")
        }, modalTime);

    }
}

autoOpenPopup();