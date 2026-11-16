/*
 * Screen registry: component, which roles see it, a default demo param, and the review annotation
 * (use cases, activity / sequence diagrams, endpoints, implementor).
 */
import { Login, Register, Forgot } from "./screens/Auth";
import Home, { Profile } from "./screens/Home";
import { ClientSearch, ClientProfile, ClientNew, ReachOut, Lists, ListBuilder, ListDetail, TicketNew } from "./screens/Clients";
import { Actions, AgendaNew, Catalog, Product, Scan, ClientWishlist, WishlistSend, Performance, Team, Unassigned, Admin, Users, PushRules } from "./screens/Work";
import { Templates, TemplateNew } from "./screens/Templates";

const ALL = ["sales_agent", "supervisor", "super_admin"];
const FIELD = ["sales_agent", "supervisor"];
const L = (en, id = en) => ({ en, id });

export const SCREENS = {
  login: {
    C: Login, roles: ALL, group: "auth", auth: true,
    title: L("Sign in", "Login"),
    refs: ["UC-21", "AD-01", "SD-01"],
    api: ["POST /v1/auth/login → Cekat Product (CP-01)", "GET /users/me → role & scope (CP-03)"],
    owner: "product",
    note: L("Login, password policy and session are Cekat Product. The app only renders the form and stores the returned token.", "Login, kebijakan password, dan sesi adalah Cekat Product. App hanya menampilkan form dan menyimpan token yang dikembalikan."),
  },
  register: {
    C: Register, roles: ALL, group: "auth", auth: true,
    title: L("Register · activate invitation", "Register · aktivasi undangan"),
    refs: ["UC-21", "UC-22"],
    api: ["POST /auth/invitations/accept (new, CP-01)", "Invite sent by Super Admin from Cekat CRM User Settings"],
    owner: "product",
    note: L("No open self-sign-up: staff accounts are created by the Super Admin in Cekat and activated here with the invitation code.", "Tidak ada sign-up bebas: akun staf dibuat Super Admin di Cekat dan diaktifkan di sini dengan kode undangan."),
  },
  forgot: {
    C: Forgot, roles: ALL, group: "auth", auth: true,
    title: L("Forgot password", "Lupa password"),
    refs: ["UC-21"],
    api: ["POST /auth/password/otp (new, CP-01)", "POST /auth/password/reset (new, CP-01)"],
    owner: "product",
    note: L("OTP by email, handled entirely by Cekat Product.", "OTP via email, sepenuhnya ditangani Cekat Product."),
  },
  home: {
    C: Home, roles: ALL, group: "main",
    title: L("Home", "Beranda"),
    refs: ["UC-10", "UC-14", "UC-19"],
    api: ["GET /v1/home → pushes, agenda, KPI (BFF)", "Boards: Clienteling Pushes, Agenda, KPI Snapshot"],
    owner: "itdev",
    note: L("Role-aware: Sales Agent sees own pushes; Supervisor adds team completion; Super Admin gets the country dashboard.", "Sesuai role: Sales Agent melihat push sendiri; Supervisor ditambah penyelesaian tim; Super Admin mendapat dashboard negara."),
  },
  clients: {
    C: ClientSearch, roles: ALL, group: "clients",
    title: L("Customer Search", "Cari Pelanggan"),
    refs: ["UC-01", "SD-02"],
    api: ["GET /v1/clients?q= → GET /api/contacts with user token", "RBAC filter by Cekat Product (CP-02)"],
    owner: "itdev",
    note: L("The list is whatever Cekat returns for the signed-in user — the app applies no scope filter of its own.", "List adalah apa pun yang dikembalikan Cekat untuk user yang login — app tidak menerapkan filter scope sendiri."),
  },
  client: {
    C: ClientProfile, roles: ALL, group: "clients", params: { customer_id: 100245, push_id: 6120 },
    title: L("Client profile", "Profil klien"),
    refs: ["UC-02", "UC-03", "UC-04", "UC-22", "SD-02", "SD-06"],
    api: ["GET /api/contacts/{id}", "Boards: Transactions, Love Tags", "PATCH Contact Owner (Supervisor, CP-02 check)"],
    owner: "itdev",
    note: L("Super Admin: view only. Supervisor: extra 'Reassign' — target list limited to own boutique, Cekat returns 403 otherwise.", "Super Admin: hanya lihat. Supervisor: tambahan 'Pindahkan' — pilihan dibatasi boutique sendiri, Cekat mengembalikan 403 jika tidak."),
  },
  client_new: {
    C: ClientNew, roles: FIELD, group: "clients",
    title: L("Register new client", "Daftarkan klien baru"),
    refs: ["UC-05"],
    api: ["POST /v1/customers (C-03)", "→ Cekat CRM: POST /api/contacts (owner = Sales Agent, consent fields)", "→ Cekat CRM: Board List Members (Client Book, welcome_pending)"],
    owner: "itdev",
    note: L("Phone-first identity: n8n merges duplicates by phone_e164 then email.", "Identitas berbasis HP: n8n menggabungkan duplikat berdasarkan phone_e164 lalu email."),
  },
  reach_out: {
    C: ReachOut, roles: FIELD, group: "clients", params: { customer_id: 100245, push_id: 6120 },
    title: L("Reach Out", "Reach Out"),
    refs: ["UC-11", "UC-12", "UC-13", "AD-03", "SD-04"],
    api: ["GET /v1/clients/{id}/reach-out (30-day rule)", "POST /v1/messages → Cekat Message API", "POST /v1/reach-outs → Reach Out board"],
    owner: "itdev",
    note: L("Mirrors the deck: check 30 days → contact → return to app, select reason & channel, validate.", "Mengikuti deck: cek 30 hari → hubungi → kembali ke app, pilih alasan & channel, validasi."),
  },
  lists: {
    C: Lists, roles: FIELD, group: "clients",
    title: L("Customer Lists", "Daftar Pelanggan"),
    refs: ["UC-06", "UC-07", "UC-08", "UC-09"],
    api: ["Board: Customer Lists", "Server-side filter (CP-04)"],
    owner: "itdev",
    note: L("Dynamic lists, birthday lists, Client Book and event guest lists.", "Dynamic list, list ulang tahun, Client Book, dan guest list event."),
  },
  list_builder: {
    C: ListBuilder, roles: FIELD, group: "clients",
    title: L("Dynamic list builder", "Pembuat dynamic list"),
    refs: ["UC-06", "UC-07"],
    api: ["filter_json saved on Customer Lists", "Count via CP-04 filter"],
    owner: "itdev",
    note: L("New filters from the deck: assigned SA, wishlist sent, reach-out reason, category, promoter, area — plus Love Tags.", "Filter baru dari deck: SA, wishlist terkirim, alasan reach-out, kategori, promoter, area — plus Love Tags."),
  },
  list_detail: {
    C: ListDetail, roles: FIELD, group: "clients", params: { list_id: 502 },
    title: L("List / event guests", "List / tamu event"),
    refs: ["UC-08", "UC-09"],
    api: ["Boards: List Members, Event Guests", "Broadcast API (WA invitation)"],
    owner: "itdev",
    note: L("Event lists show RSVP counts and send the WA invitation template.", "List event menampilkan jumlah RSVP dan mengirim template undangan WA."),
  },
  ticket_new: {
    C: TicketNew, roles: FIELD, group: "clients", params: { customer_id: 100245 },
    title: L("Service ticket", "Tiket servis"),
    refs: ["UC-18"],
    api: ["Tickets API — create"],
    owner: "itdev",
    note: L("After-sales request linked to the client.", "Permintaan after-sales yang terhubung ke klien."),
  },
  actions: {
    C: Actions, roles: FIELD, group: "actions",
    title: L("Actions · pushes & agenda", "Aksi · push & agenda"),
    refs: ["UC-10", "UC-14", "AD-02", "SD-03"],
    api: ["Boards: Clienteling Pushes, Agenda", "Board item webhook for UI-created tasks (CP-05)"],
    owner: "itdev",
    note: L("The four push types from the deck; status sent / executed / cancelled feeds the push completion KPI.", "Empat tipe push dari deck; status sent / executed / cancelled masuk ke KPI penyelesaian push."),
  },
  agenda_new: {
    C: AgendaNew, roles: FIELD, group: "actions", params: { customer_id: 100311 },
    title: L("New task / appointment", "Task / appointment baru"),
    refs: ["UC-14"],
    api: ["POST Agenda board item"],
    owner: "itdev",
    note: L("Task kinds and appointment kinds from the Agenda slide.", "Jenis task dan appointment dari slide Agenda."),
  },
  catalog: {
    C: Catalog, roles: ALL, group: "catalog",
    title: L("Product Catalog", "Katalog Produk"),
    refs: ["UC-15", "AD-04", "SD-05"],
    api: ["GET /v1/products → Shopify (cached)", "Stock badge from Odoo"],
    owner: "itdev",
    note: L("Placeholder product art — real Shopify images in the build.", "Gambar produk placeholder — gambar Shopify asli di build."),
  },
  scan: {
    C: Scan, roles: FIELD, group: "catalog",
    title: L("Scan a barcode", "Pindai barcode"),
    refs: ["UC-24", "AD-04", "SD-05"],
    api: ["GET /v1/products?barcode= → Shopify variant barcode lookup"],
    owner: "itdev",
    note: L("Deck: barcode icon next to 'Search a product'. Camera scan resolves the Shopify variant barcode.", "Deck: ikon barcode di samping 'Cari produk'. Pindai kamera mencari barcode varian Shopify."),
  },
  product: {
    C: Product, roles: ALL, group: "catalog", params: { sku: "L10165HFP" },
    title: L("Product & stock", "Produk & stok"),
    refs: ["UC-16", "UC-17", "SD-05"],
    api: ["GET /v1/stock?sku= → Odoo stock.quant (live)", "Add to client wishlist: POST /v1/customers/{id}/wishlist (W-02) → Cekat CRM: Board Wishlist item (saved)"],
    owner: "itdev",
    note: L("Stock per boutique is read live, never via webhook.", "Stok per boutique dibaca live, tidak lewat webhook."),
  },
  catalog_pick: { C: Catalog, roles: FIELD, group: "catalog", hidden: true, title: L("Catalog for wishlist"), refs: ["UC-17"], api: [], owner: "itdev", note: L("") },
  client_wishlist: {
    C: ClientWishlist, roles: FIELD, group: "catalog", params: { customer_id: 100245 },
    title: L("Client wishlist", "Wishlist klien"),
    refs: ["UC-28", "UC-17", "AD-04", "SD-05"],
    api: ["GET /v1/customers/{id}/wishlist (W-01) → Cekat CRM: Board Wishlist items", "POST /v1/customers/{id}/wishlist (W-02) → Cekat CRM: POST Board Wishlist item (saved)", "DELETE (W-03) → Cekat CRM: DELETE Board Wishlist item", "Send (W-04) → Cekat Chat Message API + PATCH Wishlist items (sent)"],
    owner: "itdev",
    note: L("Pick a customer, save products to their wishlist (status Saved), send later on WhatsApp (Sent), conversion within 30 days (Purchased). RBAC on the customer comes from CP-02.", "Pilih pelanggan, simpan produk ke wishlist-nya (status Tersimpan), kirim nanti via WhatsApp (Terkirim), konversi dalam 30 hari (Dibeli). RBAC pelanggan dari CP-02."),
  },
  wishlist_send: {
    C: WishlistSend, roles: FIELD, group: "catalog",
    title: L("Send wishlist", "Kirim wishlist"),
    refs: ["UC-17", "SD-05"],
    api: ["POST /v1/wishlists → Wishlist board + Message API", "Delivery / read status (CP-06)"],
    owner: "itdev",
    note: L("Only clients with WhatsApp consent can be selected.", "Hanya klien dengan consent WhatsApp yang bisa dipilih."),
    seed: "wishlist",
  },
  performance: {
    C: Performance, roles: ["sales_agent", "super_admin"], group: "kpi",
    title: L("Performance / KPI", "Performa / KPI"),
    refs: ["UC-19"],
    api: ["GET KPI Snapshot items (level = sa | pos | country)"],
    owner: "itdev",
    note: L("Same report as the BSC slide at Sales Agent, POS or country level. Rates without the % sign.", "Laporan sama seperti slide BSC di level Sales Agent, POS, atau negara. Rate tanpa simbol %."),
  },
  team: {
    C: Team, roles: ["supervisor"], group: "kpi",
    title: L("Team (Supervisor)", "Tim (Supervisor)"),
    refs: ["UC-19", "UC-22"],
    api: ["KPI Snapshot (level = sa, boutique scope)", "Clienteling Pushes (completion)"],
    owner: "itdev",
    note: L("Push completion below 70 is highlighted for coaching.", "Penyelesaian push di bawah 70 disorot untuk coaching."),
  },
  clients_unassigned: {
    C: Unassigned, roles: ["supervisor"], group: "kpi",
    title: L("Unassigned clients", "Klien tanpa assignee"),
    refs: ["UC-22"],
    api: ["GET /api/contacts?owner=none (RBAC: boutique)"],
    owner: "itdev",
    note: L("New walk-in clients waiting for a Sales Agent.", "Klien walk-in baru yang menunggu Sales Agent."),
  },
  admin: {
    C: Admin, roles: ["super_admin"], group: "admin",
    title: L("Admin", "Admin"),
    refs: ["UC-20", "UC-22"],
    api: ["Templates / Push Rules boards", "Users via CP-03"],
    owner: "itdev",
    note: L("Super Admin only.", "Hanya Super Admin."),
  },
  users: {
    C: Users, roles: ["super_admin"], group: "admin",
    title: L("Users & roles", "User & role"),
    refs: ["UC-22", "AD-05"],
    api: ["GET users & hierarchy (CP-03)", "Invite / edit in Cekat CRM User Settings"],
    owner: "product",
    note: L("Read-only in the app: users and roles are managed in Cekat by Cekat Product features.", "Hanya baca di app: user dan role dikelola di Cekat lewat fitur Cekat Product."),
  },
  templates: {
    C: Templates, roles: ["supervisor", "super_admin"], group: "admin",
    title: L("Template library", "Template library"),
    refs: ["UC-23", "UC-13", "AD-06", "SD-07"],
    api: ["Template Library board (scope, owner, meta_status)", "n8n polls Meta status via Cekat Open API"],
    owner: "itdev",
    note: L("Supervisor sees global templates plus their boutique's; Super Admin sees all. Status comes from Meta: pending, approved, rejected with reason.", "Supervisor melihat template global plus milik boutique-nya; Super Admin melihat semua. Status dari Meta: pending, approved, rejected beserta alasannya."),
  },
  template_new: {
    C: TemplateNew, roles: ["supervisor", "super_admin"], group: "admin",
    title: L("New WhatsApp template", "Template WhatsApp baru"),
    refs: ["UC-23", "AD-06", "SD-07"],
    api: ["POST /v1/templates (T-02)", "→ Cekat Chat: Open API create template message (to Meta)", "→ Cekat CRM: POST Board Template Library item (pending)", "RBAC on Cekat (CP-02): Supervisor own boutique only"],
    owner: "itdev",
    note: L("Fields follow Cekat's template form: name, language, category, optional header, body with variables, optional buttons (website max 2, call max 1, max 10). Supervisors are locked to their boutique.", "Field mengikuti form template Cekat: nama, bahasa, kategori, header opsional, body dengan variabel, tombol opsional (website maks 2, telepon maks 1, maks 10). Supervisor terkunci ke boutique-nya."),
  },
  push_rules: {
    C: PushRules, roles: ["super_admin"], group: "admin",
    title: L("Push rules", "Aturan push"),
    refs: ["UC-20", "AD-02"],
    api: ["Push Rules board → n8n scheduler"],
    owner: "itdev",
    note: L("Localised rules for the 2026 push revamp.", "Aturan lokal untuk revamp push 2026."),
  },
  profile: {
    C: Profile, roles: ALL, group: "main",
    title: L("My account", "Akun saya"),
    refs: ["UC-21"],
    api: ["GET /users/me (CP-03)"],
    owner: "product",
    note: L("Shows the role and scope exactly as Cekat returns them.", "Menampilkan role dan scope persis seperti dikembalikan Cekat."),
  },
};

export const GROUPS = {
  auth: L("Login & register", "Login & register"),
  main: L("Home", "Beranda"),
  clients: L("Clients", "Klien"),
  actions: L("Actions", "Aksi"),
  catalog: L("Catalog & wishlist", "Katalog & wishlist"),
  kpi: L("Performance & team", "Performa & tim"),
  admin: L("Admin", "Admin"),
};

/* Which tab root a screen lives under (for the stack when jumping directly) */
export const ROOT_OF = {
  client: "clients", client_new: "clients", reach_out: "clients", lists: "home", list_builder: "home", list_detail: "home", ticket_new: "clients",
  agenda_new: "actions", product: "catalog", scan: "catalog", catalog_pick: "clients", client_wishlist: "clients", wishlist_send: "catalog",
  clients_unassigned: "team", users: "admin", templates: "admin", template_new: "templates", push_rules: "admin", profile: "home",
};
