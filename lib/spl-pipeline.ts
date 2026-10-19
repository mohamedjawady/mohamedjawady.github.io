// A small, real SPL interpreter over static sample datasets, used to power the
// interactive Splunk SPL pipeline builder. Every stage actually transforms rows,
// so chaining stages produces a genuinely correct result, not a canned example.

export type CellValue = string | number
export type Row = Record<string, CellValue>

export interface GeoInfo {
  country: string
  city: string
  lat: number
  lon: number
}

const DAY_START = Date.UTC(2026, 9, 16, 0, 0, 0) / 1000 // 2026-10-16T00:00:00Z

function T(h: number, m = 0, s = 0): number {
  return DAY_START + h * 3600 + m * 60 + s
}

export function formatEpoch(epoch: number): string {
  if (!Number.isFinite(epoch)) return "(no _time)"
  const d = new Date(epoch * 1000)
  const hh = String(d.getUTCHours()).padStart(2, "0")
  const mm = String(d.getUTCMinutes()).padStart(2, "0")
  const ss = String(d.getUTCSeconds()).padStart(2, "0")
  return `${hh}:${mm}:${ss}`
}

// Splunk's real accepted format for an absolute timestamp literal, e.g.
// earliest="10/16/2026:06:00:00".
export function formatSplTimestamp(epoch: number): string {
  const d = new Date(epoch * 1000)
  const mo = String(d.getUTCMonth() + 1).padStart(2, "0")
  const da = String(d.getUTCDate()).padStart(2, "0")
  const yr = d.getUTCFullYear()
  const hh = String(d.getUTCHours()).padStart(2, "0")
  const mm = String(d.getUTCMinutes()).padStart(2, "0")
  const ss = String(d.getUTCSeconds()).padStart(2, "0")
  return `${mo}/${da}/${yr}:${hh}:${mm}:${ss}`
}

// Epoch for a given hour on the sample dataset's fixed day, used to build the
// custom time-range picker's hour options.
export function hourMark(hour: number): number {
  return T(hour)
}

export interface TimeRange {
  earliest: number | null
  // exclusive upper bound, matching Splunk's own earliest <= _time < latest semantics
  latest: number | null
  // the literal SPL clause to display, e.g. "earliest=-1h latest=now", or "" for all time
  clause: string
}

export const ALL_TIME: TimeRange = { earliest: null, latest: null, clause: "" }

export function datasetMaxTime(dataset: Dataset): number {
  return Math.max(...dataset.rows.map((r) => Number(r._time)))
}

export const IP_GEO: Record<string, GeoInfo> = {
  "198.51.100.44": { country: "Germany", city: "Frankfurt", lat: 50.1109, lon: 8.6821 },
  "203.0.113.201": { country: "United States", city: "Ashburn", lat: 39.0438, lon: -77.4874 },
  "198.51.100.9": { country: "Brazil", city: "Sao Paulo", lat: -23.5505, lon: -46.6333 },
  "192.0.2.150": { country: "Russia", city: "Moscow", lat: 55.7558, lon: 37.6173 },
}

export interface Dataset {
  id: string
  label: string
  index: string
  sourcetype: string
  description: string
  fields: string[]
  ipField?: string
  rows: Row[]
}

export const DATASETS: Dataset[] = [
  {
    id: "firewall",
    label: "Firewall traffic",
    index: "firewall",
    sourcetype: "pan_traffic",
    description: "Perimeter firewall connection log: who talked to what, over which app, allowed or blocked.",
    fields: ["_time", "user", "src_ip", "dest_ip", "dest_port", "app", "action", "bytes_out"],
    rows: [
      { _time: T(6, 10), user: "jsmith", src_ip: "10.1.2.15", dest_ip: "203.0.113.9", dest_port: 443, app: "tls", action: "allowed", bytes_out: 4820 },
      { _time: T(6, 45), user: "jsmith", src_ip: "10.1.2.15", dest_ip: "203.0.113.9", dest_port: 443, app: "tls", action: "allowed", bytes_out: 1190 },
      { _time: T(7, 5), user: "mchen", src_ip: "10.1.4.22", dest_ip: "198.51.100.7", dest_port: 22, app: "ssh", action: "blocked", bytes_out: 0 },
      { _time: T(7, 20), user: "svc_backup", src_ip: "10.1.9.3", dest_ip: "192.0.2.50", dest_port: 3389, app: "rdp", action: "allowed", bytes_out: 15400 },
      { _time: T(7, 55), user: "mchen", src_ip: "10.1.4.22", dest_ip: "198.51.100.7", dest_port: 22, app: "ssh", action: "blocked", bytes_out: 0 },
      { _time: T(8, 10), user: "agupta", src_ip: "10.1.2.44", dest_ip: "203.0.113.9", dest_port: 443, app: "tls", action: "allowed", bytes_out: 2310 },
      { _time: T(8, 30), user: "mchen", src_ip: "10.1.4.22", dest_ip: "198.51.100.7", dest_port: 22, app: "ssh", action: "blocked", bytes_out: 0 },
      { _time: T(8, 50), user: "jsmith", src_ip: "10.1.2.15", dest_ip: "203.0.113.9", dest_port: 443, app: "tls", action: "allowed", bytes_out: 980 },
      { _time: T(9, 5), user: "kpatel", src_ip: "10.1.7.12", dest_ip: "198.51.100.21", dest_port: 8081, app: "http", action: "allowed", bytes_out: 640 },
      { _time: T(9, 25), user: "svc_backup", src_ip: "10.1.9.3", dest_ip: "192.0.2.50", dest_port: 3389, app: "rdp", action: "allowed", bytes_out: 12850 },
      { _time: T(9, 40), user: "mchen", src_ip: "10.1.4.22", dest_ip: "198.51.100.7", dest_port: 22, app: "ssh", action: "blocked", bytes_out: 0 },
      { _time: T(9, 55), user: "agupta", src_ip: "10.1.2.44", dest_ip: "203.0.113.9", dest_port: 443, app: "tls", action: "allowed", bytes_out: 3105 },
      { _time: T(10, 15), user: "kpatel", src_ip: "10.1.7.12", dest_ip: "198.51.100.21", dest_port: 8081, app: "http", action: "allowed", bytes_out: 410 },
      { _time: T(10, 40), user: "jsmith", src_ip: "10.1.2.15", dest_ip: "203.0.113.9", dest_port: 443, app: "tls", action: "allowed", bytes_out: 2200 },
    ],
  },
  {
    id: "auth",
    label: "Authentication (Okta)",
    index: "auth",
    sourcetype: "okta",
    description: "Identity provider login events, including a brute-force cluster from one unusual source IP.",
    fields: ["_time", "user", "auth_result", "src_ip", "app", "mfa_used"],
    ipField: "src_ip",
    rows: [
      { _time: T(6, 12), user: "jsmith", auth_result: "success", src_ip: "198.51.100.44", app: "okta_web", mfa_used: "true" },
      { _time: T(6, 50), user: "mchen", auth_result: "success", src_ip: "198.51.100.44", app: "okta_web", mfa_used: "true" },
      { _time: T(7, 10), user: "agupta", auth_result: "success", src_ip: "203.0.113.201", app: "okta_web", mfa_used: "true" },
      { _time: T(7, 30), user: "unknown", auth_result: "failure", src_ip: "192.0.2.150", app: "okta_web", mfa_used: "false" },
      { _time: T(7, 31), user: "unknown", auth_result: "failure", src_ip: "192.0.2.150", app: "okta_web", mfa_used: "false" },
      { _time: T(7, 32), user: "unknown", auth_result: "failure", src_ip: "192.0.2.150", app: "okta_web", mfa_used: "false" },
      { _time: T(7, 33), user: "admin", auth_result: "failure", src_ip: "192.0.2.150", app: "okta_web", mfa_used: "false" },
      { _time: T(8, 5), user: "kpatel", auth_result: "success", src_ip: "198.51.100.9", app: "okta_web", mfa_used: "true" },
      { _time: T(8, 40), user: "svc_backup", auth_result: "success", src_ip: "203.0.113.201", app: "okta_api", mfa_used: "false" },
      { _time: T(9, 0), user: "admin", auth_result: "failure", src_ip: "192.0.2.150", app: "okta_web", mfa_used: "false" },
      { _time: T(9, 15), user: "jsmith", auth_result: "success", src_ip: "198.51.100.44", app: "okta_web", mfa_used: "true" },
      { _time: T(9, 45), user: "mchen", auth_result: "failure", src_ip: "198.51.100.44", app: "okta_web", mfa_used: "true" },
      { _time: T(10, 0), user: "mchen", auth_result: "success", src_ip: "198.51.100.44", app: "okta_web", mfa_used: "true" },
      { _time: T(10, 30), user: "agupta", auth_result: "success", src_ip: "203.0.113.201", app: "okta_web", mfa_used: "true" },
    ],
  },
  {
    id: "web",
    label: "Web access (nginx)",
    index: "web",
    sourcetype: "nginx_access",
    description: "Public-facing web access log, including a scripted login-guessing burst against /wp-login.php.",
    fields: ["_time", "clientip", "uri_path", "status", "bytes", "method"],
    ipField: "clientip",
    rows: [
      { _time: T(6, 20), clientip: "198.51.100.44", uri_path: "/login", status: 200, bytes: 1820, method: "GET" },
      { _time: T(6, 21), clientip: "198.51.100.44", uri_path: "/dashboard", status: 200, bytes: 5400, method: "GET" },
      { _time: T(7, 0), clientip: "203.0.113.201", uri_path: "/login", status: 200, bytes: 1820, method: "GET" },
      { _time: T(7, 35), clientip: "192.0.2.150", uri_path: "/login", status: 401, bytes: 512, method: "POST" },
      { _time: T(7, 36), clientip: "192.0.2.150", uri_path: "/login", status: 401, bytes: 512, method: "POST" },
      { _time: T(7, 37), clientip: "192.0.2.150", uri_path: "/admin", status: 403, bytes: 310, method: "GET" },
      { _time: T(8, 15), clientip: "198.51.100.9", uri_path: "/login", status: 200, bytes: 1820, method: "GET" },
      { _time: T(8, 16), clientip: "198.51.100.9", uri_path: "/reports", status: 200, bytes: 8900, method: "GET" },
      { _time: T(9, 10), clientip: "203.0.113.201", uri_path: "/api/export", status: 200, bytes: 15200, method: "GET" },
      { _time: T(9, 42), clientip: "192.0.2.150", uri_path: "/wp-login.php", status: 404, bytes: 220, method: "GET" },
      { _time: T(9, 43), clientip: "192.0.2.150", uri_path: "/wp-login.php", status: 404, bytes: 220, method: "GET" },
      { _time: T(10, 5), clientip: "198.51.100.44", uri_path: "/dashboard", status: 200, bytes: 5400, method: "GET" },
      { _time: T(10, 20), clientip: "198.51.100.9", uri_path: "/login", status: 200, bytes: 1820, method: "GET" },
      { _time: T(10, 50), clientip: "203.0.113.201", uri_path: "/logout", status: 200, bytes: 310, method: "GET" },
    ],
  },
  {
    id: "cloud",
    label: "Cloud API (CloudTrail)",
    index: "cloud",
    sourcetype: "aws_cloudtrail",
    description: "AWS control-plane API calls, including a string of AccessDenied calls from the same source as the Okta brute force.",
    fields: ["_time", "eventName", "userIdentity", "sourceIPAddress", "awsRegion", "errorCode"],
    ipField: "sourceIPAddress",
    rows: [
      { _time: T(6, 30), eventName: "ConsoleLogin", userIdentity: "jsmith", sourceIPAddress: "198.51.100.44", awsRegion: "us-east-1", errorCode: "-" },
      { _time: T(7, 0), eventName: "ListBuckets", userIdentity: "svc_backup", sourceIPAddress: "203.0.113.201", awsRegion: "us-east-1", errorCode: "-" },
      { _time: T(7, 45), eventName: "ConsoleLogin", userIdentity: "unknown", sourceIPAddress: "192.0.2.150", awsRegion: "eu-central-1", errorCode: "AccessDenied" },
      { _time: T(7, 46), eventName: "AssumeRole", userIdentity: "unknown", sourceIPAddress: "192.0.2.150", awsRegion: "eu-central-1", errorCode: "AccessDenied" },
      { _time: T(8, 0), eventName: "PutObject", userIdentity: "svc_backup", sourceIPAddress: "203.0.113.201", awsRegion: "us-east-1", errorCode: "-" },
      { _time: T(8, 30), eventName: "DeleteBucket", userIdentity: "admin", sourceIPAddress: "192.0.2.150", awsRegion: "eu-central-1", errorCode: "AccessDenied" },
      { _time: T(9, 0), eventName: "GetObject", userIdentity: "kpatel", sourceIPAddress: "198.51.100.9", awsRegion: "sa-east-1", errorCode: "-" },
      { _time: T(9, 20), eventName: "CreateUser", userIdentity: "unknown", sourceIPAddress: "192.0.2.150", awsRegion: "eu-central-1", errorCode: "AccessDenied" },
      { _time: T(9, 45), eventName: "ConsoleLogin", userIdentity: "agupta", sourceIPAddress: "203.0.113.201", awsRegion: "us-east-1", errorCode: "-" },
      { _time: T(10, 0), eventName: "ListBuckets", userIdentity: "jsmith", sourceIPAddress: "198.51.100.44", awsRegion: "us-east-1", errorCode: "-" },
      { _time: T(10, 30), eventName: "PutObject", userIdentity: "svc_backup", sourceIPAddress: "203.0.113.201", awsRegion: "us-east-1", errorCode: "-" },
      { _time: T(10, 45), eventName: "DeleteBucket", userIdentity: "unknown", sourceIPAddress: "192.0.2.150", awsRegion: "eu-central-1", errorCode: "AccessDenied" },
    ],
  },
]

