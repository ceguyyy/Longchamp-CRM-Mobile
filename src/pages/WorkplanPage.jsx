import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Chip } from "@heroui/react";
import { PARTIES, PARTY_LABEL, PARTY_ORDER, componentRows, apiRows, variableRows, writeRows, jobRows, appRows } from "../data/workplan";

const PARTY_COLOR = { vendor: "default", itdelivery: "accent", product: "warning", existing: "success" };
const METHOD_COLOR = { GET: "success", POST: "accent", PATCH: "warning", PUT: "warning", DELETE: "danger" };
const LOC_COLOR = { Header: "default", Query: "success", Body: "accent", Response: "warning" };

const pre = (v) => <span className="whitespace-pre-line">{v}</span>;
const code = (v) => <code className="text-[12px]">{v}</code>;
const mono = (v) => <code className="break-all text-[11.5px] text-[var(--lc-muted)]">{v}</code>;
const party = (p) => (
  <Chip size="sm" variant="soft" color={PARTY_COLOR[p]} className="whitespace-nowrap">
    {PARTY_LABEL[p]}
  </Chip>
);

const TABS = [
  {
    key: "components", owner: "Semua pihak", rows: componentRows,
    title: { en: "Components", id: "Komponen" },
    desc: { en: "Every component per party.", id: "Semua komponen per pihak." },
    cols: [
      ["id", "ID", 70], ["party", { en: "Built by", id: "Dikerjakan oleh" }, 170, party], ["name", { en: "Component", id: "Komponen" }, 260],
      ["work", { en: "Scope of work", id: "Lingkup pekerjaan" }, 420], ["deps", { en: "Depends on", id: "Dependensi" }, 180],
    ],
    csv: (r) => ({ ...r, party: PARTY_LABEL[r.party] }),
  },
  {
    key: "api", owner: "Cekat IT Dev / Delivery", rows: apiRows,
    title: { en: "API", id: "API" },
    desc: { en: "57 Clienteling API endpoints (Go), built by Cekat IT Dev. Cekat Product items they need are listed per endpoint.", id: "57 endpoint Clienteling API (Go), dibangun Cekat IT Dev. Item Cekat Product yang dibutuhkan dicantumkan per endpoint." },
    cols: [
      ["id", "ID", 60], ["method", "Method", 80, (v) => <Chip size="sm" variant="soft" color={METHOD_COLOR[v.split(" ")[0]] || "default"}>{v}</Chip>],
      ["path", "Path", 230, code], ["title", { en: "Title", id: "Judul" }, 200], ["group", { en: "Group", id: "Grup" }, 150],
      ["cp", { en: "Needs Cekat Product", id: "Butuh Cekat Product" }, 130], ["roles", "Role", 160], ["uc", "Use case", 90],
      ["upstream", { en: "Calls to Cekat / upstream", id: "Panggilan ke Cekat / upstream" }, 320, pre], ["logic", "Logic", 440, pre], ["errors", "Error", 200, pre],
    ],
  },
  {
    key: "vars", owner: "Cekat IT Dev / Delivery (dipakai Vendor)", rows: variableRows,
    title: { en: "API variables", id: "Variabel API" },
    desc: { en: "Header, query, body and response of every endpoint down to the variable. Response fields are written as paths (user.role, data[].tier).", id: "Header, query, body, dan response tiap endpoint sampai level variabel. Field response ditulis sebagai path (user.role, data[].tier)." },
    cols: [
      ["endpoint", "Endpoint", 90], ["path", { en: "Method + path", id: "Method + path" }, 250, code],
      ["loc", { en: "Location", id: "Lokasi" }, 100, (v) => <Chip size="sm" variant="soft" color={LOC_COLOR[v]}>{v}</Chip>],
      ["name", { en: "Variable", id: "Variabel" }, 230, code], ["type", { en: "Type", id: "Tipe" }, 110], ["req", { en: "Required", id: "Wajib" }, 70],
      ["desc", { en: "Description", id: "Deskripsi" }, 360], ["ex", { en: "Example", id: "Contoh" }, 260, mono],
    ],
    filter: { key: "loc", values: ["Header", "Query", "Body", "Response"] },
  },
  {
    key: "writes", owner: "Cekat IT Dev / Delivery", rows: writeRows,
    title: { en: "Writes to Cekat", id: "Tulis ke Cekat" },
    desc: { en: "Every insert or update from the app and the ordered Cekat CRM / Cekat API calls with their payload.", id: "Setiap insert atau update dari app dan urutan panggilan Cekat CRM / Cekat API beserta payload-nya." },
    cols: [
      ["endpoint", "Endpoint", 100], ["title", { en: "App action", id: "Aksi di app" }, 180], ["step", { en: "Step", id: "Urutan" }, 60],
      ["target", { en: "Target in Cekat", id: "Target di Cekat" }, 240], ["call", { en: "Cekat API call", id: "Panggilan Cekat API" }, 300, code],
      ["payload", { en: "Payload / variables", id: "Payload / variabel" }, 460, mono], ["verify", { en: "Verify path", id: "Verifikasi path" }, 150],
    ],
  },
  {
    key: "jobs", owner: "Cekat IT Dev / Delivery (n8n)", rows: jobRows,
    title: { en: "Webhooks & jobs", id: "Webhook & Job" },
    desc: { en: "Inbound webhooks and scheduled jobs in n8n.", id: "Webhook masuk dan job terjadwal di n8n." },
    cols: [
      ["id", "ID", 60], ["kind", { en: "Type", id: "Jenis" }, 130], ["when", { en: "Source / schedule", id: "Sumber / jadwal" }, 200],
      ["name", { en: "Event / name", id: "Event / nama" }, 260], ["path", "Path", 220, code], ["logic", "Logic", 480],
    ],
  },
  {
    key: "app", owner: "Vendor", rows: appRows,
    title: { en: "App breakdown", id: "Breakdown App" },
    desc: { en: "The app shell (V-01) and every screen per Vendor component, with role, the API it uses and diagram references.", id: "App shell (V-01) dan semua layar per komponen Vendor, dengan role, API yang dipakai, dan referensi diagram." },
    cols: [
      ["id", "ID", 80], ["parent", { en: "Component", id: "Komponen" }, 100], ["kind", { en: "Type", id: "Jenis" }, 110],
      ["name", { en: "Item / screen", id: "Item / layar" }, 240, (v, r) => (r.screen ? <Link to={`/mockup?role=${r.mockRole}&screen=${r.screen}&mode=prototype`} className="text-[var(--lc-forest)] underline">{v}</Link> : v)],
      ["role", "Role", 190], ["detail", "Detail", 380], ["api", { en: "API used", id: "API yang dipakai" }, 300, pre],
      ["refs", { en: "Diagrams", id: "Diagram" }, 150], ["owner", { en: "Built by", id: "Dikerjakan oleh" }, 180],
    ],
    filter: { key: "parent", values: ["V-01", "V-02", "V-03", "V-04", "V-05", "V-06", "V-07", "V-08", "V-09", "V-10", "V-11", "V-12"] },
  },
];

