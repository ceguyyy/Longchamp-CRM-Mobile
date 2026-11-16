import { Link } from "react-router-dom";
import { Chip, Table } from "@heroui/react";
import { COVERAGE, AREAS, RACI, RACI_PARTIES } from "../data/coverage";
import { SCREENS } from "../mockup/screens";

const STATUS_COLOR = { covered: "success", adapted: "warning", excluded: "default" };
const RACI_STYLE = {
  R: "bg-[var(--lc-forest)] text-white",
  A: "bg-[var(--lc-lime)] text-[var(--lc-forest)]",
  C: "border border-[var(--lc-forest)] text-[var(--lc-forest)]",
  I: "text-[var(--lc-muted)]",
};

function Refs({ ids, to }) {
  if (!ids.length) return <span className="text-[var(--lc-muted)]">—</span>;
  return (
    <span className="flex flex-wrap gap-1">
      {ids.map((id) =>
        to ? (
          <Link key={id} to={to(id)} className="whitespace-nowrap font-semibold text-[var(--lc-forest)] hover:underline">
            {id}
          </Link>
        ) : (
          <span key={id} className="whitespace-nowrap font-semibold text-[var(--lc-forest)]">
            {id}
          </span>
        )
      )}
    </span>
  );
}

export default function CoveragePage({ lang, t }) {
  const c = t.cov;
  const count = (st) => COVERAGE.filter((x) => x.status === st).length;
  const areas = Object.keys(AREAS);

  return (
    <div className="mx-auto max-w-[1680px] px-4 pb-16 pt-8 sm:px-6">
      <h1 className="font-display text-4xl font-semibold text-[var(--lc-forest)]">{c.title}</h1>
      <p className="mt-2 max-w-3xl text-sm text-[var(--lc-muted)]">{c.subtitle}</p>

      <div className="mt-6 flex flex-wrap gap-6">
        {["covered", "adapted", "excluded"].map((st) => (
          <div key={st}>
            <p className="font-display text-4xl text-[var(--lc-forest)]">{count(st)}</p>
            <p className="text-xs text-[var(--lc-muted)]">{c.status[st]}</p>
          </div>
        ))}
      </div>

      {areas.map((a) => {
        const rows = COVERAGE.filter((x) => x.area === a);
        return (
          <section key={a} className="mt-10">
            <h2 className="font-display text-2xl font-semibold text-[var(--lc-forest)]">{AREAS[a][lang]}</h2>
            <Table className="mt-3">
              <Table.ScrollContainer>
                <Table.Content aria-label={AREAS[a][lang]} className="min-w-[1100px]">
                  <Table.Header>
                    <Table.Column isRowHeader>{c.cols.cap}</Table.Column>
                    <Table.Column>{c.cols.screen}</Table.Column>
                    <Table.Column>Use case</Table.Column>
                    <Table.Column>Activity</Table.Column>
                    <Table.Column>Sequence</Table.Column>
                    <Table.Column>{c.cols.status}</Table.Column>
                    <Table.Column>{c.cols.note}</Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {rows.map((r, i) => (
                      <Table.Row key={i} id={`${a}-${i}`}>
                        <Table.Cell>
                          <span className="text-sm">{r.cap[lang]}</span>
                        </Table.Cell>
                        <Table.Cell>
                          {r.screen ? (
                            <Link to={`/mockup?role=${r.role}&screen=${r.screen}&mode=prototype`} className="text-sm text-[var(--lc-forest)] underline">
                              {SCREENS[r.screen]?.title[lang] ?? r.screen}
                            </Link>
                          ) : (
                            <span className="text-[var(--lc-muted)]">—</span>
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          <Refs ids={r.uc} to={(id) => `/use-case?uc=${id}`} />
                        </Table.Cell>
                        <Table.Cell>
                          <Refs ids={r.ad} />
                        </Table.Cell>
                        <Table.Cell>
                          <Refs ids={r.sd} />
                        </Table.Cell>
                        <Table.Cell>
                          <Chip size="sm" variant="soft" color={STATUS_COLOR[r.status]}>
                            {c.status[r.status]}
                          </Chip>
                        </Table.Cell>
                        <Table.Cell>
                          <span className="text-xs text-[var(--lc-muted)]">{r.note?.[lang] ?? ""}</span>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          </section>
        );
      })}

      <section className="mt-14">
        <h2 className="font-display text-3xl font-semibold text-[var(--lc-forest)]">RACI</h2>
        <p className="mb-4 mt-1 max-w-3xl text-sm text-[var(--lc-muted)]">{c.raciDesc}</p>
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="RACI" className="min-w-[900px]">
              <Table.Header>
                <Table.Column isRowHeader>{c.cols.task}</Table.Column>
                {RACI_PARTIES.map((p) => (
                  <Table.Column key={p.id}>
                    {p.name[lang]}
                    <span className="block text-[10px] font-normal text-[var(--lc-muted)]">
                      {c.deckCol}: {p.deck}
                    </span>
                  </Table.Column>
                ))}
              </Table.Header>
              <Table.Body>
                {RACI.map((r, i) => (
                  <Table.Row key={i} id={`raci-${i}`}>
                    <Table.Cell>
                      <span className="text-sm">{r.task[lang]}</span>
                    </Table.Cell>
                    {RACI_PARTIES.map((p) => (
                      <Table.Cell key={p.id}>
                        <span className={`inline-grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${RACI_STYLE[r[p.id]]}`}>{r[p.id]}</span>
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
        <p className="mt-3 text-xs text-[var(--lc-muted)]">{c.raciLegend}</p>
      </section>
    </div>
  );
}
