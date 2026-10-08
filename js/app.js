
// TechFlow Dashboard - app.js


const isDesktop = window.matchMedia('(min-width: 1024px)');


// SIDEBAR (mobile)

const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebar-overlay');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebarClose = document.getElementById('sidebar-close');

function setSidebar(open, { returnFocus = false } = {}) {
  // Painel desliza para dentro/fora
  sidebar.classList.toggle('-translate-x-full', !open);
  sidebar.classList.toggle('translate-x-0', open);

  // Scrim (fundo escurecido) aparece/desaparece
  overlay.classList.toggle('opacity-0', !open);
  overlay.classList.toggle('pointer-events-none', !open);
  overlay.classList.toggle('opacity-100', open);
  overlay.classList.toggle('pointer-events-auto', open);

  // Trava a rolagem da página enquanto o menu está aberto no mobile
  document.body.classList.toggle('overflow-hidden', open && !isDesktop.matches);

  // Acessibilidade
  sidebarToggle.setAttribute('aria-expanded', String(open));
  sidebar.inert = !open && !isDesktop.matches;

  // Foco: entra no menu ao abrir, volta ao botão ao fechar
  if (open) sidebarClose.focus();
  else if (returnFocus) sidebarToggle.focus();
}

sidebarToggle.addEventListener('click', () => setSidebar(true));
sidebarClose.addEventListener('click', () => setSidebar(false, { returnFocus: true }));
overlay.addEventListener('click', () => setSidebar(false, { returnFocus: true }));

// Clicar em um link do menu fecha a sidebar no mobile
sidebar.querySelectorAll('nav a').forEach((link) => {
  link.addEventListener('click', () => {
    if (!isDesktop.matches) setSidebar(false);
  });
});

// Esc fecha a sidebar
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !isDesktop.matches && sidebarToggle.getAttribute('aria-expanded') === 'true') {
    setSidebar(false, { returnFocus: true });
  }
});

// Ao redimensionar a janela (ex: girar o celular), volta ao estado correto
isDesktop.addEventListener('change', () => setSidebar(false));

// Estado inicial
setSidebar(false);


// DROPDOWN DO USUÁRIO

const userMenuButton = document.getElementById('user-menu-button');
const userMenu = document.getElementById('user-menu');

const getMenuItems = () => [...userMenu.querySelectorAll('[role="menuitem"]')];
const isMenuOpen = () => userMenuButton.getAttribute('aria-expanded') === 'true';

function setUserMenu(open, { returnFocus = false } = {}) {
  // Fechado: invisível, menor e transparente. Aberto: cresce a partir do botão
  userMenu.classList.toggle('invisible', !open);
  userMenu.classList.toggle('opacity-0', !open);
  userMenu.classList.toggle('scale-95', !open);
  userMenu.classList.toggle('visible', open);
  userMenu.classList.toggle('opacity-100', open);
  userMenu.classList.toggle('scale-100', open);

  userMenuButton.setAttribute('aria-expanded', String(open));

  if (open) getMenuItems()[0]?.focus();
  else if (returnFocus) userMenuButton.focus();
}

// Abre/fecha pelo botão
userMenuButton.addEventListener('click', () => setUserMenu(!isMenuOpen()));

// Clicar fora fecha (já na hora do toque, sem esperar soltar)
document.addEventListener('pointerdown', (e) => {
  if (!isMenuOpen()) return;
  if (userMenu.contains(e.target) || userMenuButton.contains(e.target)) return;
  setUserMenu(false);
});

// Clicar em um item fecha o menu
getMenuItems().forEach((item) => {
  item.addEventListener('click', () => setUserMenu(false));
});

// Teclado: Esc, setas, Home, End e Tab
userMenu.addEventListener('keydown', (e) => {
  const items = getMenuItems();
  const index = items.indexOf(document.activeElement);

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      items[(index + 1) % items.length].focus();
      break;
    case 'ArrowUp':
      e.preventDefault();
      items[(index - 1 + items.length) % items.length].focus();
      break;
    case 'Home':
      e.preventDefault();
      items[0].focus();
      break;
    case 'End':
      e.preventDefault();
      items[items.length - 1].focus();
      break;
    case 'Escape':
      setUserMenu(false, { returnFocus: true });
      break;
    case 'Tab':
      setUserMenu(false);
      break;
  }
});

// Abrir com seta para baixo quando o foco está no botão
userMenuButton.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    setUserMenu(true);
  }
});

// Estado inicial
setUserMenu(false);