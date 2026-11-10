# Mono Icons — visor y copiador

Página web minimalista (dark) para **ver y copiar** los iconos de [Mono Icons](https://icons.mono.company/).

- 180 iconos en cuadrícula, búsqueda instantánea (atajo `/`).
- Clic en un icono para copiar su SVG inline (`fill="currentColor"`).
- Selector **SVG / Webfont**: SVG copia `<svg>…</svg>`; Webfont copia `<i class="mi-nombre"></i>`.
- Todo autocontenido en `index.html`: funciona sin servidor ni conexión.

## Uso

### Como SVG inline

Pega el SVG copiado directamente en tu HTML. Usa `currentColor` para heredar el color del texto:

```html
<span style="color: #fff">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="…" fill="currentColor"/>
  </svg>
</span>
```

### Como webfont

Incluye la hoja de estilos de Mono Icons y usa la clase `mi-<nombre>`:

```html
<link href="https://unpkg.com/mono-icons@1.3.1/iconfont/icons.css" rel="stylesheet">
<i class="mi-add"></i>
```

La hoja de estilos está en `mono-icons-master/iconfont/icons.css` (o en el CDN indicado arriba).

## Iconos originales

Este proyecto es un visor/copiador basado en el set de iconos **Mono Icons** de [Mono Company](https://icons.mono.company/).

- Repositorio original: https://github.com/mono-company/mono-icons
- Licencia de los iconos: MIT

## Desarrollo

Regenerar `index.html` tras cambiar SVGs o la plantilla:

```bash
node build.mjs
```

El workflow de GitHub Actions (`.github/workflows/build.yml`) ejecuta este comando automáticamente cuando cambian los SVGs o `build.mjs`, y publica el resultado en GitHub Pages.
