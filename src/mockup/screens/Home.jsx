import { ProgressBar, Label } from "@heroui/react";
import { useApp, AppBar, Body, SectionTitle, Tile, TierBadge, Initials, Stat, Icon } from "../core";
import { AGENDA, CLIENTS, PUSHES, PUSH_LABEL, KPI, TEAM, BY_BOUTIQUE, BOUTIQUES, idrShort } from "../data";

function Greeting() {
  const { session, tx, nav } = useApp();
  const b = BOUTIQUES.find((x) => x.boutique_id === session.user.boutique_id);
  return (
    <AppBar
      title={`${tx("Hello", "Halo")}, ${session.user.full_name.split(" ")[0]}`}
      sub={`${{ sales_agent: "Sales Agent", supervisor: "Supervisor", super_admin: "Super Admin" }[session.role]} · ${b ? b.boutique_name : tx("All boutiques", "Semua boutique")}`}
      right={
        <button onClick={() => nav("profile")} aria-label="Profile">
          <Initials name={session.user.full_name} size={38} dark />
        </button>
      }
    />
  );
}

function ModuleGrid() {
  const { tx, reset, nav, session } = useApp();
  const tiles = [
    { label: tx("Customer Search", "Cari Pelanggan"), icon: "clients", go: () => reset("clients") },
    { label: tx("Customer Lists", "Daftar Pelanggan"), icon: "team", go: () => nav("lists") },
    { label: tx("Actions", "Aksi"), icon: "actions", go: () => reset("actions") },
    { label: tx("Product Catalog", "Katalog Produk"), icon: "catalog", go: () => reset("catalog") },
  ];
  if (session.role === "super_admin") return null;
  return (
    <div className="grid grid-cols-2 gap-2">
      {tiles.map((t) => (
        <button key={t.label} onClick={t.go} className="flex h-[84px] flex-col justify-between rounded-2xl bg-[var(--lc-forest)] p-3 text-left text-white">
          <span className="text-[var(--lc-lime)]">
            <Icon name={t.icon} size={20} />
          </span>
          <span className="text-[13px] font-semibold tracking-wide">{t.label}</span>
        </button>
      ))}
    </div>
  );
}

export function PushRow({ p }) {
  const { tx, lang, nav } = useApp();
  const c = CLIENTS.find((x) => x.customer_id === p.customer_id);
  const meta = PUSH_LABEL[p.push_type];
  return (
    <Tile onClick={() => nav("client", { customer_id: c.customer_id, push_id: p.push_id })} className="flex items-center gap-3 p-3">
      <span className="h-10 w-1.5 shrink-0 rounded-full" style={{ background: meta.color }} />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: meta.color === "#8dc63f" ? "#4d7a16" : meta.color }}>
          {meta[lang]}
        </p>
        <p className="truncate text-[14px] font-semibold">{c.full_name}</p>
        <p className="text-[11.5px] text-[var(--lc-muted)]">
          {p.detail} · {tx("due", "jatuh tempo")} {p.due_date.slice(5).split("-").reverse().join("/")}
        </p>
      </div>
      <TierBadge tier={c.current_tier_name} small />
    </Tile>
  );
}

