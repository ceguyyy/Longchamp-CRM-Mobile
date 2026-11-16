import { useMemo, useState } from "react";
import { Input, Label, TextField } from "@heroui/react";
import { useApp, AppBar, Body, SectionTitle, Pill, Icon } from "../core";
import { TEMPLATES, BOUTIQUES } from "../data";

const STATUS = {
  approved: { en: "Approved", id: "Approved", bg: "#8dc63f", fg: "#000" },
  pending: { en: "Pending review", id: "Menunggu review", bg: "#e2e2e2", fg: "#000" },
  rejected: { en: "Rejected", id: "Ditolak", bg: "#000", fg: "#fff" },
  session: { en: "24h session only", id: "Hanya sesi 24 jam", bg: "#fff", fg: "#8a8a8a" },
};

function StatusTag({ s }) {
  const { lang } = useApp();
  const m = STATUS[s];
  return (
    <span className="caps shrink-0 border px-1.5 py-[2px] text-[8px] font-bold" style={{ background: m.bg, color: m.fg, borderColor: m.bg === "#fff" ? "#d0d0d0" : m.bg }}>
      {m[lang]}
    </span>
  );
}

/* ------------------------------------------------------------------ library */
export function Templates() {
  const { tx, back, nav, session, stack } = useApp();
  const [filter, setFilter] = useState("all");
  const role = session.role;
  const mine = role === "supervisor" ? TEMPLATES.filter((t) => t.scope === "global" || t.boutique_id === 3) : TEMPLATES;
  const list = mine.filter((t) => filter === "all" || t.meta_status === filter);
  const scopeName = (t) => (t.scope === "global" ? tx("All boutiques", "Semua boutique") : BOUTIQUES.find((b) => b.boutique_id === t.boutique_id)?.boutique_name);
  const canEdit = (t) => role === "super_admin" || (t.scope === "boutique" && t.boutique_id === 3);

  return (
    <>
      <AppBar title={tx("Template library", "Template library")} onBack={stack.length > 1 ? back : undefined} />
      <Body>
        <button onClick={() => nav("template_new")} className="mt-4 flex w-full items-center justify-between bg-black px-4 py-3.5 text-white">
          <span className="text-[13px] font-bold uppercase tracking-[0.04em]">{tx("New WhatsApp template", "Template WhatsApp baru")}</span>
          <Icon name="plus" size={18} />
        </button>
        <p className="mt-2 text-[11.5px] text-[var(--lc-muted)]">
          {role === "supervisor"
            ? tx("Your templates are for the Plaza Indonesia team. Meta reviews each one before Sales Agents can use it.", "Template Anda untuk tim Plaza Indonesia. Meta mereview setiap template sebelum Sales Agent bisa memakainya.")
            : tx("Global templates reach every boutique. Supervisors create templates for their own boutique.", "Template global untuk semua boutique. Supervisor membuat template untuk boutique-nya sendiri.")}
        </p>
        <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4">
          {[
            ["all", tx("All", "Semua")],
            ["approved", "Approved"],
            ["pending", "Pending"],
            ["rejected", tx("Rejected", "Ditolak")],
          ].map(([k, l]) => (
            <Pill key={k} active={filter === k} onClick={() => setFilter(k)}>
              {l} {k !== "all" && `(${mine.filter((t) => t.meta_status === k).length})`}
            </Pill>
          ))}
        </div>
        <div className="mt-3">
          {list.map((t) => (
            <div key={t.template_id} className="border-b border-[var(--lc-line)] py-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[13px] font-bold uppercase tracking-[0.03em]">{t.title}</p>
                <StatusTag s={t.meta_status} />
              </div>
              <p className="mt-0.5 text-[11px] text-[var(--lc-muted)]">
                {scopeName(t)}, {t.created_by}
                {t.wa_category ? `, ${t.wa_category}` : ""}
              </p>
              <p className="mt-1.5 line-clamp-2 text-[12px] leading-snug text-[#444]">{t.body}</p>
              {t.meta_status === "rejected" && (
                <p className="mt-2 border-l-4 border-black bg-[#f4f4f4] px-2.5 py-1.5 text-[11.5px]">
                  <b>Meta:</b> {t.rejection_reason}
                </p>
              )}
              {canEdit(t) && t.meta_status !== "session" && (
                <button onClick={() => nav("template_new", { from: t.template_id })} className="mt-2 text-[11px] underline">
                  {t.meta_status === "rejected" ? tx("Edit & resubmit", "Edit & ajukan ulang") : tx("Duplicate as new", "Duplikat sebagai baru")}
                </button>
              )}
            </div>
          ))}
        </div>
      </Body>
    </>
  );
}

