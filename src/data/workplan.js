/*
 * Work split: who builds what, down to API variables and app screens.
 * Everything is derived from components.js, apiSpec.js and the mockup registry,
 * so this page and the Sheet stay in step with the solution design.
 */
import { COMPONENTS, PARTIES } from "./components";
import { ENDPOINTS, API_GROUPS, CONVENTIONS, WEBHOOKS, JOBS, WRITES } from "./apiSpec";
import { SCREENS } from "../mockup/screens";
import { TABS, MENU } from "../mockup/core";

export const PARTY_LABEL = {
  product: "Cekat Product",
  itdelivery: "Cekat IT Dev / Delivery",
  vendor: "Vendor",
  existing: "Sudah berjalan",
};
export const PARTY_ORDER = ["product", "itdelivery", "vendor", "existing"];
export { PARTIES };

const ROLE = { sales_agent: "Sales Agent", supervisor: "Supervisor", super_admin: "Super Admin" };
const roles = (r) => r.map((x) => ROLE[x]).join(", ");
const GROUP = Object.fromEntries(API_GROUPS.map((g) => [g.id, g.name]));
const numbered = (l = []) => l.map((x, i) => `${i + 1}. ${x}`).join("\n");

/* ---------------------------------------------------------------- components */
export const componentRows = [...COMPONENTS]
  .sort((a, b) => PARTY_ORDER.indexOf(a.party) - PARTY_ORDER.indexOf(b.party))
  .map((c) => ({ id: c.id, party: c.party, name: c.name, work: c.work, deps: c.deps }));

/* ---------------------------------------------------------------- API */
export const apiRows = ENDPOINTS.map((e) => ({
  id: e.id,
  group: GROUP[e.group],
  method: e.method,
  path: "/v1" + e.path,
  title: e.title,
  cp: (e.cp || []).join(", ") || "—",
  roles: roles(e.roles),
  uc: (e.uc || []).join(", "),
  upstream: numbered(e.upstream),
  logic: numbered(e.logic),
  errors: (e.errors || []).join("\n") || "—",
}));

/* ---------------------------------------------------------------- variables */
const typeOf = (v) =>
  v === null ? "null" : Array.isArray(v) ? "array" : typeof v === "boolean" ? "bool" : typeof v === "number" ? (Number.isInteger(v) ? "int" : "number") : typeof v === "object" ? "object" : "string";
const show = (v) => (v === null || v === undefined ? "null" : typeof v === "object" ? JSON.stringify(v).slice(0, 200) : String(v));
function flatten(o, path, out) {
  if (o && typeof o === "object" && !Array.isArray(o)) {
    for (const [k, v] of Object.entries(o)) flatten(v, path ? `${path}.${k}` : k, out);
  } else if (Array.isArray(o) && o.length && o[0] && typeof o[0] === "object") {
    out.push([path, "array<object>", `${o.length} item contoh`]);
    flatten(o[0], `${path}[]`, out);
  } else out.push([path, typeOf(o), show(o)]);
}
const yes = (b) => (b ? "Ya" : "Tidak");

export const variableRows = [
  ...CONVENTIONS.headers.map((h) => ({ endpoint: "Semua", path: "(semua endpoint)", loc: "Header", name: h[0], type: h[1], req: yes(h[2]), desc: h[3], ex: show(h[4]) })),
  ...CONVENTIONS.paging.map((h) => ({ endpoint: "Semua list", path: "(endpoint daftar)", loc: "Query", name: h[0], type: h[1], req: yes(h[2]), desc: h[3], ex: show(h[4]) })),
  ...ENDPOINTS.flatMap((e) => {
    const path = `${e.method} /v1${e.path}`;
    const rows = [];
    for (const [loc, key] of [["Query", "query"], ["Body", "body"]])
      for (const v of e[key] || []) rows.push({ endpoint: e.id, path, loc, name: v[0], type: v[1], req: yes(v[2]), desc: v[3] || "—", ex: show(v[4]) });
    const out = [];
    flatten(e.response || {}, "", out);
    for (const [name, type, ex] of out) rows.push({ endpoint: e.id, path, loc: "Response", name, type, req: "—", desc: "—", ex });
    return rows;
  }),
];

/* ---------------------------------------------------------------- writes to Cekat */
export const writeRows = WRITES.flatMap((w) =>
  w.steps.map((s, i) => ({
    endpoint: w.endpoint,
    title: w.title,
    step: i + 1,
    target: s.target,
    call: s.call,
    payload: JSON.stringify(s.payload),
    verify: s.verify === false ? "Cekat Product (CP-03)" : "Cek di docs.cekat.ai",
  }))
);

/* ---------------------------------------------------------------- webhooks & jobs */
export const jobRows = [
  ...WEBHOOKS.map((w) => ({ id: w.id, kind: "Webhook masuk", when: w.source, name: w.event, path: w.path, logic: w.logic })),
  ...JOBS.map((j) => ({ id: j.id, kind: "Job terjadwal", when: j.schedule, name: j.name, path: "—", logic: j.logic })),
];