export function getDataset(id: string): Dataset {
  return DATASETS.find((d) => d.id === id) ?? DATASETS[0]
}

// ---------------------------------------------------------------------------
// Generic helpers
// ---------------------------------------------------------------------------

export function isNumericField(rows: Row[], field: string): boolean {
  if (rows.length === 0) return false
  return rows.every((r) => typeof r[field] === "number")
}

export function distinctValues(rows: Row[], field: string): CellValue[] {
  const seen = new Set<CellValue>()
  const out: CellValue[] = []
  for (const r of rows) {
    const v = r[field]
    if (v === undefined) continue
    if (!seen.has(v)) {
      seen.add(v)
      out.push(v)
    }
  }
  return out
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

function numericFieldsOf(rows: Row[], exclude: string[] = []): string[] {
  if (rows.length === 0) return []
  return Object.keys(rows[0]).filter((f) => !exclude.includes(f) && isNumericField(rows, f))
}

// ---------------------------------------------------------------------------
// Filters (the base search line)
// ---------------------------------------------------------------------------

export interface Filter {
  field: string
  op: "=" | "!="
  value: string
}

export function applyFilters(rows: Row[], filters: Filter[]): Row[] {
  return rows.filter((r) =>
    filters.every((f) => {
      const matches = String(r[f.field]) === f.value
      return f.op === "=" ? matches : !matches
    }),
  )
}

export function filtersToSpl(filters: Filter[]): string {
  return filters.map((f) => `${f.field}${f.op}${f.value}`).join(" ")
}

// ---------------------------------------------------------------------------
// Stats aggregation functions, shared by stats / chart / timechart / top / rare
// ---------------------------------------------------------------------------

export type AggFn = "count" | "count_field" | "dc" | "sum" | "avg" | "min" | "max" | "values" | "list"

export const AGG_FN_LABELS: Record<AggFn, string> = {
  count: "count",
  count_field: "count(field)",
  dc: "dc (distinct count)",
  sum: "sum",
  avg: "avg",
  min: "min",
  max: "max",
  values: "values (distinct)",
  list: "list (all, with dupes)",
}

export function aggNeedsField(fn: AggFn): boolean {
  return fn !== "count"
}

export function computeAgg(fn: AggFn, field: string | undefined, rows: Row[]): CellValue {
  if (fn === "count") return rows.length
  if (!field) return ""
  if (fn === "count_field") return rows.filter((r) => r[field] !== undefined && r[field] !== "").length
  if (fn === "dc") return distinctValues(rows, field).length
  const nums = rows.map((r) => Number(r[field])).filter((n) => !Number.isNaN(n))
  if (fn === "sum") return nums.reduce((a, b) => a + b, 0)
  if (fn === "avg") return nums.length ? round2(nums.reduce((a, b) => a + b, 0) / nums.length) : 0
  if (fn === "min") return nums.length ? Math.min(...nums) : 0
  if (fn === "max") return nums.length ? Math.max(...nums) : 0
  if (fn === "values") return distinctValues(rows, field).join(", ")
  if (fn === "list") return rows.map((r) => r[field]).join(", ")
  return ""
}

export function aggToSpl(fn: AggFn, field: string | undefined): string {
  if (fn === "count") return "count"
  if (fn === "count_field") return `count(${field})`
  return `${fn}(${field})`
}

// ---------------------------------------------------------------------------
// Stage configs
// ---------------------------------------------------------------------------

export type StageType =
  | "fields"
  | "table"
  | "dedup"
  | "rename"
  | "sort"
  | "fieldformat"
  | "head"
  | "reverse"
  | "search"
  | "where"
  | "rex"
  | "regex"
  | "lookup"
  | "stats"
  | "addtotals"
  | "streamstats"
  | "eventstats"
  | "transaction"
  | "top"
  | "rare"
  | "chart"
  | "timechart"
  | "trendline"
  | "timewrap"
  | "bin"
  | "eval"
  | "iplocation"
  | "geostats"
  | "geom"
  | "gauge"

// A handful of tiny built-in lookup tables, standing in for the CSV lookups
// real Splunk reads from disk (e.g. the tutorial's `coldplay.csv`). Used by
// both the `lookup` stage (join onto existing results) and the freeform
// parser's explanation of why `inputlookup` isn't supported as a source.
export interface LookupTable {
  columns: string[]
  rows: Row[]
}

export const LOOKUP_TABLES: Record<string, LookupTable> = {
  "ports.csv": {
    columns: ["port", "service", "risk"],
    rows: [
      { port: 22, service: "ssh", risk: "high" },
      { port: 443, service: "https", risk: "low" },
      { port: 3389, service: "rdp", risk: "high" },
      { port: 8081, service: "http-alt", risk: "medium" },
    ],
  },
  "ip_watchlist.csv": {
    columns: ["ip", "label"],
    rows: [
      { ip: "192.0.2.150", label: "known-bad" },
      { ip: "203.0.113.201", label: "partner-vpn" },
      { ip: "198.51.100.44", label: "corp-office" },
    ],
  },
}

export interface StatFnEntry {
  id: string
  fn: AggFn
  field?: string
  alias: string
}

export type EvalDef =
  | { id: string; kind: "arith"; newField: string; a: string; op: "+" | "-" | "*" | "/"; b: string }
  | { id: string; kind: "round"; newField: string; field: string; decimals: number }
  | { id: string; kind: "case2"; newField: string; field: string; op: "=" | "!=" | ">" | "<"; value: string; thenLabel: string; elseLabel: string }
  | { id: string; kind: "concat"; newField: string; a: string; sep: string; b: string }
  | { id: string; kind: "strftime"; newField: string; format: "%H:%M" | "%H:%M:%S" | "%b %d, %I:%M %p" }
  | { id: string; kind: "commas"; newField: string; field: string }

export interface PipelineStage {
  id: string
  type: StageType
  config: any
}

export interface StepResult {
  label: string
  spl: string
  rows: Row[]
  fields: string[]
  warning?: string
  isTransforming: boolean
  formatters: Record<string, (v: CellValue) => string>
}

const STAGE_GROUPS: Record<StageType, string> = {
  search: "Search & Filtering",
  where: "Search & Filtering",
  rex: "Search & Filtering",
  regex: "Search & Filtering",
  lookup: "Search & Filtering",
  fields: "Field Selection & Formatting",
  table: "Field Selection & Formatting",
  dedup: "Field Selection & Formatting",
  rename: "Field Selection & Formatting",
  sort: "Field Selection & Formatting",
  fieldformat: "Field Selection & Formatting",
  head: "Field Selection & Formatting",
  reverse: "Field Selection & Formatting",
  stats: "Aggregation & Statistics",
  addtotals: "Aggregation & Statistics",
  streamstats: "Aggregation & Statistics",
  eventstats: "Aggregation & Statistics",
  transaction: "Aggregation & Statistics",
  top: "Transforming & Trend",
  rare: "Transforming & Trend",
  chart: "Transforming & Trend",
  timechart: "Transforming & Trend",
  trendline: "Transforming & Trend",
  timewrap: "Transforming & Trend",
  bin: "Time & eval",
  eval: "Time & eval",
  iplocation: "Geospatial & Visualization",
  geostats: "Geospatial & Visualization",
  geom: "Geospatial & Visualization",
  gauge: "Geospatial & Visualization",
}

// "transaction" is the only addition that collapses events into a summary
// the way stats/chart/timechart/top/rare/geostats do. streamstats, eventstats,
// trendline, and timewrap all add fields or restructure columns without
// throwing away the per-event field set, which is why real Splunk doesn't
// class them as transforming either.
const TRANSFORMING: Set<StageType> = new Set(["table", "stats", "addtotals", "top", "rare", "chart", "timechart", "geostats", "transaction"])

export const STAGE_TYPES: StageType[] = [
  "search",
  "where",
  "rex",
  "regex",
  "lookup",
  "fields",
  "table",
  "dedup",
  "rename",
  "sort",
  "fieldformat",
  "head",
  "reverse",
  "stats",
  "addtotals",
  "streamstats",
  "eventstats",
  "transaction",
  "top",
  "rare",
  "chart",
  "timechart",
  "trendline",
  "timewrap",
  "bin",
  "eval",
  "iplocation",
  "geostats",
  "geom",
  "gauge",
]

export const STAGE_LABELS: Record<StageType, string> = {
  search: "search",
  where: "where",
  rex: "rex",
  regex: "regex",
  lookup: "lookup",
  fields: "fields",
  table: "table",
  dedup: "dedup",
  rename: "rename",
  sort: "sort",
  fieldformat: "fieldformat",
  head: "head",
  reverse: "reverse",
  stats: "stats",
  addtotals: "addtotals",
  streamstats: "streamstats",
  eventstats: "eventstats",
  transaction: "transaction",
  top: "top",
  rare: "rare",
  chart: "chart",
  timechart: "timechart",
  trendline: "trendline",
  timewrap: "timewrap",
  bin: "bin",
  eval: "eval",
  iplocation: "iplocation",
  geostats: "geostats",
  geom: "geom",
  gauge: "gauge",
}

export function stageGroup(type: StageType): string {
  return STAGE_GROUPS[type]
}

export const STAGE_GROUP_ORDER = [
  "Search & Filtering",
  "Field Selection & Formatting",
  "Aggregation & Statistics",
  "Transforming & Trend",
  "Time & eval",
  "Geospatial & Visualization",
] as const

export function isGeoStage(type: StageType): boolean {
  return type === "iplocation" || type === "geostats"
}

let uid = 0
export function nextId(prefix: string): string {
  uid += 1
  return `${prefix}_${uid}_${Math.random().toString(36).slice(2, 7)}`
}

// ---------------------------------------------------------------------------
// Default configs
// ---------------------------------------------------------------------------

export function defaultConfig(type: StageType, fields: string[], rows: Row[]): any {
  const numeric = numericFieldsOf(rows)
  const firstField = fields[0] ?? ""
  // _time is technically numeric and is almost always the first field, but it's
  // a poor default for "pick a field to group/sort/format by": every event has a
  // unique value, so grouping or deduping on it degenerates to one row per event.
  const firstNonTime = fields.find((f) => f !== "_time") ?? firstField
  const firstNumeric = numeric[0] ?? firstField
  const firstNumericNonTime = numeric.find((f) => f !== "_time") ?? numeric[0] ?? firstNonTime
  switch (type) {
    case "fields":
      return { mode: "keep", fields: fields.slice(0, Math.min(3, fields.length)) }
    case "table":
      return { fields: fields.slice(0, Math.min(4, fields.length)) }
    case "dedup":
      return { fields: [firstNonTime] }
    case "rename":
      return { mappings: [{ id: nextId("rn"), from: firstNonTime, to: firstNonTime ? `${firstNonTime}_renamed` : "" }] }
    case "sort":
      return { keys: [{ id: nextId("sk"), field: firstNumeric, dir: "desc" as const }] }
    case "fieldformat":
      return { field: firstNumericNonTime }
    case "head":
      return { n: 5 }
    case "reverse":
      return {}
    case "search":
      return { filters: [{ field: firstNonTime, op: "=" as const, value: String(distinctValues(rows, firstNonTime)[0] ?? "") }] }
    case "where":
      return { expr: firstNumericNonTime ? `${firstNumericNonTime}>0` : "" }
    case "rex":
      return { field: firstNonTime, pattern: "" }
    case "regex":
      return { field: firstNonTime, pattern: "", negate: false }
    case "lookup": {
      const tableName = Object.keys(LOOKUP_TABLES)[0]
      const table = LOOKUP_TABLES[tableName]
      return { table: tableName, lookupKey: table.columns[0], matchField: firstNonTime, outputs: table.columns.slice(1) }
    }
    case "stats":
      return {
        fns: [{ id: nextId("fn"), fn: "count" as AggFn, field: undefined, alias: "count" }],
        by: fields.includes("user") ? ["user"] : [firstNonTime],
      }
    case "addtotals":
      return { row: true, col: false, fieldname: "Total" }
    case "streamstats":
    case "eventstats":
      return {
        fns: [{ id: nextId("fn"), fn: "count" as AggFn, field: undefined, alias: type === "streamstats" ? "running_count" : "total_count" }],
        by: [] as string[],
      }
    case "transaction":
      return { field: firstNonTime }
    case "top":
    case "rare":
      return { field: firstNonTime, limit: 3, by: "" }
    case "chart":
      return { fn: "count" as AggFn, field: undefined, over: firstNonTime, by: "" }
    case "timechart":
      return { fn: "count" as AggFn, field: undefined, span: "1h", by: "" }
    case "trendline":
      return { window: 3, field: firstNumericNonTime, alias: `sma3_${firstNumericNonTime}` }
    case "timewrap":
      return { period: "1h" }
    case "bin":
      return { field: "_time", span: "1h" }
    case "eval":
      return {
        defs: [
          { id: nextId("ev"), kind: "round", newField: "rounded", field: firstNumericNonTime, decimals: 2 } as EvalDef,
        ],
      }
    case "iplocation":
      return { field: "" }
    case "geostats":
      return { fn: "count" as AggFn, field: undefined, by: "" }
    case "geom":
      return { featureIdField: fields.includes("Country") ? "Country" : firstNonTime }
    case "gauge":
      return { field: firstNumericNonTime, t0: 0, t1: 50, t2: 150, t3: 300 }
    default:
      return {}
  }
}

// ---------------------------------------------------------------------------
// Apply + toSpl per stage
// ---------------------------------------------------------------------------

interface ApplyResult {
  rows: Row[]
  warning?: string
  formatter?: { field: string; fn: (v: CellValue) => string }
}

function spanToSeconds(span: string): number {
  const m = span.match(/^(\d+)([smhdw])$/)
  if (!m) return 3600
  const n = Number(m[1])
  const unit = m[2]
  const mult: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400, w: 604800 }
  return n * (mult[unit] ?? 3600)
}

