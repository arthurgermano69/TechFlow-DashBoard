# TechFlow Dashboard

Dashboard responsivo para acompanhar projetos, equipes e indicadores da empresa fictícia **TechFlow**. Desenvolvido como Checkpoint 5 de FrontEnd Design (2026-2).

🔗 **Repositório:** https://github.com/arthurgermano69/TechFlow-DashBoard

## Integrantes

| Nome | RM |
| --- | --- |
| Arthur Germano Pinheiro | rm574042 |
| João Pedro De Souza | rm571437 |


## Tecnologias utilizadas

- **HTML5** semântico (`header`, `aside`, `nav`, `main`, `section`, `article`, `dialog`)
- **Tailwind CSS v4** (via plugin oficial `@tailwindcss/vite`)
- **JavaScript puro** (ES Modules, sem frameworks)
- **Vite** como ferramenta de desenvolvimento e build
- **Git e GitHub** para versionamento, com commits semânticos

## Principais recursos implementados

### Telas
- **Dashboard** com navbar, sidebar, campo de pesquisa, informações do usuário, 4 cards de indicadores e feed com 7 projetos.
- **Modal "Novo projeto"** com os campos Nome, Responsável, Categoria, Prioridade, Prazo e Descrição.

### Layout e responsividade
- Abordagem **Mobile-First**, com os breakpoints `sm`, `md`, `lg`, `xl` e `2xl`.
- **CSS Grid** com cards de tamanhos diferentes (`grid-cols-*`, `col-span-*`, `row-span-*`), sem espaços vazios em nenhum breakpoint.
- **Flexbox** em toda a interface (`flex`, `flex-col`, `flex-wrap`, `items-center`, `justify-between`, `gap-*`).
- Sidebar fixa no desktop e em formato de menu deslizante no celular e no tablet.

### Interações
- **Sidebar mobile** com abertura e fechamento, fundo escurecido, bloqueio de rolagem e fechamento por `Esc`.
- **Dropdown do usuário** com navegação por teclado (setas, `Home`, `End`, `Esc`).
- Estados `hover:`, `focus:`, `active:` e `disabled:`, além de `group-hover:` e `peer-checked:`.
- Transições com `transition`, `transition-all`, `duration-*` e `ease-*`.
- **Pesquisa de projetos em tempo real**, ignorando acentos, com estado vazio. O atalho `/` foca a pesquisa.

### Formulário
- **Validação visual com JavaScript**: estados de erro (vermelho) e sucesso (verde com ✓), validação ao sair do campo e correção ao digitar.
- Contador de caracteres na descrição, prazo mínimo na data de hoje e botão com estado de carregamento (`disabled:`).
- Tela de confirmação após o envio. Os dados **não** são salvos em banco de dados.

### Tema
- Seletor **Light | Dark | System** com a variante `dark:` do Tailwind.
- Preferência salva no **`localStorage`**, com aplicação do tema antes da renderização para evitar o "flash" branco.
- No modo System, o tema acompanha o sistema operacional em tempo real.

### Design e acessibilidade
- Princípios de design da Apple aplicados à web: superfícies translúcidas (`backdrop-blur`), animações que partem do estado atual e podem ser interrompidas, tipografia com espaçamento ajustado ao tamanho e feedback imediato ao toque.
- Suporte a `prefers-reduced-motion`, `prefers-reduced-transparency` e `prefers-contrast`.
- Navegação completa por teclado, `aria-*` nos componentes interativos e foco visível.

## Como executar

```bash
git clone https://github.com/arthurgermano69/TechFlow-DashBoard.git
cd TechFlow-DashBoard
npm install
npm run dev
```

Acesse o endereço exibido no terminal (normalmente `http://localhost:5173`).

Para gerar a versão de produção:

```bash
npm run build
```

## Estrutura do projeto

```
techflow-dashboard/
│
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── vite.config.js
├── package.json
└── README.md
```
