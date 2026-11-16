import { useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button, Card, Chip, Separator, Tabs } from "@heroui/react";
import activities, { LANES } from "../data/activities";
import { CP_BACKLOG } from "../data/cekatProduct";
import ucModel from "../data/useCases";
import ActivitySvg from "../components/activity/ActivitySvg";
import CpBacklog from "../components/CpBacklog";
import { OwnerChip } from "../components/SourceBadges";
import { downloadSvg } from "../utils/downloadSvg";

const OWNER_SHORT = { itdev: "IT Dev", product: "Cekat Product", external: "External", user: null };

function NodeDetail({ diagram, nodeId, lang, t }) {
  if (!nodeId) {
    // summary: steps per implementor
    const counts = { itdev: 0, product: 0, external: 0, user: 0 };
    diagram.nodes
      .filter((n) => n.type === "action" || n.type === "decision")
      .forEach((n) => counts[LANES[n.lane].owner]++);
    const cps = [...new Set(diagram.nodes.filter((n) => n.cp).map((n) => n.cp))];
    return (
      <>
        <p className="text-sm text-[var(--lc-muted)]">{t.ad.clickNode}</p>
        <Separator />
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--lc-muted)]">{t.implSplit}</p>
        <ul className="flex flex-col gap-2">
          {["itdev", "product", "external", "user"].map((k) =>
            counts[k] ? (
              <li key={k} className="flex items-center justify-between">
                {OWNER_SHORT[k] ? <OwnerChip owner={k}>{OWNER_SHORT[k]}</OwnerChip> : <span className="text-sm">{t.ad.actorSteps}</span>}
                <span className="font-display text-2xl text-[var(--lc-forest)]">{counts[k]}</span>
              </li>
            ) : null
          )}
        </ul>
        {cps.length > 0 && (
          <>
            <Separator />
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--lc-muted)]">{t.ad.blockedBy}</p>
            <ul className="flex flex-col gap-2">
              {cps.map((id) => {
                const cp = CP_BACKLOG.find((c) => c.id === id);
                return (
                  <li key={id} className="flex items-start gap-2">
                    <OwnerChip owner="product">{id}</OwnerChip>
                    <span className="text-[13px] leading-snug">{cp.title[lang]}</span>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </>
    );
  }

  const n = diagram.nodes.find((x) => x.id === nodeId);
  const lane = LANES[n.lane];
  const cp = n.cp && CP_BACKLOG.find((c) => c.id === n.cp);
  return (
    <>
      <div>
        <p className="text-[11px] font-semibold tracking-widest text-[var(--lc-muted)]">
          {diagram.id} · {lane.name[lang].toUpperCase()}
        </p>
        <h3 className="font-display mt-1 text-2xl font-semibold text-[var(--lc-forest)]">{n.label?.[lang] ?? n.type}</h3>
      </div>
      {OWNER_SHORT[lane.owner] && (
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[var(--lc-muted)]">{t.ad.builtBy}</span>
          <OwnerChip owner={lane.owner}>{OWNER_SHORT[lane.owner]}</OwnerChip>
        </div>
      )}
      {n.ref && (
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--lc-muted)]">{t.ad.uses}</p>
          <code className="block rounded-lg bg-[var(--lc-cream)] px-3 py-2 text-[12px]">{n.ref}</code>
        </div>
      )}
      {cp && (
        <div className="rounded-xl border border-dashed border-[var(--impl-product)] bg-[#fff8eb] p-3">
          <div className="flex items-center gap-2">
            <OwnerChip owner="product">{cp.id}</OwnerChip>
            <Chip size="sm" variant="soft" color={cp.priority === "Must" ? "danger" : "default"}>
              {cp.priority}
            </Chip>
          </div>
          <p className="mt-2 text-sm font-semibold">{cp.title[lang]}</p>
          <p className="mt-1 text-[12.5px] leading-snug text-[var(--lc-muted)]">{cp.desc[lang]}</p>
        </div>
      )}
    </>
  );
}

export default function ActivityPage({ lang, t }) {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const current = params.get("d") || activities.diagrams[0].id;
  const diagram = activities.diagrams.find((d) => d.id === current) || activities.diagrams[0];
  const [selected, setSelected] = useState(null);
  const svgRef = useRef(null);

  const switchTo = (id) => {
    setSelected(null);
    setParams({ d: id });
  };

  return (
    <div className="mx-auto max-w-[1680px] px-4 pb-16 pt-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="tracking-brand text-[11px] font-semibold text-[var(--lc-muted)]">ACTIVITY DIAGRAMS · v{ucModel.meta.version}</p>
          <h1 className="font-display mt-1 text-4xl font-semibold text-[var(--lc-forest)] sm:text-5xl">{t.ad.title}</h1>
          <p className="mt-2 max-w-3xl text-sm text-[var(--lc-muted)]">{t.ad.subtitle}</p>
        </div>
        <Button variant="outline" size="sm" onPress={() => downloadSvg(svgRef.current, `longchamp-${diagram.id.toLowerCase()}.svg`)}>
          {t.download}
        </Button>
      </div>

      <Tabs className="mt-6" selectedKey={diagram.id} onSelectionChange={(k) => switchTo(String(k))}>
        <Tabs.ListContainer className="overflow-x-auto">
          <Tabs.List aria-label="Activity diagrams">
            {activities.diagrams.map((d) => (
              <Tabs.Tab key={d.id} id={d.id} className="whitespace-nowrap">
                <span className="mr-1.5 text-[11px] font-semibold opacity-60">{d.id}</span>
                {d.title[lang]}
                <Tabs.Indicator />
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <p className="mr-2 max-w-4xl text-sm leading-relaxed">{diagram.desc[lang]}</p>
        {diagram.ucs.map((u) => (
          <button key={u} onClick={() => navigate(`/use-case?uc=${u}`)}>
            <Chip size="sm" variant="secondary" className="cursor-pointer">
              {u}
            </Chip>
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <div style={{ minWidth: diagram.lanes.length * 190 }}>
              <ActivitySvg ref={svgRef} diagram={diagram} lang={lang} selected={selected} onSelect={setSelected} />
            </div>
          </div>
        </Card>
        <div>
          <Card className="lg:sticky lg:top-4">
            <Card.Content className="flex flex-col gap-4 p-5">
              <NodeDetail diagram={diagram} nodeId={selected} lang={lang} t={t} />
            </Card.Content>
          </Card>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold text-[var(--lc-forest)]">{t.backlog}</h2>
        <p className="mb-4 mt-1 text-sm text-[var(--lc-muted)]">{t.backlogDesc}</p>
        <CpBacklog
          lang={lang}
          t={t}
          onPick={(id) => {
            if (id.startsWith("AD")) {
              switchTo(id);
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else navigate(`/use-case?uc=${id}`);
          }}
        />
      </section>
    </div>
  );
}
