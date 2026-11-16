import { Card, Chip, Separator } from "@heroui/react";
import { TypeChip, StatusChip } from "./SourceBadges";

function SourceRow({ src, sysName, t }) {
  return (
    <li className="rounded-xl border border-[var(--lc-line)] bg-white p-3">
      <div className="flex flex-wrap items-center gap-1.5">
        <TypeChip type={src.type} />
        <span className="text-xs font-semibold text-[var(--lc-ink)]">{sysName}</span>
        <span className="text-[11px] text-[var(--lc-muted)]">· {t.dir[src.dir]}</span>
        <span className="ml-auto">
          <StatusChip status={src.status} t={t} />
        </span>
      </div>
      <code className="mt-2 block break-words text-[12px] leading-snug text-[var(--lc-ink)]">{src.ref}</code>
      {src.note && <p className="mt-1.5 text-[11.5px] leading-snug text-[var(--lc-muted)]">{src.note}</p>}
    </li>
  );
}

export default function DetailPanel({ model, selection, lang, t, onSelect }) {
  const sysName = (id) => model.systems.find((s) => s.id === id)?.name ?? id;
  const actorName = (id) => model.actors.find((a) => a.id === id)?.name[lang] ?? id;

  let body;
  if (!selection) {
    body = <p className="text-sm text-[var(--lc-muted)]">{t.detailEmpty}</p>;
  } else if (selection.kind === "uc") {
    const u = model.useCases.find((x) => x.id === selection.id);
    const mod = model.modules.find((m) => m.id === u.module);
    const rels = model.relations.filter((r) => r.from === u.id || r.to === u.id);
    body = (
      <>
        <div>
          <p className="text-[11px] font-semibold tracking-widest text-[var(--lc-muted)]">
            {u.id} · {mod.name[lang].toUpperCase()}
          </p>
          <h3 className="font-display mt-1 text-2xl font-semibold text-[var(--lc-forest)]">{u.name[lang]}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--lc-ink)]">{u.desc[lang]}</p>
        </div>
        {(u.actors.length > 0 || rels.length > 0) && (
          <div className="flex flex-wrap gap-1.5">
            {u.actors.map((a) => (
              <Chip key={a} size="sm" variant="secondary">
                {actorName(a)}
              </Chip>
            ))}
            {rels.map((r) => {
              const other = r.from === u.id ? r.to : r.from;
              return (
                <button key={r.from + r.to} onClick={() => onSelect({ kind: "uc", id: other })}>
                  <Chip size="sm" variant="tertiary" className="cursor-pointer italic">
                    {r.from === u.id ? `«${r.type}» → ${other}` : `${other} «${r.type}» →`}
                  </Chip>
                </button>
              );
            })}
          </div>
        )}
        <Separator />
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--lc-muted)]">{t.sources}</p>
          <ul className="flex flex-col gap-2">
            {u.sources.map((s, i) => (
              <SourceRow key={i} src={s} sysName={sysName(s.sys)} t={t} />
            ))}
          </ul>
        </div>
      </>
    );
  } else if (selection.kind === "actor") {
    const a = model.actors.find((x) => x.id === selection.id);
    const ids = [a.id, a.generalizes].filter(Boolean);
    const list = model.useCases.filter((u) => u.actors.some((x) => ids.includes(x)));
    body = (
      <>
        <div>
          <p className="text-[11px] font-semibold tracking-widest text-[var(--lc-muted)]">ACTOR</p>
          <h3 className="font-display mt-1 text-2xl font-semibold text-[var(--lc-forest)]">{a.name[lang]}</h3>
          <p className="mt-1 text-sm text-[var(--lc-muted)]">{a.note[lang]}</p>
        </div>
        <Separator />
        <ul className="flex flex-col gap-1">
          {list.map((u) => (
            <li key={u.id}>
              <button
                className="w-full rounded-lg px-2 py-1.5 text-left text-sm hover:bg-[var(--lc-lime-soft)]"
                onClick={() => onSelect({ kind: "uc", id: u.id })}
              >
                <span className="mr-2 text-[11px] font-semibold text-[var(--lc-muted)]">{u.id}</span>
                {u.name[lang]}
                {!u.actors.includes(a.id) && (
                  <span className="ml-1 text-[11px] text-[var(--lc-muted)]">
                    ({t.inherits} {actorName(a.generalizes)})
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </>
    );
  } else {
    const s = model.systems.find((x) => x.id === selection.id);
    const rows = model.useCases.flatMap((u) =>
      u.sources.filter((src) => src.sys === s.id).map((src) => ({ u, src }))
    );
    body = (
      <>
        <div>
          <p className="text-[11px] font-semibold tracking-widest text-[var(--lc-muted)]">«SYSTEM»</p>
          <h3 className="font-display mt-1 text-2xl font-semibold text-[var(--lc-forest)]">{s.name}</h3>
          <p className="mt-1 text-sm text-[var(--lc-muted)]">{s.sub}</p>
        </div>
        <Separator />
        <ul className="flex flex-col gap-2">
          {rows.map(({ u, src }, i) => (
            <li key={i}>
              <button
                className="w-full rounded-lg px-2 py-1.5 text-left hover:bg-[var(--lc-lime-soft)]"
                onClick={() => onSelect({ kind: "uc", id: u.id })}
              >
                <div className="flex items-center gap-1.5">
                  <TypeChip type={src.type} />
                  <span className="text-[11px] font-semibold text-[var(--lc-muted)]">{u.id}</span>
                  <span className="text-sm">{u.name[lang]}</span>
                </div>
                <code className="mt-1 block text-[11.5px] text-[var(--lc-muted)]">{src.ref}</code>
              </button>
            </li>
          ))}
        </ul>
      </>
    );
  }

  return (
    <Card className="lg:sticky lg:top-4">
      <Card.Content className="flex flex-col gap-4 p-5">{body}</Card.Content>
    </Card>
  );
}
