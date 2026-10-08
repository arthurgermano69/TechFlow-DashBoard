
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

//  MODAL: NOVO PROJETO (abrir e fechar)

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

/* ----------------------------------------------------------
   FORMULÁRIO: validação visual
   ---------------------------------------------------------- */
const form = document.getElementById('project-form');
const formView = document.getElementById('project-form-view');
const formBody = document.getElementById('project-form-body');
const successView = document.getElementById('project-success-view');
const successIcon = document.getElementById('success-icon');
const successName = document.getElementById('success-name');
const submitButton = document.getElementById('project-submit');
const submitLabel = document.getElementById('project-submit-label');
const submitSpinner = document.getElementById('project-submit-spinner');
const descriptionCount = document.getElementById('description-count');
const createAnotherButton = document.getElementById('project-create-another');
const doneButton = document.getElementById('project-done');

// Data de hoje no fuso local (formato AAAA-MM-DD), usada como prazo mínimo
function toLocalISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
const todayISO = toLocalISODate(new Date());
form.elements.namedItem('deadline').min = todayISO;

// Regras: retornam '' quando válido, ou a mensagem de erro
// (a ordem das chaves segue a ordem dos campos na tela)
const rules = {
  name(value) {
    const v = value.trim();
    if (!v) return 'Informe o nome do projeto.';
    if (v.length < 3) return 'Use pelo menos 3 caracteres.';
    return '';
  },
  owner: (value) => (value ? '' : 'Selecione um responsável.'),
  category: (value) => (value ? '' : 'Selecione uma categoria.'),
  priority: (value) => (value ? '' : 'Escolha uma prioridade.'),
  deadline(value) {
    if (!value) return 'Defina um prazo.';
    if (value < todayISO) return 'O prazo não pode estar no passado.';
    return '';
  },
  description(value) {
    const v = value.trim();
    if (!v) return 'Descreva o projeto.';
    if (v.length < 10) return 'Escreva pelo menos 10 caracteres.';
    return '';
  },
};

const fields = Object.fromEntries(
  [...form.querySelectorAll('[data-field]')].map((el) => [el.dataset.field, el])
);
const touched = new Set(); // campos que o usuário já "visitou"

const getValue = (name) => form.elements.namedItem(name).value;
const fieldControls = (field) => field.querySelectorAll('input:not([type="radio"]), select, textarea');

function renderFieldState(name, message) {
  const field = fields[name];
  const invalid = message !== '';
  const errorEl = field.querySelector('[data-error]');
  const successIconEl = field.querySelector('[data-success-icon]');

  field.dataset.invalid = String(invalid);

  fieldControls(field).forEach((control) => {
    control.setAttribute('aria-invalid', String(invalid)); // ativa o visual de erro
    control.dataset.valid = String(!invalid);               // ativa o visual de sucesso
  });

  errorEl.textContent = message;
  errorEl.classList.toggle('hidden', !invalid);
  errorEl.classList.toggle('flex', invalid);
  successIconEl.classList.toggle('hidden', invalid);
}

function clearFieldState(name) {
  const field = fields[name];
  const errorEl = field.querySelector('[data-error]');

  delete field.dataset.invalid;
  fieldControls(field).forEach((control) => {
    control.removeAttribute('aria-invalid');
    delete control.dataset.valid;
  });

  errorEl.textContent = '';
  errorEl.classList.add('hidden');
  errorEl.classList.remove('flex');
  field.querySelector('[data-success-icon]').classList.add('hidden');
}

function validateField(name) {
  const message = rules[name](getValue(name));
  renderFieldState(name, message);
  return message;
}

// Ao sair do campo: valida
form.addEventListener('focusout', (e) => {
  const name = e.target.name;
  if (!rules[name]) return;
  touched.add(name);
  validateField(name);
});

// Ao digitar: atualiza o contador e, se o campo já foi visitado, revalida na hora
form.addEventListener('input', (e) => {
  const name = e.target.name;
  if (name === 'description') {
    descriptionCount.textContent = `${e.target.value.length}/200`;
  }
  if (rules[name] && touched.has(name)) validateField(name);
});

// Ao escolher (select, rádio, data): valida na hora
form.addEventListener('change', (e) => {
  const name = e.target.name;
  if (!rules[name]) return;
  touched.add(name);
  validateField(name);
});

// FORMULÁRIO: envio e tela de sucesso

const show = (el) => { el.classList.remove('hidden'); el.classList.add('flex'); };
const hide = (el) => { el.classList.add('hidden'); el.classList.remove('flex'); };

function setSubmitting(value) {
  isSubmitting = value;
  [...form.elements].forEach((el) => { el.disabled = value; }); // ativa o visual disabled:
  modalCloseButton.disabled = value;
  submitLabel.textContent = value ? 'Criando…' : 'Criar projeto';
  submitSpinner.classList.toggle('hidden', !value);
}

function showSuccess(projectName) {
  successName.textContent = projectName;
  hide(formView);
  show(successView);

  void successIcon.offsetWidth; // permite animar o ícone entrando
  successIcon.classList.remove('scale-50', 'opacity-0');
  successIcon.classList.add('scale-100', 'opacity-100');

  doneButton.focus();
}

function resetProjectForm() {
  form.reset();
  touched.clear();
  Object.keys(fields).forEach(clearFieldState);
  descriptionCount.textContent = '0/200';
  formBody.scrollTop = 0;

  hide(successView);
  show(formView);
  successIcon.classList.add('scale-50', 'opacity-0');
  successIcon.classList.remove('scale-100', 'opacity-100');
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (isSubmitting) return;

  // Valida tudo e descobre o primeiro campo com erro
  let firstInvalid = null;
  for (const name of Object.keys(rules)) {
    touched.add(name);
    if (validateField(name) && !firstInvalid) firstInvalid = name;
  }

  if (firstInvalid) {
    fields[firstInvalid].querySelector('input, select, textarea').focus();
    return;
  }

  // Tudo certo: simula o envio (sem banco de dados)
  const projectName = getValue('name').trim();
  setSubmitting(true);
  setTimeout(() => {
    setSubmitting(false);
    showSuccess(projectName);
  }, 900);
});

createAnotherButton.addEventListener('click', () => {
  resetProjectForm();
  form.elements.namedItem('name').focus();
});

doneButton.addEventListener('click', closeModal);

// Sempre que o modal fecha, deixa o formulário limpo para a próxima vez
modal.addEventListener('close', resetProjectForm);