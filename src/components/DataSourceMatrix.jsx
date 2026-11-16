import { Table } from "@heroui/react";
import { TypeChip, StatusChip } from "./SourceBadges";

export default function DataSourceMatrix({ model, lang, t, onSelect }) {
  const sysName = (id) => model.systems.find((s) => s.id === id)?.name ?? id;
  const rows = model.useCases.flatMap((u) =>
    u.sources.map((src, i) => ({ key: `${u.id}-${i}`, first: i === 0, u, src }))
  );

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label={t.matrix} className="min-w-[900px]">
          <Table.Header>
            <Table.Column isRowHeader>{t.col.uc}</Table.Column>
            <Table.Column>{t.col.system}</Table.Column>
            <Table.Column>{t.col.type}</Table.Column>
            <Table.Column>{t.col.dir}</Table.Column>
            <Table.Column>{t.col.ref}</Table.Column>
            <Table.Column>{t.col.status}</Table.Column>
          </Table.Header>
          <Table.Body>
            {rows.map(({ key, first, u, src }) => (
              <Table.Row key={key} id={key}>
                <Table.Cell>
                  {first ? (
                    <button className="text-left hover:underline" onClick={() => onSelect({ kind: "uc", id: u.id })}>
                      <span className="mr-1.5 text-[11px] font-semibold text-[var(--lc-muted)]">{u.id}</span>
                      <span className="text-sm font-medium">{u.name[lang]}</span>
                    </button>
                  ) : (
                    <span className="pl-11 text-[var(--lc-line)]">↳</span>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <span className="text-sm">{sysName(src.sys)}</span>
                </Table.Cell>
                <Table.Cell>
                  <TypeChip type={src.type} />
                </Table.Cell>
                <Table.Cell>
                  <span className="text-sm">{t.dir[src.dir]}</span>
                </Table.Cell>
                <Table.Cell>
                  <code className="text-[12px]">{src.ref}</code>
                </Table.Cell>
                <Table.Cell>
                  <StatusChip src={src} t={t} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
