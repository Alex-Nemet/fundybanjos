function toggleMobileMenu(menu) {
    menu.classList.toggle('open');
}

// Google Analytics click tracking. Page views are recorded automatically;
// these events add the clicks that happen within the site.
function trackEvent(name, params) {
    if (typeof gtag === 'function') gtag('event', name, params || {});
}

// Where on the page a link sits, so the same link in the nav, footer or
// body can be told apart in reports.
function linkLocation(el) {
    if (el.closest('nav, .header, #hamburger-icon')) return 'nav';
    if (el.closest('footer')) return 'footer';
    if (el.closest('.model-card')) return 'model card';
    if (el.closest('.enquire-cta')) return 'enquire button';
    if (el.closest('.back-to-gallery')) return 'page button';
    return 'page';
}

function cardTitle(card) {
    var heading = card.querySelector('h2');
    return heading ? heading.textContent.trim() : '';
}

document.addEventListener('click', function (e) {
    var link = e.target.closest('a');
    var href = link ? link.getAttribute('href') || '' : '';

    if (link && href.indexOf('contact.html') === 0) {
        trackEvent('contact_click', {
            link_text: link.textContent.trim() || link.getAttribute('aria-label') || '',
            link_location: linkLocation(link),
            enquiry_type: new URLSearchParams(href.split('?')[1] || '').get('type') || 'general'
        });
    } else if (link && link.matches('.social-icon, .index_social-icon')) {
        trackEvent('social_click', { network: link.getAttribute('aria-label') || href });
    } else if (link && link.matches('.tuner-download-btn')) {
        trackEvent('app_download_click', { link_text: link.textContent.trim() });
    } else if (link && link.matches('.gallery_container')) {
        trackEvent('select_banjo', { banjo: cardTitle(link) });
    }

    var modelCard = e.target.closest('.model-card[data-href]');
    if (modelCard && !e.target.closest('.model-cta')) {
        trackEvent('select_model', { model: cardTitle(modelCard) });
    }

    var video = e.target.closest('.video-facade');
    if (video) {
        trackEvent('video_play', { video_id: video.dataset.videoId });
    }
});

document.addEventListener('submit', function (e) {
    if (!e.target.matches('.contact-form')) return;
    var type = e.target.querySelector('[name="enquiry_type"]');
    trackEvent('generate_lead', { enquiry_type: type ? type.value : '' });
});
