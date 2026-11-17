/*
 * Implementors on the Cekat side
 *
 *  itdev   — Cekat IT Dev. Builds with what is ALREADY in the Cekat API docs
 *            (docs.cekat.ai/api-documentation: Contact, Board, Conversation, Message,
 *            Broadcast, Tickets, Orders, Webhooks) + n8n / BFF / mobile app.
 *  product — Cekat Product. Builds capabilities that are NOT in the Cekat API docs yet.
 *
 * Source availability (per data source line):
 *  available — in the Cekat API docs (or standard Shopify / Odoo)  → IT Dev integrates
 *  internal  — built inside this project (n8n, BFF, app)            → IT Dev builds
 *  product   — not in the docs                                       → Cekat Product builds
 */

export const IMPLEMENTORS = {
  itdev: {
    name: { en: "Cekat IT Dev", id: "Cekat IT Dev" },
    short: "IT Dev",
    desc: {
      en: "Integrates the documented Cekat API, builds n8n workflows, the BFF and the mobile app. Does not implement login or RBAC.",
      id: "Integrasi API Cekat yang sudah terdokumentasi, membangun workflow n8n, BFF, dan aplikasi mobile. Tidak mengimplementasikan login maupun RBAC.",
    },
  },
  product: {
    name: { en: "Cekat Product", id: "Cekat Product" },
    short: "Cekat Product",
    desc: {
      en: "Owns sign-in, users and RBAC end to end, and builds every capability not in the Cekat API docs yet.",
      id: "Memegang login, user, dan RBAC dari ujung ke ujung, serta membangun semua kapabilitas yang belum ada di dokumentasi API Cekat.",
    },
  },
  external: {
    name: { en: "Longchamp / vendor", id: "Longchamp / vendor" },
    short: "External",
    desc: {
      en: "Shopify and Odoo POS — configured by Longchamp or its vendors.",
      id: "Shopify dan Odoo POS — dikonfigurasi oleh Longchamp atau vendornya.",
    },
  },
};

export const ownerOf = (status) => (status === "product" ? "product" : "itdev");

/* Cekat Product backlog — referenced from use cases (cp) and activity nodes (cp) */
export const CP_BACKLOG = [
  {
    id: "CP-01",
    priority: "Must",
    title: { en: "Third-party app sign-in for CRM users", id: "Login aplikasi pihak ketiga untuk user CRM" },
    desc: {
      en: "OAuth / SSO or per-user token so the mobile app acts as the signed-in Cekat CRM user. Today only a workspace api_key exists.",
      id: "OAuth / SSO atau token per user supaya aplikasi mobile bertindak sebagai user Cekat CRM yang login. Saat ini hanya ada api_key level workspace.",
    },
  },
  {
    id: "CP-02",
    priority: "Must",
    title: { en: "RBAC on Board API (Golden Record + clienteling boards)", id: "RBAC pada Board API (Golden Record + board clienteling)" },
    desc: {
      en: "Reads AND writes on board items are checked against Role Hierarchy for the calling user, using the Agents column assigned_user on the Golden Record (own, subordinates, peers if shared, unassigned); items of other boards follow their customer. Out-of-scope calls return 403.",
      id: "Baca DAN tulis item board dicek terhadap Role Hierarchy untuk user pemanggil, memakai kolom Agents assigned_user di Golden Record (sendiri, bawahan, peer jika di-share, tanpa assignee); item board lain mengikuti pelanggannya. Panggilan di luar scope mengembalikan 403.",
    },
  },
  {
    id: "CP-03",
    priority: "Must",
    title: { en: "Users & Role Hierarchy API", id: "API Users & Role Hierarchy" },
    desc: {
      en: "Read users, CRM role, reports-to and authority (Administrator / Basic User) — to resolve RBAC and boutique scope.",
      id: "Baca user, role CRM, reports-to, dan authority (Administrator / Basic User) — untuk menentukan RBAC dan scope boutique.",
    },
  },
  {
    id: "CP-04",
    priority: "Should",
    title: { en: "Server-side filter & search on board items", id: "Filter & search board item di server" },
    desc: {
      en: "Filter by column values and date ranges (e.g. birthday in next 30 days, tier, assigned SA) instead of paging the whole board.",
      id: "Filter berdasarkan nilai kolom dan rentang tanggal (mis. ulang tahun 30 hari ke depan, tier, SA) tanpa menarik seluruh board.",
    },
  },
  {
    id: "CP-05",
    priority: "Should",
    title: { en: "Webhook for CRM board item created / updated", id: "Webhook untuk board item dibuat / diubah" },
    desc: {
      en: "Documented events today: conversation, message, contact updated. Needed for Golden Record changes (assigned_user, tier via Segment History from the existing pipeline) and tasks made in the Cekat CRM UI to reach the app.",
      id: "Event yang terdokumentasi saat ini: conversation, message, contact updated. Dibutuhkan agar perubahan Golden Record (assigned_user, tier lewat Segment History dari pipeline yang berjalan) dan task dari UI Cekat CRM sampai ke app.",
    },
  },
  {
    id: "CP-06",
    priority: "Should",
    title: { en: "Recipient-level message status", id: "Status pesan per penerima" },
    desc: {
      en: "Sent / delivered / read per contact for broadcast and template sends, for 30-day conversion attribution.",
      id: "Status terkirim / diterima / dibaca per kontak untuk broadcast dan template, untuk atribusi konversi 30 hari.",
    },
  },
];
