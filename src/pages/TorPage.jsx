import { useMemo, useState } from "react";
import TOR from "../data/torSheets.json";

/* Exported from TOR_Longchamp_Clienteling.xlsx (Template TOR): same rows as the Excel file. */
const SHEETS = [
  { key: 0, label: { en: "IT Delivery (Mandays)", id: "IT Delivery (Mandays)" }, desc: { en: "What Cekat IT Delivery builds: CRM as database, API connections, Clienteling API (Go), n8n, data integrity, go-live. Mandays are assessed by the PM.", id: "Yang dibangun Cekat IT Delivery: CRM as database, koneksi API, Clienteling API (Go), n8n, data integrity, go-live. Mandays diisi PM setelah assessment." } },
  { key: 1, label: { en: "Cekat Product & Vendor (Additional Custom)", id: "Cekat Product & Vendor (Additional Custom)" }, desc: { en: "Additional Custom - Charge: what Cekat Product adds to the platform and what the Vendor builds in the mobile app.", id: "Additional Custom - Charge: yang ditambahkan Cekat Product ke platform dan yang dibangun Vendor di mobile app." } },
  { key: 2, label: { en: "API list", id: "Daftar API" }, desc: { en: "Every Clienteling API (Go) endpoint and every n8n API. Only GET and POST.", id: "Semua endpoint Clienteling API (Go) dan API n8n. Hanya GET dan POST." } },
  { key: 3, label: { en: "CRM as database", id: "CRM as Database" }, desc: { en: "Every Cekat CRM board and column, and which API reads and writes it.", id: "Semua board dan kolom Cekat CRM, dan API mana yang membaca dan menulisnya." } },
];

const MONO = new Set(["API Level & Contoh Variabel", "Path", "Kolom", "Contoh", "Panggilan ke Cekat / upstream"]);
const WIDTH = { Layanan: 150, "Sub Layanan": 260, "API Level & Contoh Variabel": 460, Deskripsi: 360, Note: 240, Mandays: 80, Path: 260, "Panggilan ke Cekat / upstream": 380, Judul: 220, Deskripsi_crm: 300 };

export default function TorPage({ lang }) {
  const tx = (en, id) => (lang === "id" ? id : en);
  const [tab, setTab] = useState(0);
  const [q, setQ] = useState("");
  const sheet = TOR.sheets[tab];

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return sheet.rows;
    const out = [];
    let pending = null;
    for (const r of sheet.rows) {
      if (r.section) {
        pending = r;
        continue;
      }
      if (r.cells.join(" ").toLowerCase().includes(s)) {
        if (pending) {
          out.push(pending);
          pending = null;
        }
        out.push(r);
      }
    }
    return out;
  }, [sheet, q]);

  const dataCount = rows.filter((r) => !r.section).length;
  const file = `${import.meta.env.BASE_URL}${TOR.file}`;

  return (
    <div className="mx-auto max-w-[1680px] px-4 pb-16 pt-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold text-[var(--lc-forest)]">TOR</h1>
          <p className="mt-2 max-w-3xl text-sm text-[var(--lc-muted)]">
            {tx(
              "Terms of reference in the Cekat TOR template: IT Delivery scope with mandays, Additional Custom - Charge for Cekat Product and the Vendor, the API list and the CRM as database. The same content as the Excel file.",
              "Term of reference dalam template TOR Cekat: lingkup IT Delivery dengan mandays, Additional Custom - Charge untuk Cekat Product dan Vendor, daftar API, dan CRM as database. Isinya sama dengan file Excel."
            )}
          </p>
        </div>
        <a href={file} download className="rounded-lg bg-[var(--lc-forest)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
          {tx("Download TOR (.xlsx)", "Unduh TOR (.xlsx)")}
        </a>
      </div>

      <div className="mt-6 flex flex-wrap gap-1.5" role="tablist">
        {SHEETS.map((s) => (
          <button
            key={s.key}
            role="tab"
            aria-selected={tab === s.key}
            onClick={() => {
              setTab(s.key);
              setQ("");
            }}
            className={`rounded-full px-3.5 py-1.5 text-sm transition ${tab === s.key ? "bg-[var(--lc-forest)] font-semibold text-white" : "bg-black/5 text-[var(--lc-forest)] hover:bg-black/10"}`}
          >
            {s.label[lang]} <span className="opacity-60">{TOR.sheets[s.key].rows.filter((r) => !r.section).length}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-[var(--lc-forest)]">{sheet.name}</h2>
          <p className="mt-1 max-w-3xl text-sm text-[var(--lc-muted)]">{SHEETS[tab].desc[lang]}</p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={tx("Search", "Cari")}
          aria-label={tx("Search", "Cari")}
          className="w-64 rounded-lg border border-black/15 bg-white px-3 py-1.5 text-sm"
        />
      </div>
      <p className="mt-3 text-xs text-[var(--lc-muted)]">
        {dataCount} {tx("rows", "baris")}
      </p>

      <div className="mt-2 max-h-[74vh] overflow-auto rounded-xl border border-black/10 bg-white">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead className="sticky top-0 z-10 bg-[#cfe2f3]">
            <tr>
              {sheet.header.map((h) => (
                <th key={h} style={{ minWidth: WIDTH[h] || 110 }} className="border-b border-black/10 px-3 py-2 font-semibold text-[var(--lc-forest)]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) =>
              r.section ? (
                <tr key={`s${i}`}>
                  <td colSpan={sheet.header.length} className="sticky left-0 bg-[#d9d9d9] px-3 py-2 font-semibold text-black">
                    {r.section}
                  </td>
                </tr>
              ) : (
                <tr key={i} className="align-top odd:bg-black/[0.015]">
                  {r.cells.map((c, j) => {
                    const h = sheet.header[j];
                    const prevSame = j === 0 && i > 0 && !rows[i - 1].section && rows[i - 1].cells[0] === c;
                    return (
                      <td key={j} className={`border-b border-black/5 px-3 py-2 ${j === 0 ? "font-semibold" : ""} ${h === "Mandays" ? "bg-[#fff2cc] text-center" : ""}`}>
                        {prevSame ? <span className="text-black/25">〃</span> : MONO.has(h) ? <pre className="whitespace-pre-wrap font-mono text-[11.5px] leading-snug">{c}</pre> : <span className="whitespace-pre-line">{c}</span>}
                      </td>
                    );
                  })}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-[var(--lc-muted)]">
        {tx("Yellow Mandays cells are filled in by the PM after assessment. Paths and base URLs are proposals to confirm with Cekat Product and IT Delivery.", "Kolom Mandays kuning diisi PM setelah assessment. Path dan base URL adalah usulan yang perlu dikonfirmasi dengan Cekat Product dan IT Delivery.")}
      </p>
    </div>
  );
}
