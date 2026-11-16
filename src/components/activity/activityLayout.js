/* Layout + orthogonal edge routing for swimlane activity diagrams. */

export const AD = {
  laneW: 236,
  headerH: 70,
  rowH: 92,
  padTop: 24,
  nodeW: 196,
  nodeH: 58,
  dW: 132, // decision width
  dH: 62,
};

const wrap = (text, max = 28) => {
  const words = text.split(" ");
  const lines = [];
  let cur = "";
  words.forEach((w) => {
    if ((cur + " " + w).trim().length > max) {
      if (cur) lines.push(cur);
      cur = w;
    } else cur = (cur + " " + w).trim();
  });
  if (cur) lines.push(cur);
  return lines;
};

function box(n) {
  switch (n.type) {
    case "start":
    case "end":
      return { w: 26, h: 26 };
    case "merge":
      return { w: 30, h: 30 };
    case "decision":
      return { w: AD.dW, h: AD.dH };
    default:
      return { w: AD.nodeW, h: n.lines.length > 2 ? 70 : AD.nodeH };
  }
}

export function layoutActivity(diagram, lang) {
  const laneIdx = Object.fromEntries(diagram.lanes.map((l, i) => [l, i]));
  const maxRow = Math.max(...diagram.nodes.map((n) => n.row));
  const width = diagram.lanes.length * AD.laneW;
  const height = AD.headerH + AD.padTop + (maxRow + 1) * AD.rowH + 20;

  const nodes = {};
  diagram.nodes.forEach((n) => {
    const lines = n.label ? wrap(n.label[lang], n.type === "decision" ? 16 : 28) : [];
    const li = laneIdx[n.lane];
    const cx = li * AD.laneW + AD.laneW / 2;
    const cy = AD.headerH + AD.padTop + n.row * AD.rowH + AD.rowH / 2;
    const nn = { ...n, lines, li, cx, cy };
    const { w, h } = box(nn);
    nodes[n.id] = { ...nn, w, h, top: cy - h / 2, bottom: cy + h / 2, left: cx - w / 2, right: cx + w / 2 };
  });

  const blocked = (lane, r1, r2) =>
    Object.values(nodes).some((n) => n.lane === lane && n.row > Math.min(r1, r2) && n.row < Math.max(r1, r2));

  const edges = diagram.edges.map(([from, to, label, opt = {}], i) => {
    const a = nodes[from];
    const b = nodes[to];
    let d;
    let lx;
    let ly;
    let anchor = "start";

    if (a.lane === b.lane) {
      if (b.row > a.row && !blocked(a.lane, a.row, b.row) && !opt.side) {
        d = `M${a.cx},${a.bottom} V${b.top}`;
        lx = a.cx + 8;
        ly = a.bottom + 14;
      } else {
        // loop on the lane side
        const sideRight = opt.side !== "left";
        const laneEdge = sideRight ? (a.li + 1) * AD.laneW - 10 : a.li * AD.laneW + 10;
        const ax = sideRight ? a.right : a.left;
        const bx = sideRight ? b.right : b.left;
        d = `M${ax},${a.cy} H${laneEdge} V${b.cy} H${bx}`;
        // label just outside the loop, near the target
        lx = sideRight ? laneEdge + 4 : laneEdge - 4;
        anchor = sideRight ? "start" : "end";
        ly = b.cy - 8;
      }
    } else {
      const toRight = b.li > a.li;
      const ax = toRight ? a.right : a.left;
      if (b.row === a.row) {
        const bx = toRight ? b.left : b.right;
        d = `M${ax},${a.cy} H${bx}`;
        lx = ax + (toRight ? 8 : -8);
        ly = a.cy - 8;
        anchor = toRight ? "start" : "end";
      } else if (b.row > a.row) {
        const exit = opt.exit || (a.type === "decision" ? "side" : "bottom");
        if (exit === "side") {
          d = `M${ax},${a.cy} H${b.cx} V${b.top}`;
          lx = ax + (toRight ? 8 : -8);
          ly = a.cy - 8;
          anchor = toRight ? "start" : "end";
        } else {
          const midY = b.top - 18;
          d = `M${a.cx},${a.bottom} V${midY} H${b.cx} V${b.top}`;
          lx = a.cx + (b.li > a.li ? 8 : -8);
          ly = midY - 6;
          anchor = b.li > a.li ? "start" : "end";
        }
      } else {
        d = `M${ax},${a.cy} H${b.cx} V${b.bottom}`;
        lx = ax + (toRight ? 8 : -8);
        ly = a.cy - 8;
        anchor = toRight ? "start" : "end";
      }
    }
    return { id: `e${i}`, from, to, d, label, lx, ly, anchor };
  });

  return { width, height, nodes, edges, laneIdx };
}
