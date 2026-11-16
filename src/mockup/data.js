/* Dummy data for the app mockup. Field names follow src/data/erd.js. All values are fictitious. */

export const ROLES = {
  sales_agent: { id: "sales_agent", name: { en: "Sales Agent", id: "Sales Agent" }, rbac: "sa", scope: { en: "Own clients", id: "Klien sendiri" } },
  supervisor: { id: "supervisor", name: { en: "Supervisor", id: "Supervisor" }, rbac: "sm", scope: { en: "Boutique team", id: "Tim boutique" } },
  super_admin: { id: "super_admin", name: { en: "Super Admin", id: "Super Admin" }, rbac: "hq", scope: { en: "All boutiques", id: "Semua boutique" } },
};

export const BOUTIQUES = [
  { boutique_id: 3, boutique_name: "Plaza Indonesia" },
  { boutique_id: 4, boutique_name: "Pondok Indah Mall 3" },
  { boutique_id: 5, boutique_name: "Grand Indonesia" },
  { boutique_id: 6, boutique_name: "Senayan City" },
  { boutique_id: 7, boutique_name: "Pakuwon Mall" },
];

export const USERS = {
  sales_agent: { user_id: 87, cekat_user_id: "agt_5521", full_name: "Andi Pratama", email: "andi@longchamp.co.id", role: "sales_agent", boutique_id: 3, initials: "AP" },
  supervisor: { user_id: 12, cekat_user_id: "agt_5502", full_name: "Rina Wijaya", email: "rina@longchamp.co.id", role: "supervisor", boutique_id: 3, initials: "RW" },
  super_admin: { user_id: 1, cekat_user_id: "agt_5001", full_name: "Dimas Hartono", email: "dimas@longchamp.co.id", role: "super_admin", boutique_id: null, initials: "DH" },
};

export const TEAM = [
  { user_id: 87, full_name: "Andi Pratama", initials: "AP", role: "sales_agent", boutique_id: 3, clients: 142, actions: 62, conversion_rate: 8, sales_idr: 48500000, push_sent: 30, push_executed: 26 },
  { user_id: 91, full_name: "Maya Lestari", initials: "ML", role: "sales_agent", boutique_id: 3, clients: 118, actions: 54, conversion_rate: 11, sales_idr: 61200000, push_sent: 24, push_executed: 23 },
  { user_id: 94, full_name: "Bayu Saputra", initials: "BS", role: "sales_agent", boutique_id: 3, clients: 96, actions: 31, conversion_rate: 5, sales_idr: 19800000, push_sent: 22, push_executed: 14 },
  { user_id: 12, full_name: "Rina Wijaya", initials: "RW", role: "supervisor", boutique_id: 3, clients: 40, actions: 18, conversion_rate: 9, sales_idr: 22300000, push_sent: 6, push_executed: 6 },
];

export const TIERS = ["LIKER", "LOVER", "COLLECTOR", "FAN", "FRIEND", "FAMILY"];
/* Monochrome ramp like the app, lime reserved for the top tiers */
export const TIER_STYLE = {
  LIKER: { bg: "#f2f2f2", fg: "#000000" },
  LOVER: { bg: "#e2e2e2", fg: "#000000" },
  COLLECTOR: { bg: "#bdbdbd", fg: "#000000" },
  FAN: { bg: "#000000", fg: "#ffffff" },
  FRIEND: { bg: "#000000", fg: "#8dc63f" },
  FAMILY: { bg: "#8dc63f", fg: "#000000" },
};

