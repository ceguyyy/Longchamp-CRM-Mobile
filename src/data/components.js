/* Components built per party (mirrors section 5 of the TOR doc) */
export const PARTIES = {
  vendor: { name: "Vendor", scope: "Mobile app saja (UI, state, integrasi ke Clienteling API, kamera, push di device, rilis store)." },
  itdelivery: { name: "Cekat IT Delivery", scope: "Clienteling API (Go), setup Cekat CRM, n8n, integrasi Shopify/Odoo/FCM, dan seluruh data integrity di engine Cekat." },
  product: { name: "Cekat Product", scope: "Fitur platform Cekat yang belum ada di dokumentasi API: login, RBAC, users, filter, webhook board, status pesan." },
};

export const TECH_STACK = [
  ["Mobile app", "ReactJS 19 + Vite, HeroUI v3, Tailwind CSS v4, React Router, TanStack Query", "Vendor"],
  ["Packaging native", "Capacitor (iOS + Android); alternatif PWA", "Vendor"],
  ["Barcode", "ML Kit barcode scanning (plugin Capacitor), EAN-13", "Vendor"],
  ["Clienteling API", "Go 1.23+, chi, OpenAPI 3.1 + oapi-codegen, validator, zerolog, OpenTelemetry", "Cekat IT Delivery"],
  ["Cache", "Redis 7 — cache katalog, idempotency, rate limit (bukan sumber data)", "Cekat IT Delivery"],
  ["Database", "Cekat CRM: Contacts + 15 board, diakses hanya lewat Cekat API", "Cekat IT Delivery + Cekat Product"],
  ["Messaging", "Cekat Chat: Message, Broadcast, Tickets, Open API template (WhatsApp)", "Cekat (platform)"],
  ["Orkestrasi", "n8n self-hosted: webhook, job, data integrity", "Cekat IT Delivery"],
  ["Push", "Firebase Cloud Messaging (APNs untuk iOS)", "Vendor (client) + IT Delivery (server)"],
  ["Commerce", "Shopify Admin GraphQL, Odoo JSON-RPC", "Eksternal"],
  ["Infra", "Docker, Cloud Run atau setara, GitHub Actions, Secret Manager", "Cekat IT Delivery"],
];

const C = (id, party, name, work, deps) => ({ id, party, name, work, deps });
export const COMPONENTS = [
  C("V-01", "vendor", "Shell app, bottom tab per role, tema Longchamp", "Router, tab bar 4 + More, HeroUI theme", "—"),
  C("V-02", "vendor", "Login, aktivasi undangan, lupa password", "Form + simpan token aman (Keychain/Keystore)", "A-01..A-05, CP-01"),
  C("V-03", "vendor", "Home per role", "Hero, tile, push, agenda, ringkasan KPI", "H-01, A-07"),
  C("V-04", "vendor", "Cari pelanggan, profil, registrasi", "Search, filter, Golden Record, love tags, komentar, after-sales, timeline, connect/disconnect", "C-01..C-12"),
  C("V-05", "vendor", "Reach Out", "Eligibility, channel, template per momen ID/EN, kirim, alasan + VALIDATE", "C-12, R-01, R-02, T-01"),
  C("V-06", "vendor", "Daftar pelanggan & event", "List manual/dinamis, share, sort, member, welcome, RSVP, hadir", "L-01..L-06, E-01..E-03"),
  C("V-07", "vendor", "Aksi & agenda", "Push, agenda, slot waktu, boutique selector", "P-01, P-02, G-01..G-04"),
  C("V-08", "vendor", "Katalog, produk, scan barcode, stok", "Kamera ML Kit, kartu produk, stok per boutique, tiket dari produk", "K-01..K-04, C-11"),
  C("V-09", "vendor", "Wishlist pelanggan", "Pilih pelanggan, simpan, hapus, kirim", "W-01..W-04"),
  C("V-10", "vendor", "KPI & tim", "KPI per level, channel, wishlist, push completion, tim", "M-01, M-02"),
  C("V-11", "vendor", "Admin: template WhatsApp, aturan push, user", "Builder template + preview, status Meta, push rules, user", "T-01..T-04, X-01..X-04"),
  C("V-12", "vendor", "Push notification & rilis", "Registrasi token, deep link, build iOS/Android, store listing", "A-06"),
  C("D-01", "itdelivery", "Clienteling API (Go)", "55 endpoint + OpenAPI spec + mock server untuk Vendor", "CP-01..CP-04"),
  C("D-02", "itdelivery", "Setup Cekat CRM", "Field Contacts + 15 board (Boutiques, Transactions, Reach Out, Wishlist, Agenda, Pushes, Lists, List Members, Events, Event Guests, Love Tags, Comments, Template Library, Push Rules, KPI Snapshot)", "Akses workspace"),
  C("D-03", "itdelivery", "Identity resolution & Golden Record", "Telepon E.164 → email → buat baru, merge, Contact Owner", "D-02"),
  C("D-04", "itdelivery", "Ingest Shopify", "orders/create, orders/updated, orders/cancelled, refunds/create, products/update", "D-03"),
  C("D-05", "itdelivery", "Ingest Odoo POS", "base.automation pos.order (create/refund) → n8n", "D-03"),
  C("D-06", "itdelivery", "Kalkulasi tier & downgrade", "Sales 12 bulan bersih → LIKER..FAMILY", "D-04, D-05"),
  C("D-07", "itdelivery", "Scheduler clienteling push (J-01)", "Push Rules → Pushes + Agenda + FCM", "D-06, X-03"),
  C("D-08", "itdelivery", "Atribusi konversi 30 hari (J-02)", "Reach Out & Wishlist → transaksi", "D-04, D-05"),
  C("D-09", "itdelivery", "Agregasi KPI (J-03)", "KPI Snapshot per sa / pos / country", "D-08"),
  C("D-10", "itdelivery", "Evaluasi list dinamis (J-04)", "member_count, refreshed_at", "CP-04"),
  C("D-11", "itdelivery", "Sinkron status template (J-05)", "Polling Meta 15 menit", "Open API template"),
  C("D-12", "itdelivery", "Listener webhook Cekat", "Message, Contact updated, board item, message status", "Webhook Cekat, CP-05, CP-06"),
  C("D-13", "itdelivery", "Sender push FCM", "Notifikasi push, reminder agenda (J-06)", "A-06"),
  C("D-14", "itdelivery", "Data quality & rekonsiliasi (J-07)", "Duplikat, nomor invalid, dead-letter", "D-03..D-05"),
  C("D-15", "itdelivery", "Observability", "Log, trace, alert", "D-01"),
  C("D-16", "itdelivery", "Migrasi data awal", "Pelanggan + transaksi 24 bulan", "D-03"),
  C("CP-01", "product", "Login pihak ketiga + token user", "Login, refresh, revoke, undangan, reset password", "—"),
  C("CP-02", "product", "RBAC di Contacts & Board API", "Filter baca + 403 tulis dari Role Hierarchy + Contact Owner", "CP-01, CP-03"),
  C("CP-03", "product", "Users & Role Hierarchy API", "Role, reports-to, boutique, active", "—"),
  C("CP-04", "product", "Filter & search server-side", "Filter kolom, rentang tanggal, sort, cursor, count", "—"),
  C("CP-05", "product", "Webhook board item", "board_item.created / updated", "—"),
  C("CP-06", "product", "Status pesan per penerima", "sent, delivered, read, failed", "—"),
];

