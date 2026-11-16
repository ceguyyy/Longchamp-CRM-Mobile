# Graph Report - Longchamp-CRM-Mobile  (2026-11-17)

## Corpus Check
- 49 files · ~63,812 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .css 1)

## Summary
- 343 nodes · 976 edges · 21 communities (19 shown, 2 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 29 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `db7ebfb2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- UseCasePage.jsx
- package.json
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
- ArchitecturePage.jsx
- SequencePage.jsx
- CoveragePage.jsx
- App.jsx
- MockupPage.jsx

## God Nodes (most connected - your core abstractions)
1. `useApp()` - 56 edges
2. `AppBar()` - 34 edges
3. `Body()` - 30 edges
4. `@heroui/react` - 21 edges
5. `react` - 21 edges
6. `Icon()` - 20 edges
7. `OwnerChip()` - 18 edges
8. `SectionTitle()` - 18 edges
9. `ClientProfile()` - 16 edges
10. `Tile()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `ActivityPage()`  [EXTRACTED]
  src/App.jsx → src/pages/ActivityPage.jsx
- `App()` --calls--> `ApiPage()`  [EXTRACTED]
  src/App.jsx → src/pages/ApiPage.jsx
- `App()` --calls--> `ArchitecturePage()`  [EXTRACTED]
  src/App.jsx → src/pages/ArchitecturePage.jsx
- `App()` --calls--> `CoveragePage()`  [EXTRACTED]
  src/App.jsx → src/pages/CoveragePage.jsx
- `App()` --calls--> `ErdPage()`  [EXTRACTED]
  src/App.jsx → src/pages/ErdPage.jsx

## Import Cycles
- None detected.

## Communities (21 total, 2 thin omitted)

### Community 0 - "UseCasePage.jsx"
Cohesion: 0.24
Nodes (17): @heroui/react, DataSourceMatrix(), DetailPanel(), SourceRow(), RbacMatrix(), RoleTable(), IMPL_COLOR, SCOPE_STYLE (+9 more)

### Community 1 - "package.json"
Cohesion: 0.08
Nodes (24): dependencies, @heroui/react, @heroui/styles, react, react-dom, react-router-dom, devDependencies, tailwindcss (+16 more)

### Community 2 - "Work.jsx"
Cohesion: 0.11
Nodes (36): Announcement(), BagArt(), BlackTile(), LcButton(), Stat(), AGENDA, BY_BOUTIQUE, BY_CHANNEL (+28 more)

### Community 3 - "ApiPage.jsx"
Cohesion: 0.13
Nodes (18): ALL, API_GROUPS, CONVENTIONS, ENDPOINTS, FIELD, JOBS, LEAD, WEBHOOKS (+10 more)

### Community 4 - "screens.js"
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

### Community 15 - "ActivityPage.jsx"
Cohesion: 0.25
Nodes (10): ActivitySvg, CpBacklog(), usage(), activities, LANES, CP_BACKLOG, model, ActivityPage() (+2 more)

### Community 16 - "ArchitecturePage.jsx"
Cohesion: 0.22
Nodes (10): ArchitectureSvg, Cylinder(), OWNER_COLOR, OWNER_LABEL, arch, ArchitecturePage(), compName(), Detail() (+2 more)

### Community 17 - "SequencePage.jsx"
Cohesion: 0.24
Nodes (10): layout(), OWNER_COLOR, SequenceSvg, PARTICIPANTS, sequences, EndpointTable(), MessageDetail(), OWNER_SHORT (+2 more)

### Community 18 - "CoveragePage.jsx"
Cohesion: 0.24
Nodes (9): AREAS, COVERAGE, RACI, RACI_PARTIES, SCREENS, CoveragePage(), RACI_STYLE, Refs() (+1 more)

### Community 19 - "App.jsx"
Cohesion: 0.29
Nodes (6): react, react-dom, App(), Header(), NAV, T

### Community 20 - "MockupPage.jsx"
Cohesion: 0.33
Nodes (8): react-router-dom, OwnerChip(), ROLES, GROUPS, Annotation(), MockupPage(), refLink(), ROLE_IDS

## Knowledge Gaps
- **75 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+70 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 88 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.jsx` to `UseCasePage.jsx`, `package.json`, `Work.jsx`, `ApiPage.jsx`, `ErdPage.jsx`, `Clients.jsx`, `Icon`, `UseCaseSvg.jsx`, `core.jsx`, `ActivitySvg.jsx`, `ActivityPage.jsx`, `ArchitecturePage.jsx`, `SequencePage.jsx`, `MockupPage.jsx`?**
  _High betweenness centrality (0.302) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _75 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.08307692307692308 - nodes in this community are weakly interconnected._
- **Why does `@heroui/react` connect `UseCasePage.jsx` to `package.json`, `Work.jsx`, `ApiPage.jsx`, `ErdPage.jsx`, `Clients.jsx`, `Icon`, `core.jsx`, `ActivityPage.jsx`, `ArchitecturePage.jsx`, `SequencePage.jsx`, `CoveragePage.jsx`, `App.jsx`, `MockupPage.jsx`?**
  _High betweenness centrality (0.237) - this node is a cross-community bridge._
- **Should `Work.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10931174089068826 - nodes in this community are weakly interconnected._
- **Why does `useApp()` connect `useApp` to `Work.jsx`, `screens.js`, `Clients.jsx`, `Icon`, `core.jsx`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Should `ApiPage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13438735177865613 - nodes in this community are weakly interconnected._