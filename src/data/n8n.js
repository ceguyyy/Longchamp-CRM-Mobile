/*
 * n8n APIs & workflows built by Cekat IT Delivery. Only POST (webhook) and scheduled triggers.
 * Base: https://n8n.cekat.ai/webhook/lc (usulan). Internal APIs need header X-Internal-Key.
 */
export const N8N_APIS = [
  {
    "id": "N-01",
    "method": "POST",
    "path": "/webhook/lc/cekat/message",
    "kind": "Webhook masuk dari Cekat",
    "ref": "WH-04",
    "desc": "Message Sent / Message Received Cekat → update last_reach_out_at Golden Record (sent) dan penanda sesi 24 jam (received).",
    "note": "Cekat Webhook (sudah ada). Memanggil: PATCH Golden Record item.",
    "example": "POST /webhook/lc/cekat/message\n  body (dari Cekat):\n   - event = message.sent | message.received\n   - conversation_id = conv_88123\n   - contact.phone = +6281234567890\n   - inbox_id = ibx_pi_wa\n   - timestamp = 2026-11-17T10:12:00+07:00\n  menulis:\n   - Golden Record.last_reach_out_at = 2026-11-17T10:12:00+07:00\n   - Golden Record.last_reach_out_channel = whatsapp\n  response: 200 { ok: true }"
  },
  {
    "id": "N-02",
    "method": "POST",
    "path": "/webhook/lc/cekat/board-item",
    "kind": "Webhook masuk dari Cekat (router)",
    "ref": "WH-05, WH-06",
    "desc": "Satu endpoint router per board_id + event: Golden Record assigned_user berubah → pindahkan push open ke SA baru + FCM; Transactions baru → evaluasi tracking rules (N-12); Segment History baru (tier berubah) → cocokkan Push Rules → Pushes + Agenda + FCM; Agenda dibuat di UI Cekat → FCM ke assignee.",
    "note": "Butuh Cekat Product CP-05 (webhook board item).",
    "example": "POST /webhook/lc/cekat/board-item\n  body (CP-05):\n   - event = board_item.created | board_item.updated\n   - board_id = {segmentHistoryBoardId}\n   - item_id = 99812\n   - changed.assigned_user.old = agt_5521\n   - changed.assigned_user.new = agt_5530\n   - values.new_tier = VIP\n  router: board_id → cabang Golden Record / Transactions / Segment History / Agenda\n  response: 200 { ok: true, routed_to: \"segment_history\" }"
  },
  {
    "id": "N-03",
    "method": "POST",
    "path": "/webhook/lc/cekat/message-status",
    "kind": "Webhook masuk dari Cekat",
    "ref": "WH-07",
    "desc": "Status per penerima (sent, delivered, read, failed) → update delivery_status di Wishlist, Event Guests, Reach Out.",
    "note": "Butuh Cekat Product CP-06.",
    "example": "POST /webhook/lc/cekat/message-status\n  body (CP-06):\n   - message_id = wamid.HBgM…\n   - recipient = +6281234567890\n   - status = sent | delivered | read | failed\n   - error.code = 131026 (bila failed)\n   - timestamp = 2026-11-17T10:12:05+07:00\n  menulis: Wishlist / Event Guests / Reach Out.delivery_status = delivered\n  response: 200 { ok: true }"
  },
  {
    "id": "N-04",
    "method": "POST",
    "path": "/webhook/lc/shopify/products",
    "kind": "Webhook masuk dari Shopify",
    "ref": "WH-02",
    "desc": "products/update → hapus cache katalog Redis untuk SKU terkait (opsional; tanpa ini cache kedaluwarsa 15 menit).",
    "note": "Hanya katalog, bukan transaksi (transaksi sudah masuk lewat pipeline Golden Record).",
    "example": "POST /webhook/lc/shopify/products\n  header: X-Shopify-Hmac-Sha256 (verifikasi)\n  body (Shopify):\n   - id = 8812345678\n   - variants[].sku = L1899089001\n   - updated_at = 2026-11-17T09:00:00+07:00\n  aksi: DEL Redis catalog:sku:L1899089001\n  response: 200"
  },
  {
    "id": "N-05",
    "method": "POST",
    "path": "/webhook/lc/push/send",
    "kind": "API internal (dipanggil Clienteling API dan workflow lain)",
    "ref": "D-13",
    "desc": "Kirim notifikasi FCM. Body: user_ids[], title, body, deep_link, data. Ambil token device dari Users (CP-03), kirim per device, hapus token invalid. Response: sent, failed.",
    "note": "Kredensial FCM di Secret Manager.",
    "example": "POST /webhook/lc/push/send\n  header: X-Internal-Key\n  body:\n   - user_ids (int[], wajib) = [87]\n   - title (string, wajib) = Clienteling push baru\n   - body (string, wajib) = Ulang tahun Asti hari ini\n   - deep_link (string) = lc://customers/1201\n   - data (object) = {\"push_id\":3301}\n  response:\n   - sent = 2\n   - failed = 0\n   - invalid_tokens_removed = 0"
  },
  {
    "id": "N-06",
    "method": "POST",
    "path": "/webhook/lc/tracking/backfill",
    "kind": "API internal (dipanggil saat X-05 simpan rule)",
    "ref": "D-17",
    "desc": "Body: rule_id. Evaluasi ulang rule ke semua pelanggan dalam window → update tracking_tags + Customer Tag History. Response 202 + job_id.",
    "note": "Idempotent per (customer, rule).",
    "example": "POST /webhook/lc/tracking/backfill\n  header: X-Internal-Key\n  body:\n   - rule_id (int, wajib) = 1\n   - dry_run (bool) = false\n  response 202:\n   - job_id = trk_20261117_01\n   - status = queued\n  menulis: Golden Record.tracking_tags = [\"silverspoon\"], Customer Tag History"
  },
  {
    "id": "N-07",
    "method": "POST",
    "path": "/webhook/lc/lists/refresh",
    "kind": "API internal (dipanggil L-03 / L-05)",
    "ref": "D-10",
    "desc": "Body: list_id. Jalankan filter_json list dinamis → member_count, refreshed_at.",
    "note": "Butuh Cekat Product CP-04 (filter server-side).",
    "example": "POST /webhook/lc/lists/refresh\n  header: X-Internal-Key\n  body:\n   - list_id (int, wajib) = 41\n  response:\n   - list_id = 41\n   - member_count = 18\n   - refreshed_at = 2026-11-17T02:30:00+07:00"
  },
  {
    "id": "N-08",
    "method": "CRON",
    "path": "Cron harian 06:00 WIB",
    "kind": "Job terjadwal",
    "ref": "J-01",
    "desc": "Clienteling push scheduler: Push Rules aktif → VIP birthday dari Golden Record + Segment History baru (cadangan bila CP-05 belum ada) → Pushes + Agenda task → N-05. Satu push aktif per (pelanggan, push_type).",
    "note": "",
    "example": "Cron 0 6 * * * (Asia/Jakarta)\n  baca: Push Rules (is_active=true), Golden Record (birthdate hari ini, tier VIP), Segment History (kemarin)\n  tulis Pushes:\n   - customer_id = 1201\n   - push_type = vip_birthday\n   - assigned_user = agt_5521\n   - due_date = 2026-11-17\n   - status = open\n  lalu: Agenda task + N-05"
  },
  {
    "id": "N-09",
    "method": "CRON",
    "path": "Cron harian 01:00 WIB",
    "kind": "Job terjadwal",
    "ref": "J-02",
    "desc": "Atribusi konversi: Reach Out & Wishlist dalam jendela atribusi (App Settings, default 30 hari) → cari transaksi pelanggan setelahnya di board Transactions → isi converted_transaction_id; wishlist → purchased.",
    "note": "",
    "example": "Cron 0 1 * * *\n  baca: Reach Out & Wishlist (status sent, ≤ attribution_window_days), Transactions\n  tulis Reach Out / Wishlist:\n   - converted_transaction_id = SO/2026/11/0451\n   - converted_at = 2026-11-16\n   - status (wishlist) = purchased"
  },
  {
    "id": "N-10",
    "method": "CRON",
    "path": "Cron harian 02:00 WIB",
    "kind": "Job terjadwal",
    "ref": "J-03",
    "desc": "Agregasi KPI per sa / pos / country → KPI Snapshot: actions, conversion rate, sales, rata-rata hari konversi, WhatsApp terkirim, per alasan, wishlist, push.",
    "note": "Tanpa KPI per channel telepon / SMS / email (tidak tercatat di Cekat).",
    "example": "Cron 0 2 * * *\n  tulis KPI Snapshot:\n   - period = 2026-11\n   - level = pos\n   - boutique_id = 3\n   - actions = 165\n   - conversion_rate = 9\n   - sales_idr = 151800000\n   - whatsapp_sent = 96\n   - dimension = reason · dimension_value = wishlist"
  },
  {
    "id": "N-11",
    "method": "CRON",
    "path": "Cron tiap 15 menit",
    "kind": "Job terjadwal",
    "ref": "J-05",
    "desc": "Status template Meta: template pending → cek status → approved / rejected + alasan → N-05 ke pembuat.",
    "note": "Open API template Cekat.",
    "example": "Cron */15 * * * *\n  baca: Template Library (meta_status = pending)\n  panggil: Open API template Cekat (status)\n  tulis:\n   - meta_status = approved | rejected\n   - rejection_reason = INVALID_FORMAT\n  lalu: N-05 ke created_by_user_id"
  },
  {
    "id": "N-12",
    "method": "CRON",
    "path": "Dipicu N-02 + cron harian 03:00 WIB",
    "kind": "Job terjadwal",
    "ref": "J-08",
    "desc": "Evaluasi tracking rules Golden Record (mis. Silverspoon, parameter TBC): grup kondisi (ATAU antar grup, DAN di dalam grup) atas SKU, harga SKU, total transaksi, total belanja → tracking_tags + Customer Tag History; push ke SA bila notify_sa. Refund/cancel dievaluasi ulang.",
    "note": "Parameter Silverspoon TBC dari Longchamp; diisi di layar Tracking rules tanpa ubah workflow.",
    "example": "Dipicu N-02 (Transactions baru) + cron 0 3 * * *\n  baca: Tracking Rules, Transactions + Lines pelanggan dalam window_days\n  contoh rule (TBC): groups[0].sku_any_of = [LONGCHAMP001]; groups[1].sku_any_of = [A,B,C] + sku_unit_price_idr ≥ 40000000 + transaction_total_idr ≥ 50000000\n  tulis:\n   - Golden Record.tracking_tags = [\"silverspoon\"]\n   - Customer Tag History: rule_code = silverspoon, matched_group = 2, matched_skus = [A], trigger_transaction_id = SO/2026/11/0451"
  },
  {
    "id": "N-13",
    "method": "CRON",
    "path": "Cron tiap 5 menit",
    "kind": "Job terjadwal",
    "ref": "J-06",
    "desc": "Reminder agenda: appointment / task yang mulai dalam 30 menit → N-05.",
    "note": "",
    "example": "Cron */5 * * * *\n  baca: Agenda (start_at dalam 30 menit, reminded=false)\n  lalu: N-05 { user_ids:[87], title: \"Appointment 10:30\", deep_link: \"lc://agenda/77\" }\n  tulis: Agenda.reminded = true"
  },
  {
    "id": "N-14",
    "method": "CRON",
    "path": "Cron harian 02:30 WIB",
    "kind": "Job terjadwal",
    "ref": "J-04",
    "desc": "Evaluasi semua list dinamis (sama dengan N-07 untuk tiap list).",
    "note": "",
    "example": "Cron 30 2 * * *\n  untuk tiap Lists (type=dynamic): sama dengan N-07\n  tulis: Lists.member_count, refreshed_at"
  },
  {
    "id": "N-15",
    "method": "CRON",
    "path": "Cron mingguan Senin 07:00 WIB",
    "kind": "Job terjadwal",
    "ref": "J-07",
    "desc": "Data quality: pelanggan baru dari app yang kemungkinan duplikat, nomor invalid, pelanggan tanpa assigned_user, dead-letter → email ke IT Delivery & tim CRM Longchamp.",
    "note": "",
    "example": "Cron 0 7 * * 1\n  output email:\n   - possible_duplicates = 3 (phone_e164 sama)\n   - invalid_phone = 1\n   - unassigned_customers = 12\n   - dead_letter = 0"
  }
];
