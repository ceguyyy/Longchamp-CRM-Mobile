import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Chip, Table } from "@heroui/react";
import { API_GROUPS, ENDPOINTS, CONVENTIONS, WEBHOOKS, JOBS, WRITES, WRITE_RULES } from "../data/apiSpec";

const writesFor = (id) => WRITES.filter((w) => w.endpoint.split(" · ").includes(id));
import { COMPONENTS, PARTIES, TECH_STACK } from "../data/components";

const ROLE_SHORT = { sales_agent: "SA", supervisor: "SPV", super_admin: "SAdm" };
const METHOD_COLOR = { GET: "success", POST: "accent", PATCH: "warning", PUT: "warning", DELETE: "danger" };
const PARTY_COLOR = { vendor: "default", itdelivery: "accent", product: "warning", existing: "success" };

function Section({ title, desc, children }) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-3xl font-semibold text-[var(--lc-forest)]">{title}</h2>
      {desc && <p className="mb-4 mt-1 max-w-4xl text-sm text-[var(--lc-muted)]">{desc}</p>}
      {children}
    </section>
  );
}

function VarTable({ rows, label }) {
  if (!rows?.length) return null;
  return (
    <div className="mt-4">
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-[var(--lc-muted)]">{label}</p>
      <div className="overflow-x-auto rounded-xl border border-[var(--lc-line)] bg-white">
        <table className="w-full min-w-[640px] text-left text-[12.5px]">
          <thead className="bg-[#f4f4ef] text-[11px] text-[var(--lc-muted)]">
            <tr>
              {["Variabel", "Tipe", "Wajib", "Keterangan", "Contoh"].map((h) => (
                <th key={h} className="px-3 py-2 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([n, t, r, d, e]) => (
              <tr key={n + d} className="border-t border-[var(--lc-line)] align-top">
                <td className="px-3 py-2 font-mono text-[12px]">{n}</td>
                <td className="px-3 py-2 text-[var(--lc-muted)]">{t}</td>
                <td className="px-3 py-2">{r ? "Ya" : "Tidak"}</td>
                <td className="px-3 py-2">{d}</td>
                <td className="px-3 py-2 font-mono text-[11.5px] text-[var(--lc-muted)]">{e === undefined || e === null ? "" : typeof e === "object" ? JSON.stringify(e) : String(e)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EndpointDetail({ e }) {
  if (!e) return <p className="text-sm text-[var(--lc-muted)]">Klik endpoint di tabel untuk melihat logic, variabel, filter, dan response.</p>;
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <Chip size="sm" variant="soft" color={METHOD_COLOR[e.method.split(" ")[0]] || "default"}>{e.method}</Chip>
        <code className="text-[13px] font-semibold">/v1{e.path}</code>
      </div>
      <h3 className="font-display mt-2 text-2xl font-semibold text-[var(--lc-forest)]">
        {e.id} · {e.title}
      </h3>
      <dl className="mt-3 grid grid-cols-[120px_1fr] gap-x-3 gap-y-1.5 text-sm">
        <dt className="text-[var(--lc-muted)]">Role</dt>
        <dd>{e.roles.map((r) => ROLE_SHORT[r]).join(", ")}</dd>
        <dt className="text-[var(--lc-muted)]">Use case</dt>
        <dd className="flex flex-wrap gap-1.5">
          {e.uc.map((u) => (
            <Link key={u} to={`/use-case?uc=${u}`} className="font-semibold text-[var(--lc-forest)] hover:underline">
              {u}
            </Link>
          ))}
        </dd>
        <dt className="text-[var(--lc-muted)]">Cekat Product</dt>
        <dd>{e.cp.length ? e.cp.join(", ") : "—"}</dd>
        <dt className="text-[var(--lc-muted)]">Memanggil</dt>
        <dd>
          <ul className="list-disc pl-4">
            {e.upstream.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>
        </dd>
      </dl>
      <p className="mt-4 mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-[var(--lc-muted)]">Logic</p>
      <ol className="list-decimal space-y-1 pl-5 text-sm">
        {e.logic.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ol>
      {writesFor(e.id).map((w) => (
        <div key={w.endpoint} className="mt-4 rounded-xl border border-[var(--lc-lime,#8dc63f)] bg-[#f6fbef] p-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--lc-forest)]">Ditulis ke Cekat</p>
          <ol className="mt-1.5 list-decimal space-y-2 pl-5 text-[13px]">
            {w.steps.map((st) => (
              <li key={st.call + st.target}>
                <span className="font-semibold">{st.target}</span> · <code className="text-[12px]">{st.call}</code>
                {st.verify && <span className="ml-1 text-[11px] text-[var(--lc-muted)]">(path diverifikasi ke docs.cekat.ai)</span>}
                <pre className="mt-1 overflow-auto rounded-lg bg-white p-2 text-[11.5px]">{JSON.stringify(st.payload, null, 2)}</pre>
              </li>
            ))}
          </ol>
        </div>
      ))}
      <VarTable rows={e.query} label="Filter / query" />
      <VarTable rows={e.body} label="Request body" />
      <p className="mt-4 mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-[var(--lc-muted)]">Response</p>
      <pre className="max-h-[420px] overflow-auto rounded-xl bg-[#1d2414] p-4 text-[12px] leading-relaxed text-[#e7f3d9]">{JSON.stringify(e.response, null, 2)}</pre>
      {e.examples?.map(([label, body]) => (
        <div key={label} className="mt-3">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--lc-muted)]">Response {label}</p>
          <pre className="max-h-[260px] overflow-auto rounded-xl bg-[#2a2f22] p-3 text-[11.5px] leading-relaxed text-[#e7f3d9]">{JSON.stringify(body, null, 2)}</pre>
        </div>
      ))}
      {e.errors?.length > 0 && (
        <p className="mt-3 text-sm">
          <span className="text-[var(--lc-muted)]">Error khusus: </span>
          {e.errors.map((x) => (
            <code key={x} className="mr-2 text-[12px]">{x}</code>
          ))}
        </p>
      )}
    </div>
  );
}

export default function ApiPage() {
  const [group, setGroup] = useState("all");
  const [q, setQ] = useState("");
  const [party, setParty] = useState("all");
  const [sel, setSel] = useState("C-01");
  const rows = useMemo(
    () =>
      ENDPOINTS.filter((e) => group === "all" || e.group === group).filter((e) =>
        !q ? true : `${e.id} ${e.method} ${e.path} ${e.title} ${e.upstream.join(" ")}`.toLowerCase().includes(q.toLowerCase())
      ),
    [group, q]
  );
  const selected = ENDPOINTS.find((e) => e.id === sel);
  const comps = COMPONENTS.filter((c) => party === "all" || c.party === party);
  const count = (p) => COMPONENTS.filter((c) => c.party === p).length;

  return (
    <div className="mx-auto max-w-[1680px] px-4 pb-16 pt-8 sm:px-6">
      <h1 className="font-display text-4xl font-semibold text-[var(--lc-forest)]">API & TOR</h1>
      <p className="mt-2 max-w-3xl text-sm text-[var(--lc-muted)]">
        Clienteling API (Go) adalah satu-satunya API yang dipanggil app; database-nya Cekat CRM lewat Cekat API. Halaman ini memuat tech stack, komponen per pihak, {ENDPOINTS.length} endpoint lengkap dengan logic, variabel, filter, dan response, serta webhook dan job n8n.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Object.entries(PARTIES).map(([k, p]) => (
          <div key={k} className="rounded-2xl border border-[var(--lc-line)] bg-white p-4">
            <div className="flex items-baseline justify-between">
              <p className="font-display text-xl font-semibold text-[var(--lc-forest)]">{p.name}</p>
              <p className="font-display text-3xl text-[var(--lc-forest)]">{count(k)}</p>
            </div>
            <p className="mt-1 text-[13px] text-[var(--lc-muted)]">{p.scope}</p>
          </div>
        ))}
      </div>

      <Section title="Tech stack" desc="Usulan: ReactJS untuk app, Go untuk API, dan Cekat CRM (via API) sebagai database; tidak ada database sendiri.">
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="Tech stack" className="min-w-[860px]">
              <Table.Header>
                <Table.Column isRowHeader>Lapisan</Table.Column>
                <Table.Column>Teknologi</Table.Column>
                <Table.Column>Dibangun oleh</Table.Column>
              </Table.Header>
              <Table.Body>
                {TECH_STACK.map(([l, t, o]) => (
                  <Table.Row key={l} id={l}>
                    <Table.Cell><span className="text-sm font-semibold">{l}</span></Table.Cell>
                    <Table.Cell><span className="text-sm">{t}</span></Table.Cell>
                    <Table.Cell><span className="text-sm text-[var(--lc-muted)]">{o}</span></Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </Section>

      <Section title="Komponen per pihak" desc="Vendor hanya membangun mobile app; data integrity di engine Cekat dipegang Cekat IT Delivery; fitur platform yang belum ada di dokumentasi API dibangun Cekat Product. Pipeline Shopify + Odoo → Golden Record sudah berjalan dan hanya dipakai.">
        <div className="mb-3 flex flex-wrap gap-2">
          {[["all", "Semua"], ["vendor", "Vendor"], ["itdelivery", "Cekat IT Delivery"], ["product", "Cekat Product"], ["existing", "Sudah berjalan"]].map(([k, l]) => (
            <button key={k} onClick={() => setParty(k)} className={`rounded-full px-3 py-1 text-xs font-semibold ${party === k ? "bg-[var(--lc-forest)] text-white" : "border border-[var(--lc-line)] bg-white"}`}>
              {l}
            </button>
          ))}
        </div>
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="Komponen" className="min-w-[1000px]">
              <Table.Header>
                <Table.Column isRowHeader>ID</Table.Column>
                <Table.Column>Komponen</Table.Column>
                <Table.Column>Pihak</Table.Column>
                <Table.Column>Isi pekerjaan</Table.Column>
                <Table.Column>Bergantung pada</Table.Column>
              </Table.Header>
              <Table.Body>
                {comps.map((c) => (
                  <Table.Row key={c.id} id={c.id}>
                    <Table.Cell><span className="whitespace-nowrap font-semibold text-[var(--lc-forest)]">{c.id}</span></Table.Cell>
                    <Table.Cell><span className="text-sm">{c.name}</span></Table.Cell>
                    <Table.Cell>
                      <Chip size="sm" variant="soft" color={PARTY_COLOR[c.party]} className="whitespace-nowrap">{PARTIES[c.party].name}</Chip>
                    </Table.Cell>
                    <Table.Cell><span className="text-sm text-[var(--lc-muted)]">{c.work}</span></Table.Cell>
                    <Table.Cell><span className="text-xs">{c.deps}</span></Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </Section>

      <Section title="Daftar API" desc={`Base path /v1. ${CONVENTIONS.filterSyntax} SA = Sales Agent, SPV = Supervisor, SAdm = Super Admin.`}>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {[["all", "Semua"], ...API_GROUPS.map((g) => [g.id, g.name])].map(([k, l]) => (
            <button key={k} onClick={() => { setGroup(k); const first = ENDPOINTS.find((e) => k === "all" || e.group === k); if (first) setSel(first.id); }} className={`rounded-full px-3 py-1 text-xs font-semibold ${group === k ? "bg-[var(--lc-forest)] text-white" : "border border-[var(--lc-line)] bg-white"}`}>
              {l}
            </button>
          ))}
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari path, ID, board…" className="ml-auto h-8 w-56 rounded-full border border-[var(--lc-line)] bg-white px-3 text-sm" />
        </div>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <div className="max-h-[1100px] overflow-auto rounded-2xl border border-[var(--lc-line)] bg-white">
            <table className="w-full min-w-[720px] text-left text-[12.5px]">
              <thead className="sticky top-0 bg-[#f4f4ef] text-[11px] text-[var(--lc-muted)]">
                <tr>
                  {["ID", "Method", "Path", "Fungsi", "Role", "CP"].map((h) => (
                    <th key={h} className="px-3 py-2 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((e) => (
                  <tr key={e.id} onClick={() => setSel(e.id)} className={`cursor-pointer border-t border-[var(--lc-line)] align-top hover:bg-[#f7f9f2] ${sel === e.id ? "bg-[var(--lc-lime-soft,#f1f8e6)]" : ""}`}>
                    <td className="whitespace-nowrap px-3 py-2 font-semibold text-[var(--lc-forest)]">{e.id}</td>
                    <td className="whitespace-nowrap px-3 py-2">{e.method}</td>
                    <td className="px-3 py-2 font-mono text-[11.5px] break-words">/v1{e.path}</td>
                    <td className="px-3 py-2">{e.title}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-[var(--lc-muted)]">{e.roles.map((r) => ROLE_SHORT[r]).join(", ")}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-[var(--lc-muted)]">{e.cp.join(", ") || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rounded-2xl border border-[var(--lc-line)] bg-white p-5 xl:sticky xl:top-4 xl:max-h-[calc(100vh-2rem)] xl:overflow-auto">
            <EndpointDetail e={selected} />
          </div>
        </div>
      </Section>

      <Section title="Semua penulisan masuk ke Cekat CRM / Cekat API" desc="Pelanggan baru, wishlist, template WhatsApp, dan setiap tulis lain dari app disimpan di Cekat. App dan Redis tidak menyimpan data bisnis.">
        <ol className="mb-4 list-decimal space-y-1 pl-5 text-sm">
          {WRITE_RULES.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ol>
        <div className="overflow-x-auto rounded-2xl border border-[var(--lc-line)] bg-white">
          <table className="w-full min-w-[900px] text-left text-[12.5px]">
            <thead className="bg-[#f4f4ef] text-[11px] text-[var(--lc-muted)]">
              <tr>{["Endpoint", "Aksi di app", "Urutan tulis ke Cekat"].map((h) => <th key={h} className="px-3 py-2 font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody>
              {WRITES.map((w) => (
                <tr key={w.endpoint} onClick={() => { setGroup("all"); setSel(w.endpoint.split(" · ")[0]); }} className={`cursor-pointer border-t border-[var(--lc-line)] align-top hover:bg-[#f7f9f2] ${w.highlight ? "bg-[#f6fbef]" : ""}`}>
                  <td className="whitespace-nowrap px-3 py-2 font-semibold text-[var(--lc-forest)]">{w.endpoint}</td>
                  <td className="px-3 py-2">{w.title}</td>
                  <td className="px-3 py-2">
                    <ol className="list-decimal pl-4">
                      {w.steps.map((st) => (
                        <li key={st.call + st.target}>
                          {st.target}: <code className="text-[11.5px]">{st.call}</code>
                        </li>
                      ))}
                    </ol>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Konvensi API" desc={`Base URL (usulan): ${CONVENTIONS.base}. API tidak menyaring scope sendiri: token user diteruskan ke Cekat dan RBAC ditegakkan CP-02.`}>
        <div className="grid gap-6 xl:grid-cols-2">
          <div>
            <VarTable rows={CONVENTIONS.headers} label="Header" />
            <VarTable rows={CONVENTIONS.paging} label="Paging (cursor)" />
          </div>
          <div>
            <p className="mt-4 mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-[var(--lc-muted)]">Format error</p>
            <pre className="overflow-auto rounded-xl bg-[#1d2414] p-4 text-[12px] text-[#e7f3d9]">{JSON.stringify(CONVENTIONS.error, null, 2)}</pre>
            <table className="mt-3 w-full text-left text-[12.5px]">
              <tbody>
                {CONVENTIONS.errors.map(([h, c, d]) => (
                  <tr key={c} className="border-t border-[var(--lc-line)]">
                    <td className="py-1.5 pr-3 font-semibold">{h}</td>
                    <td className="py-1.5 pr-3 font-mono text-[12px]">{c}</td>
                    <td className="py-1.5 text-[var(--lc-muted)]">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section title="Webhook & job (data integrity)" desc="Dibangun Cekat IT Delivery di n8n; tidak dipanggil app. Semua tulis ke Cekat idempotent dengan kunci sha256(source + id + event).">
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="overflow-x-auto rounded-2xl border border-[var(--lc-line)] bg-white">
            <table className="w-full min-w-[620px] text-left text-[12.5px]">
              <thead className="bg-[#f4f4ef] text-[11px] text-[var(--lc-muted)]">
                <tr>{["ID", "Sumber", "Event", "Endpoint", "Logic"].map((h) => <th key={h} className="px-3 py-2 font-semibold">{h}</th>)}</tr>
              </thead>
              <tbody>
                {WEBHOOKS.map((w) => (
                  <tr key={w.id} className="border-t border-[var(--lc-line)] align-top">
                    <td className="whitespace-nowrap px-3 py-2 font-semibold text-[var(--lc-forest)]">{w.id}</td>
                    <td className="px-3 py-2">{w.source}</td>
                    <td className="px-3 py-2">{w.event}</td>
                    <td className="px-3 py-2 font-mono text-[11.5px]">{w.path}</td>
                    <td className="px-3 py-2 text-[var(--lc-muted)]">{w.logic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-[var(--lc-line)] bg-white">
            <table className="w-full min-w-[560px] text-left text-[12.5px]">
              <thead className="bg-[#f4f4ef] text-[11px] text-[var(--lc-muted)]">
                <tr>{["ID", "Job", "Jadwal (WIB)", "Logic"].map((h) => <th key={h} className="px-3 py-2 font-semibold">{h}</th>)}</tr>
              </thead>
              <tbody>
                {JOBS.map((j) => (
                  <tr key={j.id} className="border-t border-[var(--lc-line)] align-top">
                    <td className="whitespace-nowrap px-3 py-2 font-semibold text-[var(--lc-forest)]">{j.id}</td>
                    <td className="px-3 py-2">{j.name}</td>
                    <td className="px-3 py-2">{j.schedule}</td>
                    <td className="px-3 py-2 text-[var(--lc-muted)]">{j.logic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>
    </div>
  );
}