/* ------------------------------------------------------------------ builder */
const VARS = [
  ["first_name", "Client first name", "Nama depan klien", "Sari"],
  ["current_tier_name", "Tier", "Tier", "FAN"],
  ["sa_name", "Sales Agent name", "Nama Sales Agent", "Andi"],
  ["boutique_name", "Boutique", "Boutique", "Plaza Indonesia"],
];

function Field({ label, children, hint }) {
  return (
    <div className="mt-4">
      <p className="caps mb-1.5 text-[9.5px] font-semibold text-[var(--lc-muted)]">{label}</p>
      {children}
      {hint && <p className="mt-1 text-[10.5px] text-[var(--lc-muted)]">{hint}</p>}
    </div>
  );
}

function Preview({ header, body, footer, buttons, vars }) {
  const { tx } = useApp();
  let text = body;
  vars.forEach((v, i) => {
    const sample = VARS.find((x) => x[0] === v)?.[3] || "";
    text = text.split(`{{${i + 1}}}`).join(sample);
  });
  return (
    <div className="bg-[#e5ddd5] p-3">
      <div className="max-w-[88%] bg-white p-1.5 shadow-[0_1px_0_rgba(0,0,0,.08)]">
        {header === "image" && (
          <div className="grid h-28 place-items-center bg-[#d9d4cb] text-[11px] text-[#666]">
            <Icon name="bag" size={34} />
          </div>
        )}
        {header === "text" && <p className="px-1.5 pt-1 text-[13px] font-bold">Longchamp Plaza Indonesia</p>}
        {header === "document" && <p className="bg-[#f2f2f2] px-2 py-2 text-[12px]">📄 lookbook.pdf</p>}
        {header === "video" && <div className="grid h-28 place-items-center bg-[#222] text-[11px] text-white">▶</div>}
        <p className="whitespace-pre-wrap px-1.5 pt-1.5 text-[12.5px] leading-snug">{text || tx("Your message…", "Pesan Anda…")}</p>
        {footer && <p className="px-1.5 pt-1 text-[11px] text-[#8a8a8a]">{footer}</p>}
        <p className="px-1.5 pb-0.5 text-right text-[9.5px] text-[#9a9a9a]">22:30</p>
      </div>
      {buttons.map((b, i) => (
        <div key={i} className="mt-1 max-w-[88%] bg-white py-2 text-center text-[12.5px] text-[#027eb5]">
          {b.type === "url" ? "↗ " : b.type === "call" ? "☎ " : "↩ "}
          {b.text}
        </div>
      ))}
    </div>
  );
}

