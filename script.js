// Navegación móvil
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const navMore = document.querySelector('.nav-more');
const navMoreButton = document.querySelector('.nav-more-button');

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

const teamCards = Array.from(document.querySelectorAll('.team-card'));
const teamFilters = Array.from(document.querySelectorAll('[data-team-filter]'));
const teamShowMore = document.querySelector('.team-show-more');
let teamExpanded = false;
let activeTeamFilter = 'todos';

function updateTeamDirectory() {
  const filteredCards = teamCards.filter((card) => activeTeamFilter === 'todos' || card.dataset.teamArea === activeTeamFilter);
  const visibleLimit = activeTeamFilter === 'todos' && !teamExpanded ? 8 : filteredCards.length;

  teamCards.forEach((card) => {
    const matchesFilter = filteredCards.includes(card);
    const isWithinLimit = filteredCards.indexOf(card) < visibleLimit;
    card.classList.toggle('is-hidden', !matchesFilter || !isWithinLimit);
  });

  if (teamShowMore) {
    const shouldShowButton = activeTeamFilter === 'todos' && filteredCards.length > 8;
    teamShowMore.hidden = !shouldShowButton;
    teamShowMore.textContent = teamExpanded ? 'Ver menos' : 'Ver equipo completo';
  }
}

if (teamCards.length) {
  updateTeamDirectory();
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

  const getFormFields = (data) => ({
    nombre: data.get('nombre')?.toString().trim() || 'No especificado',
    empresa: data.get('empresa')?.toString().trim() || 'No especificado',
    telefono: data.get('telefono')?.toString().trim() || 'No especificado',
    email: data.get('email')?.toString().trim() || 'No especificado',
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
    `Teléfono/WhatsApp: ${fields.telefono}`,
    `Correo: ${fields.email}`,
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

    if (missingFields.length) {
      missingFields.forEach((field) => field.classList.add('is-invalid'));
      missingFields[0].focus();

      if (formStatus) {
        formStatus.textContent = 'Completa los campos marcados para enviar tu solicitud.';
        formStatus.classList.add('is-error');
      }
      return;
    }

    const data = new FormData(contactForm);
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