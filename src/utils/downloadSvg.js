/** Download an inline SVG as a standalone file (CSS variables are inlined). */
export function downloadSvg(svg, filename) {
  if (!svg) return;
  const vars = getComputedStyle(document.documentElement);
  let src = new XMLSerializer().serializeToString(svg.cloneNode(true));
  src = src.replace(/var\((--[a-z0-9-]+)\)/gi, (_, v) => vars.getPropertyValue(v).trim() || "#000");
  const blob = new Blob([src], { type: "image/svg+xml" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
