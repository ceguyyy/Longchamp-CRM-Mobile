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
      en: "Integrates the documented Cekat API, builds n8n workflows, the BFF and the mobile app.",
      id: "Integrasi API Cekat yang sudah terdokumentasi, membangun workflow n8n, BFF, dan aplikasi mobile.",
    },
  },
  product: {
    name: { en: "Cekat Product", id: "Cekat Product" },
    short: "Cekat Product",
    desc: {
      en: "Builds platform capabilities that do not exist in the Cekat API docs yet.",
      id: "Membangun kapabilitas platform yang belum ada di dokumentasi API Cekat.",
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
    title: { en: "Role-scoped Contacts & Board API", id: "Contacts & Board API yang mengikuti role" },
    desc: {
      en: "API results honour Role Hierarchy visibility for the calling user: own, subordinates, peers (if shared) and unassigned contacts.",
      id: "Hasil API mengikuti visibilitas Role Hierarchy untuk user pemanggil: milik sendiri, bawahan, peer (jika di-share), dan kontak tanpa assignee.",
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
      en: "Documented events today: conversation, message, contact updated. Needed so tasks or reassignments made in the Cekat CRM UI reach the app.",
      id: "Event yang terdokumentasi saat ini: conversation, message, contact updated. Dibutuhkan agar task atau reassignment dari UI Cekat CRM sampai ke app.",
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
