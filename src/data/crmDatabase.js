/*
 * Cekat CRM as the database: every board / object the app needs, its columns, and how each
 * one is connected by API (who reads it, who writes it, through which Cekat API call).
 * Derived from erd.js (columns), apiSpec.js (Clienteling API) and n8n.js (workflows).
 */
import ERD from "./erd";
import { ENDPOINTS, WRITES } from "./apiSpec";
import { N8N_APIS } from "./n8n";

const ID_VAR = {
  "Golden Record": "goldenRecordBoardId",
  "Clienteling Pushes": "pushesBoardId",
  "Customer Lists": "listsBoardId",
  "Agenda (Calendar view)": "agendaBoardId",
  "KPI Snapshot": "kpiSnapshotBoardId",
};
const ALIASES = {
  "Clienteling Pushes": ["Pushes"],
  "Customer Lists": ["Customer Lists", "Lists"],
  "Agenda (Calendar view)": ["Agenda"],
  "Template Library": ["Template Library"],
  "Love Tags": ["Love Tags"],
};

const camel = (s) => s.replace(/\(.*?\)/g, "").trim().split(/\s+/).map((w, i) => (i ? w[0].toUpperCase() + w.slice(1) : w[0].toLowerCase() + w.slice(1))).join("");
const boardName = (cekat) => cekat.replace(/^Board:\s*/, "");

function mentions(text, names) {
  return names.some((n) => new RegExp(`(Board[s]?:? |board |\\b)${n.replace(/[()]/g, "")}\\b`, "i").test(text));
}

export const CRM_BOARDS = ERD.entities.map((ent) => {
  const isBoard = ent.cekat.startsWith("Board:");
  const name = isBoard ? boardName(ent.cekat) : ent.cekat;
  const short = name.replace(/\s*\(.*\)/, "");
  const names = ALIASES[name] || [short];
  const idVar = isBoard ? ID_VAR[name] || `${camel(short)}BoardId` : null;

  const readers = ENDPOINTS.filter((e) => e.method.includes("GET") && mentions(e.upstream.join(" ; "), names)).map((e) => e.id);
  const writers = WRITES.filter((w) => w.steps.some((s) => mentions(s.target, names))).map((w) => w.endpoint);
  const n8n = N8N_APIS.filter((n) => mentions(`${n.desc} ${n.example}`, names)).map((n) => n.id);

  let ops;
  if (isBoard) {
    ops = [
      { op: "Baca (list + filter)", call: `GET /api/crm/boards/{${idVar}}/items?filter[…]&sort=…&cursor=…`, note: "Filter server-side CP-04; token user → RBAC CP-02" },
      { op: "Baca 1 item", call: `GET /api/crm/boards/{${idVar}}/items/{item_id}`, note: "" },
    ];
    if (writers.length || n8n.length || ent.status === "new") {
      ops.push({ op: "Buat item", call: `POST /api/crm/boards/{${idVar}}/items`, note: "Body: values {kolom: nilai}; Idempotency-Key" });
      ops.push({ op: "Ubah item", call: `PATCH /api/crm/boards/{${idVar}}/items/{item_id}`, note: "Method API Board Cekat yang sudah ada" });
    }
  } else if (ent.id === "app_user") {
    ops = [
      { op: "Profil & role", call: "GET /users/me (CP-03, baru)", note: "Cekat Product" },
      { op: "Daftar user & hierarki", call: "GET /users?role=&boutique_id= (CP-03, baru)", note: "Cekat Product" },
      { op: "Token push", call: "POST /users/{id}/push-tokens (CP-03, baru)", note: "Cekat Product" },
    ];
  } else {
    ops = [
      { op: "Baca", call: "GET Tickets API (filter contact)", note: "Native Cekat" },
      { op: "Buat", call: "POST Tickets API", note: "Native Cekat" },
    ];
  }

  const writersBy = [...new Set(ent.fields.map((f) => f.writer))].join(", ");
  return {
    id: ent.id,
    name,
    status: ent.status,
    domain: ent.domain,
    desc: ent.desc,
    idVar,
    fields: ent.fields,
    readers,
    writers,
    n8n,
    ops,
    writersBy,
  };
});

export const CRM_FIELD_ROWS = CRM_BOARDS.flatMap((b) =>
  b.fields.map((f) => ({
    board: b.name,
    status: b.status,
    name: f.name,
    cekat: f.cekat,
    type: f.type,
    key: f.key || "",
    req: f.required ? "Ya" : "Tidak",
    desc: f.desc,
    ex: f.example === null || f.example === undefined ? "null" : typeof f.example === "object" ? JSON.stringify(f.example) : String(f.example),
    writer: f.writer,
    dflt: f.dflt || "",
  }))
);
