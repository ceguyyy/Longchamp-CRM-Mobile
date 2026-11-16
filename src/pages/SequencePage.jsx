import { useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Card, Chip, Separator, Table, Tabs } from "@heroui/react";
import sequences, { PARTICIPANTS } from "../data/sequences";
import { CP_BACKLOG } from "../data/cekatProduct";
import ucModel from "../data/useCases";
import SequenceSvg from "../components/sequence/SequenceSvg";
import { OwnerChip } from "../components/SourceBadges";
import { downloadSvg } from "../utils/downloadSvg";

const OWNER_SHORT = { itdev: "IT Dev", product: "Cekat Product", external: "External" };

/** Who builds a message: Cekat Product if it carries a CP item, else the owner of the receiving side (or sender for replies). */
function ownerOf(m) {
  if (m.cp) return "product";
  const side = m.kind === "reply" ? m.from : m.to;
  const o = PARTICIPANTS[side].owner;
  return o === "user" ? "itdev" : o;
}

function MessageDetail({ seq, index, lang, t }) {
  if (index === null || index === undefined) {
    return <p className="text-sm text-[var(--lc-muted)]">{t.sd.clickHint}</p>;
  }
  const m = seq.messages[index];
  const owner = ownerOf(m);
  const cp = m.cp && CP_BACKLOG.find((c) => c.id === m.cp);
  return (
    <>
      <div>
        <p className="text-[11px] font-semibold tracking-widest text-[var(--lc-muted)]">
          {seq.id} · #{index + 1} · {t.sd.kind[m.kind]}
        </p>
        <h3 className="font-display mt-1 text-2xl font-semibold text-[var(--lc-forest)]">{m.label[lang]}</h3>
        <p className="mt-1 text-sm text-[var(--lc-muted)]">
          {PARTICIPANTS[m.from].name[lang]} → {PARTICIPANTS[m.to].name[lang]}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <OwnerChip owner={owner}>{owner === "product" ? `Cekat Product · ${m.cp}` : OWNER_SHORT[owner]}</OwnerChip>
        {m.verify && (
          <Chip size="sm" variant="soft" color="warning">
            {t.verify}
          </Chip>
        )}
      </div>
      {m.ref && (
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--lc-muted)]">{t.sd.endpoint}</p>
          <code className="block break-words rounded-lg bg-[var(--lc-cream)] px-3 py-2 text-[12px]">{m.ref}</code>
        </div>
      )}
      {m.note && <p className="text-[12.5px] leading-snug text-[var(--lc-muted)]">{m.note}</p>}
      {m.payload && (
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--lc-muted)]">
            {m.kind === "reply" ? t.sd.response : t.sd.request}
          </p>
          <pre className="max-h-[420px] overflow-auto rounded-xl bg-[var(--lc-forest)] p-3 text-[11.5px] leading-relaxed text-[#e9f3d8]">
            {JSON.stringify(m.payload, null, 2)}
          </pre>
        </div>
      )}
      {cp && (
        <div className="rounded-xl border border-dashed border-[var(--impl-product)] bg-[#fff8eb] p-3">
          <p className="text-sm font-semibold">
            {cp.id} · {cp.title[lang]}
          </p>
          <p className="mt-1 text-[12.5px] leading-snug text-[var(--lc-muted)]">{cp.desc[lang]}</p>
        </div>
      )}
    </>
  );
}

