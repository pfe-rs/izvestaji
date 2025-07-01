document.addEventListener('DOMContentLoaded', function () {

    var popup = document.getElementById('scroll-popup');
    var content = document.getElementById('content');
    var popupIsVisible = false;
    var headerOffsetTop = content.offsetTop;
    
    const scrollSensitivityTreshold = 30;
    var lastScrollTop = document.documentElement.scrollTop;

    function scrollTopEvent() {
        var currentScrollTop = document.documentElement.scrollTop;
        if (currentScrollTop < headerOffsetTop || currentScrollTop > lastScrollTop) {
            popupHide();
        } else if (currentScrollTop > headerOffsetTop && currentScrollTop < lastScrollTop - scrollSensitivityTreshold) {
            popupShow();
        }
        lastScrollTop = currentScrollTop;
    }

    function popupShow() {
        if (popupIsVisible) {
            return
        }
        popup.classList.add('show');
        popupIsVisible = true;
    }

    function popupHide() {
        if (!popupIsVisible) {
            return
        }
        popup.classList.remove('show');
        popupIsVisible = false;
    }

    document.addEventListener('scroll', scrollTopEvent);

});
