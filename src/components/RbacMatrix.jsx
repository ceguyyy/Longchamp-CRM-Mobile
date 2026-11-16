import { Table } from "@heroui/react";
import { ScopeChip } from "./SourceBadges";

export function RoleTable({ model, lang, t }) {
  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Roles" className="min-w-[820px]">
          <Table.Header>
            <Table.Column isRowHeader>Role</Table.Column>
            <Table.Column>{t.roleCols.cekatRole}</Table.Column>
            <Table.Column>{t.roleCols.reportsTo}</Table.Column>
            <Table.Column>{t.roleCols.authority}</Table.Column>
            <Table.Column>{t.roleCols.peers}</Table.Column>
            <Table.Column>{t.roleCols.scope}</Table.Column>
          </Table.Header>
          <Table.Body>
            {model.roles.map((r) => (
              <Table.Row key={r.id} id={r.id}>
                <Table.Cell>
                  <span className="text-sm font-semibold">{r.name[lang]}</span>
                </Table.Cell>
                <Table.Cell>
                  <code className="text-[12px]">{r.cekatRole}</code>
                </Table.Cell>
                <Table.Cell>
                  <code className="text-[12px]">{r.reportsTo}</code>
                </Table.Cell>
                <Table.Cell>
                  <span className="text-sm">{r.authority}</span>
                </Table.Cell>
                <Table.Cell>
                  <span className="text-sm">{r.peers ? "On" : "Off"}</span>
                </Table.Cell>
                <Table.Cell>
                  <span className="text-sm">{r.scope[lang]}</span>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}

export default function RbacMatrix({ model, lang, t, onSelect }) {
  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label={t.rbacTitle} className="min-w-[720px]">
          <Table.Header>
            <Table.Column isRowHeader>{t.col.uc}</Table.Column>
            {model.roles.map((r) => (
              <Table.Column key={r.id}>{r.name[lang]}</Table.Column>
            ))}
          </Table.Header>
          <Table.Body>
            {model.useCases.map((u) => (
              <Table.Row key={u.id} id={u.id}>
                <Table.Cell>
                  <button className="text-left hover:underline" onClick={() => onSelect({ kind: "uc", id: u.id })}>
                    <span className="mr-1.5 text-[11px] font-semibold text-[var(--lc-muted)]">{u.id}</span>
                    <span className="text-sm font-medium">{u.name[lang]}</span>
                  </button>
                </Table.Cell>
                {model.roles.map((r) => (
                  <Table.Cell key={r.id}>
                    <ScopeChip scope={u.rbac[r.id]} t={t} />
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