function EndpointTable({ lang, t, onPick }) {
  const rows = useMemo(() => {
    const seen = new Map();
    sequences.forEach((s) =>
      s.messages.forEach((m, i) => {
        if (!m.ref || m.kind === "reply" || !/^(GET|POST|PATCH|PUT|DELETE|Odoo)/.test(m.ref)) return;
        const key = `${m.from}>${m.to}>${m.ref.split("?")[0]}`;
        if (!seen.has(key)) seen.set(key, { m, uses: [] });
        seen.get(key).uses.push({ sid: s.id, i });
      })
    );
    return [...seen.values()];
  }, []);

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label={t.sd.endpoints} className="min-w-[1000px]">
          <Table.Header>
            <Table.Column isRowHeader>{t.sd.endpoint}</Table.Column>
            <Table.Column>{t.sd.fromTo}</Table.Column>
            <Table.Column>{t.col.status}</Table.Column>
            <Table.Column>{t.sd.usedIn}</Table.Column>
          </Table.Header>
          <Table.Body>
            {rows.map(({ m, uses }, idx) => {
              const owner = ownerOf(m);
              return (
                <Table.Row key={idx} id={String(idx)}>
                  <Table.Cell>
                    <code className="text-[12px]">{m.ref.split("?")[0]}</code>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-sm">
                      {PARTICIPANTS[m.from].name[lang]} → {PARTICIPANTS[m.to].name[lang]}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="inline-flex flex-wrap items-center gap-1">
                      <OwnerChip owner={owner}>{owner === "product" ? `Cekat Product · ${m.cp}` : OWNER_SHORT[owner]}</OwnerChip>
                      {m.verify && <span className="text-[11px] text-[var(--lc-muted)]">· {t.verify}</span>}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="flex flex-wrap gap-1">
                      {uses.map((u) => (
                        <button key={u.sid + u.i} onClick={() => onPick(u.sid, u.i)}>
                          <Chip size="sm" variant="secondary" className="cursor-pointer">
                            {u.sid} #{u.i + 1}
                          </Chip>
                        </button>
                      ))}
                    </span>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}

export default function SequencePage({ lang, t }) {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const current = params.get("d") || sequences[0].id;
  const seq = sequences.find((s) => s.id === current) || sequences[0];
  const [selected, setSelected] = useState(null);
  const svgRef = useRef(null);

  const switchTo = (id, msg = null) => {
    setSelected(msg);
    setParams({ d: id });
  };

  return (
    <div className="mx-auto max-w-[1680px] px-4 pb-16 pt-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="tracking-brand text-[11px] font-semibold text-[var(--lc-muted)]">SEQUENCE DIAGRAMS · v{ucModel.meta.version}</p>
          <h1 className="font-display mt-1 text-4xl font-semibold text-[var(--lc-forest)] sm:text-5xl">{t.sd.title}</h1>
          <p className="mt-2 max-w-3xl text-sm text-[var(--lc-muted)]">{t.sd.subtitle}</p>
        </div>
        <Button variant="outline" size="sm" onPress={() => downloadSvg(svgRef.current, `longchamp-${seq.id.toLowerCase()}.svg`)}>
          {t.download}
        </Button>
      </div>

      <Tabs className="mt-6" selectedKey={seq.id} onSelectionChange={(k) => switchTo(String(k))}>
        <Tabs.ListContainer className="overflow-x-auto">
          <Tabs.List aria-label="Sequence diagrams">
            {sequences.map((s) => (
              <Tabs.Tab key={s.id} id={s.id} className="whitespace-nowrap">
                <span className="mr-1.5 text-[11px] font-semibold opacity-60">{s.id}</span>
                {s.title[lang]}
                <Tabs.Indicator />
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <p className="mr-2 max-w-4xl text-sm leading-relaxed">{seq.desc[lang]}</p>
        {seq.refs.map((r) => (
          <button key={r} onClick={() => navigate(r.startsWith("UC") ? `/use-case?uc=${r}` : `/activity?d=${r}`)}>
            <Chip size="sm" variant="secondary" className="cursor-pointer">
              {r}
            </Chip>
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <div style={{ minWidth: seq.participants.length * 150 }}>
              <SequenceSvg ref={svgRef} seq={seq} lang={lang} selected={selected} onSelect={setSelected} />
            </div>
          </div>
        </Card>
        <div>
          <Card className="lg:sticky lg:top-4">
            <Card.Content className="flex flex-col gap-4 p-5">
              <MessageDetail seq={seq} index={selected} lang={lang} t={t} />
              <Separator />
              <div className="flex flex-col gap-1.5 text-[12px] text-[var(--lc-muted)]">
                <span className="flex items-center gap-2">
                  <svg width="44" height="10"><line x1="0" y1="5" x2="36" y2="5" stroke="var(--lc-ink)" strokeWidth="1.4" /><path d="M34,1 L42,5 L34,9 Z" fill="var(--lc-ink)" /></svg>
                  {t.sd.kind.sync}
                </span>
                <span className="flex items-center gap-2">
                  <svg width="44" height="10"><line x1="0" y1="5" x2="40" y2="5" stroke="var(--lc-ink)" strokeWidth="1.4" /><path d="M34,1 L42,5 L34,9" fill="none" stroke="var(--lc-ink)" strokeWidth="1.4" /></svg>
                  {t.sd.kind.async}
                </span>
                <span className="flex items-center gap-2">
                  <svg width="44" height="10"><line x1="0" y1="5" x2="40" y2="5" stroke="var(--lc-ink)" strokeWidth="1.4" strokeDasharray="6 4" /><path d="M34,1 L42,5 L34,9" fill="none" stroke="var(--lc-ink)" strokeWidth="1.4" /></svg>
                  {t.sd.kind.reply}
                </span>
                <span className="flex items-center gap-2">
                  <svg width="44" height="10"><line x1="0" y1="5" x2="36" y2="5" stroke="var(--impl-product)" strokeWidth="1.4" /><path d="M34,1 L42,5 L34,9 Z" fill="var(--impl-product)" /></svg>
                  {t.sd.cpLegend}
                </span>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold text-[var(--lc-forest)]">{t.sd.endpoints}</h2>
        <p className="mb-4 mt-1 text-sm text-[var(--lc-muted)]">{t.sd.endpointsDesc}</p>
        <EndpointTable
          lang={lang}
          t={t}
          onPick={(sid, i) => {
            switchTo(sid, i);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </section>
    </div>
  );
}
