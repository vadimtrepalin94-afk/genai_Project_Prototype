import { READINGS, CENTER, LCL, UCL, SPEC_LOW, SPEC_HIGH } from "@/lib/spc";

const W = 680, H = 300, L = 48, R = 150, T = 16, B = 40;
const x = (i: number) => L + ((W - L - R) * i) / (READINGS.length - 1);
const lo = 92, hi = 108;
const y = (v: number) => T + ((hi - v) / (hi - lo)) * (H - T - B);

export function SpcChart({ showSpecs = false }: { showSpecs?: boolean }) {
  const hline = (v: number, label: string, dash: string | undefined, color: string, w = 1.5) => (
    <g key={label}>
      <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke={color} strokeWidth={w} strokeDasharray={dash} />
      <text x={W - R + 6} y={y(v) + 4} fontSize="12" fill={color}>{label}</text>
    </g>
  );
  return (
    <figure style={{ margin: "1rem 0" }}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" width="100%"
        aria-label={`Control chart of eight thin-film thickness readings in nanometres. Center ${CENTER}, lower control limit ${LCL}, upper control limit ${UCL}.${showSpecs ? ` Specification limits ${SPEC_LOW} and ${SPEC_HIGH}.` : ""} Values are listed in the table below.`}>
        <rect x="0" y="0" width={W} height={H} fill="#fffdf8" />
        {[92, 96, 100, 104, 108].map((v) => (
          <g key={v}><text x={L - 6} y={y(v) + 4} fontSize="11" textAnchor="end" fill="#555">{v}</text></g>
        ))}
        <text x="12" y={H / 2} fontSize="11" fill="#555" transform={`rotate(-90 12 ${H / 2})`} textAnchor="middle">Thickness (nm)</text>
        {hline(CENTER, "Center 100", undefined, "#444", 1)}
        {hline(UCL, "UCL 103 (control)", "7 4", "#14606b", 2)}
        {hline(LCL, "LCL 97 (control)", "7 4", "#14606b", 2)}
        {showSpecs && hline(SPEC_HIGH, "USL 106 (spec)", "2 5", "#9a4a1c", 2.5)}
        {showSpecs && hline(SPEC_LOW, "LSL 94 (spec)", "2 5", "#9a4a1c", 2.5)}
        <polyline fill="none" stroke="#7a8a8f" strokeWidth="1.5" points={READINGS.map((v, i) => `${x(i)},${y(v)}`).join(" ")} />
        {READINGS.map((v, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(v)} r="5.5" fill="#1d3a40" />
            <text x={x(i)} y={H - B + 18} fontSize="12" textAnchor="middle" fill="#333">{i + 1}</text>
          </g>
        ))}
        <text x={(L + W - R) / 2} y={H - 4} fontSize="12" textAnchor="middle" fill="#333">Observation number</text>
      </svg>
      <figcaption className="sub">
        Solid dark line: center. Short-dash teal lines: control limits. {showSpecs && "Dotted rust lines: engineering specifications. "}
        Control limits are illustrative values from a fictional prior baseline, not calculated from these eight readings.
      </figcaption>
      <div role="region" aria-label="Fictional chart data table" tabIndex={0} style={{ overflowX: "auto" }}><table>
        <caption style={{ textAlign: "left", fontWeight: 600 }}>Chart data (fictional)</caption>
        <thead><tr><th scope="col">Observation</th>{READINGS.map((_, i) => <th scope="col" key={i}>{i + 1}</th>)}</tr></thead>
        <tbody><tr><th scope="row" style={{ fontWeight: 600 }}>Thickness (nm)</th>{READINGS.map((v, i) => <td key={i}>{v}</td>)}</tr></tbody>
      </table></div>
      <p className="sub">Control limits: LCL {LCL} nm, center {CENTER} nm, UCL {UCL} nm.{showSpecs && ` Specifications: ${SPEC_LOW} nm and ${SPEC_HIGH} nm.`}</p>
    </figure>
  );
}
