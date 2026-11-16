import { useMemo, useRef, useState } from "react";
import { Button, Card, Chip, Table, ToggleButton, ToggleButtonGroup } from "@heroui/react";
import erd, { DOMAINS } from "../data/erd";
import ucModel from "../data/useCases";
import ErdSvg from "../components/erd/ErdSvg";
import { downloadSvg } from "../utils/downloadSvg";

const WRITER_COLOR = {
  n8n: "var(--src-workflow)",
  app: "var(--lc-forest)",
  admin: "var(--impl-product)",
  cekat: "var(--impl-itdev)",
  system: "var(--lc-muted)",
};
const KEY_COLOR = { PK: "success", FK: "accent", UQ: "warning", IDX: "default" };

const fmt = (v) => (v === null || v === undefined ? "null" : typeof v === "string" ? v : JSON.stringify(v));

function sampleJson(entity) {
  const obj = {};
  entity.fields.forEach((f) => (obj[f.name] = f.example ?? null));
  return JSON.stringify(obj, null, 2);
}

function download(name, text, type) {
  const blob = new Blob([text], { type });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

function exportCsv() {
  const head = ["entity", "cekat_object", "status", "field", "logical_type", "cekat_column_type", "key", "required", "default", "writer", "description", "example"];
  const esc = (s) => `"${String(s ?? "").replace(/"/g, '""')}"`;
  const rows = erd.entities.flatMap((e) =>
    e.fields.map((f) =>
      [e.id, e.cekat, e.status, f.name, f.type, f.cekat, f.key, f.required ? "Y" : "N", f.dflt, f.writer, f.desc, fmt(f.example)].map(esc).join(",")
    )
  );
  download(`longchamp-data-dictionary-v${ucModel.meta.version}.csv`, [head.join(","), ...rows].join("\n"), "text/csv");
}

function WriterChip({ w }) {
  const c = WRITER_COLOR[w];
  return (
    <Chip size="sm" variant="soft" style={{ color: c, backgroundColor: `color-mix(in oklab, ${c} 12%, white)` }}>
      {w}
    </Chip>
  );
}

function FieldTable({ fields, t, showEntity }) {
  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Fields" className="min-w-[1100px]">
          <Table.Header>
            {showEntity && <Table.Column>{t.erd.cols.entity}</Table.Column>}
            <Table.Column isRowHeader>{t.erd.cols.field}</Table.Column>
            <Table.Column>{t.erd.cols.type}</Table.Column>
            <Table.Column>{t.erd.cols.cekat}</Table.Column>
            <Table.Column>{t.erd.cols.key}</Table.Column>
            <Table.Column>{t.erd.cols.req}</Table.Column>
            <Table.Column>{t.erd.cols.writer}</Table.Column>
            <Table.Column>{t.erd.cols.desc}</Table.Column>
            <Table.Column>{t.erd.cols.example}</Table.Column>
          </Table.Header>
          <Table.Body>
            {fields.map(({ f, e }) => (
              <Table.Row key={`${e.id}.${f.name}`} id={`${e.id}.${f.name}`}>
                {showEntity && (
                  <Table.Cell>
                    <code className="text-[12px] text-[var(--lc-muted)]">{e.id}</code>
                  </Table.Cell>
                )}
                <Table.Cell>
                  <code className={`text-[12.5px] ${f.required ? "font-semibold" : ""}`}>{f.name}</code>
                </Table.Cell>
                <Table.Cell>
                  <code className="text-[12px]">{f.type}</code>
                </Table.Cell>
                <Table.Cell>
                  <span className="text-[12.5px]">{f.cekat}</span>
                </Table.Cell>
                <Table.Cell>
                  {f.key ? (
                    <Chip size="sm" variant="soft" color={KEY_COLOR[f.key]}>
                      {f.key}
                    </Chip>
                  ) : null}
                </Table.Cell>
                <Table.Cell>
                  <span className="text-sm">{f.required ? "✓" : ""}</span>
                  {f.dflt && <code className="ml-1 text-[11px] text-[var(--lc-muted)]">= {f.dflt}</code>}
                </Table.Cell>
                <Table.Cell>
                  <WriterChip w={f.writer} />
                </Table.Cell>
                <Table.Cell>
                  <span className="text-[12.5px] leading-snug">{f.desc}</span>
                </Table.Cell>
                <Table.Cell>
                  <code className="break-all text-[11.5px] text-[var(--lc-muted)]">{fmt(f.example)}</code>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}

export default function ErdPage({ lang, t }) {
  const [mode, setMode] = useState("keys");
  const [selected, setSelected] = useState("customer");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const svgRef = useRef(null);

  const entity = erd.entities.find((e) => e.id === selected) || erd.entities[0];
  const totalFields = erd.entities.reduce((s, e) => s + e.fields.length, 0);
  const hits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return erd.entities.flatMap((e) =>
      e.fields.filter((f) => f.name.includes(q) || f.desc.toLowerCase().includes(q) || f.cekat.toLowerCase().includes(q)).map((f) => ({ f, e }))
    );
  }, [query]);

  const pick = (id) => {
    setSelected(id);
    document.getElementById("dictionary")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(sampleJson(entity));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="mx-auto max-w-[1680px] px-4 pb-16 pt-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="tracking-brand text-[11px] font-semibold text-[var(--lc-muted)]">ERD · DATA DICTIONARY · v{ucModel.meta.version}</p>
          <h1 className="font-display mt-1 text-4xl font-semibold text-[var(--lc-forest)] sm:text-5xl">{t.erd.title}</h1>
          <p className="mt-2 max-w-3xl text-sm text-[var(--lc-muted)]">{t.erd.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onPress={exportCsv}>
            {t.erd.csv}
          </Button>
          <Button variant="outline" size="sm" onPress={() => downloadSvg(svgRef.current, "longchamp-erd.svg")}>
            {t.download}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          [erd.entities.length, t.erd.stats.entities],
          [erd.entities.filter((e) => e.status === "new").length, t.erd.stats.new],
          [totalFields, t.erd.stats.fields],
          [erd.relations.length, t.erd.stats.relations],
        ].map(([n, label]) => (
          <div key={label} className="rounded-2xl border border-[var(--lc-line)] bg-white px-4 py-3">
            <p className="font-display text-3xl text-[var(--lc-forest)]">{n}</p>
            <p className="text-[12px] text-[var(--lc-muted)]">{label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--lc-line)] bg-white px-4 py-3">
        <ToggleButtonGroup
          size="sm"
          disallowEmptySelection
          selectionMode="single"
          selectedKeys={new Set([mode])}
          onSelectionChange={(k) => setMode([...k][0])}
          aria-label="Field mode"
        >
          <ToggleButton id="keys">{t.erd.keysOnly}</ToggleButton>
          <ToggleButton id="all">
            <ToggleButtonGroup.Separator />
            {t.erd.allFields}
          </ToggleButton>
        </ToggleButtonGroup>
        <div className="flex flex-wrap items-center gap-3 text-[12px] text-[var(--lc-muted)]">
          {Object.entries(DOMAINS).map(([k, v]) => (
            <span key={k} className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm" style={{ background: { ref: "#5b6b3a", customer: "var(--lc-forest)", commerce: "#7a4f2a", clienteling: "#0e6e8c", lists: "#6a4c93" }[k] }} />
              {v[lang]}
            </span>
          ))}
          <span className="flex items-center gap-1.5">
            <span className="rounded-full bg-[var(--lc-lime)] px-1.5 text-[9px] font-bold text-[var(--lc-forest)]">NEW</span>
            {t.erd.newLegend}
          </span>
          <span>{t.erd.keyLegend}</span>
        </div>
      </div>

      <Card className="mt-4 overflow-hidden p-0">
        <div className="max-h-[78vh] overflow-auto">
          <div className="min-w-[1500px]">
            <ErdSvg ref={svgRef} model={erd} mode={mode} selected={selected} onSelect={(id) => id && setSelected(id)} />
          </div>
        </div>
      </Card>

      {/* Dictionary */}
      <section id="dictionary" className="mt-12 scroll-mt-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-3xl font-semibold text-[var(--lc-forest)]">{t.erd.dictionary}</h2>
            <p className="mt-1 text-sm text-[var(--lc-muted)]">{t.erd.dictionaryDesc}</p>
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.erd.search}
            className="w-72 rounded-xl border border-[var(--lc-line)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--lc-forest)]"
          />
        </div>

        {query.trim() ? (
          <div className="mt-4">
            <p className="mb-2 text-sm text-[var(--lc-muted)]">
              {hits.length} {t.erd.matches}
            </p>
            <FieldTable fields={hits} t={t} showEntity />
          </div>
        ) : (
          <div className="mt-4 grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
            {/* entity list */}
            <nav className="flex flex-col gap-4">
              {Object.entries(DOMAINS).map(([k, v]) => (
                <div key={k}>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--lc-muted)]">{v[lang]}</p>
                  <ul className="flex flex-col">
                    {erd.entities
                      .filter((e) => e.domain === k)
                      .map((e) => (
                        <li key={e.id}>
                          <button
                            onClick={() => setSelected(e.id)}
                            className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[13px] ${
                              e.id === entity.id ? "bg-[var(--lc-forest)] text-white" : "hover:bg-[var(--lc-lime-soft)]"
                            }`}
                          >
                            <code>{e.id}</code>
                            <span className="flex items-center gap-1.5 text-[11px] opacity-70">
                              {e.status === "new" && <span className="rounded-full bg-[var(--lc-lime)] px-1.5 text-[9px] font-bold text-[var(--lc-forest)]">NEW</span>}
                              {e.fields.length}
                            </span>
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </nav>

            {/* entity detail */}
            <div className="flex min-w-0 flex-col gap-4">
              <Card>
                <Card.Content className="flex flex-wrap items-start justify-between gap-4 p-5">
                  <div className="max-w-3xl">
                    <h3 className="font-mono text-2xl font-semibold text-[var(--lc-forest)]">{entity.id}</h3>
                    <p className="mt-1 text-sm leading-relaxed">{entity.desc}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Chip size="sm" variant="secondary">
                        {t.erd.storedIn}: {entity.cekat}
                      </Chip>
                      <Chip size="sm" variant="soft" color={entity.status === "new" ? "success" : "default"}>
                        {entity.status === "new" ? t.erd.statusNew : t.erd.statusExisting}
                      </Chip>
                      <Chip size="sm" variant="soft">
                        {entity.fields.length} {t.erd.stats.fields.toLowerCase()}
                      </Chip>
                    </div>
                  </div>
                  <div className="text-[12px] text-[var(--lc-muted)]">
                    <p className="mb-1 font-semibold uppercase tracking-wider">{t.erd.relations}</p>
                    <ul className="flex flex-col gap-0.5">
                      {erd.relations
                        .filter(([a, , b]) => a === entity.id || b === entity.id)
                        .map(([a, f, b, c], i) => (
                          <li key={i}>
                            <button className="hover:underline" onClick={() => setSelected(a === entity.id ? b : a)}>
                              <code>
                                {a}.{f} → {b}
                              </code>{" "}
                              <span>({c})</span>
                            </button>
                          </li>
                        ))}
                    </ul>
                  </div>
                </Card.Content>
              </Card>

              <FieldTable fields={entity.fields.map((f) => ({ f, e: entity }))} t={t} />

              <Card>
                <Card.Content className="p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--lc-muted)]">{t.erd.sample}</p>
                    <Button size="sm" variant="ghost" onPress={copyJson}>
                      {copied ? t.erd.copied : t.erd.copy}
                    </Button>
                  </div>
                  <pre className="max-h-96 overflow-auto rounded-xl bg-[var(--lc-forest)] p-4 text-[12px] leading-relaxed text-[#e9f3d8]">
                    {sampleJson(entity)}
                  </pre>
                </Card.Content>
              </Card>
            </div>
          </div>
        )}
      </section>

      {/* Mapping notes */}
      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold text-[var(--lc-forest)]">{t.erd.notesTitle}</h2>
        <ol className="mt-4 grid gap-3 md:grid-cols-2">
          {t.erd.notes.map((n, i) => (
            <li key={i} className="flex gap-3 rounded-2xl border border-[var(--lc-line)] bg-white p-4 text-sm leading-relaxed">
              <span className="font-display text-2xl leading-none text-[var(--lc-lime)]">{i + 1}</span>
              <span>{n}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-[12.5px] text-[var(--lc-muted)]">
          {t.erd.unchanged}: {erd.unchanged.map((u) => <code key={u} className="mr-2">{u}</code>)}
        </p>
      </section>
    </div>
  );
}
