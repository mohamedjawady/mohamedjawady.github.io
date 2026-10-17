"use client"

import { useMemo, useState } from "react"
import { Search, Plus, X, ChevronUp, ChevronDown, Copy, Check, AlertTriangle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DATASETS,
  getDataset,
  runPipeline,
  repairStages,
  defaultConfig,
  STAGE_TYPES,
  STAGE_LABELS,
  STAGE_GROUP_ORDER,
  stageGroup,
  nextId,
  isNumericField,
  distinctValues,
  formatEpoch,
  formatSplTimestamp,
  hourMark,
  datasetMaxTime,
  ALL_TIME,
  aggNeedsField,
  AGG_FN_LABELS,
  type StageType,
  type PipelineStage,
  type Filter,
  type AggFn,
  type EvalDef,
  type Row,
  type StatFnEntry,
  type TimeRange,
  type Dataset,
} from "@/lib/spl-pipeline"
import { SplVisualization, isVisualizable } from "@/components/tools/spl-viz"

// ---------------------------------------------------------------------------
// Tiny shared controls, styled to read as a SIEM search console rather than
// the rest of the site's theme.
// ---------------------------------------------------------------------------

function Sel({
  value,
  onChange,
  options,
  className,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string; disabled?: boolean }[]
  className?: string
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "h-8 rounded border border-[#c6cace] bg-white px-2 text-xs font-mono text-[#1e2125] focus:outline-none focus:ring-1 focus:ring-[#0a84c4]",
        className,
      )}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} disabled={o.disabled}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

function Num({ value, onChange, className }: { value: number; onChange: (v: number) => void; className?: string }) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={cn(
        "h-8 w-20 rounded border border-[#c6cace] bg-white px-2 text-xs font-mono text-[#1e2125] focus:outline-none focus:ring-1 focus:ring-[#0a84c4]",
        className,
      )}
    />
  )
}

function Txt({ value, onChange, className, placeholder }: { value: string; onChange: (v: string) => void; className?: string; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "h-8 rounded border border-[#c6cace] bg-white px-2 text-xs font-mono text-[#1e2125] focus:outline-none focus:ring-1 focus:ring-[#0a84c4]",
        className,
      )}
    />
  )
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-2 py-1 rounded text-xs font-mono border transition-colors",
        active ? "border-[#0a84c4] bg-[#0a84c4]/10 text-[#0a84c4]" : "border-[#c6cace] bg-white text-[#5c6773] hover:border-[#0a84c4]/50",
      )}
    >
      {children}
    </button>
  )
}

function IconBtn({ onClick, title, children, danger }: { onClick: () => void; title: string; children: React.ReactNode; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "h-7 w-7 flex items-center justify-center rounded border border-[#c6cace] bg-white hover:bg-[#f0f1f2] transition-colors",
        danger ? "text-red-600 hover:border-red-300" : "text-[#5c6773]",
      )}
    >
      {children}
    </button>
  )
}

const FIELD_FN_OPTIONS = (Object.keys(AGG_FN_LABELS) as AggFn[]).map((fn) => ({ value: fn, label: AGG_FN_LABELS[fn] }))
const SPAN_OPTIONS = ["5m", "15m", "30m", "1h", "2h", "1d"].map((s) => ({ value: s, label: s }))
const EVAL_KIND_OPTIONS = [
  { value: "arith", label: "Arithmetic" },
  { value: "round", label: "round()" },
  { value: "case2", label: "case() label" },
  { value: "concat", label: "Concatenate" },
  { value: "strftime", label: "strftime() time" },
  { value: "commas", label: "Comma format" },
]

const TIME_PRESET_OPTIONS = [
  { value: "all", label: "All time" },
  { value: "1h", label: "Last 1 hour" },
  { value: "2h", label: "Last 2 hours" },
  { value: "4h", label: "Last 4 hours" },
  { value: "custom", label: "Custom range" },
]
// The sample data spans roughly 06:00-11:00 on the fixed simulated day.
const HOUR_OPTIONS = [6, 7, 8, 9, 10, 11].map((h) => ({ value: String(h), label: `${String(h).padStart(2, "0")}:00` }))

function computeTimeRange(preset: string, dataset: Dataset, earliestHour: number, latestHour: number): TimeRange {
  if (preset === "all") return ALL_TIME
  if (preset === "1h" || preset === "2h" || preset === "4h") {
    const hours = { "1h": 1, "2h": 2, "4h": 4 }[preset]!
    const anchor = datasetMaxTime(dataset)
    return { earliest: anchor - hours * 3600, latest: anchor + 1, clause: `earliest=-${hours}h latest=now` }
  }
  const e = hourMark(earliestHour)
  const l = hourMark(latestHour)
  return { earliest: e, latest: l, clause: `earliest="${formatSplTimestamp(e)}" latest="${formatSplTimestamp(l)}"` }
}

