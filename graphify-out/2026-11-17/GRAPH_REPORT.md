# Graph Report - longchamp-crm-mobile  (2026-11-17)

## Corpus Check
- 49 files · ~68,357 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 3, .css 1)

## Summary
- 353 nodes · 1011 edges · 17 communities (15 shown, 2 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 30 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `527f5c2a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- UseCasePage.jsx
- CoveragePage.jsx
- Work.jsx
- ApiPage.jsx
- screens.js
- ErdPage.jsx
- Clients.jsx
- Icon
- UseCaseSvg.jsx
- useApp
- Longchamp CRM Mobile — Solution Design
- core.jsx
- CLAUDE.md
- .claude/CLAUDE.md
- ActivitySvg.jsx
- ActivityPage.jsx
- App.jsx

## God Nodes (most connected - your core abstractions)
1. `useApp()` - 57 edges
2. `AppBar()` - 35 edges
3. `Body()` - 31 edges
4. `@heroui/react` - 22 edges
5. `react` - 22 edges
6. `Icon()` - 20 edges
7. `SectionTitle()` - 18 edges
8. `OwnerChip()` - 18 edges
9. `ClientProfile()` - 17 edges
10. `Tile()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `Forgot()` --calls--> `useApp()`  [EXTRACTED]
  src/mockup/screens/Auth.jsx → src/mockup/core.jsx
- `Login()` --calls--> `useApp()`  [EXTRACTED]
  src/mockup/screens/Auth.jsx → src/mockup/core.jsx
- `Register()` --calls--> `useApp()`  [EXTRACTED]
  src/mockup/screens/Auth.jsx → src/mockup/core.jsx
- `ClientNew()` --calls--> `useApp()`  [EXTRACTED]
  src/mockup/screens/Clients.jsx → src/mockup/core.jsx
- `ClientProfile()` --calls--> `useApp()`  [EXTRACTED]
  src/mockup/screens/Clients.jsx → src/mockup/core.jsx

## Import Cycles
- None detected.

## Communities (17 total, 2 thin omitted)

### Community 0 - "UseCasePage.jsx"
Cohesion: 0.07
Nodes (55): @heroui/react, App(), Header(), NAV, ActivitySvg, CpBacklog(), usage(), DataSourceMatrix() (+47 more)

### Community 1 - "CoveragePage.jsx"
Cohesion: 0.24
Nodes (9): AREAS, COVERAGE, RACI, RACI_PARTIES, SCREENS, CoveragePage(), RACI_STYLE, Refs() (+1 more)

### Community 2 - "Work.jsx"
Cohesion: 0.11
Nodes (22): Announcement(), BlackTile(), AGENDA, BOUTIQUES, BY_BOUTIQUE, BY_CHANNEL, CLIENTS, KPI (+14 more)

### Community 3 - "ApiPage.jsx"
Cohesion: 0.11
Nodes (21): ALL, API_GROUPS, CONVENTIONS, ENDPOINTS, FIELD, JOBS, LEAD, WEBHOOKS (+13 more)

### Community 4 - "screens.js"
Cohesion: 0.25
Nodes (20): AppBar(), Body(), Initials(), SectionTitle(), Stat(), Tile(), ALL, ListBuilder() (+12 more)

### Community 5 - "ErdPage.jsx"
Cohesion: 0.12
Nodes (20): ERD, layoutErd(), visibleFields(), DOMAIN_COLOR, ErdSvg, KEY_COLOR, DOMAINS, entities (+12 more)

### Community 6 - "Clients.jsx"
Cohesion: 0.17
Nodes (21): ContactBar(), Row(), loveLabel(), tag(), trackLabel(), usableTemplates(), CHANNELS, ClientNew() (+13 more)

### Community 7 - "Icon"
Cohesion: 0.38
Nodes (9): Icon(), Pill(), Field(), Preview(), STATUS, StatusTag(), TemplateNew(), Templates() (+1 more)

### Community 8 - "UseCaseSvg.jsx"
Cohesion: 0.38
Nodes (8): computeLayout(), DIM, relatedSet(), spread(), cls(), IMPL_FILL, StickFigure(), UseCaseSvg

### Community 9 - "useApp"
Cohesion: 0.29
Nodes (12): TierBadge(), useApp(), Attendance(), ClientRow(), ClientSearch(), CreateListSheet(), ListDetail(), Hello() (+4 more)

### Community 10 - "Longchamp CRM Mobile — Solution Design"
Cohesion: 0.18
Nodes (10): Architecture in one line, Editing the model, Implementors (Cekat side), Knowledge graph (graphify), Longchamp CRM Mobile — Solution Design, Roles, Run, Structure (+2 more)

### Community 11 - "core.jsx"
Cohesion: 0.12
Nodes (28): BoutiqueArt(), Ctx, FullBody(), Hero(), MENU, MoreSheet(), P, Phone() (+20 more)

### Community 14 - "ActivitySvg.jsx"
Cohesion: 0.33
Nodes (7): AD, box(), layoutActivity(), wrap(), NODE_FILL, OWNER_COLOR, OWNER_LABEL

### Community 15 - "ActivityPage.jsx"
Cohesion: 0.07
Nodes (31): dependencies, @heroui/react@^3.2.7, @heroui/styles@^3.2.7, react@^19.3.1, react-dom@^19.3.1, react-router-dom@^7.18.5, devDependencies, tailwindcss@^4.3.5 (+23 more)

### Community 19 - "App.jsx"
Cohesion: 0.24
Nodes (18): BagArt(), LcButton(), idr(), idrShort(), visibleClients(), addToClientWishlist(), BUSY, Catalog() (+10 more)

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `ActivityPage.jsx` to `UseCasePage.jsx`, `ApiPage.jsx`, `ErdPage.jsx`, `Clients.jsx`, `Icon`, `UseCaseSvg.jsx`, `core.jsx`, `ActivitySvg.jsx`, `App.jsx`?**
  _High betweenness centrality (0.309) - this node is a cross-community bridge._
- **Should `UseCasePage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07059607059607059 - nodes in this community are weakly interconnected._
- **Why does `@heroui/react` connect `UseCasePage.jsx` to `CoveragePage.jsx`, `Work.jsx`, `ApiPage.jsx`, `ErdPage.jsx`, `Clients.jsx`, `Icon`, `core.jsx`, `ActivityPage.jsx`, `App.jsx`?**
  _High betweenness centrality (0.248) - this node is a cross-community bridge._
- **Should `Work.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11231884057971014 - nodes in this community are weakly interconnected._
- **Should `ApiPage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `ErdPage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12333333333333334 - nodes in this community are weakly interconnected._
- **Should `core.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11827956989247312 - nodes in this community are weakly interconnected._