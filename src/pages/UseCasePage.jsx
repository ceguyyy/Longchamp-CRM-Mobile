import { useRef, useState } from "react";
import { Button, Card, Label, Switch } from "@heroui/react";
import model from "../data/useCases";
import UseCaseSvg from "../components/diagram/UseCaseSvg";
import DetailPanel from "../components/DetailPanel";
import DataSourceMatrix from "../components/DataSourceMatrix";
import { SOURCE_COLORS } from "../components/diagram/layout";

function Toggle({ value, onChange, children }) {
  return (
    <Switch size="sm" isSelected={value} onChange={onChange} className="flex-row items-center gap-2">
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
      <Switch.Content>
        <Label className="text-sm">{children}</Label>
      </Switch.Content>
    </Switch>
  );
}

function LegendLine({ color, dash, label, marker }) {
  return (
    <li className="flex items-center gap-2 text-[12.5px] text-[var(--lc-ink)]">
      <svg width="40" height="12" className="shrink-0">
        {marker === "dot" && <circle cx="4" cy="6" r="3.5" fill={color} />}
        <line x1={marker === "dot" ? 8 : 2} y1="6" x2={marker === "tri" ? 30 : 38} y2="6" stroke={color} strokeWidth="1.6" strokeDasharray={dash} />
        {marker === "open" && <path d="M32,2 L38,6 L32,10" fill="none" stroke={color} strokeWidth="1.4" />}
        {marker === "tri" && <path d="M30,1 L39,6 L30,11 Z" fill="#fff" stroke={color} strokeWidth="1.4" />}
      </svg>
      {label}
    </li>
  );
}

export default function UseCasePage({ lang, t }) {
  const [show, setShow] = useState({ actors: true, data: true, relations: true });
  const [selected, setSelected] = useState(null);
  const [hover, setHover] = useState(null);
  const svgRef = useRef(null);

  const select = (s) => {
    setSelected(s);
    if (s && window.innerWidth < 1024) {
      document.getElementById("detail")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const downloadSvg = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const clone = svg.cloneNode(true);
    // inline the CSS variables so the file renders standalone
    const vars = getComputedStyle(document.documentElement);
    let src = new XMLSerializer().serializeToString(clone);
    src = src.replace(/var\((--[a-z0-9-]+)\)/gi, (_, v) => vars.getPropertyValue(v).trim() || "#000");
    const blob = new Blob([src], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `longchamp-mobile-use-case-v${model.meta.version}.svg`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const li = t.legendItems;

  return (
    <div className="mx-auto max-w-[1680px] px-4 pb-16 pt-8 sm:px-6">
      {/* Title */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="tracking-brand text-[11px] font-semibold text-[var(--lc-muted)]">USE CASE DIAGRAM · v{model.meta.version}</p>
          <h1 className="font-display mt-1 text-4xl font-semibold text-[var(--lc-forest)] sm:text-5xl">
            {model.meta.title[lang]}
          </h1>
          <p className="mt-2 text-sm text-[var(--lc-muted)]">{t.basedOn}</p>
        </div>
        <Button variant="outline" size="sm" onPress={downloadSvg}>
          {t.download}
        </Button>
      </div>

      {/* Toolbar */}
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-[var(--lc-line)] bg-white px-4 py-3">
        <Toggle value={show.actors} onChange={(v) => setShow((s) => ({ ...s, actors: v }))}>
          {t.showActors}
        </Toggle>
        <Toggle value={show.data} onChange={(v) => setShow((s) => ({ ...s, data: v }))}>
          {t.showData}
        </Toggle>
        <Toggle value={show.relations} onChange={(v) => setShow((s) => ({ ...s, relations: v }))}>
          {t.showRelations}
        </Toggle>
      </div>

      {/* Diagram + detail */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[1100px]">
              <UseCaseSvg
                ref={svgRef}
                model={model}
                lang={lang}
                show={show}
                focus={hover}
                selected={selected}
                onSelect={select}
                onHover={setHover}
              />
            </div>
          </div>
        </Card>

        <div id="detail" className="flex flex-col gap-4">
          <DetailPanel model={model} selection={selected} lang={lang} t={t} onSelect={select} />
          <Card>
            <Card.Content className="p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--lc-muted)]">{t.legend}</p>
              <ul className="flex flex-col gap-2">
                <LegendLine color={SOURCE_COLORS.Webhook} dash="6 4" marker="dot" label={li.webhook} />
                <LegendLine color={SOURCE_COLORS.API} marker="dot" label={li.api} />
                <LegendLine color={SOURCE_COLORS.Workflow} dash="2 4" marker="dot" label={li.workflow} />
                <LegendLine color={SOURCE_COLORS.Push} dash="2 4" marker="dot" label={li.push} />
                <LegendLine color="var(--lc-muted)" dash="5 4" marker="open" label={li.include} />
                <LegendLine color="var(--lc-muted)" dash="5 4" marker="open" label={li.extend} />
                <LegendLine color="var(--lc-forest)" marker="tri" label={li.gen} />
              </ul>
            </Card.Content>
          </Card>
        </div>
      </div>

      {/* Matrix */}
      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold text-[var(--lc-forest)]">{t.matrix}</h2>
        <p className="mb-4 mt-1 text-sm text-[var(--lc-muted)]">{t.matrixDesc}</p>
        <DataSourceMatrix model={model} lang={lang} t={t} onSelect={(s) => { select(s); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
      </section>

      {/* Notes */}
      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold text-[var(--lc-forest)]">{t.notes}</h2>
        <ol className="mt-4 grid gap-3 md:grid-cols-2">
          {model.notes.map((n, i) => (
            <li key={i} className="flex gap-3 rounded-2xl border border-[var(--lc-line)] bg-white p-4 text-sm leading-relaxed">
              <span className="font-display text-2xl leading-none text-[var(--lc-lime)]">{i + 1}</span>
              <span>{n[lang]}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