function binTime(epoch: number, spanSeconds: number): number {
  return Math.floor(epoch / spanSeconds) * spanSeconds
}

function orderRows(rows: Row[], order: string[]): Row[] {
  return rows.map((r) => {
    const out: Row = {}
    for (const f of order) if (f in r) out[f] = r[f]
    return out
  })
}

function evalExprToSpl(d: EvalDef): string {
  switch (d.kind) {
    case "arith":
      return `${d.newField} = ${d.a} ${d.op} ${d.b}`
    case "round":
      return `${d.newField} = round(${d.field}, ${d.decimals})`
    case "case2":
      return `${d.newField} = case(${d.field}${d.op}${d.op === "=" || d.op === "!=" ? `"${d.value}"` : d.value}, "${d.thenLabel}", 1=1, "${d.elseLabel}")`
    case "concat":
      return `${d.newField} = ${d.a} . "${d.sep}" . ${d.b}`
    case "strftime":
      return `${d.newField} = strftime(_time, "${d.format}")`
    case "commas":
      return `${d.newField} = tostring(${d.field}, "commas")`
  }
}

function evalCompute(d: EvalDef, r: Row): CellValue {
  switch (d.kind) {
    case "arith": {
      const a = typeof r[d.a] === "number" ? (r[d.a] as number) : Number(d.a)
      const b = typeof r[d.b] === "number" ? (r[d.b] as number) : Number(d.b)
      if (Number.isNaN(a) || Number.isNaN(b)) return ""
      if (d.op === "+") return round2(a + b)
      if (d.op === "-") return round2(a - b)
      if (d.op === "*") return round2(a * b)
      return b !== 0 ? round2(a / b) : 0
    }
    case "round": {
      const v = Number(r[d.field])
      return Number.isNaN(v) ? "" : round2(v)
    }
    case "case2": {
      const left = r[d.field]
      const rightNum = Number(d.value)
      let matched = false
      if (d.op === "=") matched = String(left) === d.value
      else if (d.op === "!=") matched = String(left) !== d.value
      else if (d.op === ">") matched = Number(left) > rightNum
      else matched = Number(left) < rightNum
      return matched ? d.thenLabel : d.elseLabel
    }
    case "concat":
      return `${r[d.a] ?? ""}${d.sep}${r[d.b] ?? ""}`
    case "strftime": {
      const epoch = Number(r._time)
      if (Number.isNaN(epoch)) return ""
      const date = new Date(epoch * 1000)
      const hh = String(date.getUTCHours()).padStart(2, "0")
      const mm = String(date.getUTCMinutes()).padStart(2, "0")
      const ss = String(date.getUTCSeconds()).padStart(2, "0")
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      const dayStart = Date.UTC(2026, 9, 16, 0, 0, 0) / 1000
      const dayIdx = Math.floor((epoch - dayStart) / 86400)
      const month = months[(9 + dayIdx) % 12]
      const dayNum = 16 + dayIdx
      const h12 = Number(hh) % 12 === 0 ? 12 : Number(hh) % 12
      const ampm = Number(hh) >= 12 ? "PM" : "AM"
      if (d.format === "%H:%M") return `${hh}:${mm}`
      if (d.format === "%H:%M:%S") return `${hh}:${mm}:${ss}`
      return `${month} ${dayNum}, ${String(h12).padStart(2, "0")}:${mm} ${ampm}`
    }
    case "commas": {
      const v = Number(r[d.field])
      if (Number.isNaN(v)) return ""
      return v.toLocaleString("en-US")
    }
  }
}

