import { forwardRef, useMemo } from "react";
import { PARTICIPANTS } from "../../data/sequences";

const COL = 178;
const X0 = 96;
const TOP = 96;
const ROW = 56;
const SELF_ROW = 66;
const FRAG_HEAD = 30;
const BRANCH = 26;
const FRAG_END = 14;

const OWNER_COLOR = {
  user: "var(--lc-forest)",
  itdev: "var(--impl-itdev)",
  product: "var(--impl-product)",
  external: "var(--impl-ext)",
};

function layout(seq) {
  const px = Object.fromEntries(seq.participants.map((p, i) => [p, X0 + i * COL]));
  const ys = [];
  const fragY = seq.fragments.map(() => ({}));
  let y = TOP;
  seq.messages.forEach((m, i) => {
    seq.fragments.forEach((f, fi) => {
      if (f.from === i) {
        y += FRAG_HEAD;
        fragY[fi].top = y - FRAG_HEAD + 4;
      }
      (f.branches || []).forEach((b) => {
        if (b.at === i) {
          y += BRANCH;
          (fragY[fi].branches ||= []).push({ y: y - BRANCH + 6, label: b.label });
        }
      });
    });
    y += m.kind === "self" ? SELF_ROW : ROW;
    ys.push(y - 18);
    seq.fragments.forEach((f, fi) => {
      if (f.to === i) {
        y += FRAG_END;
        fragY[fi].bottom = y - 4;
      }
    });
  });
  const width = X0 * 2 + (seq.participants.length - 1) * COL;
  return { px, ys, fragY, width, height: y + 30 };
}

