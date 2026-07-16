// Navegación móvil
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const navMore = document.querySelector('.nav-more');
const navMoreButton = document.querySelector('.nav-more-button');

document.querySelectorAll('.footer__links-toggle').forEach((toggle) => {
  const panelId = toggle.getAttribute('aria-controls');
  const panel = panelId ? document.getElementById(panelId) : null;
  if (!panel) return;

  toggle.addEventListener('click', () => {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isExpanded));
    panel.hidden = isExpanded;
  });

  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      panel.hidden = true;
    });
  });
});

/* Keep WhatsApp out of the mobile hero, then restore it after that first screen. */
(function () {
  const hero = document.querySelector('.hero');
  const whatsappButton = document.querySelector('.floating-whatsapp');
  const mobileQuery = window.matchMedia('(max-width:1024px)');
  if (!hero || !whatsappButton) return;

  function updateWhatsAppVisibility() {
    if (!mobileQuery.matches) {
      whatsappButton.classList.remove('is-visible');
      return;
    }

    const heroBottom = hero.getBoundingClientRect().bottom;
    whatsappButton.classList.toggle('is-visible', heroBottom <= 140);
  }

  window.addEventListener('scroll', updateWhatsAppVisibility, { passive: true });
  window.addEventListener('resize', updateWhatsAppVisibility);
  mobileQuery.addEventListener('change', updateWhatsAppVisibility);
  updateWhatsAppVisibility();
})();

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('is-open');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if (navMore && navMoreButton) {
  navMoreButton.addEventListener('click', () => {
    const expanded = navMoreButton.getAttribute('aria-expanded') === 'true';
    navMoreButton.setAttribute('aria-expanded', String(!expanded));
    navMore.classList.toggle('is-open', !expanded);
  });

  document.addEventListener('click', (event) => {
    if (!navMore.contains(event.target)) {
      navMore.classList.remove('is-open');
      navMoreButton.setAttribute('aria-expanded', 'false');
    }
  });
}

if (nav) {
  nav.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      nav.querySelectorAll('.nav-link').forEach((item) => item.classList.remove('active'));
      if (link.classList.contains('nav-link')) {
        link.classList.add('active');
      }
      navMore?.classList.remove('is-open');
      navMoreButton?.setAttribute('aria-expanded', 'false');
    });
  });
}

document.querySelectorAll('[data-scroll-top]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    nav?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    navMore?.classList.remove('is-open');
    navMoreButton?.setAttribute('aria-expanded', 'false');

    if (nav) {
      nav.querySelectorAll('.nav-link').forEach((item) => item.classList.remove('active'));
      nav.querySelector('.nav-link[href="#inicio"]')?.classList.add('active');
    }
  });
});

document.querySelectorAll('[data-product-slider]').forEach((slider) => {
  const track = slider.querySelector('.product-slider__track');
  const previousButton = slider.querySelector('[data-slider-prev]');
  const nextButton = slider.querySelector('[data-slider-next]');

  if (!track || !previousButton || !nextButton) return;

  function getSlideStep() {
    const firstCard = track.querySelector('.product-card');
    if (!firstCard) return track.clientWidth;

    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
    return firstCard.getBoundingClientRect().width + gap;
  }

  function updateSliderButtons() {
    const maxScroll = track.scrollWidth - track.clientWidth - 2;
    previousButton.disabled = track.scrollLeft <= 2;
    nextButton.disabled = track.scrollLeft >= maxScroll;
  }

  previousButton.addEventListener('click', () => {
    track.scrollBy({ left: -getSlideStep(), behavior: 'smooth' });
  });

  nextButton.addEventListener('click', () => {
    track.scrollBy({ left: getSlideStep(), behavior: 'smooth' });
  });

  track.addEventListener('scroll', updateSliderButtons, { passive: true });
  window.addEventListener('resize', updateSliderButtons);
  updateSliderButtons();
});

const lineCatalog = document.querySelector('[data-line-catalog]');

