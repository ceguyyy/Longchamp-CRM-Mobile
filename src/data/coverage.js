/*
 * PDF coverage — every capability shown in "IN_CX_Discussion_Sep26" (Belong app, APAC CX deck)
 * mapped to the mockup screen and the diagrams that carry it.
 *
 * status: covered  = in the mockup and the diagrams
 *         adapted  = covered, but changed for Indonesia / Cekat (see note)
 *         excluded = deliberately left out (see note)
 */
const L = (en, id = en) => ({ en, id });

export const COVERAGE = [
  /* ---------------- Customer search & profile */
  { area: "search", cap: L("Customer search by name, phone or e-mail", "Cari pelanggan via nama, telepon, atau e-mail"), screen: "clients", role: "sales_agent", uc: ["UC-01"], ad: ["AD-01"], sd: ["SD-02"], status: "covered" },
  { area: "search", cap: L("Customer profile: identity, segment, assigned seller, last contact", "Profil pelanggan: identitas, segmen, seller, kontak terakhir"), screen: "client", role: "sales_agent", uc: ["UC-02"], ad: ["AD-01"], sd: ["SD-02"], status: "covered" },
  { area: "search", cap: L("Profile data grid: POS client ID, purchase frequency, sales 12 months", "Grid data profil: ID klien POS, frekuensi beli, sales 12 bulan"), screen: "client", role: "sales_agent", uc: ["UC-02"], ad: ["AD-01"], sd: ["SD-02"], status: "adapted",
    note: L("POS client ID = Odoo partner id (customer.odoo_partner_id).", "ID klien POS = Odoo partner id (customer.odoo_partner_id).") },
  { area: "search", cap: L("Purchase history", "Riwayat pembelian"), screen: "client", role: "sales_agent", uc: ["UC-03"], ad: ["AD-01", "AD-02"], sd: ["SD-02", "SD-03"], status: "covered" },
  { area: "search", cap: L("Love Tags — 18 interests with checkboxes and VALIDATE", "Love Tags — 18 minat dengan checkbox dan VALIDATE"), screen: "client", role: "sales_agent", uc: ["UC-04"], ad: ["AD-01"], sd: ["SD-02"], status: "covered" },
  { area: "search", cap: L("Commentaries, editable", "Komentar, bisa diedit"), screen: "client", role: "sales_agent", uc: ["UC-04"], ad: ["AD-01"], sd: ["SD-02"], status: "covered" },
  { area: "search", cap: L("After-sales cases on the profile", "Kasus after-sales di profil"), screen: "client", role: "sales_agent", uc: ["UC-27"], ad: ["AD-01"], sd: ["SD-02"], status: "covered" },
  { area: "search", cap: L("Connected customer icon + 'Disconnect customer'", "Ikon pelanggan terhubung + 'Disconnect customer'"), screen: "client", role: "sales_agent", uc: ["UC-25"], ad: ["AD-04"], sd: [], status: "covered",
    note: L("App session state only; no backend call.", "Hanya state sesi app; tanpa panggilan backend.") },
  { area: "search", cap: L("'+' quick add: task, appointment, after-sales case, list, wishlist", "'+' tambah cepat: task, appointment, after-sales, list, wishlist"), screen: "client", role: "sales_agent", uc: ["UC-14", "UC-18", "UC-17"], ad: ["AD-03"], sd: ["SD-04"], status: "covered" },
  { area: "search", cap: L("Register a new client", "Daftarkan klien baru"), screen: "client_new", role: "sales_agent", uc: ["UC-05"], ad: ["AD-02"], sd: ["SD-03"], status: "adapted",
    note: L("Phone-first identity (E.164) instead of e-mail-first; UU PDP consent for WA and e-mail.", "Identitas berbasis telepon (E.164), bukan e-mail; consent UU PDP untuk WA dan e-mail.") },

  /* ---------------- Lists */
  { area: "lists", cap: L("Create a customer list: manual or dynamic", "Buat daftar pelanggan: manual atau dinamis"), screen: "lists", role: "sales_agent", uc: ["UC-06"], ad: [], sd: [], status: "covered" },
  { area: "lists", cap: L("Dynamic filters: segment, seller, wishlist, reason, category, promoter, area", "Filter dinamis: segmen, seller, wishlist, alasan, kategori, promoter, area"), screen: "list_builder", role: "sales_agent", uc: ["UC-06"], ad: [], sd: [], status: "covered" },
  { area: "lists", cap: L("Sort the list", "Urutkan list"), screen: "list_builder", role: "sales_agent", uc: ["UC-06"], ad: [], sd: [], status: "covered" },
  { area: "lists", cap: L("Share with store sellers", "Bagikan ke seller boutique"), screen: "lists", role: "sales_agent", uc: ["UC-26"], ad: [], sd: [], status: "covered",
    note: L("Members still filtered by each seller's RBAC (CP-02).", "Anggota tetap difilter RBAC tiap seller (CP-02).") },
  { area: "lists", cap: L("Upcoming birthdays", "Ulang tahun mendatang"), screen: "list_detail", role: "sales_agent", uc: ["UC-07"], ad: [], sd: [], status: "covered" },
  { area: "lists", cap: L("Client Book: welcome and follow up new clients", "Client Book: welcome dan follow-up klien baru"), screen: "list_detail", role: "sales_agent", uc: ["UC-08"], ad: [], sd: ["SD-04"], status: "covered" },
  { area: "lists", cap: L("Contact icons on each list row (profile, call, SMS, WhatsApp)", "Ikon kontak di tiap baris list (profil, telepon, SMS, WhatsApp)"), screen: "list_detail", role: "sales_agent", uc: ["UC-11"], ad: ["AD-03"], sd: ["SD-04"], status: "covered" },
  { area: "lists", cap: L("Event guest list, invitation and attendance", "Guest list event, undangan, dan kehadiran"), screen: "list_detail", role: "supervisor", uc: ["UC-09"], ad: [], sd: [], status: "covered" },

  /* ---------------- Actions */
  { area: "actions", cap: L("Clienteling pushes: VIP Birthday, VIP Downgrade, High Value Upgrade, Beginner+ Upgrade", "Clienteling push: VIP Birthday, VIP Downgrade, High Value Upgrade, Beginner+ Upgrade"), screen: "actions", role: "sales_agent", uc: ["UC-10"], ad: ["AD-02", "AD-03"], sd: ["SD-03", "SD-04"], status: "covered" },
  { area: "actions", cap: L("Reach out only after 30 days without contact", "Reach out hanya setelah 30 hari tanpa kontak"), screen: "reach_out", role: "sales_agent", uc: ["UC-11"], ad: ["AD-03"], sd: ["SD-04"], status: "covered" },
  { area: "actions", cap: L("Select reason and channel, VALIDATE", "Pilih alasan dan channel, VALIDATE"), screen: "reach_out", role: "sales_agent", uc: ["UC-12"], ad: ["AD-03"], sd: ["SD-04"], status: "covered" },
  { area: "actions", cap: L("Template Library by key moment, with icons and language switch", "Template Library per momen penting, dengan ikon dan pilihan bahasa"), screen: "reach_out", role: "sales_agent", uc: ["UC-13"], ad: ["AD-03"], sd: ["SD-04"], status: "adapted",
    note: L("Languages are Bahasa Indonesia and English. WhatsApp outside 24h uses Meta-approved templates.", "Bahasa: Indonesia dan Inggris. WhatsApp di luar 24 jam memakai template yang di-approve Meta.") },
  { area: "actions", cap: L("Create WhatsApp templates (Supervisor, Super Admin)", "Buat template WhatsApp (Supervisor, Super Admin)"), screen: "template_new", role: "supervisor", uc: ["UC-23"], ad: ["AD-06"], sd: ["SD-07"], status: "adapted",
    note: L("Requested for this project; not in the deck.", "Permintaan proyek ini; tidak ada di deck.") },
  { area: "actions", cap: L("Agenda: tasks and appointments, To do / Late", "Agenda: task dan appointment, Belum / Terlambat"), screen: "actions", role: "supervisor", uc: ["UC-14"], ad: [], sd: [], status: "covered" },
  { area: "actions", cap: L("Agenda boutique selector", "Pemilih boutique di agenda"), screen: "actions", role: "super_admin", uc: ["UC-14"], ad: [], sd: [], status: "covered" },
  { area: "actions", cap: L("New appointment with free time slots", "Appointment baru dengan slot waktu kosong"), screen: "agenda_new", role: "sales_agent", uc: ["UC-14"], ad: [], sd: [], status: "covered" },

  /* ---------------- Catalog */
  { area: "catalog", cap: L("Search a product", "Cari produk"), screen: "catalog", role: "sales_agent", uc: ["UC-15"], ad: ["AD-04"], sd: ["SD-05"], status: "covered" },
  { area: "catalog", cap: L("Scan a barcode", "Pindai barcode"), screen: "scan", role: "sales_agent", uc: ["UC-24"], ad: ["AD-04"], sd: ["SD-05"], status: "covered" },
  { area: "catalog", cap: L("Stock per boutique", "Stok per boutique"), screen: "product", role: "sales_agent", uc: ["UC-16"], ad: ["AD-04"], sd: ["SD-05"], status: "covered" },
  { area: "catalog", cap: L("Pick a customer and add products to their wishlist (saved, sent, purchased)", "Pilih pelanggan dan tambahkan produk ke wishlist-nya (tersimpan, terkirim, dibeli)"), screen: "client_wishlist", role: "sales_agent", uc: ["UC-28"], ad: ["AD-04"], sd: ["SD-05"], status: "covered" },
  { area: "catalog", cap: L("Wishlist and send to the client", "Wishlist dan kirim ke klien"), screen: "wishlist_send", role: "sales_agent", uc: ["UC-17"], ad: ["AD-04"], sd: ["SD-05"], status: "adapted",
    note: L("Sent on WhatsApp instead of WeChat / e-mail.", "Dikirim lewat WhatsApp, bukan WeChat / e-mail.") },
  { area: "catalog", cap: L("Create a ticket from the product page", "Buat tiket dari halaman produk"), screen: "product", role: "sales_agent", uc: ["UC-18"], ad: ["AD-04"], sd: [], status: "covered" },

  /* ---------------- Performance */
  { area: "perf", cap: L("KPI: actions, actions/POS/day, conversion rate, sales, days to convert", "KPI: actions, actions/POS/hari, conversion rate, sales, hari konversi"), screen: "performance", role: "sales_agent", uc: ["UC-19"], ad: [], sd: [], status: "covered" },
  { area: "perf", cap: L("KPI by channel incl. sales per channel", "KPI per channel termasuk sales per channel"), screen: "performance", role: "supervisor", uc: ["UC-19"], ad: [], sd: [], status: "covered" },
  { area: "perf", cap: L("Wishlist KPI", "KPI wishlist"), screen: "performance", role: "supervisor", uc: ["UC-19"], ad: [], sd: [], status: "covered" },
  { area: "perf", cap: L("Push completion", "Penyelesaian push"), screen: "performance", role: "supervisor", uc: ["UC-19"], ad: [], sd: [], status: "covered" },
  { area: "perf", cap: L("Country / boutique / seller levels", "Level negara / boutique / seller"), screen: "performance", role: "super_admin", uc: ["UC-19", "UC-21"], ad: ["AD-01"], sd: ["SD-01"], status: "covered" },
  { area: "perf", cap: L("Push rules maintained by HQ", "Aturan push dikelola HQ"), screen: "push_rules", role: "super_admin", uc: ["UC-20"], ad: [], sd: [], status: "covered" },

  /* ---------------- Excluded */
  { area: "excluded", cap: L("WeChat channel", "Channel WeChat"), screen: null, uc: [], ad: [], sd: [], status: "excluded",
    note: L("Not used in Indonesia; WhatsApp through Cekat replaces it.", "Tidak dipakai di Indonesia; diganti WhatsApp via Cekat.") },
  { area: "excluded", cap: L("'My rewards' (seller incentives)", "'My rewards' (insentif seller)"), screen: null, uc: [], ad: [], sd: [], status: "excluded",
    note: L("No rewards data source in scope. Can be added later as a board fed by HR / Retail.", "Belum ada sumber data rewards. Bisa ditambahkan nanti sebagai board dari HR / Retail.") },
];

