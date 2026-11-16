import { useEffect, useMemo, useState } from "react";
import { Button, Chip, Input, Label, SearchField, Switch, Tabs, TextField } from "@heroui/react";
import { useApp, AppBar, Body, SectionTitle, Tile, TierBadge, Initials, Pill, Row, ContactBar, Icon, LcButton } from "../core";
import { CLIENTS, LISTS, LOVE_TAGS, PUSHES, PUSH_LABEL, TEAM, TEMPLATES, REACH_REASONS, BOUTIQUES, idr, tag, usableTemplates, loveLabel } from "../data";

/* RBAC as returned by Cekat Product (CP-02) — the app only renders what comes back */
export function visibleClients(role) {
  if (role === "sales_agent") return CLIENTS.filter((c) => c.boutique_id === 3 && (c.assigned_user_id === 87 || c.assigned_user_id === null));
  if (role === "supervisor") return CLIENTS.filter((c) => c.boutique_id === 3);
  return CLIENTS;
}

function useClient(id) {
  const { overrides } = useApp();
  const c = CLIENTS.find((x) => x.customer_id === id);
  return { ...c, ...(overrides[id] || {}) };
}

function ClientRow({ c, onClick }) {
  const { tx } = useApp();
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 border-b border-[var(--lc-line)] py-2.5 text-left">
      <svg width="12" height="16" viewBox="0 0 12 16" aria-hidden className="shrink-0"><path d="M1 1h10v14l-5-4-5 4z" fill="#000" /></svg>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-[12.5px] font-bold uppercase tracking-[0.05em]">{c.full_name}</span>
          <TierBadge tier={c.current_tier_name} small />
        </span>
        <span className="block truncate text-[11px] text-[var(--lc-muted)]">{c.email || c.phone_e164.replace(/(\+\d{5})\d+(\d{4})/, "$1•••$2")}</span>
        <span className="block text-[10.5px] text-[var(--lc-muted)]">
          {c.assigned_user_name ? c.assigned_user_name : <b className="text-black">{tx("Unassigned", "Tanpa assignee")}</b>}
          {c.days_since_last_contact !== null && `, ${tx("contacted", "dihubungi")} ${c.days_since_last_contact}${tx("d ago", " hr lalu")}`}
        </span>
      </span>
      <svg width="8" height="14" viewBox="0 0 8 14" className="text-[#b0b0b0]" aria-hidden><path d="M1 1 L7 7 L1 13" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
    </button>
  );
}

export function ClientSearch() {
  const { session, tx, nav } = useApp();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const base = visibleClients(session.role);
  const list = useMemo(() => {
    let l = base.filter((c) => !q || c.full_name.toLowerCase().includes(q.toLowerCase()) || c.phone_e164.includes(q.replace(/^0/, "")));
    if (filter === "unassigned") l = l.filter((c) => !c.assigned_user_id);
    if (filter === "due") l = l.filter((c) => c.days_since_last_contact === null || c.days_since_last_contact >= 30);
    if (filter === "vip") l = l.filter((c) => ["FAN", "FRIEND", "FAMILY"].includes(c.current_tier_name));
    return l;
  }, [q, filter, base]);

  return (
    <>
      <AppBar
        title={tx("Customer Search", "Cari Pelanggan")}
        sub={{ sales_agent: tx("My clients + unassigned", "Klien saya + tanpa assignee"), supervisor: tx("Plaza Indonesia team", "Tim Plaza Indonesia"), super_admin: tx("All 5 boutiques", "Semua 5 boutique") }[session.role]}
        right={
          session.role !== "super_admin" && (
            <button onClick={() => nav("client_new")} className="grid h-9 w-9 place-items-center rounded-full bg-[var(--lc-forest)] text-[20px] text-white" aria-label="New client">
              +
            </button>
          )
        }
      />
      <Body>
        <SearchField aria-label="Search" value={q} onChange={setQ} className="w-full">
          <SearchField.Group className="mt-3 flex h-10 items-center gap-2 border-b border-[#bdbdbd]">
            <SearchField.SearchIcon />
            <SearchField.Input placeholder={tx("Phone, name or email", "HP, nama, atau email")} className="flex-1 bg-transparent text-[13px] outline-none placeholder:uppercase placeholder:tracking-[0.12em] placeholder:text-[10.5px]" />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
        <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
          {[
            ["all", tx("All", "Semua")],
            ["due", tx("Not contacted 30d+", "Belum dihubungi 30h+")],
            ["vip", "VIP (FAN+)"],
            ["unassigned", tx("Unassigned", "Tanpa assignee")],
          ].map(([k, l]) => (
            <Pill key={k} active={filter === k} onClick={() => setFilter(k)}>
              {l}
            </Pill>
          ))}
        </div>
        <p className="mb-2 mt-3 text-[11.5px] text-[var(--lc-muted)]">
          {list.length} {tx("clients", "klien")} · {tx("filtered by Cekat RBAC", "difilter oleh RBAC Cekat")}
        </p>
        <div>
          {list.map((c) => (
            <ClientRow key={c.customer_id} c={c} onClick={() => nav("client", { customer_id: c.customer_id })} />
          ))}
        </div>
      </Body>
    </>
  );
}

