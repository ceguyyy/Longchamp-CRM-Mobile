import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Card, Chip, ToggleButton, ToggleButtonGroup } from "@heroui/react";
import MockApp from "../mockup/MockApp";
import { SCREENS, GROUPS } from "../mockup/screens";
import { ROLES } from "../mockup/data";
import { OwnerChip } from "../components/SourceBadges";
import ucModel from "../data/useCases";

const ROLE_IDS = ["sales_agent", "supervisor", "super_admin"];

function refLink(r) {
  if (r.startsWith("UC")) return `/use-case?uc=${r}`;
  if (r.startsWith("AD")) return `/activity?d=${r}`;
  return `/sequence?d=${r}`;
}

function Annotation({ id, lang, t }) {
  const navigate = useNavigate();
  const s = SCREENS[id];
  if (!s) return null;
  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--lc-muted)]">{GROUPS[s.group][lang]}</p>
        <h3 className="font-display text-2xl font-semibold text-[var(--lc-forest)]">{s.title[lang]}</h3>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-[var(--lc-muted)]">{t.mk.builtBy}</span>
        <OwnerChip owner={s.owner}>{s.owner === "product" ? "Cekat Product" : "IT Dev"}</OwnerChip>
      </div>
      {s.note[lang] && <p className="text-[13px] leading-relaxed">{s.note[lang]}</p>}
      {s.api.length > 0 && (
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--lc-muted)]">{t.mk.data}</p>
          <ul className="flex flex-col gap-1">
            {s.api.map((a) => (
              <li key={a}>
                <code className="block rounded-lg bg-[var(--lc-cream)] px-2.5 py-1.5 text-[11.5px] leading-snug">{a}</code>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--lc-muted)]">{t.mk.traces}</p>
        <div className="flex flex-wrap gap-1.5">
          {s.refs.map((r) => (
            <button key={r} onClick={() => navigate(refLink(r))}>
              <Chip size="sm" variant="secondary" className="cursor-pointer">
                {r}
              </Chip>
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--lc-muted)]">{t.mk.visibleTo}</p>
        <div className="flex flex-wrap gap-1.5">
          {ROLE_IDS.map((r) => (
            <Chip key={r} size="sm" variant="soft" color={s.roles.includes(r) ? "success" : "default"} className={s.roles.includes(r) ? "" : "line-through opacity-50"}>
              {ROLES[r].name[lang]}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MockupPage({ lang, t }) {
  const [params, setParams] = useSearchParams();
  const role = params.get("role") || "sales_agent";
  const start = params.get("screen") || "login";
  const mode = params.get("mode") || "prototype";
  const [visible, setVisible] = useState(start);
  const [nonce, setNonce] = useState(0);

  const set = (patch) => {
    const next = { role, screen: start, mode, ...patch };
    setParams(next);
    setNonce((n) => n + 1);
    if (patch.screen) setVisible(patch.screen);
  };
  const onScreen = useCallback((id) => setVisible(id), []);

  const screens = Object.entries(SCREENS).filter(([, s]) => s.roles.includes(role) && !s.hidden);
  const grouped = Object.keys(GROUPS)
    .map((g) => [g, screens.filter(([, s]) => s.group === g)])
    .filter(([, l]) => l.length);

  return (
    <div className="mx-auto max-w-[1680px] px-4 pb-16 pt-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="tracking-brand text-[11px] font-semibold text-[var(--lc-muted)]">APP MOCKUP · HEROUI · v{ucModel.meta.version}</p>
          <h1 className="font-display mt-1 text-4xl font-semibold text-[var(--lc-forest)] sm:text-5xl">{t.mk.title}</h1>
          <p className="mt-2 max-w-3xl text-sm text-[var(--lc-muted)]">{t.mk.subtitle}</p>
        </div>
        <ToggleButtonGroup
          size="sm"
          disallowEmptySelection
          selectionMode="single"
          selectedKeys={new Set([mode])}
          onSelectionChange={(k) => set({ mode: [...k][0] })}
          aria-label="Mode"
        >
          <ToggleButton id="prototype">{t.mk.prototype}</ToggleButton>
          <ToggleButton id="gallery">
            <ToggleButtonGroup.Separator />
            {t.mk.gallery}
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      {/* Role selector */}
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {ROLE_IDS.map((r) => (
          <button
            key={r}
            onClick={() => set({ role: r, screen: SCREENS[start]?.roles.includes(r) ? start : "home" })}
            className={`rounded-2xl border p-4 text-left transition ${role === r ? "border-[var(--lc-forest)] bg-[var(--lc-forest)] text-white" : "border-[var(--lc-line)] bg-white hover:border-[var(--lc-forest)]"}`}
          >
            <p className="font-display text-2xl font-semibold">{ROLES[r].name[lang]}</p>
            <p className={`mt-1 text-[12.5px] ${role === r ? "text-white/70" : "text-[var(--lc-muted)]"}`}>{t.mk.roleDesc[r]}</p>
            <p className={`mt-2 text-[11px] font-semibold uppercase tracking-wider ${role === r ? "text-[var(--lc-lime)]" : "text-[var(--lc-forest)]"}`}>
              {t.mk.scope}: {ROLES[r].scope[lang]}
            </p>
          </button>
        ))}
      </div>

      {mode === "prototype" ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[250px_auto_minmax(0,1fr)]">
          {/* screen index */}
          <nav className="flex flex-col gap-4">
            {grouped.map(([g, list]) => (
              <div key={g}>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--lc-muted)]">{GROUPS[g][lang]}</p>
                <ul>
                  {list.map(([id, s]) => (
                    <li key={id}>
                      <button
                        onClick={() => set({ screen: id })}
                        className={`w-full rounded-lg px-2.5 py-1.5 text-left text-[13px] ${visible === id ? "bg-[var(--lc-forest)] text-white" : "hover:bg-[var(--lc-lime-soft)]"}`}
                      >
                        {s.title[lang]}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <Button size="sm" variant="outline" onPress={() => set({ screen: "login" })}>
              {t.mk.restart}
            </Button>
          </nav>

          {/* phone */}
          <div className="flex justify-center">
            <MockApp key={`${role}-${start}-${nonce}-${lang}`} role={role} screen={start} lang={lang} onScreen={onScreen} />
          </div>

          {/* annotation */}
          <div>
            <Card className="lg:sticky lg:top-4">
              <Card.Content className="p-5">
                <Annotation id={visible} lang={lang} t={t} />
              </Card.Content>
            </Card>
            <p className="mt-3 px-1 text-[12px] leading-relaxed text-[var(--lc-muted)]">{t.mk.hint}</p>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-x-6 gap-y-10">
          {screens.map(([id, s]) => (
            <div key={`${role}-${id}-${lang}`} className="flex flex-col items-center gap-2">
              <button onClick={() => set({ screen: id, mode: "prototype" })} className="rounded-[40px] transition hover:ring-4 hover:ring-[var(--lc-lime)]">
                <MockApp role={role} screen={id} lang={lang} scale={0.66} interactive={false} />
              </button>
              <p className="text-center text-[13px] font-semibold">{s.title[lang]}</p>
              <div className="flex flex-wrap justify-center gap-1">
                <OwnerChip owner={s.owner}>{s.owner === "product" ? "Cekat Product" : "IT Dev"}</OwnerChip>
                {s.refs.slice(0, 3).map((r) => (
                  <Chip key={r} size="sm" variant="secondary">
                    {r}
                  </Chip>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
