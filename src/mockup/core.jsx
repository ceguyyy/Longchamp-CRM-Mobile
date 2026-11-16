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
  const [menu, setMenu] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [overrides, setOverrides] = useState({});

  const nav = useCallback((id, params = {}) => {
    setMenu(false);
    setStack((s) => [...s, { id, params }]);
  }, []);
  const back = useCallback(() => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)), []);
  const reset = useCallback((id, params = {}) => {
    setMenu(false);
    setStack([{ id, params }]);
  }, []);
  const notify = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }, []);
  const tx = useCallback((en, id) => (lang === "id" && id ? id : en), [lang]);

  return {
    lang, tx, stack, current: stack[stack.length - 1], nav, back, reset,
    session, setSession, toast, notify, sheet, setSheet, menu, setMenu, wishlist, setWishlist, overrides, setOverrides,
  };
}

/* ------------------------------------------------------------------ phone frame (iPhone-style, as in the deck) */
export function Phone({ children, scale = 1, darkStatus = false }) {
  return (
    <div style={{ width: 390 * scale, height: 844 * scale }} className="shrink-0">
      <div
        style={{ width: 390, height: 844, transform: `scale(${scale})`, transformOrigin: "top left" }}
        className="relative overflow-hidden rounded-[54px] border-[11px] border-[#1b1b1b] bg-white shadow-[0_0_0_2px_#9a9a9a,0_28px_50px_-18px_rgba(0,0,0,.45)]"
      >
        <div className={`absolute inset-x-0 top-0 z-[60] flex h-11 items-center justify-between px-7 text-[13px] font-semibold ${darkStatus ? "text-white" : "text-black"}`}>
          <span>11:41</span>
          <span className="absolute left-1/2 top-2 h-7 w-28 -translate-x-1/2 rounded-full bg-[#1b1b1b]" />
          <span className="flex items-center gap-1">
            <svg width="17" height="11" viewBox="0 0 17 11"><rect x="0" y="7" width="3" height="4" rx="1" fill="currentColor" /><rect x="4.5" y="5" width="3" height="6" rx="1" fill="currentColor" /><rect x="9" y="2.5" width="3" height="8.5" rx="1" fill="currentColor" /><rect x="13.5" y="0" width="3" height="11" rx="1" fill="currentColor" /></svg>
            <svg width="25" height="12" viewBox="0 0 25 12"><rect x="0.5" y="0.5" width="21" height="11" rx="3" fill="none" stroke="currentColor" opacity=".4" /><rect x="2" y="2" width="16" height="8" rx="2" fill="#4cd964" /><rect x="22.5" y="4" width="2" height="4" rx="1" fill="currentColor" opacity=".4" /></svg>
          </span>
        </div>
        {children}
        <div className="absolute bottom-2 left-1/2 z-[60] h-1.5 w-32 -translate-x-1/2 rounded-full bg-black/85" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ icons (thin line, like the Belong app) */
const P = {
  menu: "M3 6h18M3 12h18M3 18h18",
  back: "M15 4 7 12l8 8",
  user: "M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zM3.5 21c0-4.2 3.8-7 8.5-7s8.5 2.8 8.5 7",
  bag: "M5 8h14l-1.2 13H6.2zM9 8V6.5a3 3 0 0 1 6 0V8",
  search: "M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15zM16 16l5 5",
  call: "M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z",
  mail: "M3 5h18v14H3zM3 6l9 7 9-7",
  sms: "M4 4h16v12H8l-4 4zM8 9h8M8 12h5",
  whatsapp: "M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3zM9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 1a5 5 0 0 1-2.4-2.4l1-1-1-2z",
  heart: "M12 20s-7-4.4-9-9a4.6 4.6 0 0 1 9-2 4.6 4.6 0 0 1 9 2c-2 4.6-9 9-9 9z",
  ticket: "M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4zM14 7v10",
  calendar: "M4 6h16v15H4zM4 10h16M8 3v5M16 3v5",
  chevron: "M9 5l7 7-7 7",
  barcode: "M3 5v14M6 5v14M8 5v14M11 5v14M14 5v14M15.5 5v14M18 5v14M21 5v14",
  close: "M5 5l14 14M19 5 5 19",
  plus: "M12 4v16M4 12h16",
  clients: "M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0zM4 21c0-4 3.6-6 8-6s8 2 8 6",
  team: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM17 11a2.5 2.5 0 1 0 0-5M2 20c0-3.5 3-5 7-5s7 1.5 7 5M17 15c3 0 5 1.3 5 4.5",
  actions: "M4 6h16M4 12h10M4 18h7M18 15l3 3-3 3",
  catalog: "M6 8h12l-1 12H7zM9 8a3 3 0 0 1 6 0",
};
export function Icon({ name, size = 22, stroke = 1.5, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={P[name]} />
    </svg>
  );
}

/* ------------------------------------------------------------------ header + black title bar */
export function Wordmark({ light, size = 15 }) {
  return (
    <span className={`flex flex-col items-center leading-none ${light ? "text-white" : "text-black"}`}>
      <span style={{ fontSize: size, letterSpacing: "0.32em", fontWeight: 600, marginRight: "-0.32em" }}>LONGCHAMP</span>
      <span style={{ fontSize: Math.max(5, size * 0.36), letterSpacing: "0.6em", marginTop: 3, marginRight: "-0.6em" }}>PARIS</span>
    </span>
  );
}

export function AppBar({ title, sub, onBack, right }) {
  const { setMenu, nav, session } = useApp();
  return (
    <div className="shrink-0 bg-white pt-11">
      <div className="flex h-[52px] items-center px-3">
        <div className="flex w-[84px] items-center">
          {onBack && (
            <button onClick={onBack} aria-label="Back" className="grid h-9 w-8 place-items-center">
              <Icon name="back" />
            </button>
          )}
          <button onClick={() => setMenu(true)} aria-label="Menu" className="grid h-9 w-9 place-items-center">
            <Icon name="menu" />
          </button>
        </div>
        <div className="flex flex-1 justify-center">
          <Wordmark />
        </div>
        <div className="flex w-[84px] items-center justify-end">
          {right || (
            <>
              <button aria-label="Account" onClick={() => session && nav("profile")} className="grid h-9 w-9 place-items-center">
                <Icon name="user" />
              </button>
              <span className="grid h-9 w-9 place-items-center">
                <Icon name="bag" />
              </span>
            </>
          )}
        </div>
      </div>
      {title && (
        <div className="bg-black px-4 py-[7px] text-center">
          <p className="caps truncate text-[10.5px] font-medium text-white">{title}</p>
        </div>
      )}
      {sub && <p className="border-b border-[var(--lc-line)] px-4 py-2 text-center text-[11.5px] text-[var(--lc-muted)]">{sub}</p>}
    </div>
  );
}

export function Body({ children, className = "", pad = true }) {
  return <div className={`min-h-0 flex-1 overflow-y-auto ${pad ? "px-4 pb-10" : "pb-10"} ${className}`}>{children}</div>;
}

export function FullBody({ children, className = "" }) {
  return <div className={`absolute inset-0 overflow-y-auto ${className}`}>{children}</div>;
}

export function SectionTitle({ children, action }) {
  return (
    <div className="mb-2 mt-6 flex items-end justify-between border-b border-black pb-1.5">
      <p className="caps text-[10.5px] font-semibold">{children}</p>
      {action}
    </div>
  );
}

export function Tile({ children, className = "", onClick }) {
  const C = onClick ? "button" : "div";
  return (
    <C onClick={onClick} className={`block w-full border border-[var(--lc-line)] bg-white text-left ${onClick ? "active:bg-[#f6f6f6]" : ""} ${className}`}>
      {children}
    </C>
  );
}

/* Row with chevron — the Belong profile pattern */
export function Row({ label, value, count, onClick, open }) {
  const C = onClick ? "button" : "div";
  return (
    <C onClick={onClick} aria-expanded={onClick ? !!open : undefined} className="flex w-full items-center justify-between border-b border-[var(--lc-line)] py-3 text-left">
      <span className="caps text-[10.5px] font-semibold">{label}</span>
      <span className="flex items-center gap-2">
        {value && <span className="text-[12.5px] text-[var(--lc-muted)]">{value}</span>}
        {count !== undefined && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-black px-1.5 text-[10px] font-bold text-white">{count}</span>}
        {onClick && <Icon name="chevron" size={16} className={`text-[#9a9a9a] transition-transform ${open ? "rotate-90" : ""}`} />}
      </span>
    </C>
  );
}

export function TierBadge({ tier, small }) {
  const s = TIER_STYLE[tier] || TIER_STYLE.LIKER;
  return (
    <span className={`inline-flex items-center font-semibold uppercase ${small ? "px-1.5 py-[1px] text-[8.5px] tracking-[0.12em]" : "px-2 py-0.5 text-[10px] tracking-[0.14em]"}`} style={{ background: s.bg, color: s.fg }}>
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
      <Avatar.Fallback className={`text-[12px] font-semibold tracking-wider ${dark ? "bg-black text-white" : "bg-[#efefef] text-black"}`}>{ini}</Avatar.Fallback>
    </Avatar>
  );
}

/* Product placeholder — flat bag on a pale ground (real Shopify images in the build) */
export function BagArt({ color = "#1f3557", size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden>
      <rect width="120" height="120" fill="#f4f4f2" />
      <path d="M40 46 C40 29, 80 29, 80 46" fill="none" stroke="#3a2a1a" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M27 46 H93 L87 97 Q86 102 80 102 H40 Q34 102 33 97 Z" fill={color} />
      <path d="M27 46 H93 L91.5 57 H28.5 Z" fill="#000" opacity=".14" />
      <rect x="53" y="53" width="14" height="9" rx="2" fill="#c9a96b" />
    </svg>
  );
}

/* Boutique hero — illustrated stand-in for the store photo used in the deck */
export function BoutiqueArt({ height = 180 }) {
  const bags = ["#1f3557", "#8dc63f", "#6b3e26", "#c9b79c", "#2b2b2b", "#b24a3c", "#1f3557", "#d9c27a", "#3e6b4a", "#6b3e26"];
  return (
    <svg width="100%" height={height} viewBox="0 0 360 180" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Boutique">
      <rect width="360" height="180" fill="#efe9df" />
      <rect y="132" width="360" height="48" fill="#d8cdbd" />
      <rect x="112" y="142" width="140" height="30" fill="#8db36a" opacity=".55" />
      {[0, 1, 2].map((r) => (
        <g key={r}>
          <rect x="16" y={34 + r * 32} width="96" height="3" fill="#b9a68c" />
          <rect x="248" y={34 + r * 32} width="96" height="3" fill="#b9a68c" />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect x={22 + i * 22} y={20 + r * 32} width="14" height="14" fill={bags[(i + r * 3) % bags.length]} />
              <rect x={254 + i * 22} y={20 + r * 32} width="14" height="14" fill={bags[(i + r * 3 + 5) % bags.length]} />
            </g>
          ))}
        </g>
      ))}
      <rect x="150" y="16" width="60" height="96" fill="#fff" opacity=".7" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={156 + (i % 3) * 17} y={24 + Math.floor(i / 3) * 40} width="13" height="30" fill={bags[i + 2]} />
      ))}
      <ellipse cx="182" cy="140" rx="42" ry="8" fill="#fff" />
      <rect x="165" y="114" width="34" height="26" fill="#f7f4ee" />
    </svg>
  );
}

