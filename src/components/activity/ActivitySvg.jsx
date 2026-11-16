import { forwardRef, useMemo } from "react";
import { AD, layoutActivity } from "./activityLayout";
import { LANES } from "../../data/activities";

const OWNER_COLOR = {
  user: "var(--lc-forest)",
  itdev: "var(--impl-itdev)",
  product: "var(--impl-product)",
  external: "var(--impl-ext)",
};
const OWNER_LABEL = { user: "", itdev: "IT DEV", product: "CEKAT PRODUCT", external: "EXTERNAL" };
const NODE_FILL = { user: "#ffffff", itdev: "#ffffff", product: "#fff8eb", external: "#f4f4f1" };

const ActivitySvg = forwardRef(function ActivitySvg({ diagram, lang, selected, onSelect }, ref) {
  const L = useMemo(() => layoutActivity(diagram, lang), [diagram, lang]);

  return (
    <svg
      ref={ref}
      className="ucd w-full h-auto"
      viewBox={`0 0 ${L.width} ${L.height}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={diagram.title[lang]}
      onClick={(e) => e.target === e.currentTarget && onSelect(null)}
    >
      <defs>
        <marker id="adArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 Z" fill="var(--lc-ink)" />
        </marker>
      </defs>

      <rect width={L.width} height={L.height} fill="#fff" />

      {/* Lanes */}
      {diagram.lanes.map((lid, i) => {
        const lane = LANES[lid];
        const color = OWNER_COLOR[lane.owner];
        const x = i * AD.laneW;
        return (
          <g key={lid}>
            <rect x={x} y={0} width={AD.laneW} height={L.height} fill={lane.owner === "product" ? "#fffcf5" : i % 2 ? "#fbfaf6" : "#ffffff"} />
            <line x1={x} y1={0} x2={x} y2={L.height} stroke="var(--lc-line)" />
            <rect x={x} y={0} width={AD.laneW} height={AD.headerH} fill={lane.owner === "user" ? "var(--lc-forest)" : "#fff"} />
            <rect x={x} y={AD.headerH - 4} width={AD.laneW} height="4" fill={color} />
            {OWNER_LABEL[lane.owner] && (
              <text x={x + 14} y={20} fontSize="9" fontWeight="700" letterSpacing="1.4" fill={color}>
                {OWNER_LABEL[lane.owner]}
              </text>
            )}
            <text x={x + 14} y={lane.owner === "user" ? 32 : 40} fontSize="13.5" fontWeight="600" fill={lane.owner === "user" ? "#fff" : "var(--lc-ink)"}>
              {lane.name[lang]}
            </text>
            <text x={x + 14} y={lane.owner === "user" ? 50 : 56} fontSize="10" fill={lane.owner === "user" ? "rgba(255,255,255,.7)" : "var(--lc-muted)"}>
              {lane.sub[lang]}
            </text>
          </g>
        );
      })}
      <line x1={L.width - 0.5} y1={0} x2={L.width - 0.5} y2={L.height} stroke="var(--lc-line)" />
      <line x1={0} y1={AD.headerH} x2={L.width} y2={AD.headerH} stroke="var(--lc-line)" />

      {/* Edges */}
      {L.edges.map((e) => {
        const hot = selected && (e.from === selected || e.to === selected);
        return (
          <g key={e.id}>
            <path
              d={e.d}
              fill="none"
              stroke={hot ? "var(--lc-lime)" : "var(--lc-ink)"}
              strokeWidth={hot ? 2.4 : 1.3}
              strokeLinejoin="round"
              markerEnd="url(#adArrow)"
              opacity={selected && !hot ? 0.35 : 0.85}
            />
            {e.label && (
              <text
                x={e.lx}
                y={e.ly}
                fontSize="10.5"
                fontStyle="italic"
                fill="var(--lc-muted)"
                textAnchor={e.anchor}
                stroke="#fff"
                strokeWidth="3"
                paintOrder="stroke"
              >
                {`[${e.label[lang]}]`}
              </text>
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {Object.values(L.nodes).map((n) => {
        const owner = LANES[n.lane].owner;
        const color = OWNER_COLOR[owner];
        const isSel = selected === n.id;
        const click = (ev) => {
          ev.stopPropagation();
          onSelect(n.id);
        };
        if (n.type === "start")
          return <circle key={n.id} cx={n.cx} cy={n.cy} r="12" fill="var(--lc-ink)" />;
        if (n.type === "end")
          return (
            <g key={n.id}>
              <circle cx={n.cx} cy={n.cy} r="13" fill="#fff" stroke="var(--lc-ink)" strokeWidth="2" />
              <circle cx={n.cx} cy={n.cy} r="8" fill="var(--lc-ink)" />
            </g>
          );
        if (n.type === "merge")
          return (
            <path
              key={n.id}
              d={`M${n.cx},${n.top} L${n.right},${n.cy} L${n.cx},${n.bottom} L${n.left},${n.cy} Z`}
              fill="#fff"
              stroke="var(--lc-ink)"
              strokeWidth="1.4"
            />
          );
        if (n.type === "decision") {
          return (
            <g key={n.id} className="uc" onClick={click}>
              <path
                d={`M${n.cx},${n.top} L${n.right},${n.cy} L${n.cx},${n.bottom} L${n.left},${n.cy} Z`}
                fill={isSel ? "var(--lc-lime-soft)" : NODE_FILL[owner]}
                stroke={isSel ? "var(--lc-lime)" : color}
                strokeWidth={isSel ? 2.4 : 1.5}
              />
              {n.lines.map((ln, i) => (
                <text key={i} x={n.cx} y={n.cy + 4 + (i - (n.lines.length - 1) / 2) * 13} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--lc-ink)">
                  {ln}
                </text>
              ))}
            </g>
          );
        }
        // action
        const textTop = n.cy - ((n.lines.length - 1) * 14) / 2 + 4;
        return (
          <g key={n.id} className="uc" onClick={click}>
            <rect
              x={n.left}
              y={n.top}
              width={n.w}
              height={n.h}
              rx="14"
              fill={isSel ? "var(--lc-lime-soft)" : NODE_FILL[owner]}
              stroke={isSel ? "var(--lc-lime)" : color}
              strokeWidth={isSel ? 2.4 : 1.5}
              strokeDasharray={owner === "product" ? "5 3" : undefined}
            />
            {n.lines.map((ln, i) => (
              <text key={i} x={n.cx} y={textTop + i * 14} textAnchor="middle" fontSize="11.5" fill="var(--lc-ink)">
                {ln}
              </text>
            ))}
            {n.cp && (
              <g>
                <rect x={n.right - 46} y={n.top - 9} width="44" height="17" rx="8.5" fill="var(--impl-product)" />
                <text x={n.right - 24} y={n.top + 3} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#fff">
                  {n.cp}
                </text>
              </g>
            )}
            {n.ref && !n.cp && <circle cx={n.right - 9} cy={n.top + 9} r="3.5" fill="var(--src-api)" />}
          </g>
        );
      })}
    </svg>
  );
});

export default ActivitySvg;
