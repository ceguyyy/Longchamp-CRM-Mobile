import { useState } from "react";
import { Button, Input, Label, ProgressBar, Switch, Tabs, TextField } from "@heroui/react";
import { useApp, AppBar, Body, SectionTitle, Tile, TierBadge, Initials, Pill, Stat, BagArt, Icon, LcButton } from "../core";
import { PushRow } from "./Home";
import { visibleClients } from "./Clients";
import {
  AGENDA, PUSHES, PRODUCTS, BOUTIQUES, CLIENTS, TEAM, KPI, BY_CHANNEL, BY_BOUTIQUE, TEMPLATES, PUSH_RULES, PUSH_LABEL, USERS, WISHLIST_KPI, PUSH_KPI, idr, idrShort,
} from "../data";

/* ================================================================ ACTIONS */
export function Actions() {
  const { tx, session, nav } = useApp();
  const [tab, setTab] = useState("pushes");
  const [status, setStatus] = useState("sent");
  const [boutique, setBoutique] = useState(3);
  const inScope = (p) =>
    session.role === "sales_agent" ? p.assigned_user_id === 87 : session.role === "supervisor" ? [87, 91, 94, 12].includes(p.assigned_user_id) : true;
  const pushes = PUSHES.filter(inScope).filter(
    (p) => status === "all" || p.status === status
  );
  return (
    <>
      <AppBar
        title={tx("Actions", "Aksi")}
        sub={session.role === "supervisor" ? tx("Team pushes & agenda", "Push & agenda tim") : tx("Clienteling pushes & agenda", "Clienteling push & agenda")}
        right={
          <button onClick={() => nav("agenda_new", {})} className="grid h-9 w-9 place-items-center bg-black text-[20px] text-white" aria-label="New">
            +
          </button>
        }
      />
      <Body>
        <Tabs selectedKey={tab} onSelectionChange={(k) => setTab(String(k))}>
          <Tabs.ListContainer>
            <Tabs.List aria-label="Actions" className="w-full">
              <Tabs.Tab id="pushes" className="flex-1">
                {tx("Pushes", "Push")}
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="agenda" className="flex-1">
                Agenda
                <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>

        {tab === "pushes" && (
          <>
            <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
              {[
                ["sent", tx("To do", "Belum")],
                ["executed", tx("Executed", "Selesai")],
                ["cancelled", tx("Cancelled", "Batal")],
                ["all", tx("All", "Semua")],
              ].map(([k, l]) => (
                <Pill key={k} active={status === k} onClick={() => setStatus(k)}>
                  {l}
                </Pill>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {Object.entries(PUSH_LABEL).map(([k, v]) => (
                <div key={k} className="rounded-xl bg-white p-2.5">
                  <span className="mb-1 block h-1 w-6 rounded-full" style={{ background: v.color }} />
                  <p className="text-[11.5px] font-semibold">{v.en}</p>
                  <p className="text-[10.5px] text-[var(--lc-muted)]">{PUSHES.filter((p) => p.push_type === k).length} {tx("this month", "bulan ini")}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-col gap-2">
              {pushes.map((p) => (
                <PushRow key={p.push_id} p={p} />
              ))}
              {pushes.length === 0 && <p className="py-8 text-center text-[13px] text-[var(--lc-muted)]">{tx("Nothing here", "Kosong")}</p>}
            </div>
          </>
        )}

        {tab === "agenda" && (
          <>
            {session.role !== "sales_agent" && (
              <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
                {(session.role === "supervisor" ? BOUTIQUES.filter((b) => b.boutique_id === 3) : BOUTIQUES).map((b) => (
                  <Pill key={b.boutique_id} active={boutique === b.boutique_id} onClick={() => setBoutique(b.boutique_id)}>
                    {b.boutique_name}
                  </Pill>
                ))}
              </div>
            )}
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                [tx("Appointments", "Appointment"), "appointment"],
                [tx("Tasks", "Task"), "task"],
              ].map(([l, kind]) => {
                const items = AGENDA.filter((a) => a.item_type === kind);
                const todo = items.filter((a) => a.status === "open").length;
                const late = kind === "task" ? 1 : 0;
                return (
                  <div key={kind} className="border border-[var(--lc-line)] p-2.5">
                    <p className="caps text-[10px]">{l}</p>
                    <p className="mt-1 text-[12px]">
                      <span className="text-[18px]">{todo}</span> {tx("to do", "belum")}
                      <span className="mx-1.5 text-[var(--lc-muted)]">|</span>
                      <span className={late ? "text-[#b4441c]" : ""}>
                        <span className="text-[18px]">{late}</span> {tx("late", "terlambat")}
                      </span>
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 grid grid-cols-7 gap-1 text-center">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <div key={i} className={`rounded-xl py-2 ${i === 0 ? "bg-[var(--lc-forest)] text-white" : "bg-white"}`}>
                  <p className="text-[10px] opacity-60">{d}</p>
                  <p className="text-[15px] font-semibold">{16 + i}</p>
                  <span className={`mx-auto mt-0.5 block h-1 w-1 rounded-full ${[0, 2, 3, 5].includes(i) ? (i === 0 ? "bg-[var(--lc-lime)]" : "bg-[var(--lc-forest)]") : ""}`} />
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-col gap-2">
              {AGENDA.map((a) => (
                <Tile key={a.agenda_item_id} className={`flex gap-3 p-3 ${a.status === "done" ? "opacity-50" : ""}`}>
                  <div className="w-[84px] shrink-0">
                    <p className="text-[13px] font-semibold text-[var(--lc-forest)]">{a.time.split(" ")[0]}</p>
                    <p className="text-[10px] uppercase text-[var(--lc-muted)]">{a.item_type}</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-[13.5px] font-medium ${a.status === "done" ? "line-through" : ""}`}>{a.title}</p>
                    <p className="text-[11px] text-[var(--lc-muted)]">
                      {a.subtype.replace(/_/g, " ")} · {a.source}
                    </p>
                  </div>
                </Tile>
              ))}
            </div>
          </>
        )}
      </Body>
    </>
  );
}

const SLOTS = ["10:00", "10:30", "11:00", "11:30", "13:00", "14:00", "15:30", "16:00", "17:00", "19:00"];
const BUSY = ["11:00", "14:00"];
export function AgendaNew({ customer_id, kind }) {
  const { tx, back, notify } = useApp();
  const [type, setType] = useState(kind || "appointment");
  const [slot, setSlot] = useState("15:30");
  const [sub, setSub] = useState("one_to_one");
  const c = customer_id && CLIENTS.find((x) => x.customer_id === customer_id);
  const subs = type === "task" ? ["call", "follow_up", "prepare_appointment", "styling_session"] : ["one_to_one", "coffee_catchup", "personalisation", "rtw_fitting"];
  return (
    <>
      <AppBar title={tx("New agenda item", "Item agenda baru")} sub={c ? c.full_name : undefined} onBack={back} />
      <Body>
        <div className="grid grid-cols-2 gap-2">
          {[
            ["task", tx("Task", "Task")],
            ["appointment", tx("Appointment", "Appointment")],
          ].map(([k, l]) => (
            <button
              key={k}
              onClick={() => {
                setType(k);
                setSub(k === "task" ? "call" : "one_to_one");
              }}
              className={`rounded-2xl border p-3 text-[14px] font-semibold ${type === k ? "border-[var(--lc-forest)] bg-[var(--lc-forest)] text-white" : "border-[var(--lc-line)] bg-white"}`}
            >
              {l}
            </button>
          ))}
        </div>
        <SectionTitle>{tx("Kind", "Jenis")}</SectionTitle>
        <div className="flex flex-wrap gap-1.5">
          {subs.map((s) => (
            <Pill key={s} active={sub === s} onClick={() => setSub(s)}>
              {s.replace(/_/g, " ")}
            </Pill>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-3">
          <TextField className="flex flex-col gap-1" defaultValue={c ? `${sub.replace(/_/g, " ")} · ${c.full_name}` : ""}>
            <Label className="text-[12px] font-medium">{tx("Title", "Judul")}</Label>
            <Input className="h-11 rounded-xl border border-[var(--lc-line)] bg-white px-3 text-[14px]" />
          </TextField>
          <div className="grid grid-cols-2 gap-2">
            <TextField className="flex flex-col gap-1" defaultValue="Mon 23 Nov">
              <Label className="text-[12px] font-medium">{tx("Date", "Tanggal")}</Label>
              <Input className="h-11 rounded-xl border border-[var(--lc-line)] bg-white px-3 text-[14px]" />
            </TextField>
            <TextField className="flex flex-col gap-1" value={slot} onChange={setSlot}>
              <Label className="text-[12px] font-medium">{tx("Time", "Jam")}</Label>
              <Input className="h-11 rounded-xl border border-[var(--lc-line)] bg-white px-3 text-[14px]" />
            </TextField>
          </div>
          <div>
            <p className="caps mb-1.5 text-[10px]">{tx("Free slots, Mon 23 Nov", "Slot kosong, Sen 23 Nov")}</p>
            <div className="grid grid-cols-5 gap-1.5">
              {SLOTS.map((t) => {
                const busy = BUSY.includes(t);
                return (
                  <button
                    key={t}
                    disabled={busy}
                    onClick={() => setSlot(t)}
                    className={`border py-2 text-[12px] ${slot === t ? "border-black bg-black text-white" : busy ? "border-[var(--lc-line)] text-[#c4c4c4] line-through" : "border-[var(--lc-line)]"}`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
          <Button
            fullWidth
            className="mt-2 h-12 rounded-xl bg-[var(--lc-forest)] text-white"
            onPress={() => {
              notify(tx("Saved to Agenda in Cekat CRM", "Tersimpan di Agenda (Cekat CRM)"));
              back();
            }}
          >
            {tx("Save", "Simpan")}
          </Button>
        </div>
      </Body>
    </>
  );
}

/* ================================================================ CATALOG & WISHLIST */
function WishlistBar() {
  const { wishlist, tx, nav } = useApp();
  if (!wishlist.length) return null;
  return (
    <button onClick={() => nav("wishlist_send", {})} className="absolute inset-x-4 bottom-[92px] z-20 flex items-center justify-between bg-black px-4 py-3 text-white">
      <span className="text-[13px]">
        ♥ {wishlist.length} {tx("in wishlist", "di wishlist")}
      </span>
      <span className="text-[13px] font-semibold text-[var(--lc-lime)]">{tx("Send", "Kirim")} ›</span>
    </button>
  );
}

function ConnectedChip() {
  const { connected, tx } = useApp();
  const c = connected && CLIENTS.find((x) => x.customer_id === connected);
  if (!c) return null;
  return (
    <div className="-mx-4 mb-3 flex items-center gap-2 bg-[var(--lc-lime)] px-4 py-1.5 text-[11.5px]">
      <Icon name="userCheck" size={15} />
      {tx("Connected:", "Terhubung:")} <span className="uppercase tracking-[0.06em]">{c.full_name}</span>
    </div>
  );
}

export function Scan() {
  const { tx, back, nav } = useApp();
  const [found, setFound] = useState(false);
  const p = PRODUCTS[0];
  return (
    <>
      <AppBar title={tx("Scan a barcode", "Pindai barcode")} onBack={back} />
      <div className="relative flex flex-1 flex-col bg-black text-white">
        <div className="relative mx-8 mt-10 aspect-[4/3] border border-white/30">
          {["left-0 top-0 border-l-2 border-t-2", "right-0 top-0 border-r-2 border-t-2", "left-0 bottom-0 border-l-2 border-b-2", "right-0 bottom-0 border-r-2 border-b-2"].map((c) => (
            <span key={c} className={`absolute h-6 w-6 border-[var(--lc-lime)] ${c}`} />
          ))}
          <span className="absolute inset-x-4 top-1/2 h-px bg-[var(--lc-lime)]" />
          <div className="absolute inset-0 grid place-items-center opacity-70">
            <Icon name="barcode" size={72} stroke={1} />
          </div>
        </div>
        <p className="mt-5 px-8 text-center text-[12.5px]">
          {found ? `${p.product_name} · SKU ${p.sku}` : tx("Point the camera at the product label", "Arahkan kamera ke label produk")}
        </p>
        <p className="mt-1 px-8 text-center text-[10.5px] text-white/60">{tx("Barcode → Shopify variant lookup", "Barcode → pencarian varian Shopify")}</p>
        <div className="mt-auto p-4">
          {found ? (
            <button className="w-full bg-white py-3 text-[12px] uppercase tracking-[0.1em] text-black" onClick={() => nav("product", { sku: p.sku })}>
              {tx("Open product", "Buka produk")}
            </button>
          ) : (
            <button className="w-full border border-white py-3 text-[12px] uppercase tracking-[0.1em]" onClick={() => setFound(true)}>
              {tx("Simulate scan", "Simulasikan pindai")}
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export function Catalog({ customer_id }) {
  const { tx, nav, back, stack } = useApp();
  const [col, setCol] = useState("All");
  const cols = ["All", ...new Set(PRODUCTS.map((p) => p.collection))];
  const list = PRODUCTS.filter((p) => col === "All" || p.collection === col);
  const c = customer_id && CLIENTS.find((x) => x.customer_id === customer_id);
  return (
    <>
      <AppBar title={tx("Product Catalog", "Katalog Produk")} sub={c ? `${tx("Wishlist for", "Wishlist untuk")} ${c.full_name}` : tx("Live from Shopify · stock from Odoo", "Live dari Shopify · stok dari Odoo")} onBack={stack.length > 1 ? back : undefined} />
      <Body>
        <ConnectedChip />
        <div className="mb-3 flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2 border-b-2 border-[var(--lc-lime)] pb-1.5 text-[12.5px] text-[#8a8a8a]">
            <Icon name="search" size={16} />
            {tx("Search", "Cari")}
          </div>
          <button aria-label="Scan" onClick={() => nav("scan")}>
            <Icon name="barcode" size={22} stroke={1.3} />
          </button>
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {cols.map((x) => (
            <Pill key={x} active={col === x} onClick={() => setCol(x)}>
              {x}
            </Pill>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 pb-16">
          {list.map((p) => (
            <button key={p.sku} onClick={() => nav("product", { sku: p.sku, customer_id })} className="text-left">
              <span className="relative block">
                <BagArt color={p.color} size={165} />
                <span className="absolute right-2 top-2 text-[var(--lc-lime)]">
                  <Icon name="heart" size={18} />
                </span>
                {!p.stock[3] && <span className="caps absolute bottom-2 left-2 bg-white px-1.5 py-0.5 text-[8.5px]">{tx("Notify me", "Beritahu saya")}</span>}
              </span>
              <p className="mt-1.5 text-[13px] leading-tight">{p.product_name}</p>
              <p className="text-[12px] text-[var(--lc-muted)]">{idr(p.price_idr)}</p>
              <p className={`text-[11px] ${p.stock[3] ? "text-[var(--lc-forest)]" : "text-[#b4441c]"}`}>
                {p.stock[3] ? `${p.stock[3]} ${tx("in my boutique", "di boutique saya")}` : tx("Out of stock here", "Habis di sini")}
              </p>
            </button>
          ))}
        </div>
      </Body>
      <WishlistBar />
    </>
  );
}

/* Pick a customer, then save the product to that customer's wishlist (Wishlist board, status saved) */
export function addToClientWishlist(app, customer_id, sku) {
  const { clientWishlist, setClientWishlist, session } = app;
  const cur = clientWishlist[customer_id] || [];
  if (cur.some((w) => w.sku === sku && w.status !== "purchased")) return false;
  setClientWishlist({
    ...clientWishlist,
    [customer_id]: [...cur, { sku, status: "saved", added_at: "2026-11-16", added_by: session.user.full_name, source: "catalog" }],
  });
  return true;
}

function PickClientSheet({ sku }) {
  const app = useApp();
  const { tx, setSheet, notify, session, nav } = app;
  const [q, setQ] = useState("");
  const list = visibleClients(session.role).filter((c) => c.full_name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <p className="mb-2 text-[15px]">{tx("Add to a client's wishlist", "Tambah ke wishlist klien")}</p>
      <div className="mb-2 flex items-center gap-2 border-b-2 border-[var(--lc-lime)] pb-1.5">
        <Icon name="search" size={16} />
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={tx("Name, phone or e-mail", "Nama, telepon, atau e-mail")} className="flex-1 bg-transparent text-[13px] outline-none" />
      </div>
      <div className="max-h-[300px] overflow-y-auto">
        {list.map((c) => {
          const n = (app.clientWishlist[c.customer_id] || []).filter((w) => w.status !== "purchased").length;
          return (
            <button
              key={c.customer_id}
              onClick={() => {
                const ok = addToClientWishlist(app, c.customer_id, sku);
                setSheet(null);
                notify(ok ? tx(`Saved to ${c.full_name}'s wishlist in Cekat CRM`, `Tersimpan di wishlist ${c.full_name} (Cekat CRM)`) : tx("Already in this client's wishlist", "Sudah ada di wishlist klien ini"));
                nav("client_wishlist", { customer_id: c.customer_id });
              }}
              className="flex w-full items-center gap-2 border-b border-[var(--lc-line)] py-2.5 text-left"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12.5px] uppercase tracking-[0.05em]">{c.full_name}</span>
                <span className="block text-[10.5px] text-[var(--lc-muted)]">
                  {n} {tx("in wishlist", "di wishlist")}
                  {c.consent_wa ? "" : `, ${tx("no WhatsApp consent", "tanpa consent WhatsApp")}`}
                </span>
              </span>
              <TierBadge tier={c.current_tier_name} small />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Product({ sku, customer_id }) {
  const app = useApp();
  const { tx, back, wishlist, setWishlist, notify, session, nav, connected, setSheet } = app;
  const forClient = customer_id || connected;
  const fc = forClient && CLIENTS.find((x) => x.customer_id === forClient);
  const p = PRODUCTS.find((x) => x.sku === sku);
  const inList = wishlist.some((w) => w.sku === sku);
  return (
    <>
      <AppBar title="" onBack={back} />
      <Body>
        <ConnectedChip />
        <div className="flex justify-center">
          <BagArt color={p.color} size={300} />
        </div>
        <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-[var(--lc-muted)]">{p.collection}</p>
        <p className="font-display text-[26px] font-semibold leading-tight">{p.product_name}</p>
        <p className="text-[15px]">{idr(p.price_idr)}</p>
        <p className="text-[11px] text-[var(--lc-muted)]">SKU {p.sku}</p>
        <SectionTitle>{tx("Stock by boutique (Odoo, live)", "Stok per boutique (Odoo, live)")}</SectionTitle>
        <Tile className="divide-y divide-[var(--lc-line)]">
          {BOUTIQUES.map((b) => (
            <div key={b.boutique_id} className="flex items-center justify-between px-4 py-2.5 text-[13px]">
              <span className={b.boutique_id === 3 ? "font-semibold" : ""}>
                {b.boutique_name}
                {b.boutique_id === 3 && session.role !== "super_admin" ? ` · ${tx("mine", "saya")}` : ""}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[11.5px] font-semibold ${p.stock[b.boutique_id] ? "bg-[var(--lc-lime-soft)] text-[var(--lc-forest)]" : "bg-[#fbe9e2] text-[#b4441c]"}`}>
                {p.stock[b.boutique_id]}
              </span>
            </div>
          ))}
        </Tile>
        {session.role !== "super_admin" && (
          <div className="mt-4 flex flex-col gap-2">
            {fc ? (
              <LcButton
                onClick={() => {
                  const ok = addToClientWishlist(app, fc.customer_id, sku);
                  notify(ok ? tx(`Saved to ${fc.full_name}'s wishlist in Cekat CRM`, `Tersimpan di wishlist ${fc.full_name} (Cekat CRM)`) : tx("Already in this client's wishlist", "Sudah ada di wishlist klien ini"));
                }}
              >
                ♥ {tx(`Add to ${fc.full_name.split(" ")[0]}'s wishlist`, `Tambah ke wishlist ${fc.full_name.split(" ")[0]}`)}
              </LcButton>
            ) : null}
            <LcButton variant={fc ? "outline" : "primary"} onClick={() => setSheet(<PickClientSheet sku={sku} />)}>
              {fc ? tx("Another client…", "Klien lain…") : `♥ ${tx("Add to a client's wishlist", "Tambah ke wishlist klien")}`}
            </LcButton>
            <button
              className="py-1 text-[11px] underline"
              onClick={() => {
                if (inList) setWishlist(wishlist.filter((w) => w.sku !== sku));
                else {
                  setWishlist([...wishlist, { ...p, customer_id }]);
                  notify(tx("Added to the basket to send", "Ditambahkan ke keranjang kirim"));
                }
              }}
            >
              {inList ? tx("Remove from send basket", "Hapus dari keranjang kirim") : tx("Add to send basket only", "Hanya tambah ke keranjang kirim")}
            </button>
          </div>
        )}
        {session.role !== "super_admin" && (
          <LcButton variant="outline" className="mb-16 mt-2" onClick={() => nav("ticket_new", { customer_id: customer_id || connected || 100245, sku })}>
            {tx("Create a ticket", "Buat tiket")}
          </LcButton>
        )}
      </Body>
      <WishlistBar />
    </>
  );
}

const WL_STATUS = {
  saved: ["Saved", "Tersimpan", "border border-black"],
  sent: ["Sent", "Terkirim", "bg-black text-white"],
  purchased: ["Purchased", "Dibeli", "bg-[var(--lc-lime)] text-black"],
};
export function ClientWishlist({ customer_id }) {
  const app = useApp();
  const { tx, back, nav, notify, clientWishlist, setClientWishlist, setWishlist } = app;
  const c = CLIENTS.find((x) => x.customer_id === customer_id);
  const items = (clientWishlist[customer_id] || []).map((w) => ({ ...w, p: PRODUCTS.find((x) => x.sku === w.sku) })).filter((w) => w.p);
  const saved = items.filter((w) => w.status === "saved");
  const remove = (sku) => {
    setClientWishlist({ ...clientWishlist, [customer_id]: (clientWishlist[customer_id] || []).filter((w) => !(w.sku === sku && w.status === "saved")) });
    notify(tx("Removed from wishlist in Cekat CRM", "Dihapus dari wishlist di Cekat CRM"));
  };
  return (
    <>
      <AppBar title={tx("Client wishlist", "Wishlist klien")} onBack={back} />
      <Body pad={false}>
        <div className="bg-black px-4 pb-3 text-white">
          <p className="text-[15px] uppercase tracking-[0.06em]">{c.full_name}</p>
          <p className="text-[11px] text-white/60">
            {items.length} {tx("products", "produk")}, {saved.length} {tx("not sent yet", "belum dikirim")}
          </p>
        </div>
        <div className="px-4">
          {items.length === 0 && <p className="py-8 text-center text-[13px] text-[var(--lc-muted)]">{tx("No products yet. Add one from the catalog.", "Belum ada produk. Tambahkan dari katalog.")}</p>}
          {items.map((w) => (
            <div key={w.sku + w.status} className="flex items-center gap-3 border-b border-[var(--lc-line)] py-2.5">
              <button onClick={() => nav("product", { sku: w.sku, customer_id })}>
                <BagArt color={w.p.color} size={56} />
              </button>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px]">{w.p.product_name}</p>
                <p className="text-[11px] text-[var(--lc-muted)]">
                  {idr(w.p.price_idr)}, {w.p.stock[3] ? `${w.p.stock[3]} ${tx("in boutique", "di boutique")}` : tx("out of stock here", "habis di sini")}
                </p>
                <p className="text-[10.5px] text-[var(--lc-muted)]">
                  {tx("Added", "Ditambah")} {w.added_at.slice(5).split("-").reverse().join("/")} {tx("by", "oleh")} {w.added_by}
                  {w.sent_at ? `, ${tx("sent", "dikirim")} ${w.sent_at.slice(5).split("-").reverse().join("/")}${w.delivery ? ` (${w.delivery})` : ""}` : ""}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className={`caps px-1.5 py-0.5 text-[8.5px] ${WL_STATUS[w.status][2]}`}>{tx(WL_STATUS[w.status][0], WL_STATUS[w.status][1])}</span>
                {w.status === "saved" && (
                  <button onClick={() => remove(w.sku)} className="text-[10.5px] underline">
                    {tx("Remove", "Hapus")}
                  </button>
                )}
              </div>
            </div>
          ))}
          <LcButton variant="outline" className="mt-4" onClick={() => nav("catalog_pick", { customer_id })}>
            + {tx("Add products", "Tambah produk")}
          </LcButton>
          <LcButton
            className="mb-6 mt-2"
            onClick={() => {
              if (!saved.length) return notify(tx("Nothing new to send", "Tidak ada yang baru untuk dikirim"));
              if (!c.consent_wa) return notify(tx("No WhatsApp consent for this client", "Klien ini belum consent WhatsApp"));
              setWishlist(saved.map((w) => ({ ...w.p, customer_id })));
              nav("wishlist_send", { customer_id });
            }}
          >
            {tx(`Send ${saved.length} on WhatsApp`, `Kirim ${saved.length} via WhatsApp`)}
          </LcButton>
        </div>
      </Body>
    </>
  );
}

export function WishlistSend() {
  const { tx, back, wishlist, setWishlist, notify, reset, session, clientWishlist, setClientWishlist } = useApp();
  const preset = wishlist.find((w) => w.customer_id)?.customer_id;
  const [cid, setCid] = useState(preset || 100245);
  const clients = visibleClients(session.role).filter((c) => c.consent_wa);
  const c = CLIENTS.find((x) => x.customer_id === cid);
  return (
    <>
      <AppBar title={tx("Send wishlist", "Kirim wishlist")} onBack={back} />
      <Body>
        <SectionTitle>{tx("Client (WhatsApp consent only)", "Klien (hanya yang consent WhatsApp)")}</SectionTitle>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4">
          {clients.map((x) => (
            <Pill key={x.customer_id} active={cid === x.customer_id} onClick={() => setCid(x.customer_id)}>
              {x.full_name}
            </Pill>
          ))}
        </div>
        <SectionTitle>{tx("Products", "Produk")}</SectionTitle>
        <div className="flex flex-col gap-2">
          {wishlist.map((p) => (
            <Tile key={p.sku} className="flex items-center gap-3 p-2.5">
              <BagArt color={p.color} size={52} />
              <div className="flex-1">
                <p className="text-[13px] font-semibold">{p.product_name}</p>
                <p className="text-[11.5px] text-[var(--lc-muted)]">{idr(p.price_idr)}</p>
              </div>
            </Tile>
          ))}
        </div>
        <SectionTitle>{tx("Message preview", "Pratinjau pesan")}</SectionTitle>
        <div className="rounded-2xl bg-[#e6f2d6] p-3 text-[13px] leading-relaxed">
          {`Halo ${c.full_name.split(" ")[0]}, berikut pilihan dari saya untuk Anda: `}
          {wishlist.map((p) => p.product_name).join(", ")}. {`— ${session.user.full_name.split(" ")[0]}, Plaza Indonesia`}
        </div>
        <Button
          fullWidth
          className="mt-4 h-12 rounded-xl bg-[var(--lc-forest)] text-white"
          onPress={() => {
            const skus = wishlist.map((w) => w.sku);
            const cur = clientWishlist[cid] || [];
            const kept = cur.filter((w) => !(skus.includes(w.sku) && w.status === "saved"));
            setClientWishlist({
              ...clientWishlist,
              [cid]: [...kept, ...skus.map((sku) => ({ sku, status: "sent", added_at: "2026-11-16", sent_at: "2026-11-16", delivery: "sent", added_by: session.user.full_name, source: "catalog" }))],
            });
            setWishlist([]);
            notify(tx("Wishlist sent · tracked for 30 days", "Wishlist terkirim · dilacak 30 hari"));
            reset("home");
          }}
        >
          {tx("Send on WhatsApp", "Kirim via WhatsApp")}
        </Button>
      </Body>
    </>
  );
}

/* ================================================================ PERFORMANCE */
export function Performance() {
  const { tx, session, back, stack } = useApp();
  const role = session.role;
  const k = KPI[role];
  const [period, setPeriod] = useState("month");
  return (
    <>
      <AppBar
        title={role === "super_admin" ? tx("Country KPI", "KPI Negara") : tx("My results", "Hasil saya")}
        sub={{ sales_agent: tx("Sales Agent level", "Level Sales Agent"), supervisor: tx("Boutique level", "Level boutique"), super_admin: tx("Indonesia · 5 POS", "Indonesia · 5 POS") }[role]}
        onBack={stack.length > 1 ? back : undefined}
      />
      <Body>
        <div className="flex gap-2">
          {[
            ["month", tx("This month", "Bulan ini")],
            ["12m", tx("12 months", "12 bulan")],
          ].map(([kk, l]) => (
            <Pill key={kk} active={period === kk} onClick={() => setPeriod(kk)}>
              {l}
            </Pill>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Stat dark label={tx("Sales", "Sales")} value={idrShort(period === "month" ? k.sales_idr : k.sales_idr * 10.4)} sub={`${k.vs_last_month_pts > 0 ? "+" : ""}${k.vs_last_month_pts} pts vs LM`} />
          <Stat label="Conv. rate" value={k.conversion_rate} sub={tx("converted / actions", "konversi / actions")} />
          <Stat label="Actions" value={period === "month" ? k.actions : k.actions * 11} sub={`${k.actions_per_pos_day} / POS / ${tx("day", "hari")}`} />
          <Stat label={tx("Avg conv. days", "Rata-rata hari konv.")} value={k.avg_conversion_days} />
        </div>
        <SectionTitle>{tx("By channel", "Per channel")}</SectionTitle>
        <Tile className="p-3">
          {BY_CHANNEL.map((c) => (
            <div key={c.channel} className="mb-2.5 last:mb-0">
              <div className="flex justify-between text-[12.5px]">
                <span className="font-medium">{c.channel}</span>
                <span className="text-[var(--lc-muted)]">
                  {tx("share", "porsi")} {c.share} · conv. {c.conversion_rate} · {idrShort(c.sales_idr)}
                </span>
              </div>
              <ProgressBar aria-label={c.channel} value={c.share} className="mt-1">
                <ProgressBar.Track className="h-1.5 rounded-full bg-[#eceee5]">
                  <ProgressBar.Fill className="rounded-full bg-[var(--lc-forest)]" />
                </ProgressBar.Track>
              </ProgressBar>
            </div>
          ))}
        </Tile>
        <SectionTitle>{tx("Wishlist", "Wishlist")}</SectionTitle>
        <div className="grid grid-cols-2 gap-2">
          <Stat label={tx("Wishlists sent", "Wishlist terkirim")} value={WISHLIST_KPI.sent} />
          <Stat label="Conv. rate" value={WISHLIST_KPI.conversion_rate} sub={`${WISHLIST_KPI.vs_lm_pts} pts vs LM`} />
          <Stat label={tx("Wishlist sales", "Sales wishlist")} value={idrShort(WISHLIST_KPI.sales_idr)} sub={`${WISHLIST_KPI.vs_lm_pct} vs LM`} />
          <Stat label={tx("Avg conv. days", "Rata-rata hari konv.")} value={WISHLIST_KPI.avg_conversion_days} />
        </div>
        <SectionTitle>{tx("Push completion", "Penyelesaian push")}</SectionTitle>
        <Tile className="p-3">
          <div className="flex justify-between text-[12.5px]">
            <span>
              {PUSH_KPI.executed}/{PUSH_KPI.sent} {tx("executed", "dieksekusi")}
            </span>
            <span className="text-[var(--lc-muted)]">
              {PUSH_KPI.cancelled} {tx("cancelled", "dibatalkan")} ({PUSH_KPI.cancelled_pct})
            </span>
          </div>
          <ProgressBar aria-label="push completion" value={PUSH_KPI.treated} className="mt-1.5">
            <ProgressBar.Track className="h-1.5 bg-[#ececec]">
              <ProgressBar.Fill className="bg-black" />
            </ProgressBar.Track>
          </ProgressBar>
          <p className="mt-1.5 text-[11px] text-[var(--lc-muted)]">
            {tx("Treated", "Ditangani")} {PUSH_KPI.treated} ({PUSH_KPI.vs_lm_pts > 0 ? "+" : ""}
            {PUSH_KPI.vs_lm_pts} pts vs LM) · {tx("not treated", "belum ditangani")} {PUSH_KPI.non_treated}
          </p>
        </Tile>
        <SectionTitle>{tx("By reason", "Per alasan")}</SectionTitle>
        <Tile className="divide-y divide-[var(--lc-line)]">
          {[
            ["Wishlist", 18, "617 jt"],
            ["Birthday", 4, "133 jt"],
            ["Clienteling kit", 2, "13 jt"],
            ["Services & appointment", 5, "245 jt"],
          ].map(([r, cv, s]) => (
            <div key={r} className="flex justify-between px-4 py-2.5 text-[12.5px]">
              <span>{r}</span>
              <span className="text-[var(--lc-muted)]">
                conv. {cv} · {s}
              </span>
            </div>
          ))}
        </Tile>
        {role === "super_admin" && (
          <>
            <SectionTitle>{tx("By boutique", "Per boutique")}</SectionTitle>
            <Tile className="divide-y divide-[var(--lc-line)]">
              {BY_BOUTIQUE.map((b) => (
                <div key={b.boutique_name} className="flex justify-between px-4 py-2.5 text-[12.5px]">
                  <span className="font-medium">{b.boutique_name}</span>
                  <span className="text-[var(--lc-muted)]">
                    {b.actions} · conv. {b.conversion_rate} · {idrShort(b.sales_idr)}
                  </span>
                </div>
              ))}
            </Tile>
          </>
        )}
        <p className="mt-3 text-[10.5px] text-[var(--lc-muted)]">{tx("Rates shown as plain numbers (no % sign). Source: KPI Snapshot board, refreshed nightly by n8n.", "Rate ditampilkan sebagai angka (tanpa %). Sumber: board KPI Snapshot, diperbarui tiap malam oleh n8n.")}</p>
      </Body>
    </>
  );
}

/* ================================================================ TEAM (Supervisor) */
export function Team() {
  const { tx, nav } = useApp();
  return (
    <>
      <AppBar title={tx("My team", "Tim saya")} sub="Plaza Indonesia · 3 Sales Agents" />
      <Body>
        <div className="grid grid-cols-2 gap-2">
          <Stat dark label={tx("Team sales", "Sales tim")} value={idrShort(KPI.supervisor.sales_idr)} sub="+2 pts vs LM" />
          <Stat label={tx("Push completion", "Penyelesaian push")} value={Math.round((TEAM.reduce((s, x) => s + x.push_executed, 0) / TEAM.reduce((s, x) => s + x.push_sent, 0)) * 100)} sub={tx("executed / sent", "selesai / terkirim")} />
        </div>
        <SectionTitle>{tx("Sales Agents", "Sales Agent")}</SectionTitle>
        <div className="flex flex-col gap-2">
          {TEAM.filter((s) => s.role === "sales_agent").map((s) => {
            const rate = Math.round((s.push_executed / s.push_sent) * 100);
            return (
              <Tile key={s.user_id} className="p-3">
                <div className="flex items-center gap-3">
                  <Initials name={s.full_name} size={38} />
                  <div className="flex-1">
                    <p className="text-[14px] font-semibold">{s.full_name}</p>
                    <p className="text-[11.5px] text-[var(--lc-muted)]">
                      {s.clients} {tx("clients", "klien")} · {s.actions} actions · conv. {s.conversion_rate}
                    </p>
                  </div>
                  <span className="text-[12px] font-semibold">{idrShort(s.sales_idr)}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <ProgressBar aria-label="push completion" value={rate} className="flex-1">
                    <ProgressBar.Track className="h-1.5 rounded-full bg-[#eceee5]">
                      <ProgressBar.Fill className={`rounded-full ${rate < 70 ? "bg-[#c2410c]" : "bg-[var(--lc-forest)]"}`} />
                    </ProgressBar.Track>
                  </ProgressBar>
                  <span className={`text-[11px] font-semibold ${rate < 70 ? "text-[#c2410c]" : "text-[var(--lc-forest)]"}`}>
                    {tx("push", "push")} {rate}
                  </span>
                </div>
              </Tile>
            );
          })}
        </div>
        <SectionTitle>{tx("Supervisor tools", "Alat supervisor")}</SectionTitle>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => nav("clients_unassigned")} className="rounded-2xl border border-[var(--lc-line)] bg-white p-3 text-left">
            <p className="font-display text-[24px] text-[#b4441c]">{CLIENTS.filter((c) => !c.assigned_user_id && c.boutique_id === 3).length}</p>
            <p className="text-[12px] font-semibold">{tx("Unassigned clients", "Klien tanpa assignee")}</p>
          </button>
          <button onClick={() => nav("lists")} className="rounded-2xl border border-[var(--lc-line)] bg-white p-3 text-left">
            <p className="font-display text-[24px]">1</p>
            <p className="text-[12px] font-semibold">{tx("Upcoming event", "Event mendatang")}</p>
          </button>
        </div>
      </Body>
    </>
  );
}

export function Unassigned() {
  const { tx, back, nav } = useApp();
  const list = CLIENTS.filter((c) => !c.assigned_user_id && c.boutique_id === 3);
  return (
    <>
      <AppBar title={tx("Unassigned clients", "Klien tanpa assignee")} sub={tx("Assign to a Sales Agent", "Assign ke Sales Agent")} onBack={back} />
      <Body>
        <div className="flex flex-col gap-2">
          {list.map((c) => (
            <Tile key={c.customer_id} onClick={() => nav("client", { customer_id: c.customer_id })} className="flex items-center gap-3 p-3">
              <Initials name={c.full_name} />
              <div className="flex-1">
                <p className="text-[14px] font-semibold">{c.full_name}</p>
                <p className="text-[11.5px] text-[var(--lc-muted)]">
                  {tx("First purchase", "Pembelian pertama")} {c.last_purchase_date}
                </p>
              </div>
              <TierBadge tier={c.current_tier_name} small />
            </Tile>
          ))}
        </div>
      </Body>
    </>
  );
}

/* ================================================================ ADMIN (Super Admin) */
export function Admin() {
  const { tx, nav } = useApp();
  return (
    <>
      <AppBar title="Admin" sub={tx("Configuration for all boutiques", "Konfigurasi untuk semua boutique")} />
      <Body>
        {[
          ["users", tx("Users & roles", "User & role"), tx("Super Admin · Supervisor · Sales Agent — from Cekat", "Super Admin · Supervisor · Sales Agent — dari Cekat")],
          ["templates", tx("WhatsApp templates", "Template WhatsApp"), `${TEMPLATES.length} ${tx("templates", "template")}`],
          ["push_rules", tx("Clienteling push rules", "Aturan clienteling push"), `${PUSH_RULES.filter((r) => r.is_active).length} ${tx("active", "aktif")}`],
        ].map(([id, t, s]) => (
          <Tile key={id} onClick={() => nav(id)} className="mb-2 flex items-center justify-between p-4">
            <div>
              <p className="text-[15px] font-semibold">{t}</p>
              <p className="text-[12px] text-[var(--lc-muted)]">{s}</p>
            </div>
            <span className="text-[var(--lc-muted)]">›</span>
          </Tile>
        ))}
      </Body>
    </>
  );
}

export function Users() {
  const { tx, back } = useApp();
  const rows = [
    { ...USERS.super_admin, role_label: "Super Admin", reports: "—", boutique: tx("All", "Semua") },
    { ...USERS.supervisor, role_label: "Supervisor", reports: "Dimas Hartono", boutique: "Plaza Indonesia" },
    ...TEAM.filter((t) => t.role === "sales_agent").map((t) => ({ full_name: t.full_name, role_label: "Sales Agent", reports: "Rina Wijaya", boutique: "Plaza Indonesia" })),
    { full_name: "Kevin Lim", role_label: "Sales Agent", reports: "Sinta Halim", boutique: "Grand Indonesia" },
  ];
  return (
    <>
      <AppBar title={tx("Users & roles", "User & role")} onBack={back} />
      <Body>
        <div className="rounded-2xl border border-dashed border-[var(--impl-product)] bg-[#fff8eb] p-3 text-[12px] leading-snug">
          {tx(
            "Users, roles and hierarchy live in Cekat CRM (Settings → CRM User Settings) and are served to the app by Cekat Product (CP-03). Invite new staff there; they activate in the app.",
            "User, role, dan hierarki ada di Cekat CRM (Settings → CRM User Settings) dan disajikan ke app oleh Cekat Product (CP-03). Undang staf baru di sana; mereka aktivasi di app."
          )}
        </div>
        <SectionTitle>{tx("Role hierarchy", "Hierarki role")}</SectionTitle>
        <Tile className="p-3 text-[12.5px]">
          <p className="font-semibold">Super Admin</p>
          <p className="ml-3 border-l-2 border-[var(--lc-line)] pl-3 font-semibold">Supervisor · {tx("per boutique", "per boutique")}</p>
          <p className="ml-9 border-l-2 border-[var(--lc-line)] pl-3">Sales Agent · {tx("peer sharing off", "peer sharing mati")}</p>
        </Tile>
        <SectionTitle>{tx("Users", "User")}</SectionTitle>
        <div className="flex flex-col gap-2">
          {rows.map((u) => (
            <Tile key={u.full_name} className="flex items-center gap-3 p-3">
              <Initials name={u.full_name} size={36} />
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-semibold">{u.full_name}</p>
                <p className="text-[11px] text-[var(--lc-muted)]">
                  {u.boutique} · {tx("reports to", "lapor ke")} {u.reports}
                </p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${u.role_label === "Super Admin" ? "bg-[var(--lc-forest)] text-[var(--lc-lime)]" : u.role_label === "Supervisor" ? "bg-[var(--lc-lime)] text-[var(--lc-forest)]" : "bg-[#eceee5] text-[var(--lc-ink)]"}`}>
                {u.role_label}
              </span>
            </Tile>
          ))}
        </div>
      </Body>
    </>
  );
}

export function LegacyTemplates() {
  const { tx, back } = useApp();
  return (
    <>
      <AppBar title="Template Library" onBack={back} />
      <Body>
        <div className="flex flex-col gap-2">
          {TEMPLATES.map((t) => (
            <Tile key={t.template_id} className="p-3">
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-semibold">{t.title}</p>
                <span className="rounded-full bg-[#eceee5] px-2 py-0.5 text-[10px]">{t.moment}</span>
              </div>
              <p className="mt-1 text-[12px] leading-snug text-[var(--lc-muted)]">{t.body}</p>
              <p className="mt-1.5 text-[10.5px] text-[var(--lc-forest)]">{t.wa_template_name ? `Meta template: ${t.wa_template_name}` : tx("Session message only (24h)", "Hanya pesan sesi (24 jam)")}</p>
            </Tile>
          ))}
        </div>
        <Button fullWidth className="mt-4 h-12 rounded-xl bg-[var(--lc-forest)] text-white">
          + {tx("New template", "Template baru")}
        </Button>
      </Body>
    </>
  );
}

export function PushRules() {
  const { tx, back, lang } = useApp();
  return (
    <>
      <AppBar title={tx("Push rules", "Aturan push")} sub={tx("Read by the n8n scheduler at 08:00 WIB", "Dibaca scheduler n8n jam 08:00 WIB")} onBack={back} />
      <Body>
        <div className="flex flex-col gap-2">
          {PUSH_RULES.map((r) => (
            <Tile key={r.rule_id} className="p-3">
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-semibold">{PUSH_LABEL[r.push_type][lang]}</p>
                <Switch defaultSelected={r.is_active} aria-label="active">
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                </Switch>
              </div>
              <p className="mt-1 text-[12px] text-[var(--lc-muted)]">
                {tx("Tiers", "Tier")}: {r.tiers} · {tx("lead", "lead")} {r.lead_days} {tx("days", "hari")} · {tx("requires WA consent", "wajib consent WA")}
              </p>
            </Tile>
          ))}
        </div>
      </Body>
    </>
  );
}