export function stageToSpl(type: StageType, config: any): string {
  switch (type) {
    case "fields": {
      const prefix = config.mode === "exclude" ? "- " : ""
      return `| fields ${prefix}${config.fields.join(", ")}`
    }
    case "table":
      return `| table ${config.fields.join(" ")}`
    case "dedup":
      return `| dedup ${config.fields.join(" ")}`
    case "rename":
      return `| rename ${config.mappings.map((m: any) => `${m.from} AS ${m.to}`).join(", ")}`
    case "sort":
      return `| sort ${config.keys.map((k: any) => `${k.dir === "desc" ? "-" : "+"}${k.field}`).join(" ")}`
    case "fieldformat":
      return `| fieldformat ${config.field} = tostring(${config.field}, "commas")`
    case "head":
      return `| head ${config.n}`
    case "reverse":
      return `| reverse`
    case "search":
      return `| search ${filtersToSpl(config.filters)}`
    case "where":
      return `| where ${config.expr}`
    case "rex":
      return `| rex field=${config.field} "${config.pattern}"`
    case "regex":
      return `| regex ${config.field}${config.negate ? "!=" : "="}"${config.pattern}"`
    case "lookup": {
      const outputs = config.outputs.join(" ")
      return `| lookup ${config.table} ${config.lookupKey} as ${config.matchField} OUTPUTNEW ${outputs}`
    }
    case "stats": {
      const fns = config.fns.map((f: StatFnEntry) => `${aggToSpl(f.fn, f.field)} as ${f.alias}`).join(", ")
      const by = config.by.length ? ` by ${config.by.join(", ")}` : ""
      return `| stats ${fns}${by}`
    }
    case "addtotals": {
      const parts = [`row=${config.row}`, `col=${config.col}`]
      if (config.row) parts.push(`fieldname="${config.fieldname}"`)
      return `| addtotals ${parts.join(" ")}`
    }
    case "streamstats":
    case "eventstats": {
      const fns = config.fns.map((f: StatFnEntry) => `${aggToSpl(f.fn, f.field)} as ${f.alias}`).join(", ")
      const by = config.by.length ? ` by ${config.by.join(", ")}` : ""
      return `| ${type} ${fns}${by}`
    }
    case "transaction":
      return `| transaction ${config.field}`
    case "top":
    case "rare": {
      const by = config.by ? ` by ${config.by}` : ""
      return `| ${type} ${config.field} limit=${config.limit}${by}`
    }
    case "chart": {
      const by = config.by ? ` by ${config.by}` : ""
      return `| chart ${aggToSpl(config.fn, config.field)} over ${config.over}${by}`
    }
    case "timechart": {
      const by = config.by ? ` by ${config.by}` : ""
      return `| timechart span=${config.span} ${aggToSpl(config.fn, config.field)}${by}`
    }
    case "trendline":
      return `| trendline sma${config.window}(${config.field}) AS ${config.alias}`
    case "timewrap":
      return `| timewrap ${config.period}`
    case "bin":
      return config.field === "_time" ? `| bin span=${config.span} _time` : `| bin ${config.field} span=${config.span}`
    case "eval":
      return `| eval ${config.defs.map((d: EvalDef) => evalExprToSpl(d)).join(",\n       ")}`
    case "iplocation":
      return `| iplocation ${config.field}`
    case "geostats": {
      const by = config.by ? ` by ${config.by}` : ""
      return `| geostats latfield=lat longfield=lon ${aggToSpl(config.fn, config.field)}${by}`
    }
    case "geom":
      return `| geom geo_countries featureIdField=${config.featureIdField}`
    case "gauge":
      return `| gauge ${config.field} ${config.t0} ${config.t1} ${config.t2} ${config.t3}`
  }
}

function compareNum(a: number, op: string, b: number): boolean {
  switch (op) {
    case "=":
      return a === b
    case "!=":
      return a !== b
    case ">":
      return a > b
    case "<":
      return a < b
    case ">=":
      return a >= b
    case "<=":
      return a <= b
    default:
      return false
  }
}

