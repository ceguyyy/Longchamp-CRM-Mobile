import { createContext, useContext, useState, useCallback } from "react";
import { Avatar } from "@heroui/react";
import { TIER_STYLE, USERS } from "./data";

/* ------------------------------------------------------------------ context */
export const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function useAppState({ role, initial, lang, signedIn }) {
  const [stack, setStack] = useState([initial]);
  const [session, setSession] = useState(signedIn ? { role, user: USERS[role] } : null);
  const [toast, setToast] = useState(null);
  const [sheet, setSheet] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [overrides, setOverrides] = useState({}); // per-client field overrides (assignee, tags…)

  const nav = useCallback((id, params = {}) => setStack((s) => [...s, { id, params }]), []);
  const back = useCallback(() => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)), []);
  const reset = useCallback((id, params = {}) => setStack([{ id, params }]), []);
  const notify = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }, []);
  const tx = useCallback((en, id) => (lang === "id" && id ? id : en), [lang]);

  return {
    lang, tx, stack, current: stack[stack.length - 1], nav, back, reset,
    session, setSession, toast, notify, sheet, setSheet, wishlist, setWishlist, overrides, setOverrides,
  };
}

/* ------------------------------------------------------------------ phone frame */
export function Phone({ children, scale = 1, darkStatus = false }) {
  return (
    <div style={{ width: 390 * scale, height: 844 * scale }} className="shrink-0">
      <div
        style={{ width: 390, height: 844, transform: `scale(${scale})`, transformOrigin: "top left" }}
        className="relative overflow-hidden rounded-[52px] border-[10px] border-[#151a10] bg-[var(--lc-cream)] shadow-[0_30px_60px_-20px_rgba(20,30,10,.45)]"
      >
        {/* status bar */}
        <div className={`absolute inset-x-0 top-0 z-40 flex h-11 items-center justify-between px-7 text-[13px] font-semibold ${darkStatus ? "text-white" : "text-[var(--lc-ink)]"}`}>
          <span>9:41</span>
          <span className="absolute left-1/2 top-2 h-7 w-28 -translate-x-1/2 rounded-full bg-[#151a10]" />
          <span className="flex items-center gap-1">
            <svg width="17" height="11" viewBox="0 0 17 11"><rect x="0" y="7" width="3" height="4" rx="1" fill="currentColor" /><rect x="4.5" y="5" width="3" height="6" rx="1" fill="currentColor" /><rect x="9" y="2.5" width="3" height="8.5" rx="1" fill="currentColor" /><rect x="13.5" y="0" width="3" height="11" rx="1" fill="currentColor" /></svg>
            <svg width="25" height="12" viewBox="0 0 25 12"><rect x="0.5" y="0.5" width="21" height="11" rx="3" fill="none" stroke="currentColor" opacity=".4" /><rect x="2" y="2" width="16" height="8" rx="2" fill="currentColor" /><rect x="22.5" y="4" width="2" height="4" rx="1" fill="currentColor" opacity=".4" /></svg>
          </span>
        </div>
        {children}
        {/* home indicator */}
        <div className="absolute bottom-2 left-1/2 z-50 h-1.5 w-32 -translate-x-1/2 rounded-full bg-[#151a10]/80" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ primitives */
export function AppBar({ title, sub, onBack, right, dark }) {
  return (
    <div className={`flex items-center gap-2 px-4 pb-3 pt-12 ${dark ? "bg-[var(--lc-forest)] text-white" : "bg-[var(--lc-cream)]"}`}>
      {onBack && (
        <button onClick={onBack} aria-label="Back" className={`-ml-1 grid h-9 w-9 place-items-center rounded-full ${dark ? "hover:bg-white/10" : "hover:bg-black/5"}`}>
          <svg width="10" height="16" viewBox="0 0 10 16"><path d="M8 1 L2 8 L8 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
      )}
      <div className="min-w-0 flex-1">
        <p className="font-display truncate text-[22px] font-semibold leading-tight">{title}</p>
        {sub && <p className={`truncate text-[12px] ${dark ? "text-white/60" : "text-[var(--lc-muted)]"}`}>{sub}</p>}
      </div>
      {right}
    </div>
  );
}

export function Body({ children, className = "", pad = true }) {
  return <div className={`absolute inset-x-0 bottom-[84px] top-[104px] overflow-y-auto ${pad ? "px-4 pb-6" : ""} ${className}`}>{children}</div>;
}

export function FullBody({ children, className = "" }) {
  return <div className={`absolute inset-0 overflow-y-auto ${className}`}>{children}</div>;
}

export function SectionTitle({ children, action }) {
  return (
    <div className="mb-2 mt-5 flex items-end justify-between">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--lc-muted)]">{children}</p>
      {action}
    </div>
  );
}

export function Tile({ children, className = "", onClick }) {
  const C = onClick ? "button" : "div";
  return (
    <C onClick={onClick} className={`block w-full rounded-2xl border border-[var(--lc-line)] bg-white text-left ${onClick ? "active:scale-[.99]" : ""} ${className}`}>
      {children}
    </C>
  );
}

export function TierBadge({ tier, small }) {
  const s = TIER_STYLE[tier] || TIER_STYLE.LIKER;
  return (
    <span className={`inline-flex items-center rounded-full font-semibold tracking-[0.12em] ${small ? "px-1.5 py-[1px] text-[8.5px]" : "px-2 py-0.5 text-[10px]"}`} style={{ background: s.bg, color: s.fg }}>
      {tier}
    </span>
  );
}

