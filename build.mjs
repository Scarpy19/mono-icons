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

  .card svg { width: 26px; height: 26px; flex: none; }
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
    main { padding: 16px; }
    .grid { grid-template-columns: repeat(auto-fill, minmax(82px, 1fr)); gap: 8px; }
    .card { gap: 8px; }
    .card svg { width: 23px; height: 23px; }
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
</header>

<main>
  <div class="grid" id="grid"></div>
  <div class="empty" id="empty" hidden>
    <p>No se encontraron iconos.</p>
    <button type="button" id="clear">Limpiar busqueda</button>
  </div>
</main>

<footer>
  <a href="https://icons.mono.company/" target="_blank" rel="noreferrer">Mono Icons</a>
  <span class="dot">/</span> MIT
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

  var modeButtons = Array.prototype.slice.call(document.querySelectorAll(".segmented button"));

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

  var fragment = document.createDocumentFragment();
  ICONS.forEach(function (icon) {
    var card = document.createElement("button");
    card.type = "button";
    card.className = "card";
    card.dataset.name = icon.name;
    card.title = "Copiar " + icon.name;
    card.setAttribute("aria-label", "Copiar " + icon.name);
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

  function normalize(value) {
    return value.toLowerCase().replace(/[\\s_-]+/g, "");
  }

  function applyFilter() {
    var query = normalize(search.value);
    var cards = grid.children;
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

  applyFilter();
})();
</script>
</body>
</html>
`;

const html = template.replace("__ICON_DATA__", JSON.stringify(icons));

await writeFile(path.join(here, "index.html"), html);
console.log("index.html generado con " + icons.length + " iconos.");