/* ---------------------------------------------------------------- app breakdown (Vendor) */
const VMAP = {
  login: "V-02", register: "V-02", forgot: "V-02", home: "V-03",
  clients: "V-04", client: "V-04", client_new: "V-04", ticket_new: "V-04", reach_out: "V-05",
  lists: "V-06", list_builder: "V-06", list_detail: "V-06", actions: "V-07", agenda_new: "V-07",
  catalog: "V-08", scan: "V-08", product: "V-08", catalog_pick: "V-09", client_wishlist: "V-09", wishlist_send: "V-09",
  performance: "V-10", team: "V-10", clients_unassigned: "V-10",
  admin: "V-11", users: "V-11", templates: "V-11", template_new: "V-11", push_rules: "V-11", tracking_rules: "V-11", settings: "V-11",
};
export const V_NAME = {
  "V-01": "Shell app", "V-02": "Login & aktivasi", "V-03": "Home", "V-04": "Pelanggan", "V-05": "Reach Out", "V-06": "Daftar & event",
  "V-07": "Aksi & agenda", "V-08": "Katalog & scan", "V-09": "Wishlist", "V-10": "KPI & tim", "V-11": "Admin", "V-12": "Push & rilis",
};
const tabsOf = (r) => TABS[r].map((t) => t.idl).join(", ");
const moreOf = (r) => MENU[r].filter((m) => !TABS[r].some((t) => t.id === m.id)).map((m) => m.idl).join(", ");

const SHELL = [
  ["Setup project", "Semua", "Vite + React 19, HeroUI v3, Tailwind v4, React Router, TanStack Query, Capacitor iOS/Android, lint + CI build", "—"],
  ["Tema Longchamp", "Semua", "Token warna (hitam, putih, lime #a3e363), tipografi, ikon, komponen dasar HeroUI yang di-theme, mengikuti longchamp.co.id", "—"],
  ["Bottom tab bar — Sales Agent", "Sales Agent", `4 tab: ${tabsOf("sales_agent")} + Lainnya`, "A-07"],
  ["Bottom tab bar — Supervisor", "Supervisor", `4 tab: ${tabsOf("supervisor")} + Lainnya`, "A-07"],
  ["Bottom tab bar — Super Admin", "Super Admin", `4 tab: ${tabsOf("super_admin")} + Lainnya`, "A-07"],
  ["Sheet 'Lainnya'", "Semua", `Nama + role, menu sisa per role (SA: ${moreOf("sales_agent")}; SV: ${moreOf("supervisor")}; Admin: ${moreOf("super_admin")}), Akun saya, Keluar`, "A-03"],
  ["Navigasi stack per tab", "Semua", "Tiap tab punya stack sendiri; back kembali ke root tab; lompat langsung ke layar memakai root tab yang benar", "—"],
  ["Guard login & role", "Semua", "Tanpa token → Login; layar di luar role disembunyikan; role dari A-07 / CP-03; data scope tetap dicek server (CP-02)", "A-07"],
  ["Penyimpanan sesi aman", "Semua", "Access + refresh token di Keychain/Keystore; auto refresh saat 401; logout menghapus token dan token push", "A-01, A-02, A-03"],
  ["API client", "Semua", "Header Authorization, Accept-Language, Idempotency-Key (semua POST buat data), X-Request-Id, X-App-Version; retry 502; tangani 426 (paksa update) dan 429", "Semua endpoint"],
  ["Bahasa ID / EN", "Semua", "Semua label dua bahasa; bahasa mengikuti profil user, bisa diganti di Akun saya", "A-07"],
  ["State standar", "Semua", "Loading (skeleton), kosong, error dengan coba lagi, offline banner; pesan error dari field error.message API", "—"],
  ["Akun saya", "Semua", "Profil, role, boutique, bahasa, versi app", "A-07"],
  ["Deep link", "Semua", "Buka layar dari push (pelanggan, push, agenda, template) ke tab yang benar", "—"],
];
const NATIVE = [
  ["Registrasi token FCM", "Izin notifikasi, kirim token ke A-06 saat login dan saat token berubah", "A-06"],
  ["Terima & tampilkan push", "Foreground banner, badge, tap → deep link", "—"],
  ["Build iOS", "Signing, TestFlight, App Store listing", "—"],
  ["Build Android", "Signing, internal testing, Play Store listing", "—"],
  ["Kamera & izin", "Izin kamera untuk scan barcode, penjelasan izin ID/EN", "—"],
];

const pad = (n) => String(n).padStart(2, "0");
export const appRows = (() => {
  const rows = SHELL.map(([name, role, detail, api], i) => ({ id: `V-01.${pad(i + 1)}`, parent: "V-01", kind: "Fondasi app", name, role, detail, api, refs: "—", screen: null, owner: "Vendor" }));
  const count = {};
  for (const [sid, s] of Object.entries(SCREENS)) {
    const v = VMAP[sid];
    if (!v) continue;
    count[v] = (count[v] || 0) + 1;
    rows.push({
      id: `${v}.${pad(count[v])}`, parent: v, kind: "Layar", name: s.title.id, role: roles(s.roles), detail: s.note?.id || "—",
      api: s.api.join("\n"), refs: s.refs.join(", "), screen: sid, mockRole: s.roles[0], owner: s.owner === "product" ? "Vendor (UI) + Cekat Product" : "Vendor",
    });
  }
  NATIVE.forEach(([name, detail, api], i) => rows.push({ id: `V-12.${pad(i + 1)}`, parent: "V-12", kind: "Native", name, role: "Semua", detail, api, refs: "—", screen: null, owner: "Vendor" }));
  return rows;
})();