export function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return (
    <div role="status" className="absolute inset-x-4 bottom-8 z-50 flex items-center gap-2 bg-black px-4 py-3 text-[12.5px] text-white">
      <span className="inline-block h-2 w-2 shrink-0 bg-[var(--lc-lime)]" />
      {toast}
    </div>
  );
}

export function Sheet() {
  const { sheet, setSheet } = useApp();
  if (!sheet) return null;
  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end bg-black/40" onClick={() => setSheet(null)}>
      <div className="max-h-[80%] overflow-y-auto bg-white px-5 pb-10 pt-5" onClick={(e) => e.stopPropagation()}>
        {sheet}
      </div>
    </div>
  );
}

export function Stat({ label, value, sub, dark }) {
  return (
    <div className={`p-3 ${dark ? "bg-black text-white" : "border border-[var(--lc-line)] bg-white"}`}>
      <p className={`caps text-[9px] ${dark ? "text-white/60" : "text-[var(--lc-muted)]"}`}>{label}</p>
      <p className="mt-1.5 text-[24px] font-semibold leading-none">{value}</p>
      {sub && <p className={`mt-1 text-[11px] ${dark ? "text-[var(--lc-lime)]" : "text-[var(--lc-muted)]"}`}>{sub}</p>}
    </div>
  );
}

