import { Card, Chip } from "@heroui/react";
import { CP_BACKLOG } from "../data/cekatProduct";
import ucModel from "../data/useCases";
import activities from "../data/activities";
import { OwnerChip } from "./SourceBadges";

/** Where each CP item is needed — derived from use case sources and activity nodes. */
function usage(cpId) {
  const ucs = ucModel.useCases.filter((u) => u.sources.some((s) => s.cp === cpId)).map((u) => u.id);
  const ads = activities.diagrams.filter((d) => d.nodes.some((n) => n.cp === cpId)).map((d) => d.id);
  return [...ucs, ...ads];
}

export default function CpBacklog({ lang, t, onPick }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {CP_BACKLOG.map((cp) => (
        <Card key={cp.id} className="border border-[color-mix(in_oklab,var(--impl-product)_35%,white)]">
          <Card.Content className="flex flex-col gap-2 p-4">
            <div className="flex items-center gap-2">
              <OwnerChip owner="product">{cp.id}</OwnerChip>
              <Chip size="sm" variant="soft" color={cp.priority === "Must" ? "danger" : "default"}>
                {cp.priority}
              </Chip>
            </div>
            <p className="text-[15px] font-semibold text-[var(--lc-ink)]">{cp.title[lang]}</p>
            <p className="text-[13px] leading-relaxed text-[var(--lc-muted)]">{cp.desc[lang]}</p>
            <div className="mt-1 flex flex-wrap items-center gap-1">
              <span className="text-[11px] text-[var(--lc-muted)]">{t.neededBy}:</span>
              {usage(cp.id).map((id) => (
                <button key={id} onClick={() => onPick?.(id)}>
                  <Chip size="sm" variant="secondary" className="cursor-pointer">
                    {id}
                  </Chip>
                </button>
              ))}
            </div>
          </Card.Content>
        </Card>
      ))}
    </div>
  );
}
