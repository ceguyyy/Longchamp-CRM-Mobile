import { Chip } from "@heroui/react";
import { SOURCE_COLORS } from "./diagram/layout";
import { ownerOf } from "../data/cekatProduct";

const tint = (color, pct = 12) => `color-mix(in oklab, ${color} ${pct}%, white)`;

export function TypeChip({ type }) {
  const color = SOURCE_COLORS[type] || "var(--lc-muted)";
  return (
    <Chip size="sm" variant="soft" className="font-medium" style={{ color, backgroundColor: tint(color) }}>
      {type}
    </Chip>
  );
}

export const IMPL_COLOR = { itdev: "var(--impl-itdev)", product: "var(--impl-product)", external: "var(--impl-ext)" };

export function OwnerChip({ owner, children }) {
  const color = IMPL_COLOR[owner];
  return (
    <Chip
      size="sm"
      variant="soft"
      className="font-semibold"
      style={{ color, backgroundColor: tint(color, 14), border: `1px solid ${tint(color, 40)}` }}
    >
      {children}
    </Chip>
  );
}

/** Implementor + availability for one data source line. */
export function StatusChip({ src, t }) {
  const owner = ownerOf(src.status);
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      <OwnerChip owner={owner}>{owner === "product" ? `Cekat Product · ${src.cp}` : "IT Dev"}</OwnerChip>
      <span className="text-[11px] text-[var(--lc-muted)]">
        {t.status[src.status]}
        {src.verify && ` · ${t.verify}`}
      </span>
    </span>
  );
}

const SCOPE_STYLE = {
  own: "var(--lc-forest)",
  boutique: "var(--lc-forest)",
  all: "var(--lc-forest)",
  use: "var(--lc-muted)",
  manage: "var(--impl-product)",
};

export function ScopeChip({ scope, t }) {
  if (scope === "none") return <span className="text-[var(--lc-line)]">—</span>;
  const color = SCOPE_STYLE[scope];
  return (
    <Chip size="sm" variant="soft" style={{ color, backgroundColor: tint(color, 10) }}>
      {t.scope[scope]}
    </Chip>
  );
}