// A small `where` evaluator covering the forms used throughout the SPL
// tutorial: len(field) OP n, match(field,"regex"), plain field OP value, each
// optionally negated with NOT, ANDed together. No OR, matching the same
// AND-only scope as the base search above.
function evalWhereCondition(cond: string, row: Row): boolean {
  const c = cond.trim()
  let m: RegExpMatchArray | null
  if ((m = c.match(/^len\(([\w.]+)\)\s*(=|!=|>=|<=|>|<)\s*(\d+(?:\.\d+)?)$/i))) {
    const len = String(row[m[1]] ?? "").length
    return compareNum(len, m[2], Number(m[3]))
  }
  if ((m = c.match(/^match\(([\w.]+)\s*,\s*"([^"]+)"\)$/i))) {
    try {
      return new RegExp(m[2]).test(String(row[m[1]] ?? ""))
    } catch {
      return false
    }
  }
  if ((m = c.match(/^([\w.]+)\s*(=|!=|>=|<=|>|<)\s*"?([^"]*)"?$/))) {
    const [, field, op, raw] = m
    const left = row[field]
    if (op === "=" || op === "!=") {
      const eq = String(left) === raw
      return op === "=" ? eq : !eq
    }
    const leftNum = Number(left)
    const rightNum = Number(raw)
    if (Number.isNaN(leftNum) || Number.isNaN(rightNum)) return false
    return compareNum(leftNum, op, rightNum)
  }
  return false
}

function evalWhereExpr(expr: string, row: Row): boolean {
  const parts = expr.split(/\s+AND\s+/i).map((p) => p.trim()).filter(Boolean)
  if (!parts.length) return true
  return parts.every((p) => {
    const notMatch = p.match(/^NOT\s+(.+)$/i)
    return notMatch ? !evalWhereCondition(notMatch[1], row) : evalWhereCondition(p, row)
  })
}

const TIMEWRAP_UNIT_WORDS: Record<string, string> = { s: "second", m: "minute", h: "hour", d: "day", w: "week" }

export function applyStage(type: StageType, config: any, rows: Row[]): ApplyResult {
  switch (type) {
    case "fields": {
      const keep: string[] = config.fields
      const mode: "keep" | "exclude" = config.mode
      return {
        rows: rows.map((r) => {
          const out: Row = {}
          for (const [k, v] of Object.entries(r)) {
            const included = keep.includes(k)
            if (mode === "keep" ? included : !included) out[k] = v
          }
          return out
        }),
      }
    }
    case "table":
      return { rows: rows.map((r) => { const out: Row = {}; for (const f of config.fields) out[f] = r[f]; return out }) }
    case "dedup": {
      const seen = new Set<string>()
      const out: Row[] = []
      for (const r of rows) {
        const key = config.fields.map((f: string) => r[f]).join("||")
        if (!seen.has(key)) {
          seen.add(key)
          out.push(r)
        }
      }
      return { rows: out }
    }
    case "rename":
      return {
        rows: rows.map((r) => {
          const out: Row = {}
          for (const [k, v] of Object.entries(r)) {
            const m = config.mappings.find((m: any) => m.from === k)
            out[m ? m.to : k] = v
          }
          return out
        }),
      }
    case "sort": {
      const keys = config.keys as { field: string; dir: "asc" | "desc" }[]
      const out = [...rows].sort((a, b) => {
        for (const k of keys) {
          const av = a[k.field]
          const bv = b[k.field]
          let cmp: number
          if (typeof av === "number" && typeof bv === "number") cmp = av - bv
          else cmp = String(av).localeCompare(String(bv))
          if (k.dir === "desc") cmp = -cmp
          if (cmp !== 0) return cmp
        }
        return 0
      })
      return { rows: out }
    }
    case "fieldformat":
      return {
        rows,
        formatter: {
          field: config.field,
          fn: (v: CellValue) => (typeof v === "number" ? v.toLocaleString("en-US") : String(v)),
        },
      }
    case "head":
      return { rows: rows.slice(0, Math.max(0, Number(config.n) || 0)) }
    case "reverse":
      return { rows: [...rows].reverse() }
    case "search": {
      const filters: Filter[] = config.filters
      return {
        rows: rows.filter((r) =>
          filters.every((f) => {
            // `field=*` is Splunk's wildcard-presence check: "this field exists
            // and is non-empty", not a literal match against the string "*".
            if (f.value === "*") {
              const present = r[f.field] !== undefined && r[f.field] !== ""
              return f.op === "=" ? present : !present
            }
            const matches = String(r[f.field]) === f.value
            return f.op === "=" ? matches : !matches
          }),
        ),
      }
    }
    case "where":
      return { rows: rows.filter((r) => evalWhereExpr(config.expr, r)) }
    case "rex": {
      const field: string = config.field
      const pattern: string = config.pattern
      if (!pattern) return { rows, warning: "Enter a regex pattern with at least one named group, like passwd=(?<pw>[^&]+)." }
      if (!/\(\?<\w+>/.test(pattern)) {
        return { rows, warning: "This pattern has no named capture group (?<name>...), so rex has nothing to extract into a field." }
      }
      let re: RegExp
      try {
        re = new RegExp(pattern)
      } catch {
        return { rows, warning: "That regex pattern is invalid." }
      }
      return {
        rows: rows.map((r) => {
          const m = re.exec(String(r[field] ?? ""))
          return m?.groups ? { ...r, ...m.groups } : r
        }),
      }
    }
    case "regex": {
      const field: string = config.field
      const pattern: string = config.pattern
      if (!pattern) return { rows }
      let re: RegExp
      try {
        re = new RegExp(pattern)
      } catch {
        return { rows, warning: "That regex pattern is invalid." }
      }
      const matches = (v: CellValue) => re.test(String(v ?? ""))
      return { rows: rows.filter((r) => (config.negate ? !matches(r[field]) : matches(r[field]))) }
    }
    case "lookup": {
      const table = LOOKUP_TABLES[config.table]
      if (!table) return { rows, warning: `Unknown lookup table "${config.table}".` }
      const matchField: string = config.matchField
      const lookupKey: string = config.lookupKey
      const outputs: string[] = config.outputs
      return {
        rows: rows.map((r) => {
          const hit = table.rows.find((lr) => String(lr[lookupKey]) === String(r[matchField]))
          if (!hit) return r
          const out = { ...r }
          // OUTPUTNEW only fills a field that doesn't already exist on the event.
          for (const col of outputs) if (!(col in out)) out[col] = hit[col]
          return out
        }),
      }
    }
    case "stats": {
      const fns: StatFnEntry[] = config.fns
      const by: string[] = config.by
      const groups = new Map<string, Row[]>()
      for (const r of rows) {
        const key = by.length ? by.map((f) => r[f]).join("||") : "__all__"
        if (!groups.has(key)) groups.set(key, [])
        groups.get(key)!.push(r)
      }
      const out: Row[] = []
      for (const groupRows of groups.values()) {
        const resultRow: Row = {}
        for (const f of by) resultRow[f] = groupRows[0][f]
        for (const fn of fns) resultRow[fn.alias] = computeAgg(fn.fn, fn.field, groupRows)
        out.push(resultRow)
      }
      return { rows: out }
    }
    case "addtotals": {
      const labelField = Object.keys(rows[0] ?? {}).find((f) => !isNumericField(rows, f))
      const numeric = numericFieldsOf(rows, labelField ? [labelField] : [])
      let out = rows.map((r) => {
        if (!config.row) return r
        const total = numeric.reduce((s, f) => s + (Number(r[f]) || 0), 0)
        return { ...r, [config.fieldname]: total }
      })
      if (config.col) {
        const totalRow: Row = labelField ? { [labelField]: "Total" } : {}
        for (const f of numeric) totalRow[f] = out.reduce((s, r) => s + (Number(r[f]) || 0), 0)
        if (config.row) totalRow[config.fieldname] = numeric.reduce((s, f) => s + (Number(totalRow[f]) || 0), 0)
        out = [...out, totalRow]
      }
      return { rows: out }
    }
    case "streamstats": {
      const fns: StatFnEntry[] = config.fns
      const by: string[] = config.by
      // Running accumulation, in current row order: each row's value is the
      // aggregate over itself and every row that came before it in the same
      // by-group, not the whole group at once (that's eventstats).
      const seenSoFar = new Map<string, Row[]>()
      return {
        rows: rows.map((r) => {
          const key = by.length ? by.map((f) => r[f]).join("||") : "__all__"
          const soFar = seenSoFar.get(key) ?? []
          soFar.push(r)
          seenSoFar.set(key, soFar)
          const out = { ...r }
          for (const fn of fns) out[fn.alias] = computeAgg(fn.fn, fn.field, soFar)
          return out
        }),
      }
    }
    case "eventstats": {
      const fns: StatFnEntry[] = config.fns
      const by: string[] = config.by
      const groups = new Map<string, Row[]>()
      for (const r of rows) {
        const key = by.length ? by.map((f) => r[f]).join("||") : "__all__"
        if (!groups.has(key)) groups.set(key, [])
        groups.get(key)!.push(r)
      }
      return {
        rows: rows.map((r) => {
          const key = by.length ? by.map((f) => r[f]).join("||") : "__all__"
          const groupRows = groups.get(key)!
          const out = { ...r }
          for (const fn of fns) out[fn.alias] = computeAgg(fn.fn, fn.field, groupRows)
          return out
        }),
      }
    }
    case "transaction": {
      const field: string = config.field
      const groups = new Map<CellValue, Row[]>()
      for (const r of rows) {
        const key = r[field]
        if (!groups.has(key)) groups.set(key, [])
        groups.get(key)!.push(r)
      }
      const out: Row[] = []
      for (const [key, groupRows] of groups) {
        const hasTime = groupRows.length > 0 && "_time" in groupRows[0]
        const row: Row = { [field]: key, eventcount: groupRows.length }
        if (hasTime) {
          const times = groupRows.map((r) => Number(r._time))
          row.duration = round2(Math.max(...times) - Math.min(...times))
        }
        out.push(row)
      }
      return { rows: out }
    }
    case "trendline": {
      const field: string = config.field
      const window: number = config.window
      const alias: string = config.alias
      return {
        rows: rows.map((r, i) => {
          if (i < window - 1) return { ...r, [alias]: "" }
          const slice = rows.slice(i - window + 1, i + 1)
          const nums = slice.map((x) => Number(x[field])).filter((n) => !Number.isNaN(n))
          const avg = nums.length ? round2(nums.reduce((a, b) => a + b, 0) / nums.length) : ""
          return { ...r, [alias]: avg }
        }),
      }
    }
    case "timewrap": {
      if (rows.length && !("_time" in rows[0])) {
        return {
          rows,
          warning:
            "timewrap needs the original _time field, typically right after timechart. Put it directly after timechart, before any stats, top, rare, chart, addtotals, or geostats command.",
        }
      }
      if (!rows.length) return { rows }
      const periodSeconds = spanToSeconds(config.period)
      const unitLetter = config.period.match(/[smhdw]$/i)?.[0]?.toLowerCase() ?? "h"
      const unitWord = TIMEWRAP_UNIT_WORDS[unitLetter] ?? "period"
      const periodStart = (t: number) => Math.floor(t / periodSeconds) * periodSeconds
      const latestPeriodStart = Math.max(...rows.map((r) => periodStart(Number(r._time))))
      const valueFields = Object.keys(rows[0]).filter((f) => f !== "_time")
      const merged = new Map<number, Row>()
      for (const r of rows) {
        const t = Number(r._time)
        const thisPeriodStart = periodStart(t)
        const periodsAgo = Math.round((latestPeriodStart - thisPeriodStart) / periodSeconds)
        const alignedTime = latestPeriodStart + (t - thisPeriodStart)
        const existing = merged.get(alignedTime) ?? { _time: alignedTime }
        for (const f of valueFields) {
          const outKey = periodsAgo === 0 ? f : `${periodsAgo}${unitWord}_before_${f}`
          existing[outKey] = r[f]
        }
        merged.set(alignedTime, existing)
      }
      const out = Array.from(merged.values()).sort((a, b) => Number(a._time) - Number(b._time))
      return { rows: out }
    }
    case "top":
    case "rare": {
      const field: string = config.field
      const limit: number = config.limit
      const by: string = config.by
      const order = type === "top" ? "desc" : "asc"
      // "count" and "percent" are the stat columns top/rare always adds. If the
      // field being topped (or grouped by) happens to already be named that,
      // e.g. a "count" field produced by an earlier stats command, a plain
      // row.count = ... write would silently clobber the field's own value.
      const countKey = field === "count" || by === "count" ? "occurrence_count" : "count"
      const percentKey = field === "percent" || by === "percent" ? "occurrence_percent" : "percent"
      const buildRows = (groupRows: Row[], byVal?: CellValue) => {
        const counts = new Map<CellValue, number>()
        for (const r of groupRows) counts.set(r[field], (counts.get(r[field]) ?? 0) + 1)
        const total = groupRows.length
        let arr = Array.from(counts.entries()).map(([v, c]) => ({ v, c, pct: round2((c / total) * 100) }))
        arr.sort((a, b) => (order === "desc" ? b.c - a.c : a.c - b.c))
        arr = arr.slice(0, limit)
        return arr.map((a) => {
          const row: Row = {}
          if (byVal !== undefined) row[by] = byVal
          row[field] = a.v
          row[countKey] = a.c
          row[percentKey] = a.pct
          return row
        })
      }
      if (!by) return { rows: buildRows(rows) }
      const groups = new Map<CellValue, Row[]>()
      for (const r of rows) {
        const key = r[by]
        if (!groups.has(key)) groups.set(key, [])
        groups.get(key)!.push(r)
      }
      const out: Row[] = []
      for (const [byVal, groupRows] of groups) out.push(...buildRows(groupRows, byVal))
      return { rows: out }
    }
    case "chart": {
      const over: string = config.over
      const by: string = config.by
      const overVals = distinctValues(rows, over)
      const out: Row[] = []
      if (!by) {
        for (const ov of overVals) {
          const subset = rows.filter((r) => r[over] === ov)
          out.push({ [over]: ov, [aggAlias(config)]: computeAgg(config.fn, config.field, subset) })
        }
        return { rows: out }
      }
      const byVals = distinctValues(rows, by)
      for (const ov of overVals) {
        const resultRow: Row = { [over]: ov }
        for (const bv of byVals) {
          const subset = rows.filter((r) => r[over] === ov && r[by] === bv)
          resultRow[String(bv)] = computeAgg(config.fn, config.field, subset)
        }
        out.push(resultRow)
      }
      return { rows: out }
    }
    case "timechart": {
      if (rows.length && !("_time" in rows[0])) {
        return {
          rows,
          warning:
            "timechart needs the original _time field. Transforming commands earlier in the pipeline (top, rare, stats, chart, addtotals, geostats) don't carry it forward, so timechart has nothing to bin on. Put it directly after the search or filters, before those commands.",
        }
      }
      const spanSeconds = spanToSeconds(config.span)
      const binned: Row[] = rows.map((r) => ({ ...r, _time: binTime(Number(r._time), spanSeconds) }))
      const by: string = config.by
      const times = Array.from(new Set(binned.map((r) => Number(r._time)))).sort((a, b) => a - b)
      const out: Row[] = []
      if (!by) {
        for (const t of times) {
          const subset = binned.filter((r) => Number(r._time) === t)
          out.push({ _time: t, [aggAlias(config)]: computeAgg(config.fn, config.field, subset) })
        }
        return { rows: out }
      }
      const byVals = distinctValues(binned, by)
      for (const t of times) {
        const resultRow: Row = { _time: t }
        for (const bv of byVals) {
          const subset = binned.filter((r) => Number(r._time) === t && r[by] === bv)
          resultRow[String(bv)] = computeAgg(config.fn, config.field, subset)
        }
        out.push(resultRow)
      }
      return { rows: out }
    }
    case "bin": {
      const field: string = config.field
      if (field === "_time") {
        if (rows.length && !("_time" in rows[0])) {
          return {
            rows,
            warning:
              "bin span=... _time needs the original _time field, which earlier transforming commands (top, rare, stats, chart, addtotals, geostats) don't carry forward.",
          }
        }
        const spanSeconds = spanToSeconds(config.span)
        return { rows: rows.map((r) => ({ ...r, _time: binTime(Number(r._time), spanSeconds) })) }
      }
      const span = Number(config.span) || 1
      return { rows: rows.map((r) => ({ ...r, [field]: Math.floor(Number(r[field]) / span) * span })) }
    }
    case "eval": {
      const defs: EvalDef[] = config.defs
      return {
        rows: rows.map((r) => {
          const out = { ...r }
          for (const d of defs) out[d.newField] = evalCompute(d, out)
          return out
        }),
      }
    }
    case "iplocation": {
      const field: string = config.field
      if (!field) return { rows, warning: "Pick an IP field to resolve." }
      return {
        rows: rows.map((r) => {
          const geo = IP_GEO[String(r[field])]
          return geo
            ? { ...r, Country: geo.country, City: geo.city, lat: geo.lat, lon: geo.lon }
            : { ...r, Country: "Unknown", City: "Unknown", lat: "", lon: "" }
        }),
      }
    }
    case "geostats": {
      if (!("lat" in (rows[0] ?? {})) || !("lon" in (rows[0] ?? {}))) {
        return { rows, warning: "geostats needs lat/lon fields. Add an iplocation stage earlier in the pipeline first." }
      }
      const by: string = config.by
      const keyOf = (r: Row) => `${r.lat}|${r.lon}${by ? `|${r[by]}` : ""}`
      const groups = new Map<string, Row[]>()
      for (const r of rows) {
        const k = keyOf(r)
        if (!groups.has(k)) groups.set(k, [])
        groups.get(k)!.push(r)
      }
      const out: Row[] = []
      for (const groupRows of groups.values()) {
        const row: Row = { lat: groupRows[0].lat, lon: groupRows[0].lon }
        if (by) row[by] = groupRows[0][by]
        row[aggAlias(config)] = computeAgg(config.fn, config.field, groupRows)
        out.push(row)
      }
      return { rows: out }
    }
    case "geom": {
      const field: string = config.featureIdField
      return {
        rows: rows.map((r) => {
          const v = r[field]
          if (v === undefined || v === "" || v === "Unknown") return { ...r, geom: "" }
          return { ...r, geom: `[GeoJSON boundary for ${v}, ~90,000 characters -- never put this in a table]` }
        }),
      }
    }
    case "gauge": {
      if (rows.length !== 1) {
        return {
          rows,
          warning: "gauge needs exactly one summary row. Add a stats command (without by) earlier in the pipeline.",
        }
      }
      return { rows }
    }
    default:
      return { rows }
  }
}

function aggAlias(config: { fn: AggFn; field?: string }): string {
  if (config.fn === "count") return "count"
  if (config.fn === "count_field") return `count(${config.field})`
  return `${config.fn}(${config.field})`
}

// ---------------------------------------------------------------------------
// Running the full pipeline
// ---------------------------------------------------------------------------

function baseRowsFor(dataset: Dataset, timeRange: TimeRange, filters: Filter[]): Row[] {
  const timeFiltered = dataset.rows.filter((r) => {
    const t = Number(r._time)
    if (timeRange.earliest !== null && t < timeRange.earliest) return false
    if (timeRange.latest !== null && t >= timeRange.latest) return false
    return true
  })
  return applyFilters(timeFiltered, filters)
}

export function runPipeline(
  dataset: Dataset,
  timeRange: TimeRange,
  filters: Filter[],
  stages: PipelineStage[],
): StepResult[] {
  const baseRows = baseRowsFor(dataset, timeRange, filters)
  const steps: StepResult[] = [
    {
      label: "search",
      spl: `index=${dataset.index} sourcetype=${dataset.sourcetype}${timeRange.clause ? " " + timeRange.clause : ""}${filters.length ? " " + filtersToSpl(filters) : ""}`,
      rows: baseRows,
      fields: dataset.fields,
      isTransforming: false,
      formatters: {},
    },
  ]

  let currentRows = baseRows
  let formatters: Record<string, (v: CellValue) => string> = {}
  let transformed = false
  for (const stage of stages) {
    const result = applyStage(stage.type, stage.config, currentRows)
    currentRows = result.rows
    const fields = currentRows.length ? Object.keys(currentRows[0]) : steps[steps.length - 1].fields
    if (result.formatter) formatters = { ...formatters, [result.formatter.field]: result.formatter.fn }
    // Once a transforming command has run, the pipeline can never go back to raw
    // events, so every later stage stays "transforming" even if it doesn't itself
    // aggregate (e.g. a sort or eval after a stats).
    transformed = transformed || TRANSFORMING.has(stage.type)
    steps.push({
      label: stage.type,
      spl: stageToSpl(stage.type, stage.config),
      rows: currentRows,
      fields,
      warning: result.warning,
      isTransforming: transformed,
      formatters,
    })
  }
  return steps
}

// ---------------------------------------------------------------------------
// Repairing stale field references
// ---------------------------------------------------------------------------
//
// A stage's config is only ever validated against the fields available when
// the user picks them. If an earlier stage is removed, reordered, or edited
// in a way that changes its output fields, a later stage can end up pointing
// at a field that no longer exists, for example "top" still set to a "count"
// field that only existed while a since-removed "stats" stage produced it.
// Left alone, that silently degrades to Number(undefined) => NaN cascading
// through the rest of the pipeline. repairStages re-derives the pipeline
// stage by stage and resets just the stages whose referenced fields have
// gone stale, so the UI and the computed output never drift apart.

function referencedFields(type: StageType, config: any): string[] {
  switch (type) {
    case "fields":
    case "table":
    case "dedup":
      return config.fields ?? []
    case "rename":
      return (config.mappings ?? []).map((m: any) => m.from)
    case "sort":
      return (config.keys ?? []).map((k: any) => k.field)
    case "fieldformat":
    case "iplocation":
    case "gauge":
    case "bin":
    case "rex":
    case "regex":
    case "transaction":
    case "trendline":
    case "geom":
      return [config.field ?? config.featureIdField]
    case "lookup":
      return [config.matchField]
    case "search":
      return (config.filters ?? []).map((f: Filter) => f.field)
    case "stats":
    case "streamstats":
    case "eventstats":
      return [...(config.fns ?? []).map((f: StatFnEntry) => f.field).filter((f: unknown): f is string => Boolean(f)), ...(config.by ?? [])]
    case "top":
    case "rare":
      return [config.field, config.by]
    case "chart":
    case "geostats":
      return [config.field, config.over, config.by]
    case "timechart":
      return [config.field, config.by]
    case "eval":
      // arith and concat operands can be numeric/text literals typed directly
      // (e.g. `count * 2`), not only fields picked from a dropdown -- a
      // literal must never be treated as a stale field reference.
      return (config.defs ?? []).flatMap((d: EvalDef) => {
        if (d.kind === "arith") return [d.a, d.b].filter((x) => Number.isNaN(Number(x)))
        if (d.kind === "round" || d.kind === "commas" || d.kind === "case2") return [d.field]
        if (d.kind === "concat") return [d.a, d.b]
        return []
      })
    default:
      return []
  }
}

function defaultConfigForRepair(type: StageType, fields: string[], rows: Row[], dataset: Dataset): any {
  const config = defaultConfig(type, fields, rows)
  if (type === "iplocation") config.field = dataset.ipField ?? ""
  return config
}

export function repairStages(dataset: Dataset, timeRange: TimeRange, filters: Filter[], stages: PipelineStage[]): PipelineStage[] {
  let rows = baseRowsFor(dataset, timeRange, filters)
  let fields = dataset.fields
  const repaired: PipelineStage[] = []
  for (const stage of stages) {
    const refs = referencedFields(stage.type, stage.config).filter((f): f is string => Boolean(f))
    const stale = refs.some((f) => !fields.includes(f))
    const config = stale ? defaultConfigForRepair(stage.type, fields, rows, dataset) : stage.config
    const result = applyStage(stage.type, config, rows)
    rows = result.rows
    fields = rows.length ? Object.keys(rows[0]) : fields
    repaired.push({ ...stage, config })
  }
  return repaired
}

// ---------------------------------------------------------------------------
// Freeform SPL parsing
// ---------------------------------------------------------------------------
//
// Lets a user type (or paste) a real SPL-shaped query instead of only using
// the guided per-command editors above. It is a best-effort, teaching-focused
// parser, not a full SPL grammar: it understands the base search's field=value
// terms and the syntax of every command in STAGE_TYPES, in the common forms
// shown throughout the SPL tutorial on this site. Anything it cannot map onto
// the simulator's small set of sample fields and stage shapes is reported in
// `issues` and skipped, rather than silently misinterpreted or crashing.

export interface ParsedQuery {
  filters: Filter[]
  stages: PipelineStage[]
  issues: string[]
}

// Splits on `delim` at the top level only: a run of characters inside double
// quotes, or inside parentheses outside of quotes, is never split, so
// `stats dc(src_ip) as n, count by field` and `rename a AS "b, c"` both split
// where a human would expect.
function splitTopLevel(text: string, delim: string): string[] {
  const parts: string[] = []
  let depth = 0
  let inQuote = false
  let current = ""
  for (const c of text) {
    if (c === '"') inQuote = !inQuote
    if (!inQuote) {
      if (c === "(") depth++
      if (c === ")") depth = Math.max(0, depth - 1)
    }
    if (c === delim && depth === 0 && !inQuote) {
      parts.push(current)
      current = ""
    } else {
      current += c
    }
  }
  parts.push(current)
  return parts
}

// Splits the base search into its space-separated terms, keeping a quoted
// value (e.g. `sourcetype="stream:http"`) as one token.
function tokenizeTerms(text: string): string[] {
  const terms: string[] = []
  let current = ""
  let inQuote = false
  let depth = 0
  for (const c of text) {
    if (c === '"') inQuote = !inQuote
    if (!inQuote) {
      if (c === "(") depth++
      if (c === ")") depth = Math.max(0, depth - 1)
    }
    // Inside quotes or parens, a space never splits terms: a grouped clause
    // like "(http_method=GET OR http_method=POST)" must stay one token, or
    // it gets shredded into "(http_method=GET", "OR", "http_method=POST)" --
    // each of which then looks like a malformed field=value term on its own.
    if (c === " " && !inQuote && depth === 0) {
      if (current) terms.push(current)
      current = ""
    } else {
      current += c
    }
  }
  if (current) terms.push(current)
  return terms
}

function parseFieldList(s: string): string[] {
  return s.split(/[\s,]+/).map((x) => x.trim()).filter(Boolean)
}

const AGG_FN_NAMES: Record<string, AggFn> = {
  count: "count",
  dc: "dc",
  sum: "sum",
  avg: "avg",
  min: "min",
  max: "max",
  values: "values",
  list: "list",
}

function parseAggExpr(s: string): { fn: AggFn; field?: string } | null {
  const m = s.trim().match(/^([a-zA-Z_]+)(?:\(([^)]*)\))?$/)
  if (!m) return null
  let fn = AGG_FN_NAMES[m[1].toLowerCase()]
  if (!fn) return null
  const field = m[2]?.trim() || undefined
  if (fn === "count" && field) fn = "count_field"
  return { fn, field }
}

function parseStatsFnTerms(fnsPart: string): StatFnEntry[] | null {
  const fns: StatFnEntry[] = []
  const fnTerms = splitTopLevel(fnsPart, ",").map((s) => s.trim()).filter(Boolean)
  if (!fnTerms.length) return null
  for (const term of fnTerms) {
    const m = term.match(/^([a-zA-Z_]+)(?:\(([^)]*)\))?\s*(?:as\s+(.+))?$/i)
    if (!m) return null
    const [, fnRaw, fieldRaw, aliasRaw] = m
    let fn = AGG_FN_NAMES[fnRaw.toLowerCase()]
    if (!fn) return null
    const field = fieldRaw?.trim() || undefined
    if (fn === "count" && field) fn = "count_field"
    const alias = aliasRaw?.trim().replace(/^"(.*)"$/, "$1") || aggToSpl(fn, field)
    fns.push({ id: nextId("fn"), fn, field, alias })
  }
  return fns
}