if (lineCatalog) {
  const lineCatalogData = {
    spray: {
      label: 'SPRAY',
      title: 'Línea SPRAY',
      description: 'Listado oficial de productos de la línea SPRAY.',
      products: [
        '11-1 NEUTRO — BELLE LUX',
        '47-7 NEUTRO — BELLE LUX',
        '02-0 — BRILLO GLOSS',
        'WXMZ-1000 — WAXI NEUTRO',
        'SMZ-24 — WHITE LUX NEUTRO',
        'SAMZ-309 — OPTIMA NEUTRO',
        'SAMZ-20 — SPRAY NEUTRO',
        'WFMZ-1035 — WAX FILL NEUTRO',
        'SFP-800 — TOP CREAM SEMI-MATE',
        'CMZ-612 — CREMA ECO TOP UNIVERSAL',
        'SAMZ-260 — BRILLO P/SOLE NEUTRO'
      ],
      ctaMessage: 'Hola Acabados Monza, quiero información de la línea SPRAY.'
    },
    cremas: {
      label: 'CREMAS',
      title: 'Línea CREMAS',
      description: 'Listado oficial de productos de la línea CREMAS.',
      products: [
        'CMZ-617 — DIJON CREAM',
        'CNFP-700 — CREMA ANTIQUE NATURAL',
        'Sin clave — Delica cream',
        'CMZ-616 — SHINE CREAM NEUTRO',
        'Sin clave — Basco top',
        'CFP-105 — CREMA P/SINTETICO'
      ],
      ctaMessage: 'Hola Acabados Monza, quiero información de la línea CREMAS.'
    },
    lavadores: {
      label: 'LAVADORES / LIMPIADORES',
      title: 'Línea LAVADORES / LIMPIADORES',
      description: 'Listado oficial de productos de la línea LAVADORES / LIMPIADORES.',
      products: [
        'LMZ-2691 — LAVADOR',
        'LCH-X30 — LAVADOR P/CHAROL',
        'LFP-3141 — LAVADOR P/PEGAMENTO',
        'LSFP-015 — LAVADOR P/PEG.PVC',
        'LFP-2400 — LAVADOR',
        'AC-51 — ACTIVADOR NORMAL',
        'ACFP-61 — LIMPIADOR AC',
        'LMZ-777 — LAVADOR QUITA-RAYA',
        'LFP-2426 SP — LAVADOR QUITA-RAYA'
      ],
      ctaMessage: 'Hola Acabados Monza, quiero información de la línea LAVADORES / LIMPIADORES.'
    },
    fijatonos: {
      label: 'FIJATONOS',
      title: 'Línea FIJATONOS',
      description: 'Listado oficial de productos de la línea FIJATONOS.',
      products: [
        '0-04 NATURAL — VELVETOK',
        '0-05 rosa — VELVETOK',
        'VSMZ-550 — VELVET SUEDE NEUTRO',
        'FJMZ-570 — REPELENTE',
        'Sin clave — Defender protect'
      ],
      ctaMessage: 'Hola Acabados Monza, quiero información de la línea FIJATONOS.'
    },
    grasos: {
      label: 'GRASOS',
      title: 'Línea GRASOS',
      description: 'Listado oficial de productos de la línea GRASOS.',
      products: [
        'GFP-160 — SPRAY TACTO GRASO',
        'Sin clave — Eco graso',
        'Sin clave — Grease oil',
        'Sin clave — Grease -oil—90',
        'Sin clave — Cream graso',
        'Sin clave — Oíl neutro'
      ],
      ctaMessage: 'Hola Acabados Monza, quiero información de la línea GRASOS.'
    },
    reparadores: {
      label: 'REPARADORES',
      title: 'Línea REPARADORES',
      description: 'Listado oficial de productos de la línea REPARADORES.',
      products: ['Pigmentos', 'Farbern', 'Compactos', 'Estucos', 'Resanador'],
      ctaMessage: 'Hola Acabados Monza, quiero información de la línea REPARADORES.'
    },
    marroquineria: {
      label: 'MARROQUINERA',
      title: 'Línea MARROQUINERA',
      description: 'Listado oficial de productos de la línea MARROQUINERA.',
      products: ['Dátil MA', 'Dátil CU', 'Dátil LQ', 'Tinta plastificante', 'Sellador'],
      ctaMessage: 'Hola Acabados Monza, quiero información de la línea MARROQUINERA.'
    },
    preacabados: {
      label: 'PRE-ACABADOS',
      title: 'Línea PRE-ACABADOS',
      description: 'Listado oficial de productos de la línea PRE-ACABADOS.',
      products: ['Stein', 'Tinta de cantos', 'Tapaporos', 'Pielera', 'Pre Fondo', 'Tinta cerco'],
      ctaMessage: 'Hola Acabados Monza, quiero información de la línea PRE-ACABADOS.'
    },
    auxiliares: {
      label: 'AUXILIARES',
      title: 'Línea AUXILIARES',
      description: 'Listado oficial de productos de la línea AUXILIARES.',
      products: [
        'Acondicionador',
        'Masitas',
        'Crayones',
        'Cosméticos polvo',
        'Cosmético liquido',
        'Humectantes',
        'Suavizadores',
        'Cambra',
        'Flor fix',
        'Charolinas',
        'Metálicos'
      ],
      ctaMessage: 'Hola Acabados Monza, quiero información de la línea AUXILIARES.'
    },
    preformas: {
      label: 'PRE-FORMAS',
      title: 'Línea PRE-FORMAS',
      description: 'Listado oficial de productos de la línea PRE-FORMAS.',
      products: ['Tinta Eva', 'Tinta ranil', 'Tinta ABS', 'Matizantes', 'Bloming', 'Primer'],
      ctaMessage: 'Hola Acabados Monza, quiero información de la línea PRE-FORMAS.'
    }
  };

  const lineTabs = Array.from(lineCatalog.querySelectorAll('[data-line-key]'));
  const lineLabel = lineCatalog.querySelector('[data-line-label]');
  const lineTitle = lineCatalog.querySelector('[data-line-title]');
  const lineDescription = lineCatalog.querySelector('[data-line-description]');
  const lineProducts = lineCatalog.querySelector('[data-line-products]');
  const lineCta = lineCatalog.querySelector('[data-line-cta]');
  const catalogSurface = lineCatalog.querySelector('[data-catalog-surface]');
  const catalogToggle = lineCatalog.querySelector('[data-catalog-toggle]');
  const catalogDetail = lineCatalog.querySelector('#catalogo-lineas-detalle');

  function setCatalogExpanded(expanded) {
    if (!catalogSurface || !catalogToggle || !catalogDetail) return;
    catalogSurface.classList.toggle('is-collapsed', !expanded);
    catalogDetail.hidden = !expanded;
    catalogToggle.setAttribute('aria-expanded', String(expanded));
    catalogToggle.textContent = expanded ? 'Ver menos' : 'Ver detalles';
  }

  function buildWhatsAppUrl(activeLine) {
    const message = activeLine.ctaMessage || `Hola Acabados Monza, quiero información de la ${activeLine.title}.`;
    return `https://wa.me/5214773948872?text=${encodeURIComponent(message)}`;
  }

  function setActiveLine(activeKey) {
    const activeLine = lineCatalogData[activeKey];
    if (!activeLine || !lineLabel || !lineTitle || !lineDescription || !lineProducts || !lineCta) return;

    lineLabel.textContent = activeLine.label;
    lineTitle.textContent = activeLine.title;
    lineDescription.textContent = activeLine.description;
    lineProducts.innerHTML = activeLine.products.map((product) => `<li>${product}</li>`).join('');
    lineCta.href = buildWhatsAppUrl(activeLine);
    lineCta.setAttribute('aria-label', `Solicitar información por WhatsApp para ${activeLine.title}`);

    lineTabs.forEach((tab) => {
      const isActive = tab.dataset.lineKey === activeKey;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });
  }

  lineTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.lineKey;
      if (!key) return;
      setActiveLine(key);
    });
  });

  if (catalogToggle) {
    catalogToggle.addEventListener('click', () => {
      const expanded = catalogToggle.getAttribute('aria-expanded') === 'true';
      setCatalogExpanded(!expanded);
    });
  }

  const defaultKey = lineTabs.find((tab) => tab.classList.contains('is-active'))?.dataset.lineKey || lineTabs[0]?.dataset.lineKey;
  if (defaultKey) {
    setActiveLine(defaultKey);
  }

  setCatalogExpanded(false);
}