export const CLIENTS = [
  {
    customer_id: 100245, full_name: "Sari Dewi", phone_e164: "+6281234567890", email: "sari.dewi@mail.com", birthdate: "1990-12-02",
    current_tier_name: "FAN", total_spent_idr: 64500000, purchase_count: 7, last_purchase_date: "2026-10-28",
    assigned_user_id: 87, assigned_user_name: "Andi Pratama", boutique_id: 3, consent_wa: true, consent_email: false,
    last_reach_out_at: "2026-10-02", days_since_last_contact: 45, love_tags: ["le_pliage", "leather", "navy", "gifting"],
    client_note: "Prefers navy. Buys gifts for her mother every December.", city: "Jakarta Selatan", is_promoter: true,
    purchases: [
      { receipt_number: "PI-0055231", date: "28 Oct 2026", item: "Le Pliage Original M", amount_net_idr: 4750000, channel: "offline" },
      { receipt_number: "#1002", date: "14 Aug 2026", item: "Roseau Shoulder Bag", amount_net_idr: 9900000, channel: "online" },
      { receipt_number: "PI-0049910", date: "02 May 2026", item: "Le Foulonné Wallet", amount_net_idr: 3150000, channel: "offline" },
    ],
  },
  {
    customer_id: 100311, full_name: "Michelle Tan", phone_e164: "+6281399887766", email: "michelle.tan@mail.com", birthdate: "1987-11-24",
    current_tier_name: "FRIEND", total_spent_idr: 128400000, purchase_count: 15, last_purchase_date: "2026-09-12",
    assigned_user_id: 87, assigned_user_name: "Andi Pratama", boutique_id: 3, consent_wa: true, consent_email: true,
    last_reach_out_at: "2026-11-09", days_since_last_contact: 7, love_tags: ["roseau", "black", "events"],
    client_note: "Attends every preview event. Plus one: husband.", city: "Jakarta Pusat", is_promoter: false,
    purchases: [{ receipt_number: "PI-0052001", date: "12 Sep 2026", item: "Roseau Box Bag", amount_net_idr: 12500000, channel: "offline" }],
  },
  {
    customer_id: 100402, full_name: "Ayu Kartika", phone_e164: "+6285611223344", email: null, birthdate: "1995-11-30",
    current_tier_name: "LOVER", total_spent_idr: 8900000, purchase_count: 3, last_purchase_date: "2026-06-03",
    assigned_user_id: 87, assigned_user_name: "Andi Pratama", boutique_id: 3, consent_wa: true, consent_email: false,
    last_reach_out_at: "2026-07-01", days_since_last_contact: 138, love_tags: ["le_pliage", "colourful"],
    client_note: "", city: "Tangerang", is_promoter: false,
    purchases: [{ receipt_number: "PI-0041200", date: "03 Jun 2026", item: "Le Pliage Pouch", amount_net_idr: 1450000, channel: "offline" }],
  },
  {
    customer_id: 100518, full_name: "Hendra Gunawan", phone_e164: "+6281288776655", email: "hendra.g@mail.com", birthdate: "1979-03-15",
    current_tier_name: "COLLECTOR", total_spent_idr: 27800000, purchase_count: 5, last_purchase_date: "2026-10-03",
    assigned_user_id: 91, assigned_user_name: "Maya Lestari", boutique_id: 3, consent_wa: false, consent_email: true,
    last_reach_out_at: null, days_since_last_contact: null, love_tags: ["leather", "travel"],
    client_note: "Travel bags for business trips.", city: "Jakarta Barat", is_promoter: false,
    purchases: [{ receipt_number: "PI-0053120", date: "03 Oct 2026", item: "Boxford Travel Bag", amount_net_idr: 7800000, channel: "offline" }],
  },
  {
    customer_id: 100620, full_name: "Nadia Putri", phone_e164: "+6287877665544", email: "nadia.p@mail.com", birthdate: "2000-12-10",
    current_tier_name: "LIKER", total_spent_idr: 2450000, purchase_count: 1, last_purchase_date: "2026-11-15",
    assigned_user_id: null, assigned_user_name: null, boutique_id: 3, consent_wa: true, consent_email: true,
    last_reach_out_at: null, days_since_last_contact: null, love_tags: [],
    client_note: "", city: "Depok", is_promoter: false,
    purchases: [{ receipt_number: "PI-0055410", date: "15 Nov 2026", item: "Le Pliage Original S", amount_net_idr: 2450000, channel: "offline" }],
  },
  {
    customer_id: 100733, full_name: "Laura Siregar", phone_e164: "+6281122334455", email: "laura.s@mail.com", birthdate: "1984-11-19",
    current_tier_name: "FAMILY", total_spent_idr: 412000000, purchase_count: 38, last_purchase_date: "2026-11-01",
    assigned_user_id: 120, assigned_user_name: "Kevin Lim", boutique_id: 5, consent_wa: true, consent_email: true,
    last_reach_out_at: "2026-11-02", days_since_last_contact: 14, love_tags: ["roseau", "personalisation", "events"],
    client_note: "Top client Grand Indonesia.", city: "Jakarta Pusat", is_promoter: true,
    purchases: [{ receipt_number: "GI-0031020", date: "01 Nov 2026", item: "Roseau Essential Tote", amount_net_idr: 14200000, channel: "offline" }],
  },
];

