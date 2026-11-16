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
| Use Case diagram + RBAC matrix + Cekat Product backlog | ✅ v0.2 |
| Activity diagrams (5 flows, swimlanes per implementor) | ✅ v0.2 |
| Solution architecture (Cekat CRM as database) | ✅ v0.2 |
| ERD + field-level data dictionary (CSV export, JSON samples) | ✅ v0.2 |
| Sequence diagrams (6 flows, request/response variables, endpoint inventory) | ✅ v0.2 |
| App mockup (HeroUI) — login, account activation, 3 roles, prototype + gallery; longchamp.co.id look, bottom tab bar | ✅ v0.3 |
| API & TOR — tech stack, components per party (Vendor / Cekat IT Delivery / Cekat Product), 55 endpoints with logic, variables, filters, responses; webhooks & n8n jobs | ✅ |
| PDF coverage — every deck capability → mockup screen + UC / AD / SD, plus RACI | ✅ |

### Roles

| Role | Cekat CRM role | Scope |
|---|---|---|
| Super Admin | Super Admin (Administrator) | All boutiques, read-only on clients; templates, push rules, users |
| Supervisor | Supervisor – {Boutique} | All clients of the boutique team; team KPI; reassign clients |
| Sales Agent | Sales Agent – {Boutique} | Own + unassigned clients |

Registration is invitation-based: the Super Admin invites staff in Cekat CRM, staff activate the account in the app (Cekat Product, CP-01).

### Implementors (Cekat side)

- **Cekat IT Dev** — builds with what is in the Cekat API docs (Contact, Board, Message, Broadcast, Tickets, Webhooks) plus the n8n workflows, the Backend API (BFF) and the mobile app.
- **Cekat Product** — owns **login, users and RBAC** end to end (the BFF only forwards the Cekat user token; IT Dev builds no auth or scope logic), and builds everything else **not** in the docs: `CP-01` app sign-in, `CP-02` role-scoped API, `CP-03` Users & Role Hierarchy API, `CP-04` server-side item filter, `CP-05` board item webhook, `CP-06` recipient-level message status. See `src/data/cekatProduct.js`.

### Architecture in one line

Mobile app (HeroUI) → Backend API (BFF, forwards the Cekat user token) → Cekat CRM (the database); login and RBAC enforced by Cekat Product. Shopify, Odoo and Cekat webhooks → n8n → Cekat CRM.

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
  data/useCases.js              use cases, sources, RBAC (single source of truth)
  data/activities.js            activity diagrams (lanes, nodes, edges)
  data/architecture.js          architecture components, interfaces, data ownership
  data/cekatProduct.js          implementors + Cekat Product backlog
  data/sequences.js             sequence diagrams with payload variables
  data/erd.js                   entities → Cekat Contacts / Boards / Tickets, every field
  components/diagram/layout.js  coordinates for nodes & edges
  components/diagram/UseCaseSvg.jsx
  components/DetailPanel.jsx    HeroUI Card / Chip
  components/DataSourceMatrix.jsx  HeroUI Table
  pages/UseCasePage.jsx
  mockup/                       HeroUI app mockup (data, screens, MockApp shell)
  data/coverage.js              PDF capability coverage + RACI
  data/apiSpec.js               Clienteling API spec (Go) — endpoints, conventions, webhooks, jobs
  data/components.js            Components per party + tech stack
  i18n.js                       EN / ID strings
```
