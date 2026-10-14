const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);

const KOALA = String.raw`
   ▄▄▄       ▄▄▄
  █████▄▄▄▄▄█████
   ██▀       ▀██
   █  ●  ▄▄  ●  █
   █    ████    █
    ▀▄   ▀▀   ▄▀
      ▀▀▀▀▀▀▀▀`;

export function createTerminal({ goTo, onTurbo, onBurst }) {
  const root = document.getElementById('term');
  const body = document.getElementById('termBody');
  const form = document.getElementById('termForm');
  const input = document.getElementById('termInput');
  const history = [];
  let hIdx = 0;
  let lastFocus = null;

  const print = (html, cls = '') => {
    const div = document.createElement('div');
    if (cls) div.className = cls;
    div.innerHTML = html;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  };

  const link = (href, label) => `<a href="${href}" target="_blank" rel="noopener">${label}</a>`;

  const commands = {
    help: () => print(
`comandos disponíveis:
  <span class="acc">whoami</span>      quem é o Herbert
  <span class="acc">projetos</span>    lista dos projetos em destaque
  <span class="acc">abrir</span> &lt;n&gt;     vai até um projeto (1-4)
  <span class="acc">ssp</span>         a carreira na SSP-DF
  <span class="acc">cv</span>          linha do tempo resumida
  <span class="acc">stack</span>       ferramentas do dia a dia
  <span class="acc">neofetch</span>    informações do sistema
  <span class="acc">jogar</span>       abre o Favela League
  <span class="acc">github</span>      abre o GitHub
  <span class="acc">contato</span>     email, LinkedIn e GitHub
  <span class="acc">linkedin</span>    abre o LinkedIn
  <span class="acc">clear</span>       limpa a tela
  <span class="acc">exit</span>        fecha o terminal
dica: tem pelo menos dois comandos escondidos.`),
    whoami: () => print(
`Herbert Valadares — desenvolvedor full-stack em Brasília.
Entrei na SSP-DF como estagiário em 2019; desde 2021 sou Full Stack Developer lá.
Formado em Análise e Desenvolvimento de Sistemas pela UNIP.
Fora do expediente: servidor de GTA RP, jogos no navegador e um servidor ARM que eu mesmo opero.`),
    projetos: () => print(
`<span class="acc">01</span>  Automotiva RP     servidor de GTA RP, 846 resources (242 meus)
<span class="acc">02</span>  Favela League     futebol de moto multiplayer no navegador
<span class="acc">03</span>  Koala Fit         app de treino com ofensiva e bot no Telegram
<span class="acc">04</span>  koala-server      Oracle ARM, Caddy, Docker, CI e alertas
use <span class="acc">abrir 2</span> para ir até um deles.`),
    abrir: (arg) => {
      const map = { 1: '#automotiva', 2: '#favela', 3: '#fit', 4: '#infra' };
      const target = map[arg];
      if (!target) return print('uso: abrir &lt;1-4&gt;', 'err');
      print(`indo para ${target}…`);
      close();
      setTimeout(() => goTo(target), 200);
    },
    ssp: () => { print('abrindo a seção SSP-DF…'); close(); setTimeout(() => goTo('#ssp'), 200); },
    stack: () => print(
`linguagens   TypeScript · JavaScript · Lua · Python · SQL · C#
front        Next.js · React · React Native/Expo · Tailwind · MUI · Three.js
back         NestJS · Node · Prisma · Drizzle · Socket.IO
dados        SQL Server · Postgres · MySQL · Redis
infra        Docker · Caddy · Nginx · GitHub Actions · GitLab CI · Linux
auth/sec     Keycloak · Vault · JWT/OAuth
ia           Claude Code · servidores MCP`),
    neofetch: () => print(
`<span class="acc">${esc(KOALA)}</span>

<span class="acc">visitante</span>@<span class="acc">devkoala</span>
-------------------
OS        devkoala.xyz (logo .com)
Host      koala-server · Oracle Cloud ARM64
Kernel    café coado 6.0
Uptime    na SSP-DF desde jul/2019
Shell     zsh + Claude Code
Packages  45 repos · 846 resources
Theme     escuro, sempre`),
    jogar: () => { print('abrindo favelaleague.devkoala.xyz…'); window.open('https://favelaleague.devkoala.xyz', '_blank', 'noopener'); },
    github: () => { print('abrindo github.com/devkoalaa…'); window.open('https://github.com/devkoalaa', '_blank', 'noopener'); },
    contato: () => print(
`email     ${link('mailto:herberticleber@gmail.com', 'herberticleber@gmail.com')}
linkedin  ${link('https://www.linkedin.com/in/herbertvaladares/', 'linkedin.com/in/herbertvaladares')}
github    ${link('https://github.com/devkoalaa', 'github.com/devkoalaa')}`),
    email: () => { print('abrindo seu cliente de email…'); window.location.href = 'mailto:herberticleber@gmail.com'; },
    linkedin: () => { print('abrindo o LinkedIn…'); window.open('https://www.linkedin.com/in/herbertvaladares/', '_blank', 'noopener'); },
    cv: () => print(
`2015  estágio · Universidade de Brasília
2017  estágio · Eletrobras
2019  estagiário de ADS · SSP-DF
2021  Full Stack Developer · SSP-DF
hoje  ainda lá, e com um servidor de GTA RP de bônus`),
    clear: () => { body.innerHTML = ''; },
    exit: () => close(),
    ls: () => print('sobre.txt  projetos/  ssp-df/  koala-server/  segredos/'),
    cat: (arg) => arg === 'sobre.txt' ? commands.whoami() : print(`cat: ${esc(arg || '')}: arquivo não encontrado`, 'err'),
    cd: (arg) => arg?.startsWith('segredos') ? print('permissão negada. tente <span class="acc">sudo</span>.', 'err') : print('você já está onde precisa estar.'),
    sudo: (arg) => {
      if ((arg || '').includes('rm')) return print('nem pensar.', 'err');
      print('senha do sudo: ********\nmentira, não tem sudo aqui. mas toma um turbo.', 'acc');
      onTurbo();
    },
    turbo: () => { const on = onTurbo(); print(on ? 'modo turbo ligado.' : 'modo turbo desligado.', 'acc'); },
    coala: () => { print(`<span class="acc">${esc(KOALA)}</span>`); onBurst(); },
    koala: () => commands.coala(),
  };
  commands.ajuda = commands.help;
  commands.projects = commands.projetos;

  const run = (raw) => {
    const line = raw.trim();
    print(`<span class="acc">visitante@devkoala:~$</span> <span class="cmd">${esc(line)}</span>`);
    if (!line) return;
    history.push(line);
    hIdx = history.length;
    const [cmd, ...rest] = line.split(/\s+/);
    const fn = commands[cmd.toLowerCase()];
    if (fn) fn(rest.join(' '));
    else print(`comando não encontrado: ${esc(cmd)}. digite <span class="acc">help</span>.`, 'err');
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    run(input.value);
    input.value = '';
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && hIdx > 0) { input.value = history[--hIdx]; e.preventDefault(); }
    if (e.key === 'ArrowDown') { hIdx = Math.min(history.length, hIdx + 1); input.value = history[hIdx] || ''; e.preventDefault(); }
    if (e.key === 'Tab') {
      e.preventDefault();
      const m = Object.keys(commands).filter((c) => c.startsWith(input.value.toLowerCase()));
      if (m.length === 1) input.value = m[0] + ' ';
    }
  });

  let greeted = false;
  const open = () => {
    lastFocus = document.activeElement;
    root.hidden = false;
    if (!greeted) {
      greeted = true;
      print('devkoala shell v1.0 · digite <span class="acc">help</span> para começar.');
    }
    setTimeout(() => input.focus(), 30);
  };
  const close = () => {
    root.hidden = true;
    lastFocus?.focus?.();
  };
  const toggle = () => (root.hidden ? open() : close());

  root.addEventListener('mousedown', (e) => { if (e.target === root) close(); });
  document.getElementById('closeTerm').addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); toggle(); }
    else if (e.key === 'Escape' && !root.hidden) close();
    else if (e.key === '`' && root.hidden && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); open(); }
  });

  return { open, close, toggle, isOpen: () => !root.hidden };
}
