/*
 * Pure layout for the use case diagram.
 * Input: the model from src/data/useCases.js
 * Output: absolute coordinates for every node and edge, in SVG units.
 */

export const DIM = {
  width: 1500,
  actorX: 78,
  boundary: { x: 168, y: 40, w: 980 },
  cols: [
    { x: 196, w: 448 },
    { x: 672, w: 448 },
  ],
  moduleTop: 104,
  moduleGap: 24,
  moduleHeader: 42,
  rowH: 58,
  modulePadY: 12,
  ellipse: { rx: 150, ry: 23 },
  systemX: 1340,
  systemBox: { w: 220, h: 62 },
  actorMinGap: 190,
  systemMinGap: 84,
};

export const SOURCE_COLORS = {
  Webhook: "var(--src-webhook)",
  API: "var(--src-api)",
  Workflow: "var(--src-workflow)",
  Scheduler: "var(--src-workflow)",
  Push: "var(--src-push)",
};

/** Spread ordered points so neighbours keep a minimum gap, staying inside [min,max]. */
function spread(items, minGap, min, max) {
  const sorted = [...items].sort((a, b) => a.y - b.y);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].y - sorted[i - 1].y < minGap) sorted[i].y = sorted[i - 1].y + minGap;
  }
  const overflow = sorted.length ? sorted[sorted.length - 1].y - max : 0;
  if (overflow > 0) sorted.forEach((s) => (s.y -= overflow));
  for (let i = sorted.length - 2; i >= 0; i--) {
    if (sorted[i + 1].y - sorted[i].y < minGap) sorted[i].y = sorted[i + 1].y - minGap;
  }
  sorted.forEach((s) => (s.y = Math.max(min, s.y)));
  return sorted;
}

export function computeLayout(model) {
  const { rx, ry } = DIM.ellipse;

  /* ---------- modules + use cases ---------- */
  const colCursor = DIM.cols.map(() => DIM.moduleTop);
  const modules = {};
  const ucs = {};

  model.modules.forEach((m) => {
    const col = DIM.cols[m.col];
    const items = model.useCases.filter((u) => u.module === m.id);
    const h = DIM.moduleHeader + items.length * DIM.rowH + DIM.modulePadY;
    const y = colCursor[m.col];
    modules[m.id] = { ...m, x: col.x, y, w: col.w, h };
    items.forEach((u, i) => {
      ucs[u.id] = {
        ...u,
        cx: col.x + col.w / 2 - 14,
        cy: y + DIM.moduleHeader + i * DIM.rowH + DIM.rowH / 2 - 4,
        rx,
        ry,
      };
    });
    colCursor[m.col] = y + h + DIM.moduleGap;
  });

  const contentBottom = Math.max(...colCursor) - DIM.moduleGap;
  const boundary = {
    ...DIM.boundary,
    h: contentBottom - DIM.boundary.y + 28,
  };
  const height = boundary.y + boundary.h + 40;

  /* ---------- actors (left) ---------- */
  const actorItems = model.actors.map((a) => {
    const linked = model.useCases.filter((u) => u.actors.includes(a.id));
    const avg = linked.length ? linked.reduce((s, u) => s + ucs[u.id].cy, 0) / linked.length : height / 2;
    return { ...a, y: avg };
  });
  // keep the declared order (SA, SM, HQ) top-to-bottom
  actorItems.forEach((a, i) => (a.order = i));
  const placedActors = spread(
    actorItems.sort((a, b) => a.order - b.order).map((a, i, arr) => {
      if (i > 0 && a.y <= arr[i - 1].y) a.y = arr[i - 1].y + 1;
      return a;
    }),
    DIM.actorMinGap,
    boundary.y + 80,
    boundary.y + boundary.h - 80
  );
  const actors = {};
  placedActors.forEach((a) => (actors[a.id] = { ...a, x: DIM.actorX }));

  /* ---------- external systems (right) ---------- */
  const sysItems = model.systems.map((s) => {
    const linked = model.useCases.filter((u) => u.sources.some((src) => src.sys === s.id));
    const avg = linked.length ? linked.reduce((sum, u) => sum + ucs[u.id].cy, 0) / linked.length : height / 2;
    return { ...s, y: avg };
  });
  const placedSys = spread(sysItems, DIM.systemMinGap, boundary.y + 40, boundary.y + boundary.h - 40);
  const systems = {};
  placedSys.forEach((s) => (systems[s.id] = { ...s, x: DIM.systemX }));

  /* ---------- edges ---------- */
  const actorEdges = [];
  model.useCases.forEach((u) =>
    u.actors.forEach((aid) => {
      const a = actors[aid];
      const c = ucs[u.id];
      const x1 = a.x + 26;
      const y1 = a.y - 6;
      const x2 = c.cx - c.rx;
      const y2 = c.cy;
      const mx = (x1 + x2) / 2;
      actorEdges.push({
        id: `${aid}-${u.id}`,
        actor: aid,
        uc: u.id,
        d: `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`,
      });
    })
  );

  const generalizations = model.actors
    .filter((a) => a.generalizes)
    .map((a) => {
      const child = actors[a.id];
      const parent = actors[a.generalizes];
      return {
        id: `gen-${a.id}`,
        actor: a.id,
        parent: a.generalizes,
        // vertical line from the child's head up to just below the parent's caption
        x1: child.x,
        y1: child.y - 40,
        x2: parent.x,
        y2: parent.y + 76,
      };
    });

  const dataEdges = [];
  model.useCases.forEach((u) => {
    const bySys = {};
    u.sources.forEach((s) => {
      (bySys[s.sys] ||= []).push(s);
    });
    Object.entries(bySys).forEach(([sysId, srcs]) => {
      const s = systems[sysId];
      const c = ucs[u.id];
      const x1 = s.x - DIM.systemBox.w / 2;
      const y1 = s.y;
      const x2 = c.cx + c.rx;
      const y2 = c.cy;
      const mx = x2 + (x1 - x2) * 0.55;
      const type = srcs[0].type;
      dataEdges.push({
        id: `${sysId}-${u.id}`,
        sys: sysId,
        uc: u.id,
        type,
        types: [...new Set(srcs.map((x) => x.type))],
        d: `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2 + 3},${y2}`,
      });
    });
  });

  const relations = model.relations.map((r, i) => {
    const a = ucs[r.from];
    const b = ucs[r.to];
    const xa = a.cx + a.rx * 0.82;
    const xb = b.cx + b.rx * 0.82;
    const ya = a.cy + (b.cy > a.cy ? 10 : -10);
    const yb = b.cy + (b.cy > a.cy ? -12 : 12);
    const dist = Math.abs(b.cy - a.cy) / DIM.rowH;
    const bulge = 26 + dist * 12;
    const cx = Math.max(xa, xb) + bulge;
    return {
      id: `rel-${i}`,
      ...r,
      d: `M${xa},${ya} C${cx},${ya} ${cx},${yb} ${xb},${yb}`,
      labelX: cx - bulge * 0.25 + 4,
      labelY: (ya + yb) / 2 + 4,
    };
  });

  return {
    width: DIM.width,
    height,
    boundary,
    modules,
    ucs,
    actors,
    systems,
    actorEdges,
    generalizations,
    dataEdges,
    relations,
  };
}

