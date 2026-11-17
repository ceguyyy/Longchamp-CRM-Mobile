# Graph Report - longchamp-crm-mobile  (2026-11-17)

## Corpus Check
- 49 files · ~69,030 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 3, .css 1)

## Summary
- 355 nodes · 1014 edges · 15 communities (13 shown, 2 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 30 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `443add63`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- UseCasePage.jsx
- Work.jsx
- ApiPage.jsx
- screens.js
- App.jsx
- Clients.jsx
- Icon
- UseCaseSvg.jsx
- Longchamp CRM Mobile — Solution Design
- core.jsx
- CLAUDE.md
- .claude/CLAUDE.md
- ActivitySvg.jsx
- ActivityPage.jsx
- Product

## God Nodes (most connected - your core abstractions)
1. `useApp()` - 57 edges
2. `AppBar()` - 35 edges
3. `Body()` - 31 edges
4. `@heroui/react` - 22 edges
5. `react` - 22 edges
6. `Icon()` - 20 edges
7. `OwnerChip()` - 18 edges
8. `SectionTitle()` - 18 edges
9. `ClientProfile()` - 17 edges
10. `Tile()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `ClientProfile()` --calls--> `idr()`  [EXTRACTED]
  src/mockup/screens/Clients.jsx → src/mockup/data.js
- `WishlistSend()` --calls--> `idr()`  [EXTRACTED]
  src/mockup/screens/Work.jsx → src/mockup/data.js
- `Home()` --calls--> `idrShort()`  [EXTRACTED]
  src/mockup/screens/Home.jsx → src/mockup/data.js
- `Performance()` --calls--> `idrShort()`  [EXTRACTED]
  src/mockup/screens/Work.jsx → src/mockup/data.js
- `Team()` --calls--> `idrShort()`  [EXTRACTED]
  src/mockup/screens/Work.jsx → src/mockup/data.js

## Import Cycles
- None detected.

## Communities (15 total, 2 thin omitted)

### Community 0 - "UseCasePage.jsx"
Cohesion: 0.08
Nodes (49): @heroui/react, ActivitySvg, ArchitectureSvg, Cylinder(), OWNER_COLOR, OWNER_LABEL, CpBacklog(), usage() (+41 more)

### Community 2 - "Work.jsx"
Cohesion: 0.14
Nodes (28): Stat(), AGENDA, BOUTIQUES, BY_BOUTIQUE, BY_CHANNEL, CLIENTS, idrShort(), KPI (+20 more)

### Community 3 - "ApiPage.jsx"
Cohesion: 0.11
Nodes (21): ALL, API_GROUPS, CONVENTIONS, ENDPOINTS, FIELD, JOBS, LEAD, WEBHOOKS (+13 more)

### Community 4 - "screens.js"
Cohesion: 0.26
Nodes (23): AppBar(), Body(), Initials(), Pill(), SectionTitle(), Tile(), ALL, ClientSearch() (+15 more)

### Community 5 - "App.jsx"
Cohesion: 0.06
Nodes (40): react, App(), Header(), NAV, ERD, layoutErd(), visibleFields(), DOMAIN_COLOR (+32 more)

### Community 6 - "Clients.jsx"
Cohesion: 0.11
Nodes (31): ContactBar(), LcButton(), Row(), TierBadge(), LISTS, LOVE_TAGS, loveLabel(), REACH_REASONS (+23 more)

### Community 7 - "Icon"
Cohesion: 0.25
Nodes (14): Icon(), useApp(), Hello(), Home(), PushRow(), SearchProduct(), Field(), Preview() (+6 more)

### Community 8 - "UseCaseSvg.jsx"
Cohesion: 0.38
Nodes (8): computeLayout(), DIM, relatedSet(), spread(), cls(), IMPL_FILL, StickFigure(), UseCaseSvg

### Community 10 - "Longchamp CRM Mobile — Solution Design"
Cohesion: 0.18
Nodes (10): Architecture in one line, Editing the model, Implementors (Cekat side), Knowledge graph (graphify), Longchamp CRM Mobile — Solution Design, Roles, Run, Structure (+2 more)

### Community 11 - "core.jsx"
Cohesion: 0.12
Nodes (28): Announcement(), BlackTile(), BoutiqueArt(), Ctx, FullBody(), Hero(), MENU, MoreSheet() (+20 more)

### Community 14 - "ActivitySvg.jsx"
Cohesion: 0.33
Nodes (7): AD, box(), layoutActivity(), wrap(), NODE_FILL, OWNER_COLOR, OWNER_LABEL

### Community 15 - "ActivityPage.jsx"
Cohesion: 0.10
Nodes (26): dependencies, @heroui/react@^3.2.7, @heroui/styles@^3.2.7, react@^19.3.1, react-dom@^19.3.1, react-router-dom@^7.18.5, devDependencies, tailwindcss@^4.3.5 (+18 more)

### Community 19 - "Product"
Cohesion: 0.39
Nodes (8): BagArt(), idr(), addToClientWishlist(), Catalog(), ClientWishlist(), PickClientSheet(), Product(), WishlistBar()

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.jsx` to `UseCasePage.jsx`, `Work.jsx`, `ApiPage.jsx`, `Clients.jsx`, `Icon`, `UseCaseSvg.jsx`, `core.jsx`, `ActivitySvg.jsx`, `ActivityPage.jsx`?**
  _High betweenness centrality (0.309) - this node is a cross-community bridge._
- **Should `UseCasePage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07536231884057971 - nodes in this community are weakly interconnected._
- **Why does `@heroui/react` connect `UseCasePage.jsx` to `Work.jsx`, `ApiPage.jsx`, `App.jsx`, `Clients.jsx`, `Icon`, `core.jsx`, `ActivityPage.jsx`?**
  _High betweenness centrality (0.248) - this node is a cross-community bridge._
- **Should `Work.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13548387096774195 - nodes in this community are weakly interconnected._
- **Should `ApiPage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.062409288824383166 - nodes in this community are weakly interconnected._
- **Should `Clients.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11290322580645161 - nodes in this community are weakly interconnected._