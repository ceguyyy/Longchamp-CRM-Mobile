import { forwardRef } from "react";

const OWNER_COLOR = {
  itdev: "var(--impl-itdev)",
  product: "var(--impl-product)",
  external: "var(--impl-ext)",
};
const OWNER_LABEL = { itdev: "IT DEV", product: "CEKAT PRODUCT", external: "EXTERNAL" };

function Cylinder({ x, y, w, h }) {
  // database glyph in the header of the Cekat CRM box
  const rx = w / 2;
  return (
    <g fill="none" stroke="var(--lc-forest)" strokeWidth="1.4">
      <ellipse cx={x + rx} cy={y + 4} rx={rx} ry="4" fill="var(--lc-lime-soft)" />
      <path d={`M${x},${y + 4} V${y + h - 4} A${rx},4 0 0 0 ${x + w},${y + h - 4} V${y + 4}`} />
      <path d={`M${x},${y + h / 2} A${rx},4 0 0 0 ${x + w},${y + h / 2}`} />
    </g>
  );
}

const ArchitectureSvg = forwardRef(function ArchitectureSvg({ arch, lang, selected, onSelect }, ref) {
  const isHotEdge = (e) => selected && (selected === `e${e.id}` || e.from === selected || e.to === selected);
  const isHotComp = (c) =>
    !selected ||
    selected === c.id ||
    arch.edges.some((e) => (selected === `e${e.id}` || e.from === selected || e.to === selected) && (e.from === c.id || e.to === c.id));

  return (
    <svg
      ref={ref}
      className="ucd w-full h-auto"
      viewBox={`0 0 ${arch.width} ${arch.height}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Solution architecture"
      onClick={(e) => e.target === e.currentTarget && onSelect(null)}
    >
      <defs>
        <marker id="archArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 Z" fill="context-stroke" />
        </marker>
      </defs>
      <rect width={arch.width} height={arch.height} fill="var(--lc-cream)" />

      {/* Zones */}
      {arch.zones.map((z) => (
        <g key={z.id}>
          <rect x={z.x} y={20} width={z.w} height={arch.height - 40} rx="16" fill="#fff" stroke="var(--lc-line)" />
          <text x={z.x + 18} y={46} fontSize="11" fontWeight="700" letterSpacing="2" fill="var(--lc-forest)">
            {z.title[lang]}
          </text>
        </g>
      ))}

      {/* Actors above the app */}
      <g>
        {["SA", "SM", "CX Admin"].map((a, i) => (
          <g key={a} transform={`translate(${60 + i * 78},86)`}>
            <circle cx="10" cy="-8" r="6" fill="none" stroke="var(--lc-forest)" strokeWidth="1.6" />
            <path d="M0,10 Q10,-4 20,10" fill="none" stroke="var(--lc-forest)" strokeWidth="1.6" />
            <text x="26" y="4" fontSize="11.5" fontWeight="600" fill="var(--lc-ink)">
              {a}
            </text>
          </g>
        ))}
        <line x1="157" y1="104" x2="157" y2="146" stroke="var(--lc-forest)" strokeWidth="1.3" markerEnd="url(#archArrow)" />
      </g>

      {/* Edges (under components) */}
      {arch.edges.map((e) => {
        const hot = isHotEdge(e);
        const color = e.owner === "product" ? "var(--impl-product)" : "var(--lc-ink)";
        const d = e.pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");
        return (
          <g
            key={e.id}
            className="uc"
            opacity={selected && !hot ? 0.18 : 1}
            onClick={(ev) => {
              ev.stopPropagation();
              onSelect(`e${e.id}`);
            }}
          >
            <path d={d} fill="none" stroke="transparent" strokeWidth="12" />
            <path
              d={d}
              fill="none"
              stroke={hot ? "var(--lc-lime)" : color}
              strokeWidth={hot ? 2.6 : 1.5}
              strokeDasharray={e.dashed ? "6 4" : undefined}
              strokeLinejoin="round"
              markerEnd={e.merge ? undefined : "url(#archArrow)"}
            />
            {e.label && (
              <text
                x={e.lx}
                y={e.ly}
                fontSize="10.5"
                fill={e.owner === "product" ? "var(--impl-product)" : "var(--lc-muted)"}
                textAnchor={e.center ? "middle" : e.anchor || "start"}
                transform={e.rot ? `rotate(-90 ${e.lx} ${e.ly})` : undefined}
                stroke="#fff"
                strokeWidth="3"
                paintOrder="stroke"
              >
                <tspan fontWeight="700" fill={e.owner === "product" ? "var(--impl-product)" : "var(--lc-forest)"}>{`${e.id} `}</tspan>
                {e.label[lang]}
              </text>
            )}
          </g>
        );
      })}

      {/* Components */}
      {arch.components.map((c) => {
        const color = OWNER_COLOR[c.owner];
        const sel = selected === c.id;
        return (
          <g
            key={c.id}
            className="uc"
            opacity={isHotComp(c) ? 1 : 0.35}
            onClick={(ev) => {
              ev.stopPropagation();
              onSelect(c.id);
            }}
          >
            <rect
              x={c.x}
              y={c.y}
              width={c.w}
              height={c.h}
              rx="12"
              fill={sel ? "var(--lc-lime-soft)" : c.owner === "product" ? "#fff8eb" : c.owner === "external" ? "#f6f6f2" : "#fff"}
              stroke={sel ? "var(--lc-lime)" : color}
              strokeWidth={sel ? 2.6 : c.database ? 2 : 1.5}
              strokeDasharray={c.owner === "product" ? "6 4" : undefined}
            />
            <rect x={c.x} y={c.y + 12} width="5" height={c.h - 24} rx="2.5" fill={color} />
            <text x={c.x + 18} y={c.y + 20} fontSize="8.5" fontWeight="700" letterSpacing="1.3" fill={color}>
              {OWNER_LABEL[c.owner]}
            </text>
            {c.database && <Cylinder x={c.x + c.w - 40} y={c.y + 12} w={24} h={28} />}
            <text x={c.x + 18} y={c.y + 38} fontSize="14.5" fontWeight="600" fill="var(--lc-ink)">
              {c.title[lang]}
            </text>
            <text x={c.x + 18} y={c.y + 54} fontSize="10.5" fill="var(--lc-muted)">
              {c.sub[lang]}
            </text>
            {c.items.map((it, i) => (
              <g key={i}>
                <rect x={c.x + 18} y={c.y + 68 + i * 29} width={c.w - 36} height="23" rx="6" fill={c.owner === "product" ? "#fff" : "var(--lc-cream)"} />
                <text x={c.x + 28} y={c.y + 83.5 + i * 29} fontSize="11" fill="var(--lc-ink)">
                  {it[lang]}
                </text>
              </g>
            ))}
          </g>
        );
      })}
    </svg>
  );
});

export default ArchitectureSvg;