/** Which nodes/edges relate to the focused element. */
export function relatedSet(focus, layout, model) {
  if (!focus) return null;
  const set = { ucs: new Set(), actors: new Set(), systems: new Set(), edges: new Set() };
  const smInherits = (aid) =>
    model.actors.filter((a) => a.generalizes === aid).map((a) => a.id);

  if (focus.kind === "uc") {
    const u = layout.ucs[focus.id];
    set.ucs.add(u.id);
    u.actors.forEach((a) => {
      set.actors.add(a);
      smInherits(a).forEach((c) => set.actors.add(c));
    });
    u.sources.forEach((s) => set.systems.add(s.sys));
    layout.actorEdges.filter((e) => e.uc === u.id).forEach((e) => set.edges.add(e.id));
    layout.dataEdges.filter((e) => e.uc === u.id).forEach((e) => set.edges.add(e.id));
    layout.relations
      .filter((r) => r.from === u.id || r.to === u.id)
      .forEach((r) => {
        set.edges.add(r.id);
        set.ucs.add(r.from);
        set.ucs.add(r.to);
      });
  } else if (focus.kind === "actor") {
    const ids = [focus.id];
    const parent = model.actors.find((a) => a.id === focus.id)?.generalizes;
    if (parent) ids.push(parent);
    ids.forEach((aid) => set.actors.add(aid));
    layout.actorEdges
      .filter((e) => ids.includes(e.actor))
      .forEach((e) => {
        set.edges.add(e.id);
        set.ucs.add(e.uc);
      });
    layout.generalizations.filter((g) => g.actor === focus.id).forEach((g) => set.edges.add(g.id));
  } else if (focus.kind === "system") {
    set.systems.add(focus.id);
    layout.dataEdges
      .filter((e) => e.sys === focus.id)
      .forEach((e) => {
        set.edges.add(e.id);
        set.ucs.add(e.uc);
      });
  }
  return set;
}