export function TemplateNew({ from }) {
  const { tx, back, notify, session } = useApp();
  const role = session.role;
  const base = from ? TEMPLATES.find((t) => t.template_id === from) : null;
  const [title, setTitle] = useState(base ? base.title : "VIP upgrade — Plaza Indonesia");
  const [category, setCategory] = useState(base?.wa_category || "marketing");
  const [language, setLanguage] = useState("id");
  const [scope, setScope] = useState(role === "supervisor" ? "3" : "global");
  const [header, setHeader] = useState("image");
  const [body, setBody] = useState(
    base && base.meta_status === "rejected"
      ? "Halo {{1}}, Anda mendapat akses awal ke private sale di Plaza Indonesia. Balas STOP untuk berhenti menerima pesan."
      : "Halo {{1}}, kini Anda berada di tier {{2}}. Saya {{3}} siap membantu Anda di Plaza Indonesia."
  );
  const [vars, setVars] = useState(base && base.meta_status === "rejected" ? ["first_name"] : ["first_name", "current_tier_name", "sa_name"]);
  const [footer, setFooter] = useState("Longchamp Plaza Indonesia");
  const [buttons, setButtons] = useState([
    { type: "url", text: tx("See the collection", "Lihat koleksi") },
    { type: "quick_reply", text: tx("Book an appointment", "Buat janji") },
  ]);

  const name = useMemo(
    () =>
      "lc_" +
      (scope === "global" ? "" : "pi_") +
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_|_$/g, "")
        .slice(0, 40) +
      "_" +
      language,
    [title, scope, language]
  );

  const addVar = (v) => {
    const n = vars.length + 1;
    setVars([...vars, v]);
    setBody((b) => `${b} {{${n}}}`);
  };
  const count = (t) => buttons.filter((b) => b.type === t).length;
  const canAdd = (t) => buttons.length < 10 && (t === "url" ? count("url") < 2 : t === "call" ? count("call") < 1 : true);

  return (
    <>
      <AppBar title={base?.meta_status === "rejected" ? tx("Edit & resubmit", "Edit & ajukan ulang") : tx("New WhatsApp template", "Template WhatsApp baru")} onBack={back} />
      <Body>
        {base?.meta_status === "rejected" && (
          <p className="mt-3 border-l-4 border-black bg-[#f4f4f4] px-3 py-2 text-[11.5px]">
            <b>Meta:</b> {base.rejection_reason}
          </p>
        )}
        <Field label={tx("Title in the library", "Judul di library")}>
          <TextField value={title} onChange={setTitle} aria-label="title">
            <Input className="h-10 w-full border-0 border-b border-[#bdbdbd] bg-transparent px-0 text-[14px] outline-none focus:border-black" />
          </TextField>
        </Field>
        <p className="mt-1 text-[10.5px] text-[var(--lc-muted)]">
          {tx("Meta name", "Nama Meta")}: <code>{name}</code>
        </p>

        <Field label={tx("Available to", "Berlaku untuk")}>
          {role === "supervisor" ? (
            <p className="text-[13px]">
              Plaza Indonesia <span className="text-[var(--lc-muted)]">({tx("your boutique", "boutique Anda")})</span>
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              <Pill active={scope === "global"} onClick={() => setScope("global")}>
                {tx("All boutiques", "Semua boutique")}
              </Pill>
              {BOUTIQUES.slice(0, 3).map((b) => (
                <Pill key={b.boutique_id} active={scope === String(b.boutique_id)} onClick={() => setScope(String(b.boutique_id))}>
                  {b.boutique_name}
                </Pill>
              ))}
            </div>
          )}
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label={tx("Category", "Kategori")} hint={tx("Authentication is only available through the Open API.", "Authentication hanya lewat Open API.")}>
            <div className="flex flex-wrap gap-1.5">
              {["marketing", "utility"].map((c) => (
                <Pill key={c} active={category === c} onClick={() => setCategory(c)}>
                  {c}
                </Pill>
              ))}
            </div>
          </Field>
          <Field label={tx("Language", "Bahasa")}>
            <div className="flex gap-1.5">
              {[
                ["id", "Bahasa"],
                ["en", "English"],
              ].map(([k, l]) => (
                <Pill key={k} active={language === k} onClick={() => setLanguage(k)}>
                  {l}
                </Pill>
              ))}
            </div>
          </Field>
        </div>

        <Field label={tx("Header (optional)", "Header (opsional)")}>
          <div className="flex flex-wrap gap-1.5">
            {["none", "text", "image", "video", "document"].map((h) => (
              <Pill key={h} active={header === h} onClick={() => setHeader(h)}>
                {h}
              </Pill>
            ))}
          </div>
        </Field>

        <Field label={tx("Body", "Body")} hint={tx("Variables become {{1}}, {{2}}… Meta needs a sample for each.", "Variabel menjadi {{1}}, {{2}}… Meta butuh contoh untuk setiap variabel.")}>
          <textarea
            aria-label="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            className="w-full resize-none border border-[#bdbdbd] p-2.5 text-[13px] leading-snug outline-none focus:border-black"
          />
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {VARS.filter((v) => !vars.includes(v[0])).map(([k, en, idl]) => (
              <button key={k} onClick={() => addVar(k)} className="border border-dashed border-black px-2 py-1 text-[11px]">
                + {tx(en, idl)}
              </button>
            ))}
          </div>
          {vars.length > 0 && (
            <div className="mt-2 text-[11px]">
              {vars.map((v, i) => {
                const m = VARS.find((x) => x[0] === v);
                return (
                  <p key={v} className="flex justify-between border-b border-[#f0f0f0] py-1">
                    <span>
                      <code>{`{{${i + 1}}}`}</code> {tx(m[1], m[2])}
                    </span>
                    <span className="text-[var(--lc-muted)]">
                      {tx("sample", "contoh")}: {m[3]}
                    </span>
                  </p>
                );
              })}
            </div>
          )}
        </Field>

        <Field label={tx("Footer (optional)", "Footer (opsional)")}>
          <TextField value={footer} onChange={setFooter} aria-label="footer">
            <Input className="h-10 w-full border-0 border-b border-[#bdbdbd] bg-transparent px-0 text-[13px] outline-none focus:border-black" />
          </TextField>
        </Field>

        <Field label={`${tx("Buttons", "Tombol")} (${buttons.length}/10)`} hint={tx("Website max 2, call max 1.", "Website maks 2, telepon maks 1.")}>
          {buttons.map((b, i) => (
            <div key={i} className="flex items-center justify-between border-b border-[var(--lc-line)] py-2 text-[12.5px]">
              <span>
                <span className="caps mr-2 text-[8.5px] font-bold text-[var(--lc-muted)]">{b.type.replace("_", " ")}</span>
                {b.text}
              </span>
              <button onClick={() => setButtons(buttons.filter((_, j) => j !== i))} aria-label="Remove button">
                <Icon name="close" size={14} />
              </button>
            </div>
          ))}
          <div className="mt-2 flex gap-1.5">
            {[
              ["quick_reply", tx("Quick reply", "Quick reply"), tx("Book an appointment", "Buat janji")],
              ["url", tx("Website", "Website"), tx("See the collection", "Lihat koleksi")],
              ["call", tx("Call", "Telepon"), tx("Call the boutique", "Telepon boutique")],
            ].map(([t, l, d]) => (
              <button key={t} disabled={!canAdd(t)} onClick={() => setButtons([...buttons, { type: t, text: d }])} className="border border-dashed border-black px-2 py-1 text-[11px] disabled:opacity-30">
                + {l}
              </button>
            ))}
          </div>
        </Field>

        <SectionTitle>{tx("Preview", "Pratinjau")}</SectionTitle>
        <Preview header={header} body={body} footer={footer} buttons={buttons} vars={vars} />

        <button
          className="mt-5 h-12 w-full bg-[var(--lc-olive)] text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white"
          onClick={() => {
            notify(tx("Submitted to Meta. Status: pending review.", "Diajukan ke Meta. Status: menunggu review."));
            back();
          }}
        >
          {tx("Submit for Meta review", "Ajukan ke Meta")}
        </button>
        <p className="mt-2 text-center text-[10.5px] text-[var(--lc-muted)]">
          {tx("Usually reviewed within 24 hours. You'll get a notification.", "Biasanya direview dalam 24 jam. Anda akan menerima notifikasi.")}
        </p>
      </Body>
    </>
  );
}
