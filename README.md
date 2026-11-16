# Longchamp CRM Mobile — Solution Design

Solution design for the **Longchamp Indonesia clienteling mobile app** (Cekat × Longchamp), based on the Longchamp APAC CX Discussion deck (Sep 2026) and the Cekat Open API.

Built with **React 19 + Vite + Tailwind CSS v4 + [HeroUI v3](https://heroui.com/)**.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static build in dist/ (relative paths, works on GitHub Pages)
```

## What's inside

| Page | Status |
|---|---|
| Use Case diagram | ✅ v0.1 |
| Sequence diagram | planned |
| Data flow diagram | planned |
| ERD | planned |
| App mockup (HeroUI) | planned |

### Use Case diagram

- 3 actors (Sales Associate, Store Manager ⊂ SA, CRM/CX Admin), 20 use cases in the 4 app modules from the deck (Customer Search, Customer Lists, Actions, Product Catalog) plus Performance & Admin.
- Every use case carries its **data sources**: webhook events (Shopify, Odoo POS, Cekat), Cekat CRM API calls, n8n workflows/schedulers and mobile push.
- Click a use case / actor / system to see its connections and sources; EN/ID toggle; SVG export.
- **Data Source Matrix** table + assumptions & open items.

## Editing the model

All diagram content lives in [`src/data/useCases.js`](src/data/useCases.js) — actors, systems, modules, use cases, sources, include/extend relations and notes. The layout is computed automatically (`src/components/diagram/layout.js`), so adding a use case is a data change only.

Source `status` values:

- `confirmed` — listed in the Cekat docs (or standard Shopify/Odoo)
- `confirm` — capability exists, exact endpoint/payload to confirm with Cekat
- `internal` — designed in this project (n8n workflow, app logic)

## Structure

```
src/
  data/useCases.js              single source of truth
  components/diagram/layout.js  coordinates for nodes & edges
  components/diagram/UseCaseSvg.jsx
  components/DetailPanel.jsx    HeroUI Card / Chip
  components/DataSourceMatrix.jsx  HeroUI Table
  pages/UseCasePage.jsx
  i18n.js                       EN / ID strings
```
