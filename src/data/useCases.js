/*
 * Longchamp Clienteling Mobile App — Use Case model
 * Single source of truth for the use case diagram, the detail panel
 * and the data source matrix.
 *
 * status:
 *   "confirmed" — endpoint / event is listed in Cekat docs (or standard Shopify/Odoo)
 *   "confirm"   — capability exists but exact path/payload must be confirmed with Cekat
 *   "internal"  — designed inside this project (n8n workflow, app-side logic)
 */
const model = {
  meta: {
    title: { en: "Longchamp Clienteling Mobile App", id: "Aplikasi Mobile Clienteling Longchamp" },
    subtitle: {
      en: "Use Case Diagram — v0.1 · Cekat × Longchamp Indonesia",
      id: "Use Case Diagram — v0.1 · Cekat × Longchamp Indonesia"
    },
    version: "0.1",
    date: "2026-11-16"
  },

  actors: [
    {
      id: "sa",
      name: { en: "Sales Associate", id: "Sales Associate" },
      note: { en: "Boutique staff (5 boutiques)", id: "Staf boutique (5 boutique)" }
    },
    {
      id: "sm",
      name: { en: "Store Manager", id: "Store Manager" },
      note: { en: "Inherits all SA use cases", id: "Mewarisi semua use case SA" },
      generalizes: "sa"
    },
    {
      id: "hq",
      name: { en: "CRM / CX Admin", id: "Admin CRM / CX" },
      note: { en: "Longchamp HQ Indonesia", id: "HQ Longchamp Indonesia" }
    }
  ],

  systems: [
    { id: "shopify", name: "Shopify", sub: "Webhook + REST Admin API" },
    { id: "odoo", name: "Odoo POS", sub: "base.automation webhook + REST" },
    { id: "cekatWh", name: "Cekat Webhook", sub: "Devtools → Webhooks" },
    { id: "n8n", name: "n8n", sub: "Orchestration · Scheduler · BFF" },
    { id: "cekatApi", name: "Cekat CRM API", sub: "api.cekat.ai · Contacts · Boards" },
    { id: "cekatChat", name: "Cekat Chat / WABA", sub: "Message · Broadcast · Tickets" },
    { id: "push", name: "Push Service", sub: "FCM / APNs" }
  ],

  modules: [
    { id: "search", col: 0, name: { en: "1 · Customer Search", id: "1 · Customer Search" } },
    { id: "lists", col: 0, name: { en: "2 · Customer Lists", id: "2 · Customer Lists" } },
    { id: "perf", col: 0, name: { en: "5 · Performance & Admin", id: "5 · Performa & Admin" } },
    { id: "actions", col: 1, name: { en: "3 · Actions", id: "3 · Actions" } },
    { id: "catalog", col: 1, name: { en: "4 · Product Catalog", id: "4 · Product Catalog" } }
  ],

  useCases: [
    /* ---------------- 1. CUSTOMER SEARCH ---------------- */
    {
      id: "UC-01", module: "search", actors: ["sa"],
      name: { en: "Search customer", id: "Cari pelanggan" },
      desc: {
        en: "Find a client by phone (E.164), name or email while in the boutique.",
        id: "Cari klien berdasarkan nomor HP (E.164), nama, atau email saat di boutique."
      },
      sources: [
        { sys: "cekatApi", type: "API", dir: "read", ref: "GET /api/contacts?limit=&page=", status: "confirmed" },
        { sys: "cekatApi", type: "API", dir: "read", ref: "Search / filter by phone", status: "confirm",
          note: "Search query param is not listed in the docs. Fallback: query Golden Record board items." }
      ]
    },
    {
      id: "UC-02", module: "search", actors: [],
      name: { en: "View client profile (Golden Record)", id: "Lihat profil klien (Golden Record)" },
      desc: {
        en: "Identity, segment tier, assigned SA, consent (UU PDP), Love Tags and last contact date.",
        id: "Identitas, tier segmen, SA yang ditugaskan, consent (UU PDP), Love Tags, dan tanggal kontak terakhir."
      },
      sources: [
        { sys: "cekatApi", type: "API", dir: "read", ref: "GET /api/crm/boards/{goldenRecordBoardId}/items", status: "confirmed" },
        { sys: "cekatWh", type: "Webhook", dir: "in", ref: "Event: Contact updated → n8n", status: "confirmed",
          note: "Event is listed; payload fields are not documented yet." }
      ]
    },
    {
      id: "UC-03", module: "search", actors: [],
      name: { en: "View purchase history", id: "Lihat riwayat pembelian" },
      desc: {
        en: "Online (Shopify) and offline (Odoo POS) transactions incl. refund/cancel, in IDR.",
        id: "Transaksi online (Shopify) dan offline (Odoo POS) termasuk refund/cancel, dalam IDR."
      },
      sources: [
        { sys: "shopify", type: "Webhook", dir: "in", ref: "orders/create · orders/updated · orders/cancelled · refunds/create", status: "confirmed" },
        { sys: "odoo", type: "Webhook", dir: "in", ref: "base.automation on pos.order (create / refund)", status: "internal" },
        { sys: "n8n", type: "Workflow", dir: "write", ref: "Upsert Transactions board item (idempotency sha256(source+id+event))", status: "internal" },
        { sys: "cekatApi", type: "API", dir: "read", ref: "GET /api/crm/boards/{transactionsBoardId}/items", status: "confirmed" }
      ]
    },
    {
      id: "UC-04", module: "search", actors: [],
      name: { en: "Add Love Tags & comments", id: "Tambah Love Tags & komentar" },
      desc: {
        en: "Qualitative data: favourite lines, materials, colours, style, event feedback. No sensitive data (health, religion, politics, minors).",
        id: "Data kualitatif: lini favorit, material, warna, gaya, feedback event. Tanpa data sensitif (kesehatan, agama, politik, anak di bawah umur)."
      },
      sources: [
        { sys: "cekatApi", type: "API", dir: "write", ref: "Update Golden Record item (Love Tags, comment)", status: "confirm",
          note: "Write endpoint for board items to be confirmed with Cekat." }
      ]
    },
    {
      id: "UC-05", module: "search", actors: ["sa"],
      name: { en: "Register new client", id: "Daftarkan klien baru" },
      desc: {
        en: "Capture a new client with consent_wa / consent_email; phone-first dedupe against the Golden Record.",
        id: "Input klien baru dengan consent_wa / consent_email; dedupe berbasis nomor HP terhadap Golden Record."
      },
      sources: [
        { sys: "n8n", type: "Workflow", dir: "write", ref: "Identity waterfall: phone → email → create", status: "internal" },
        { sys: "cekatApi", type: "API", dir: "write", ref: "Create contact", status: "confirm",
          note: "Contacts API lists create/update; exact path to confirm." }
      ]
    },

    /* ---------------- 2. CUSTOMER LISTS ---------------- */
    {
      id: "UC-06", module: "lists", actors: ["sa"],
      name: { en: "Build dynamic list", id: "Buat dynamic list" },
      desc: {
        en: "Filters: segment tier, assigned SA, wishlist sent, reach-out reason, product category, promoter, geographic area.",
        id: "Filter: tier segmen, SA yang ditugaskan, wishlist terkirim, alasan reach-out, kategori produk, promoter, area geografis."
      },
      sources: [
        { sys: "cekatApi", type: "API", dir: "read", ref: "GET /api/crm/boards/{goldenRecordBoardId}/items", status: "confirmed" },
        { sys: "n8n", type: "Workflow", dir: "read", ref: "Server-side filtering in BFF if API has no filter params", status: "internal" }
      ]
    },
    {
      id: "UC-07", module: "lists", actors: ["sa"],
      name: { en: "Upcoming birthdays list", id: "List ulang tahun mendatang" },
      desc: {
        en: "Pre-set dynamic list: clients with a birthday in the next 30 days.",
        id: "Dynamic list siap pakai: klien yang berulang tahun dalam 30 hari ke depan."
      },
      sources: [
        { sys: "cekatApi", type: "API", dir: "read", ref: "Golden Record items filtered by birth_date", status: "confirmed" }
      ]
    },
    {
      id: "UC-08", module: "lists", actors: ["sa"],
      name: { en: "Manage Client Book", id: "Kelola Client Book" },
      desc: {
        en: "Manual list of the SA's own clients; welcome & follow up new clients.",
        id: "List manual klien milik SA; welcome & follow-up klien baru."
      },
      sources: [
        { sys: "cekatApi", type: "API", dir: "read", ref: "GET /api/crm/boards/{clientBookBoardId}/items", status: "confirmed" },
        { sys: "cekatApi", type: "API", dir: "write", ref: "Add / remove Client Book item", status: "confirm" }
      ]
    },
    {
      id: "UC-09", module: "lists", actors: ["sa", "sm"],
      name: { en: "Event guest list & participation", id: "Guest list event & kehadiran" },
      desc: {
        en: "Plan an event, invite clients and track RSVP / attendance.",
        id: "Rencanakan event, undang klien, dan pantau RSVP / kehadiran."
      },
      sources: [
        { sys: "cekatApi", type: "API", dir: "read", ref: "Events board items", status: "confirmed" },
        { sys: "cekatChat", type: "API", dir: "write", ref: "Broadcast campaign (WA template invitation)", status: "confirm",
          note: "\"API Create Broadcast Campaign\" exists in docs; path & recipient-level tracking to confirm." }
      ]
    },

    /* ---------------- 3. ACTIONS ---------------- */
    {
      id: "UC-10", module: "actions", actors: ["sa"],
      name: { en: "Receive clienteling push", id: "Terima clienteling push" },
      desc: {
        en: "VIP Birthday, VIP Downgrade, High Value Upgrade, Beginner+ Upgrade — becomes a task in the SA's Agenda.",
        id: "VIP Birthday, VIP Downgrade, High Value Upgrade, Beginner+ Upgrade — menjadi task di Agenda SA."
      },
      sources: [
        { sys: "n8n", type: "Scheduler", dir: "out", ref: "Daily cron: birthdays · tier change from order webhooks (refund/cancel can downgrade)", status: "internal" },
        { sys: "cekatApi", type: "API", dir: "write", ref: "Create Task item for assigned SA", status: "confirm" },
        { sys: "push", type: "Push", dir: "out", ref: "Mobile push notification to SA device", status: "internal" }
      ]
    },
    {
      id: "UC-11", module: "actions", actors: ["sa"],
      name: { en: "Reach out to client", id: "Reach out ke klien" },
      desc: {
        en: "Only clients not contacted in the last 30 days. Channel: WhatsApp (Cekat) or phone call (native dialer).",
        id: "Hanya klien yang belum dihubungi 30 hari terakhir. Channel: WhatsApp (Cekat) atau telepon (dialer bawaan HP)."
      },
      sources: [
        { sys: "cekatApi", type: "API", dir: "read", ref: "last_contacted_at on Golden Record", status: "confirmed" },
        { sys: "cekatChat", type: "API", dir: "write", ref: "Send message / template message to inbox_id", status: "confirm",
          note: "inbox_id from GET /api/inboxes (confirmed). Send path to confirm." },
        { sys: "cekatWh", type: "Webhook", dir: "in", ref: "Message Sent · Message Received → n8n updates last_contacted_at", status: "confirmed" }
      ]
    },
    {
      id: "UC-12", module: "actions", actors: [],
      name: { en: "Log reach-out reason & channel", id: "Catat alasan & channel reach-out" },
      desc: {
        en: "After contacting: select the reason and channel, then validate. Feeds KPI and attribution.",
        id: "Setelah menghubungi: pilih alasan dan channel, lalu validasi. Jadi sumber KPI dan atribusi."
      },
      sources: [
        { sys: "cekatApi", type: "API", dir: "write", ref: "Create Reach Out item (contact_id, sa_id, reason, channel, at)", status: "confirm" }
      ]
    },
    {
      id: "UC-13", module: "actions", actors: [],
      name: { en: "Use Template Library", id: "Pakai Template Library" },
      desc: {
        en: "Starting-point messages per key moment; personalise before sending. WA outside 24h needs a Meta-approved template.",
        id: "Template pesan per momen penting; dipersonalisasi sebelum dikirim. WA di luar 24 jam wajib template yang di-approve Meta."
      },
      sources: [
        { sys: "cekatChat", type: "API", dir: "read", ref: "WhatsApp templates (Meta-approved)", status: "confirm" },
        { sys: "cekatApi", type: "API", dir: "read", ref: "Templates board (free-text templates)", status: "confirmed" }
      ]
    },
    {
      id: "UC-14", module: "actions", actors: ["sa"],
      name: { en: "Manage Agenda", id: "Kelola Agenda" },
      desc: {
        en: "Tasks (call, follow-up) and appointments (one-to-one, personalisation, fitting).",
        id: "Task (telepon, follow-up) dan appointment (one-to-one, personalisasi, fitting)."
      },
      sources: [
        { sys: "cekatApi", type: "API", dir: "read", ref: "Agenda board items (Calendar view)", status: "confirmed" },
        { sys: "cekatApi", type: "API", dir: "write", ref: "Create / update task & appointment", status: "confirm" }
      ]
    },

    /* ---------------- 4. PRODUCT CATALOG ---------------- */
    {
      id: "UC-15", module: "catalog", actors: ["sa"],
      name: { en: "Browse product catalog", id: "Lihat katalog produk" },
      desc: {
        en: "Product presentation with images, price (IDR) and variants.",
        id: "Presentasi produk dengan gambar, harga (IDR), dan varian."
      },
      sources: [
        { sys: "shopify", type: "API", dir: "read", ref: "REST Admin GET /products.json", status: "confirmed" },
        { sys: "shopify", type: "Webhook", dir: "in", ref: "products/update → n8n refreshes cache", status: "confirmed" }
      ]
    },
    {
      id: "UC-16", module: "catalog", actors: [],
      name: { en: "Check stock per boutique", id: "Cek stok per boutique" },
      desc: {
        en: "Real-time stock by location. Queried on demand, not via webhook.",
        id: "Stok real-time per lokasi. Diambil saat dibutuhkan, bukan via webhook."
      },
      sources: [
        { sys: "odoo", type: "API", dir: "read", ref: "REST stock.quant by location", status: "internal" }
      ]
    },
    {
      id: "UC-17", module: "catalog", actors: [],
      name: { en: "Create & send wishlist", id: "Buat & kirim wishlist" },
      desc: {
        en: "Pick products for a client and send them via WhatsApp; tracked for conversion.",
        id: "Pilih produk untuk klien lalu kirim via WhatsApp; dilacak konversinya."
      },
      sources: [
        { sys: "cekatApi", type: "API", dir: "write", ref: "Create Wishlist item", status: "confirm" },
        { sys: "cekatChat", type: "API", dir: "write", ref: "Send WA message with product links", status: "confirm" }
      ]
    },
    {
      id: "UC-18", module: "catalog", actors: ["sa"],
      name: { en: "Create service ticket", id: "Buat tiket servis" },
      desc: {
        en: "After-sales / repair / personalisation request linked to the client.",
        id: "Permintaan after-sales / perbaikan / personalisasi yang terhubung ke klien."
      },
      sources: [
        { sys: "cekatChat", type: "API", dir: "write", ref: "Tickets API — create ticket", status: "confirm" }
      ]
    },

    /* ---------------- 5. PERFORMANCE & ADMIN ---------------- */
    {
      id: "UC-19", module: "perf", actors: ["sa", "sm", "hq"],
      name: { en: "View performance KPI", id: "Lihat KPI performa" },
      desc: {
        en: "Actions, actions/POS/day, conversion rate, sales, avg conversion days — by channel and reason, at country / POS / SA level.",
        id: "Actions, actions/POS/hari, conversion rate, sales, rata-rata hari konversi — per channel dan alasan, level negara / POS / SA."
      },
      sources: [
        { sys: "n8n", type: "Scheduler", dir: "write", ref: "Aggregate Reach Out + Transactions (30-day attribution) → KPI board", status: "internal" },
        { sys: "cekatApi", type: "API", dir: "read", ref: "GET /api/crm/boards/{kpiBoardId}/items", status: "confirmed" }
      ]
    },
    {
      id: "UC-20", module: "perf", actors: ["hq"],
      name: { en: "Manage templates & push rules", id: "Kelola template & aturan push" },
      desc: {
        en: "Maintain the Template Library and the localised clienteling push rules.",
        id: "Kelola Template Library dan aturan clienteling push yang dilokalkan."
      },
      sources: [
        { sys: "cekatApi", type: "API", dir: "write", ref: "Templates / Push Rules boards", status: "confirm" },
        { sys: "n8n", type: "Workflow", dir: "read", ref: "Push scheduler reads active rules", status: "internal" }
      ]
    }
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
    { from: "UC-17", to: "UC-15", type: "extend" }
  ],

  notes: [
    {
      en: "The mobile app never holds the Cekat api_key. It calls a thin BFF (n8n webhook endpoints or a small backend) that holds the key and enforces SA/boutique scoping.",
      id: "Aplikasi mobile tidak menyimpan api_key Cekat. App memanggil BFF tipis (endpoint webhook n8n atau backend kecil) yang memegang key dan membatasi data per SA/boutique."
    },
    {
      en: "Auth header differs between doc sites: docs.cekat.ai uses an `api_key` header, the developer docs show `Authorization: Bearer`. Confirm with Cekat.",
      id: "Header auth berbeda antar situs docs: docs.cekat.ai pakai header `api_key`, developer docs pakai `Authorization: Bearer`. Konfirmasi ke Cekat."
    },
    {
      en: "Write endpoints for contacts and board items, the send-message path, and webhook payload fields are not in the public docs yet — marked \"to confirm\".",
      id: "Endpoint write untuk contacts dan board items, path kirim pesan, dan field payload webhook belum ada di docs publik — ditandai \"to confirm\"."
    },
    {
      en: "Odoo stock and Shopify catalog are read on demand (REST), because they are live data and not triggered by an event.",
      id: "Stok Odoo dan katalog Shopify dibaca saat dibutuhkan (REST), karena data live dan tidak dipicu event."
    },
    {
      en: "Anonymous offline transactions without a phone number cannot be attributed — KPI conversion is understated.",
      id: "Transaksi offline anonim tanpa nomor HP tidak bisa diatribusikan — konversi KPI jadi lebih rendah dari aktual."
    }
  ]
};
export default model;
