/*
 * Sequence diagrams with variable-level payloads.
 * Field names match src/data/erd.js.
 *
 * message: M(from, to, kind, label, ref, payload, opts)
 *   kind:  sync | async | reply | self
 *   opts:  { cp, verify, note }
 * fragment: { type: "alt" | "opt" | "loop", from, to, label, branches: [{ at, label }] }
 *   from / to are message indexes (0-based, inclusive).
 */
const L = (en, id = en) => ({ en, id });
const M = (from, to, kind, label, ref = "", payload = null, opts = {}) => ({ from, to, kind, label, ref, payload, ...opts });

export const PARTICIPANTS = {
  user: { name: L("Actor", "Aktor"), sub: "Agent · Supervisor", owner: "user" },
  app: { name: L("Mobile App", "Aplikasi Mobile"), sub: "HeroUI", owner: "itdev" },
  bff: { name: L("Backend API"), sub: "BFF · proxy", owner: "itdev" },
  n8n: { name: L("n8n"), sub: "workflows", owner: "itdev" },
  crm: { name: L("Cekat CRM API"), sub: "Contact · Board", owner: "itdev" },
  chat: { name: L("Cekat Chat API"), sub: "Message · Broadcast", owner: "itdev" },
  wh: { name: L("Cekat Webhook"), sub: "Devtools", owner: "itdev" },
  cp: { name: L("Cekat Product", "Cekat Product"), sub: "Login · RBAC · CP-xx", owner: "product" },
  shopify: { name: L("Shopify"), sub: "REST Admin", owner: "external" },
  odoo: { name: L("Odoo POS"), sub: "webhook · REST", owner: "external" },
  fcm: { name: L("FCM / APNs"), sub: "push", owner: "external" },
  meta: { name: L("Meta WhatsApp"), sub: "template review", owner: "external" },
};

const UTOKEN = "Authorization: Bearer <Cekat user token>";
const KEY = "api_key: <workspace key>";

