"use client"

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts"
import { formatEpoch, type StepResult, type StageType } from "@/lib/spl-pipeline"

const COLORS = ["#0a84c4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#64748b"]

export function isVisualizable(type: StageType): boolean {
  return type === "chart" || type === "timechart" || type === "geostats" || type === "gauge"
}

export function SplVisualization({
  step,
  stageType,
  config,
}: {
  step: StepResult
  stageType?: StageType
  config?: any
}) {
  if (!stageType) return null
  if (step.rows.length === 0) return <p className="text-sm text-[#9aa0a6]">No results to visualize.</p>

  if (stageType === "timechart") return <TimeSeriesViz step={step} />
  if (stageType === "chart") return <CategoryViz step={step} />
  if (stageType === "geostats") return <GeoViz step={step} />
  if (stageType === "gauge") return <GaugeViz step={step} config={config} />
  return null
}

function TimeSeriesViz({ step }: { step: StepResult }) {
  const seriesFields = step.fields.filter((f) => f !== "_time")
  const data = step.rows.map((r) => ({ ...r, _time: formatEpoch(Number(r._time)) }))
  return (
    <div className="h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e1e3e5" />
          <XAxis dataKey="_time" tick={{ fontSize: 11, fill: "#5c6773" }} />
          <YAxis tick={{ fontSize: 11, fill: "#5c6773" }} allowDecimals={false} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
          {seriesFields.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
          {seriesFields.map((f, i) => (
            <Line key={f} type="monotone" dataKey={f} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 3 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function CategoryViz({ step }: { step: StepResult }) {
  const [overField, ...seriesFields] = step.fields
  return (
    <div className="h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={step.rows} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e1e3e5" />
          <XAxis dataKey={overField} tick={{ fontSize: 11, fill: "#5c6773" }} />
          <YAxis tick={{ fontSize: 11, fill: "#5c6773" }} allowDecimals={false} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
          {seriesFields.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
          {seriesFields.map((f, i) => (
            <Bar key={f} dataKey={f} fill={COLORS[i % COLORS.length]} radius={[3, 3, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function GeoViz({ step }: { step: StepResult }) {
  const aggField = step.fields[step.fields.length - 1]
  const byField = step.fields.find((f) => f !== "lat" && f !== "lon" && f !== aggField)
  const data = step.rows.map((r) => ({ ...r, lat: Number(r.lat), lon: Number(r.lon), [aggField]: Number(r[aggField]) }))
  return (
    <div>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e1e3e5" />
            <XAxis type="number" dataKey="lon" name="longitude" tick={{ fontSize: 11, fill: "#5c6773" }} domain={["dataMin - 10", "dataMax + 10"]} />
            <YAxis type="number" dataKey="lat" name="latitude" tick={{ fontSize: 11, fill: "#5c6773" }} domain={["dataMin - 10", "dataMax + 10"]} />
            <ZAxis type="number" dataKey={aggField} range={[100, 600]} name={aggField} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              contentStyle={{ fontSize: 12, borderRadius: 6 }}
              formatter={(value: any, name: string) => [value, name]}
              labelFormatter={() => ""}
            />
            <Scatter data={data} fill="#0a84c4" fillOpacity={0.65} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-[#5c6773] mt-1">
        Bubble position is longitude/latitude; bubble size is <code className="bg-[#eef0f2] px-1 rounded">{aggField}</code>
        {byField ? <>, grouped by <code className="bg-[#eef0f2] px-1 rounded">{byField}</code></> : null}. A real Splunk
        geostats result feeds a marker map instead of a scatter plot; this is the same underlying data.
      </p>
    </div>
  )
}

function GaugeViz({ step, config }: { step: StepResult; config?: { field: string; t0: number; t1: number; t2: number; t3: number } }) {
  if (!config || step.rows.length !== 1) {
    return (
      <p className="text-sm text-[#9aa0a6]">
        gauge needs exactly one summary row to draw. Add a stats command (without by) earlier in the pipeline.
      </p>
    )
  }
  const value = Number(step.rows[0][config.field])
  const { t0, t1, t2, t3 } = config
  const cx = 110
  const cy = 110
  const r = 80

  function angleFor(v: number) {
    const clamped = Math.max(t0, Math.min(t3, v))
    const frac = t3 === t0 ? 0 : (clamped - t0) / (t3 - t0)
    return 180 - frac * 180
  }
  function polar(radius: number, angleDeg: number) {
    const rad = (angleDeg * Math.PI) / 180
    return { x: cx + radius * Math.cos(rad), y: cy - radius * Math.sin(rad) }
  }
  function arcPath(radius: number, startAngle: number, endAngle: number) {
    const start = polar(radius, startAngle)
    const end = polar(radius, endAngle)
    const largeArc = startAngle - endAngle > 180 ? 1 : 0
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`
  }

  const bands = [
    { from: t0, to: t1, color: "#10b981" },
    { from: t1, to: t2, color: "#f59e0b" },
    { from: t2, to: t3, color: "#ef4444" },
  ]
  const needleAngle = angleFor(value)
  const needleTip = polar(r - 18, needleAngle)

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 220 130" className="w-full max-w-sm">
        {bands.map((b, i) => (
          <path key={i} d={arcPath(r, angleFor(b.from), angleFor(b.to))} stroke={b.color} strokeWidth={16} fill="none" strokeLinecap="butt" />
        ))}
        <line x1={cx} y1={cy} x2={needleTip.x} y2={needleTip.y} stroke="#1e2125" strokeWidth={3} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={5} fill="#1e2125" />
        <text x={cx - r} y={cy + 20} fontSize={10} fill="#5c6773">{t0}</text>
        <text x={cx + r - 14} y={cy + 20} fontSize={10} fill="#5c6773">{t3}</text>
      </svg>
      <div className="text-2xl font-bold font-mono text-[#1e2125] -mt-2">{value}</div>
      <div className="text-xs text-[#5c6773] font-mono">{config.field}</div>
    </div>
  )
}