document.querySelectorAll('[data-golden-slider]').forEach((slider) => {
  const track = slider.querySelector('.golden-grid');
  if (!track) return;

  let isInteracting = false;

  function getGoldenStep() {
    const firstCard = track.querySelector('article');
    if (!firstCard) return track.clientWidth;

    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
    return firstCard.getBoundingClientRect().width + gap;
  }

  function advanceGoldenSlider() {
    if (isInteracting) return;

    const maxScroll = track.scrollWidth - track.clientWidth - 4;
    if (track.scrollLeft >= maxScroll) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }

    track.scrollBy({ left: getGoldenStep(), behavior: 'smooth' });
  }

  track.addEventListener('pointerdown', () => { isInteracting = true; });
  track.addEventListener('pointerup', () => { isInteracting = false; });
  track.addEventListener('pointercancel', () => { isInteracting = false; });
  track.addEventListener('mouseenter', () => { isInteracting = true; });
  track.addEventListener('mouseleave', () => { isInteracting = false; });

  setInterval(advanceGoldenSlider, 3200);
});

document.querySelectorAll('[data-golden-products-slider]').forEach((slider) => {
  const track = slider.querySelector('.golden-listing__grid');
  const previousButton = slider.querySelector('[data-golden-products-prev]');
  const nextButton = slider.querySelector('[data-golden-products-next]');

  if (!track || !previousButton || !nextButton) return;

  function getGoldenProductStep() {
    const firstCard = track.querySelector('.golden-product-card');
    if (!firstCard) return track.clientWidth;

    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
    return firstCard.getBoundingClientRect().width + gap;
  }

  function updateGoldenProductButtons() {
    const maxScroll = track.scrollWidth - track.clientWidth - 2;
    previousButton.disabled = track.scrollLeft <= 2;
    nextButton.disabled = track.scrollLeft >= maxScroll;
  }

  previousButton.addEventListener('click', () => {
    track.scrollBy({ left: -getGoldenProductStep(), behavior: 'smooth' });
  });

  nextButton.addEventListener('click', () => {
    track.scrollBy({ left: getGoldenProductStep(), behavior: 'smooth' });
  });

  track.addEventListener('scroll', updateGoldenProductButtons, { passive: true });
  window.addEventListener('resize', updateGoldenProductButtons);
  updateGoldenProductButtons();
});

