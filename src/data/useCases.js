/*
 * Longchamp Clienteling Mobile App — Use Case model
 * Single source of truth for the use case diagram, detail panel,
 * data source matrix and RBAC matrix.
 *
 * source.status:  available | internal | product   (see src/data/cekatProduct.js)
 * source.verify:  true → section exists in the Cekat API docs, exact path/payload to verify
 * source.cp:      Cekat Product backlog id when status = product
 *
 * rbac scope per role:  own | boutique | all | use | manage | none
 */
const model = {
  meta: {
    title: { en: "Longchamp Clienteling Mobile App", id: "Aplikasi Mobile Clienteling Longchamp" },
    version: "0.2",
    date: "2026-11-16",
  },

  actors: [
    {
      id: "sa",
      name: { en: "Sales Associate", id: "Sales Associate" },
      note: { en: "Boutique staff (5 boutiques)", id: "Staf boutique (5 boutique)" },
    },
    {
      id: "sm",
      name: { en: "Store Manager", id: "Store Manager" },
      note: { en: "Inherits all SA use cases", id: "Mewarisi semua use case SA" },
      generalizes: "sa",
    },
    {
      id: "hq",
      name: { en: "CRM / CX Admin", id: "Admin CRM / CX" },
      note: { en: "Longchamp HQ Indonesia", id: "HQ Longchamp Indonesia" },
    },
  ],

  /* RBAC roles, mapped onto Cekat CRM Role Hierarchy + authority */
  roles: [
    {
      id: "sa",
      name: { en: "Sales Associate", id: "Sales Associate" },
      cekatRole: "SA – {Boutique}",
      reportsTo: "SM – {Boutique}",
      authority: "Basic User",
      peers: false,
      scope: {
        en: "Own assigned clients + unassigned clients of the boutique",
        id: "Klien yang di-assign ke dirinya + klien boutique tanpa assignee",
      },
    },
    {
      id: "sm",
      name: { en: "Store Manager", id: "Store Manager" },
      cekatRole: "SM – {Boutique}",
      reportsTo: "CX Admin",
      authority: "Basic User",
      peers: false,
      scope: {
        en: "All clients of the SAs in their boutique (subordinates)",
        id: "Semua klien milik SA di boutique-nya (bawahan)",
      },
    },
    {
      id: "hq",
      name: { en: "CRM / CX Admin", id: "Admin CRM / CX" },
      cekatRole: "CX Admin",
      reportsTo: "—",
      authority: "Administrator",
      peers: true,
      scope: { en: "All boutiques, all clients", id: "Semua boutique, semua klien" },
    },
  ],

  systems: [
    { id: "shopify", name: "Shopify", sub: "Webhook + REST Admin API", owner: "external" },
    { id: "odoo", name: "Odoo POS", sub: "base.automation webhook + REST", owner: "external" },
    { id: "cekatWh", name: "Cekat Webhook", sub: "Devtools → Webhooks", owner: "itdev" },
    { id: "n8n", name: "n8n + BFF", sub: "Orchestration · Scheduler · Proxy", owner: "itdev" },
    { id: "cekatApi", name: "Cekat CRM API", sub: "Contact · Board (docs)", owner: "itdev" },
    { id: "cekatChat", name: "Cekat Chat API", sub: "Message · Broadcast · Tickets", owner: "itdev" },
    { id: "cekatNew", name: "Cekat Product (new)", sub: "Login · RBAC · CP-01 … CP-06", owner: "product" },
    { id: "push", name: "Push Service", sub: "FCM / APNs", owner: "itdev" },
  ],

  modules: [
    { id: "search", col: 0, name: { en: "1 · Customer Search", id: "1 · Customer Search" } },
    { id: "lists", col: 0, name: { en: "2 · Customer Lists", id: "2 · Customer Lists" } },
    { id: "perf", col: 0, name: { en: "5 · Performance & Admin", id: "5 · Performa & Admin" } },
    { id: "actions", col: 1, name: { en: "3 · Actions", id: "3 · Actions" } },
    { id: "catalog", col: 1, name: { en: "4 · Product Catalog", id: "4 · Product Catalog" } },
    { id: "access", col: 1, name: { en: "6 · Access & RBAC", id: "6 · Akses & RBAC" } },
  ],

  useCases: [
    /* ---------------- 1. CUSTOMER SEARCH ---------------- */
    {
      id: "UC-01", module: "search", actors: ["sa"],
      name: { en: "Search customer", id: "Cari pelanggan" },
      desc: {
        en: "Find a client by phone (E.164), name or email. Results are limited to the user's RBAC scope.",
        id: "Cari klien berdasarkan nomor HP (E.164), nama, atau email. Hasil dibatasi sesuai scope RBAC user.",
      },
      rbac: { sa: "own", sm: "boutique", hq: "all" },
      sources: [
        { sys: "cekatApi", type: "API", dir: "read", ref: "GET /api/contacts?limit=&page=", status: "available" },
        { sys: "cekatNew", type: "API", dir: "read", ref: "RBAC check on contacts query (user token)", status: "product", cp: "CP-02" },
      ],
    },
    {
      id: "UC-02", module: "search", actors: [],
      name: { en: "View client profile (Golden Record)", id: "Lihat profil klien (Golden Record)" },
      desc: {
        en: "Identity, segment tier, assigned SA, consent (UU PDP), Love Tags and last contact date.",
        id: "Identitas, tier segmen, SA yang ditugaskan, consent (UU PDP), Love Tags, dan tanggal kontak terakhir.",
      },
      rbac: { sa: "own", sm: "boutique", hq: "all" },
      sources: [
        { sys: "cekatApi", type: "API", dir: "read", ref: "GET /api/contacts (Golden Record fields)", status: "available" },
        { sys: "cekatWh", type: "Webhook", dir: "in", ref: "Event: Contact updated → n8n", status: "available",
          note: "Event is listed; payload fields are not documented yet.", verify: true },
      ],
    },
    {
      id: "UC-03", module: "search", actors: [],
      name: { en: "View purchase history", id: "Lihat riwayat pembelian" },
      desc: {
        en: "Online (Shopify) and offline (Odoo POS) transactions incl. refund/cancel, in IDR.",
        id: "Transaksi online (Shopify) dan offline (Odoo POS) termasuk refund/cancel, dalam IDR.",
      },
      rbac: { sa: "own", sm: "boutique", hq: "all" },
      sources: [
        { sys: "shopify", type: "Webhook", dir: "in", ref: "orders/create · orders/updated · orders/cancelled · refunds/create", status: "available" },
        { sys: "odoo", type: "Webhook", dir: "in", ref: "base.automation on pos.order (create / refund)", status: "internal" },
        { sys: "n8n", type: "Workflow", dir: "write", ref: "Upsert Transactions item (idempotency sha256(source+id+event))", status: "internal" },
        { sys: "cekatApi", type: "API", dir: "read", ref: "GET /api/crm/boards/{transactionsBoardId}/items", status: "available" },
      ],
    },
    {
      id: "UC-04", module: "search", actors: [],
      name: { en: "Add Love Tags & comments", id: "Tambah Love Tags & komentar" },
      desc: {
        en: "Qualitative data: favourite lines, materials, colours, style, event feedback. No sensitive data (health, religion, politics, minors).",
        id: "Data kualitatif: lini favorit, material, warna, gaya, feedback event. Tanpa data sensitif (kesehatan, agama, politik, anak di bawah umur).",
      },
      rbac: { sa: "own", sm: "boutique", hq: "all" },
      sources: [
        { sys: "cekatApi", type: "API", dir: "write", ref: "Contact API — update Golden Record fields + Love Tags board", status: "available", verify: true },
      ],
    },
    {
      id: "UC-05", module: "search", actors: ["sa"],
      name: { en: "Register new client", id: "Daftarkan klien baru" },
      desc: {
        en: "Capture a new client with consent_wa / consent_email; phone-first dedupe; auto-assigned to the registering SA.",
        id: "Input klien baru dengan consent_wa / consent_email; dedupe berbasis nomor HP; otomatis di-assign ke SA yang mendaftarkan.",
      },
      rbac: { sa: "own", sm: "boutique", hq: "all" },
      sources: [
        { sys: "n8n", type: "Workflow", dir: "write", ref: "Identity waterfall: phone → email → create", status: "internal" },
        { sys: "cekatApi", type: "API", dir: "write", ref: "Contact API — create contact + assignee", status: "available", verify: true },
      ],
    },

    /* ---------------- 2. CUSTOMER LISTS ---------------- */
    {
      id: "UC-06", module: "lists", actors: ["sa"],
      name: { en: "Build dynamic list", id: "Buat dynamic list" },
      desc: {
        en: "Filters: segment tier, assigned SA, wishlist sent, reach-out reason, product category, promoter, geographic area.",
        id: "Filter: tier segmen, SA yang ditugaskan, wishlist terkirim, alasan reach-out, kategori produk, promoter, area geografis.",
      },
      rbac: { sa: "own", sm: "boutique", hq: "all" },
      sources: [
        { sys: "cekatApi", type: "API", dir: "read", ref: "GET /api/contacts (Golden Record fields)", status: "available" },
        { sys: "n8n", type: "Workflow", dir: "read", ref: "Interim: filter in BFF after paging items", status: "internal" },
        { sys: "cekatNew", type: "API", dir: "read", ref: "Server-side filter & search on items", status: "product", cp: "CP-04" },
      ],
    },
    {
      id: "UC-07", module: "lists", actors: ["sa"],
      name: { en: "Upcoming birthdays list", id: "List ulang tahun mendatang" },
      desc: {
        en: "Pre-set dynamic list: clients with a birthday in the next 30 days.",
        id: "Dynamic list siap pakai: klien yang berulang tahun dalam 30 hari ke depan.",
      },
      rbac: { sa: "own", sm: "boutique", hq: "all" },
      sources: [
        { sys: "cekatApi", type: "API", dir: "read", ref: "Contacts, filter birthdate", status: "available" },
        { sys: "cekatNew", type: "API", dir: "read", ref: "Date-range filter (birthday window)", status: "product", cp: "CP-04" },
      ],
    },
    {
      id: "UC-08", module: "lists", actors: ["sa"],
      name: { en: "Manage Client Book", id: "Kelola Client Book" },
      desc: {
        en: "Manual list of the SA's own clients; welcome & follow up new clients.",
        id: "List manual klien milik SA; welcome & follow-up klien baru.",
      },
      rbac: { sa: "own", sm: "boutique", hq: "none" },
      sources: [
        { sys: "cekatApi", type: "API", dir: "read", ref: "GET /api/crm/boards/{clientBookBoardId}/items", status: "available" },
        { sys: "cekatApi", type: "API", dir: "write", ref: "Board API — add / remove item", status: "available", verify: true },
      ],
    },
    {
      id: "UC-09", module: "lists", actors: ["sa", "sm"],
      name: { en: "Event guest list & participation", id: "Guest list event & kehadiran" },
      desc: {
        en: "Plan an event, invite clients and track RSVP / attendance. SM creates the event, SA adds own clients.",
        id: "Rencanakan event, undang klien, dan pantau RSVP / kehadiran. SM membuat event, SA menambahkan kliennya.",
      },
      rbac: { sa: "own", sm: "boutique", hq: "all" },
      sources: [
        { sys: "cekatApi", type: "API", dir: "read", ref: "Events board items", status: "available" },
        { sys: "cekatChat", type: "API", dir: "write", ref: "Broadcast API — WA template invitation", status: "available", verify: true },
        { sys: "cekatNew", type: "Webhook", dir: "in", ref: "Recipient-level delivery / read status", status: "product", cp: "CP-06" },
      ],
    },

    /* ---------------- 3. ACTIONS ---------------- */
    {
      id: "UC-10", module: "actions", actors: ["sa"],
      name: { en: "Receive clienteling push", id: "Terima clienteling push" },
      desc: {
        en: "VIP Birthday, VIP Downgrade, High Value Upgrade, Beginner+ Upgrade — becomes a task in the assigned SA's Agenda.",
        id: "VIP Birthday, VIP Downgrade, High Value Upgrade, Beginner+ Upgrade — menjadi task di Agenda SA yang ditugaskan.",
      },
      rbac: { sa: "own", sm: "boutique", hq: "all" },
      sources: [
        { sys: "n8n", type: "Scheduler", dir: "out", ref: "Daily cron (birthdays) · tier change from order webhooks (refund/cancel can downgrade)", status: "internal" },
        { sys: "cekatApi", type: "API", dir: "write", ref: "Board API — create Task item for assigned SA", status: "available", verify: true },
        { sys: "push", type: "Push", dir: "out", ref: "FCM / APNs push to SA device", status: "internal" },
      ],
    },
    {
      id: "UC-11", module: "actions", actors: ["sa"],
      name: { en: "Reach out to client", id: "Reach out ke klien" },
      desc: {
        en: "Only clients not contacted in the last 30 days. Channel: WhatsApp (Cekat) or phone call (native dialer).",
        id: "Hanya klien yang belum dihubungi 30 hari terakhir. Channel: WhatsApp (Cekat) atau telepon (dialer bawaan HP).",
      },
      rbac: { sa: "own", sm: "boutique", hq: "none" },
      sources: [
        { sys: "cekatApi", type: "API", dir: "read", ref: "last_reach_out_at on contact (Golden Record)", status: "available" },
        { sys: "cekatChat", type: "API", dir: "write", ref: "Message API — send session / template message to inbox_id", status: "available", verify: true,
          note: "inbox_id from GET /api/inboxes." },
        { sys: "cekatWh", type: "Webhook", dir: "in", ref: "Message Sent · Message Received → n8n updates last_reach_out_at", status: "available" },
      ],
    },
    {
      id: "UC-12", module: "actions", actors: [],
      name: { en: "Log reach-out reason & channel", id: "Catat alasan & channel reach-out" },
      desc: {
        en: "After contacting: select the reason and channel, then validate. Feeds KPI and attribution.",
        id: "Setelah menghubungi: pilih alasan dan channel, lalu validasi. Jadi sumber KPI dan atribusi.",
      },
      rbac: { sa: "own", sm: "boutique", hq: "none" },
      sources: [
        { sys: "cekatApi", type: "API", dir: "write", ref: "Board API — create Reach Out item (contact_id, sa_id, reason, channel, at)", status: "available", verify: true },
      ],
    },
    {
      id: "UC-13", module: "actions", actors: [],
      name: { en: "Use Template Library", id: "Pakai Template Library" },
      desc: {
        en: "Starting-point messages per key moment; personalise before sending. WA outside 24h needs a Meta-approved template.",
        id: "Template pesan per momen penting; dipersonalisasi sebelum dikirim. WA di luar 24 jam wajib template yang di-approve Meta.",
      },
      rbac: { sa: "use", sm: "use", hq: "manage" },
      sources: [
        { sys: "cekatChat", type: "API", dir: "read", ref: "Broadcast API — WhatsApp templates (Meta-approved)", status: "available", verify: true },
        { sys: "cekatApi", type: "API", dir: "read", ref: "Templates board (free-text templates)", status: "available" },
      ],
    },
    {
      id: "UC-14", module: "actions", actors: ["sa"],
      name: { en: "Manage Agenda", id: "Kelola Agenda" },
      desc: {
        en: "Tasks (call, follow-up) and appointments (one-to-one, personalisation, fitting).",
        id: "Task (telepon, follow-up) dan appointment (one-to-one, personalisasi, fitting).",
      },
      rbac: { sa: "own", sm: "boutique", hq: "all" },
      sources: [
        { sys: "cekatApi", type: "API", dir: "read", ref: "Agenda board items (Calendar view)", status: "available" },
        { sys: "cekatApi", type: "API", dir: "write", ref: "Board API — create / update task & appointment", status: "available", verify: true },
        { sys: "cekatNew", type: "Webhook", dir: "in", ref: "Board item created / updated (tasks set in Cekat UI)", status: "product", cp: "CP-05" },
      ],
    },

    /* ---------------- 4. PRODUCT CATALOG ---------------- */
    {
      id: "UC-15", module: "catalog", actors: ["sa"],
      name: { en: "Browse product catalog", id: "Lihat katalog produk" },
      desc: {
        en: "Product presentation with images, price (IDR) and variants.",
        id: "Presentasi produk dengan gambar, harga (IDR), dan varian.",
      },
      rbac: { sa: "use", sm: "use", hq: "use" },
      sources: [
        { sys: "shopify", type: "API", dir: "read", ref: "REST Admin GET /products.json", status: "available" },
        { sys: "shopify", type: "Webhook", dir: "in", ref: "products/update → n8n refreshes cache", status: "available" },
      ],
    },
    {
      id: "UC-16", module: "catalog", actors: [],
      name: { en: "Check stock per boutique", id: "Cek stok per boutique" },
      desc: {
        en: "Real-time stock by location. Queried on demand, not via webhook.",
        id: "Stok real-time per lokasi. Diambil saat dibutuhkan, bukan via webhook.",
      },
      rbac: { sa: "use", sm: "use", hq: "use" },
      sources: [
        { sys: "odoo", type: "API", dir: "read", ref: "REST stock.quant by location", status: "internal" },
      ],
    },
    {
      id: "UC-17", module: "catalog", actors: [],
      name: { en: "Create & send wishlist", id: "Buat & kirim wishlist" },
      desc: {
        en: "Pick products for a client and send them via WhatsApp; tracked for conversion.",
        id: "Pilih produk untuk klien lalu kirim via WhatsApp; dilacak konversinya.",
      },
      rbac: { sa: "own", sm: "boutique", hq: "none" },
      sources: [
        { sys: "cekatApi", type: "API", dir: "write", ref: "Board API — create Wishlist item", status: "available", verify: true },
        { sys: "cekatChat", type: "API", dir: "write", ref: "Message API — send WA with product links", status: "available", verify: true },
        { sys: "cekatNew", type: "Webhook", dir: "in", ref: "Recipient-level delivery / read status", status: "product", cp: "CP-06" },
      ],
    },
    {
      id: "UC-18", module: "catalog", actors: ["sa"],
      name: { en: "Create service ticket", id: "Buat tiket servis" },
      desc: {
        en: "After-sales / repair / personalisation request linked to the client.",
        id: "Permintaan after-sales / perbaikan / personalisasi yang terhubung ke klien.",
      },
      rbac: { sa: "own", sm: "boutique", hq: "all" },
      sources: [
        { sys: "cekatChat", type: "API", dir: "write", ref: "Tickets API — create ticket", status: "available", verify: true },
      ],
    },

    /* ---------------- 5. PERFORMANCE & ADMIN ---------------- */
    {
      id: "UC-19", module: "perf", actors: ["sa", "sm", "hq"],
      name: { en: "View performance KPI", id: "Lihat KPI performa" },
      desc: {
        en: "Actions, actions/POS/day, conversion rate, sales, avg conversion days — by channel and reason. SA sees own, SM boutique, Admin country.",
        id: "Actions, actions/POS/hari, conversion rate, sales, rata-rata hari konversi — per channel dan alasan. SA lihat miliknya, SM boutique, Admin negara.",
      },
      rbac: { sa: "own", sm: "boutique", hq: "all" },
      sources: [
        { sys: "n8n", type: "Scheduler", dir: "write", ref: "Aggregate Reach Out + Transactions (30-day attribution) → KPI board", status: "internal" },
        { sys: "cekatApi", type: "API", dir: "read", ref: "GET /api/crm/boards/{kpiBoardId}/items", status: "available" },
      ],
    },
    {
      id: "UC-20", module: "perf", actors: ["hq"],
      name: { en: "Manage templates & push rules", id: "Kelola template & aturan push" },
      desc: {
        en: "Maintain the Template Library and the localised clienteling push rules.",
        id: "Kelola Template Library dan aturan clienteling push yang dilokalkan.",
      },
      rbac: { sa: "none", sm: "none", hq: "manage" },
      sources: [
        { sys: "cekatApi", type: "API", dir: "write", ref: "Board API — Templates / Push Rules boards", status: "available", verify: true },
        { sys: "n8n", type: "Workflow", dir: "read", ref: "Push scheduler reads active rules", status: "internal" },
      ],
    },

    /* ---------------- 6. ACCESS & RBAC ---------------- */
    {
      id: "UC-21", module: "access", actors: ["sa", "hq"],
      name: { en: "Sign in & resolve role", id: "Login & tentukan role" },
      desc: {
        en: "Sign in with the Cekat CRM account; Cekat returns the user token, role (SA / SM / Admin), boutique and data scope. Built by Cekat Product.",
        id: "Login dengan akun Cekat CRM; Cekat mengembalikan token user, role (SA / SM / Admin), boutique, dan scope data. Dibangun Cekat Product.",
      },
      rbac: { sa: "use", sm: "use", hq: "use" },
      sources: [
        { sys: "cekatNew", type: "API", dir: "read", ref: "Third-party app sign-in / per-user token", status: "product", cp: "CP-01" },
        { sys: "cekatNew", type: "API", dir: "read", ref: "Users & Role Hierarchy API (role, reports-to, authority)", status: "product", cp: "CP-03" },
      ],
    },
    {
      id: "UC-22", module: "access", actors: ["sm", "hq"],
      name: { en: "Manage roles & client assignment", id: "Kelola role & assignment klien" },
      desc: {
        en: "Admin maintains users and the Role Hierarchy in Cekat; SM reassigns clients between SAs of the boutique.",
        id: "Admin mengelola user dan Role Hierarchy di Cekat; SM memindahkan klien antar SA di boutique-nya.",
      },
      rbac: { sa: "none", sm: "boutique", hq: "manage" },
      sources: [
        { sys: "cekatNew", type: "API", dir: "write", ref: "Update Contact Owner with RBAC check (403 outside boutique)", status: "product", cp: "CP-02" },
        { sys: "cekatNew", type: "API", dir: "read", ref: "Users & Role Hierarchy API", status: "product", cp: "CP-03" },
        { sys: "cekatWh", type: "Webhook", dir: "in", ref: "Contact updated (owner changed) → n8n notifies new SA", status: "available", verify: true },
      ],
    },
  ],

  /* include: base → included   |   extend: extension → base */
  relations: [
    { from: "UC-01", to: "UC-02", type: "include" },
    { from: "UC-02", to: "UC-03", type: "include" },
    { from: "UC-04", to: "UC-02", type: "extend" },
    { from: "UC-07", to: "UC-06", type: "include" },
    { from: "UC-11", to: "UC-12", type: "include" },
    { from: "UC-13", to: "UC-11", type: "extend" },
    { from: "UC-16", to: "UC-15", type: "extend" },
    { from: "UC-17", to: "UC-15", type: "extend" },
  ],

  notes: [
    {
      en: "Two implementors on the Cekat side: IT Dev builds with what is in the Cekat API docs (plus n8n, BFF and the mobile app); Cekat Product builds what is not in the docs (CP-01 … CP-06).",
      id: "Dua implementor di sisi Cekat: IT Dev membangun dengan yang ada di dokumentasi API Cekat (plus n8n, BFF, dan aplikasi mobile); Cekat Product membangun yang belum ada di docs (CP-01 … CP-06).",
    },
    {
      en: "Login, users and RBAC are owned by Cekat Product (CP-01, CP-02, CP-03), based on the Cekat CRM Role Hierarchy (SA reports to SM reports to CX Admin, peer sharing off for SA). IT Dev does not build any auth or scope filtering — the BFF only forwards the user token.",
      id: "Login, user, dan RBAC dimiliki Cekat Product (CP-01, CP-02, CP-03), berbasis Role Hierarchy Cekat CRM (SA lapor ke SM lapor ke CX Admin, peer sharing mati untuk SA). IT Dev tidak membangun auth maupun filter scope — BFF hanya meneruskan token user."
    },
    {
      en: "The mobile app never holds the Cekat api_key. User requests go through the BFF with the Cekat user token; only n8n uses the workspace api_key for system jobs.",
      id: "Aplikasi mobile tidak menyimpan api_key Cekat. Request user lewat BFF dengan token user Cekat; hanya n8n yang memakai api_key workspace untuk job sistem.",
    },
    {
      en: "\"Verify path\" = the API section exists in the docs, but the exact endpoint / payload must be checked by IT Dev. Auth header also differs between doc sites (`api_key` vs `Authorization: Bearer`).",
      id: "\"Verify path\" = section API-nya ada di docs, tapi endpoint / payload persisnya perlu dicek IT Dev. Header auth juga berbeda antar situs docs (`api_key` vs `Authorization: Bearer`).",
    },
    {
      en: "Odoo stock and Shopify catalog are read on demand (REST), because they are live data and not triggered by an event.",
      id: "Stok Odoo dan katalog Shopify dibaca saat dibutuhkan (REST), karena data live dan tidak dipicu event.",
    },
    {
      en: "Anonymous offline transactions without a phone number cannot be attributed — KPI conversion is understated.",
      id: "Transaksi offline anonim tanpa nomor HP tidak bisa diatribusikan — konversi KPI jadi lebih rendah dari aktual.",
    },
  ],
};

export default model;
