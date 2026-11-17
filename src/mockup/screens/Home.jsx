import { ProgressBar } from "@heroui/react";
import { useConfig, liveContent } from "../config";
import { useApp, AppBar, Body, SectionTitle, Tile, TierBadge, Initials, Stat, Icon, BlackTile, Hero, Announcement, LcButton, Row } from "../core";
import { AGENDA, CLIENTS, PUSHES, PUSH_LABEL, KPI, TEAM, BY_BOUTIQUE, BOUTIQUES, idrShort } from "../data";

const ROLE_NAME = { sales_agent: "Sales Agent", supervisor: "Supervisor", super_admin: "Super Admin" };

function SearchProduct() {
  const { tx, nav } = useApp();
  const scan = useConfig().settings.feature_scan;
  return (
    <div className="mx-4 mt-3 flex items-center gap-3">
      <button onClick={() => nav("catalog")} className="flex flex-1 items-center gap-2 border-b-2 border-[var(--lc-lime)] pb-1.5 text-left">
        <Icon name="search" size={17} />
        <span className="text-[12.5px] text-[#8a8a8a]">{tx("Search a product", "Cari produk")}</span>
      </button>
      {scan && (
        <button aria-label={tx("Scan barcode", "Pindai barcode")} onClick={() => nav("scan")} className="text-black">
          <Icon name="barcode" size={22} stroke={1.3} />
        </button>
      )}
    </div>
  );
}

export function PushRow({ p }) {
  const { tx, lang, nav } = useApp();
  const c = CLIENTS.find((x) => x.customer_id === p.customer_id);
  const meta = PUSH_LABEL[p.push_type];
  return (
    <button onClick={() => nav("client", { customer_id: c.customer_id, push_id: p.push_id })} className="block w-full border-b border-[var(--lc-line)] py-2.5 text-left">
      <span className="caps inline-block px-2 py-[3px] text-[8.5px] font-bold" style={{ background: meta.color, color: meta.fg }}>
        {meta[lang]}
      </span>
      <span className="mt-1.5 flex items-center justify-between">
        <span className="text-[14px] font-semibold uppercase tracking-[0.04em]">{c.full_name}</span>
        <TierBadge tier={c.current_tier_name} small />
      </span>
      <span className="block text-[11.5px] text-[var(--lc-muted)]">
        {p.detail} · {tx("before", "sebelum")} {p.due_date.slice(5).split("-").reverse().join("/")}
      </span>
    </button>
  );
}

function Hello() {
  const { session, tx } = useApp();
  const b = BOUTIQUES.find((x) => x.boutique_id === session.user.boutique_id);
  return (
    <div className="flex items-baseline justify-between px-4 pt-4">
      <p className="text-[13px]">
        {tx("Hello", "Halo")} <b className="uppercase tracking-[0.06em]">{session.user.full_name.split(" ")[0]}</b>
      </p>
      <p className="text-[11px] text-[var(--lc-muted)]">
        {ROLE_NAME[session.role]}
        {b ? `, ${b.boutique_name}` : ""}
      </p>
    </div>
  );
}

