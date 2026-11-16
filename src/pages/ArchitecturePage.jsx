import { useRef, useState } from "react";
import { Button, Card, Separator, Table } from "@heroui/react";
import arch from "../data/architecture";
import ucModel from "../data/useCases";
import ArchitectureSvg from "../components/architecture/ArchitectureSvg";
import { OwnerChip } from "../components/SourceBadges";
import { downloadSvg } from "../utils/downloadSvg";

const OWNER_SHORT = { itdev: "IT Dev", product: "Cekat Product", external: "External" };
const compName = (id, lang) => arch.components.find((c) => c.id === id)?.title[lang] ?? id;

function Detail({ selected, lang, t }) {
  if (!selected) return <p className="text-sm text-[var(--lc-muted)]">{t.arch.clickHint}</p>;

  if (selected.startsWith("e")) {
    const e = arch.edges.find((x) => `e${x.id}` === selected);
    return (
      <>
        <div>
          <p className="text-[11px] font-semibold tracking-widest text-[var(--lc-muted)]">
            {t.arch.interface} #{e.id}
          </p>
          <h3 className="font-display mt-1 text-2xl font-semibold text-[var(--lc-forest)]">
            {compName(e.from, lang)} → {compName(e.to, lang)}
          </h3>
        </div>
        <OwnerChip owner={e.owner}>{OWNER_SHORT[e.owner]}</OwnerChip>
        <dl className="grid grid-cols-[96px_1fr] gap-x-3 gap-y-2 text-sm">
          <dt className="text-[var(--lc-muted)]">{t.arch.cols.proto}</dt>
          <dd>{e.proto}</dd>
          <dt className="text-[var(--lc-muted)]">{t.arch.cols.auth}</dt>
          <dd>{e.auth}</dd>
          <dt className="text-[var(--lc-muted)]">{t.arch.cols.trigger}</dt>
          <dd>{e.trigger[lang]}</dd>
        </dl>
      </>
    );
  }

  const c = arch.components.find((x) => x.id === selected);
  const links = arch.edges.filter((e) => e.from === c.id || e.to === c.id);
  return (
    <>
      <div>
        <h3 className="font-display text-2xl font-semibold text-[var(--lc-forest)]">{c.title[lang]}</h3>
        <p className="mt-1 text-sm text-[var(--lc-muted)]">{c.sub[lang]}</p>
      </div>
      <OwnerChip owner={c.owner}>{OWNER_SHORT[c.owner]}</OwnerChip>
      <p className="text-sm leading-relaxed">{c.desc[lang]}</p>
      {links.length > 0 && (
        <>
          <Separator />
          <ul className="flex flex-col gap-1.5">
            {links.map((e) => (
              <li key={e.id} className="text-[13px]">
                <span className="mr-1.5 font-semibold text-[var(--lc-forest)]">#{e.id}</span>
                {e.from === c.id ? `→ ${compName(e.to, lang)}` : `← ${compName(e.from, lang)}`}
                <span className="text-[var(--lc-muted)]"> · {e.proto}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

export default function ArchitecturePage({ lang, t }) {
  const [selected, setSelected] = useState(null);
  const svgRef = useRef(null);

  return (
    <div className="mx-auto max-w-[1680px] px-4 pb-16 pt-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="tracking-brand text-[11px] font-semibold text-[var(--lc-muted)]">ARCHITECTURE · v{ucModel.meta.version}</p>
          <h1 className="font-display mt-1 text-4xl font-semibold text-[var(--lc-forest)] sm:text-5xl">{t.arch.title}</h1>
          <p className="mt-2 max-w-3xl text-sm text-[var(--lc-muted)]">{t.arch.subtitle}</p>
        </div>
        <Button variant="outline" size="sm" onPress={() => downloadSvg(svgRef.current, "longchamp-architecture.svg")}>
          {t.download}
        </Button>
      </div>

      {/* Three principles */}
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {t.arch.principles.map((p, i) => (
          <div key={i} className="flex gap-3 rounded-2xl border border-[var(--lc-line)] bg-white p-4">
            <span className="font-display text-3xl leading-none text-[var(--lc-lime)]">{i + 1}</span>
            <div>
              <p className="text-sm font-semibold">{p.title}</p>
              <p className="mt-1 text-[13px] leading-snug text-[var(--lc-muted)]">{p.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[1150px]">
              <ArchitectureSvg ref={svgRef} arch={arch} lang={lang} selected={selected} onSelect={setSelected} />
            </div>
          </div>
        </Card>
        <div>
          <Card className="lg:sticky lg:top-4">
            <Card.Content className="flex flex-col gap-4 p-5">
              <Detail selected={selected} lang={lang} t={t} />
            </Card.Content>
          </Card>
        </div>
      </div>

      {/* Interfaces */}
      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold text-[var(--lc-forest)]">{t.arch.interfaces}</h2>
        <p className="mb-4 mt-1 text-sm text-[var(--lc-muted)]">{t.arch.interfacesDesc}</p>
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label={t.arch.interfaces} className="min-w-[960px]">
              <Table.Header>
                <Table.Column isRowHeader>#</Table.Column>
                <Table.Column>{t.arch.cols.flow}</Table.Column>
                <Table.Column>{t.arch.cols.proto}</Table.Column>
                <Table.Column>{t.arch.cols.auth}</Table.Column>
                <Table.Column>{t.arch.cols.trigger}</Table.Column>
                <Table.Column>{t.col.status}</Table.Column>
              </Table.Header>
              <Table.Body>
                {arch.edges.map((e) => (
                  <Table.Row key={e.id} id={String(e.id)}>
                    <Table.Cell>
                      <button className="font-semibold text-[var(--lc-forest)] hover:underline" onClick={() => { setSelected(`e${e.id}`); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                        {e.id}
                      </button>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-sm">
                        {compName(e.from, lang)} → {compName(e.to, lang)}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <code className="text-[12px]">{e.proto}</code>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-sm">{e.auth}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-sm">{e.trigger[lang]}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <OwnerChip owner={e.owner}>{OWNER_SHORT[e.owner]}</OwnerChip>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </section>

      {/* Data ownership */}
      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold text-[var(--lc-forest)]">{t.arch.data}</h2>
        <p className="mb-4 mt-1 text-sm text-[var(--lc-muted)]">{t.arch.dataDesc}</p>
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label={t.arch.data} className="min-w-[900px]">
              <Table.Header>
                <Table.Column isRowHeader>{t.arch.cols.entity}</Table.Column>
                <Table.Column>{t.arch.cols.store}</Table.Column>
                <Table.Column>{t.arch.cols.writers}</Table.Column>
                <Table.Column>{t.arch.cols.readers}</Table.Column>
              </Table.Header>
              <Table.Body>
                {arch.dataOwnership.map((d, i) => (
                  <Table.Row key={i} id={String(i)}>
                    <Table.Cell>
                      <span className="text-sm font-medium">{d.entity[lang]}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <code className="text-[12px]">{d.store}</code>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-sm">{d.writers}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-sm">{d.readers}</span>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </section>
    </div>
  );
}
