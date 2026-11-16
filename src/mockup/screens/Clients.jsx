import { useMemo, useState } from "react";
import { Button, Chip, Input, Label, SearchField, Switch, Tabs, TextField } from "@heroui/react";
import { useApp, AppBar, Body, SectionTitle, Tile, TierBadge, Initials, Pill } from "../core";
import { CLIENTS, LISTS, LOVE_TAGS, PUSHES, PUSH_LABEL, TEAM, TEMPLATES, REACH_REASONS, BOUTIQUES, idr, tag } from "../data";

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
    <Tile onClick={onClick} className="flex items-center gap-3 p-3">
      <Initials name={c.full_name} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-[14px] font-semibold">{c.full_name}</p>
          <TierBadge tier={c.current_tier_name} small />
        </div>
        <p className="text-[11.5px] text-[var(--lc-muted)]">{c.phone_e164.replace(/(\+\d{5})\d+(\d{4})/, "$1•••$2")}</p>
        <p className="text-[11px] text-[var(--lc-muted)]">
          {c.assigned_user_name ? c.assigned_user_name : <span className="font-semibold text-[#b4441c]">{tx("Unassigned", "Tanpa assignee")}</span>}
          {c.days_since_last_contact !== null && ` · ${c.days_since_last_contact}d`}
        </p>
      </div>
      <svg width="8" height="14" viewBox="0 0 8 14" className="text-[#c0c4b4]"><path d="M1 1 L7 7 L1 13" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
    </Tile>
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
          <SearchField.Group className="flex h-11 items-center gap-2 rounded-xl border border-[var(--lc-line)] bg-white px-3">
            <SearchField.SearchIcon />
            <SearchField.Input placeholder={tx("Phone, name or email", "HP, nama, atau email")} className="flex-1 bg-transparent text-[14px] outline-none" />
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
        <div className="flex flex-col gap-2">
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
      {Object.entries(LOVE_TAGS).map(([g, tags]) => (
        <div key={g} className="mb-3">
          <p className="mb-1.5 text-[10.5px] uppercase tracking-wider text-[var(--lc-muted)]">{g}</p>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => toggle(t)}
                className={`rounded-full px-2.5 py-1 text-[12px] ${sel.has(t) ? "bg-[var(--lc-forest)] text-white" : "border border-[var(--lc-line)] bg-white"}`}
              >
                {sel.has(t) ? "♥ " : ""}
                {tag(t)}
              </button>
            ))}
          </div>
        </div>
      ))}
      <Button
        fullWidth
        className="mt-1 h-11 rounded-xl bg-[var(--lc-forest)] text-white"
        onPress={() => {
          setOverrides((o) => ({ ...o, [c.customer_id]: { ...(o[c.customer_id] || {}), love_tags: [...sel] } }));
          notify(tx("Love Tags saved to Cekat CRM", "Love Tags tersimpan di Cekat CRM"));
        }}
      >
        {tx("Save Love Tags", "Simpan Love Tags")}
      </Button>
      <p className="mt-2 text-[11px] text-[var(--lc-muted)]">{tx("Do not collect health, religion, politics or data about minors.", "Jangan mencatat kesehatan, agama, politik, atau data anak di bawah umur.")}</p>
    </div>
  );
}

