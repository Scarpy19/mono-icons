import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const svgDir = path.join(here, "mono-icons-master", "svg");

const files = (await readdir(svgDir)).filter((file) => file.endsWith(".svg")).sort();

const icons = await Promise.all(
  files.map(async (file) => {
    const name = file.replace(/\.svg$/, "");
    const raw = (await readFile(path.join(svgDir, file), "utf8")).trim();
    const svg = raw.replace(/fill="#0D0D0D"/g, 'fill="currentColor"');
    return { name, svg };
  }),
);

const template = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mono Icons</title>
<meta name="description" content="Explora y copia los iconos de Mono Icons como SVG inline o webfont.">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' rx='6' fill='%23101012'/%3E%3Cpath d='M12 5a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H6a1 1 0 1 1 0-2h5V6a1 1 0 0 1 1-1z' fill='%23ededf0'/%3E%3C/svg%3E">
<style>
  :root {
    color-scheme: dark;
    --bg: #0a0a0b;
    --panel: #101012;
    --panel-hover: #16161a;
    --border: #1d1d21;
    --border-hover: #2c2c33;
    --text: #ededf0;
    --muted: #77777f;
    --muted-hover: #b6b6bd;
    --icon-color: #ededf0;
    --icon-size: 26px;
  }

  * { box-sizing: border-box; }
  html, body { margin: 0; }

  body {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg);
    color: var(--text);
    font-family: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  body::before {
    content: "";
    position: fixed;
    inset: 0 0 auto 0;
    height: 340px;
    background: radial-gradient(540px 220px at 50% -90px, rgba(255, 255, 255, .055), transparent 70%);
    pointer-events: none;
  }

  ::selection { background: rgba(255, 255, 255, .18); }

  /* Header */
  header {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 14px 24px;
    background: rgba(10, 10, 11, .78);
    border-bottom: 1px solid var(--border);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
  }

  .brand { display: flex; align-items: center; gap: 11px; flex: none; }

  .mark {
    display: grid;
    grid-template-columns: repeat(2, 5px);
    gap: 2px;
  }
  .mark span {
    width: 5px;
    height: 5px;
    border-radius: 1.5px;
    background: var(--text);
  }
  .mark span:last-child { opacity: .35; }

  .brand-name { font-size: 14px; font-weight: 600; letter-spacing: .01em; line-height: 1.15; }
  .brand-count { margin-top: 2px; font-size: 11px; color: var(--muted); }

  .search { position: relative; flex: 1 1 auto; max-width: 380px; margin-left: auto; }
  .search > svg {
    position: absolute;
    left: 11px;
    top: 50%;
    width: 15px;
    height: 15px;
    transform: translateY(-50%);
    color: var(--muted);
    pointer-events: none;
  }
  .search input {
    width: 100%;
    height: 36px;
    padding: 0 44px 0 34px;
    background: var(--panel);
    color: var(--text);
    border: 1px solid var(--border);
    border-radius: 10px;
    font: inherit;
    font-size: 13px;
    outline: none;
    transition: border-color .15s, background .15s, box-shadow .15s;
  }
  .search input::placeholder { color: #5f5f66; }
  .search input::-webkit-search-cancel-button { -webkit-appearance: none; appearance: none; }
  .search input:focus {
    border-color: #3a3a42;
    background: #121215;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, .045);
  }
  .search kbd {
    position: absolute;
    right: 9px;
    top: 50%;
    transform: translateY(-50%);
    padding: 2px 5px;
    font: inherit;
    font-size: 10px;
    color: #66666d;
    background: #0c0c0e;
    border: 1px solid var(--border);
    border-radius: 5px;
    pointer-events: none;
  }

  .segmented {
    display: flex;
    flex: none;
    padding: 3px;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 10px;
  }
  .segmented button {
    appearance: none;
    padding: 6px 10px;
    border: 0;
    border-radius: 7px;
    background: transparent;
    color: var(--muted);
    font: inherit;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: .05em;
    text-transform: uppercase;
    cursor: pointer;
    transition: color .15s, background .15s;
  }
  .segmented button:hover { color: var(--text); }
  .segmented button.active { background: #26262c; color: var(--text); }

  .repo-link {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    flex: none;
    color: var(--muted);
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 10px;
    transition: color .15s, background .15s, border-color .15s;
  }
  .repo-link:hover {
    color: var(--text);
    background: var(--panel-hover);
    border-color: var(--border-hover);
  }
  .repo-link svg { width: 17px; height: 17px; }

  /* Grid */
  main {
    width: 100%;
    max-width: 1180px;
    margin: 0 auto;
    padding: 24px;
    flex: 1;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(94px, 1fr));
    gap: 10px;
  }

  .card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    aspect-ratio: 1;
    padding: 12px 8px;
    background: var(--panel);
    color: var(--text);
    border: 1px solid var(--border);
    border-radius: 12px;
    font: inherit;
    cursor: pointer;
    overflow: hidden;
    transition: background .15s, border-color .15s, transform .15s;
  }
  .card:hover {
    background: var(--panel-hover);
    border-color: var(--border-hover);
    transform: translateY(-1px);
  }
  .card:active { transform: translateY(0) scale(.98); }
  .card:focus-visible { outline: 2px solid #5b5b66; outline-offset: 2px; }
  .card[hidden] { display: none; }

  .card svg { width: var(--icon-size); height: var(--icon-size); flex: none; color: var(--icon-color); }
  .card .glyph { display: flex; }

  .card .copy {
    position: absolute;
    top: 7px;
    right: 7px;
    display: grid;
    place-items: center;
    width: 18px;
    height: 18px;
    border-radius: 5px;
    background: #202025;
    color: #b9b9c0;
    opacity: 0;
    transform: scale(.9);
    transition: opacity .15s, transform .15s;
    pointer-events: none;
  }
  .card:hover .copy,
  .card:focus-visible .copy { opacity: 1; transform: scale(1); }
  .card .copy svg { width: 10px; height: 10px; }

  .card .name {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 11px;
    line-height: 1;
    color: var(--muted);
    transition: color .15s;
  }
  .card:hover .name { color: var(--muted-hover); }

  .card.copied { border-color: #4a4a54; background: #19191d; }
  .card.copied .name { color: var(--text); }
  .card.copied svg { animation: pop .45s ease; }

  @keyframes pop {
    0% { transform: scale(1); }
    40% { transform: scale(.9); }
    100% { transform: scale(1); }
  }

  /* Toolbar */
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px 16px;
    margin-bottom: 18px;
  }
  .toolbar .control {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--muted);
  }
  .toolbar .control span { white-space: nowrap; }
  .toolbar input[type="color"] {
    width: 30px;
    height: 28px;
    padding: 2px;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 7px;
    cursor: pointer;
  }
  .tool-btn {
    appearance: none;
    padding: 7px 12px;
    background: var(--panel);
    color: var(--text);
    border: 1px solid var(--border);
    border-radius: 9px;
    font: inherit;
    font-size: 12px;
    cursor: pointer;
    transition: background .15s, border-color .15s;
  }
  .tool-btn:hover { background: var(--panel-hover); border-color: var(--border-hover); }

  /* Layout */
  .layout {
    display: flex;
    gap: 24px;
    align-items: flex-start;
  }
  .content { flex: 1 1 auto; min-width: 0; }

  /* Panel */
  .panel {
    width: 320px;
    flex: 0 0 320px;
    position: sticky;
    top: 84px;
    align-self: flex-start;
    max-height: calc(100vh - 100px);
    overflow: auto;
    padding: 16px;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 14px;
  }
  .panel-name {
    display: block;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .panel-preview {
    display: grid;
    place-items: center;
    min-height: 88px;
    margin-bottom: 12px;
    background: #0c0c0e;
    border: 1px solid var(--border);
    border-radius: 10px;
  }
  .panel-preview svg { width: 48px; height: 48px; color: var(--icon-color); }
  .panel-code {
    margin: 0 0 12px;
    padding: 10px;
    max-height: 220px;
    overflow: auto;
    background: #0c0c0e;
    border: 1px solid var(--border);
    border-radius: 10px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 11px;
    line-height: 1.45;
    color: #c9c9d0;
    white-space: pre-wrap;
    word-break: break-all;
  }
  .panel-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .panel-actions button {
    appearance: none;
    flex: 1 1 0;
    min-width: 90px;
    padding: 7px 10px;
    background: #26262c;
    color: var(--text);
    border: 1px solid #33333a;
    border-radius: 8px;
    font: inherit;
    font-size: 11px;
    cursor: pointer;
    transition: background .15s, border-color .15s;
  }
  .panel-actions button:hover { background: #303038; border-color: #44444d; }

  /* Empty state */
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 72px 16px;
    color: var(--muted);
    text-align: center;
  }
  .empty[hidden] { display: none; }
  .empty p { margin: 0; font-size: 13px; }
  .empty button {
    appearance: none;
    padding: 8px 14px;
    background: var(--panel);
    color: var(--text);
    border: 1px solid var(--border);
    border-radius: 9px;
    font: inherit;
    font-size: 12px;
    cursor: pointer;
    transition: background .15s, border-color .15s;
  }
  .empty button:hover { background: var(--panel-hover); border-color: var(--border-hover); }

  /* Footer */
  footer {
    padding: 20px 24px 28px;
    font-size: 11px;
    color: #5f5f66;
    text-align: center;
  }
  footer a { color: #8a8a92; text-decoration: none; }
  footer a:hover { color: var(--text); }
  footer .dot { padding: 0 6px; color: #3a3a40; }
  footer code {
    padding: 1px 5px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 10px;
    color: #9a9aa2;
    background: #131316;
    border: 1px solid #1e1e22;
    border-radius: 4px;
  }

  /* Toast */
  .toast {
    position: fixed;
    left: 50%;
    bottom: 26px;
    z-index: 20;
    padding: 9px 16px;
    background: #18181c;
    color: var(--text);
    border: 1px solid #2c2c33;
    border-radius: 999px;
    box-shadow: 0 10px 34px rgba(0, 0, 0, .55);
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    transform: translate(-50%, 10px);
    pointer-events: none;
    transition: opacity .18s ease, transform .18s ease;
  }
  .toast.show { opacity: 1; transform: translate(-50%, 0); }

  @media (max-width: 700px) {
    header { flex-wrap: wrap; gap: 12px; padding: 12px 16px; }
    .search { order: 3; flex-basis: 100%; max-width: none; margin-left: 0; }
    .segmented { margin-left: auto; }
    .repo-link { margin-left: 0; }
    main { padding: 16px; }
    .layout { flex-direction: column; gap: 16px; }
    .panel { width: 100%; flex: 1 1 auto; position: static; max-height: none; }
    .grid { grid-template-columns: repeat(auto-fill, minmax(82px, 1fr)); gap: 8px; }
    .card { gap: 8px; }
    .card svg { width: min(var(--icon-size), 23px); height: min(var(--icon-size), 23px); }
    .toolbar { gap: 10px 12px; }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation: none !important; transition: none !important; }
  }
</style>
</head>
<body>
<header>
  <div class="brand">
    <span class="mark" aria-hidden="true"><span></span><span></span><span></span><span></span></span>
    <div>
      <div class="brand-name">Mono Icons</div>
      <div class="brand-count" id="count"></div>
    </div>
  </div>

  <div class="search">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7"></circle>
      <path d="m20 20-3.5-3.5"></path>
    </svg>
    <input id="search" type="search" placeholder="Buscar icono..." autocomplete="off" spellcheck="false" aria-label="Buscar icono">
    <kbd>/</kbd>
  </div>

  <div class="segmented" role="group" aria-label="Formato de copiado">
    <button type="button" data-mode="svg" title="Copiar SVG inline">SVG</button>
    <button type="button" data-mode="font" title="Copiar etiqueta de webfont">Webfont</button>
  </div>

  <a class="repo-link" href="https://github.com/Scarpy19/mono-icons" target="_blank" rel="noreferrer" title="Repositorio en GitHub" aria-label="Repositorio en GitHub">
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.6-1.3-1.6-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/>
    </svg>
  </a>
</header>

<main>
  <div class="toolbar">
    <label class="control">
      <input type="checkbox" id="colorToggle" aria-label="Usar color personalizado">
      <span>Color</span>
    </label>
    <input type="color" id="color" value="#ededf0" disabled aria-label="Color de previsualizacion">
    <div class="control">
      <span>Tamano</span>
      <div class="segmented" id="sizes" role="group" aria-label="Tamano de icono">
        <button type="button" data-size="16">16</button>
        <button type="button" data-size="24" class="active">24</button>
        <button type="button" data-size="32">32</button>
      </div>
    </div>
    <button type="button" class="tool-btn" id="copyAll">Copiar todos (JSON)</button>
  </div>

  <div class="layout">
    <div class="content">
      <div class="grid" id="grid"></div>
      <div class="empty" id="empty" hidden>
        <p>No se encontraron iconos.</p>
        <button type="button" id="clear">Limpiar busqueda</button>
      </div>
    </div>

    <aside class="panel" id="panel" aria-label="Codigo del icono seleccionado">
      <span class="panel-name" id="panelName">Selecciona un icono</span>
      <div class="panel-preview" id="panelPreview"></div>
      <pre class="panel-code"><code id="panelCode">// Haz clic en un icono</code></pre>
      <div class="panel-actions">
        <button type="button" id="panelCopySvg">Copiar SVG</button>
        <button type="button" id="panelCopyFont">Copiar webfont</button>
        <button type="button" id="panelDownload">Descargar SVG</button>
      </div>
    </aside>
  </div>
</main>

<footer>
  <a href="https://icons.mono.company/" target="_blank" rel="noreferrer">Mono Icons</a>
  <span class="dot">/</span> MIT
  <span class="dot">/</span> <a href="https://github.com/Scarpy19/mono-icons" target="_blank" rel="noreferrer">este repo</a>
  <span class="dot">/</span> <a href="https://github.com/mono-company/mono-icons" target="_blank" rel="noreferrer">repo original</a>
  <span class="dot">/</span> hecho por IA dirigida por Scarpy19
  <span class="dot">/</span> clic en un icono para copiar
  <span class="dot">/</span> SVG con <code>currentColor</code>
  <span class="dot">/</span> webfont requiere <code>icons.css</code>
</footer>

<div class="toast" id="toast" role="status" aria-live="polite"></div>

<script>
(function () {
  var ICONS = __ICON_DATA__;

  var grid = document.getElementById("grid");
  var search = document.getElementById("search");
  var count = document.getElementById("count");
  var empty = document.getElementById("empty");
  var toast = document.getElementById("toast");
  var toastTimer;
  var mode = "svg";

  try {
    var saved = localStorage.getItem("mono-icons-copy-mode");
    if (saved === "svg" || saved === "font") mode = saved;
  } catch (e) {}

  var modeButtons = Array.prototype.slice.call(document.querySelectorAll(".segmented button[data-mode]"));

  function setMode(next) {
    mode = next;
    modeButtons.forEach(function (button) {
      var active = button.dataset.mode === mode;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    try {
      localStorage.setItem("mono-icons-copy-mode", mode);
    } catch (e) {}
  }

  modeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setMode(button.dataset.mode);
    });
  });
  setMode(mode);

  // Color / size controls
  var colorInput = document.getElementById("color");
  var colorToggle = document.getElementById("colorToggle");
  var sizeButtons = Array.prototype.slice.call(document.querySelectorAll("#sizes button"));
  function setColor(value) {
    document.documentElement.style.setProperty("--icon-color", value);
  }
  function setSize(value) {
    document.documentElement.style.setProperty("--icon-size", value + "px");
    sizeButtons.forEach(function (b) {
      b.classList.toggle("active", b.dataset.size === String(value));
    });
  }
  function applyColor() {
    if (colorToggle && colorToggle.checked) {
      if (colorInput) colorInput.disabled = false;
      if (colorInput) setColor(colorInput.value);
    } else {
      if (colorInput) colorInput.disabled = true;
      setColor("currentColor");
    }
  }
  if (colorToggle) {
    colorToggle.addEventListener("change", applyColor);
  }
  if (colorInput) {
    colorInput.addEventListener("input", function () {
      if (colorToggle && colorToggle.checked) setColor(colorInput.value);
    });
  }
  applyColor();
  sizeButtons.forEach(function (b) {
    b.addEventListener("click", function () { setSize(b.dataset.size); });
  });
  setSize(24);

  // Build cards
  var fragment = document.createDocumentFragment();
  ICONS.forEach(function (icon, index) {
    var card = document.createElement("button");
    card.type = "button";
    card.className = "card";
    card.dataset.name = icon.name;
    card.dataset.index = String(index);
    card.title = "Copiar " + icon.name;
    card.setAttribute("aria-label", "Copiar " + icon.name);
    card.tabIndex = index === 0 ? 0 : -1;
    card.addEventListener("focus", function () {
      var idx = Number(card.dataset.index);
      if (!isNaN(idx)) focusedIndex = idx;
      selectIcon(card.dataset.name);
    });
    card.innerHTML =
      '<span class="glyph">' + icon.svg + "</span>" +
      '<span class="name">' + icon.name + "</span>" +
      '<span class="copy" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<rect x="9" y="9" width="12" height="12" rx="2"></rect>' +
          '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>' +
        "</svg>" +
      "</span>";
    fragment.appendChild(card);
  });
  grid.appendChild(fragment);

  var cards = Array.prototype.slice.call(grid.querySelectorAll(".card"));
  var focusedIndex = 0;

  function normalize(value) {
    return value.toLowerCase().replace(/[\\s_-]+/g, "");
  }

  function applyFilter() {
    var query = normalize(search.value);
    var visible = 0;
    for (var i = 0; i < cards.length; i++) {
      var match = !query || normalize(cards[i].dataset.name).indexOf(query) !== -1;
      cards[i].hidden = !match;
      if (match) visible++;
    }
    count.textContent = query ? visible + " de " + ICONS.length : ICONS.length + " iconos";
    empty.hidden = visible !== 0;
  }

  function fallbackCopy(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "-1000px";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (e) {}
    area.remove();
    return ok;
  }

  function copyText(text) {
    return new Promise(function (resolve) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () { resolve(true); },
          function () { resolve(fallbackCopy(text)); }
        );
      } else {
        resolve(fallbackCopy(text));
      }
    });
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 1800);
  }

  function findIcon(name) {
    for (var i = 0; i < ICONS.length; i++) {
      if (ICONS[i].name === name) return ICONS[i];
    }
    return null;
  }

  // Panel
  var panelName = document.getElementById("panelName");
  var panelPreview = document.getElementById("panelPreview");
  var panelCode = document.getElementById("panelCode");
  var panelCopySvg = document.getElementById("panelCopySvg");
  var panelCopyFont = document.getElementById("panelCopyFont");
  var panelDownload = document.getElementById("panelDownload");
  var selectedName = null;

  function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function selectIcon(name) {
    var icon = findIcon(name);
    if (!icon) return;
    selectedName = name;
    panelName.textContent = name;
    panelPreview.innerHTML = icon.svg;
    panelCode.innerHTML = escapeHtml(icon.svg);
    // Update roving tabindex focus without moving DOM focus
    try { history.replaceState(null, "", "#" + name); } catch (e) {}
  }

  function downloadSvg(icon) {
    var blob = new Blob([icon.svg], { type: "image/svg+xml" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = icon.name + ".svg";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  if (panelCopySvg) {
    panelCopySvg.addEventListener("click", function () {
      var icon = findIcon(selectedName);
      if (!icon) return;
      copyText(icon.svg).then(function (ok) {
        if (ok) showToast("SVG copiado / " + icon.name);
        else showToast("No se pudo copiar");
      });
    });
  }
  if (panelCopyFont) {
    panelCopyFont.addEventListener("click", function () {
      var icon = findIcon(selectedName);
      if (!icon) return;
      copyText('<i class="mi-' + icon.name + '"></i>').then(function (ok) {
        if (ok) showToast("Webfont copiado / mi-" + icon.name);
        else showToast("No se pudo copiar");
      });
    });
  }
  if (panelDownload) {
    panelDownload.addEventListener("click", function () {
      var icon = findIcon(selectedName);
      if (!icon) return;
      downloadSvg(icon);
      showToast("SVG descargado / " + icon.name);
    });
  }

  // Copy all as JSON
  var copyAllBtn = document.getElementById("copyAll");
  if (copyAllBtn) {
    copyAllBtn.addEventListener("click", function () {
      copyText(JSON.stringify(ICONS)).then(function (ok) {
        showToast(ok ? "JSON copiado (" + ICONS.length + " iconos)" : "No se pudo copiar");
      });
    });
  }

  function columnsCount() {
    var style = window.getComputedStyle(grid);
    var cols = style.gridTemplateColumns;
    if (!cols || cols === "none") return 1;
    return cols.split(" ").filter(Boolean).length || 1;
  }

  function focusCard(index) {
    if (index < 0 || index >= cards.length) return;
    var card = cards[index];
    if (card.hidden) return;
    // skip hidden
    cards[focusedIndex].tabIndex = -1;
    focusedIndex = index;
    card.tabIndex = 0;
    card.focus();
    selectIcon(card.dataset.name);
    try { card.scrollIntoView({ block: "nearest" }); } catch (e) {}
  }

  function nextVisible(from, delta) {
    var cols = columnsCount();
    var step = delta;
    if (delta === -1 || delta === 1) step = delta;
    else if (delta === -cols || delta === cols) step = delta;
    var i = from + step;
    // ensure not hidden
    while (i >= 0 && i < cards.length && cards[i].hidden) {
      i += (step > 0 ? 1 : -1);
    }
    if (i < 0 || i >= cards.length || cards[i].hidden) return from;
    return i;
  }

  grid.addEventListener("keydown", function (event) {
    var cols = columnsCount();
    var key = event.key;
    var ni = focusedIndex;
    if (key === "ArrowRight") ni = nextVisible(focusedIndex, 1);
    else if (key === "ArrowLeft") ni = nextVisible(focusedIndex, -1);
    else if (key === "ArrowDown") ni = nextVisible(focusedIndex, cols);
    else if (key === "ArrowUp") ni = nextVisible(focusedIndex, -cols);
    else if (key === "Home") ni = 0;
    else if (key === "End") ni = cards.length - 1;
    else return;
    if (ni !== focusedIndex) {
      event.preventDefault();
      focusCard(ni);
    }
  });

  grid.addEventListener("click", function (event) {
    var card = event.target.closest(".card");
    if (!card) return;

    var icon = null;
    for (var i = 0; i < ICONS.length; i++) {
      if (ICONS[i].name === card.dataset.name) {
        icon = ICONS[i];
        break;
      }
    }
    if (!icon) return;

    // update focus tracking
    var idx = Number(card.dataset.index);
    if (!isNaN(idx)) {
      cards[focusedIndex].tabIndex = -1;
      focusedIndex = idx;
      card.tabIndex = 0;
    }

    selectIcon(icon.name);

    var text = mode === "svg" ? icon.svg : '<i class="mi-' + icon.name + '"></i>';

    copyText(text).then(function (ok) {
      if (!ok) {
        showToast("No se pudo copiar");
        return;
      }
      card.classList.remove("copied");
      void card.offsetWidth;
      card.classList.add("copied");
      setTimeout(function () { card.classList.remove("copied"); }, 700);
      showToast(mode === "svg" ? "SVG copiado / " + icon.name : "Webfont copiado / mi-" + icon.name);
    });
  });

  search.addEventListener("input", applyFilter);

  document.getElementById("clear").addEventListener("click", function () {
    search.value = "";
    applyFilter();
    search.focus();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "/" && document.activeElement !== search) {
      event.preventDefault();
      search.focus();
      search.select();
    } else if (event.key === "Escape" && document.activeElement === search) {
      search.value = "";
      applyFilter();
      search.blur();
    }
  });

  // Hash link on load
  function openFromHash() {
    var name = (location.hash || "").replace(/^#/, "");
    if (!name) return;
    var idx = -1;
    for (var i = 0; i < cards.length; i++) {
      if (cards[i].dataset.name === name) { idx = i; break; }
    }
    if (idx >= 0) {
      focusCard(idx);
      try { cards[idx].scrollIntoView({ block: "center" }); } catch (e) {}
    }
  }

  applyFilter();
  openFromHash();
  if (!location.hash) {
    selectIcon(ICONS.length ? ICONS[0].name : null);
  }
})();
</script>
</body>
</html>
`;

const html = template.replace("__ICON_DATA__", JSON.stringify(icons));

await writeFile(path.join(here, "index.html"), html);
console.log("index.html generado con " + icons.length + " iconos.");
