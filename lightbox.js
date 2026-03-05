document.addEventListener('DOMContentLoaded', function () {
    var images = Array.from(document.querySelectorAll('.banjo-gallery img'));
    if (images.length === 0) return;

    var currentIndex = 0;

    // Build overlay
    var overlay = document.createElement('div');
    overlay.id = 'lightbox-overlay';

    var prevBtn = document.createElement('button');
    prevBtn.id = 'lightbox-prev';
    prevBtn.innerHTML = '&#8592;';
    prevBtn.setAttribute('aria-label', 'Previous image');

    var img = document.createElement('img');
    img.id = 'lightbox-img';

    var nextBtn = document.createElement('button');
    nextBtn.id = 'lightbox-next';
    nextBtn.innerHTML = '&#8594;';
    nextBtn.setAttribute('aria-label', 'Next image');

    var closeBtn = document.createElement('button');
    closeBtn.id = 'lightbox-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close');

    overlay.appendChild(closeBtn);
    overlay.appendChild(prevBtn);
    overlay.appendChild(img);
    overlay.appendChild(nextBtn);
    document.body.appendChild(overlay);

    function open(index) {
        currentIndex = index;
        img.src = images[currentIndex].src;
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function prev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        img.src = images[currentIndex].src;
    }

    function next() {
        currentIndex = (currentIndex + 1) % images.length;
        img.src = images[currentIndex].src;
    }

    images.forEach(function (image, i) {
        image.style.cursor = 'pointer';
        image.addEventListener('click', function () { open(i); });
    });

    prevBtn.addEventListener('click', function (e) { e.stopPropagation(); prev(); });
    nextBtn.addEventListener('click', function (e) { e.stopPropagation(); next(); });
    closeBtn.addEventListener('click', function (e) { e.stopPropagation(); close(); });

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) close();
    });

    document.addEventListener('keydown', function (e) {
        if (!overlay.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') prev();
        else if (e.key === 'ArrowRight') next();
        else if (e.key === 'Escape') close();
    });
});