const teamCards = Array.from(document.querySelectorAll('.team-card'));
const teamFilters = Array.from(document.querySelectorAll('[data-team-filter]'));
const teamShowMore = document.querySelector('.team-show-more');
let teamExpanded = false;
let activeTeamFilter = 'todos';
const mobileTeamQuery = window.matchMedia('(max-width: 720px)');

function updateTeamDirectory() {
  const filteredCards = teamCards.filter((card) => activeTeamFilter === 'todos' || card.dataset.teamArea === activeTeamFilter);
  const previewLimit = mobileTeamQuery.matches ? 4 : 8;
  const visibleLimit = activeTeamFilter === 'todos' && !teamExpanded ? previewLimit : filteredCards.length;

  teamCards.forEach((card) => {
    const matchesFilter = filteredCards.includes(card);
    const isWithinLimit = filteredCards.indexOf(card) < visibleLimit;
    card.classList.toggle('is-hidden', !matchesFilter || !isWithinLimit);
  });

  if (teamShowMore) {
    const shouldShowButton = activeTeamFilter === 'todos' && filteredCards.length > previewLimit;
    teamShowMore.hidden = !shouldShowButton;
    teamShowMore.textContent = teamExpanded ? 'Ver menos' : 'Ver equipo completo';
  }
}