const sequences = [
  /* ================================================================ SD-01 */
  {
    id: "SD-01",
    title: L("Sign in & role resolution", "Login & penentuan role"),
    desc: L(
      "Cekat Product authenticates the CRM user and returns role and data scope. The backend holds no credentials and builds no scope — it only forwards the Cekat user token.",
      "Cekat Product mengautentikasi user CRM dan mengembalikan role serta scope data. Backend tidak menyimpan kredensial dan tidak membangun scope — hanya meneruskan token user Cekat."
    ),
    refs: ["UC-21", "AD-01"],
    participants: ["user", "app", "bff", "cp", "crm"],
    messages: [
      M("user", "app", "sync", L("Enter email & password", "Isi email & password")),
      M("app", "bff", "sync", L("Sign in", "Login"), "POST /v1/auth/login", {
        email: "andi@longchamp.co.id", password: "••••••••", device_id: "dev_7f3a9c", platform: "ios", push_token: "fcm:APA91b…", app_version: "1.0.3",
      }),
      M("bff", "cp", "sync", L("Authenticate CRM user", "Autentikasi user CRM"), "POST /auth/token (new)", {
        email: "andi@longchamp.co.id", password: "••••••••", client_id: "longchamp-clienteling",
      }, { cp: "CP-01" }),
      M("cp", "bff", "reply", L("Invalid credentials", "Kredensial salah"), "401", { error: "invalid_credentials" }, { cp: "CP-01" }),
      M("bff", "app", "reply", L("Sign-in error", "Error login"), "401", { error: "invalid_credentials" }),
      M("cp", "bff", "reply", L("User token", "Token user"), "200", {
        access_token: "ck_usr_…", refresh_token: "ck_ref_…", expires_in: 3600, cekat_user_id: "agt_5521", email: "andi@longchamp.co.id",
      }, { cp: "CP-01" }),
      M("bff", "cp", "sync", L("Get me: role & scope", "Ambil me: role & scope"), "GET /users/me (new)", { headers: UTOKEN }, { cp: "CP-03" }),
      M("cp", "bff", "reply", L("Role & scope", "Role & scope"), "200", {
        cekat_user_id: "agt_5521", full_name: "Andi Pratama", cekat_role_name: "Sales Agent – Plaza Indonesia", app_role: "sales_agent",
        reports_to: "Supervisor – Plaza Indonesia", authority: "Basic User", share_with_peers: false,
        scope: { boutique_ids: [3], visible_owner_ids: ["agt_5521"], include_unassigned: true },
      }, { cp: "CP-03" }),
      M("bff", "crm", "async", L("Upsert App Devices item", "Upsert item App Devices"), "POST /api/crm/boards/{appDevicesBoardId}/items", {
        device_id: "dev_7f3a9c", cekat_user_id: "agt_5521", platform: "ios", push_token: "fcm:APA91b…", app_version: "1.0.3", last_seen_at: "2026-11-16T09:12:00+07:00",
      }, { verify: true, note: "System write with workspace api_key — device tokens are for push (IT Dev)." }),
      M("bff", "app", "reply", L("Session", "Sesi"), "200", {
        access_token: "ck_usr_…", refresh_token: "ck_ref_…", expires_in: 3600,
        user: { cekat_user_id: "agt_5521", full_name: "Andi Pratama", app_role: "sales_agent", boutique_id: 3 },
        modules: ["search", "lists", "actions", "catalog", "performance"],
      }),
      M("app", "user", "reply", L("Home with modules for the role", "Home dengan modul sesuai role")),
    ],
    fragments: [
      { type: "alt", from: 3, to: 9, label: L("invalid", "tidak valid"), branches: [{ at: 5, label: L("valid", "valid") }] },
    ],
  },

  /* ================================================================ SD-02 */
  {
    id: "SD-02",
    title: L("Search client & open profile", "Cari klien & buka profil"),
    desc: L(
      "The backend forwards the user token; Cekat Product applies RBAC on every read, so only clients in the user's scope come back.",
      "Backend meneruskan token user; Cekat Product menerapkan RBAC di setiap pembacaan, jadi hanya klien dalam scope user yang dikembalikan."
    ),
    refs: ["UC-01", "UC-02", "UC-03"],
    participants: ["user", "app", "bff", "cp", "crm"],
    messages: [
      M("user", "app", "sync", L("Type phone / name", "Ketik HP / nama")),
      M("app", "bff", "sync", L("Search clients", "Cari klien"), "GET /v1/clients?q=0812345&limit=20", { headers: UTOKEN }),
      M("bff", "cp", "sync", L("Golden Record query with user token", "Query Golden Record dengan token user"), "GET /api/crm/boards/{goldenRecordBoardId}/items?q=0812345&limit=20", { headers: UTOKEN }, { cp: "CP-02", note: "Same Golden Record aPI, but evaluated as the signed-in user (RBAC)." }),
      M("cp", "crm", "sync", L("Read within Role Hierarchy visibility", "Baca sesuai visibilitas Role Hierarchy"), "own · subordinates · unassigned", null, { cp: "CP-02" }),
      M("crm", "cp", "reply", L("Visible contacts", "Kontak yang terlihat"), "200"),
      M("cp", "bff", "reply", L("Scoped contacts", "Kontak sesuai scope"), "200", {
        success: true, data: [{ id: 100245, contact_name: "Sari Dewi", phone: "+6281234567890", contact_owner: "agt_5521", additional_fields: { current_tier_name: "FAN", last_reach_out_at: "2026-10-02T14:20:00+07:00" } }],
      }, { cp: "CP-02" }),
      M("bff", "app", "reply", L("Results", "Hasil"), "200", {
        items: [{ customer_id: 100245, full_name: "Sari Dewi", phone_masked: "+62812•••7890", current_tier_name: "FAN", assigned_user_name: "Andi Pratama", last_reach_out_at: "2026-10-02T14:20:00+07:00" }],
        next_cursor: null,
      }),
      M("user", "app", "sync", L("Open client", "Buka klien")),
      M("app", "bff", "sync", L("Get profile", "Ambil profil"), "GET /v1/clients/100245", { headers: UTOKEN }),
      M("bff", "cp", "sync", L("Get Golden Record item (RBAC)", "Ambil item Golden Record (RBAC)"), "GET /api/crm/boards/{goldenRecordBoardId}/items/100245", { headers: UTOKEN }, { cp: "CP-02" }),
      M("cp", "bff", "reply", L("Not in scope", "Di luar scope"), "403", { error: "forbidden" }, { cp: "CP-02" }),
      M("bff", "cp", "sync", L("Get transactions (RBAC)", "Ambil transaksi (RBAC)"), "GET /api/crm/boards/{transactionsBoardId}/items", { headers: UTOKEN, filter: { customer_id: 100245 }, sort: "-transaction_datetime", limit: 10 }, { cp: "CP-02" }),
      M("bff", "cp", "sync", L("Get Love Tags (RBAC)", "Ambil Love Tags (RBAC)"), "GET /api/crm/boards/{loveTagsBoardId}/items", { headers: UTOKEN, filter: { customer_id: 100245 } }, { cp: "CP-02" }),
      M("cp", "bff", "reply", L("Contact + items", "Kontak + item"), "200", null, { cp: "CP-02" }),
      M("bff", "app", "reply", L("Client card", "Kartu klien"), "200", {
        customer_id: 100245, full_name: "Sari Dewi", current_tier_name: "FAN", total_spent_idr: 64500000, purchase_count: 7,
        consent_wa: true, birthdate: "1990-12-02", love_tags: ["le_pliage", "leather", "gifting"], client_note: "Prefers navy…",
        purchases: [{ receipt_number: "PI-0055231", transaction_datetime: "2026-10-28T16:30:00+07:00", amount_net_idr: 4750000, channel: "offline" }],
        reach_out: { eligible: true, days_since_last_contact: 45 },
      }),
    ],
    fragments: [
      { type: "opt", from: 10, to: 10, label: L("client outside scope", "klien di luar scope") },
    ],
  },

  /* ================================================================ SD-03 */
  {
    id: "SD-03",
    title: L("Tier change in Cekat → push", "Perubahan tier di Cekat → push"),
    desc: L(
      "The existing Golden Record pipeline has already written the Shopify/Odoo order and the new tier into Cekat. A Segment History item triggers the clienteling flow: push, Agenda task and device notification. No Shopify or Odoo webhook is handled here.",
      "Pipeline Golden Record yang berjalan sudah menulis order Shopify/Odoo dan tier baru ke Cekat. Item Segment History memicu alur clienteling: push, task Agenda, dan notifikasi perangkat. Tidak ada webhook Shopify atau Odoo yang ditangani di sini."
    ),
    refs: ["UC-03", "UC-10", "AD-02"],
    participants: ["crm", "cp", "n8n", "fcm", "app"],
    messages: [
      M("crm", "crm", "self", L("Existing pipeline: transaction + tier + Segment History written", "Pipeline berjalan: transaksi + tier + Segment History tertulis")),
      M("cp", "n8n", "async", L("Webhook: Segment History item created", "Webhook: item Segment History dibuat"), "POST /hooks/cekat/board-item", {
        event: "board_item.created", board: "segment_history", item_id: 9001,
        values: { customer_id: 100245, from_tier_name: "COLLECTOR", to_tier_name: "FAN", direction: "upgrade", created_at: "2026-10-28T16:31:00+07:00" },
      }, { cp: "CP-05" }),
      M("n8n", "n8n", "self", L("Idempotency + match Push Rules", "Idempotency + cocokkan Push Rules")),
      M("n8n", "crm", "sync", L("Read Golden Record item", "Baca item Golden Record"), "GET /api/crm/boards/{goldenRecordBoardId}/items/100245", { headers: KEY }, { verify: true }),
      M("crm", "n8n", "reply", L("Assigned SA + tier", "SA + tier"), "200", { id: 100245, name: "Sari Dewi", assigned_user_id: 87, registration_boutique_id: 3, current_tier_name: "FAN", consent_wa: true }),
      M("n8n", "crm", "sync", L("Create Clienteling Push", "Buat Clienteling Push"), "POST /api/crm/boards/{pushesBoardId}/items", {
        push_type: "high_value_upgrade", rule_id: 2, customer_id: 100245, assigned_user_id: 87, boutique_id: 3, trigger_history_id: 9001, due_date: "2026-11-04", status: "sent",
      }, { verify: true }),
      M("n8n", "crm", "sync", L("Create Agenda task", "Buat task Agenda"), "POST /api/crm/boards/{agendaBoardId}/items", {
        item_type: "task", subtype: "call", title: "Call Sari — FAN upgrade", customer_id: 100245, owner_user_id: 87, boutique_id: 3, schedule: "2026-11-04", source: "push", push_id: 6120,
      }, { verify: true }),
      M("n8n", "fcm", "sync", L("Send push", "Kirim push"), "POST /v1/projects/{project}/messages:send", {
        message: { token: "fcm:APA91b…", notification: { title: "High Value Upgrade", body: "Sari Dewi is now FAN — call before 4 Nov" }, data: { push_id: "6120", customer_id: "100245" } },
      }),
      M("fcm", "app", "async", L("Notification on SA device", "Notifikasi di perangkat SA")),
    ],
    fragments: [
      { type: "opt", from: 5, to: 8, label: L("rule matched (until CP-05: daily cron reads Segment History)", "rule cocok (sebelum CP-05: cron harian membaca Segment History)") },
    ],
  },

  /* ================================================================ SD-04 */
  {
    id: "SD-04",
    title: L("Reach Out via WhatsApp", "Reach Out via WhatsApp"),
    desc: L(
      "30-day check, send through Cekat (session message or approved template), webhook updates the contact, then the SA logs reason and channel.",
      "Cek 30 hari, kirim lewat Cekat (pesan sesi atau template approved), webhook meng-update kontak, lalu SA mencatat alasan dan channel."
    ),
    refs: ["UC-11", "UC-12", "UC-13", "AD-03"],
    participants: ["user", "app", "bff", "crm", "chat", "wh", "n8n"],
    messages: [
      M("user", "app", "sync", L("Tap Reach Out", "Tekan Reach Out")),
      M("app", "bff", "sync", L("Check eligibility", "Cek kelayakan"), "GET /v1/clients/100245/reach-out", { headers: UTOKEN }),
      M("bff", "crm", "sync", L("Get Golden Record item (user token)", "Ambil item Golden Record (token user)"), "GET /api/crm/boards/{goldenRecordBoardId}/items/100245", { headers: UTOKEN }, { verify: true, note: "RBAC enforced by Cekat Product (CP-02)." }),
      M("crm", "bff", "reply", L("Contact", "Kontak"), "200", { last_reach_out_at: "2026-10-02T14:20:00+07:00", consent_wa: true, last_contact_from_agent: "2026-10-02T14:19:00+07:00" }),
      M("bff", "app", "reply", L("Not eligible", "Tidak layak"), "200", { eligible: false, days_since_last_contact: 12, reason: "contacted_within_30_days" }),
      M("bff", "app", "reply", L("Eligible + templates", "Layak + template"), "200", {
        eligible: true, days_since_last_contact: 45, session_open: false,
        templates: [{ template_id: 14, code: "vip_upgrade_thanks", title: "Thank you — new tier", wa_template_name: "lc_vip_upgrade_id" }],
      }),
      M("user", "app", "sync", L("Pick template, personalise, send", "Pilih template, personalisasi, kirim")),
      M("app", "bff", "sync", L("Send message", "Kirim pesan"), "POST /v1/messages", {
        customer_id: 100245, channel: "whatsapp", template_id: 14, variables: { first_name: "Sari", sa_name: "Andi", boutique_name: "Plaza Indonesia" }, push_id: 6120,
      }),
      M("bff", "chat", "sync", L("Send session message", "Kirim pesan sesi"), "POST Message API (send text)", { inbox_id: "<GET /api/inboxes>", phone: "+6281234567890", text: "Halo Sari, …" }, { verify: true }),
      M("bff", "chat", "sync", L("Send approved template", "Kirim template approved"), "POST Message API (send template)", {
        inbox_id: "<GET /api/inboxes>", phone: "+6281234567890", template_name: "lc_vip_upgrade_id", language: "id", parameters: ["Sari", "Andi"],
      }, { verify: true }),
      M("chat", "bff", "reply", L("Message id", "Id pesan"), "200", { message_id: "msg_77ab…", status: "sent" }),
      M("bff", "app", "reply", L("Sent", "Terkirim"), "200", { cekat_message_id: "msg_77ab…", status: "sent" }),
      M("wh", "n8n", "async", L("Webhook: Message Sent", "Webhook: Message Sent"), "POST /webhook/cekat/message", { event: "message_sent", message_id: "msg_77ab…", contact_id: 100245, sent_at: "2026-11-16T10:30:05+07:00" }, { verify: true, note: "Event exists; payload fields to verify." }),
      M("n8n", "crm", "sync", L("Update last_reach_out_at", "Update last_reach_out_at"), "PATCH /api/crm/boards/{goldenRecordBoardId}/items/100245", { last_reach_out_at: "2026-11-16T10:30:05+07:00", last_reach_out_channel: "whatsapp" }, { verify: true }),
      M("app", "user", "reply", L("Reach-out form", "Form reach-out")),
      M("user", "app", "sync", L("Select reason & channel, validate", "Pilih alasan & channel, validasi")),
      M("app", "bff", "sync", L("Log reach-out", "Catat reach-out"), "POST /v1/reach-outs", {
        customer_id: 100245, contact_reason: "push", channel: "whatsapp", push_id: 6120, template_id: 14, cekat_message_id: "msg_77ab…", contacted_at: "2026-11-16T10:30:00+07:00",
      }),
      M("bff", "crm", "sync", L("Create Reach Out item", "Buat item Reach Out"), "POST /api/crm/boards/{reachOutBoardId}/items", {
        customer_id: 100245, user_id: 87, boutique_id: 3, contact_reason: "push", channel: "whatsapp", push_id: 6120, template_id: 14,
        cekat_message_id: "msg_77ab…", contacted_at: "2026-11-16T10:30:00+07:00", validated_at: "2026-11-16T10:31:00+07:00",
        days_since_last_contact: 45, attribution_end_date: "2026-12-16",
      }, { verify: true }),
      M("bff", "crm", "sync", L("Mark push executed", "Tandai push executed"), "PATCH /api/crm/boards/{pushesBoardId}/items/6120", { status: "executed", reach_out_id: 4410, executed_at: "2026-11-16T10:31:00+07:00" }, { verify: true }),
      M("bff", "app", "reply", L("Logged", "Tercatat"), "201", { reach_out_id: 4410, attribution_end_date: "2026-12-16" }),
    ],
    fragments: [
      { type: "alt", from: 4, to: 5, label: L("contacted < 30 days", "dihubungi < 30 hari"), branches: [{ at: 5, label: L("eligible", "layak") }] },
      { type: "alt", from: 8, to: 9, label: L("24h session open", "sesi 24 jam terbuka"), branches: [{ at: 9, label: L("else", "lainnya") }] },
      { type: "opt", from: 18, to: 18, label: L("push_id present", "ada push_id") },
    ],
  },

  /* ================================================================ SD-05 */
  {
    id: "SD-05",
    title: L("Catalog, stock & wishlist", "Katalog, stok & wishlist"),
    desc: L(
      "Catalog from Shopify (cached), live stock from Odoo, wishlist stored in Cekat CRM and sent on WhatsApp; delivery status needs CP-06, conversion checked daily for 30 days.",
      "Katalog dari Shopify (cache), stok live dari Odoo, wishlist disimpan di Cekat CRM dan dikirim lewat WhatsApp; status terkirim butuh CP-06, konversi dicek harian selama 30 hari."
    ),
    refs: ["UC-15", "UC-16", "UC-28", "UC-17", "UC-24", "AD-04"],
    participants: ["user", "app", "bff", "shopify", "odoo", "crm", "chat", "cp", "n8n"],
    messages: [
      M("user", "app", "sync", L("Browse catalog", "Lihat katalog")),
      M("app", "bff", "sync", L("List products", "Daftar produk"), "GET /v1/products?collection=roseau", { headers: UTOKEN }),
      M("bff", "shopify", "sync", L("Products (cache miss)", "Produk (cache miss)"), "GET /admin/api/{version}/products.json?collection_id=…", { headers: "X-Shopify-Access-Token" }),
      M("shopify", "bff", "reply", L("Products", "Produk"), "200", { products: [{ id: 8812, title: "Roseau Shoulder Bag", variants: [{ sku: "L10165HFP", price: "9900000.00" }], handle: "roseau" }] }),
      M("bff", "app", "reply", L("Catalog", "Katalog"), "200", { items: [{ sku: "L10165HFP", product_name: "Roseau Shoulder Bag", price_idr: 9900000, product_url: "https://longchamp.co.id/products/roseau", image_url: "…" }] }),
      M("user", "app", "sync", L("Scan barcode (camera)", "Pindai barcode (kamera)")),
      M("app", "bff", "sync", L("Lookup by barcode", "Cari via barcode"), "GET /v1/products?barcode=3597922187360", { headers: UTOKEN }),
      M("bff", "shopify", "sync", L("Variant by barcode", "Varian via barcode"), "POST /admin/api/{version}/graphql.json", { query: "productVariants(first:1, query:\"barcode:3597922187360\"){ nodes { sku product { title } } }" }),
      M("user", "app", "sync", L("Check stock", "Cek stok")),
      M("app", "bff", "sync", L("Stock by boutique", "Stok per boutique"), "GET /v1/stock?sku=L10165HFP", { headers: UTOKEN }),
      M("bff", "odoo", "sync", L("stock.quant search_read", "stock.quant search_read"), "Odoo JSON-RPC · stock.quant.search_read", {
        domain: [["product_id.default_code", "=", "L10165HFP"], ["location_id", "in", [41, 42, 43, 44, 45]]], fields: ["location_id", "quantity", "reserved_quantity"],
      }),
      M("odoo", "bff", "reply", L("Quants", "Quant"), "200", { result: [{ location_id: [41, "PI/Stock"], quantity: 2, reserved_quantity: 0 }] }),
      M("bff", "app", "reply", L("Stock", "Stok"), "200", { sku: "L10165HFP", stock: [{ boutique_id: 3, boutique_name: "Plaza Indonesia", qty: 2 }, { boutique_id: 4, boutique_name: "Pondok Indah Mall 3", qty: 0 }] }),
      M("user", "app", "sync", L("Pick customer, save to wishlist", "Pilih pelanggan, simpan ke wishlist")),
      M("app", "bff", "sync", L("Save wishlist item", "Simpan item wishlist"), "POST /v1/customers/100245/wishlist", { headers: UTOKEN, sku: "L10165HFP", source: "product_page" }),
      M("bff", "cp", "sync", L("Scope check on customer", "Cek scope pelanggan"), "RBAC check (user token)", { customer_id: 100245 }, { cp: "CP-02" }),
      M("bff", "crm", "sync", L("Create Wishlist item (saved)", "Buat item Wishlist (saved)"), "POST /api/crm/boards/{wishlistBoardId}/items", {
        customer_id: 100245, created_by_user_id: 87, boutique_id: 3, sku: "L10165HFP", product_name: "Roseau Shoulder Bag", price_idr: 9900000, status: "saved", source: "product_page", added_at: "2026-11-16T10:58:00+07:00",
      }, { verify: true }),
      M("bff", "app", "reply", L("Client wishlist", "Wishlist klien"), "201", { customer_id: 100245, items: [{ sku: "L10165HFP", status: "saved" }, { sku: "L1899089P59", status: "saved" }] }),
      M("user", "app", "sync", L("Send saved items", "Kirim item tersimpan")),
      M("app", "bff", "sync", L("Send wishlist", "Kirim wishlist"), "POST /v1/customers/100245/wishlist/send", { skus: ["L10165HFP", "L1899089P59"] }),
      M("bff", "chat", "sync", L("Send WA with links", "Kirim WA dengan link"), "POST Message API (send)", { inbox_id: "<id>", phone: "+6281234567890", text: "Halo Sari, ini pilihan dari Andi: …" }, { verify: true }),
      M("chat", "bff", "reply", L("Message id", "Id pesan"), "200", { message_id: "msg_91c0…" }),
      M("bff", "crm", "sync", L("Items → sent", "Item → sent"), "PATCH Wishlist items", { wishlist_ref: "WL-20261116-0087-01", status: "sent", sent_at: "2026-11-16T11:02:00+07:00" }, { verify: true }),
      M("bff", "app", "reply", L("Wishlist sent", "Wishlist terkirim"), "201", { wishlist_ref: "WL-20261116-0087-01", sent_at: "2026-11-16T11:02:00+07:00" }),
      M("cp", "n8n", "async", L("Webhook: message status", "Webhook: status pesan"), "POST /webhook/cekat/message-status (new)", { message_id: "msg_91c0…", contact_id: 100245, status: "read", at: "2026-11-16T11:20:00+07:00" }, { cp: "CP-06" }),
      M("n8n", "crm", "sync", L("Update delivery_status", "Update delivery_status"), "PATCH Wishlist items", { wishlist_ref: "WL-20261116-0087-01", delivery_status: "read" }, { verify: true }),
      M("n8n", "crm", "sync", L("Find purchases of wishlist SKUs", "Cari pembelian SKU wishlist"), "GET Transaction Lines + Transactions", { filter: { customer_id: 100245, sku: ["L10165HFP"], since: "2026-11-16" } }),
      M("n8n", "crm", "sync", L("Set purchased", "Set purchased"), "PATCH Wishlist items", { status: "purchased", converted_transaction_id: 7802 }, { verify: true }),
    ],
    fragments: [
      { type: "opt", from: 5, to: 7, label: L("scan instead of browse", "pindai, bukan telusuri") },
      { type: "opt", from: 18, to: 23, label: L("send now (or later from the client wishlist)", "kirim sekarang (atau nanti dari wishlist klien)") },
      { type: "loop", from: 26, to: 27, label: L("daily, 30 days", "harian, 30 hari") },
    ],
  },

  /* ================================================================ SD-06 */
  {
    id: "SD-06",
    title: L("Supervisor reassigns a client", "Supervisor memindahkan klien"),
    desc: L(
      "The permission check is done by Cekat Product on the user token (an SM may only reassign inside their boutique). The board item webhook (CP-05) lets n8n notify the new SA — also when the change is made in the Cekat UI.",
      "Pengecekan izin dilakukan Cekat Product lewat token user (SM hanya boleh memindahkan di dalam boutique-nya). Webhook board item (CP-05) membuat n8n bisa memberi tahu SA baru — juga saat perubahan dilakukan di UI Cekat."
    ),
    refs: ["UC-22", "AD-05"],
    participants: ["user", "app", "bff", "cp", "crm", "wh", "n8n", "fcm"],
    messages: [
      M("user", "app", "sync", L("Reassign to another SA", "Pindahkan ke SA lain")),
      M("app", "bff", "sync", L("Change assignee", "Ubah assignee"), "PATCH /v1/clients/100245/assignee", { headers: UTOKEN, new_owner_id: "agt_5590", reason: "sa_resigned" }),
      M("bff", "cp", "sync", L("Update assigned_user (RBAC)", "Update assigned_user (RBAC)"), "PATCH /api/crm/boards/{goldenRecordBoardId}/items/100245", { headers: UTOKEN, assigned_user_id: 91 }, { cp: "CP-02" }),
      M("cp", "bff", "reply", L("Forbidden — outside scope", "Ditolak — di luar scope"), "403", { error: "forbidden", reason: "target_owner_not_in_scope" }, { cp: "CP-02" }),
      M("bff", "app", "reply", L("Show error", "Tampilkan error"), "403", { error: "outside_scope" }),
      M("cp", "crm", "sync", L("Apply update", "Terapkan update"), "contact_owner = agt_5590", null, { cp: "CP-02" }),
      M("cp", "bff", "reply", L("Updated", "Ter-update"), "200", { id: 100245, contact_owner: "agt_5590" }, { cp: "CP-02" }),
      M("bff", "app", "reply", L("Done", "Selesai"), "200", { customer_id: 100245, assigned_user_name: "Maya Lestari" }),
      M("cp", "n8n", "async", L("Webhook: Golden Record item updated", "Webhook: item Golden Record berubah"), "POST /hooks/cekat/board-item", { event: "board_item.updated", board: "golden_record", item_id: 100245, changed: ["assigned_user_id"] }, { cp: "CP-05" }),
      M("n8n", "crm", "sync", L("Move open Agenda items to new SA", "Pindahkan item Agenda terbuka ke SA baru"), "PATCH /api/crm/boards/{agendaBoardId}/items/*", { headers: KEY, filter: { customer_id: 100245, status: "open" }, set: { owner_user_id: "agt_5590" } }, { verify: true }),
      M("n8n", "fcm", "sync", L("Push to new SA", "Push ke SA baru"), "POST /v1/projects/{project}/messages:send", { message: { token: "fcm:…maya", notification: { title: "New client", body: "Sari Dewi is now in your Client Book" } } }),
      M("fcm", "app", "async", L("Notification", "Notifikasi")),
    ],
    fragments: [
      { type: "alt", from: 3, to: 7, label: L("not allowed", "tidak diizinkan"), branches: [{ at: 5, label: L("allowed", "diizinkan") }] },
    ],
  },

  /* ================================================================ SD-07 */
  {
    id: "SD-07",
    title: L("Create a WhatsApp template", "Buat template WhatsApp"),
    desc: L(
      "Supervisor creates a template for their boutique (Super Admin: global). Cekat Product checks the permission, the template is created through the Cekat Open API and reviewed by Meta; n8n polls the status and notifies the creator.",
      "Supervisor membuat template untuk boutique-nya (Super Admin: global). Cekat Product mengecek izin, template dibuat lewat Cekat Open API dan direview Meta; n8n memantau status dan memberi tahu pembuat."
    ),
    refs: ["UC-23", "AD-06"],
    participants: ["user", "app", "bff", "cp", "chat", "meta", "n8n", "crm", "fcm"],
    messages: [
      M("user", "app", "sync", L("Build template & submit", "Susun template & ajukan")),
      M("app", "bff", "sync", L("Create template", "Buat template"), "POST /v1/templates", {
        headers: UTOKEN, scope: "boutique", boutique_id: 3, title: "VIP upgrade — Plaza Indonesia", wa_template_name: "lc_pi_vip_upgrade_id",
        wa_category: "marketing", language: "id", header_type: "image", header_content: "https://cdn…/roseau.jpg",
        body: "Halo {{1}}, kini Anda berada di tier {{2}}. Saya {{3}} siap membantu di Plaza Indonesia.",
        variables: [{ n: 1, field: "first_name", sample: "Sari" }, { n: 2, field: "current_tier_name", sample: "FAN" }, { n: 3, field: "sa_name", sample: "Andi" }],
        footer: "Longchamp Plaza Indonesia", buttons: [{ type: "url", text: "Lihat koleksi", url: "https://longchamp.co.id/…" }, { type: "quick_reply", text: "Buat janji" }],
      }),
      M("bff", "cp", "sync", L("Permission check (user token)", "Cek izin (token user)"), "POST /permissions/check (new)", { action: "template.create", scope: "boutique", boutique_id: 3 }, { cp: "CP-02" }),
      M("cp", "bff", "reply", L("Forbidden", "Ditolak"), "403", { error: "forbidden", reason: "boutique_not_in_scope" }, { cp: "CP-02" }),
      M("bff", "app", "reply", L("Show error", "Tampilkan error"), "403", { error: "outside_scope" }),
      M("cp", "bff", "reply", L("Allowed", "Diizinkan"), "200", { allowed: true }, { cp: "CP-02" }),
      M("bff", "chat", "sync", L("Create template message", "Buat template message"), "POST Open API · template (verify path)", {
        inbox_id: "<GET /api/inboxes>", name: "lc_pi_vip_upgrade_id", language: "id", category: "MARKETING",
        components: [
          { type: "HEADER", format: "IMAGE", example: { header_handle: ["https://cdn…/roseau.jpg"] } },
          { type: "BODY", text: "Halo {{1}}, kini Anda berada di tier {{2}}. Saya {{3}} siap membantu di Plaza Indonesia.", example: { body_text: [["Sari", "FAN", "Andi"]] } },
          { type: "FOOTER", text: "Longchamp Plaza Indonesia" },
          { type: "BUTTONS", buttons: [{ type: "URL", text: "Lihat koleksi", url: "https://longchamp.co.id/…" }, { type: "QUICK_REPLY", text: "Buat janji" }] },
        ],
      }, { verify: true, note: "Payload shape follows Meta's template components; confirm Cekat's exact format." }),
      M("chat", "meta", "async", L("Submit for review", "Ajukan untuk review")),
      M("chat", "bff", "reply", L("Created — pending", "Dibuat — pending"), "201", { cekat_template_id: "tpl_8f21…", status: "PENDING" }),
      M("bff", "crm", "sync", L("Save Template Library item", "Simpan item Template Library"), "POST /api/crm/boards/{templatesBoardId}/items", {
        title: "VIP upgrade — Plaza Indonesia", scope: "boutique", boutique_id: 3, created_by_user_id: 12, wa_template_name: "lc_pi_vip_upgrade_id",
        cekat_template_id: "tpl_8f21…", wa_category: "marketing", language: "id", meta_status: "pending", submitted_at: "2026-11-16T22:30:00+07:00", is_active: false,
      }, { verify: true }),
      M("bff", "app", "reply", L("Pending review", "Menunggu review"), "201", { template_id: 41, meta_status: "pending" }),
      M("n8n", "chat", "sync", L("Get template status", "Ambil status template"), "GET Open API · templates (verify path)", { status: "PENDING", since: "2026-11-16" }, { verify: true }),
      M("chat", "n8n", "reply", L("Status from Meta", "Status dari Meta"), "200", { data: [{ cekat_template_id: "tpl_8f21…", status: "APPROVED", rejected_reason: null }] }),
      M("n8n", "crm", "sync", L("Update item status", "Update status item"), "PATCH /api/crm/boards/{templatesBoardId}/items/41", { meta_status: "approved", approved_at: "2026-11-17T09:10:00+07:00", is_active: true }, { verify: true }),
      M("n8n", "fcm", "sync", L("Notify creator", "Beri tahu pembuat"), "POST /v1/projects/{project}/messages:send", { message: { token: "fcm:…rina", notification: { title: "Template approved", body: "VIP upgrade — Plaza Indonesia is ready to use" } } }),
      M("fcm", "app", "async", L("Notification", "Notifikasi")),
    ],
    fragments: [
      { type: "alt", from: 3, to: 10, label: L("not allowed", "tidak diizinkan"), branches: [{ at: 5, label: L("allowed", "diizinkan") }] },
      { type: "loop", from: 11, to: 15, label: L("every 15 min until approved or rejected", "tiap 15 menit sampai approved atau rejected") },
    ],
  },
  /* ================================================================ SD-08 */
  {
    id: "SD-08",
    title: L("Transaction → tracking tag (Silverspoon)", "Transaksi → tag tracking (Silverspoon)"),
    desc: L(
      "Cekat IT Delivery rule engine on the Golden Record. The existing pipeline writes the Transactions item; n8n evaluates the active tracking rules, adds the tag to the Golden Record, logs it and notifies the assigned SA.",
      "Rule engine Cekat IT Delivery di Golden Record. Pipeline menulis item Transactions; n8n mengevaluasi tracking rule aktif, menambah tag ke Golden Record, mencatatnya, dan memberi tahu SA."
    ),
    refs: ["UC-29", "AD-07"],
    participants: ["crm", "cp", "n8n", "fcm", "app"],
    messages: [
      M("crm", "crm", "self", L("Existing pipeline: Transactions item 7802 (Rp52,4 jt)", "Pipeline: item Transactions 7802 (Rp52,4 jt)")),
      M("cp", "n8n", "async", L("Webhook: Transactions item created", "Webhook: item Transactions dibuat"), "POST /hooks/cekat/board-item", { event: "board_item.created", board: "transactions", item_id: 7802, values: { customer_id: 100245, transaction_type: "sale", amount_net_idr: 52400000 } }, { cp: "CP-05" }),
      M("n8n", "crm", "sync", L("Active tracking rules", "Tracking rule aktif"), "GET /api/crm/boards/{trackingRulesBoardId}/items?is_active=true", { headers: KEY }, { verify: true }),
      M("crm", "n8n", "reply", L("Rules", "Rules"), "200", { data: [{ code: "silverspoon", scope: "same_transaction", window_days: 365, notify_sa: true, groups: [{ conditions: [{ field: "sku_any_of", op: "in", value: ["LONGCHAMP001"] }] }, { conditions: [{ field: "sku_any_of", op: "in", value: ["LONGCHAMP-A", "LONGCHAMP-B", "LONGCHAMP-C"] }, { field: "sku_unit_price_idr", op: ">=", value: 40000000 }, { field: "transaction_total_idr", op: ">=", value: 50000000 }] }] }] }),
      M("n8n", "crm", "sync", L("Transaction lines of 7802", "Lines transaksi 7802"), "GET /api/crm/boards/{transactionLinesBoardId}/items?transaction_id=7802", { headers: KEY }, { verify: true, cp: "CP-04" }),
      M("crm", "n8n", "reply", L("Lines", "Lines"), "200", { data: [{ sku: "LONGCHAMP-B", product_name: "Roseau Exotic", unit_price_idr: 41500000, qty: 1 }, { sku: "L1899089P59", product_name: "Le Pliage Original M", unit_price_idr: 2450000, qty: 1 }] }),
      M("n8n", "n8n", "self", L("Group 1 (LONGCHAMP001): no. Group 2: bought LONGCHAMP-B AND SKU 41,5 jt ≥ 40 jt AND total 52,4 jt ≥ 50 jt → match", "Grup 1 (LONGCHAMP001): tidak. Grup 2: beli LONGCHAMP-B DAN SKU 41,5 jt ≥ 40 jt DAN total 52,4 jt ≥ 50 jt → cocok")),
      M("n8n", "crm", "sync", L("Add tag to Golden Record", "Tambah tag ke Golden Record"), "PATCH /api/crm/boards/{goldenRecordBoardId}/items/100245", { values: { tracking_tags: ["silverspoon"] } }, { verify: true }),
      M("n8n", "crm", "sync", L("Customer Tag History", "Customer Tag History"), "POST /api/crm/boards/{tagHistoryBoardId}/items", { customer_id: 100245, rule_id: 1, action: "added", matched_group: 2, matched_skus: "LONGCHAMP-B", trigger_transaction_id: 7802, transaction_total_idr: 52400000, max_sku_unit_price_idr: 41500000 }, { verify: true }),
      M("n8n", "crm", "sync", L("Clienteling push for SA", "Clienteling push untuk SA"), "POST /api/crm/boards/{pushesBoardId}/items", { push_type: "tracking_tag", tag: "silverspoon", customer_id: 100245, assigned_user_id: 87, status: "sent" }, { verify: true }),
      M("n8n", "fcm", "sync", L("Send push", "Kirim push"), "POST /v1/projects/{project}/messages:send", { message: { notification: { title: "Silverspoon", body: "Sari Dewi is now Silverspoon" } } }),
      M("fcm", "app", "async", L("Notification on SA device", "Notifikasi di perangkat SA")),
    ],
    fragments: [
      { type: "opt", from: 7, to: 8, label: L("rule matched and tag not set yet", "rule cocok dan tag belum ada") },
      { type: "opt", from: 9, to: 11, label: L("notify_sa = true", "notify_sa = true") },
    ],
  },
  {
    id: "SD-09",
    title: L("CMS & configuration: Super Admin saves, every app reads", "CMS & pengaturan: Super Admin simpan, semua app membaca"),
    desc: L(
      "Settings and Home content live in Cekat CRM boards (App Settings, App Content). The Clienteling API writes them with the Super Admin token (RBAC CP-02), clears the Redis cache, and every app gets the new values from GET /v1/app/config within 5 minutes. The API and n8n read the same settings at run time.",
      "Pengaturan dan konten Beranda ada di board Cekat CRM (App Settings, App Content). Clienteling API menulisnya dengan token Super Admin (RBAC CP-02), menghapus cache Redis, dan setiap app mendapat nilai baru dari GET /v1/app/config dalam 5 menit. API dan n8n membaca pengaturan yang sama saat berjalan."
    ),
    refs: ["UC-30", "AD-08"],
    participants: ["user", "app", "bff", "cp", "crm"],
    messages: [
      M("user", "app", "sync", L("Super Admin changes reach-out gap to 21 days and publishes a hero", "Super Admin ubah jeda reach out ke 21 hari dan terbitkan hero")),
      M("app", "bff", "sync", L("Save settings", "Simpan pengaturan"), "PATCH /v1/admin/settings", { changes: [{ key: "reach_out_min_days", value: 21 }], reason: "Promo Desember" }),
      M("bff", "cp", "sync", L("Role check: super_admin", "Cek role: super_admin"), "GET users/me", {}, { cp: "CP-03" }),
      M("bff", "crm", "sync", L("Update App Settings item", "Update item App Settings"), "PATCH /api/crm/boards/{appSettingsBoardId}/items/{id}", { values: { value: "21", updated_by_user_id: 1, updated_at: "2026-11-17T10:40:00+07:00" } }, { verify: true, cp: "CP-02" }),
      M("bff", "crm", "sync", L("Settings History item", "Item Settings History"), "POST /api/crm/boards/{settingsHistoryBoardId}/items", { key: "reach_out_min_days", old_value: "30", new_value: "21", changed_by_user_id: 1, reason: "Promo Desember" }, { verify: true }),
      M("bff", "bff", "self", L("Delete Redis key app_config:*", "Hapus key Redis app_config:*")),
      M("bff", "app", "reply", L("Saved", "Tersimpan"), "200", { updated: ["reach_out_min_days"], version: 42 }),
      M("app", "bff", "sync", L("Publish hero", "Terbitkan hero"), "POST /v1/admin/content", { kind: "hero", audience: "sales_agent", boutique_id: null, title_id: "Musim hadiah", title_en: "Gifting season", cta: "catalog", start_at: "2026-11-15", end_at: "2026-12-31", status: "published" }),
      M("bff", "crm", "sync", L("Create App Content item", "Buat item App Content"), "POST /api/crm/boards/{appContentBoardId}/items", { kind: "hero", audience: "sales_agent", title_id: "Musim hadiah", start_at: "2026-11-15", end_at: "2026-12-31", status: "published", created_by_user_id: 1 }, { verify: true }),
      M("app", "bff", "async", L("Any app (SA) opens Home", "App mana pun (SA) buka Beranda"), "GET /v1/app/config"),
      M("bff", "crm", "sync", L("Settings + live content (cache miss)", "Pengaturan + konten aktif (cache kosong)"), "GET /api/crm/boards/{appSettingsBoardId|appContentBoardId}/items", { headers: KEY }, { verify: true, cp: "CP-04" }),
      M("bff", "app", "reply", L("Config for this role and boutique", "Config untuk role dan boutique ini"), "200", { version: 42, settings: { reach_out_min_days: 21, quiet_hours: "21:00-08:00" }, features: { scan: true, events: true }, content: [{ kind: "hero", title: "Musim hadiah", cta: "catalog" }] }),
    ],
    fragments: [
      { type: "opt", from: 10, to: 10, label: L("cache older than 5 minutes or cleared", "cache lebih dari 5 menit atau sudah dihapus") },
    ],
  },
];

export default sequences;
