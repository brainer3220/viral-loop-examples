(() => {
  const campaign = 'brush_selfserve_evening_01';
  const incoming = new URLSearchParams(location.search);
  if (incoming.get('utm_campaign') !== campaign) return;

  const audience = incoming.get('utm_content');
  const medium = incoming.get('utm_medium');
  const fromPartner = medium === 'partnership' && ['developer', 'creator'].includes(audience);
  if (!fromPartner && medium !== 'editorial') return;

  const publications = ['subthread', 'indiedevmonday', 'dreamboat', 'creativevault', 'indiewait', 'freelancethings'];
  const publication = incoming.get('utm_source');
  const labels = new URLSearchParams({
    utm_source: medium === 'editorial' && publications.includes(publication) ? publication : 'showcase',
    utm_medium: medium,
    utm_campaign: campaign,
    utm_content: fromPartner ? audience : 'editorial',
  });
  for (const anchor of document.querySelectorAll('[data-product], [data-language]')) {
    const destination = new URL(anchor.href);
    destination.search = labels.toString();
    anchor.href = destination.href;
  }
  if (fromPartner) {
    const ko = document.documentElement.lang === 'ko';
    const group = audience === 'developer' ? (ko ? '앱 개발팀' : 'App maker') : (ko ? '크리에이터' : 'Creator');
    const subject = ko ? '양치냥 오픈 알림' : 'Brush Nyang launch notice';
    for (const [selector, key] of [['[data-launch-mail]', 'subject'], ['[data-web-mail]', 'su']]) {
      const link = document.querySelector(selector);
      const url = new URL(link.href);
      url.searchParams.set(key, subject + ' · ' + group);
      link.href = url.href.replace(/\+/g, '%20');
    }
  }
})();