export default function Home() {
  const { session, tx, reset, nav, lang } = useApp();
  const role = session.role;
  const k = KPI[role];
  const myPushes = PUSHES.filter((p) => p.status === "sent" && (role === "sales_agent" ? p.assigned_user_id === 87 : true));
  const open = AGENDA.filter((a) => a.status === "open");
  const { content } = useConfig();
  const bq = (BOUTIQUES.find((b) => b.boutique_id === session.user.boutique_id) || {}).boutique_name;
  const L = (c, k) => (lang === "en" ? c[`${k}_en`] : c[`${k}_id`]) || c[`${k}_id`];
  const cmsAnn = liveContent(content, "announcement", role, bq);
  const cmsHero = liveContent(content, "hero", role, bq);
  const cmsBanner = liveContent(content, "banner", role, bq);
  const CTA = { catalog: tx("Open catalog", "Buka katalog"), actions: tx("Open actions", "Buka aksi"), lists: tx("Open lists", "Buka daftar") };

  if (role === "super_admin") {
    return (
      <>
        <AppBar />
        <Body pad={false}>
          <Announcement>{tx("Country view: 5 boutiques, IDR", "Tampilan negara: 5 boutique, Rupiah")}</Announcement>
          <Hero title={tx("Longchamp Indonesia", "Longchamp Indonesia")} subtitle={tx("Clienteling overview", "Ringkasan clienteling")} cta={tx("See country KPI", "Lihat KPI negara")} onCta={() => reset("performance")} />
          <Hello />
          <div className="mt-3 grid grid-cols-2 gap-3 px-4">
            <BlackTile label={tx("All customers", "Semua pelanggan")} onClick={() => reset("clients")} />
            <BlackTile label={tx("Country KPI", "KPI negara")} sub={`conv. ${k.conversion_rate}`} onClick={() => reset("performance")} />
            <BlackTile label={tx("WhatsApp templates", "Template WhatsApp")} onClick={() => nav("templates")} />
            <BlackTile label={tx("Push rules", "Aturan push")} onClick={() => nav("push_rules")} />
          </div>
          <div className="px-4">
            <SectionTitle action={<button className="text-[11px] underline" onClick={() => reset("performance")}>{tx("Details", "Detail")}</button>}>
              {tx("Boutiques this month", "Boutique bulan ini")}
            </SectionTitle>
            {BY_BOUTIQUE.map((b) => (
              <div key={b.boutique_name} className="border-b border-[var(--lc-line)] py-2.5">
                <div className="flex justify-between text-[12.5px]">
                  <span className="font-semibold">{b.boutique_name}</span>
                  <span>{idrShort(b.sales_idr)}</span>
                </div>
                <ProgressBar aria-label={b.boutique_name} value={b.conversion_rate} maxValue={12} className="mt-1.5">
                  <ProgressBar.Track className="h-1 bg-[#ececec]">
                    <ProgressBar.Fill className="bg-black" />
                  </ProgressBar.Track>
                </ProgressBar>
                <p className="mt-1 text-[11px] text-[var(--lc-muted)]">
                  {b.actions} actions, conv. {b.conversion_rate}
                </p>
              </div>
            ))}
            <Row label={tx("CMS & configuration", "CMS & pengaturan")} value={tx(`${content.filter((c) => c.status !== "draft").length} content`, `${content.filter((c) => c.status !== "draft").length} konten`)} onClick={() => nav("settings")} />
            <Row label={tx("Users & roles", "User & role")} value={tx("from Cekat", "dari Cekat")} onClick={() => nav("users")} />
          </div>
        </Body>
      </>
    );
  }

  return (
    <>
      <AppBar />
      <Body pad={false}>
        {cmsAnn ? (
          <Announcement>{L(cmsAnn, "title")}</Announcement>
        ) : (
          <Announcement onClick={() => reset("actions")}>
            {tx(`${myPushes.length} clienteling pushes waiting for you`, `${myPushes.length} clienteling push menunggu Anda`)}
          </Announcement>
        )}
        {cmsHero ? (
          <Hero title={L(cmsHero, "title")} subtitle={L(cmsHero, "subtitle")} cta={cmsHero.cta ? CTA[cmsHero.cta] : null} onCta={() => reset(cmsHero.cta)} />
        ) : (
          <Hero
            title={tx("Be creative", "Jadilah kreatif")}
            subtitle={tx("Le Pliage, new season", "Le Pliage, musim baru")}
            cta={tx("Share with clients", "Bagikan ke klien")}
            onCta={() => reset("catalog")}
          />
        )}
        {cmsBanner && <div className="mx-4 mt-3 bg-black px-4 py-3 text-center text-[12px] uppercase tracking-[0.08em] text-white">{L(cmsBanner, "title")}</div>}
        <SearchProduct />
        <div className="mt-4 grid grid-cols-2 gap-3 px-4">
          <BlackTile label={tx("Customer search", "Cari pelanggan")} onClick={() => reset("clients")} />
          <BlackTile label={tx("Customer lists", "Daftar pelanggan")} onClick={() => reset("lists")} />
          <BlackTile label={tx("Actions", "Aksi")} sub={`${myPushes.length} push · ${open.length} agenda`} onClick={() => reset("actions")} />
          <BlackTile label={tx("Product catalog", "Katalog produk")} onClick={() => reset("catalog")} />
        </div>
        {role === "supervisor" && (
          <div className="mt-3 grid grid-cols-1 gap-3 px-4">
            <button onClick={() => reset("templates")} className="flex w-full items-center justify-between border-[1.25px] border-black px-4 py-3">
              <span className="text-[12.5px] uppercase tracking-[0.08em]">{tx("WhatsApp templates", "Template WhatsApp")}</span>
              <span className="text-[11.5px]">{tx("1 pending, 1 rejected", "1 pending, 1 ditolak")}</span>
            </button>
          </div>
        )}
        {role === "supervisor" && (
          <div className="mt-3 px-4">
            <button onClick={() => reset("team")} className="flex w-full items-center justify-between border-[1.25px] border-black px-4 py-3">
              <span className="text-[12.5px] uppercase tracking-[0.08em]">{tx("My team", "Tim saya")}</span>
              <span className="text-[11.5px]">
                {tx("push completion", "penyelesaian push")}{" "}
                <b>{Math.round((TEAM.reduce((s, x) => s + x.push_executed, 0) / TEAM.reduce((s, x) => s + x.push_sent, 0)) * 100)}</b>
              </span>
            </button>
          </div>
        )}
        <Hello />
        <div className="px-4">
          <SectionTitle action={<button className="text-[11px] underline" onClick={() => reset("actions")}>{tx("All", "Semua")}</button>}>
            {tx("Clienteling pushes", "Clienteling push")}
          </SectionTitle>
          {myPushes.slice(0, 3).map((p) => (
            <PushRow key={p.push_id} p={p} />
          ))}
          <SectionTitle>{tx("Agenda today", "Agenda hari ini")}</SectionTitle>
          {open.map((a) => (
            <div key={a.agenda_item_id} className="flex gap-3 border-b border-[var(--lc-line)] py-2.5">
              <span className="w-12 shrink-0 text-[12px] font-bold">{a.time.split(" ")[0]}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px]">{a.title}</span>
                <span className="block text-[11px] text-[var(--lc-muted)]">{a.item_type === "task" ? "Task" : "Appointment"}</span>
              </span>
            </div>
          ))}
          <LcButton className="mt-4" onClick={() => nav("client_new")}>
            {tx("Register a new client", "Daftarkan klien baru")}
          </LcButton>
        </div>
      </Body>
    </>
  );
}

