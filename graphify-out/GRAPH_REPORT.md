# Graph Report - longchamp-crm-mobile  (2026-11-17)

## Corpus Check
- 49 files · ~65,124 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .css 1)

## Summary
- 348 nodes · 994 edges · 20 communities (18 shown, 2 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 29 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `db7ebfb2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- UseCasePage.jsx
- App.jsx
- core.jsx
- ApiPage.jsx
- Work.jsx
- ErdPage.jsx
- Clients.jsx
- Icon
- UseCaseSvg.jsx
- ListDetail
- Longchamp CRM Mobile — Solution Design
- core.jsx
- CLAUDE.md
- .claude/CLAUDE.md
- ActivitySvg.jsx
- package.json
- ActivityPage.jsx
- react
- OwnerChip
- Product

## God Nodes (most connected - your core abstractions)
1. `useApp()` - 56 edges
2. `AppBar()` - 34 edges
3. `Body()` - 30 edges
4. `@heroui/react` - 22 edges
5. `react` - 22 edges
6. `Icon()` - 20 edges
7. `OwnerChip()` - 18 edges
8. `SectionTitle()` - 18 edges
9. `ClientProfile()` - 16 edges
10. `Tile()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `StatusTag()` --calls--> `useApp()`  [EXTRACTED]
  src/mockup/screens/Templates.jsx → src/mockup/core.jsx
- `Templates()` --calls--> `AppBar()`  [EXTRACTED]
  src/mockup/screens/Templates.jsx → src/mockup/core.jsx
- `Templates()` --calls--> `Body()`  [EXTRACTED]
  src/mockup/screens/Templates.jsx → src/mockup/core.jsx
- `Templates()` --calls--> `useApp()`  [EXTRACTED]
  src/mockup/screens/Templates.jsx → src/mockup/core.jsx
- `Preview()` --calls--> `useApp()`  [EXTRACTED]
  src/mockup/screens/Templates.jsx → src/mockup/core.jsx

## Import Cycles
- None detected.

## Communities (20 total, 2 thin omitted)

### Community 0 - "UseCasePage.jsx"
Cohesion: 0.27
Nodes (15): @heroui/react, DataSourceMatrix(), DetailPanel(), SourceRow(), RbacMatrix(), RoleTable(), IMPL_COLOR, SCOPE_STYLE (+7 more)

### Community 1 - "App.jsx"
Cohesion: 0.12
Nodes (20): react-router-dom, App(), Header(), NAV, AREAS, COVERAGE, RACI, RACI_PARTIES (+12 more)

### Community 2 - "core.jsx"
Cohesion: 0.15
Nodes (27): Announcement(), BlackTile(), LcButton(), TierBadge(), AGENDA, BOUTIQUES, BY_BOUTIQUE, BY_CHANNEL (+19 more)

### Community 3 - "ApiPage.jsx"
Cohesion: 0.11
Nodes (21): ALL, API_GROUPS, CONVENTIONS, ENDPOINTS, FIELD, JOBS, LEAD, WEBHOOKS (+13 more)

### Community 4 - "Work.jsx"
Cohesion: 0.27
Nodes (23): AppBar(), Body(), Initials(), SectionTitle(), Tile(), useApp(), ALL, CreateListSheet() (+15 more)

### Community 5 - "ErdPage.jsx"
Cohesion: 0.12
Nodes (20): ERD, layoutErd(), visibleFields(), DOMAIN_COLOR, ErdSvg, KEY_COLOR, DOMAINS, entities (+12 more)

### Community 6 - "Clients.jsx"
Cohesion: 0.15
Nodes (22): ContactBar(), Row(), LISTS, LOVE_TAGS, loveLabel(), REACH_REASONS, tag(), usableTemplates() (+14 more)

### Community 7 - "Icon"
Cohesion: 0.33
Nodes (10): Icon(), MoreSheet(), Pill(), Field(), Preview(), STATUS, StatusTag(), TemplateNew() (+2 more)

### Community 8 - "UseCaseSvg.jsx"
Cohesion: 0.35
Nodes (9): computeLayout(), DIM, relatedSet(), SOURCE_COLORS, spread(), cls(), IMPL_FILL, StickFigure() (+1 more)

### Community 9 - "ListDetail"
Cohesion: 0.40
Nodes (5): Attendance(), ClientRow(), ClientSearch(), ListDetail(), visibleClients()

### Community 10 - "Longchamp CRM Mobile — Solution Design"
Cohesion: 0.18
Nodes (10): Architecture in one line, Editing the model, Implementors (Cekat side), Knowledge graph (graphify), Longchamp CRM Mobile — Solution Design, Roles, Run, Structure (+2 more)

### Community 11 - "core.jsx"
Cohesion: 0.12
Nodes (28): BoutiqueArt(), Ctx, FullBody(), Hero(), MENU, P, Phone(), Sheet() (+20 more)

### Community 14 - "ActivitySvg.jsx"
Cohesion: 0.33
Nodes (7): AD, box(), layoutActivity(), wrap(), NODE_FILL, OWNER_COLOR, OWNER_LABEL

### Community 15 - "package.json"
Cohesion: 0.10
Nodes (25): dependencies, @heroui/react@^3.2.7, @heroui/styles@^3.2.7, react@^19.3.1, react-dom@^19.3.1, react-router-dom@^7.18.5, devDependencies, tailwindcss@^4.3.5 (+17 more)

### Community 16 - "ActivityPage.jsx"
Cohesion: 0.19
Nodes (13): ActivitySvg, CpBacklog(), usage(), activities, LANES, CP_BACKLOG, IMPLEMENTORS, ownerOf() (+5 more)

### Community 17 - "react"
Cohesion: 0.23
Nodes (11): react, layout(), OWNER_COLOR, SequenceSvg, PARTICIPANTS, sequences, EndpointTable(), MessageDetail() (+3 more)

### Community 18 - "OwnerChip"
Cohesion: 0.24
Nodes (10): ArchitectureSvg, Cylinder(), OWNER_COLOR, OWNER_LABEL, OwnerChip(), arch, ArchitecturePage(), compName() (+2 more)

### Community 19 - "Product"
Cohesion: 0.33
Nodes (10): BagArt(), idr(), addToClientWishlist(), Catalog(), ClientWishlist(), ConnectedChip(), PickClientSheet(), Product() (+2 more)

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `UseCasePage.jsx`, `App.jsx`, `core.jsx`, `ApiPage.jsx`, `ErdPage.jsx`, `Clients.jsx`, `Icon`, `UseCaseSvg.jsx`, `core.jsx`, `ActivitySvg.jsx`, `package.json`, `ActivityPage.jsx`, `OwnerChip`?**
  _High betweenness centrality (0.310) - this node is a cross-community bridge._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1164021164021164 - nodes in this community are weakly interconnected._
- **Why does `@heroui/react` connect `UseCasePage.jsx` to `App.jsx`, `core.jsx`, `ApiPage.jsx`, `ErdPage.jsx`, `Clients.jsx`, `Icon`, `core.jsx`, `package.json`, `ActivityPage.jsx`, `react`, `OwnerChip`?**
  _High betweenness centrality (0.249) - this node is a cross-community bridge._
- **Should `core.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1471264367816092 - nodes in this community are weakly interconnected._
- **Should `ApiPage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `ErdPage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12333333333333334 - nodes in this community are weakly interconnected._
- **Should `core.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11612903225806452 - nodes in this community are weakly interconnected._