function ReassignSheet({ c }) {
  const { tx, setSheet, notify, setOverrides } = useApp();
  const team = TEAM.filter((x) => x.role === "sales_agent" && x.user_id !== c.assigned_user_id);
  return (
    <div>
      <p className="font-display text-[22px] font-semibold text-[var(--lc-forest)]">{tx("Reassign client", "Pindahkan klien")}</p>
      <p className="mb-3 text-[12.5px] text-[var(--lc-muted)]">{tx("Only Sales Agents in your boutique are shown — Cekat rejects others (403).", "Hanya Sales Agent di boutique Anda yang ditampilkan — Cekat menolak yang lain (403).")}</p>
      <div className="flex flex-col gap-2">
        {team.map((s) => (
          <button
            key={s.user_id}
            onClick={() => {
              setOverrides((o) => ({ ...o, [c.customer_id]: { ...(o[c.customer_id] || {}), assigned_user_id: s.user_id, assigned_user_name: s.full_name } }));
              setSheet(null);
              notify(`${c.full_name} → ${s.full_name}. ${tx("Push sent to new SA.", "Push dikirim ke SA baru.")}`);
            }}
            className="flex items-center gap-3 rounded-2xl border border-[var(--lc-line)] p-3 text-left"
          >
            <Initials name={s.full_name} size={36} />
            <div className="flex-1">
              <p className="text-[14px] font-semibold">{s.full_name}</p>
              <p className="text-[11.5px] text-[var(--lc-muted)]">
                {s.clients} {tx("clients", "klien")} · conv. {s.conversion_rate}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function LoveTagsEditor({ c }) {
  const { tx, setOverrides, notify } = useApp();
  const [sel, setSel] = useState(new Set(c.love_tags));
  const toggle = (t) => {
    const n = new Set(sel);
    n.has(t) ? n.delete(t) : n.add(t);
    setSel(n);
  };
  return (
    <div>
      <ul>
        {LOVE_TAGS.map((t) => (
          <li key={t}>
            <button onClick={() => toggle(t)} aria-pressed={sel.has(t)} className="flex w-full items-center gap-2.5 py-[5px] text-left">
              <span className={`grid h-3.5 w-3.5 shrink-0 place-items-center border ${sel.has(t) ? "border-black bg-black" : "border-[#9a9a9a]"}`}>
                {sel.has(t) && <span className="h-1.5 w-1.5 bg-white" />}
              </span>
              <span className="caps text-[9.5px]">{loveLabel(t)}</span>
            </button>
          </li>
        ))}
      </ul>
      <button
        className="mt-3 h-10 w-full bg-[var(--lc-olive)] text-[10px] font-semibold uppercase tracking-[0.18em] text-white"
        onClick={() => {
          setOverrides((o) => ({ ...o, [c.customer_id]: { ...(o[c.customer_id] || {}), love_tags: [...sel] } }));
          notify(tx("Love Tags validated", "Love Tags tervalidasi"));
        }}
      >
        {tx("Validate", "Validasi")}
      </button>
    </div>
  );
}

function Commentary({ c }) {
  const { tx, setOverrides, notify } = useApp();
  const [text, setText] = useState(c.client_note || "");
  return (
    <div className="border-b border-[var(--lc-line)] py-2">
      <p className="text-[10.5px] text-[var(--lc-muted)]">{tx("Do not record health, religion, political views or anything about minors.", "Jangan mencatat kesehatan, agama, pandangan politik, atau data anak di bawah umur.")}</p>
      <textarea
        aria-label="Customer commentaries"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        className="mt-2 w-full resize-none bg-[#f2f2f2] p-2.5 text-center text-[12px] italic leading-snug outline-none"
      />
      <button
        className="mt-2 h-9 w-full bg-[var(--lc-olive)] text-[9.5px] font-semibold uppercase tracking-[0.18em] text-white"
        onClick={() => {
          setOverrides((o) => ({ ...o, [c.customer_id]: { ...(o[c.customer_id] || {}), client_note: text } }));
          notify(tx("Commentary updated", "Komentar diperbarui"));
        }}
      >
        {tx("Commentary updated", "Perbarui komentar")}
      </button>
    </div>
  );
}

function QuickAddSheet({ c }) {
  const { tx, nav, setSheet } = useApp();
  const go = (id, p = {}) => {
    setSheet(null);
    nav(id, { customer_id: c.customer_id, ...p });
  };
  return (
    <div>
      <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.08em]">{c.full_name}</p>
      {[
        [tx("New task", "Task baru"), () => go("agenda_new", { kind: "task" })],
        [tx("New appointment", "Appointment baru"), () => go("agenda_new", { kind: "appointment" })],
        [tx("After-sales case", "Kasus after-sales"), () => go("ticket_new")],
        [tx("Add to a list", "Tambah ke list"), () => go("lists")],
        [tx("Wishlist", "Wishlist"), () => go("client_wishlist")],
      ].map(([l, f]) => (
        <Row key={l} label={l} onClick={f} />
      ))}
    </div>
  );
}

export function ClientProfile({ customer_id, push_id }) {
  const { session, tx, back, nav, setSheet } = useApp();
  const c = useClient(customer_id);
  const role = session.role;
  const canAct = role !== "super_admin";
  const push = push_id && PUSHES.find((p) => p.push_id === push_id);
  const [open, setOpen] = useState(null);
  const toggle = (k) => setOpen(open === k ? null : k);
  const avg = Math.round(c.total_spent_idr / Math.max(1, c.purchase_count));
  const reach = (channel) => nav("reach_out", { customer_id: c.customer_id, push_id, channel });
  const { setConnected, connected, wishlist, clientWishlist } = useApp();
  useEffect(() => {
    if (canAct) setConnected(c.customer_id);
  }, [c.customer_id, canAct, setConnected]);

  return (
    <>
      <AppBar onBack={back} />
      <Body pad={false}>
        <div className="bg-black px-4 py-3 text-white">
          <div className="flex items-center justify-between">
            <p className="text-[16px] font-bold uppercase tracking-[0.06em]">{c.full_name}</p>
            <TierBadge tier={c.current_tier_name} small />
          </div>
          <p className="text-[11.5px] text-white/60">
            {c.city}
            {c.is_promoter ? ` · Promoter` : ""}
          </p>
        </div>

        <div className="px-4">
          {canAct ? (
            <ContactBar
              items={[
                { label: tx("Call", "Telepon"), icon: "call", onClick: () => reach("call") },
                { label: "E-mail", icon: "mail", disabled: !c.consent_email, onClick: () => reach("email") },
                { label: "SMS", icon: "sms", onClick: () => reach("sms") },
                { label: "WhatsApp", icon: "whatsapp", disabled: !c.consent_wa, active: !!push, onClick: () => reach("whatsapp") },
                { label: "Wishlist", icon: "heart", onClick: () => nav("client_wishlist", { customer_id: c.customer_id }) },
                { label: "Agenda", icon: "calendar", onClick: () => nav("agenda_new", { customer_id: c.customer_id }) },
                { label: tx("Ticket", "Tiket"), icon: "ticket", onClick: () => nav("ticket_new", { customer_id: c.customer_id }) },
              ]}
            />
          ) : (
            <p className="py-3 text-[11.5px] text-[var(--lc-muted)]">{tx("View only. Super Admin does not contact clients.", "Hanya lihat. Super Admin tidak menghubungi klien.")}</p>
          )}

          {push && (
            <div className="mb-3 border-l-4 px-3 py-2 text-[12px]" style={{ borderColor: "#8dc63f", background: "#f1f8e6" }}>
              <b>{tx("Push", "Push")}: {push.detail}.</b> {tx("Contact before", "Hubungi sebelum")} {push.due_date.slice(5).split("-").reverse().join("/")}.
            </div>
          )}

          <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 border-y border-[var(--lc-line)] py-3">
            {[
              [tx("Creation", "Dibuat"), "2021-03-14"],
              [tx("Birth date", "Tanggal lahir"), c.birthdate],
              [tx("Average basket", "Rata-rata belanja"), `IDR ${avg.toLocaleString("id-ID")}`],
              [tx("Last purchase", "Pembelian terakhir"), c.last_purchase_date],
              [tx("Purchase frequency", "Frekuensi belanja"), c.purchase_frequency],
              [tx("Odoo client ID", "ID klien Odoo"), c.odoo_partner_id],
              [tx("Purchases", "Jumlah order"), c.purchase_count],
              [tx("Last contact", "Kontak terakhir"), c.days_since_last_contact === null ? tx("Never", "Belum pernah") : `${c.days_since_last_contact} ${tx("days ago", "hari lalu")}`],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="caps text-[8.5px] font-semibold">{k}</dt>
                <dd className="text-[12.5px] text-[#444]">{v}</dd>
              </div>
            ))}
          </dl>

          <Row label={tx("Personal details", "Data pribadi")} onClick={() => toggle("details")} open={open === "details"} />
          {open === "details" && (
            <div className="border-b border-[var(--lc-line)] pb-2 text-[12.5px]">
              {[
                [tx("Phone", "HP"), c.phone_e164],
                ["Email", c.email || "—"],
                [tx("Assigned to", "Ditangani"), c.assigned_user_name || tx("Unassigned", "Tanpa assignee")],
                [tx("WhatsApp consent", "Consent WhatsApp"), c.consent_wa ? tx("Yes", "Ya") : tx("No", "Tidak")],
                [tx("Email consent", "Consent email"), c.consent_email ? tx("Yes", "Ya") : tx("No", "Tidak")],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1">
                  <span className="text-[var(--lc-muted)]">{k}</span>
                  <span>{v}</span>
                </div>
              ))}
              {role === "supervisor" && (
                <button onClick={() => setSheet(<ReassignSheet c={c} />)} className="mt-2 w-full border border-black py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.14em]">
                  {tx("Reassign to another Sales Agent", "Pindahkan ke Sales Agent lain")}
                </button>
              )}
            </div>
          )}
          <Row label={tx("Purchase history", "Riwayat pembelian")} count={c.purchases.length} onClick={() => toggle("history")} open={open === "history"} />
          {open === "history" &&
            c.purchases.map((p) => (
              <div key={p.receipt_number} className="border-b border-[var(--lc-line)] py-2 text-[12.5px]">
                <div className="flex justify-between">
                  <span className="font-semibold">{p.item}</span>
                  <span>{idr(p.amount_net_idr)}</span>
                </div>
                <p className="text-[11px] text-[var(--lc-muted)]">
                  {p.date}, {p.receipt_number}, {p.channel === "online" ? "Shopify" : "Odoo POS"}
                </p>
              </div>
            ))}
          <Row label={tx("Wishlist", "Wishlist")} count={(clientWishlist[c.customer_id] || []).length} onClick={() => nav("client_wishlist", { customer_id: c.customer_id })} />
          <Row label="Love tags" count={c.love_tags.length} onClick={() => toggle("love")} open={open === "love"} />
          {open === "love" && <div className="border-b border-[var(--lc-line)] py-3">{canAct ? <LoveTagsEditor c={c} /> : <p className="text-[12.5px]">{c.love_tags.map(tag).join(", ")}</p>}</div>}
          <Row label={tx("Customer commentaries", "Komentar pelanggan")} onClick={() => toggle("note")} open={open === "note"} />
          {open === "note" && (canAct ? <Commentary c={c} /> : <p className="border-b border-[var(--lc-line)] py-2 text-[12.5px] leading-relaxed">{c.client_note || tx("No comment yet.", "Belum ada komentar.")}</p>)}
          <Row label={tx("After sales cases", "Kasus after-sales")} count={(c.tickets || []).length} onClick={() => toggle("aftersales")} open={open === "aftersales"} />
          {open === "aftersales" && (
            <div className="border-b border-[var(--lc-line)] py-2 text-[12.5px]">
              {(c.tickets || []).map((t) => (
                <p key={t.ticket_id} className="flex justify-between py-1">
                  <span>
                    {t.ticket_id}, {t.type}, {t.sku}
                  </span>
                  <span className="text-[var(--lc-muted)]">{t.status}</span>
                </p>
              ))}
              {canAct && (
                <button onClick={() => nav("ticket_new", { customer_id: c.customer_id })} className="mt-1 text-[11px] underline">
                  {tx("Open a new case", "Buka kasus baru")}
                </button>
              )}
            </div>
          )}
          <Row label={tx("Timeline", "Timeline")} onClick={() => toggle("timeline")} open={open === "timeline"} />
          {open === "timeline" && (
            <div className="border-b border-[var(--lc-line)] py-2 text-[12px]">
              {[
                [tx("Future", "Mendatang"), push ? `${push.detail}, ${tx("push due", "push jatuh tempo")} ${push.due_date}` : tx("No future interactions", "Tidak ada interaksi mendatang")],
                [tx("Past", "Lalu"), c.last_reach_out_at ? `${c.last_reach_out_at}, WhatsApp, ${tx("customer invitation", "undangan pelanggan")}` : tx("No past interactions", "Belum ada interaksi")],
              ].map(([k, v]) => (
                <div key={k} className="py-1">
                  <p className="caps text-[8.5px] font-semibold">{k}</p>
                  <p className="text-[var(--lc-muted)]">{v}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        {canAct && (
          <div className="mt-6">
            <button onClick={() => setSheet(<QuickAddSheet c={c} />)} aria-label="Add" className="grid h-9 w-full place-items-center bg-black text-white">
              <Icon name="plus" size={18} />
            </button>
            <button
              onClick={() => {
                setConnected(null);
                back();
              }}
              className="h-10 w-full bg-[var(--lc-olive)] text-[10px] font-semibold uppercase tracking-[0.18em] text-white"
            >
              {tx("Disconnect customer", "Putuskan pelanggan")}
            </button>
          </div>
        )}
      </Body>
    </>
  );
}

function Field({ label, defaultValue, placeholder, type }) {
  return (
    <TextField className="flex flex-col gap-1" defaultValue={defaultValue} type={type}>
      <Label className="text-[12px] font-medium">{label}</Label>
      <Input placeholder={placeholder} className="h-11 rounded-xl border border-[var(--lc-line)] bg-white px-3 text-[14px]" />
    </TextField>
  );
}

function Toggle({ label, defaultSelected, desc }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--lc-line)] bg-white p-3">
      <div>
        <p className="text-[13px] font-medium">{label}</p>
        {desc && <p className="text-[11px] text-[var(--lc-muted)]">{desc}</p>}
      </div>
      <Switch defaultSelected={defaultSelected} aria-label={label}>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
      </Switch>
    </div>
  );
}

export function ClientNew() {
  const { tx, back, notify } = useApp();
  return (
    <>
      <AppBar title={tx("New client", "Klien baru")} sub={tx("Phone-first — duplicates are merged", "Berbasis HP — duplikat digabung")} onBack={back} />
      <Body>
        <div className="flex flex-col gap-3">
          <Field label={tx("Full name", "Nama lengkap")} defaultValue="Nadia Putri" />
          <Field label={tx("Mobile (E.164)", "HP (E.164)")} defaultValue="+62 878 7766 5544" />
          <Field label="Email" type="email" placeholder="name@mail.com" />
          <Field label={tx("Birthday", "Ulang tahun")} defaultValue="10/12/2000" />
          <Field label={tx("City", "Kota")} defaultValue="Depok" />
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--lc-muted)]">{tx("Consent (UU PDP)", "Consent (UU PDP)")}</p>
          <Toggle label={tx("WhatsApp messages", "Pesan WhatsApp")} defaultSelected desc={tx("Client agreed verbally in store", "Klien setuju secara lisan di toko")} />
          <Toggle label={tx("Email newsletter", "Newsletter email")} defaultSelected={false} />
          <div className="rounded-xl bg-[var(--lc-lime-soft)] p-3 text-[12px]">{tx("Will be assigned to you and added to your Client Book.", "Akan di-assign ke Anda dan masuk ke Client Book Anda.")}</div>
          <Button
            fullWidth
            className="h-12 rounded-xl bg-[var(--lc-forest)] text-white"
            onPress={() => {
              notify(tx("Client created in Cekat CRM", "Klien dibuat di Cekat CRM"));
              back();
            }}
          >
            {tx("Save client", "Simpan klien")}
          </Button>
        </div>
      </Body>
    </>
  );
}

const MOTIVES = [
  ["push", "Clienteling push", "Clienteling push"],
  ["birthday", "Birthday", "Ulang tahun"],
  ["event_invite", "Customer invitation", "Undangan pelanggan"],
  ["tlf_program", "TLF customer invitation", "Undangan TLF"],
  ["clienteling_kit", "Collection presentation", "Presentasi koleksi"],
  ["after_sales", "After sales appointment", "Janji after sales"],
  ["wishlist", "Wishlist", "Wishlist"],
  ["other", "Other", "Lainnya"],
];
const CHANNELS = [
  ["whatsapp", "WhatsApp"],
  ["call", "Call"],
  ["sms", "SMS"],
  ["email", "E-mail"],
];

function Dropdown({ label, value, open, onToggle, children }) {
  return (
    <div className="border-b border-[var(--lc-line)]">
      <button onClick={onToggle} aria-expanded={open} className="flex w-full items-center justify-between py-3 text-left">
        <span className="caps text-[10px] text-[var(--lc-muted)]">{label}</span>
        <span className="flex items-center gap-2 text-[12.5px]">
          {value}
          <svg width="12" height="8" viewBox="0 0 12 8" className={open ? "rotate-180" : ""}><path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
        </span>
      </button>
      {open && <div className="pb-2">{children}</div>}
    </div>
  );
}

const MOMENT_LABEL = {
  welcome: ["Welcome", "Welcome"], new_client: ["New clients", "Klien baru"], birthday: ["Birthday", "Ulang tahun"], upgrade: ["Tier upgrade", "Naik tier"],
  wishlist: ["Wishlist", "Wishlist"], after_sales: ["After sales", "After sales"], event: ["Events", "Event"], collection: ["Collection", "Koleksi"],
  thank_you: ["Thank you", "Terima kasih"], reactivation: ["Reactivation", "Reaktivasi"],
};
export function ReachOut({ customer_id, push_id, channel: startChannel, motive: startMotive }) {
  const { tx, back, notify, session } = useApp();
  const [msgLang, setMsgLang] = useState("id");
  const c = useClient(customer_id);
  const eligible = c.days_since_last_contact === null || c.days_since_last_contact >= 30;
  const [step, setStep] = useState(eligible ? "contact" : "blocked");
  const [channel, setChannel] = useState(startChannel || (c.consent_wa ? "whatsapp" : "call"));
  const usable = usableTemplates(3);
  const [tpl, setTpl] = useState(
    (startMotive === "welcome" && usable.find((t) => t.moment === "new_client")) || TEMPLATES[0]
  );
  const [motive, setMotive] = useState(push_id ? "push" : startMotive === "welcome" ? "other" : null);
  const [dd, setDd] = useState("motive");
  const first = c.full_name.split(" ")[0];
  const body = (msgLang === "en" && tpl.body_en ? tpl.body_en : tpl.body)
    .replace("{{first_name}}", first)
    .replace("{{tier}}", c.current_tier_name)
    .replace("{{sa_name}}", session.user.full_name.split(" ")[0])
    .replace("{{boutique_name}}", "Plaza Indonesia")
    .replace("{{links}}", "longchamp.co.id/…");
  const motiveLabel = (k) => {
    const m = MOTIVES.find((x) => x[0] === k);
    return m ? tx(m[1], m[2]) : tx("Motive", "Alasan");
  };

  return (
    <>
      <AppBar title="Reach out" onBack={back} />
      <Body pad={false}>
        <div className="bg-black px-4 pb-3 text-white">
          <p className="text-[15px] font-bold uppercase tracking-[0.06em]">{c.full_name}</p>
          <p className="text-[11.5px] text-white/60">{c.city}</p>
        </div>
        <div className="px-4">
          {step === "blocked" && (
            <div className="py-8 text-center">
              <p className="text-[15px] font-bold uppercase tracking-[0.08em]">{tx("Contacted recently", "Baru saja dihubungi")}</p>
              <p className="mt-2 text-[12.5px] text-[var(--lc-muted)]">
                {tx(`${first} was contacted ${c.days_since_last_contact} days ago. Reach out again after 30 days.`, `${first} dihubungi ${c.days_since_last_contact} hari lalu. Hubungi lagi setelah 30 hari.`)}
              </p>
              <button className="mt-6 border border-black px-6 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.14em]" onClick={back}>
                {tx("Back to profile", "Kembali ke profil")}
              </button>
            </div>
          )}

          {step === "contact" && (
            <>
              <p className="mt-3 border-l-4 border-[var(--lc-lime)] bg-[var(--lc-lime-soft)] px-3 py-2 text-[12px]">
                {c.days_since_last_contact === null
                  ? tx("Never contacted. You can reach out.", "Belum pernah dihubungi. Boleh dihubungi.")
                  : tx(`Last contact ${c.days_since_last_contact} days ago. You can reach out.`, `Kontak terakhir ${c.days_since_last_contact} hari lalu. Boleh dihubungi.`)}
              </p>
              <ContactBar
                items={CHANNELS.map(([k, l]) => ({
                  label: l,
                  icon: { whatsapp: "whatsapp", call: "call", sms: "sms", email: "mail" }[k],
                  active: channel === k,
                  disabled: (k === "whatsapp" && !c.consent_wa) || (k === "email" && !c.consent_email),
                  onClick: () => setChannel(k),
                }))}
              />
              {channel === "whatsapp" && (
                <>
                  <SectionTitle
                    action={
                      <span className="flex">
                        {["id", "en"].map((l) => (
                          <button key={l} onClick={() => setMsgLang(l)} className={`caps px-2 py-0.5 text-[10px] ${msgLang === l ? "bg-black text-white" : "border border-black"}`}>
                            {l}
                          </button>
                        ))}
                      </span>
                    }
                  >
                    {tx("Key moments", "Momen penting")}
                  </SectionTitle>
                  {Object.entries(
                    usable.reduce((acc, t) => {
                      (acc[t.moment] = acc[t.moment] || []).push(t);
                      return acc;
                    }, {})
                  ).map(([m, list]) => (
                    <div key={m} className="mb-1">
                      <p className="caps mt-2 text-[9.5px] text-[var(--lc-muted)]">{MOMENT_LABEL[m] ? tx(...MOMENT_LABEL[m]) : m.replace(/_/g, " ")}</p>
                      {list.map((t) => (
                        <button key={t.template_id} onClick={() => setTpl(t)} className="flex w-full items-center gap-2.5 border-b border-[var(--lc-line)] py-2 text-left">
                          <span className="w-5 text-center text-[13px]" aria-hidden>{t.icon}</span>
                          <span className="flex-1 text-[12.5px]">{t.title}</span>
                          {tpl.template_id === t.template_id && <span className="h-2.5 w-2.5 bg-[var(--lc-lime)]" />}
                        </button>
                      ))}
                    </div>
                  ))}
                  <p className="mt-3 bg-[#e7f3d9] p-3 text-[12.5px] leading-relaxed">{body}</p>
                  <p className="mt-1 text-[10.5px] text-[var(--lc-muted)]">{tx("Personalise before sending.", "Personalisasi sebelum mengirim.")}</p>
                </>
              )}
              <button
                className="mt-5 h-12 w-full bg-black text-[11px] font-semibold uppercase tracking-[0.16em] text-white"
                onClick={() => {
                  notify(channel === "whatsapp" ? tx("Sent on WhatsApp", "Terkirim via WhatsApp") : tx("Calling…", "Menelepon…"));
                  setStep("log");
                }}
              >
                {channel === "whatsapp" ? tx("Send on WhatsApp", "Kirim via WhatsApp") : channel === "call" ? tx("Call", "Telepon") : tx("Send", "Kirim")}
              </button>
            </>
          )}

          {step === "log" && (
            <>
              <p className="mt-3 text-[12px] text-[var(--lc-muted)]">{tx("Select the reason and the channel used, then validate.", "Pilih alasan dan channel yang dipakai, lalu validasi.")}</p>
              <Dropdown label={tx("Channel", "Channel")} value={CHANNELS.find((x) => x[0] === channel)[1]} open={dd === "channel"} onToggle={() => setDd(dd === "channel" ? null : "channel")}>
                {CHANNELS.map(([k, l]) => (
                  <button key={k} onClick={() => { setChannel(k); setDd("motive"); }} className={`block w-full px-3 py-2 text-left text-[12.5px] ${channel === k ? "outline outline-2 outline-[var(--lc-lime)]" : ""}`}>
                    {l}
                  </button>
                ))}
              </Dropdown>
              <Dropdown label={tx("Motive", "Alasan")} value={motive ? motiveLabel(motive) : "—"} open={dd === "motive"} onToggle={() => setDd(dd === "motive" ? null : "motive")}>
                {MOTIVES.map(([k]) => (
                  <button key={k} onClick={() => { setMotive(k); setDd(null); }} className={`block w-full border-b border-[#f0f0f0] px-3 py-2.5 text-left text-[12.5px] ${motive === k ? "outline outline-2 -outline-offset-2 outline-[var(--lc-lime)]" : ""}`}>
                    {motiveLabel(k)}
                  </button>
                ))}
              </Dropdown>
              <button
                disabled={!motive}
                className="mt-6 h-11 w-full bg-[var(--lc-olive)] text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white disabled:opacity-40"
                onClick={() => {
                  notify(tx("Validated. Conversion tracked for 30 days.", "Tervalidasi. Konversi dilacak 30 hari."));
                  back();
                }}
              >
                {tx("Validate", "Validasi")}
              </button>
            </>
          )}
        </div>
      </Body>
    </>
  );
}

function CreateListSheet() {
  const { tx, setSheet, nav, notify } = useApp();
  const [kind, setKind] = useState("dynamic");
  const [share, setShare] = useState(true);
  return (
    <div>
      <p className="mb-3 text-[15px]">{tx("Create a customer list", "Buat daftar pelanggan")}</p>
      <TextField className="flex flex-col gap-1" defaultValue="VIC December">
        <Label className="caps text-[10px]">{tx("List name", "Nama list")}</Label>
        <Input className="h-10 border-0 border-b border-black px-0 text-[14px]" />
      </TextField>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {[
          ["manual", tx("Manual", "Manual"), tx("Pick customers one by one", "Pilih pelanggan satu per satu")],
          ["dynamic", tx("Dynamic", "Dinamis"), tx("Filters, refreshed nightly", "Filter, diperbarui tiap malam")],
        ].map(([k, l, d]) => (
          <button key={k} onClick={() => setKind(k)} className={`border p-2.5 text-left ${kind === k ? "border-[var(--lc-lime)] outline outline-2 outline-[var(--lc-lime)]" : "border-[var(--lc-line)]"}`}>
            <span className="caps block text-[11px]">{l}</span>
            <span className="block text-[10.5px] text-[var(--lc-muted)]">{d}</span>
          </button>
        ))}
      </div>
      <label className="mt-4 flex items-start gap-2.5 text-[12.5px]">
        <input type="checkbox" checked={share} onChange={(e) => setShare(e.target.checked)} className="mt-0.5 h-4 w-4 accent-black" />
        <span>
          {tx("Share with store sellers", "Bagikan ke seller boutique")}
          <span className="block text-[10.5px] text-[var(--lc-muted)]">{tx("Plaza Indonesia team can see this list, within their own RBAC scope", "Tim Plaza Indonesia bisa melihat list ini, sesuai scope RBAC masing-masing")}</span>
        </span>
      </label>
      <button
        className="mt-4 w-full bg-[var(--lc-olive)] py-3 text-[12px] uppercase tracking-[0.1em] text-white"
        onClick={() => {
          setSheet(null);
          if (kind === "dynamic") nav("list_builder", { shared: share });
          else {
            notify(tx("List created, add customers from search", "List dibuat, tambahkan pelanggan dari pencarian"));
            nav("clients");
          }
        }}
      >
        {tx("To create", "Buat")}
      </button>
    </div>
  );
}

export function Lists() {
  const { tx, back, nav, stack, setSheet } = useApp();
  return (
    <>
      <AppBar title={tx("Customer Lists", "Daftar Pelanggan")} sub={tx("Dynamic lists & Client Book", "Dynamic list & Client Book")} onBack={stack.length > 1 ? back : undefined} />
      <Body>
        <LcButton onClick={() => setSheet(<CreateListSheet />)}>+ {tx("Create a customer list", "Buat daftar pelanggan")}</LcButton>
        <SectionTitle>{tx("Saved lists", "List tersimpan")}</SectionTitle>
        <div className="flex flex-col">
          {LISTS.map((l) => (
            <button key={l.list_id} onClick={() => nav("list_detail", { list_id: l.list_id })} className="flex items-center gap-3 border-b border-[var(--lc-line)] py-3 text-left">
              <span className="caps grid h-10 w-10 shrink-0 place-items-center bg-black text-[9px] text-white">
                {{ dynamic: "DYN", client_book: "BOOK", event_guests: "EVT", manual: "MAN" }[l.list_type]}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] uppercase tracking-[0.04em]">{l.name}</span>
                <span className="block text-[11px] text-[var(--lc-muted)]">
                  {l.filter}
                  {l.shared ? `, ${tx("shared with boutique", "dibagikan ke boutique")}` : ""}
                </span>
              </span>
              <span className="text-[18px]">{l.member_count}</span>
            </button>
          ))}
        </div>
      </Body>
    </>
  );
}

export function ListBuilder({ shared = true }) {
  const { tx, back, notify } = useApp();
  const [tiers, setTiers] = useState(new Set(["FAN", "FRIEND", "FAMILY"]));
  const [win, setWin] = useState(30);
  const [sort, setSort] = useState("last_contact");
  return (
    <>
      <AppBar title={tx("New dynamic list", "Dynamic list baru")} onBack={back} />
      <Body>
        <SectionTitle>{tx("Segment", "Segmen")}</SectionTitle>
        <div className="flex flex-wrap gap-1.5">
          {["LIKER", "LOVER", "COLLECTOR", "FAN", "FRIEND", "FAMILY"].map((t) => (
            <Pill
              key={t}
              active={tiers.has(t)}
              onClick={() => {
                const n = new Set(tiers);
                n.has(t) ? n.delete(t) : n.add(t);
                setTiers(n);
              }}
            >
              {t}
            </Pill>
          ))}
        </div>
        <SectionTitle>{tx("Birthday within", "Ulang tahun dalam")}</SectionTitle>
        <div className="flex gap-1.5">
          {[7, 30, 60].map((d) => (
            <Pill key={d} active={win === d} onClick={() => setWin(d)}>
              {d} {tx("days", "hari")}
            </Pill>
          ))}
        </div>
        <SectionTitle>{tx("More filters", "Filter lain")}</SectionTitle>
        <Tile className="divide-y divide-[var(--lc-line)]">
          {[
            [tx("Assigned Sales Agent", "Sales Agent"), tx("Me", "Saya")],
            [tx("Wishlist sent", "Wishlist terkirim"), tx("Any", "Semua")],
            [tx("Reach-out reason", "Alasan reach-out"), tx("Any", "Semua")],
            [tx("Product category", "Kategori produk"), "Handbag"],
            ["Promoter", tx("Any", "Semua")],
            [tx("Geographic area", "Area"), "Jakarta"],
            ["Love Tags", "le pliage"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between px-4 py-3 text-[13px]">
              <span>{k}</span>
              <span className="font-medium text-[var(--lc-forest)]">{v} ›</span>
            </div>
          ))}
        </Tile>
        <SectionTitle>{tx("Sort by", "Urutkan")}</SectionTitle>
        <div className="flex flex-wrap gap-1.5">
          {[
            ["last_contact", tx("Last contact", "Kontak terakhir")],
            ["last_purchase", tx("Last purchase", "Pembelian terakhir")],
            ["sales_12m", tx("Sales 12 months", "Sales 12 bulan")],
            ["name", tx("Name A–Z", "Nama A–Z")],
          ].map(([k, l]) => (
            <Pill key={k} active={sort === k} onClick={() => setSort(k)}>
              {l}
            </Pill>
          ))}
        </div>
        <p className="mt-3 text-[11.5px]">
          {shared ? tx("Shared with store sellers", "Dibagikan ke seller boutique") : tx("Private to me", "Hanya untuk saya")}
        </p>
        <div className="mt-4 border border-[var(--lc-line)] p-3 text-center">
          <p className="font-display text-[32px]">18</p>
          <p className="text-[12px] text-[var(--lc-muted)]">{tx("matching clients in your scope", "klien cocok dalam scope Anda")}</p>
        </div>
        <LcButton
          className="mt-4"
          onClick={() => {
            notify(tx("List saved", "List tersimpan"));
            back();
          }}
        >
          {tx("Save list", "Simpan list")}
        </LcButton>
      </Body>
    </>
  );
}

function Attendance() {
  const { tx, notify } = useApp();
  const [here, setHere] = useState(false);
  return (
    <button
      onClick={() => {
        setHere(!here);
        if (!here) notify(tx("Attendance saved to the client timeline", "Kehadiran tersimpan di timeline klien"));
      }}
      className={`caps ml-auto px-2.5 py-1.5 text-[9.5px] ${here ? "bg-[var(--lc-lime)] text-black" : "border border-black"}`}
    >
      {here ? tx("Attended", "Hadir") : tx("Mark attended", "Tandai hadir")}
    </button>
  );
}

export function ListDetail({ list_id }) {
  const { tx, back, nav, session } = useApp();
  const l = LISTS.find((x) => x.list_id === list_id);
  const members = visibleClients(session.role).slice(0, 5);
  return (
    <>
      <AppBar title={l.name} sub={`${l.member_count} ${tx("clients", "klien")} · ${l.filter}`} onBack={back} />
      <Body>
        {l.list_type === "event_guests" && (
          <div className="mb-3 grid grid-cols-3 gap-2 text-center">
            {[
              [tx("Invited", "Diundang"), 26],
              [tx("Accepted", "Hadir"), 14],
              [tx("No reply", "Belum balas"), 9],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-[var(--lc-line)] bg-white py-2">
                <p className="font-display text-[22px]">{v}</p>
                <p className="text-[10.5px] text-[var(--lc-muted)]">{k}</p>
              </div>
            ))}
          </div>
        )}
        {l.list_type === "client_book" && (
          <p className="mb-2 bg-[var(--lc-lime)] px-3 py-1.5 text-[11.5px]">
            {tx("2 new clients waiting for a welcome message", "2 klien baru menunggu pesan welcome")}
          </p>
        )}
        <div className="flex flex-col">
          {members.map((c, i) => {
            const welcome = l.list_type === "client_book" && (c.welcome_status === "pending" || i < 2);
            const rsvp = ["accepted", "no reply", "accepted", "declined", "invited"][i];
            return (
              <div key={c.customer_id} className="border-b border-[var(--lc-line)] py-2.5">
                <button onClick={() => nav("client", { customer_id: c.customer_id })} className="flex w-full items-center gap-2 text-left">
                  <span className="min-w-0 flex-1 truncate text-[12.5px] uppercase tracking-[0.05em]">{c.full_name}</span>
                  <TierBadge tier={c.current_tier_name} small />
                </button>
                <p className="text-[11px] text-[var(--lc-muted)]">
                  {l.list_type === "event_guests"
                    ? rsvp
                    : `${tx("Birthday", "Ultah")} ${c.birthdate.slice(5).split("-").reverse().join("/")}${c.days_since_last_contact !== null ? `, ${tx("follow-up", "follow-up")} ${c.days_since_last_contact}${tx("d ago", " hr lalu")}` : `, ${tx("never contacted", "belum pernah dihubungi")}`}`}
                </p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  {[
                    ["user", () => nav("client", { customer_id: c.customer_id })],
                    ["call", () => nav("reach_out", { customer_id: c.customer_id, channel: "call" })],
                    ["sms", () => nav("reach_out", { customer_id: c.customer_id, channel: "sms" })],
                    ["whatsapp", () => nav("reach_out", { customer_id: c.customer_id, channel: "whatsapp" })],
                  ].map(([ic, f]) => (
                    <button key={ic} aria-label={ic} onClick={f} disabled={ic === "whatsapp" && !c.consent_wa} className="grid h-7 w-7 place-items-center border border-black disabled:opacity-25">
                      <Icon name={ic} size={14} />
                    </button>
                  ))}
                  {welcome && (
                    <button onClick={() => nav("reach_out", { customer_id: c.customer_id, channel: "whatsapp", motive: "welcome" })} className="caps ml-auto bg-black px-2.5 py-1.5 text-[9.5px] text-white">
                      {tx("Welcome", "Welcome")}
                    </button>
                  )}
                  {l.list_type === "event_guests" && rsvp === "accepted" && session.role !== "super_admin" && <Attendance />}
                </div>
              </div>
            );
          })}
        </div>
        {l.list_type === "event_guests" && session.role !== "super_admin" && (
          <LcButton className="mt-4">{tx("Send invitation (WA template)", "Kirim undangan (template WA)")}</LcButton>
        )}
      </Body>
    </>
  );
}