// ---------------------------------------------------------------------------
// Per-stage config editor
// ---------------------------------------------------------------------------

function StageConfigEditor({
  type,
  config,
  fields,
  rows,
  datasetIpField,
  onChange,
}: {
  type: StageType
  config: any
  fields: string[]
  rows: Row[]
  datasetIpField?: string
  onChange: (next: any) => void
}) {
  const fieldOptions = fields.map((f) => ({ value: f, label: f }))
  const numericFields = fields.filter((f) => isNumericField(rows, f))
  const numericOptions = numericFields.map((f) => ({ value: f, label: f }))
  const byOptions = [{ value: "", label: "(none)" }, ...fieldOptions]

  switch (type) {
    case "fields":
      return (
        <div className="space-y-2">
          <div className="flex gap-1.5">
            <Pill active={config.mode === "keep"} onClick={() => onChange({ ...config, mode: "keep" })}>keep</Pill>
            <Pill active={config.mode === "exclude"} onClick={() => onChange({ ...config, mode: "exclude" })}>exclude</Pill>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {fields.map((f) => (
              <Pill
                key={f}
                active={config.fields.includes(f)}
                onClick={() =>
                  onChange({
                    ...config,
                    fields: config.fields.includes(f) ? config.fields.filter((x: string) => x !== f) : [...config.fields, f],
                  })
                }
              >
                {f}
              </Pill>
            ))}
          </div>
        </div>
      )

    case "table":
    case "dedup":
      return (
        <div className="flex flex-wrap gap-1.5">
          {fields.map((f) => (
            <Pill
              key={f}
              active={config.fields.includes(f)}
              onClick={() =>
                onChange({
                  ...config,
                  fields: config.fields.includes(f) ? config.fields.filter((x: string) => x !== f) : [...config.fields, f],
                })
              }
            >
              {f}
            </Pill>
          ))}
        </div>
      )

    case "rename":
      return (
        <div className="space-y-2">
          {config.mappings.map((m: any, i: number) => (
            <div key={m.id} className="flex items-center gap-2">
              <Sel value={m.from} onChange={(v) => updateListItem(config, "mappings", i, { ...m, from: v }, onChange)} options={fieldOptions} />
              <span className="text-xs text-[#5c6773] font-mono">AS</span>
              <Txt value={m.to} onChange={(v) => updateListItem(config, "mappings", i, { ...m, to: v }, onChange)} placeholder="New name" />
              <IconBtn title="Remove" danger onClick={() => removeListItem(config, "mappings", i, onChange)}>
                <X className="w-3.5 h-3.5" />
              </IconBtn>
            </div>
          ))}
          <button
            onClick={() => addListItem(config, "mappings", { id: nextId("rn"), from: fields[0] ?? "", to: "" }, onChange)}
            className="flex items-center gap-1 text-xs text-[#0a84c4] hover:underline"
          >
            <Plus className="w-3.5 h-3.5" /> Add rename
          </button>
        </div>
      )

    case "sort":
      return (
        <div className="space-y-2">
          {config.keys.map((k: any, i: number) => (
            <div key={k.id} className="flex items-center gap-2">
              <Sel value={k.field} onChange={(v) => updateListItem(config, "keys", i, { ...k, field: v }, onChange)} options={fieldOptions} />
              <Pill active={k.dir === "desc"} onClick={() => updateListItem(config, "keys", i, { ...k, dir: k.dir === "desc" ? "asc" : "desc" }, onChange)}>
                {k.dir === "desc" ? "descending" : "ascending"}
              </Pill>
              <IconBtn title="Remove" danger onClick={() => removeListItem(config, "keys", i, onChange)}>
                <X className="w-3.5 h-3.5" />
              </IconBtn>
            </div>
          ))}
          <button
            onClick={() => addListItem(config, "keys", { id: nextId("sk"), field: fields[0] ?? "", dir: "desc" }, onChange)}
            className="flex items-center gap-1 text-xs text-[#0a84c4] hover:underline"
          >
            <Plus className="w-3.5 h-3.5" /> Add sort key
          </button>
        </div>
      )

    case "fieldformat":
      return <Sel value={config.field} onChange={(v) => onChange({ ...config, field: v })} options={numericOptions.length ? numericOptions : fieldOptions} />

    case "stats":
      return (
        <div className="space-y-3">
          <div className="space-y-2">
            {config.fns.map((fn: any, i: number) => (
              <div key={fn.id} className="flex items-center gap-2 flex-wrap">
                <Sel
                  value={fn.fn}
                  onChange={(v) => updateListItem(config, "fns", i, { ...fn, fn: v, alias: v === "count" ? "count" : `${v}_${fn.field ?? fields[0]}` }, onChange)}
                  options={FIELD_FN_OPTIONS}
                />
                {aggNeedsField(fn.fn) && (
                  <Sel value={fn.field ?? ""} onChange={(v) => updateListItem(config, "fns", i, { ...fn, field: v }, onChange)} options={fieldOptions} />
                )}
                <span className="text-xs text-[#5c6773] font-mono">as</span>
                <Txt value={fn.alias} onChange={(v) => updateListItem(config, "fns", i, { ...fn, alias: v }, onChange)} className="w-28" />
                <IconBtn title="Remove" danger onClick={() => removeListItem(config, "fns", i, onChange)}>
                  <X className="w-3.5 h-3.5" />
                </IconBtn>
              </div>
            ))}
            <button
              onClick={() => {
                const existingAliases = config.fns.map((f: StatFnEntry) => f.alias)
                const numericNonTime = numericFields.filter((f) => f !== "_time")
                const nextFn: AggFn = numericNonTime.length ? "sum" : "dc"
                const nextField = numericNonTime[0] ?? fields.find((f) => f !== "_time") ?? fields[0]
                const alias = uniqueName(`${nextFn}_${nextField}`, existingAliases)
                addListItem(config, "fns", { id: nextId("fn"), fn: nextFn, field: nextField, alias }, onChange)
              }}
              className="flex items-center gap-1 text-xs text-[#0a84c4] hover:underline"
            >
              <Plus className="w-3.5 h-3.5" /> Add function
            </button>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wide text-[#5c6773] font-mono mb-1">by</div>
            <div className="flex flex-wrap gap-1.5">
              {fields.map((f) => (
                <Pill
                  key={f}
                  active={config.by.includes(f)}
                  onClick={() => onChange({ ...config, by: config.by.includes(f) ? config.by.filter((x: string) => x !== f) : [...config.by, f] })}
                >
                  {f}
                </Pill>
              ))}
            </div>
          </div>
        </div>
      )

    case "addtotals":
      return (
        <div className="flex items-center gap-4 flex-wrap">
          <Pill active={config.row} onClick={() => onChange({ ...config, row: !config.row })}>row=true</Pill>
          <Pill active={config.col} onClick={() => onChange({ ...config, col: !config.col })}>col=true</Pill>
          {config.row && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[#5c6773] font-mono">fieldname</span>
              <Txt value={config.fieldname} onChange={(v) => onChange({ ...config, fieldname: v })} className="w-28" />
            </div>
          )}
        </div>
      )

    case "top":
    case "rare":
      return (
        <div className="flex items-center gap-3 flex-wrap">
          <Sel value={config.field} onChange={(v) => onChange({ ...config, field: v })} options={fieldOptions} />
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#5c6773] font-mono">limit</span>
            <Num value={config.limit} onChange={(v) => onChange({ ...config, limit: v })} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#5c6773] font-mono">by</span>
            <Sel value={config.by} onChange={(v) => onChange({ ...config, by: v })} options={byOptions} />
          </div>
        </div>
      )

    case "chart":
      return (
        <div className="flex items-center gap-3 flex-wrap">
          <Sel value={config.fn} onChange={(v) => onChange({ ...config, fn: v })} options={FIELD_FN_OPTIONS} />
          {aggNeedsField(config.fn) && <Sel value={config.field ?? ""} onChange={(v) => onChange({ ...config, field: v })} options={fieldOptions} />}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#5c6773] font-mono">over</span>
            <Sel value={config.over} onChange={(v) => onChange({ ...config, over: v })} options={fieldOptions} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#5c6773] font-mono">by</span>
            <Sel value={config.by} onChange={(v) => onChange({ ...config, by: v })} options={byOptions} />
          </div>
        </div>
      )

    case "timechart":
      return (
        <div className="flex items-center gap-3 flex-wrap">
          <Sel value={config.fn} onChange={(v) => onChange({ ...config, fn: v })} options={FIELD_FN_OPTIONS} />
          {aggNeedsField(config.fn) && <Sel value={config.field ?? ""} onChange={(v) => onChange({ ...config, field: v })} options={fieldOptions} />}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#5c6773] font-mono">span</span>
            <Sel value={config.span} onChange={(v) => onChange({ ...config, span: v })} options={SPAN_OPTIONS} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#5c6773] font-mono">by</span>
            <Sel value={config.by} onChange={(v) => onChange({ ...config, by: v })} options={byOptions} />
          </div>
        </div>
      )

    case "bin":
      return (
        <div className="flex items-center gap-3 flex-wrap">
          <Sel
            value={config.field}
            onChange={(v) => onChange({ ...config, field: v, span: v === "_time" ? "1h" : "1000" })}
            options={fieldOptions}
          />
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#5c6773] font-mono">span</span>
            {config.field === "_time" ? (
              <Sel value={config.span} onChange={(v) => onChange({ ...config, span: v })} options={SPAN_OPTIONS} />
            ) : (
              <Num value={Number(config.span)} onChange={(v) => onChange({ ...config, span: String(v) })} />
            )}
          </div>
        </div>
      )

    case "eval":
      return (
        <div className="space-y-3">
          {config.defs.map((d: EvalDef, i: number) => (
            <div key={d.id} className="rounded border border-[#e1e3e5] bg-[#fafbfc] p-2 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-[#5c6773] font-mono">field</span>
                <Txt value={d.newField} onChange={(v) => updateListItem(config, "defs", i, { ...d, newField: v }, onChange)} className="w-28" />
                <span className="text-xs text-[#5c6773] font-mono">=</span>
                <Sel
                  value={d.kind}
                  onChange={(v) => {
                    const others = config.defs.filter((_: EvalDef, idx: number) => idx !== i).map((o: EvalDef) => o.newField)
                    updateListItem(config, "defs", i, evalDefaultForKind(v as EvalDef["kind"], d.id, fields, numericFields, others), onChange)
                  }}
                  options={EVAL_KIND_OPTIONS}
                />
                <IconBtn title="Remove" danger onClick={() => removeListItem(config, "defs", i, onChange)}>
                  <X className="w-3.5 h-3.5" />
                </IconBtn>
              </div>
              <EvalDefFields d={d} fields={fields} numericFields={numericFields} rows={rows} onUpdate={(next) => updateListItem(config, "defs", i, next, onChange)} />
            </div>
          ))}
          <button
            onClick={() => addListItem(config, "defs", evalDefaultForKind("round", nextId("ev"), fields, numericFields), onChange)}
            className="flex items-center gap-1 text-xs text-[#0a84c4] hover:underline"
          >
            <Plus className="w-3.5 h-3.5" /> Add eval field
          </button>
        </div>
      )

    case "iplocation":
      if (!datasetIpField) return <p className="text-xs text-[#9a1f1f] font-mono">No IP field in this dataset. Switch datasets to use iplocation.</p>
      return <Sel value={config.field || datasetIpField} onChange={(v) => onChange({ ...config, field: v })} options={[{ value: datasetIpField, label: datasetIpField }]} />

    case "geostats":
      return (
        <div className="flex items-center gap-3 flex-wrap">
          <Sel value={config.fn} onChange={(v) => onChange({ ...config, fn: v })} options={FIELD_FN_OPTIONS} />
          {aggNeedsField(config.fn) && <Sel value={config.field ?? ""} onChange={(v) => onChange({ ...config, field: v })} options={fieldOptions} />}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#5c6773] font-mono">by</span>
            <Sel value={config.by} onChange={(v) => onChange({ ...config, by: v })} options={byOptions} />
          </div>
        </div>
      )

    case "gauge":
      return (
        <div className="flex items-center gap-2 flex-wrap">
          <Sel value={config.field} onChange={(v) => onChange({ ...config, field: v })} options={numericOptions.length ? numericOptions : fieldOptions} />
          {(["t0", "t1", "t2", "t3"] as const).map((k) => (
            <Num key={k} value={config[k]} onChange={(v) => onChange({ ...config, [k]: v })} />
          ))}
        </div>
      )

    default:
      return null
  }
}

function EvalDefFields({
  d,
  fields,
  numericFields,
  rows,
  onUpdate,
}: {
  d: EvalDef
  fields: string[]
  numericFields: string[]
  rows: Row[]
  onUpdate: (next: EvalDef) => void
}) {
  const fieldOptions = fields.map((f) => ({ value: f, label: f }))
  const numericOptions = numericFields.map((f) => ({ value: f, label: f }))

  if (d.kind === "arith") {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <Sel value={d.a} onChange={(v) => onUpdate({ ...d, a: v })} options={numericOptions} />
        <Sel value={d.op} onChange={(v) => onUpdate({ ...d, op: v as any })} options={["+", "-", "*", "/"].map((o) => ({ value: o, label: o }))} />
        <Sel value={d.b} onChange={(v) => onUpdate({ ...d, b: v })} options={numericOptions} />
      </div>
    )
  }
  if (d.kind === "round") {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <Sel value={d.field} onChange={(v) => onUpdate({ ...d, field: v })} options={numericOptions} />
        <span className="text-xs text-[#5c6773] font-mono">decimals</span>
        <Num value={d.decimals} onChange={(v) => onUpdate({ ...d, decimals: v })} />
      </div>
    )
  }
  if (d.kind === "case2") {
    const valueOptions = distinctValues(rows, d.field).map((v) => ({ value: String(v), label: String(v) }))
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <Sel value={d.field} onChange={(v) => onUpdate({ ...d, field: v, value: String(distinctValues(rows, v)[0] ?? "") })} options={fieldOptions} />
        <Sel value={d.op} onChange={(v) => onUpdate({ ...d, op: v as any })} options={["=", "!=", ">", "<"].map((o) => ({ value: o, label: o }))} />
        {d.op === "=" || d.op === "!=" ? (
          <Sel value={d.value} onChange={(v) => onUpdate({ ...d, value: v })} options={valueOptions.length ? valueOptions : [{ value: d.value, label: d.value }]} />
        ) : (
          <Txt value={d.value} onChange={(v) => onUpdate({ ...d, value: v })} className="w-20" />
        )}
        <span className="text-xs text-[#5c6773] font-mono">then</span>
        <Txt value={d.thenLabel} onChange={(v) => onUpdate({ ...d, thenLabel: v })} className="w-24" />
        <span className="text-xs text-[#5c6773] font-mono">else</span>
        <Txt value={d.elseLabel} onChange={(v) => onUpdate({ ...d, elseLabel: v })} className="w-24" />
      </div>
    )
  }
  if (d.kind === "concat") {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <Sel value={d.a} onChange={(v) => onUpdate({ ...d, a: v })} options={fieldOptions} />
        <Txt value={d.sep} onChange={(v) => onUpdate({ ...d, sep: v })} className="w-14" />
        <Sel value={d.b} onChange={(v) => onUpdate({ ...d, b: v })} options={fieldOptions} />
      </div>
    )
  }
  if (d.kind === "strftime") {
    return (
      <Sel
        value={d.format}
        onChange={(v) => onUpdate({ ...d, format: v as any })}
        options={["%H:%M", "%H:%M:%S", "%b %d, %I:%M %p"].map((f) => ({ value: f, label: f }))}
      />
    )
  }
  // commas
  return <Sel value={d.field} onChange={(v) => onUpdate({ ...d, field: v })} options={numericOptions} />
}