export function ClientProfile({ customer_id, push_id }) {
  const { session, tx, back, nav, setSheet } = useApp();
  const c = useClient(customer_id);
  const role = session.role;
  const canAct = role !== "super_admin";
  const push = push_id && PUSHES.find((p) => p.push_id === push_id);
  const [tab, setTab] = useState("overview");

  return (
    <>
      <AppBar title="" onBack={back} right={<span className="text-[11px] text-[var(--lc-muted)]">#{c.customer_id}</span>} />
      <Body>
        <div className="flex items-center gap-3">
          <Initials name={c.full_name} size={56} dark />
          <div className="min-w-0">
            <p className="font-display truncate text-[26px] font-semibold leading-tight">{c.full_name}</p>
            <div className="mt-0.5 flex items-center gap-2">
              <TierBadge tier={c.current_tier_name} />
              {c.is_promoter && <span className="text-[11px] font-semibold text-[var(--lc-forest)]">★ Promoter</span>}
            </div>
          </div>
        </div>

        {push && (
          <div className="mt-3 rounded-2xl bg-[var(--lc-lime-soft)] p-3 text-[12.5px]">
            <b>{PUSH_LABEL[push.push_type].en}</b> · {push.detail}. {tx("Reach out before", "Hubungi sebelum")} {push.due_date.slice(5).split("-").reverse().join("/")}.
          </div>
        )}

        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          {[
            [tx("Spent", "Belanja"), `${(c.total_spent_idr / 1e6).toFixed(1)} jt`],
            [tx("Orders", "Order"), c.purchase_count],
            [tx("Last contact", "Kontak terakhir"), c.days_since_last_contact === null ? "—" : `${c.days_since_last_contact}d`],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl border border-[var(--lc-line)] bg-white py-2">
              <p className="font-display text-[20px]">{v}</p>
              <p className="text-[10.5px] text-[var(--lc-muted)]">{k}</p>
            </div>
          ))}
        </div>

        {canAct && (
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[
              [tx("Reach Out", "Reach Out"), () => nav("reach_out", { customer_id: c.customer_id, push_id }), true],
              [tx("Wishlist", "Wishlist"), () => nav("catalog_pick", { customer_id: c.customer_id }), true],
              [tx("Agenda", "Agenda"), () => nav("agenda_new", { customer_id: c.customer_id }), true],
              [tx("Ticket", "Tiket"), () => nav("ticket_new", { customer_id: c.customer_id }), true],
            ].map(([l, go]) => (
              <button key={l} onClick={go} className="rounded-xl bg-[var(--lc-forest)] py-2.5 text-[11.5px] font-semibold text-white">
                {l}
              </button>
            ))}
          </div>
        )}
        {!canAct && (
          <p className="mt-3 rounded-xl bg-white p-2.5 text-[11.5px] text-[var(--lc-muted)]">
            {tx("View only — Super Admin does not reach out to clients (RBAC).", "Hanya lihat — Super Admin tidak menghubungi klien (RBAC).")}
          </p>
        )}

        <Tabs className="mt-4" selectedKey={tab} onSelectionChange={(k) => setTab(String(k))}>
          <Tabs.ListContainer>
            <Tabs.List aria-label="Client tabs" className="w-full">
              {[
                ["overview", tx("Profile", "Profil")],
                ["love", "Love Tags"],
                ["history", tx("Purchases", "Pembelian")],
              ].map(([k, l]) => (
                <Tabs.Tab key={k} id={k} className="flex-1 text-[12.5px]">
                  {l}
                  <Tabs.Indicator />
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>

        {tab === "overview" && (
          <>
            <Tile className="mt-3 divide-y divide-[var(--lc-line)]">
              {[
                [tx("Phone", "HP"), c.phone_e164],
                ["Email", c.email || "—"],
                [tx("Birthday", "Ulang tahun"), c.birthdate.slice(5).split("-").reverse().join("/")],
                [tx("City", "Kota"), c.city],
                [tx("Assigned to", "Ditangani"), c.assigned_user_name || tx("Unassigned", "Tanpa assignee")],
                ["WhatsApp consent", c.consent_wa ? tx("Yes", "Ya") : tx("No — WA blocked", "Tidak — WA diblokir")],
                ["Email consent", c.consent_email ? tx("Yes", "Ya") : tx("No", "Tidak")],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 px-4 py-2.5 text-[13px]">
                  <span className="text-[var(--lc-muted)]">{k}</span>
                  <span className={`text-right font-medium ${String(v).startsWith("No") || String(v).startsWith("Tidak") ? "text-[#b4441c]" : ""}`}>{v}</span>
                </div>
              ))}
            </Tile>
            {role === "supervisor" && (
              <button onClick={() => setSheet(<ReassignSheet c={c} />)} className="mt-3 w-full rounded-2xl border border-[var(--lc-forest)] py-2.5 text-[13px] font-semibold text-[var(--lc-forest)]">
                {tx("Reassign to another Sales Agent", "Pindahkan ke Sales Agent lain")}
              </button>
            )}
            <SectionTitle>{tx("Comment", "Komentar")}</SectionTitle>
            <Tile className="p-3 text-[13px] leading-relaxed">{c.client_note || <span className="text-[var(--lc-muted)]">{tx("No comment yet", "Belum ada komentar")}</span>}</Tile>
          </>
        )}
        {tab === "love" && (
          <div className="mt-3">
            {canAct ? (
              <LoveTagsEditor c={c} />
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {c.love_tags.map((t) => (
                  <Chip key={t} size="sm">
                    ♥ {tag(t)}
                  </Chip>
                ))}
              </div>
            )}
          </div>
        )}
        {tab === "history" && (
          <div className="mt-3 flex flex-col gap-2">
            {c.purchases.map((p) => (
              <Tile key={p.receipt_number} className="p-3">
                <div className="flex justify-between text-[13px]">
                  <span className="font-semibold">{p.item}</span>
                  <span>{idr(p.amount_net_idr)}</span>
                </div>
                <p className="mt-0.5 text-[11px] text-[var(--lc-muted)]">
                  {p.date} · {p.receipt_number} · {p.channel === "online" ? "Shopify" : "Odoo POS"}
                </p>
              </Tile>
            ))}
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

export function ReachOut({ customer_id, push_id }) {
  const { tx, back, notify, session } = useApp();
  const c = useClient(customer_id);
  const eligible = c.days_since_last_contact === null || c.days_since_last_contact >= 30;
  const [step, setStep] = useState(eligible ? "channel" : "blocked");
  const [channel, setChannel] = useState("whatsapp");
  const [tpl, setTpl] = useState(TEMPLATES[0]);
  const [reason, setReason] = useState(push_id ? "push" : "clienteling_kit");
  const first = c.full_name.split(" ")[0];
  const body = tpl.body
    .replace("{{first_name}}", first)
    .replace("{{tier}}", c.current_tier_name)
    .replace("{{sa_name}}", session.user.full_name.split(" ")[0])
    .replace("{{boutique_name}}", "Plaza Indonesia")
    .replace("{{links}}", "longchamp.co.id/…");

  return (
    <>
      <AppBar title="Reach Out" sub={c.full_name} onBack={back} />
      <Body>
        {step === "blocked" && (
          <div className="mt-6 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#fbe9e2] text-[28px] text-[#b4441c]">!</div>
            <p className="font-display mt-4 text-[22px] font-semibold">{tx("Contacted recently", "Baru saja dihubungi")}</p>
            <p className="mt-1 text-[13px] text-[var(--lc-muted)]">
              {tx(`${first} was contacted ${c.days_since_last_contact} days ago. Reach Out opens after 30 days.`, `${first} dihubungi ${c.days_since_last_contact} hari lalu. Reach Out terbuka setelah 30 hari.`)}
            </p>
            <Button className="mt-6 rounded-xl" variant="outline" onPress={back}>
              {tx("Back to profile", "Kembali ke profil")}
            </Button>
          </div>
        )}

        {step === "channel" && (
          <>
            <div className="rounded-2xl bg-[var(--lc-lime-soft)] p-3 text-[12.5px]">
              ✓ {tx(`Not contacted for ${c.days_since_last_contact ?? "90+"} days — eligible.`, `Belum dihubungi ${c.days_since_last_contact ?? "90+"} hari — boleh dihubungi.`)}
            </div>
            <SectionTitle>{tx("1 · Channel", "1 · Channel")}</SectionTitle>
            <div className="grid grid-cols-2 gap-2">
              {[
                ["whatsapp", "WhatsApp", c.consent_wa],
                ["call", tx("Phone call", "Telepon"), true],
              ].map(([k, l, ok]) => (
                <button
                  key={k}
                  disabled={!ok}
                  onClick={() => setChannel(k)}
                  className={`rounded-2xl border p-4 text-left ${channel === k ? "border-[var(--lc-forest)] bg-white ring-2 ring-[var(--lc-lime)]" : "border-[var(--lc-line)] bg-white"} ${!ok ? "opacity-40" : ""}`}
                >
                  <p className="text-[15px] font-semibold">{l}</p>
                  <p className="text-[11px] text-[var(--lc-muted)]">{k === "whatsapp" ? (ok ? tx("via Cekat", "via Cekat") : tx("No consent", "Tanpa consent")) : tx("Native dialer", "Dialer HP")}</p>
                </button>
              ))}
            </div>
            {channel === "whatsapp" && (
              <>
                <SectionTitle>{tx("2 · Template Library", "2 · Template Library")}</SectionTitle>
                <div className="flex flex-col gap-2">
                  {TEMPLATES.filter((t) => t.wa_template_name).map((t) => (
                    <button key={t.template_id} onClick={() => setTpl(t)} className={`rounded-2xl border p-3 text-left ${tpl.template_id === t.template_id ? "border-[var(--lc-forest)] bg-white" : "border-[var(--lc-line)] bg-white"}`}>
                      <p className="text-[13.5px] font-semibold">{t.title}</p>
                      <p className="text-[11px] text-[var(--lc-muted)]">Meta: {t.wa_template_name}</p>
                    </button>
                  ))}
                </div>
                <SectionTitle>{tx("3 · Preview", "3 · Pratinjau")}</SectionTitle>
                <div className="rounded-2xl bg-[#e6f2d6] p-3 text-[13px] leading-relaxed">{body}</div>
                <p className="mt-1 text-[11px] text-[var(--lc-muted)]">{tx("Outside the 24h window → sent as Meta-approved template.", "Di luar jendela 24 jam → dikirim sebagai template approved Meta.")}</p>
              </>
            )}
            <Button
              fullWidth
              className="mt-5 h-12 rounded-xl bg-[var(--lc-forest)] text-white"
              onPress={() => {
                notify(channel === "whatsapp" ? tx("Message sent via Cekat", "Pesan terkirim via Cekat") : tx("Calling…", "Menelepon…"));
                setStep("log");
              }}
            >
              {channel === "whatsapp" ? tx("Send on WhatsApp", "Kirim via WhatsApp") : tx("Call now", "Telepon sekarang")}
            </Button>
          </>
        )}

        {step === "log" && (
          <>
            <p className="font-display mt-2 text-[22px] font-semibold">{tx("Back in the app — log it", "Kembali ke app — catat")}</p>
            <p className="text-[12.5px] text-[var(--lc-muted)]">{tx("Select the reason and the channel used, then validate.", "Pilih alasan dan channel yang dipakai, lalu validasi.")}</p>
            <SectionTitle>{tx("Contact reason", "Alasan kontak")}</SectionTitle>
            <div className="flex flex-wrap gap-1.5">
              {REACH_REASONS.map((r) => (
                <Pill key={r} active={reason === r} onClick={() => setReason(r)}>
                  {tag(r)}
                </Pill>
              ))}
            </div>
            <SectionTitle>{tx("Channel used", "Channel dipakai")}</SectionTitle>
            <div className="flex flex-wrap gap-1.5">
              {["whatsapp", "call", "sms", "email"].map((r) => (
                <Pill key={r} active={channel === r} onClick={() => setChannel(r)}>
                  {r}
                </Pill>
              ))}
            </div>
            <Button
              fullWidth
              className="mt-6 h-12 rounded-xl bg-[var(--lc-forest)] text-white"
              onPress={() => {
                notify(tx("Reach Out logged · 30-day attribution started", "Reach Out tercatat · atribusi 30 hari dimulai"));
                back();
              }}
            >
              {tx("Validate", "Validasi")}
            </Button>
          </>
        )}
      </Body>
    </>
  );
}

export function Lists() {
  const { tx, back, nav, stack } = useApp();
  return (
    <>
      <AppBar title={tx("Customer Lists", "Daftar Pelanggan")} sub={tx("Dynamic lists & Client Book", "Dynamic list & Client Book")} onBack={stack.length > 1 ? back : undefined} />
      <Body>
        <button onClick={() => nav("list_builder")} className="w-full rounded-2xl bg-[var(--lc-forest)] p-4 text-left text-white">
          <p className="text-[15px] font-semibold">+ {tx("New dynamic list", "Dynamic list baru")}</p>
          <p className="text-[12px] text-white/70">{tx("Filter by tier, SA, wishlist, reason, category, area…", "Filter tier, SA, wishlist, alasan, kategori, area…")}</p>
        </button>
        <SectionTitle>{tx("Saved lists", "List tersimpan")}</SectionTitle>
        <div className="flex flex-col gap-2">
          {LISTS.map((l) => (
            <Tile key={l.list_id} onClick={() => nav("list_detail", { list_id: l.list_id })} className="flex items-center gap-3 p-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--lc-lime-soft)] text-[11px] font-bold text-[var(--lc-forest)]">
                {{ dynamic: "DYN", client_book: "BOOK", event_guests: "EVT", manual: "MAN" }[l.list_type]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold">{l.name}</p>
                <p className="text-[11.5px] text-[var(--lc-muted)]">{l.filter}</p>
              </div>
              <span className="font-display text-[20px]">{l.member_count}</span>
            </Tile>
          ))}
        </div>
      </Body>
    </>
  );
}

export function ListBuilder() {
  const { tx, back, notify } = useApp();
  const [tiers, setTiers] = useState(new Set(["FAN", "FRIEND", "FAMILY"]));
  const [win, setWin] = useState(30);
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
        <div className="mt-4 rounded-2xl bg-white p-3 text-center">
          <p className="font-display text-[32px] text-[var(--lc-forest)]">18</p>
          <p className="text-[12px] text-[var(--lc-muted)]">{tx("matching clients in your scope", "klien cocok dalam scope Anda")}</p>
        </div>
        <Button
          fullWidth
          className="mt-4 h-12 rounded-xl bg-[var(--lc-forest)] text-white"
          onPress={() => {
            notify(tx("List saved", "List tersimpan"));
            back();
          }}
        >
          {tx("Save list", "Simpan list")}
        </Button>
      </Body>
    </>
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
        <div className="flex flex-col gap-2">
          {members.map((c, i) => (
            <Tile key={c.customer_id} onClick={() => nav("client", { customer_id: c.customer_id })} className="flex items-center gap-3 p-3">
              <Initials name={c.full_name} size={36} />
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-semibold">{c.full_name}</p>
                <p className="text-[11px] text-[var(--lc-muted)]">
                  {l.list_type === "event_guests" ? ["accepted", "no reply", "accepted", "declined", "invited"][i] : `🎂 ${c.birthdate.slice(5).split("-").reverse().join("/")}`}
                </p>
              </div>
              <TierBadge tier={c.current_tier_name} small />
            </Tile>
          ))}
        </div>
        {l.list_type === "event_guests" && session.role !== "super_admin" && (
          <Button fullWidth className="mt-4 h-12 rounded-xl bg-[var(--lc-forest)] text-white">
            {tx("Send invitation (WA template)", "Kirim undangan (template WA)")}
          </Button>
        )}
      </Body>
    </>
  );
}

export function TicketNew({ customer_id }) {
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
          <Field label="SKU" defaultValue="L1899089P59 · Le Pliage Original M" />
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