export function Initials({ name, size = 40, dark }) {
  const ini = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <Avatar className="shrink-0" style={{ width: size, height: size }}>
      <Avatar.Fallback className={`text-[13px] font-semibold ${dark ? "bg-[var(--lc-forest)] text-[var(--lc-lime)]" : "bg-[#e9ecdf] text-[var(--lc-forest)]"}`}>{ini}</Avatar.Fallback>
    </Avatar>
  );
}

export function BagArt({ color = "#1f3557", size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden>
      <rect width="120" height="120" rx="18" fill="#f2efe7" />
      <path d="M38 46 C38 28, 82 28, 82 46" fill="none" stroke="#3a2a1a" strokeWidth="4" strokeLinecap="round" />
      <path d="M26 46 H94 L88 96 Q87 102 80 102 H40 Q33 102 32 96 Z" fill={color} />
      <path d="M26 46 H94 L92 58 H28 Z" fill="#000" opacity=".12" />
      <rect x="52" y="54" width="16" height="10" rx="3" fill="#c9a96b" />
    </svg>
  );
}

export function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return (
    <div className="absolute inset-x-4 bottom-[96px] z-50 rounded-2xl bg-[var(--lc-forest)] px-4 py-3 text-[13px] text-white shadow-lg">
      {toast}
    </div>
  );
}

export function Sheet() {
  const { sheet, setSheet } = useApp();
  if (!sheet) return null;
  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end bg-black/35" onClick={() => setSheet(null)}>
      <div className="max-h-[80%] overflow-y-auto rounded-t-[28px] bg-white px-5 pb-10 pt-3" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-black/15" />
        {sheet}
      </div>
    </div>
  );
}

export function Stat({ label, value, sub, dark }) {
  return (
    <div className={`rounded-2xl p-3 ${dark ? "bg-[var(--lc-forest)] text-white" : "border border-[var(--lc-line)] bg-white"}`}>
      <p className={`text-[10.5px] uppercase tracking-wider ${dark ? "text-white/60" : "text-[var(--lc-muted)]"}`}>{label}</p>
      <p className="font-display mt-0.5 text-[26px] leading-none">{value}</p>
      {sub && <p className={`mt-1 text-[11px] ${dark ? "text-[var(--lc-lime)]" : "text-[var(--lc-muted)]"}`}>{sub}</p>}
    </div>
  );
}

export function Pill({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-medium ${active ? "bg-[var(--lc-forest)] text-white" : "border border-[var(--lc-line)] bg-white text-[var(--lc-ink)]"}`}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ icons */
const P = {
  home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  clients: "M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0zM4 21c0-4 3.6-6 8-6s8 2 8 6",
  actions: "M4 6h16M4 12h10M4 18h7M18 15l3 3-3 3",
  catalog: "M6 8h12l-1 12H7zM9 8a3 3 0 0 1 6 0",
  me: "M4 19V9M10 19V5M16 19v-7M22 19H2",
  team: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM17 11a2.5 2.5 0 1 0 0-5M2 20c0-3.5 3-5 7-5s7 1.5 7 5M17 15c3 0 5 1.3 5 4.5",
  admin: "M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6zM9 12l2 2 4-4",
};
export function Icon({ name, size = 22, stroke = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={P[name]} />
    </svg>
  );
}

/* ------------------------------------------------------------------ tab bar per role */
export const TABS = {
  sales_agent: [
    { id: "home", icon: "home", en: "Home", idl: "Beranda" },
    { id: "clients", icon: "clients", en: "Clients", idl: "Klien" },
    { id: "actions", icon: "actions", en: "Actions", idl: "Aksi" },
    { id: "catalog", icon: "catalog", en: "Catalog", idl: "Katalog" },
    { id: "performance", icon: "me", en: "Results", idl: "Hasil" },
  ],
  supervisor: [
    { id: "home", icon: "home", en: "Home", idl: "Beranda" },
    { id: "clients", icon: "clients", en: "Clients", idl: "Klien" },
    { id: "actions", icon: "actions", en: "Actions", idl: "Aksi" },
    { id: "team", icon: "team", en: "Team", idl: "Tim" },
    { id: "catalog", icon: "catalog", en: "Catalog", idl: "Katalog" },
  ],
  super_admin: [
    { id: "home", icon: "home", en: "Overview", idl: "Ringkasan" },
    { id: "clients", icon: "clients", en: "Clients", idl: "Klien" },
    { id: "performance", icon: "me", en: "KPI", idl: "KPI" },
    { id: "admin", icon: "admin", en: "Admin", idl: "Admin" },
  ],
};

export function TabBar() {
  const { session, stack, reset, tx } = useApp();
  if (!session) return null;
  const root = stack[0].id;
  return (
    <div className="absolute inset-x-0 bottom-0 z-30 flex h-[84px] items-start justify-around border-t border-[var(--lc-line)] bg-white/95 px-2 pt-2 backdrop-blur">
      {TABS[session.role].map((t) => {
        const on = root === t.id;
        return (
          <button key={t.id} onClick={() => reset(t.id)} className={`flex w-16 flex-col items-center gap-0.5 ${on ? "text-[var(--lc-forest)]" : "text-[#9aa08c]"}`}>
            <span className={`grid h-8 w-12 place-items-center rounded-full ${on ? "bg-[var(--lc-lime-soft)]" : ""}`}>
              <Icon name={t.icon} />
            </span>
            <span className={`text-[10.5px] ${on ? "font-semibold" : ""}`}>{tx(t.en, t.idl)}</span>
          </button>
        );
      })}
    </div>
  );
}
