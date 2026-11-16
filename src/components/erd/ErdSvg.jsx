import { forwardRef, useMemo } from "react";
import { ERD, layoutErd } from "./erdLayout";

const KEY_COLOR = { PK: "#2f7d32", FK: "var(--impl-itdev)", UQ: "var(--impl-product)", IDX: "var(--lc-muted)" };
const DOMAIN_COLOR = {
  ref: "#5b6b3a",
  customer: "var(--lc-forest)",
  commerce: "#7a4f2a",
  clienteling: "#0e6e8c",
  lists: "#6a4c93",
};

const ErdSvg = forwardRef(function ErdSvg({ model, mode, selected, onSelect }, ref) {
  const L = useMemo(() => layoutErd(model, mode), [model, mode]);

  const related = (id) =>
    !selected || id === selected || model.relations.some(([a, , b]) => (a === selected && b === id) || (b === selected && a === id));

  return (
    <svg
      ref={ref}
      className="ucd w-full h-auto"
      viewBox={`0 0 ${L.width} ${L.height}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Entity relationship diagram"
      onClick={(e) => e.target === e.currentTarget && onSelect(null)}
    >
      <rect width={L.width} height={L.height} fill="var(--lc-cream)" />

      {/* relations */}
      {L.links.map((l) => {
        const hot = selected && (l.from === selected || l.to === selected);
        const color = hot ? "var(--lc-forest)" : "#9aa08c";
        return (
          <g key={l.id} opacity={selected && !hot ? 0.12 : hot ? 1 : 0.7}>
            <path d={l.d} fill="none" stroke={color} strokeWidth={hot ? 2 : 1.2} />
            {/* many side: crow's foot */}
            {l.card !== "1:1" && (
              <path
                d={`M${l.xa + 12 * l.dirA},${l.ya} L${l.xa},${l.ya - 5} M${l.xa + 12 * l.dirA},${l.ya} L${l.xa},${l.ya + 5} M${l.xa + 12 * l.dirA},${l.ya} L${l.xa},${l.ya}`}
                stroke={color}
                strokeWidth="1.3"
                fill="none"
              />
            )}
            {/* one side: bar */}
            <line x1={l.xb + 7 * l.dirB} y1={l.yb - 5} x2={l.xb + 7 * l.dirB} y2={l.yb + 5} stroke={color} strokeWidth="1.5" />
          </g>
        );
      })}

      {/* entities */}
      {Object.values(L.boxes).map((b) => {
        const sel = selected === b.id;
        const color = DOMAIN_COLOR[b.domain];
        return (
          <g
            key={b.id}
            className="uc"
            opacity={related(b.id) ? 1 : 0.3}
            onClick={(ev) => {
              ev.stopPropagation();
              onSelect(b.id);
            }}
          >
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="10" fill="#fff" stroke={sel ? "var(--lc-lime)" : color} strokeWidth={sel ? 2.6 : 1.3} />
            <path d={`M${b.x},${b.y + 10} a10,10 0 0 1 10,-10 h${b.w - 20} a10,10 0 0 1 10,10 v${ERD.headerH - 18} h${-b.w} Z`} fill={color} />
            <text x={b.x + 12} y={b.y + 20} fontSize="13" fontWeight="700" fill="#fff" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">
              {b.id}
            </text>
            <text x={b.x + 12} y={b.y + 36} fontSize="9.5" fill="rgba(255,255,255,.8)">
              {b.cekat}
            </text>
            {b.status === "new" && (
              <g>
                <rect x={b.x + b.w - 42} y={b.y + 9} width="32" height="15" rx="7.5" fill="var(--lc-lime)" />
                <text x={b.x + b.w - 26} y={b.y + 20} fontSize="9" fontWeight="700" textAnchor="middle" fill="var(--lc-forest)">
                  NEW
                </text>
              </g>
            )}
            {b.fields.map((f, i) => {
              const y = b.y + ERD.headerH + i * ERD.rowH;
              return (
                <g key={f.name}>
                  {i % 2 === 1 && <rect x={b.x + 1} y={y - 2} width={b.w - 2} height={ERD.rowH} fill="#faf9f5" />}
                  {f.key && (
                    <text x={b.x + 10} y={y + 11} fontSize="8.5" fontWeight="700" fill={KEY_COLOR[f.key]}>
                      {f.key}
                    </text>
                  )}
                  <text x={b.x + 36} y={y + 11} fontSize="10.5" fill="var(--lc-ink)" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontWeight={f.required ? 600 : 400}>
                    {f.name.length > 24 ? f.name.slice(0, 23) + "…" : f.name}
                  </text>
                  <text x={b.x + b.w - 10} y={y + 11} fontSize="9" fill="var(--lc-muted)" textAnchor="end">
                    {f.cekat.replace(" (native)", "*").slice(0, 14)}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
});

export default ErdSvg;
