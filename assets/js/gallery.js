document.addEventListener('DOMContentLoaded', function() {
    
    var imagePreview = document.getElementById('image-preview');
    var captionPreview = document.getElementById('caption-preview');
    var galleryPreview = document.getElementById("gallery-preview");
    var galleryThumbs = document.getElementsByClassName('gallery-thumb');
    var previewButtonNext = document.getElementById('preview-next');
    var previewButtonPrev = document.getElementById('preview-previous');

    var currentPreview = null;
    var loaderImage = imagePreview.src;

    var touchStartPoint = {
        x: null, y: null
    };

    function setGalleryPreview(index) {
        if (Number.isInteger(index)) {
            imagePreview.alt = galleryThumbs[index].alt;
            imagePreview.src = loaderImage;
            imagePreview.src = galleryThumbs[index].dataset.fullscreen;
            captionPreview.innerHTML = galleryThumbs[index].alt;
            galleryPreview.classList.add('show');
            document.body.style.overflow = 'hidden';
            currentPreview = index;
            if (index == 0) {
                previewButtonPrev.classList.add('disabled')
            } else if (index == galleryThumbs.length - 1) {
                previewButtonNext.classList.add('disabled')
            } else {
                previewButtonNext.classList.remove('disabled')
                previewButtonPrev.classList.remove('disabled')
            }
            location.hash = '/slika/' + index;
        } else {
            imagePreview.alt = "";
            imagePreview.src = "";
            captionPreview.innerHTML = "";
            galleryPreview.classList.remove('show');
            document.body.style.overflow = 'visible';
            currentPreview = null;
            location.hash = '/';
        }
    }

    function showGalleryPreview(event) {
        setGalleryPreview(Number(event.currentTarget.dataset.index));
    }

    function hideGalleryPreview() {
        setGalleryPreview(null);
    }

    function nextGalleryPreview(event) {
        if (currentPreview < galleryThumbs.length - 1) {
            setGalleryPreview(currentPreview + 1);
        }
        if (event) {
            event.stopPropagation();
        }
    }

    function prevGalleryPreview(event) {
        if (currentPreview > 0) {
            setGalleryPreview(currentPreview - 1);
        }
        if (event) {
            event.stopPropagation();
        }
    }

    if (previewButtonNext) {
        previewButtonNext.addEventListener('click', nextGalleryPreview);
    }

    if (previewButtonPrev) {
        previewButtonPrev.addEventListener('click', prevGalleryPreview);
    }

    if (galleryPreview) {
        galleryPreview.addEventListener('click', hideGalleryPreview);
    }

    for (var i = 0, l = galleryThumbs.length; i < l; ++i) {
        galleryThumbs[i].addEventListener('click', showGalleryPreview);
        galleryThumbs[i].addEventListener('keydown', function(e) {
            if (e.key == 'Enter') {
                setGalleryPreview(Number(e.target.dataset.index))
            }
        });
    }

    document.addEventListener("keydown", e => {
        if (currentPreview != null) {
            switch (e.key) {
                case 'ArrowDown':
                case 'ArrowRight':
                    nextGalleryPreview();
                    break;
                case 'ArrowUp':
                case 'ArrowLeft':
                    prevGalleryPreview();
                    break;
                case 'Escape':
                    hideGalleryPreview();
                    break;
            }
        }
    });

    function getIndexFromHash() {
        var segments = location.hash.split('/');
        if (segments.length < 3) {
            return null
        }
        var index = Number(segments[segments.length - 1]);
        if (Number.isInteger(index)) {
            return index
        } else {
            null
        }
    }

    if (location.hash.startsWith('#/slika/')) {
        var index = getIndexFromHash();
        if (index >= 0 && index < galleryThumbs.length) {
            setGalleryPreview(index)
        }
    }

    window.addEventListener('hashchange', function () {
        var index = getIndexFromHash();
        if (index >= 0 && index < galleryThumbs.length && currentPreview != index) {
            setGalleryPreview(index)
        }
    });

    function touchStartEvent(event) {
        if (event.changedTouches.length != 1) {
            touchCancelEvent();
            return;
        }
        touchStartPoint.x = event.changedTouches[0].screenX;
        touchStartPoint.y = event.changedTouches[0].screenY;
    }

    function touchEndEvent(event) {
        if (event.changedTouches.length != 1) {
            touchCancelEvent();
            return;
        }
        var touchVector = [
            event.changedTouches[0].screenX - touchStartPoint.x,
            event.changedTouches[0].screenY - touchStartPoint.y
        ];
        if (Math.sqrt(Math.pow(touchVector[0], 2) + Math.pow(touchVector[1], 2)) < imagePreview.width / 4) {
            // Swipe too short
            touchCancelEvent();
            return;
        }
        var swipeAngle = Math.atan(touchVector[1] / touchVector[0]) * 57.3; // Angle with x-axis in degrees
        if (Math.abs(swipeAngle) > 30) {
            // Swipe too vertical
            touchCancelEvent();
            return;
        }
        if (touchVector[0] > 0) {
            // Swipe right
            prevGalleryPreview(event);
        } else {
            // Swipe left
            nextGalleryPreview(event);
        }
    }

    function touchCancelEvent() {
        touchStartPoint.x = null;
        touchStartPoint.y = null;
    }

    imagePreview.addEventListener('touchstart', touchStartEvent);
    imagePreview.addEventListener('touchend', touchEndEvent);
    imagePreview.addEventListener('touchcancel', touchCancelEvent);

});
