# devkoala.com

Meu portfólio: [devkoala.com](https://devkoala.com).

Partículas em WebGL com shader escrito à mão (um coala que vira esfera, anel, terreno, rede e galáxia conforme a rolagem), cada projeto com a sua própria animação e um terminal escondido. Aperte <kbd>⌘K</kbd> no site e digite `help`.

## Stack

- [Vite](https://vite.dev) e JavaScript puro
- [Three.js](https://threejs.org) para as partículas e o visualizador 3D
- [GSAP](https://gsap.com) + ScrollTrigger e [Lenis](https://lenis.darkroom.engineering) para o scroll
- [Lucide](https://lucide.dev) para os ícones

## Rodando

```bash
npm install
npm run dev
```

Os modelos 3D das motos (`public/models/*.glb`) vêm do [Favela League](https://favelaleague.devkoala.com) e não estão no repositório. Sem eles o site funciona, só o visualizador da moto fica vazio.

## Deploy

O site é estático e roda no meu servidor (Oracle Cloud ARM) atrás do Caddy:

```bash
npm run deploy   # build + rsync para /var/www/devkoala
```