export const LOVE_TAGS = {
  line: ["le_pliage", "roseau", "le_foulonne", "box_trot", "epure"],
  material: ["leather", "nylon", "canvas"],
  colour: ["navy", "black", "colourful", "neutral"],
  style: ["classic", "travel", "work"],
  gifting: ["gifting", "personalisation"],
  experience: ["events", "after_sales"],
};

export const PUSHES = [
  { push_id: 6120, push_type: "high_value_upgrade", customer_id: 100245, due_date: "2026-11-23", status: "sent", assigned_user_id: 87, detail: "LOVER → FAN" },
  { push_id: 6131, push_type: "vip_birthday", customer_id: 100311, due_date: "2026-11-24", status: "sent", assigned_user_id: 87, detail: "Birthday 24 Nov" },
  { push_id: 6098, push_type: "beginner_plus_upgrade", customer_id: 100402, due_date: "2026-11-20", status: "sent", assigned_user_id: 87, detail: "LIKER → LOVER" },
  { push_id: 6077, push_type: "vip_downgrade", customer_id: 100518, due_date: "2026-11-18", status: "executed", assigned_user_id: 91, detail: "FAN → COLLECTOR (refund)" },
  { push_id: 6050, push_type: "vip_birthday", customer_id: 100733, due_date: "2026-11-19", status: "cancelled", assigned_user_id: 120, detail: "Birthday 19 Nov" },
];

export const PUSH_LABEL = {
  /* colour ramp from the "Clienteling Pushes" slide */
  vip_birthday: { en: "VIP Birthday", id: "VIP Birthday", color: "#2f4a12", fg: "#ffffff" },
  vip_downgrade: { en: "VIP Downgrade", id: "VIP Downgrade", color: "#6d6e66", fg: "#ffffff" },
  high_value_upgrade: { en: "High Value Upgrade", id: "High Value Upgrade", color: "#4f8a2b", fg: "#ffffff" },
  beginner_plus_upgrade: { en: "Beginner+ Upgrade", id: "Beginner+ Upgrade", color: "#b5d68f", fg: "#1f2a12" },
};

export const AGENDA = [
  { agenda_item_id: 8830, item_type: "task", subtype: "call", title: "Call Sari — FAN upgrade", time: "10:00", customer_id: 100245, status: "open", source: "push" },
  { agenda_item_id: 8841, item_type: "appointment", subtype: "one_to_one", title: "One-to-one · Michelle Tan", time: "14:00 – 15:00", customer_id: 100311, status: "open", source: "manual" },
  { agenda_item_id: 8852, item_type: "task", subtype: "follow_up", title: "Follow up Ayu — wishlist", time: "16:30", customer_id: 100402, status: "open", source: "manual" },
  { agenda_item_id: 8805, item_type: "appointment", subtype: "personalisation", title: "Personalisation · Laura S.", time: "11:00 – 11:30", customer_id: 100733, status: "done", source: "manual" },
];

