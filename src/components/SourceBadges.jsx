import { Chip } from "@heroui/react";
import { SOURCE_COLORS } from "./diagram/layout";

export function TypeChip({ type }) {
  const color = SOURCE_COLORS[type] || "var(--lc-muted)";
  return (
    <Chip
      size="sm"
      variant="soft"
      className="font-medium"
      style={{ color, backgroundColor: `color-mix(in oklab, ${color} 12%, white)` }}
    >
      {type}
    </Chip>
  );
}

const STATUS_COLOR = { confirmed: "success", confirm: "warning", internal: "default" };

export function StatusChip({ status, t }) {
  return (
    <Chip size="sm" variant="soft" color={STATUS_COLOR[status]}>
      {t.status[status]}
    </Chip>
  );
}