export default function Home() {
  const { session, tx, reset, nav } = useApp();
  const role = session.role;
  const myPushes = PUSHES.filter((p) => p.status === "sent" && (role === "sales_agent" ? p.assigned_user_id === 87 : true));
  const k = KPI[role];

  if (role === "super_admin") {
    return (
      <>
        <Greeting />
        <Body>
          <div className="grid grid-cols-2 gap-2">
            <Stat dark label={tx("Sales (Oct)", "Sales (Okt)")} value={idrShort(k.sales_idr)} sub={`${k.vs_last_month_pts} pts vs LM`} />
            <Stat label={tx("Conv. rate", "Conv. rate")} value={k.conversion_rate} sub={tx("country", "negara")} />
            <Stat label={tx("Actions", "Actions")} value={k.actions} sub={`${k.actions_per_pos_day} / POS / ${tx("day", "hari")}`} />
            <Stat label={tx("Avg conv. days", "Rata-rata hari konv.")} value={k.avg_conversion_days} />
          </div>
          <SectionTitle action={<button className="text-[12px] font-semibold text-[var(--lc-forest)]" onClick={() => reset("performance")}>{tx("Details", "Detail")}</button>}>
            {tx("Boutiques", "Boutique")}
          </SectionTitle>
          <div className="flex flex-col gap-2">
            {BY_BOUTIQUE.map((b) => (
              <Tile key={b.boutique_name} className="p-3">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-semibold">{b.boutique_name}</span>
                  <span className="text-[var(--lc-muted)]">{idrShort(b.sales_idr)}</span>
                </div>
                <ProgressBar aria-label={b.boutique_name} value={b.conversion_rate} maxValue={12} className="mt-2">
                  <ProgressBar.Track className="h-1.5 rounded-full bg-[#eceee5]">
                    <ProgressBar.Fill className="rounded-full bg-[var(--lc-forest)]" />
                  </ProgressBar.Track>
                </ProgressBar>
                <p className="mt-1 text-[11px] text-[var(--lc-muted)]">
                  {b.actions} actions · conv. {b.conversion_rate}
                </p>
              </Tile>
            ))}
          </div>
          <SectionTitle>{tx("Admin shortcuts", "Pintasan admin")}</SectionTitle>
          <div className="grid grid-cols-2 gap-2">
            {[
              [tx("Templates", "Template"), "templates"],
              [tx("Push rules", "Aturan push"), "push_rules"],
              [tx("Users & roles", "User & role"), "users"],
              [tx("All clients", "Semua klien"), null],
            ].map(([l, id]) => (
              <button key={l} onClick={() => (id ? nav(id) : reset("clients"))} className="rounded-2xl border border-[var(--lc-line)] bg-white p-3 text-left text-[13px] font-semibold">
                {l}
              </button>
            ))}
          </div>
        </Body>
      </>
    );
  }

  return (
    <>
      <Greeting />
      <Body>
        <div className="rounded-[22px] bg-[var(--lc-forest)] p-4 text-white">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">{tx("Today", "Hari ini")} · Mon 16 Nov</p>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <p className="font-display text-[40px] leading-none">{myPushes.length}</p>
              <p className="text-[12px] text-white/70">{tx("clienteling pushes to do", "clienteling push untuk dikerjakan")}</p>
            </div>
            <div className="text-right">
              <p className="font-display text-[40px] leading-none text-[var(--lc-lime)]">{AGENDA.filter((a) => a.status === "open").length}</p>
              <p className="text-[12px] text-white/70">{tx("agenda items", "item agenda")}</p>
            </div>
          </div>
          {role === "supervisor" && (
            <div className="mt-3 rounded-xl bg-white/10 p-2.5 text-[12px]">
              {tx("Team push completion", "Penyelesaian push tim")}: <b className="text-[var(--lc-lime)]">{Math.round((TEAM.reduce((s, x) => s + x.push_executed, 0) / TEAM.reduce((s, x) => s + x.push_sent, 0)) * 100)}</b>
              <span className="text-white/60"> · {tx("1 SA below 70", "1 SA di bawah 70")}</span>
            </div>
          )}
        </div>

        <SectionTitle>{tx("Clienteling", "Clienteling")}</SectionTitle>
        <ModuleGrid />

        <SectionTitle action={<button className="text-[12px] font-semibold text-[var(--lc-forest)]" onClick={() => reset("actions")}>{tx("See all", "Lihat semua")}</button>}>
          {tx("Pushes", "Push")}
        </SectionTitle>
        <div className="flex flex-col gap-2">
          {myPushes.slice(0, 3).map((p) => (
            <PushRow key={p.push_id} p={p} />
          ))}
        </div>

        <SectionTitle>{tx("Agenda", "Agenda")}</SectionTitle>
        <div className="flex flex-col gap-2">
          {AGENDA.filter((a) => a.status === "open").map((a) => (
            <Tile key={a.agenda_item_id} className="flex items-center gap-3 p-3">
              <span className="w-14 shrink-0 text-[12px] font-semibold text-[var(--lc-forest)]">{a.time.split(" ")[0]}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-medium">{a.title}</p>
                <p className="text-[11px] text-[var(--lc-muted)]">
                  {a.item_type === "task" ? tx("Task", "Task") : tx("Appointment", "Appointment")} · {a.source === "push" ? "push" : tx("manual", "manual")}
                </p>
              </div>
            </Tile>
          ))}
        </div>
        <div className="mt-4">
          <button onClick={() => nav("client_new")} className="w-full rounded-2xl border border-dashed border-[var(--lc-forest)] py-3 text-[13px] font-semibold text-[var(--lc-forest)]">
            + {tx("Register new client", "Daftarkan klien baru")}
          </button>
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
      <Body>
        <Tile className="flex items-center gap-3 p-4">
          <Initials name={session.user.full_name} size={52} dark />
          <div>
            <p className="text-[16px] font-semibold">{session.user.full_name}</p>
            <p className="text-[12px] text-[var(--lc-muted)]">{session.user.email}</p>
          </div>
        </Tile>
        <SectionTitle>{tx("Access (from Cekat CRM)", "Akses (dari Cekat CRM)")}</SectionTitle>
        <Tile className="divide-y divide-[var(--lc-line)]">
          {[
            [tx("Role", "Role"), { sales_agent: "Sales Agent", supervisor: "Supervisor", super_admin: "Super Admin" }[session.role]],
            [tx("Boutique", "Boutique"), b ? b.boutique_name : tx("All", "Semua")],
            [tx("Data scope", "Scope data"), { sales_agent: tx("Own + unassigned clients", "Klien sendiri + tanpa assignee"), supervisor: tx("All clients of my team", "Semua klien tim saya"), super_admin: tx("All boutiques", "Semua boutique") }[session.role]],
            [tx("Managed by", "Dikelola oleh"), "Cekat Product · CP-01/02/03"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 px-4 py-3 text-[13px]">
              <span className="text-[var(--lc-muted)]">{k}</span>
              <span className="text-right font-medium">{v}</span>
            </div>
          ))}
        </Tile>
        <SectionTitle>{tx("Preferences", "Preferensi")}</SectionTitle>
        <Tile className="divide-y divide-[var(--lc-line)]">
          {[
            [tx("Push notifications", "Push notifikasi"), tx("On", "Aktif")],
            [tx("Language", "Bahasa"), lang === "id" ? "Bahasa Indonesia" : "English"],
            [tx("App version", "Versi app"), "1.0.3"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between px-4 py-3 text-[13px]">
              <span className="text-[var(--lc-muted)]">{k}</span>
              <span className="font-medium">{v}</span>
            </div>
          ))}
        </Tile>
        <button
          className="mt-6 w-full rounded-2xl border border-[#e2b4a6] py-3 text-[13px] font-semibold text-[#b4441c]"
          onClick={() => {
            setSession(null);
            reset("login");
          }}
        >
          {tx("Sign out", "Keluar")}
        </button>
      </Body>
    </>
  );
}

export { Label };
