# Graph Report - longchamp-crm-mobile  (2026-11-17)

## Corpus Check
- 51 files · ~71,669 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 3, .css 1)

## Summary
- 392 nodes · 1082 edges · 19 communities (17 shown, 2 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 34 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `98712641`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- UseCasePage.jsx
- workplan.js
- Work.jsx
- apiSpec.js
- screens.js
- ErdPage.jsx
- Clients.jsx
- Icon
- UseCasePage.jsx
- WorkplanPage.jsx
- Longchamp CRM Mobile — Solution Design
- core.jsx
- CLAUDE.md
- .claude/CLAUDE.md
- ApiPage.jsx
- ActivityPage.jsx
- CoveragePage.jsx
- Home.jsx
- Product

## God Nodes (most connected - your core abstractions)
1. `useApp()` - 57 edges
2. `AppBar()` - 35 edges
3. `Body()` - 31 edges
4. `@heroui/react` - 23 edges
5. `react` - 23 edges
6. `Icon()` - 20 edges
7. `OwnerChip()` - 18 edges
8. `SectionTitle()` - 18 edges
9. `ClientProfile()` - 17 edges
10. `Tile()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `ApiPage()`  [EXTRACTED]
  src/App.jsx → src/pages/ApiPage.jsx
- `App()` --calls--> `CoveragePage()`  [EXTRACTED]
  src/App.jsx → src/pages/CoveragePage.jsx
- `App()` --calls--> `ErdPage()`  [EXTRACTED]
  src/App.jsx → src/pages/ErdPage.jsx
- `App()` --calls--> `UseCasePage()`  [EXTRACTED]
  src/App.jsx → src/pages/UseCasePage.jsx
- `App()` --calls--> `WorkplanPage()`  [EXTRACTED]
  src/App.jsx → src/pages/WorkplanPage.jsx

## Import Cycles
- None detected.

## Communities (19 total, 2 thin omitted)

### Community 0 - "UseCasePage.jsx"
Cohesion: 0.06
Nodes (50): react, App(), Header(), NAV, AD, box(), layoutActivity(), wrap() (+42 more)

### Community 1 - "workplan.js"
Cohesion: 0.13
Nodes (16): apiRows, appRows, flatten(), GROUP, NATIVE, numbered(), pad(), ROLE (+8 more)

### Community 2 - "Work.jsx"
Cohesion: 0.12
Nodes (26): AGENDA, BOUTIQUES, BY_BOUTIQUE, BY_CHANNEL, CLIENT_WISHLIST, CLIENTS, KPI, PRODUCTS (+18 more)

### Community 3 - "apiSpec.js"
Cohesion: 0.14
Nodes (10): ALL, API_GROUPS, CONVENTIONS, ENDPOINTS, FIELD, JOBS, LEAD, WEBHOOKS (+2 more)

### Community 4 - "screens.js"
Cohesion: 0.24
Nodes (22): AppBar(), Body(), Initials(), SectionTitle(), Stat(), Tile(), ALL, ListBuilder() (+14 more)

### Community 5 - "ErdPage.jsx"
Cohesion: 0.12
Nodes (20): ERD, layoutErd(), visibleFields(), DOMAIN_COLOR, ErdSvg, KEY_COLOR, DOMAINS, entities (+12 more)

### Community 6 - "Clients.jsx"
Cohesion: 0.14
Nodes (24): ContactBar(), Row(), LISTS, LOVE_TAGS, loveLabel(), REACH_REASONS, tag(), trackLabel() (+16 more)

### Community 7 - "Icon"
Cohesion: 0.38
Nodes (9): Icon(), Pill(), Field(), Preview(), STATUS, StatusTag(), TemplateNew(), Templates() (+1 more)

### Community 8 - "UseCasePage.jsx"
Cohesion: 0.16
Nodes (25): @heroui/react, DataSourceMatrix(), DetailPanel(), SourceRow(), computeLayout(), DIM, relatedSet(), SOURCE_COLORS (+17 more)

### Community 9 - "WorkplanPage.jsx"
Cohesion: 0.12
Nodes (13): componentRows, jobRows, PARTY_LABEL, PARTY_ORDER, variableRows, writeRows, downloadCsv(), lbl() (+5 more)

### Community 10 - "Longchamp CRM Mobile — Solution Design"
Cohesion: 0.18
Nodes (10): Architecture in one line, Editing the model, Implementors (Cekat side), Knowledge graph (graphify), Longchamp CRM Mobile — Solution Design, Roles, Run, Structure (+2 more)

### Community 11 - "core.jsx"
Cohesion: 0.14
Nodes (25): Announcement(), BlackTile(), BoutiqueArt(), Ctx, FullBody(), Hero(), MoreSheet(), P (+17 more)

### Community 14 - "ApiPage.jsx"
Cohesion: 0.23
Nodes (11): COMPONENTS, PARTIES, TECH_STACK, ApiPage(), EndpointDetail(), METHOD_COLOR, PARTY_COLOR, ROLE_SHORT (+3 more)

### Community 15 - "ActivityPage.jsx"
Cohesion: 0.10
Nodes (26): dependencies, @heroui/react@^3.2.7, @heroui/styles@^3.2.7, react@^19.3.1, react-dom@^19.3.1, react-router-dom@^7.18.5, devDependencies, tailwindcss@^4.3.5 (+18 more)

### Community 16 - "CoveragePage.jsx"
Cohesion: 0.24
Nodes (9): AREAS, COVERAGE, RACI, RACI_PARTIES, SCREENS, CoveragePage(), RACI_STYLE, Refs() (+1 more)

### Community 17 - "Home.jsx"
Cohesion: 0.31
Nodes (10): LcButton(), TierBadge(), idrShort(), Attendance(), ListDetail(), Hello(), Home(), PushRow() (+2 more)

### Community 19 - "Product"
Cohesion: 0.31
Nodes (14): BagArt(), useApp(), idr(), ClientRow(), ClientSearch(), visibleClients(), addToClientWishlist(), Catalog() (+6 more)

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `UseCasePage.jsx` to `Work.jsx`, `ErdPage.jsx`, `Clients.jsx`, `Icon`, `UseCasePage.jsx`, `WorkplanPage.jsx`, `core.jsx`, `ApiPage.jsx`, `ActivityPage.jsx`?**
  _High betweenness centrality (0.284) - this node is a cross-community bridge._
- **Should `UseCasePage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06012176560121765 - nodes in this community are weakly interconnected._
- **Why does `@heroui/react` connect `UseCasePage.jsx` to `UseCasePage.jsx`, `Work.jsx`, `ErdPage.jsx`, `Clients.jsx`, `Icon`, `WorkplanPage.jsx`, `core.jsx`, `ApiPage.jsx`, `ActivityPage.jsx`, `CoveragePage.jsx`, `Home.jsx`?**
  _High betweenness centrality (0.226) - this node is a cross-community bridge._
- **Should `workplan.js` be split into smaller, more focused modules?**
  _Cohesion score 0.13157894736842105 - nodes in this community are weakly interconnected._
- **Should `Work.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12169312169312169 - nodes in this community are weakly interconnected._
- **Should `apiSpec.js` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `ErdPage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12333333333333334 - nodes in this community are weakly interconnected._