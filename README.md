# taio11k.github.io

Personal profile and portfolio site for **Satria Wibawa Hadiwijaya**, graduate
electrical engineer working in control and instrumentation.

Live at <https://taio11k.github.io/>

## Stack

No framework, no build step, no dependencies. Plain HTML, CSS and JavaScript,
served straight from this repository by GitHub Pages.

```
index.html          the whole page
styles.css          design tokens, layout, interaction styles
assets/js/main.js   progressive enhancement (see below)
assets/fonts/       Archivo + IBM Plex Mono, self-hosted, latin subset
assets/img/         portrait, project figures, social card
assets/docs/        CV
```

## Design

"Field Notebook": light, editorial, print-inspired, deliberately not the
dark-and-monospace look most engineering portfolios default to.

| Token | Value | Role |
|---|---|---|
| `--paper` | `#FDFBF7` | page ground |
| `--paper-alt` | `#F5F3EE` | alternating section tint |
| `--ink` | `#1A1A1A` | headings and primary text |
| `--ink-muted` | `#5C5A55` | body and captions |
| `--rule` | `#DDD9D0` | hairlines |
| `--accent` | `#C43D20` | flags an out-of-range reading |

Type is **Archivo** for display and body, **IBM Plex Mono** for figures, dates
and labels. The scale interpolates with `clamp()` between 390px and 1440px
rather than stepping at breakpoints.

Projects are ordered by where they sit in the signal chain, Sense to Process to
Actuate to Verify, rather than by date. That mirrors the discipline the site is
about, and the chain strip doubles as a filter.

## JavaScript

`assets/js/main.js` is progressive enhancement only. With JS disabled the page
is fully readable and navigable; the chain filter simply presents as
information rather than a control. Each behaviour is an isolated function that
no-ops when its elements are absent, and one failing cannot take down the rest.

Scroll-driven behaviour uses `IntersectionObserver` throughout, never a scroll
listener. Everything honours `prefers-reduced-motion`.

## Accessibility

Every colour pair meets WCAG AA: body text 16.8:1, muted text 6.7:1, accent
links 5.0:1. Single `h1`, no skipped heading levels, full landmark structure,
alt text on every image, 44px minimum touch targets, visible focus rings, and a
skip link.

## Licence

Code is free to borrow. The written content, CV, photograph and project figures
are not.