function parseStatsCommand(args: string): { fns: StatFnEntry[]; by: string[] } | null {
  const byMatch = args.match(/\bby\b([\s\S]*)$/i)
  const fnsPart = byMatch ? args.slice(0, byMatch.index) : args
  const by = byMatch ? parseFieldList(byMatch[1]) : []
  const fns = parseStatsFnTerms(fnsPart)
  return fns ? { fns, by } : null
}

// `tstats <fns> WHERE <constraints> BY <fields>`: functionally close enough to
// `stats` for teaching purposes that it's mapped straight onto the same
// "stats" stage. The WHERE constraints (almost always index=/sourcetype=,
// already fixed by the dataset picker above) aren't re-applied. BY fields
// that name dataset metadata (sourcetype, index, host, source) rather than a
// real per-event field are dropped with an explanation, since this simulator
// loads one dataset at a time instead of a real multi-sourcetype index.
const TSTATS_META_FIELDS = new Set(["sourcetype", "index", "host", "source"])

function parseTstats(args: string): { fns: StatFnEntry[]; by: string[]; issues: string[] } | null {
  const byMatch = args.match(/\bby\b([\s\S]*)$/i)
  const head = byMatch ? args.slice(0, byMatch.index) : args
  const whereMatch = head.match(/\bwhere\b([\s\S]*)$/i)
  const fnsPart = whereMatch ? head.slice(0, whereMatch.index) : head
  const fns = parseStatsFnTerms(fnsPart)
  if (!fns) return null
  const rawBy = byMatch ? parseFieldList(byMatch[1]) : []
  const issues: string[] = []
  const by = rawBy.filter((f) => {
    if (TSTATS_META_FIELDS.has(f.toLowerCase())) {
      issues.push(
        `"${f}" is dataset metadata here, not a per-event field (this simulator loads one dataset at a time, picked above, instead of a real multi-sourcetype index). It was dropped from "BY"; group by a real field instead.`,
      )
      return false
    }
    return true
  })
  return { fns, by, issues }
}