export function TicketNew({ customer_id, sku }) {
  const { tx, back, notify } = useApp();
  const c = useClient(customer_id);
  const [type, setType] = useState("repair");
  return (
    <>
      <AppBar title={tx("Service ticket", "Tiket servis")} sub={c.full_name} onBack={back} />
      <Body>
        <SectionTitle>{tx("Type", "Tipe")}</SectionTitle>
        <div className="flex flex-wrap gap-1.5">
          {["repair", "personalisation", "exchange", "other"].map((t) => (
            <Pill key={t} active={type === t} onClick={() => setType(t)}>
              {t}
            </Pill>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-3">
          <Field label="SKU" defaultValue={sku ? `${sku} · ${tx("from catalog", "dari katalog")}` : "L1899089P59 · Le Pliage Original M"} />
          <TextField className="flex flex-col gap-1">
            <Label className="text-[12px] font-medium">{tx("Description", "Deskripsi")}</Label>
            <Input defaultValue="Strap stitching loose, purchased 28/10." className="h-11 rounded-xl border border-[var(--lc-line)] bg-white px-3 text-[14px]" />
          </TextField>
          <Button
            fullWidth
            className="h-12 rounded-xl bg-[var(--lc-forest)] text-white"
            onPress={() => {
              notify(tx("Ticket TCK-10422 created in Cekat", "Tiket TCK-10422 dibuat di Cekat"));
              back();
            }}
          >
            {tx("Create ticket", "Buat tiket")}
          </Button>
        </div>
      </Body>
    </>
  );
}

export { BOUTIQUES };