if (teamCards.length) {
  updateTeamDirectory();
  mobileTeamQuery.addEventListener('change', updateTeamDirectory);
}

teamFilters.forEach((filter) => {
  filter.addEventListener('click', () => {
    activeTeamFilter = filter.dataset.teamFilter || 'todos';
    teamExpanded = activeTeamFilter !== 'todos';
    teamFilters.forEach((item) => item.classList.toggle('is-active', item === filter));
    updateTeamDirectory();
  });
});

if (teamShowMore) {
  teamShowMore.addEventListener('click', () => {
    teamExpanded = !teamExpanded;
    updateTeamDirectory();
  });
}

const aboutGrid = document.querySelector('.about-grid');
const aboutCards = aboutGrid ? Array.from(aboutGrid.querySelectorAll('article')) : [];

if (aboutCards.length) {
  let aboutStack = [...aboutCards];
  const mobileStackQuery = window.matchMedia('(max-width: 720px)');

  function updateAboutStack() {
    aboutStack.forEach((card, index) => {
      card.style.setProperty('--stack-index', String(index));
      card.dataset.stackIndex = String(index);
      card.setAttribute('tabindex', mobileStackQuery.matches && index === 0 ? '0' : '-1');
      card.setAttribute('role', mobileStackQuery.matches ? 'button' : 'article');
      card.setAttribute('aria-label', mobileStackQuery.matches ? `${card.querySelector('h3')?.textContent || 'Tarjeta'}: tocar para ver la siguiente tarjeta` : card.querySelector('h3')?.textContent || 'Tarjeta');
    });
  }

  function rotateAboutStack(card) {
    if (!mobileStackQuery.matches || card !== aboutStack[0]) return;
    aboutStack = [...aboutStack.slice(1), aboutStack[0]];
    updateAboutStack();
  }

  aboutCards.forEach((card) => {
    card.addEventListener('click', () => rotateAboutStack(card));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        rotateAboutStack(card);
      }
    });
  });

  updateAboutStack();
  mobileStackQuery.addEventListener('change', updateAboutStack);
}

const monzaTones = [
  '#BD497A', '#8D3344', '#753E73', '#BA8E79', '#B8603A', '#C39639', '#878D6B', '#4E4034', '#24414D', '#436B67', '#25325F', '#15161A', '#2A1E1F', '#642E2B', '#8A6C50',
  '#C76478', '#883242', '#972E68', '#AD7D67', '#8E3D3A', '#C49C3F', '#6F7A61', '#4F6029', '#798668', '#3F6D67', '#413B68', '#5C4D3F', '#361E1D', '#643E1B', '#866347',
  '#C4706D', '#8A3056', '#9A3075', '#BB8C6B', '#A45453', '#BC9442', '#8F7842', '#537246', '#827E72', '#365F6C', '#1B2D49', '#6E5946', '#4D3123', '#6B4526', '#866B55',
  '#4D7484', '#773F4E', '#AF4C61', '#8B4B3C', '#BB813D', '#C09D5E', '#8E8732', '#466E57', '#75766F', '#2E535D', '#222B44', '#523731', '#543225', '#6F412A', '#785B3E',
  '#9EA55B', '#5C3744', '#BA5F70', '#9A4B45', '#B77E2C', '#C29D3F', '#7F7156', '#466333', '#4B5959', '#485E76', '#403B38', '#2B2120', '#623627', '#784D2D', '#906B4D',
  '#C3A044', '#853059', '#B88F7D', '#A54D4C', '#AB7F37', '#B69A56', '#554E3D', '#3B4D43', '#4D4F4E', '#474E57', '#30222D', '#3A2520', '#633825', '#795633', '#826E5F'
];

const toneRow = document.querySelector('.tone-row');

if (toneRow) {
  toneRow.innerHTML = monzaTones
    .map((tone, index) => `<span class="tone-swatch" style="--tone:${tone}" title="Tono ${index + 1}" aria-label="Tono ${index + 1}"></span>`)
    .join('');
}