function parseTopRare(args: string): { field: string; limit: number; by: string } | null {
  let rest = args
  let by = ""
  let limit = 10
  const byMatch = rest.match(/\bby\s+(\S+)/i)
  if (byMatch) {
    by = byMatch[1]
    rest = rest.replace(byMatch[0], "")
  }
  const limitMatch = rest.match(/\blimit\s*=\s*(\d+)/i)
  if (limitMatch) {
    limit = Number(limitMatch[1])
    rest = rest.replace(limitMatch[0], "")
  }
  const remaining = rest.trim().split(/\s+/).filter(Boolean)
  if (remaining.length !== 1) return null
  return { field: remaining[0], limit, by }
}

function parseChart(args: string): { fn: AggFn; field?: string; over: string; by: string } | null {
  const overMatch = args.match(/\bover\s+(\S+)/i)
  if (!overMatch) return null
  const byMatch = args.match(/\bby\s+(\S+)/i)
  const agg = parseAggExpr(args.slice(0, overMatch.index))
  if (!agg) return null
  return { ...agg, over: overMatch[1], by: byMatch ? byMatch[1] : "" }
}

function parseTimechart(args: string): { fn: AggFn; field?: string; span: string; by: string } | null {
  const spanMatch = args.match(/\bspan\s*=\s*(\S+)/i)
  const span = spanMatch ? spanMatch[1] : "1h"
  let rest = spanMatch ? args.replace(spanMatch[0], "") : args
  const byMatch = rest.match(/\bby\s+(\S+)/i)
  const by = byMatch ? byMatch[1] : ""
  if (byMatch) rest = rest.replace(byMatch[0], "")
  rest = rest.replace(/\blimit\s*=\s*\d+/i, "")
  const agg = parseAggExpr(rest.trim())
  if (!agg) return null
  return { ...agg, span, by }
}

function parseBin(args: string): { field: string; span: string } | null {
  const spanMatch = args.match(/\bspan\s*=\s*(\S+)/i)
  if (!spanMatch) return null
  const field = args.replace(spanMatch[0], "").trim().split(/\s+/).filter(Boolean)[0]
  if (!field) return null
  return { field, span: spanMatch[1] }
}

function parseRename(args: string): { mappings: { id: string; from: string; to: string }[] } | null {
  const parts = splitTopLevel(args, ",")
  const mappings: { id: string; from: string; to: string }[] = []
  for (const p of parts) {
    const m = p.trim().match(/^(\S+)\s+as\s+"?([^"]+?)"?$/i)
    if (!m) return null
    mappings.push({ id: nextId("rn"), from: m[1], to: m[2].trim() })
  }
  return mappings.length ? { mappings } : null
}

function parseSort(args: string): { keys: { id: string; field: string; dir: "asc" | "desc" }[] } | null {
  const cleaned = args.replace(/([+-])\s+/g, "$1").trim()
  const tokens = cleaned.split(/\s+/).filter((t) => t && t !== "0")
  const keys: { id: string; field: string; dir: "asc" | "desc" }[] = []
  for (const t of tokens) {
    const m = t.match(/^([+-])?(.+)$/)
    if (!m) return null
    keys.push({ id: nextId("sk"), field: m[2], dir: m[1] === "+" ? "asc" : "desc" })
  }
  return keys.length ? { keys } : null
}

function parseFieldformat(args: string): { field: string } | null {
  const m = args.match(/^(\S+?)\s*=/)
  return m ? { field: m[1] } : null
}

function parseAddtotals(args: string): { row: boolean; col: boolean; fieldname: string } {
  const rowMatch = args.match(/\brow\s*=\s*(true|false)/i)
  const colMatch = args.match(/\bcol\s*=\s*(true|false)/i)
  const fnMatch = args.match(/\bfieldname\s*=\s*"([^"]+)"/i)
  return {
    row: rowMatch ? rowMatch[1].toLowerCase() === "true" : true,
    col: colMatch ? colMatch[1].toLowerCase() === "true" : false,
    fieldname: fnMatch ? fnMatch[1] : "Total",
  }
}

function parseIplocation(args: string): { field: string } {
  return { field: args.trim().split(/\s+/)[0] ?? "" }
}

function parseGeostats(args: string): { fn: AggFn; field?: string; by: string } | null {
  let rest = args.replace(/\blatfield\s*=\s*\S+/i, "").replace(/\blongfield\s*=\s*\S+/i, "")
  const byMatch = rest.match(/\bby\s+(\S+)/i)
  const by = byMatch ? byMatch[1] : ""
  if (byMatch) rest = rest.replace(byMatch[0], "")
  const agg = parseAggExpr(rest.trim())
  if (!agg) return null
  return { ...agg, by }
}

function parseGauge(args: string): { field: string; t0: number; t1: number; t2: number; t3: number } | null {
  const tokens = args.trim().split(/\s+/).filter(Boolean)
  if (tokens.length < 5) return null
  const [field, a, b, c, d] = tokens
  const nums = [a, b, c, d].map(Number)
  if (nums.some((n) => Number.isNaN(n))) return null
  return { field, t0: nums[0], t1: nums[1], t2: nums[2], t3: nums[3] }
}

// Recognizes the handful of `eval` expression shapes the tutorial and the
// guided editor both use. Anything else is reported back as unparsed rather
// than guessed at.
function parseEvalExpr(newField: string, expr: string): EvalDef | null {
  const e = expr.trim()
  let m: RegExpMatchArray | null
  if ((m = e.match(/^round\(\s*([\w.]+)\s*,\s*(\d+)\s*\)$/i))) {
    return { id: nextId("ev"), kind: "round", newField, field: m[1], decimals: Number(m[2]) }
  }
  if ((m = e.match(/^tostring\(\s*([\w.]+)\s*,\s*"commas"\s*\)$/i))) {
    return { id: nextId("ev"), kind: "commas", newField, field: m[1] }
  }
  if ((m = e.match(/^strftime\(\s*_time\s*,\s*"([^"]+)"\s*\)$/i))) {
    const allowed = ["%H:%M", "%H:%M:%S", "%b %d, %I:%M %p"] as const
    const fmt = (allowed as readonly string[]).includes(m[1]) ? (m[1] as (typeof allowed)[number]) : "%H:%M"
    return { id: nextId("ev"), kind: "strftime", newField, format: fmt }
  }
  if ((m = e.match(/^([\w.]+)\s*\.\s*"([^"]*)"\s*\.\s*([\w.]+)$/))) {
    return { id: nextId("ev"), kind: "concat", newField, a: m[1], sep: m[2], b: m[3] }
  }
  if (
    (m = e.match(/^case\(\s*([\w.]+)\s*(=|!=|>|<)\s*"?([^",)]+?)"?\s*,\s*"([^"]*)"\s*,\s*1=1\s*,\s*"([^"]*)"\s*\)$/i))
  ) {
    return { id: nextId("ev"), kind: "case2", newField, field: m[1], op: m[2] as "=" | "!=" | ">" | "<", value: m[3], thenLabel: m[4], elseLabel: m[5] }
  }
  if ((m = e.match(/^([\w.]+)\s*([+\-*/])\s*([\w.]+)$/))) {
    return { id: nextId("ev"), kind: "arith", newField, a: m[1], op: m[2] as "+" | "-" | "*" | "/", b: m[3] }
  }
  return null
}

function parseEval(args: string): { defs: EvalDef[]; unparsed: string[] } {
  const defs: EvalDef[] = []
  const unparsed: string[] = []
  for (const part of splitTopLevel(args, ",")) {
    const eq = part.indexOf("=")
    if (eq === -1) {
      if (part.trim()) unparsed.push(part.trim())
      continue
    }
    const newField = part.slice(0, eq).trim()
    const def = newField ? parseEvalExpr(newField, part.slice(eq + 1)) : null
    if (def) defs.push(def)
    else unparsed.push(part.trim())
  }
  return { defs, unparsed }
}

function parseHead(args: string): { n: number } | null {
  const m = args.trim().match(/^(?:limit\s*=\s*)?(\d+)$/i)
  return m ? { n: Number(m[1]) } : null
}

function parseSearchFilters(args: string): { filters: Filter[]; issues: string[] } {
  const filters: Filter[] = []
  const issues: string[] = []
  for (const term of tokenizeTerms(args)) {
    if (!term) continue
    const m = term.match(/^(NOT\s+)?([A-Za-z_][\w.]*)\s*(!=|=)\s*(.+)$/i)
    if (!m) {
      issues.push(`Couldn't parse "${term}" in "| search" -- only ANDed field=value terms (including field=* for "has a value") are supported.`)
      continue
    }
    const [, notPrefix, field, opRaw, rawValue] = m
    const value = rawValue.replace(/^"(.*)"$/, "$1")
    let op: "=" | "!=" = opRaw === "!=" ? "!=" : "="
    if (notPrefix) op = op === "=" ? "!=" : "="
    filters.push({ field, op, value })
  }
  return { filters, issues }
}

function parseWhere(args: string): { expr: string } | null {
  const expr = args.trim()
  return expr ? { expr } : null
}

function parseRex(args: string): { field: string; pattern: string } | null {
  const m = args.match(/^field\s*=\s*(\S+)\s+"((?:[^"\\]|\\.)*)"$/i)
  return m ? { field: m[1], pattern: m[2] } : null
}