export function Pill({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 border px-3 py-1.5 text-[11.5px] ${active ? "border-black bg-black text-white" : "border-[var(--lc-line)] bg-white text-black"}`}
    >
      {children}
    </button>
  );
}

/* The black squares of the Belong home */
export function BlackTile({ label, onClick, sub }) {
  return (
    <button onClick={onClick} className="flex aspect-[1.45/1] flex-col items-center justify-center bg-black px-2 text-center text-white active:bg-[#262626]">
      <span className="text-[13.5px] font-bold uppercase leading-tight tracking-[0.03em]">{label}</span>
      {sub && <span className="mt-1 text-[10.5px] text-[var(--lc-lime)]">{sub}</span>}
    </button>
  );
}

/* Contact bar — outlined squares with tiny caps labels */
export function ContactBar({ items }) {
  return (
    <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 py-3">
      {items.map((it) => (
        <button key={it.label} onClick={it.onClick} disabled={it.disabled} className={`flex w-[54px] shrink-0 flex-col items-center gap-1 ${it.disabled ? "opacity-30" : ""}`}>
          <span className={`grid h-11 w-11 place-items-center border ${it.active ? "border-2 border-[var(--lc-lime)]" : "border-black"}`}>
            <Icon name={it.icon} size={20} />
          </span>
          <span className="caps text-[7.5px] font-semibold">{it.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ hamburger drawer (the app has no tab bar) */
export const MENU = {
  sales_agent: [
    { id: "home", en: "Home", idl: "Beranda" },
    { id: "clients", en: "Customer search", idl: "Cari pelanggan" },
    { id: "lists", en: "Customer lists", idl: "Daftar pelanggan" },
    { id: "actions", en: "Actions & agenda", idl: "Aksi & agenda" },
    { id: "catalog", en: "Product catalog", idl: "Katalog produk" },
    { id: "performance", en: "My results", idl: "Hasil saya" },
  ],
  supervisor: [
    { id: "home", en: "Home", idl: "Beranda" },
    { id: "clients", en: "Customer search", idl: "Cari pelanggan" },
    { id: "lists", en: "Customer lists & events", idl: "Daftar pelanggan & event" },
    { id: "actions", en: "Actions & agenda", idl: "Aksi & agenda" },
    { id: "team", en: "My team", idl: "Tim saya" },
    { id: "templates", en: "WhatsApp templates", idl: "Template WhatsApp" },
    { id: "catalog", en: "Product catalog", idl: "Katalog produk" },
  ],
  super_admin: [
    { id: "home", en: "Overview", idl: "Ringkasan" },
    { id: "clients", en: "All customers", idl: "Semua pelanggan" },
    { id: "performance", en: "Country KPI", idl: "KPI negara" },
    { id: "templates", en: "WhatsApp templates", idl: "Template WhatsApp" },
    { id: "push_rules", en: "Push rules", idl: "Aturan push" },
    { id: "users", en: "Users & roles", idl: "User & role" },
  ],
};
export const TABS = MENU;

export function Drawer() {
  const { session, menu, setMenu, reset, stack, tx, setSession } = useApp();
  if (!session) return null;
  const root = stack[0].id;
  return (
    <>
      <div className={`lc-scrim absolute inset-0 z-40 bg-black/40 ${menu ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={() => setMenu(false)} />
      <aside className={`lc-drawer absolute bottom-0 left-0 top-0 z-50 flex w-[82%] flex-col bg-white pt-11 ${menu ? "translate-x-0" : "-translate-x-full"}`} aria-hidden={!menu} inert={!menu ? "" : undefined}>
        <div className="flex h-[52px] items-center justify-between px-4">
          <Wordmark size={13} />
          <button onClick={() => setMenu(false)} aria-label="Close menu" className="grid h-9 w-9 place-items-center">
            <Icon name="close" />
          </button>
        </div>
        <div className="bg-black px-4 py-3 text-white">
          <p className="text-[15px] font-semibold uppercase tracking-[0.06em]">{session.user.full_name}</p>
          <p className="text-[11.5px] text-white/60">{{ sales_agent: "Sales Agent", supervisor: "Supervisor", super_admin: "Super Admin" }[session.role]}</p>
        </div>
        <nav className="flex-1 overflow-y-auto px-4">
          {MENU[session.role].map((m) => (
            <button key={m.id} onClick={() => reset(m.id)} className="flex w-full items-center justify-between border-b border-[var(--lc-line)] py-3.5 text-left">
              <span className={`caps flex items-center text-[11px] ${root === m.id ? "font-bold" : "font-medium"}`}>
                {root === m.id && <span className="mr-2 inline-block h-2 w-2 bg-[var(--lc-lime)]" />}
                {tx(m.en, m.idl)}
              </span>
              <Icon name="chevron" size={15} className="text-[#9a9a9a]" />
            </button>
          ))}
        </nav>
        <button
          onClick={() => {
            setSession(null);
            reset("login");
          }}
          className="caps m-4 border border-black py-3 text-[10.5px] font-semibold"
        >
          {tx("Sign out", "Keluar")}
        </button>
      </aside>
    </>
  );
}

/* compatibility: the app uses the drawer instead of a tab bar */
export function TabBar() {
  return <Drawer />;
}
