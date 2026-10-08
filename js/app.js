
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
  // Nos botões de tema, as setas trocam de opção (comportamento nativo do rádio)
  if (e.target.matches('input[type="radio"]') && e.key.startsWith('Arrow')) return;

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


// TEMA: Light | Dark | System (com localStorage)
const THEME_KEY = 'techflow-theme';
const THEMES = ['light', 'dark', 'system'];
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
const themeInputs = document.querySelectorAll('input[name="theme"]');

function getStoredTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    return THEMES.includes(saved) ? saved : 'system';
  } catch {
    return 'system'; // localStorage indisponível (ex: modo privado restrito)
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* sem armazenamento: o tema vale só nesta sessão */
  }
}

// Liga/desliga a classe "dark" no <html>, que ativa as variantes dark: do Tailwind
function applyTheme(theme) {
  const dark = theme === 'dark' || (theme === 'system' && systemDark.matches);
  document.documentElement.classList.toggle('dark', dark);
}

// Marca o botão de rádio correspondente
function syncThemeInputs(theme) {
  themeInputs.forEach((input) => {
    input.checked = input.value === theme;
  });
}

function setTheme(theme) {
  applyTheme(theme);
  saveTheme(theme);
  syncThemeInputs(theme);
}

// Usuário escolhe um tema
themeInputs.forEach((input) => {
  input.addEventListener('change', () => setTheme(input.value));
});

// No modo System, acompanha o sistema operacional em tempo real
systemDark.addEventListener('change', () => {
  if (getStoredTheme() === 'system') applyTheme('system');
});

// Mantém várias abas abertas sincronizadas
window.addEventListener('storage', (e) => {
  if (e.key !== THEME_KEY) return;
  const theme = getStoredTheme();
  applyTheme(theme);
  syncThemeInputs(theme);
});

// Estado inicial
const initialTheme = getStoredTheme();
applyTheme(initialTheme);
syncThemeInputs(initialTheme);

/* ----------------------------------------------------------
   MODAL: NOVO PROJETO (abrir e fechar)
   ---------------------------------------------------------- */
const modal = document.getElementById('project-modal');
const openModalButton = document.getElementById('open-project-modal');
const modalCloseButton = document.getElementById('project-modal-close');
const cancelButton = document.getElementById('project-cancel');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let closeTimer = null;
let isSubmitting = false;

function openModal() {
  clearTimeout(closeTimer); // se estava fechando, cancela e volta de onde estava
  if (!modal.open) modal.showModal();
  void modal.offsetWidth; // registra o estado "fechado" antes de animar a abertura
  modal.dataset.open = 'true';
  document.documentElement.classList.add('overflow-hidden'); // trava a rolagem da página
}

function closeModal() {
  if (isSubmitting) return;
  modal.dataset.open = 'false'; // dispara a animação de saída

  closeTimer = setTimeout(() => {
    modal.close();
    document.documentElement.classList.remove('overflow-hidden');
  }, reducedMotion.matches ? 0 : 300);
}

openModalButton.addEventListener('click', openModal);
modalCloseButton.addEventListener('click', closeModal);
cancelButton.addEventListener('click', closeModal);

// Esc: usa a nossa animação de saída em vez do fechamento seco do navegador
modal.addEventListener('cancel', (e) => {
  e.preventDefault();
  closeModal();
});

// Clique no fundo escuro fecha, mas só se o clique COMEÇOU no fundo
// (evita fechar ao arrastar para selecionar texto de um campo)
let pressStartedOnBackdrop = false;
modal.addEventListener('pointerdown', (e) => {
  pressStartedOnBackdrop = e.target === modal;
});
modal.addEventListener('click', (e) => {
  if (e.target === modal && pressStartedOnBackdrop) closeModal();
});