export const LISTS = [
  { list_id: 501, name: "November birthdays — FAN+", list_type: "dynamic", member_count: 18, filter: "Tier ≥ FAN · birthday ≤ 30 days" },
  { list_id: 503, name: "Not contacted 90+ days", list_type: "dynamic", member_count: 41, filter: "last_reach_out_at > 90 days" },
  { list_id: 510, name: "My Client Book", list_type: "client_book", member_count: 142, filter: "Manual" },
  { list_id: 502, name: "Le Pliage Re-Play Preview", list_type: "event_guests", member_count: 26, filter: "Event · 5 Dec 2026" },
];

export const PRODUCTS = [
  { sku: "L1899089P59", product_name: "Le Pliage Original M", collection: "Le Pliage", price_idr: 2450000, color: "#1f3557", stock: { 3: 4, 4: 2, 5: 0, 6: 3, 7: 1 } },
  { sku: "L10165HFP", product_name: "Roseau Shoulder Bag", collection: "Roseau", price_idr: 9900000, color: "#6b3e26", stock: { 3: 2, 4: 0, 5: 1, 6: 0, 7: 0 } },
  { sku: "L2605HPN", product_name: "Le Foulonné Tote", collection: "Le Foulonné", price_idr: 12800000, color: "#2b2b2b", stock: { 3: 1, 4: 1, 5: 2, 6: 0, 7: 0 } },
  { sku: "L10114HAZ", product_name: "Box-Trot Crossbody", collection: "Box-Trot", price_idr: 6900000, color: "#9c6b3c", stock: { 3: 0, 4: 3, 5: 1, 6: 2, 7: 0 } },
  { sku: "L1621HPN", product_name: "Épure Handbag S", collection: "Épure", price_idr: 8400000, color: "#c9b79c", stock: { 3: 3, 4: 0, 5: 0, 6: 1, 7: 2 } },
  { sku: "L3418HPN", product_name: "Le Pliage Pouch", collection: "Le Pliage", price_idr: 1450000, color: "#8dc63f", stock: { 3: 9, 4: 6, 5: 4, 6: 5, 7: 3 } },
];

export const TEMPLATES = [
  { template_id: 14, code: "vip_upgrade_thanks", title: "Thank you — new tier", moment: "upgrade", wa_template_name: "lc_vip_upgrade_id",
    scope: "global", boutique_id: null, created_by: "Dimas Hartono", wa_category: "marketing", language: "id", meta_status: "approved",
    body: "Halo {{first_name}}, terima kasih telah menjadi bagian dari Longchamp. Kini Anda berada di tier {{tier}}. Saya {{sa_name}} dari {{boutique_name}} siap membantu." },
  { template_id: 9, code: "birthday_greeting", title: "Birthday greeting", moment: "birthday", wa_template_name: "lc_birthday_id",
    scope: "global", boutique_id: null, created_by: "Dimas Hartono", wa_category: "marketing", language: "id", meta_status: "approved",
    body: "Selamat ulang tahun, {{first_name}}! Semoga hari Anda menyenangkan. Salam hangat dari {{sa_name}} dan tim {{boutique_name}}." },
  { template_id: 21, code: "event_invite", title: "Event invitation — Re-Play preview", moment: "event", wa_template_name: "lc_pi_event_replay_id",
    scope: "boutique", boutique_id: 3, created_by: "Rina Wijaya", wa_category: "marketing", language: "id", meta_status: "approved",
    body: "Halo {{first_name}}, kami mengundang Anda ke preview koleksi terbaru di {{boutique_name}}. Balas YA untuk konfirmasi." },
  { template_id: 33, code: "repair_ready", title: "Repair ready for pick-up", moment: "after_sales", wa_template_name: "lc_pi_repair_ready_id",
    scope: "boutique", boutique_id: 3, created_by: "Rina Wijaya", wa_category: "utility", language: "id", meta_status: "pending",
    body: "Halo {{first_name}}, produk Anda sudah selesai diperbaiki dan siap diambil di {{boutique_name}}." },
  { template_id: 35, code: "flash_offer", title: "Private sale access", moment: "general", wa_template_name: "lc_pi_private_sale_id",
    scope: "boutique", boutique_id: 3, created_by: "Rina Wijaya", wa_category: "marketing", language: "id", meta_status: "rejected",
    rejection_reason: "Promotional content needs a clear opt-out and no misleading urgency.",
    body: "Halo {{first_name}}, HANYA HARI INI diskon untuk Anda!" },
  { template_id: 40, code: "gi_welcome", title: "Welcome — Grand Indonesia", moment: "new_client", wa_template_name: "lc_gi_welcome_id",
    scope: "boutique", boutique_id: 5, created_by: "Sinta Halim", wa_category: "marketing", language: "id", meta_status: "approved",
    body: "Halo {{first_name}}, terima kasih telah berkunjung ke {{boutique_name}}." },
  { template_id: 30, code: "wishlist_share", title: "Wishlist selection", moment: "wishlist", wa_template_name: null,
    scope: "global", boutique_id: null, created_by: "Dimas Hartono", wa_category: null, language: "id", meta_status: "session",
    body: "Halo {{first_name}}, berikut pilihan dari saya untuk Anda: {{links}}" },
];