export function Profile() {
  const { session, tx, back, setSession, reset, lang } = useApp();
  const b = BOUTIQUES.find((x) => x.boutique_id === session.user.boutique_id);
  return (
    <>
      <AppBar title={tx("My account", "Akun saya")} onBack={back} />
      <Body pad={false}>
        <div className="flex items-center gap-3 bg-black px-4 py-4 text-white">
          <Initials name={session.user.full_name} size={46} />
          <div>
            <p className="text-[16px] font-semibold uppercase tracking-[0.05em]">{session.user.full_name}</p>
            <p className="text-[12px] text-white/60">{session.user.email}</p>
          </div>
        </div>
        <div className="px-4">
          <SectionTitle>{tx("Access from Cekat CRM", "Akses dari Cekat CRM")}</SectionTitle>
          <Row label={tx("Role", "Role")} value={ROLE_NAME[session.role]} />
          <Row label={tx("Boutique", "Boutique")} value={b ? b.boutique_name : tx("All", "Semua")} />
          <Row
            label={tx("Data scope", "Scope data")}
            value={{ sales_agent: tx("Own + unassigned", "Sendiri + tanpa assignee"), supervisor: tx("My team", "Tim saya"), super_admin: tx("All boutiques", "Semua boutique") }[session.role]}
          />
          <SectionTitle>{tx("Preferences", "Preferensi")}</SectionTitle>
          <Row label={tx("Push notifications", "Push notifikasi")} value={tx("On", "Aktif")} />
          <Row label={tx("Language", "Bahasa")} value={lang === "id" ? "Bahasa Indonesia" : "English"} />
          <Row label={tx("App version", "Versi app")} value="1.0.3" />
          <button
            className="mt-6 w-full border border-black py-3 text-[11px] font-semibold uppercase tracking-[0.14em]"
            onClick={() => {
              setSession(null);
              reset("login");
            }}
          >
            {tx("Sign out", "Keluar")}
          </button>
          <p className="mt-3 text-center text-[11px] text-[var(--lc-muted)]">{tx("Role and access are managed in Cekat CRM.", "Role dan akses dikelola di Cekat CRM.")}</p>
        </div>
      </Body>
    </>
  );
}

export { Stat, Tile };