function uniqueName(base: string, existing: string[]): string {
  if (!existing.includes(base)) return base
  let i = 2
  while (existing.includes(`${base}_${i}`)) i += 1
  return `${base}_${i}`
}

function evalDefaultForKind(kind: EvalDef["kind"], id: string, fields: string[], numericFields: string[], existingNames: string[] = []): EvalDef {
  const num = numericFields[0] ?? fields[0] ?? ""
  const str = fields[0] ?? ""
  switch (kind) {
    case "arith":
      return { id, kind, newField: uniqueName("calc", existingNames), a: num, op: "+", b: num }
    case "round":
      return { id, kind, newField: uniqueName("rounded", existingNames), field: num, decimals: 2 }
    case "case2":
      return { id, kind, newField: uniqueName("label", existingNames), field: str, op: "=", value: "", thenLabel: "Yes", elseLabel: "No" }
    case "concat":
      return { id, kind, newField: uniqueName("combined", existingNames), a: str, sep: " ", b: str }
    case "strftime":
      return { id, kind, newField: uniqueName("event_time", existingNames), format: "%H:%M" }
    case "commas":
      return { id, kind, newField: uniqueName("formatted", existingNames), field: num }
  }
}

function updateListItem(config: any, key: string, index: number, item: any, onChange: (next: any) => void) {
  const arr = [...config[key]]
  arr[index] = item
  onChange({ ...config, [key]: arr })
}
function addListItem(config: any, key: string, item: any, onChange: (next: any) => void) {
  onChange({ ...config, [key]: [...config[key], item] })
}
function removeListItem(config: any, key: string, index: number, onChange: (next: any) => void) {
  onChange({ ...config, [key]: config[key].filter((_: any, i: number) => i !== index) })
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function SplPipelineBuilder() {
  const [datasetId, setDatasetId] = useState(DATASETS[0].id)
  const [filters, setFilters] = useState<Filter[]>([])
  const [stages, setStages] = useState<PipelineStage[]>([])
  const [copied, setCopied] = useState(false)
  const [timePreset, setTimePreset] = useState("all")
  const [customEarliestHour, setCustomEarliestHour] = useState(6)
  const [customLatestHour, setCustomLatestHour] = useState(11)
  const [resultView, setResultView] = useState<"table" | "viz">("table")

  const dataset = useMemo(() => getDataset(datasetId), [datasetId])
  const timeRange = useMemo(
    () => computeTimeRange(timePreset, dataset, customEarliestHour, customLatestHour),
    [timePreset, dataset, customEarliestHour, customLatestHour],
  )
  const steps = useMemo(() => runPipeline(dataset, timeRange, filters, stages), [dataset, timeRange, filters, stages])
  const finalStep = steps[steps.length - 1]
  const fullSplText = steps.map((s) => s.spl).join("\n")
  const elapsed = (0.01 + stages.length * 0.006).toFixed(2)
  const lastStageType = stages.length ? stages[stages.length - 1].type : undefined
  const canVisualize = lastStageType !== undefined && isVisualizable(lastStageType)

  function switchDataset(id: string) {
    setDatasetId(id)
    setFilters([])
    setTimePreset("all")
    setStages([])
  }

  function addFilter() {
    const field = dataset.fields.find((f) => f !== "_time") ?? dataset.fields[0]
    setFilters([...filters, { field, op: "=", value: String(distinctValues(dataset.rows, field)[0] ?? "") }])
  }
  function updateFilter(i: number, next: Filter) {
    const arr = [...filters]
    arr[i] = next
    setFilters(arr)
  }
  function removeFilter(i: number) {
    setFilters(filters.filter((_, idx) => idx !== i))
  }

  function fieldsBeforeStage(index: number) {
    return steps[index].fields
  }
  function rowsBeforeStage(index: number) {
    return steps[index].rows
  }

  function addStage(type: StageType) {
    const lastFields = steps[steps.length - 1].fields
    const lastRows = steps[steps.length - 1].rows
    const config = defaultConfig(type, lastFields, lastRows)
    if (type === "iplocation") config.field = dataset.ipField ?? ""
    setStages([...stages, { id: nextId(type), type, config }])
    if (isVisualizable(type)) setResultView("viz")
  }
  function updateStage(id: string, config: any) {
    const next = stages.map((s) => (s.id === id ? { ...s, config } : s))
    setStages(repairStages(dataset, timeRange, filters, next))
  }
  function removeStage(id: string) {
    const next = stages.filter((s) => s.id !== id)
    setStages(repairStages(dataset, timeRange, filters, next))
  }
  function moveStage(index: number, dir: -1 | 1) {
    const target = index + dir
    if (target < 0 || target >= stages.length) return
    const arr = [...stages]
    ;[arr[index], arr[target]] = [arr[target], arr[index]]
    setStages(repairStages(dataset, timeRange, filters, arr))
  }

  function copySpl() {
    navigator.clipboard.writeText(fullSplText)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const warnings = steps.filter((s) => s.warning)

  return (
    <div className="rounded-lg border border-[#2b2f33] overflow-hidden shadow-sm text-[#1e2125]">
      {/* Splunk-style app bar */}
      <div className="bg-[#12161a] text-white px-4 py-2.5 flex items-center gap-3 text-sm">
        <span className="font-bold tracking-tight">splunk&gt;</span>
        <span className="text-white/30">|</span>
        <span className="text-white/70">Search &amp; Reporting</span>
        <span className="text-white/30">|</span>
        <span className="text-white/50 font-mono text-xs">
          index={dataset.index} sourcetype={dataset.sourcetype}
        </span>
      </div>

      {/* Dataset picker */}
      <div className="bg-[#eef0f2] px-4 py-2.5 border-b border-[#d8dadd] flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono uppercase tracking-wider text-[#5c6773]">Data</span>
        {DATASETS.map((d) => (
          <Pill key={d.id} active={d.id === datasetId} onClick={() => switchDataset(d.id)}>
            {d.label}
          </Pill>
        ))}
        <span className="text-xs text-[#5c6773] ml-2">{dataset.description}</span>
      </div>

      {/* Search bar */}
      <div className="bg-white px-4 py-3 border-b border-[#d8dadd] space-y-2">
        <div className="flex items-start gap-2 flex-wrap">
          <Search className="w-4 h-4 text-[#5c6773] mt-1.5 shrink-0" />
          <pre className="flex-1 min-w-[200px] font-mono text-[13px] text-[#1e2125] whitespace-pre-wrap leading-relaxed">{fullSplText}</pre>
          <div className="shrink-0 flex items-center gap-1.5 h-8 px-2 rounded border border-[#c6cace] bg-white">
            <Clock className="w-3.5 h-3.5 text-[#5c6773]" />
            <Sel value={timePreset} onChange={setTimePreset} options={TIME_PRESET_OPTIONS} className="h-auto border-0 px-0" />
            {timePreset === "custom" && (
              <>
                <Sel
                  value={String(customEarliestHour)}
                  onChange={(v) => setCustomEarliestHour(Number(v))}
                  options={HOUR_OPTIONS}
                  className="h-auto border-0 px-0"
                />
                <span className="text-[#5c6773]">&ndash;</span>
                <Sel
                  value={String(customLatestHour)}
                  onChange={(v) => setCustomLatestHour(Number(v))}
                  options={HOUR_OPTIONS}
                  className="h-auto border-0 px-0"
                />
              </>
            )}
          </div>
          <button
            onClick={copySpl}
            className="shrink-0 flex items-center gap-1.5 h-8 px-3 rounded bg-[#0a84c4] hover:bg-[#086ba3] text-white text-xs font-semibold transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy SPL"}
          </button>
        </div>
        <div className="text-xs text-[#5c6773] font-mono">
          {finalStep.rows.length} {finalStep.isTransforming ? "results" : "events"} &middot; {elapsed}s &middot; {stages.length + 1} pipeline stage{stages.length ? "s" : ""}
          {timeRange.clause && (
            <>
              {" "}
              &middot; window: {formatEpoch(timeRange.earliest!)}&ndash;
              {timePreset !== "custom" && timeRange.latest! > datasetMaxTime(dataset) ? "latest event" : formatEpoch(timeRange.latest!)}
              {timePreset !== "custom" && " (“now” = this dataset's most recent event, for the simulation)"}
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#fafbfc] px-4 py-3 border-b border-[#d8dadd] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-[#5c6773]">Search filters (combinable, ANDed)</span>
          <button onClick={addFilter} className="flex items-center gap-1 text-xs text-[#0a84c4] hover:underline">
            <Plus className="w-3.5 h-3.5" /> Add filter
          </button>
        </div>
        {filters.length === 0 && <p className="text-xs text-[#9aa0a6]">No filters. Every event in this dataset is in scope.</p>}
        {filters.map((f, i) => (
          <div key={i} className="flex items-center gap-2">
            <Sel value={f.field} onChange={(v) => updateFilter(i, { ...f, field: v, value: String(distinctValues(dataset.rows, v)[0] ?? "") })} options={dataset.fields.map((x) => ({ value: x, label: x }))} />
            <Sel value={f.op} onChange={(v) => updateFilter(i, { ...f, op: v as "=" | "!=" })} options={[{ value: "=", label: "=" }, { value: "!=", label: "!=" }]} />
            <Sel value={f.value} onChange={(v) => updateFilter(i, { ...f, value: v })} options={distinctValues(dataset.rows, f.field).map((v) => ({ value: String(v), label: String(v) }))} />
            <IconBtn title="Remove filter" danger onClick={() => removeFilter(i)}>
              <X className="w-3.5 h-3.5" />
            </IconBtn>
          </div>
        ))}
      </div>

      {/* Pipeline stages */}
      <div className="bg-white px-4 py-3 border-b border-[#d8dadd] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-[#5c6773]">Pipeline</span>
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) addStage(e.target.value as StageType)
            }}
            className="h-8 rounded border border-[#c6cace] bg-white px-2 text-xs font-mono text-[#0a84c4]"
          >
            <option value="">+ Add command&hellip;</option>
            {STAGE_GROUP_ORDER.map((group) => (
              <optgroup key={group} label={group}>
                {STAGE_TYPES.filter((t) => stageGroup(t) === group).map((t) => (
                  <option key={t} value={t} disabled={t === "iplocation" && !dataset.ipField}>
                    {STAGE_LABELS[t]}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {stages.length === 0 && <p className="text-xs text-[#9aa0a6]">No commands yet. Add one above to start shaping the search.</p>}

        {stages.map((stage, i) => {
          const step = steps[i + 1]
          return (
            <div key={stage.id} className="rounded-md border border-[#d8dadd] overflow-hidden">
              <div className="flex items-center justify-between bg-[#eef0f2] px-3 py-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#5c6773]">#{i + 1}</span>
                  <code className="text-xs font-mono font-semibold text-[#1e2125]">{step.spl}</code>
                </div>
                <div className="flex items-center gap-1">
                  <IconBtn title="Move up" onClick={() => moveStage(i, -1)}>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </IconBtn>
                  <IconBtn title="Move down" onClick={() => moveStage(i, 1)}>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </IconBtn>
                  <IconBtn title="Remove command" danger onClick={() => removeStage(stage.id)}>
                    <X className="w-3.5 h-3.5" />
                  </IconBtn>
                </div>
              </div>
              <div className="p-3">
                <StageConfigEditor
                  type={stage.type}
                  config={stage.config}
                  fields={fieldsBeforeStage(i)}
                  rows={rowsBeforeStage(i)}
                  datasetIpField={dataset.ipField}
                  onChange={(next) => updateStage(stage.id, next)}
                />
                {step.warning && (
                  <div className="mt-2 flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    {step.warning}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Results */}
      <div className="flex bg-white min-h-[200px]">
        <div className="w-44 shrink-0 border-r border-[#d8dadd] p-3 hidden sm:block">
          <div className="text-xs font-mono uppercase tracking-wider text-[#5c6773] mb-2">Fields</div>
          <div className="space-y-1">
            {finalStep.fields.map((f) => {
              const distinct = new Set(finalStep.rows.map((r) => r[f])).size
              return (
                <div key={f} className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[#1e2125] truncate">{f}</span>
                  <span className="text-[#9aa0a6] font-mono shrink-0 ml-1">{distinct}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4 px-4 pt-3 border-b border-[#d8dadd]">
            <button
              onClick={() => setResultView("table")}
              className={cn(
                "text-xs font-semibold pb-2 border-b-2",
                resultView === "table" || !canVisualize ? "text-[#0a84c4] border-[#0a84c4]" : "text-[#5c6773] border-transparent hover:text-[#1e2125]",
              )}
            >
              {finalStep.isTransforming ? "Statistics" : "Events"}
            </button>
            {canVisualize && (
              <button
                onClick={() => setResultView("viz")}
                className={cn(
                  "text-xs font-semibold pb-2 border-b-2",
                  resultView === "viz" ? "text-[#0a84c4] border-[#0a84c4]" : "text-[#5c6773] border-transparent hover:text-[#1e2125]",
                )}
              >
                Visualization
              </button>
            )}
          </div>

          {canVisualize && resultView === "viz" ? (
            <div className="p-4">
              <SplVisualization step={finalStep} stageType={lastStageType} config={stages[stages.length - 1]?.config} />
            </div>
          ) : (
            <div className="overflow-x-auto p-4">
              {finalStep.rows.length === 0 ? (
                <p className="text-sm text-[#9aa0a6]">No results. Loosen a filter or remove a command.</p>
              ) : (
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#d8dadd] bg-[#eef0f2]">
                      {finalStep.fields.map((f) => (
                        <th key={f} className="px-3 py-2 text-left font-semibold text-[#1e2125] whitespace-nowrap">
                          {f}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {finalStep.rows.map((r, i) => (
                      <tr key={i} className={cn("border-b border-[#eef0f2] last:border-0", i % 2 === 1 && "bg-[#fafbfc]")}>
                        {finalStep.fields.map((f) => {
                          const v = r[f]
                          const formatter = finalStep.formatters[f]
                          const display = formatter ? formatter(v) : f === "_time" && typeof v === "number" ? formatEpoch(v) : String(v)
                          return (
                            <td key={f} className="px-3 py-2 text-[#1e2125] whitespace-nowrap">
                              {display === "" ? <span className="text-[#c6cace]">(empty)</span> : display}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>

      {warnings.length > 0 && (
        <div className="bg-amber-50 border-t border-amber-200 px-4 py-2">
          <p className="text-xs text-amber-700">
            {warnings.length} pipeline warning{warnings.length > 1 ? "s" : ""}: check the highlighted command{warnings.length > 1 ? "s" : ""} above.
          </p>
        </div>
      )}
    </div>
  )
}
