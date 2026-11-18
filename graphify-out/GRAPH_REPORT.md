# Graph Report - longchamp-crm-mobile  (2026-11-18)

## Corpus Check
- 57 files · ~144,645 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 3, .css 1)

## Summary
- 435 nodes · 1174 edges · 17 communities (15 shown, 2 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 33 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b0314fcf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ErdPage.jsx
- workplan.js
- Work.jsx
- crmDatabase.js
- UseCaseSvg.jsx
- ActivitySvg.jsx
- Clients.jsx
- TOR_Longchamp_Clienteling_808c6562.md
- UseCasePage.jsx
- WorkplanPage.jsx
- Longchamp CRM Mobile — Solution Design
- core.jsx
- CLAUDE.md
- .claude/CLAUDE.md
- ApiPage.jsx
- ActivityPage.jsx
- CoveragePage.jsx

## God Nodes (most connected - your core abstractions)
1. `useApp()` - 56 edges
2. `AppBar()` - 36 edges
3. `Body()` - 32 edges
4. `react` - 25 edges
5. `@heroui/react` - 23 edges
6. `Icon()` - 20 edges
7. `SectionTitle()` - 18 edges
8. `ClientProfile()` - 18 edges
9. `OwnerChip()` - 18 edges
10. `Home()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `ApiPage()`  [EXTRACTED]
  src/App.jsx → src/pages/ApiPage.jsx
- `App()` --calls--> `CoveragePage()`  [EXTRACTED]
  src/App.jsx → src/pages/CoveragePage.jsx
- `App()` --calls--> `ErdPage()`  [EXTRACTED]
  src/App.jsx → src/pages/ErdPage.jsx
- `App()` --calls--> `WorkplanPage()`  [EXTRACTED]
  src/App.jsx → src/pages/WorkplanPage.jsx
- `ErdPage()` --calls--> `downloadSvg()`  [EXTRACTED]
  src/pages/ErdPage.jsx → src/utils/downloadSvg.js

## Import Cycles
- None detected.

## Communities (17 total, 2 thin omitted)

### Community 0 - "ErdPage.jsx"
Cohesion: 0.12
Nodes (20): ERD, layoutErd(), visibleFields(), DOMAIN_COLOR, ErdSvg, KEY_COLOR, DOMAINS, entities (+12 more)

### Community 1 - "workplan.js"
Cohesion: 0.15
Nodes (14): apiRows, appRows, flatten(), GROUP, NATIVE, numbered(), pad(), ROLE (+6 more)

### Community 2 - "Work.jsx"
Cohesion: 0.08
Nodes (44): configStore, displayStatus(), liveContent(), state, subs, TODAY, Hero(), Stat() (+36 more)

### Community 3 - "crmDatabase.js"
Cohesion: 0.25
Nodes (9): WRITES, ALIASES, boardName(), camel(), CRM_BOARDS, CRM_FIELD_ROWS, ID_VAR, mentions() (+1 more)

### Community 4 - "UseCaseSvg.jsx"
Cohesion: 0.35
Nodes (9): computeLayout(), DIM, relatedSet(), SOURCE_COLORS, spread(), cls(), IMPL_FILL, StickFigure() (+1 more)

### Community 5 - "ActivitySvg.jsx"
Cohesion: 0.33
Nodes (7): AD, box(), layoutActivity(), wrap(), NODE_FILL, OWNER_COLOR, OWNER_LABEL

### Community 6 - "Clients.jsx"
Cohesion: 0.09
Nodes (79): useConfig(), AppBar(), BagArt(), Body(), ContactBar(), Icon(), Initials(), LcButton() (+71 more)

### Community 7 - "TOR_Longchamp_Clienteling_808c6562.md"
Cohesion: 0.33
Nodes (5): Sheet: Additional Custom - Charge, Sheet: CRM as Database, Sheet: Daftar API IT Delivery, Sheet: Default TOR, Sheet: Template TOR - Mandays

### Community 8 - "UseCasePage.jsx"
Cohesion: 0.06
Nodes (63): @heroui/react, react, react-router-dom, App(), Header(), NAV, ActivitySvg, ArchitectureSvg (+55 more)

### Community 9 - "WorkplanPage.jsx"
Cohesion: 0.10
Nodes (16): componentRows, crmBoardRows, crmFieldRows, jobRows, n8nRows, PARTY_LABEL, PARTY_ORDER, variableRows (+8 more)

### Community 10 - "Longchamp CRM Mobile — Solution Design"
Cohesion: 0.18
Nodes (10): Architecture in one line, Editing the model, Implementors (Cekat side), Knowledge graph (graphify), Longchamp CRM Mobile — Solution Design, Roles, Run, Structure (+2 more)

### Community 11 - "core.jsx"
Cohesion: 0.12
Nodes (26): Announcement(), BlackTile(), BoutiqueArt(), Ctx, FullBody(), MENU, MoreSheet(), P (+18 more)

### Community 14 - "ApiPage.jsx"
Cohesion: 0.11
Nodes (20): ALL, API_GROUPS, CONVENTIONS, ENDPOINTS, FIELD, JOBS, LEAD, WEBHOOKS (+12 more)

### Community 15 - "ActivityPage.jsx"
Cohesion: 0.10
Nodes (25): dependencies, @heroui/react@^3.2.7, @heroui/styles@^3.2.7, react@^19.3.1, react-dom@^19.3.1, react-router-dom@^7.18.5, devDependencies, tailwindcss@^4.3.5 (+17 more)

### Community 16 - "CoveragePage.jsx"
Cohesion: 0.24
Nodes (9): AREAS, COVERAGE, RACI, RACI_PARTIES, SCREENS, CoveragePage(), RACI_STYLE, Refs() (+1 more)

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `UseCasePage.jsx` to `ErdPage.jsx`, `Work.jsx`, `UseCaseSvg.jsx`, `ActivitySvg.jsx`, `Clients.jsx`, `WorkplanPage.jsx`, `core.jsx`, `ApiPage.jsx`, `ActivityPage.jsx`?**
  _High betweenness centrality (0.282) - this node is a cross-community bridge._
- **Should `ErdPage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12333333333333334 - nodes in this community are weakly interconnected._
- **Why does `@heroui/react` connect `UseCasePage.jsx` to `ErdPage.jsx`, `Work.jsx`, `Clients.jsx`, `WorkplanPage.jsx`, `core.jsx`, `ApiPage.jsx`, `ActivityPage.jsx`, `CoveragePage.jsx`?**
  _High betweenness centrality (0.201) - this node is a cross-community bridge._
- **Should `Work.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08078231292517007 - nodes in this community are weakly interconnected._
- **Should `Clients.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09256538348516015 - nodes in this community are weakly interconnected._
- **Should `UseCasePage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05811965811965812 - nodes in this community are weakly interconnected._
- **Should `WorkplanPage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1038961038961039 - nodes in this community are weakly interconnected._