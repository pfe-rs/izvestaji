import * as params from '@params';

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    var trackingBanner = document.getElementById('tracking');

    function gaLoad() {
        const script = document.createElement('script');
        script.async = true;
        script.defer = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + params.googleanalytics;
        document.head.append(script);
    }
    
    function gaInitialize() {
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', params.googleanalytics);
    }

    if (document.cookie.includes('tracking=true') && navigator.doNotTrack != 1) {
        gaLoad();
        gaInitialize();
    }
    
    var cookieMeta = ' path=/; SameSite=Strict; expires=Fri, 31 Dec 9999 23:59:59 GMT'

    function trackingAccepted() {
        document.cookie = 'tracking=true;' + cookieMeta;
        gaLoad();
        gaInitialize();
        trackingBanner.style.display = "none";
    }

    function trackingDenied() {
        document.cookie = 'tracking=false;' + cookieMeta
        trackingBanner.style.display = "none";
    }

    if (!document.cookie.includes('tracking=') && navigator.doNotTrack != 1) {
        trackingBanner.style.display = "block";
        var trackingAccept = document.getElementById('tracking-accept');
        var trackingDeny = document.getElementById('tracking-deny');
        trackingAccept.addEventListener('click', trackingAccepted, false);
        trackingDeny.addEventListener('click', trackingDenied, false);
    }

});