const lbl = (l, lang) => (typeof l === "string" ? l : l[lang]);

function downloadCsv(tab, rows, lang) {
  const head = tab.cols.map((c) => lbl(c[1], lang));
  const body = rows.map((r) => {
    const x = tab.csv ? tab.csv(r) : r;
    return tab.cols.map((c) => x[c[0]]);
  });
  const esc = (v) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = "﻿" + [head, ...body].map((r) => r.map(esc).join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  a.download = `longchamp-${tab.key}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function WorkplanPage({ lang }) {
  const tx = (en, id) => (lang === "id" ? id : en);
  const [tabKey, setTabKey] = useState("components");
  const [q, setQ] = useState("");
  const [f, setF] = useState("");
  const tab = TABS.find((t) => t.key === tabKey);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return tab.rows.filter(
      (r) =>
        (!f || !tab.filter || String(r[tab.filter.key]).startsWith(f)) &&
        (!s || tab.cols.map((c) => (c[0] === "party" ? PARTY_LABEL[r.party] : r[c[0]])).join(" ").toLowerCase().includes(s))
    );
  }, [tab, q, f]);

  const pick = (k) => {
    setTabKey(k);
    setQ("");
    setF("");
  };

  return (
    <div className="mx-auto max-w-[1680px] px-4 pb-16 pt-8 sm:px-6">
      <h1 className="font-display text-4xl font-semibold text-[var(--lc-forest)]">{tx("Work split", "Pembagian kerja")}</h1>
      <p className="mt-2 max-w-3xl text-sm text-[var(--lc-muted)]">
        {tx(
          "Who builds what: Cekat Product, Cekat IT Dev / Delivery and the Vendor, down to every API variable and every app screen. Data integrity in the Cekat engine stays with Cekat IT Dev; the Vendor builds the mobile app only.",
          "Siapa mengerjakan apa: Cekat Product, Cekat IT Dev / Delivery, dan Vendor, sampai setiap variabel API dan setiap layar app. Data integrity di engine Cekat tetap di Cekat IT Dev; Vendor hanya membangun mobile app."
        )}
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {PARTY_ORDER.map((p) => (
          <div key={p} className="rounded-xl border border-[var(--lc-line,#e5e5e5)] bg-white p-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-semibold text-[var(--lc-forest)]">{PARTY_LABEL[p]}</p>
              <p className="font-display text-3xl text-[var(--lc-forest)]">{componentRows.filter((c) => c.party === p).length}</p>
            </div>
            <p className="mt-1 text-xs text-[var(--lc-muted)]">{PARTIES[p].scope}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-1.5" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={t.key === tabKey}
            onClick={() => pick(t.key)}
            className={`rounded-full px-3.5 py-1.5 text-sm transition ${t.key === tabKey ? "bg-[var(--lc-forest)] font-semibold text-white" : "bg-black/5 text-[var(--lc-forest)] hover:bg-black/10"}`}
          >
            {lbl(t.title, lang)} <span className="opacity-60">{t.rows.length}</span>
          </button>
        ))}
      </div>

      <section className="mt-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[var(--lc-forest)]">{lbl(tab.title, lang)}</h2>
            <p className="mt-1 max-w-3xl text-sm text-[var(--lc-muted)]">
              {lbl(tab.desc, lang)} <span className="font-semibold text-[var(--lc-forest)]">{tx("Built by", "Dikerjakan oleh")}: {tab.owner}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {tab.filter && (
              <select value={f} onChange={(e) => setF(e.target.value)} className="rounded-lg border border-black/15 bg-white px-2.5 py-1.5 text-sm" aria-label="Filter">
                <option value="">{tx("All", "Semua")}</option>
                {tab.filter.values.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            )}
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={tx("Search", "Cari")}
              className="w-56 rounded-lg border border-black/15 bg-white px-3 py-1.5 text-sm"
              aria-label={tx("Search", "Cari")}
            />
            <button onClick={() => downloadCsv(tab, rows, lang)} className="rounded-lg border border-[var(--lc-forest)] px-3 py-1.5 text-sm font-semibold text-[var(--lc-forest)] hover:bg-[var(--lc-forest)] hover:text-white">
              {tx("Download CSV", "Unduh CSV")}
            </button>
          </div>
        </div>

        <p className="mt-3 text-xs text-[var(--lc-muted)]">
          {rows.length} / {tab.rows.length} {tx("rows", "baris")}
        </p>
        <div className="mt-2 max-h-[72vh] overflow-auto rounded-xl border border-black/10 bg-white">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead className="sticky top-0 z-10 bg-[#f3f3f3]">
              <tr>
                {tab.cols.map((c) => (
                  <th key={c[0]} style={{ minWidth: c[2] }} className="border-b border-black/10 px-3 py-2 font-semibold text-[var(--lc-forest)]">
                    {lbl(c[1], lang)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={`${r.id || r.endpoint}-${i}`} className="align-top odd:bg-black/[0.015]">
                  {tab.cols.map((c) => (
                    <td key={c[0]} className="border-b border-black/5 px-3 py-2">
                      {c[3] ? c[3](r[c[0]], r) : r[c[0]]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
