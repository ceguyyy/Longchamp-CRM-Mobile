# Graph Report - longchamp-crm-mobile  (2026-11-17)

## Corpus Check
- 52 files · ~77,316 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 3, .css 1)

## Summary
- 409 nodes · 1131 edges · 15 communities (13 shown, 2 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 33 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a9494bb2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ErdPage.jsx
- workplan.js
- Work.jsx
- apiSpec.js
- UseCaseSvg.jsx
- useApp
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
4. `react` - 24 edges
5. `@heroui/react` - 23 edges
6. `Icon()` - 20 edges
7. `ClientProfile()` - 18 edges
8. `SectionTitle()` - 18 edges
9. `OwnerChip()` - 18 edges
10. `Home()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `Settings()` --calls--> `displayStatus()`  [EXTRACTED]
  src/mockup/screens/Work.jsx → src/mockup/config.js
- `Home()` --calls--> `liveContent()`  [EXTRACTED]
  src/mockup/screens/Home.jsx → src/mockup/config.js
- `Home()` --calls--> `idrShort()`  [EXTRACTED]
  src/mockup/screens/Home.jsx → src/mockup/data.js
- `Performance()` --calls--> `idrShort()`  [EXTRACTED]
  src/mockup/screens/Work.jsx → src/mockup/data.js
- `Team()` --calls--> `idrShort()`  [EXTRACTED]
  src/mockup/screens/Work.jsx → src/mockup/data.js

## Import Cycles
- None detected.

## Communities (15 total, 2 thin omitted)

### Community 0 - "ErdPage.jsx"
Cohesion: 0.12
Nodes (20): ERD, layoutErd(), visibleFields(), DOMAIN_COLOR, ErdSvg, KEY_COLOR, DOMAINS, entities (+12 more)

### Community 1 - "workplan.js"
Cohesion: 0.13
Nodes (16): apiRows, appRows, flatten(), GROUP, NATIVE, numbered(), pad(), ROLE (+8 more)

### Community 2 - "Work.jsx"
Cohesion: 0.08
Nodes (45): configStore, displayStatus(), liveContent(), state, subs, TODAY, Hero(), Stat() (+37 more)

### Community 3 - "apiSpec.js"
Cohesion: 0.14
Nodes (10): ALL, API_GROUPS, CONVENTIONS, ENDPOINTS, FIELD, JOBS, LEAD, WEBHOOKS (+2 more)

### Community 4 - "UseCaseSvg.jsx"
Cohesion: 0.35
Nodes (9): computeLayout(), DIM, relatedSet(), SOURCE_COLORS, spread(), cls(), IMPL_FILL, StickFigure() (+1 more)

### Community 6 - "useApp"
Cohesion: 0.10
Nodes (76): useConfig(), AppBar(), BagArt(), Body(), ContactBar(), Icon(), Initials(), LcButton() (+68 more)

### Community 8 - "UseCasePage.jsx"
Cohesion: 0.07
Nodes (55): @heroui/react, AD, box(), layoutActivity(), wrap(), ActivitySvg, NODE_FILL, OWNER_COLOR (+47 more)

### Community 9 - "WorkplanPage.jsx"
Cohesion: 0.13
Nodes (13): componentRows, jobRows, PARTY_LABEL, PARTY_ORDER, variableRows, writeRows, downloadCsv(), lbl() (+5 more)

### Community 10 - "Longchamp CRM Mobile — Solution Design"
Cohesion: 0.18
Nodes (10): Architecture in one line, Editing the model, Implementors (Cekat side), Knowledge graph (graphify), Longchamp CRM Mobile — Solution Design, Roles, Run, Structure (+2 more)

### Community 11 - "core.jsx"
Cohesion: 0.10
Nodes (33): react, Announcement(), BlackTile(), BoutiqueArt(), Ctx, FullBody(), MoreSheet(), P (+25 more)

### Community 14 - "ApiPage.jsx"
Cohesion: 0.23
Nodes (11): COMPONENTS, PARTIES, TECH_STACK, ApiPage(), EndpointDetail(), METHOD_COLOR, PARTY_COLOR, ROLE_SHORT (+3 more)

### Community 15 - "ActivityPage.jsx"
Cohesion: 0.10
Nodes (26): dependencies, @heroui/react@^3.2.7, @heroui/styles@^3.2.7, react@^19.3.1, react-dom@^19.3.1, react-router-dom@^7.18.5, devDependencies, tailwindcss@^4.3.5 (+18 more)

### Community 16 - "CoveragePage.jsx"
Cohesion: 0.16
Nodes (12): App(), Header(), NAV, AREAS, COVERAGE, RACI, RACI_PARTIES, T (+4 more)

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `core.jsx` to `ErdPage.jsx`, `Work.jsx`, `UseCaseSvg.jsx`, `useApp`, `UseCasePage.jsx`, `WorkplanPage.jsx`, `ApiPage.jsx`, `ActivityPage.jsx`, `CoveragePage.jsx`?**
  _High betweenness centrality (0.290) - this node is a cross-community bridge._
- **Should `ErdPage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12333333333333334 - nodes in this community are weakly interconnected._
- **Why does `@heroui/react` connect `UseCasePage.jsx` to `ErdPage.jsx`, `Work.jsx`, `useApp`, `WorkplanPage.jsx`, `core.jsx`, `ApiPage.jsx`, `ActivityPage.jsx`, `CoveragePage.jsx`?**
  _High betweenness centrality (0.220) - this node is a cross-community bridge._
- **Should `workplan.js` be split into smaller, more focused modules?**
  _Cohesion score 0.13157894736842105 - nodes in this community are weakly interconnected._
- **Should `Work.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07755102040816327 - nodes in this community are weakly interconnected._
- **Should `apiSpec.js` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `useApp` be split into smaller, more focused modules?**
  _Cohesion score 0.09873417721518987 - nodes in this community are weakly interconnected._