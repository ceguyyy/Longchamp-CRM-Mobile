/* Grid layout for the ERD. Entities are stacked per column; relations are bezier curves between field rows. */

export const ERD = { colW: 300, colGap: 74, x0: 24, y0: 24, headerH: 52, rowH: 19, gapY: 28, padB: 8 };

export function visibleFields(entity, mode) {
  if (mode === "all") return entity.fields;
  return entity.fields.filter((f) => f.key === "PK" || f.key === "FK");
}

export function layoutErd(model, mode) {
  const byId = Object.fromEntries(model.entities.map((e) => [e.id, e]));
  const boxes = {};
  let height = 0;

  model.layout.forEach((col, ci) => {
    let y = ERD.y0;
    col.forEach((id) => {
      const e = byId[id];
      const fields = visibleFields(e, mode);
      const h = ERD.headerH + fields.length * ERD.rowH + ERD.padB;
      const x = ERD.x0 + ci * (ERD.colW + ERD.colGap);
      const rows = {};
      fields.forEach((f, i) => (rows[f.name] = y + ERD.headerH + i * ERD.rowH + ERD.rowH / 2));
      boxes[id] = { ...e, x, y, w: ERD.colW, h, col: ci, fields, rows };
      y += h + ERD.gapY;
    });
    height = Math.max(height, y);
  });

  const width = ERD.x0 * 2 + model.layout.length * ERD.colW + (model.layout.length - 1) * ERD.colGap;

  const links = model.relations.map(([from, field, to, card], i) => {
    const a = boxes[from];
    const b = boxes[to];
    const pk = b.fields.find((f) => f.key === "PK");
    const ya = a.rows[field];
    const yb = b.rows[pk.name];
    let d;
    let xa;
    let xb;
    if (a.col === b.col) {
      // loop on the right side of the column
      xa = a.x + a.w;
      xb = b.x + b.w;
      const bulge = 28 + (i % 4) * 6;
      d = `M${xa},${ya} C${xa + bulge},${ya} ${xb + bulge},${yb} ${xb},${yb}`;
    } else if (a.col < b.col) {
      xa = a.x + a.w;
      xb = b.x;
      const mx = (xa + xb) / 2;
      d = `M${xa},${ya} C${mx},${ya} ${mx},${yb} ${xb},${yb}`;
    } else {
      xa = a.x;
      xb = b.x + b.w;
      const mx = (xa + xb) / 2;
      d = `M${xa},${ya} C${mx},${ya} ${mx},${yb} ${xb},${yb}`;
    }
    return { id: `r${i}`, from, to, field, card, d, xa, ya, xb, yb, dirA: a.col <= b.col ? 1 : -1, dirB: a.col < b.col ? -1 : 1 };
  });

  return { width, height: height + 10, boxes, links };
}
