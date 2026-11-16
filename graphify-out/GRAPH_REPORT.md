# Graph Report - longchamp-crm-mobile  (2026-11-17)

## Corpus Check
- 49 files · ~63,812 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .css 1)

## Summary
- 343 nodes · 986 edges · 15 communities (13 shown, 2 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 29 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9686a587`
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
- useApp
- Longchamp CRM Mobile — Solution Design
- core.jsx
- CLAUDE.md
- .claude/CLAUDE.md
- ActivitySvg.jsx

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
10. `Home()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `ActivitySvg` --calls--> `layoutActivity()`  [EXTRACTED]
  src/components/activity/ActivitySvg.jsx → src/components/activity/activityLayout.js
- `Annotation()` --calls--> `OwnerChip()`  [EXTRACTED]
  src/pages/MockupPage.jsx → src/components/SourceBadges.jsx
- `MockupPage()` --calls--> `OwnerChip()`  [EXTRACTED]
  src/pages/MockupPage.jsx → src/components/SourceBadges.jsx
- `App()` --calls--> `ActivityPage()`  [EXTRACTED]
  src/App.jsx → src/pages/ActivityPage.jsx
- `App()` --calls--> `ArchitecturePage()`  [EXTRACTED]
  src/App.jsx → src/pages/ArchitecturePage.jsx

## Import Cycles
- None detected.

## Communities (15 total, 2 thin omitted)

### Community 0 - "UseCasePage.jsx"
Cohesion: 0.08
Nodes (48): @heroui/react, ActivitySvg, ArchitectureSvg, Cylinder(), OWNER_COLOR, OWNER_LABEL, CpBacklog(), usage() (+40 more)

### Community 1 - "App.jsx"
Cohesion: 0.06
Nodes (46): dependencies, @heroui/react@^3.2.7, @heroui/styles@^3.2.7, react@^19.3.1, react-dom@^19.3.1, react-router-dom@^7.18.5, devDependencies, tailwindcss@^4.3.5 (+38 more)

### Community 2 - "core.jsx"
Cohesion: 0.11
Nodes (36): Announcement(), BagArt(), BlackTile(), LcButton(), Stat(), AGENDA, BY_BOUTIQUE, BY_CHANNEL (+28 more)

### Community 3 - "ApiPage.jsx"
Cohesion: 0.13
Nodes (18): ALL, API_GROUPS, CONVENTIONS, ENDPOINTS, FIELD, JOBS, LEAD, WEBHOOKS (+10 more)

### Community 4 - "Work.jsx"
Cohesion: 0.25
Nodes (24): AppBar(), Body(), Initials(), Pill(), SectionTitle(), Tile(), ALL, ClientSearch() (+16 more)

### Community 5 - "ErdPage.jsx"
Cohesion: 0.12
Nodes (20): ERD, layoutErd(), visibleFields(), DOMAIN_COLOR, ErdSvg, KEY_COLOR, DOMAINS, entities (+12 more)

### Community 6 - "Clients.jsx"
Cohesion: 0.18
Nodes (19): ContactBar(), Row(), loveLabel(), tag(), usableTemplates(), CHANNELS, ClientNew(), ClientProfile() (+11 more)

### Community 7 - "Icon"
Cohesion: 0.24
Nodes (10): Icon(), BOUTIQUES, TEMPLATES, Field(), Preview(), STATUS, StatusTag(), Templates() (+2 more)

### Community 8 - "UseCaseSvg.jsx"
Cohesion: 0.35
Nodes (9): computeLayout(), DIM, relatedSet(), SOURCE_COLORS, spread(), cls(), IMPL_FILL, StickFigure() (+1 more)

### Community 9 - "useApp"
Cohesion: 0.33
Nodes (10): TierBadge(), useApp(), Attendance(), ClientRow(), CreateListSheet(), ListDetail(), Hello(), Home() (+2 more)

### Community 10 - "Longchamp CRM Mobile — Solution Design"
Cohesion: 0.18
Nodes (10): Architecture in one line, Editing the model, Implementors (Cekat side), Knowledge graph (graphify), Longchamp CRM Mobile — Solution Design, Roles, Run, Structure (+2 more)

### Community 11 - "core.jsx"
Cohesion: 0.13
Nodes (26): BoutiqueArt(), Ctx, FullBody(), Hero(), MENU, MoreSheet(), P, Phone() (+18 more)

### Community 14 - "ActivitySvg.jsx"
Cohesion: 0.33
Nodes (7): AD, box(), layoutActivity(), wrap(), NODE_FILL, OWNER_COLOR, OWNER_LABEL

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.jsx` to `UseCasePage.jsx`, `core.jsx`, `ApiPage.jsx`, `ErdPage.jsx`, `Clients.jsx`, `Icon`, `UseCaseSvg.jsx`, `core.jsx`, `ActivitySvg.jsx`?**
  _High betweenness centrality (0.308) - this node is a cross-community bridge._
- **Should `UseCasePage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07672634271099744 - nodes in this community are weakly interconnected._
- **Why does `@heroui/react` connect `UseCasePage.jsx` to `App.jsx`, `core.jsx`, `ApiPage.jsx`, `ErdPage.jsx`, `Clients.jsx`, `Icon`, `core.jsx`?**
  _High betweenness centrality (0.246) - this node is a cross-community bridge._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05584415584415584 - nodes in this community are weakly interconnected._
- **Should `core.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10931174089068826 - nodes in this community are weakly interconnected._
- **Should `ApiPage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13438735177865613 - nodes in this community are weakly interconnected._
- **Should `ErdPage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12333333333333334 - nodes in this community are weakly interconnected._