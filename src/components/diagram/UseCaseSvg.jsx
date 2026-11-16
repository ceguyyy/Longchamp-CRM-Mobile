import { forwardRef, useMemo } from "react";
import { computeLayout, relatedSet, DIM, SOURCE_COLORS } from "./layout";

function StickFigure({ x, y }) {
  // y = vertical centre of the figure
  return (
    <g stroke="var(--lc-forest)" strokeWidth="2.2" fill="none" strokeLinecap="round">
      <circle cx={x} cy={y - 26} r="10" fill="#fff" />
      <line x1={x} y1={y - 16} x2={x} y2={y + 12} />
      <line x1={x - 16} y1={y - 6} x2={x + 16} y2={y - 6} />
      <line x1={x} y1={y + 12} x2={x - 12} y2={y + 32} />
      <line x1={x} y1={y + 12} x2={x + 12} y2={y + 32} />
    </g>
  );
}

const cls = (...xs) => xs.filter(Boolean).join(" ");

const UseCaseSvg = forwardRef(function UseCaseSvg(
  { model, lang, show, focus, selected, onSelect, onHover },
  ref
) {
  const L = useMemo(() => computeLayout(model), [model]);
  const rel = relatedSet(focus || selected, L, model);

  const nodeCls = (kind, id) => {
    if (!rel) return "node";
    const hit =
      (kind === "uc" && rel.ucs.has(id)) ||
      (kind === "actor" && rel.actors.has(id)) ||
      (kind === "system" && rel.systems.has(id));
    return cls("node", !hit && "dim");
  };
  const edgeCls = (id, base) => cls("link", base, rel && (rel.edges.has(id) ? "hot" : "dim"));

  const hover = (f) => ({
    onMouseEnter: () => onHover(f),
    onMouseLeave: () => onHover(null),
  });

  return (
    <svg
      ref={ref}
      className="ucd w-full h-auto"
      viewBox={`0 0 ${L.width} ${L.height}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Use case diagram"
      onClick={(e) => e.target === e.currentTarget && onSelect(null)}
    >
      <defs>
        <marker id="arrowOpen" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="10" markerHeight="10" orient="auto-start-reverse">
          <path d="M1,1 L11,6 L1,11" fill="none" stroke="var(--lc-muted)" strokeWidth="1.6" />
        </marker>
        <marker id="arrowGen" viewBox="0 0 14 14" refX="13" refY="7" markerWidth="14" markerHeight="14" orient="auto">
          <path d="M1,1 L13,7 L1,13 Z" fill="#fff" stroke="var(--lc-forest)" strokeWidth="1.6" />
        </marker>
        {Object.entries(SOURCE_COLORS).map(([k, c]) => (
          <marker key={k} id={`dot-${k}`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7">
            <circle cx="5" cy="5" r="4" fill={c} />
          </marker>
        ))}
      </defs>

      <rect width={L.width} height={L.height} fill="var(--lc-cream)" />

      {/* System boundary */}
      <rect
        x={L.boundary.x}
        y={L.boundary.y}
        width={L.boundary.w}
        height={L.boundary.h}
        rx="18"
        fill="#fff"
        stroke="var(--lc-forest)"
        strokeWidth="1.6"
      />
      <text x={L.boundary.x + 28} y={L.boundary.y + 36} fontSize="13" fontWeight="600" fill="var(--lc-forest)" letterSpacing="3">
        {"«SYSTEM»  " + model.meta.title[lang].toUpperCase()}
      </text>

      {/* Modules */}
      {Object.values(L.modules).map((m) => (
        <g key={m.id}>
          <rect x={m.x} y={m.y} width={m.w} height={m.h} rx="12" fill="var(--lc-cream)" stroke="var(--lc-line)" />
          <rect x={m.x} y={m.y} width={m.w} height="32" rx="12" fill="var(--lc-forest)" />
          <rect x={m.x} y={m.y + 20} width={m.w} height="12" fill="var(--lc-forest)" />
          <text x={m.x + 16} y={m.y + 21} fontSize="11.5" fontWeight="600" fill="#fff" letterSpacing="1.6">
            {m.name[lang].toUpperCase()}
          </text>
        </g>
      ))}

      {/* Actor ↔ use case associations */}
      {show.actors && (
        <g>
          {L.actorEdges.map((e) => (
            <path key={e.id} d={e.d} className={edgeCls(e.id)} stroke="var(--lc-forest)" strokeWidth="1.2" opacity="0.45" />
          ))}
          {L.generalizations.map((g) => (
            <line
              key={g.id}
              x1={g.x1}
              y1={g.y1}
              x2={g.x2}
              y2={g.y2}
              className={edgeCls(g.id)}
              stroke="var(--lc-forest)"
              strokeWidth="1.6"
              markerEnd="url(#arrowGen)"
              opacity="0.8"
            />
          ))}
        </g>
      )}

      {/* Data connections */}
      {show.data && (
        <g>
          {L.dataEdges.map((e) => (
            <path
              key={e.id}
              d={e.d}
              className={edgeCls(e.id)}
              stroke={SOURCE_COLORS[e.type]}
              strokeWidth="1.3"
              strokeDasharray={e.type === "Webhook" ? "6 4" : e.type === "API" ? undefined : "2 4"}
              opacity="0.4"
              markerStart={`url(#dot-${e.type})`}
            />
          ))}
        </g>
      )}

      {/* include / extend */}
      {show.relations && (
        <g>
          {L.relations.map((r) => (
            <g key={r.id} className={edgeCls(r.id)} opacity="0.9">
              <path d={r.d} fill="none" stroke="var(--lc-muted)" strokeWidth="1.3" strokeDasharray="5 4" markerEnd="url(#arrowOpen)" />
              <text x={r.labelX} y={r.labelY} fontSize="9.5" fill="var(--lc-muted)" fontStyle="italic">
                {`«${r.type}»`}
              </text>
            </g>
          ))}
        </g>
      )}

      {/* Use cases */}
      {Object.values(L.ucs).map((u) => (
        <g
          key={u.id}
          className={cls("uc", nodeCls("uc", u.id), selected?.id === u.id && "selected")}
          onClick={(e) => {
            e.stopPropagation();
            onSelect({ kind: "uc", id: u.id });
          }}
          {...hover({ kind: "uc", id: u.id })}
        >
          <ellipse cx={u.cx} cy={u.cy} rx={u.rx} ry={u.ry} fill="#fff" stroke="var(--lc-forest)" strokeWidth="1.4" />
          <text x={u.cx} y={u.cy - 5} textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--lc-muted)" letterSpacing="1">
            {u.id}
          </text>
          <text x={u.cx} y={u.cy + 10} textAnchor="middle" fontSize="12.5" fontWeight="500" fill="var(--lc-ink)">
            {u.name[lang]}
          </text>
        </g>
      ))}

      {/* Actors */}
      {Object.values(L.actors).map((a) => (
        <g
          key={a.id}
          className={cls("actor", nodeCls("actor", a.id))}
          onClick={(e) => {
            e.stopPropagation();
            onSelect({ kind: "actor", id: a.id });
          }}
          {...hover({ kind: "actor", id: a.id })}
        >
          <rect x={a.x - 70} y={a.y - 44} width="140" height="128" fill="transparent" />
          <StickFigure x={a.x} y={a.y} />
          <text x={a.x} y={a.y + 52} textAnchor="middle" fontSize="12.5" fontWeight="600" fill="var(--lc-ink)">
            {a.name[lang]}
          </text>
          <text x={a.x} y={a.y + 67} textAnchor="middle" fontSize="9.5" fill="var(--lc-muted)">
            {a.note[lang]}
          </text>
        </g>
      ))}

      {/* External systems */}
      {Object.values(L.systems).map((s) => {
        const { w, h } = DIM.systemBox;
        return (
          <g
            key={s.id}
            className={cls("system", nodeCls("system", s.id))}
            onClick={(e) => {
              e.stopPropagation();
              onSelect({ kind: "system", id: s.id });
            }}
            {...hover({ kind: "system", id: s.id })}
          >
            <rect x={s.x - w / 2} y={s.y - h / 2} width={w} height={h} rx="10" fill="#fff" stroke="var(--lc-forest)" strokeWidth="1.3" />
            <rect x={s.x - w / 2} y={s.y - h / 2} width="6" height={h} rx="3" fill="var(--lc-lime)" />
            <text x={s.x - w / 2 + 18} y={s.y - 12} fontSize="9" fill="var(--lc-muted)" letterSpacing="1">
              «system»
            </text>
            <text x={s.x - w / 2 + 18} y={s.y + 4} fontSize="13" fontWeight="600" fill="var(--lc-ink)">
              {s.name}
            </text>
            <text x={s.x - w / 2 + 18} y={s.y + 19} fontSize="9.5" fill="var(--lc-muted)">
              {s.sub}
            </text>
          </g>
        );
      })}
    </svg>
  );
});

export default UseCaseSvg;