/* templates a Sales Agent of boutique 3 can use */
export const usableTemplates = (boutiqueId = 3) =>
  TEMPLATES.filter((t) => t.meta_status === "approved" && (t.scope === "global" || t.boutique_id === boutiqueId));

export const PUSH_RULES = [
  { rule_id: 1, push_type: "vip_birthday", is_active: true, tiers: "FAN, FRIEND, FAMILY", lead_days: 7 },
  { rule_id: 2, push_type: "high_value_upgrade", is_active: true, tiers: "FAN, FRIEND, FAMILY", lead_days: 7 },
  { rule_id: 3, push_type: "vip_downgrade", is_active: true, tiers: "FAN, FRIEND, FAMILY", lead_days: 3 },
  { rule_id: 4, push_type: "beginner_plus_upgrade", is_active: false, tiers: "LOVER", lead_days: 14 },
];

export const KPI = {
  sales_agent: { actions: 62, actions_per_pos_day: 2.1, conversion_rate: 8, sales_idr: 48500000, avg_conversion_days: 6.4, vs_last_month_pts: -1 },
  supervisor: { actions: 165, actions_per_pos_day: 5.5, conversion_rate: 9, sales_idr: 151800000, avg_conversion_days: 7.1, vs_last_month_pts: 2 },
  super_admin: { actions: 812, actions_per_pos_day: 5.4, conversion_rate: 7, sales_idr: 742000000, avg_conversion_days: 8.0, vs_last_month_pts: -3 },
};

export const BY_CHANNEL = [
  { channel: "WhatsApp", share: 58, conversion_rate: 9 },
  { channel: "Call", share: 22, conversion_rate: 7 },
  { channel: "SMS", share: 8, conversion_rate: 3 },
  { channel: "Email", share: 12, conversion_rate: 2 },
];

export const BY_BOUTIQUE = [
  { boutique_name: "Plaza Indonesia", actions: 165, conversion_rate: 9, sales_idr: 151800000 },
  { boutique_name: "Grand Indonesia", actions: 204, conversion_rate: 8, sales_idr: 228400000 },
  { boutique_name: "Senayan City", actions: 171, conversion_rate: 6, sales_idr: 139000000 },
  { boutique_name: "Pondok Indah Mall 3", actions: 148, conversion_rate: 7, sales_idr: 120600000 },
  { boutique_name: "Pakuwon Mall", actions: 124, conversion_rate: 5, sales_idr: 102200000 },
];

export const REACH_REASONS = ["push", "wishlist", "birthday", "clienteling_kit", "services_appointment", "event_invite", "new_client_welcome", "after_sales", "other"];

export const idr = (n) => "IDR " + Math.round(n).toLocaleString("id-ID");
export const idrShort = (n) => (n >= 1e9 ? `IDR ${(n / 1e9).toFixed(1)} M` : n >= 1e6 ? `IDR ${(n / 1e6).toFixed(1)} jt` : idr(n));
export const tag = (t) => t.replace(/_/g, " ");
