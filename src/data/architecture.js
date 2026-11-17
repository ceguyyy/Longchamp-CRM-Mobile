/*
 * Solution architecture — Cekat CRM is the database / system of record.
 * Frontend (mobile app) → Backend API (BFF) → Cekat API.  No separate business database.
 *
 * Geometry is explicit (SVG units, viewBox 1600 × 900). Edge paths are point lists.
 * owner: itdev | product | external | user
 */
const L = (en, id = en) => ({ en, id });

const arch = {
  width: 1600,
  height: 950,

  zones: [
    { id: "fe", x: 24, w: 290, title: L("FRONTEND"), owner: "itdev" },
    { id: "be", x: 340, w: 430, title: L("BACKEND"), owner: "itdev" },
    { id: "ck", x: 800, w: 450, title: L("CEKAT PLATFORM · DATABASE", "CEKAT PLATFORM · DATABASE"), owner: "itdev" },
    { id: "ex", x: 1276, w: 300, title: L("EXTERNAL", "EKSTERNAL"), owner: "external" },
  ],

  components: [
    {
      id: "app", x: 44, y: 150, w: 226, h: 300, owner: "itdev",
      title: L("Mobile App", "Aplikasi Mobile"),
      sub: L("HeroUI · iOS / Android"),
      items: [
        L("Customer Search & profile", "Customer Search & profil"),
        L("Customer Lists · Client Book"),
        L("Actions · Reach Out · Agenda"),
        L("Product Catalog · Wishlist"),
        L("Performance KPI"),
        L("Role-aware navigation (RBAC)", "Navigasi sesuai role (RBAC)"),
      ],
      desc: L(
        "Frontend for Sales Agent, Supervisor and Super Admin. Holds no API keys and no business data beyond an offline cache; every call goes to the Backend API with the Cekat user token issued by Cekat Product.",
        "Frontend untuk Sales Agent, Supervisor, dan Super Admin. Tidak menyimpan API key maupun data bisnis selain cache offline; semua panggilan ke Backend API dengan token user Cekat yang diterbitkan Cekat Product."
      ),
    },
    {
      id: "bff", x: 360, y: 110, w: 390, h: 282, owner: "itdev",
      title: L("Backend API (BFF)"),
      sub: L("Node.js · REST / JSON · stateless"),
      items: [
        L("Token pass-through (no auth / RBAC logic)", "Teruskan token (tanpa logika auth / RBAC)"),
        L("Response shaping for the app", "Membentuk response untuk app"),
        L("Clients · Lists · Client Book API"),
        L("Actions · Agenda · Reach Out API"),
        L("Catalog & Stock API (cached)", "Catalog & Stock API (cache)"),
        L("KPI API"),
        L("Cache only — no business DB", "Hanya cache — tanpa DB bisnis"),
      ],
      desc: L(
        "The only entry point for the app. Forwards the Cekat user token so Cekat Product enforces login and RBAC, aggregates Cekat, Shopify and Odoo calls, and caches the catalog. Builds no auth or scope logic.",
        "Satu-satunya pintu masuk untuk app. Meneruskan token user Cekat supaya Cekat Product menegakkan login dan RBAC, menggabungkan panggilan Cekat, Shopify, dan Odoo, serta cache katalog. Tidak membangun logika auth maupun scope."
      ),
    },
    {
      id: "n8n", x: 360, y: 404, w: 390, h: 250, owner: "itdev",
      title: L("n8n Orchestration", "Orkestrasi n8n"),
      sub: L("Event-driven workflows · cron"),
      items: [
        L("Webhook receivers: Cekat (board item, message)", "Penerima webhook: Cekat (board item, pesan)"),
        L("Idempotency + identity waterfall"),
        L("Tier engine (IDR thresholds, refund aware)", "Tier engine (threshold IDR, sadar refund)"),
        L("Clienteling push scheduler (08:00 WIB)"),
        L("KPI aggregation · 30-day attribution", "Agregasi KPI · atribusi 30 hari"),
        L("Error log (log-only)"),
      ],
      desc: L(
        "Clienteling automation. Reacts to Cekat webhooks (tier changes, owner changes, messages), creates pushes and agenda tasks, attributes conversions and aggregates KPI. Shopify and Odoo data already reach Cekat through the existing Golden Record pipeline.",
        "Otomasi clienteling. Bereaksi pada webhook Cekat (perubahan tier, owner, pesan), membuat push dan task agenda, atribusi konversi, dan agregasi KPI. Data Shopify dan Odoo sudah masuk ke Cekat lewat pipeline Golden Record yang berjalan."
      ),
    },
    {
      id: "crm", x: 820, y: 110, w: 410, h: 320, owner: "itdev", database: true,
      title: L("Cekat CRM — system of record", "Cekat CRM — system of record"),
      sub: L("The app's database (Golden Record + boards)", "Database aplikasi (Golden Record + board)"),
      items: [
        L("Golden Record board"),
        L("Transactions (online + offline)", "Transactions (online + offline)"),
        L("Reach Out · Wishlist"),
        L("Agenda (tasks & appointments)", "Agenda (task & appointment)"),
        L("Events · Client Book"),
        L("Templates · Push Rules"),
        L("KPI snapshot"),
        L("Role Hierarchy & users (UI)", "Role Hierarchy & user (UI)"),
      ],
      desc: L(
        "All app data lives here — there is no separate database. IT Dev reads and writes it through the documented Contact and Board APIs.",
        "Semua data app ada di sini — tidak ada database terpisah. IT Dev membaca dan menulis lewat Contact API dan Board API yang terdokumentasi."
      ),
    },
    {
      id: "chat", x: 820, y: 476, w: 410, h: 84, owner: "itdev",
      title: L("Cekat Chat · WABA"),
      sub: L("Message · Broadcast · Tickets API"),
      items: [],
      desc: L(
        "Sends WhatsApp session and template messages for Reach Out, wishlist and event invitations; creates service tickets.",
        "Mengirim pesan WhatsApp sesi dan template untuk Reach Out, wishlist, dan undangan event; membuat tiket servis."
      ),
    },
    {
      id: "wh", x: 820, y: 580, w: 410, h: 70, owner: "itdev",
      title: L("Cekat Webhooks"),
      sub: L("Message · Conversation · Contact updated"),
      items: [],
      desc: L(
        "Documented events pushed to n8n: Conversation Created / Resolved, Message Received / Sent, Contact updated.",
        "Event terdokumentasi yang dikirim ke n8n: Conversation Created / Resolved, Message Received / Sent, Contact updated."
      ),
    },
    {
      id: "cp", x: 820, y: 676, w: 410, h: 160, owner: "product",
      title: L("Cekat Product — to build", "Cekat Product — perlu dibangun"),
      sub: L("Not in the API docs yet", "Belum ada di API docs"),
      items: [
        L("CP-01 Login & user token · CP-02 RBAC on API", "CP-01 Login & token user · CP-02 RBAC di API"),
        L("CP-03 Users, roles & scope · CP-04 Item filter", "CP-03 User, role & scope · CP-04 Filter item"),
        L("CP-05 Board item webhook · CP-06 Msg status", "CP-05 Webhook board item · CP-06 Status pesan"),
      ],
      desc: L(
        "Owned by Cekat Product: login, users, role hierarchy and RBAC enforcement on every user call, plus the other platform gaps. IT Dev depends on these and builds no workaround.",
        "Dimiliki Cekat Product: login, user, role hierarchy, dan penegakan RBAC di setiap panggilan user, plus gap platform lainnya. IT Dev bergantung pada ini dan tidak membuat workaround."
      ),
    },
    {
      id: "shopify", x: 1296, y: 110, w: 260, h: 74, owner: "external",
      title: L("Shopify"), sub: L("Online store · REST Admin + webhooks"), items: [],
      desc: L("Online orders, refunds and the product catalog.", "Order online, refund, dan katalog produk."),
    },
    {
      id: "odoo", x: 1296, y: 206, w: 260, h: 74, owner: "external",
      title: L("Odoo POS"), sub: L("5 boutiques · base.automation + REST", "5 boutique · base.automation + REST"), items: [],
      desc: L("Offline POS orders and live stock per boutique.", "Order POS offline dan stok live per boutique."),
    },
    {
      id: "meta", x: 1296, y: 480, w: 260, h: 74, owner: "external",
      title: L("Meta WhatsApp"), sub: L("Cloud API · approved templates", "Cloud API · template approved"), items: [],
      desc: L("WhatsApp delivery behind Cekat Chat; template approval by Meta.", "Pengiriman WhatsApp di belakang Cekat Chat; approval template oleh Meta."),
    },
    {
      id: "fcm", x: 1296, y: 676, w: 260, h: 70, owner: "external",
      title: L("FCM / APNs"), sub: L("Mobile push notifications"), items: [],
      desc: L("Delivers clienteling pushes to SA devices.", "Mengirim clienteling push ke perangkat SA."),
    },
    {
      id: "klaviyo", x: 1296, y: 580, w: 260, h: 70, owner: "external",
      title: L("Klaviyo"), sub: L("Email mirror · consent-gated"), items: [],
      desc: L("Receives consented profiles from n8n (existing platform scope).", "Menerima profil yang sudah consent dari n8n (scope platform yang ada)."),
    },
  ],

  edges: [
    { id: 1, from: "app", to: "bff", pts: [[270, 230], [360, 230]], label: L("HTTPS · token"), lx: 276, ly: 222,
      proto: "HTTPS REST / JSON", auth: "Cekat user token (CP-01)", trigger: L("User action", "Aksi user"), owner: "itdev" },
    { id: 2, from: "bff", to: "crm", pts: [[750, 170], [820, 170]], label: L("API"), lx: 760, ly: 162,
      proto: "Cekat Open API (REST)", auth: "User token → RBAC by Cekat Product", trigger: L("App request", "Request app"), owner: "itdev" },
    { id: 3, from: "bff", to: "chat", pts: [[750, 320], [806, 320], [806, 510], [820, 510]], label: L("API"), lx: 756, ly: 312,
      proto: "Cekat Open API (REST)", auth: "User token → RBAC by Cekat Product", trigger: L("Reach Out · wishlist · ticket"), owner: "itdev" },
    { id: 4, from: "bff", to: "shopify", pts: [[700, 110], [700, 80], [1426, 80], [1426, 110]], label: L("REST · products · stock", "REST · produk · stok"), lx: 1050, ly: 72,
      proto: "Shopify REST Admin API", auth: "Admin API token", trigger: L("Catalog request (cached)", "Request katalog (cache)"), owner: "itdev" },
    { id: 5, from: "bff", to: "odoo", pts: [[720, 110], [720, 92], [1580, 92], [1580, 243], [1556, 243]], label: null,
      proto: "Odoo REST / JSON-RPC", auth: "Odoo API key", trigger: L("Stock check (live)", "Cek stok (live)"), owner: "itdev" },
    { id: 6, from: "shopify", to: "n8n", pts: [[1296, 150], [1262, 150], [1262, 453], [750, 453]], label: L("existing Golden Record pipeline → Cekat CRM", "pipeline Golden Record (sudah berjalan) → Cekat CRM"), lx: 1000, ly: 446, center: true,
      proto: "Existing pipeline (out of scope)", auth: "—", trigger: L("Order / refund / POS order — already in Cekat", "Order / refund / order POS — sudah ada di Cekat"), owner: "external" },
    { id: 7, from: "odoo", to: "n8n", pts: [[1296, 243], [1262, 243]], label: null, merge: true,
      proto: "Existing pipeline (out of scope)", auth: "—", trigger: L("POS order / refund — already in Cekat", "Order POS / refund — sudah ada di Cekat"), owner: "external" },
    { id: 8, from: "n8n", to: "crm", pts: [[750, 420], [820, 420]], label: L("upsert"), lx: 760, ly: 412,
      proto: "Cekat Open API (REST)", auth: "api_key", trigger: L("Every inbound event", "Setiap event masuk"), owner: "itdev" },
    { id: 9, from: "wh", to: "n8n", pts: [[820, 615], [750, 615]], label: L("events", "event"), lx: 815, ly: 607, anchor: "end",
      proto: "HTTPS webhook", auth: "Webhook secret / URL", trigger: L("Message · board item (CP-05)", "Pesan · board item (CP-05)"), owner: "itdev" },
    { id: 10, from: "chat", to: "meta", pts: [[1230, 518], [1296, 518]], label: L("WABA"), lx: 1238, ly: 510,
      proto: "WhatsApp Cloud API", auth: "Managed by Cekat", trigger: L("Send message", "Kirim pesan"), owner: "itdev" },
    { id: 11, from: "n8n", to: "fcm", pts: [[520, 654], [520, 876], [1426, 876], [1426, 746]], label: L("push"), lx: 1100, ly: 868,
      proto: "FCM HTTP v1 / APNs", auth: "Service account", trigger: L("Push rule fired", "Aturan push terpicu"), owner: "itdev" },
    { id: 12, from: "fcm", to: "app", pts: [[1446, 746], [1446, 906], [170, 906], [170, 450]], label: L("push to SA device", "push ke perangkat SA"), lx: 800, ly: 898,
      proto: "OS push channel", auth: "Device token", trigger: L("Notification", "Notifikasi"), owner: "external" },
    { id: 13, from: "n8n", to: "klaviyo", pts: [[600, 654], [600, 856], [1270, 856], [1270, 615], [1296, 615]], label: L("consented profiles", "profil consent"), lx: 1100, ly: 848,
      proto: "Klaviyo profile-import API", auth: "Private API key", trigger: L("Consent = true", "Consent = true"), owner: "itdev" },
    { id: 14, from: "bff", to: "cp", pts: [[750, 260], [786, 260], [786, 716], [820, 716]], label: L("CP-01 · 02 · 03 · 04"), lx: 781, ly: 530, dashed: true, anchor: "middle", rot: true,
      proto: "Cekat API (new)", auth: "User token (CP-01)", trigger: L("Login · role & scope · RBAC check", "Login · role & scope · cek RBAC"), owner: "product" },
    { id: 15, from: "cp", to: "n8n", pts: [[820, 790], [768, 790], [768, 640], [750, 640]], label: L("CP-05 · 06"), lx: 690, ly: 806, dashed: true, anchor: "start",
      proto: "Webhook (new)", auth: "Webhook secret", trigger: L("Board item / message status change", "Perubahan board item / status pesan"), owner: "product" },
  ],

  /* What lives where — Cekat CRM as the database */
  dataOwnership: [
    { entity: L("Client (Golden Record)", "Klien (Golden Record)"), store: "Golden Record board", writers: "Existing pipeline (Shopify, Odoo); App via BFF (register, Love Tags, assigned SA, last reach out)", readers: "App via BFF · n8n" },
    { entity: L("Transactions"), store: "Transactions board", writers: "Existing Golden Record pipeline (Shopify, Odoo) — read-only for the app", readers: "App via BFF · n8n (tier, KPI)" },
    { entity: L("Reach Out log"), store: "Reach Out board", writers: "App via BFF", readers: "n8n (KPI) · App" },
    { entity: L("Wishlist"), store: "Wishlist board", writers: "App via BFF", readers: "n8n (attribution) · App" },
    { entity: L("Agenda tasks & appointments", "Task & appointment Agenda"), store: "Agenda board", writers: "n8n (pushes), App via BFF", readers: "App via BFF" },
    { entity: L("Events & guest lists", "Event & guest list"), store: "Events board", writers: "App via BFF (SM)", readers: "App via BFF" },
    { entity: L("Templates & push rules", "Template & aturan push"), store: "Templates · Push Rules boards", writers: "Super Admin (App / Cekat UI)", readers: "App · n8n" },
    { entity: L("KPI snapshot"), store: "KPI board", writers: "n8n (scheduled)", readers: "App via BFF" },
    { entity: L("Users, roles, hierarchy", "User, role, hierarki"), store: "Cekat CRM User Settings", writers: "Super Admin (Cekat UI)", readers: "Cekat Product (CP-01/02/03) — app reads role via BFF" },
    { entity: L("Product catalog & stock", "Katalog produk & stok"), store: "Not stored — Shopify / Odoo are the source", writers: "—", readers: "BFF (cache)" },
    { entity: L("Catalog cache"), store: "BFF cache (Redis) — not business data", writers: "BFF", readers: "BFF" },
  ],
};

export default arch;
