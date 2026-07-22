# Digifolk Web

Vue 3 + Vite implementation of 8 screens from the
[Digifolk Web Figma file](https://www.figma.com/design/xKL3ZVIP8qCgothVFxhNwg/Digifolk-Web).

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
```

## Pages / routes

| Route | Screen | Figma node |
|-------|--------|------------|
| `/` | Home / main page (hero banner) | `332-476` (Página Main-2) |
| `/scientific-materials` | Scientific Materials (card grid) | `488-1486` |
| `/educational-materials` | Educational Materials (card grid) | `282-655` |
| `/visualisations` | Visualisations (3D plot cards) | `99-177` |
| `/contribute` | Contribute (Upload form + overlays) | `114-209`, overlays `444-1313` / `483-1596` / `541-1565` |
| `/about` | About — EA DigiFolk | `129-430` |
| `/login` | Login | `257-329` |
| `/scientific-materials/:id` | Scientific project detail | `480-1288` |
| `/educational-materials/:id` | Educational material detail | `343-605` |

## Interactions

- Navbar links route between pages; the active link shows the squiggle underline. **LOGIN** → `/login`, logo → `/`.
- Material cards: title and **More Info** open the detail page.
- Detail pages and About use a back arrow.
- **Contribute**: the **Rights** field opens a custom dropdown overlay; the forward
  arrow opens the **Contributor** overlay modal (Contributor / Role / Gender /
  Description → SUBMIT) over a dimmed backdrop.
- Login **SIGN IN** returns to the home page.

## Structure

- `src/components/` — shared UI: `TheNavbar`, `BottomBar`, `SquiggleLine`,
  `PillButton`, `MaterialCard`, `ArrowButton`, `BrandLogo`.
- `src/views/` — one component per screen.
- `src/assets/` — images/SVGs exported from Figma (`images.js` re-exports the
  raster assets used by the About and Visualisations pages).
- `src/data/materials.js` — sample content shared by list + detail pages.

## Design tokens (`src/style.css`)

`--green #41823e` · `--purple #6853bd` · `--red #b54c4c` ·
`--color-gray #d8d8d8` · `--fill-background #faf9f6`

Fonts (Google Fonts): **Archivo** (headings, nav, buttons), **Roboto Mono**
(authors, form fields, Visualisations title), **Josefin Slab** (body copy).

## Layout & scroll

The navbar (top) and social bar (bottom) are `position: fixed`; page content
scrolls underneath them. Long pages (About, Visualisations, the card grids and
the detail pages) scroll vertically; short pages (Contribute, Media) center
their content in the viewport.
