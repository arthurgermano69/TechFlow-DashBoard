
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