function parseRegexCmd(args: string): { field: string; pattern: string; negate: boolean } | null {
  const m = args.match(/^(\S+?)\s*(!=|=)\s*"((?:[^"\\]|\\.)*)"$/)
  return m ? { field: m[1], pattern: m[3], negate: m[2] === "!=" } : null
}

function parseLookup(args: string): { table: string; lookupKey: string; matchField: string; outputs: string[] } | null {
  const m = args.match(/^(\S+)\s+(\S+)\s+as\s+(\S+)\s+OUTPUTNEW\s+([\s\S]+)$/i)
  if (!m) return null
  const [, table, lookupKey, matchField, outputsRaw] = m
  const outputs = parseFieldList(outputsRaw)
  return outputs.length ? { table, lookupKey, matchField, outputs } : null
}

function parseTrendline(args: string): { window: number; field: string; alias: string } | null {
  const m = args.match(/^sma(\d+)\(([\w.]+)\)\s*(?:as\s+(\S+))?$/i)
  if (!m) return null
  const window = Number(m[1])
  const field = m[2]
  return { window, field, alias: m[3] ?? `sma${window}_${field}` }
}

function parseTimewrap(args: string): { period: string } | null {
  const period = args.trim().split(/\s+/)[0]
  return period ? { period } : null
}

function parseGeom(args: string): { featureIdField: string } | null {
  const m = args.match(/\bfeatureIdField\s*=\s*(\S+)/i)
  return m ? { featureIdField: m[1] } : null
}

interface ParsedCommand {
  type: StageType
  config: any
  issues?: string[]
}

const COMMAND_PARSERS: Record<string, (args: string) => ParsedCommand | null> = {
  fields: (args) => {
    const exclude = /^-\s*/.test(args.trim())
    const fields = parseFieldList(args.replace(/^-\s*/, ""))
    return fields.length ? { type: "fields", config: { mode: exclude ? "exclude" : "keep", fields } } : null
  },
  table: (args) => {
    const fields = parseFieldList(args)
    return fields.length ? { type: "table", config: { fields } } : null
  },
  dedup: (args) => {
    const fields = parseFieldList(args)
    return fields.length ? { type: "dedup", config: { fields } } : null
  },
  rename: (args) => {
    const r = parseRename(args)
    return r ? { type: "rename", config: r } : null
  },
  sort: (args) => {
    const r = parseSort(args)
    return r ? { type: "sort", config: r } : null
  },
  fieldformat: (args) => {
    const r = parseFieldformat(args)
    return r ? { type: "fieldformat", config: r } : null
  },
  head: (args) => {
    const r = parseHead(args)
    return r ? { type: "head", config: r } : null
  },
  reverse: () => ({ type: "reverse", config: {} }),
  search: (args) => {
    const r = parseSearchFilters(args)
    return r.filters.length || r.issues.length ? { type: "search", config: { filters: r.filters }, issues: r.issues.length ? r.issues : undefined } : null
  },
  where: (args) => {
    const r = parseWhere(args)
    return r ? { type: "where", config: r } : null
  },
  rex: (args) => {
    const r = parseRex(args)
    return r ? { type: "rex", config: r } : null
  },
  regex: (args) => {
    const r = parseRegexCmd(args)
    return r ? { type: "regex", config: r } : null
  },
  lookup: (args) => {
    const r = parseLookup(args)
    if (!r) return null
    if (!LOOKUP_TABLES[r.table]) {
      return {
        type: "lookup",
        config: r,
        issues: [
          `"${r.table}" isn't one of the lookup tables this simulator ships with (available: ${Object.keys(LOOKUP_TABLES).join(", ")}). The lookup stage was added but won't match anything until you pick one of those.`,
        ],
      }
    }
    return { type: "lookup", config: r }
  },
  stats: (args) => {
    const r = parseStatsCommand(args)
    return r ? { type: "stats", config: r } : null
  },
  addtotals: (args) => ({ type: "addtotals", config: parseAddtotals(args) }),
  streamstats: (args) => {
    const r = parseStatsCommand(args)
    return r ? { type: "streamstats", config: r } : null
  },
  eventstats: (args) => {
    const r = parseStatsCommand(args)
    return r ? { type: "eventstats", config: r } : null
  },
  transaction: (args) => {
    const field = args.trim().split(/\s+/)[0]
    return field ? { type: "transaction", config: { field } } : null
  },
  tstats: (args) => {
    const r = parseTstats(args)
    return r ? { type: "stats", config: { fns: r.fns, by: r.by }, issues: r.issues.length ? r.issues : undefined } : null
  },
  top: (args) => {
    const r = parseTopRare(args)
    return r ? { type: "top", config: r } : null
  },
  rare: (args) => {
    const r = parseTopRare(args)
    return r ? { type: "rare", config: r } : null
  },
  chart: (args) => {
    const r = parseChart(args)
    return r ? { type: "chart", config: r } : null
  },
  timechart: (args) => {
    const r = parseTimechart(args)
    return r ? { type: "timechart", config: r } : null
  },
  trendline: (args) => {
    const r = parseTrendline(args)
    return r ? { type: "trendline", config: r } : null
  },
  timewrap: (args) => {
    const r = parseTimewrap(args)
    return r ? { type: "timewrap", config: r } : null
  },
  bin: (args) => {
    const r = parseBin(args)
    return r ? { type: "bin", config: r } : null
  },
  eval: (args) => {
    const r = parseEval(args)
    const issues = r.unparsed.length
      ? [
          `In "| eval", couldn't parse: ${r.unparsed.join(", ")}. Supported forms: arithmetic (a op b), round(f,n), case(f op "v","then",1=1,"else"), concatenation (a . "sep" . b), strftime(_time,"fmt"), tostring(f,"commas").`,
        ]
      : undefined
    return { type: "eval", config: { defs: r.defs }, issues }
  },
  iplocation: (args) => ({ type: "iplocation", config: parseIplocation(args) }),
  geostats: (args) => {
    const r = parseGeostats(args)
    return r ? { type: "geostats", config: r } : null
  },
  geom: (args) => {
    const r = parseGeom(args)
    return r ? { type: "geom", config: r } : null
  },
  gauge: (args) => {
    const r = parseGauge(args)
    return r ? { type: "gauge", config: r } : null
  },
}

/**
 * Parses a freeform SPL-shaped query into the filters and pipeline stages
 * this simulator can execute. Best-effort: anything it cannot map is listed
 * in `issues` and skipped rather than guessed at or crashed on.
 */
export function parseSplQuery(text: string, dataset: Dataset): ParsedQuery {
  const issues: string[] = []
  const filters: Filter[] = []
  const stages: PipelineStage[] = []
  const trimmed = text.trim()
  if (!trimmed) return { filters, stages, issues }

  const segments = splitTopLevel(trimmed, "|").map((s) => s.trim())
  // A leading `|` (e.g. starting straight with `| stats ...`) just means "no
  // base-search filters, pipe the whole dataset in" -- segments[0] is simply
  // empty in that case, which tokenizeTerms turns into zero filters below. A
  // genuinely unsupported generating command (tstats, inputlookup, ...) as
  // that first command is instead caught later, by the same "isn't a command
  // this simulator implements" check every other pipeline stage goes through.
  const commandSegments = segments.slice(1)
  const baseSearch = segments[0] ?? ""
  {
    for (const term of tokenizeTerms(baseSearch)) {
      if (!term) continue
      const m = term.match(/^(NOT\s+)?([A-Za-z_][\w.]*)\s*(!=|=)\s*(.+)$/i)
      if (!m) {
        if (/^\(|\)$/.test(term) || term.toUpperCase() === "OR") {
          issues.push(`Grouping and OR in the base search ("${term}") aren't supported here; only ANDed field=value terms are applied.`)
        } else {
          issues.push(`Keyword term "${term}" was ignored; this simulator only matches field=value, not free text.`)
        }
        continue
      }
      const [, notPrefix, field, opRaw, rawValue] = m
      const value = rawValue.replace(/^"(.*)"$/, "$1")
      const lower = field.toLowerCase()
      if (lower === "index" || lower === "sourcetype") continue
      if (lower === "earliest" || lower === "latest") {
        issues.push(`"${term}" was ignored; set the time range with the picker above instead.`)
        continue
      }
      if (!dataset.fields.includes(field)) {
        issues.push(`"${field}" isn't a field in the ${dataset.label} dataset, so "${term}" was ignored.`)
        continue
      }
      let op: "=" | "!=" = opRaw === "!=" ? "!=" : "="
      if (notPrefix) op = op === "=" ? "!=" : "="
      filters.push({ field, op, value })
    }
  }

  for (const seg of commandSegments) {
    if (!seg) continue
    const m = seg.match(/^(\S+)([\s\S]*)$/)
    if (!m) continue
    const cmd = m[1].toLowerCase()
    const args = m[2].trim()

    if (cmd === "inputlookup") {
      issues.push(
        `"inputlookup" starts a brand new search from a lookup table instead of an index, which this simulator doesn't support; it always starts from the dataset picked above. Use "lookup" instead to enrich existing results from a table (available: ${Object.keys(LOOKUP_TABLES).join(", ")}).`,
      )
      continue
    }

    const parser = COMMAND_PARSERS[cmd]
    if (!parser) {
      issues.push(`"${cmd}" isn't a command this simulator implements (supported: ${STAGE_TYPES.join(", ")}, plus tstats as an alias for stats). That part of the query was skipped.`)
      continue
    }
    const result = parser(args)
    if (!result) {
      issues.push(`Couldn't parse "| ${cmd} ${args}"; check the syntax against the examples in the tutorial. That command was skipped.`)
      continue
    }
    if (result.issues?.length) issues.push(...result.issues)
    stages.push({ id: nextId(result.type), type: result.type, config: result.config })
  }

  return { filters, stages, issues }
}