const SequenceSvg = forwardRef(function SequenceSvg({ seq, lang, selected, onSelect }, ref) {
  const Lt = useMemo(() => layout(seq), [seq]);

  return (
    <svg
      ref={ref}
      className="ucd w-full h-auto"
      viewBox={`0 0 ${Lt.width} ${Lt.height}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={seq.title[lang]}
      onClick={(e) => e.target === e.currentTarget && onSelect(null)}
    >
      <defs>
        <marker id="sqFilled" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" fill="context-stroke" />
        </marker>
        <marker id="sqOpen" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto">
          <path d="M0,0 L10,5 L0,10" fill="none" stroke="context-stroke" strokeWidth="1.6" />
        </marker>
      </defs>
      <rect width={Lt.width} height={Lt.height} fill="#fff" />

      {/* fragments (behind) */}
      {seq.fragments.map((f, fi) => {
        const msgs = seq.messages.slice(f.from, f.to + 1);
        const xs = msgs.flatMap((m) => [Lt.px[m.from], Lt.px[m.to]]);
        const x1 = Math.min(...xs) - 74;
        const x2 = Math.max(...xs) + (msgs.some((m) => m.kind === "self") ? 110 : 74);
        const { top, bottom, branches = [] } = Lt.fragY[fi];
        return (
          <g key={fi}>
            <rect x={x1} y={top} width={x2 - x1} height={bottom - top} rx="6" fill="rgba(141,198,63,0.06)" stroke="var(--lc-forest)" strokeWidth="1" />
            <path d={`M${x1},${top} h52 v12 l-8,8 h-44 Z`} fill="var(--lc-forest)" />
            <text x={x1 + 8} y={top + 14} fontSize="10.5" fontWeight="700" fill="#fff">
              {f.type}
            </text>
            <text x={x1 + 60} y={top + 15} fontSize="11" fontStyle="italic" fill="var(--lc-forest)">
              [{f.label[lang]}]
            </text>
            {branches.map((b, i) => (
              <g key={i}>
                <line x1={x1} y1={b.y} x2={x2} y2={b.y} stroke="var(--lc-forest)" strokeDasharray="6 4" />
                <text x={x1 + 8} y={b.y + 14} fontSize="11" fontStyle="italic" fill="var(--lc-forest)">
                  [{b.label[lang]}]
                </text>
              </g>
            ))}
          </g>
        );
      })}

      {/* participants + lifelines */}
      {seq.participants.map((p) => {
        const meta = PARTICIPANTS[p];
        const x = Lt.px[p];
        const color = OWNER_COLOR[meta.owner];
        return (
          <g key={p}>
            <line x1={x} y1={70} x2={x} y2={Lt.height - 14} stroke="#c9ccbf" strokeDasharray="4 4" />
            <rect
              x={x - 76}
              y={14}
              width="152"
              height="56"
              rx="10"
              fill={meta.owner === "user" ? "var(--lc-forest)" : meta.owner === "product" ? "#fff8eb" : "#fff"}
              stroke={color}
              strokeWidth="1.5"
              strokeDasharray={meta.owner === "product" ? "5 3" : undefined}
            />
            <text x={x} y={38} textAnchor="middle" fontSize="12.5" fontWeight="600" fill={meta.owner === "user" ? "#fff" : "var(--lc-ink)"}>
              {meta.name[lang]}
            </text>
            <text x={x} y={55} textAnchor="middle" fontSize="9.5" fill={meta.owner === "user" ? "rgba(255,255,255,.7)" : color}>
              {meta.sub}
            </text>
          </g>
        );
      })}

      {/* messages */}
      {seq.messages.map((m, i) => {
        const y = Lt.ys[i];
        const x1 = Lt.px[m.from];
        const x2 = Lt.px[m.to];
        const isCp = !!m.cp;
        const sel = selected === i;
        const color = sel ? "var(--lc-lime)" : isCp ? "var(--impl-product)" : "var(--lc-ink)";
        const dash = m.kind === "reply" ? "6 4" : undefined;
        const marker = m.kind === "sync" ? "url(#sqFilled)" : "url(#sqOpen)";
        const click = (e) => {
          e.stopPropagation();
          onSelect(i);
        };
        if (m.kind === "self") {
          return (
            <g key={i} className="uc" onClick={click}>
              <path d={`M${x1},${y - 18} h46 v24 h-44`} fill="none" stroke={color} strokeWidth={sel ? 2.4 : 1.4} markerEnd="url(#sqFilled)" />
              <circle cx={x1 + 8} cy={y - 30} r="8" fill={isCp ? "var(--impl-product)" : "var(--lc-forest)"} />
              <text x={x1 + 8} y={y - 26.5} textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff">
                {i + 1}
              </text>
              <text x={x1 + 54} y={y - 3} fontSize="11.5" fill="var(--lc-ink)" stroke="#fff" strokeWidth="3" paintOrder="stroke">
                {m.label[lang]}
              </text>
              <rect x={x1} y={y - 40} width={COL} height="50" fill="transparent" />
            </g>
          );
        }
        const dir = x2 > x1 ? 1 : -1;
        const mid = (x1 + x2) / 2;
        return (
          <g key={i} className="uc" onClick={click}>
            <rect x={Math.min(x1, x2)} y={y - 30} width={Math.abs(x2 - x1)} height="44" fill="transparent" />
            <line x1={x1} y1={y} x2={x2 - dir * 2} y2={y} stroke={color} strokeWidth={sel ? 2.4 : 1.4} strokeDasharray={dash} markerEnd={marker} />
            <circle cx={x1 - dir * 14} cy={y} r="8" fill={isCp ? "var(--impl-product)" : m.kind === "reply" ? "var(--lc-muted)" : "var(--lc-forest)"} />
            <text x={x1 - dir * 14} y={y + 3.5} textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff">
              {i + 1}
            </text>
            <text x={mid} y={y - 7} textAnchor="middle" fontSize="11.5" fontWeight={m.kind === "reply" ? 400 : 500} fill="var(--lc-ink)" stroke="#fff" strokeWidth="3" paintOrder="stroke">
              {m.label[lang]}
            </text>
            {m.ref && (
              <text x={mid} y={y + 14} textAnchor="middle" fontSize="9.5" fill={isCp ? "var(--impl-product)" : "var(--lc-muted)"} fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" stroke="#fff" strokeWidth="3" paintOrder="stroke">
                {m.ref.length > 52 ? m.ref.slice(0, 51) + "…" : m.ref}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
});

export default SequenceSvg;