export const AREAS = {
  search: L("Customer search & profile", "Cari pelanggan & profil"),
  lists: L("Customer lists", "Daftar pelanggan"),
  actions: L("Actions & agenda", "Aksi & agenda"),
  catalog: L("Product catalog", "Katalog produk"),
  perf: L("Performance & admin", "Performa & admin"),
  excluded: L("Deliberately excluded", "Sengaja tidak dimasukkan"),
};

/*
 * RACI from the deck (Retail / CRM / IT / Training) mapped to the delivery parties of this project.
 * R = responsible, A = accountable, C = consulted, I = informed.
 */
export const RACI_PARTIES = [
  { id: "itdev", name: L("Cekat IT Dev", "Cekat IT Dev"), deck: "IT" },
  { id: "product", name: L("Cekat Product", "Cekat Product"), deck: "IT" },
  { id: "lc_crm", name: L("Longchamp CRM", "Longchamp CRM"), deck: "CRM" },
  { id: "lc_retail", name: L("Longchamp Retail", "Longchamp Retail"), deck: "Retail" },
  { id: "lc_training", name: L("Longchamp Training", "Longchamp Training"), deck: "Training" },
];

export const RACI = [
  { task: L("App, BFF and n8n flows", "App, BFF, dan flow n8n"), itdev: "R", product: "C", lc_crm: "A", lc_retail: "I", lc_training: "I" },
  { task: L("Login, users and RBAC (CP-01…03)", "Login, user, dan RBAC (CP-01…03)"), itdev: "C", product: "R", lc_crm: "A", lc_retail: "I", lc_training: "I" },
  { task: L("Missing Cekat APIs and webhooks (CP-04…06)", "API dan webhook Cekat yang belum ada (CP-04…06)"), itdev: "C", product: "R", lc_crm: "A", lc_retail: "I", lc_training: "I" },
  { task: L("Clienteling push rules and KPI definitions", "Aturan clienteling push dan definisi KPI"), itdev: "C", product: "I", lc_crm: "R", lc_retail: "A", lc_training: "I" },
  { task: L("WhatsApp templates and Meta approval", "Template WhatsApp dan approval Meta"), itdev: "C", product: "I", lc_crm: "A", lc_retail: "R", lc_training: "I" },
  { task: L("Love Tags, motives and list filters", "Love Tags, alasan, dan filter list"), itdev: "C", product: "I", lc_crm: "A", lc_retail: "R", lc_training: "C" },
  { task: L("User accounts and boutique hierarchy", "Akun user dan hierarki boutique"), itdev: "I", product: "C", lc_crm: "R", lc_retail: "A", lc_training: "I" },
  { task: L("Seller training and rollout", "Training seller dan rollout"), itdev: "C", product: "I", lc_crm: "C", lc_retail: "A", lc_training: "R" },
  { task: L("Adoption follow-up (KPI review)", "Pemantauan adopsi (review KPI)"), itdev: "I", product: "I", lc_crm: "R", lc_retail: "A", lc_training: "C" },
];
