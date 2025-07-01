import * as params from '@params';

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    var confidentialBanner = document.getElementById('confidential');

    if (sessionStorage.getItem('confidentiality') == 'true') {
        confidentialBanner.style.display = 'none';
    }

    function confidentialAcknowledged() {
        confidentialBanner.style.display = 'none';
        sessionStorage.setItem('confidentiality', true);
    }

    function confidentialReturnBack() {
        sessionStorage.removeItem('confidentiality');
        if (!history.back()) {
            location.href = params.confidentialbackurl;
        }
    }
    
    var confidentialAcknowledge = document.getElementById('confidential-okay');
    var confidentialReturn = document.getElementById('confidential-back');
    confidentialAcknowledge.addEventListener('click', confidentialAcknowledged, false);
    confidentialReturn.addEventListener('click', confidentialReturnBack, false);

});