// Formulario de contacto
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  const formStatus = contactForm.querySelector('.form-status');
  const submitButtons = Array.from(contactForm.querySelectorAll('button[type="submit"]'));
  const requiredFields = Array.from(contactForm.querySelectorAll('[required]'));
  const detailsToggle = contactForm.querySelector('.form-details-toggle');
  const detailsPanel = contactForm.querySelector('.form-details');
  const contactField = contactForm.querySelector('[name="telefono"]');

  if (detailsToggle && detailsPanel) {
    detailsToggle.addEventListener('click', () => {
      const isExpanded = detailsToggle.getAttribute('aria-expanded') === 'true';
      detailsToggle.setAttribute('aria-expanded', String(!isExpanded));
      detailsPanel.hidden = isExpanded;
    });
  }

  const getFormFields = (data) => ({
    nombre: data.get('nombre')?.toString().trim() || 'No especificado',
    empresa: data.get('empresa')?.toString().trim() || 'No especificado',
    telefono: data.get('telefono')?.toString().trim() || 'No especificado',
    ciudad: data.get('ciudad')?.toString().trim() || 'No especificado',
    tipoProducto: data.get('tipo-producto')?.toString().trim() || 'No especificado',
    material: data.get('material')?.toString().trim() || 'No especificado',
    mensaje: data.get('mensaje')?.toString().trim() || 'No especificado'
  });

  const buildWhatsAppText = (fields) => [
    'Hola Acabados Monza, quiero solicitar asesoría técnica.',
    '',
    `Nombre: ${fields.nombre}`,
    `Empresa/Taller: ${fields.empresa}`,
    `Contacto: ${fields.telefono}`,
    `Ciudad: ${fields.ciudad}`,
    `Tipo de producto: ${fields.tipoProducto}`,
    `Material: ${fields.material}`,
    `Necesidad/Proyecto: ${fields.mensaje}`
  ].join('\n');

  requiredFields.forEach((field) => {
    field.addEventListener('input', () => field.classList.remove('is-invalid'));
    field.addEventListener('change', () => field.classList.remove('is-invalid'));
  });

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const selectedAction = event.submitter?.value || 'whatsapp';

    const missingFields = requiredFields.filter((field) => !field.value.trim());

    const contactValue = contactField?.value.trim() || '';
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactValue);

    if (selectedAction === 'email' && contactField && !isEmail && !missingFields.includes(contactField)) {
      missingFields.push(contactField);
    }

    if (missingFields.length) {
      missingFields.forEach((field) => field.classList.add('is-invalid'));
      missingFields[0].focus();

      if (formStatus) {
        formStatus.textContent = selectedAction === 'email' && !isEmail
          ? 'Para enviar por correo, escribe un correo electrónico válido en el campo de contacto.'
          : 'Completa los campos marcados para enviar tu solicitud.';
        formStatus.classList.add('is-error');
      }
      return;
    }

    const data = new FormData(contactForm);
    if (selectedAction === 'email') {
      data.set('email', contactValue);
    }
    const selectedButton = event.submitter && event.submitter.matches('button[type="submit"]') ? event.submitter : null;
    const originalText = selectedButton?.textContent || 'Enviar';

    if (selectedAction === 'whatsapp') {
      const text = buildWhatsAppText(getFormFields(data));
      const waUrl = `https://wa.me/5214773948872?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank', 'noopener');

      if (formStatus) {
        formStatus.textContent = 'Listo, abrimos WhatsApp con tu solicitud.';
        formStatus.classList.remove('is-error');
      }
      return;
    }

    if (formStatus) {
      formStatus.textContent = 'Enviando solicitud...';
      formStatus.classList.remove('is-error');
    }

    submitButtons.forEach((button) => {
      button.disabled = true;
    });

    if (selectedButton) {
      selectedButton.textContent = 'Enviando...';
    }

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: data,
        headers: {
          Accept: 'application/json'
        }
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No pudimos enviar tu solicitud.');
      }

      contactForm.reset();

      if (formStatus) {
        formStatus.textContent = 'Gracias, recibimos tu solicitud. Te contactaremos pronto.';
        formStatus.classList.remove('is-error');
      }
    } catch (error) {
      if (formStatus) {
        formStatus.textContent = 'No pudimos enviar el formulario. Escríbenos por WhatsApp o intenta de nuevo.';
        formStatus.classList.add('is-error');
      }
    } finally {
      submitButtons.forEach((button) => {
        button.disabled = false;
      });

      if (selectedButton) {
        selectedButton.textContent = originalText;
      }
    }
  });
}

/* Lightweight marquee initializer (mobile <=1024px) */
(function () {
  const topbar = document.querySelector('.topbar');
  if (!topbar) return;
  const content = topbar.querySelector('.topbar__content');
  if (!content) return;

  const mm = window.matchMedia('(max-width:1024px)');

  function setup() {
    if (!mm.matches) {
      // destroy if exists
      const existing = content.querySelector('.topbar__marquee');
      if (existing) existing.remove();
      delete content.dataset.marqueeInit;
      return;
    }

    if (content.dataset.marqueeInit === '1') return;
    const items = Array.from(content.querySelectorAll('.topbar__item'));
    if (!items.length) return;

    const original = items.map((el) => el.outerHTML);
    items.forEach((el) => el.remove());

    const marquee = document.createElement('div');
    marquee.className = 'topbar__marquee';
    const track = document.createElement('div');
    track.className = 'topbar__marquee-track';
    track.innerHTML = original.join('').repeat(3);
    marquee.appendChild(track);
    content.appendChild(marquee);

    requestAnimationFrame(() => {
      const firstChildren = Array.from(track.children).slice(0, original.length);
      const firstWidth = firstChildren.reduce((acc, el) => acc + (el.getBoundingClientRect().width || 0), 0) || 1;
      const duration = Math.max(4, firstWidth / 40);
      track.style.setProperty('--marquee-translate', `${firstWidth}px`);
      track.style.setProperty('--marquee-duration', `${duration}s`);
      track.style.animationDuration = `${duration}s`;
      track.classList.add('is-animated');
    });

    // simple pointer handlers: pause, drag, resume at position
    marquee.addEventListener('pointerdown', (e) => {
      marquee.setPointerCapture(e.pointerId);
      track.classList.add('paused');
      const m = getComputedStyle(track).transform;
      let x = 0;
      if (m && m !== 'none') {
        const vals = m.match(/matrix\(([^)]+)\)/);
        if (vals) x = parseFloat(vals[1].split(',')[4]) || 0;
      }
      marquee._startX = e.clientX;
      marquee._startOffset = x;
    });

    marquee.addEventListener('pointermove', (e) => {
      if (!marquee.hasPointerCapture(e.pointerId)) return;
      const dx = e.clientX - (marquee._startX || 0);
      track.style.transform = `translate3d(${(marquee._startOffset || 0) + dx}px,0,0)`;
    });

    marquee.addEventListener('pointerup', (e) => {
      if (marquee.hasPointerCapture(e.pointerId)) marquee.releasePointerCapture(e.pointerId);
      const m = getComputedStyle(track).transform;
      let x = 0;
      if (m && m !== 'none') {
        const vals = m.match(/matrix\(([^)]+)\)/);
        if (vals) x = parseFloat(vals[1].split(',')[4]) || 0;
      }
      const firstChildren = Array.from(track.children).slice(0, Math.max(1, Math.floor(track.children.length / 3)));
      const firstWidth = firstChildren.reduce((acc, el) => acc + (el.getBoundingClientRect().width || 0), 0) || 1;
      const progress = ((-x % firstWidth) + firstWidth) % firstWidth / firstWidth;
      const duration = parseFloat(getComputedStyle(track).animationDuration) || (firstWidth / 40);
      track.style.animationDelay = `${-progress * duration}s`;
      void track.offsetWidth;
      track.style.transform = '';
      track.classList.remove('paused');
    });

    content.dataset.marqueeInit = '1';
  }

  mm.addEventListener('change', setup);
  setup();
})();