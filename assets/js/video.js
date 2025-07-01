document.addEventListener('DOMContentLoaded', function() {
    var videos = document.querySelectorAll('video');
    function videoClick(event) {
        var video = event.currentTarget;
        if (!video.controls) {
            video.controls = true;
            video.play();
            video.style.cursor = 'auto';
            video.style.outline = 'none';
        }
    }
    for (var i = 0, l = videos.length; i < l; ++i) {
        videos[i].addEventListener('click', videoClick);
    }
});
