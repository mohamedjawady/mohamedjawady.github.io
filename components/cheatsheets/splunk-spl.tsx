"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Copy,
  Terminal,
  Columns,
  Sigma,
  TrendingUp,
  Clock,
  Globe2,
  BookOpen,
} from "lucide-react"

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
}

function CommandBlock({
  command,
  description,
  example,
}: {
  command: string
  description: string
  example?: string
}) {
  return (
    <div className="flex items-start justify-between p-3 border border-muted rounded-lg gap-3">
      <div className="space-y-1 flex-1 min-w-0">
        <code className="text-sm font-mono bg-muted px-2 py-1 rounded break-all">{command}</code>
        <p className="text-sm text-muted-foreground">{description}</p>
        {example && (
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Example: </span>
            <code className="bg-muted px-1 rounded break-all">{example}</code>
          </div>
        )}
      </div>
      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(command)} className="h-8 w-8 p-0 shrink-0">
        <Copy className="h-3 w-3" />
      </Button>
    </div>
  )
}

function SplBlock({ children, label }: { children: string; label?: string }) {
  return (
    <div className="relative group">
      {label && <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">{label}</div>}
      <pre className="rounded-lg border border-muted bg-muted/40 p-3 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
        {children}
      </pre>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => copyToClipboard(children)}
        className="absolute top-1 right-1 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Copy className="h-3 w-3" />
      </Button>
    </div>
  )
}

function MiniTable({ fields, rows }: { fields: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            {fields.map((f) => (
              <th key={f} className="px-3 py-2 text-left font-semibold whitespace-nowrap">
                {f}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border/50 last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 text-muted-foreground whitespace-nowrap">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-muted-foreground">
      <Badge variant="outline" className="mr-2 text-xs border-amber-500/50 text-amber-600 dark:text-amber-400">
        Note
      </Badge>
      {children}
    </div>
  )
}

export default function SplunkSplCheatsheet() {
  const [tab, setTab] = useState("fields")

  const statFunctions = [
    { fn: "count(field)", meaning: "Events where the field is populated", example: "count(user)" },
    { fn: "dc(field)", meaning: "Distinct values", example: "dc(src_ip)" },
    { fn: "sum(field)", meaning: "Add numeric values", example: "sum(bytes_out)" },
    { fn: "avg(field)", meaning: "Arithmetic mean", example: "avg(bytes_out)" },
    { fn: "min(field) / max(field)", meaning: "Smallest / largest value", example: "max(bytes_out)" },
    { fn: "median(field)", meaning: "Middle value", example: "median(bytes_out)" },
    { fn: "stdev(field) / var(field)", meaning: "Spread of the values", example: "stdev(bytes_out)" },
    { fn: "values(field)", meaning: "Distinct values, as a multivalue field", example: "values(app)" },
    { fn: "list(field)", meaning: "All values in order, duplicates kept", example: "list(action)" },
  ]

  const evalFunctions = [
    { fn: "round(X,Y)", meaning: "Round to Y decimal places", example: "round(12.567,2) -> 12.57" },
    { fn: "if(cond, a, b)", meaning: "Two-way conditional", example: 'if(bytes_out>10000,"Large","Normal")' },
    { fn: "case(c1,v1,c2,v2,...)", meaning: "Multi-way conditional, first match wins", example: 'case(score>=90,"A",score>=70,"B")' },
    { fn: "coalesce(a,b,...)", meaning: "First non-null value", example: 'coalesce(user,"unknown")' },
    { fn: "tostring(X,\"commas\")", meaning: "Comma-grouped string", example: 'tostring(1540000,"commas") -> "1,540,000"' },
    { fn: "strftime(epoch, fmt)", meaning: "Epoch to formatted string", example: 'strftime(_time,"%F %H:%M")' },
    { fn: "strptime(str, fmt)", meaning: "Formatted string to epoch", example: 'strptime("2026-10-16 09:00","%F %H:%M")' },
    { fn: "relative_time(X, Y)", meaning: "Epoch relative to a starting epoch", example: 'relative_time(now(),"-1d@d")' },
    { fn: "now() / time()", meaning: "Search start time / evaluation time", example: "eval started=now()" },
  ]

  const timeUnits = [
    { unit: "s / m / h", meaning: "Seconds / minutes / hours" },
    { unit: "d / w", meaning: "Days / weeks" },
    { unit: "mon / y", meaning: "Months / years (not m, which is minutes)" },
  ]

  const relativeExamples = [
    { expr: "-1h", meaning: "One hour before now, no rounding" },
    { expr: "-1h@h", meaning: "Start of the hour, one hour ago" },
    { expr: "@d", meaning: "Midnight, start of today" },
    { expr: "@d+3h", meaning: "03:00 today" },
    { expr: "-7d@d", meaning: "Midnight, 7 days ago" },
    { expr: "-mon@mon", meaning: "Start of last calendar month" },
  ]

  const quickRef = [
    { cmd: "fields", purpose: "Choose fields to keep or drop" },
    { cmd: "table", purpose: "Arrange selected fields into ordered columns" },
    { cmd: "dedup", purpose: "Keep one event per unique value (or combination)" },
    { cmd: "rename", purpose: "Change a field's name for later commands" },
    { cmd: "sort", purpose: "Order results ascending (+) or descending (-)" },
    { cmd: "fieldformat", purpose: "Change display formatting only, value stays numeric" },
    { cmd: "stats", purpose: "Aggregate into a statistics table, grouped with by" },
    { cmd: "addtotals", purpose: "Add row and/or column totals to a table" },
    { cmd: "top / rare", purpose: "Most / least frequent values of a field" },
    { cmd: "chart", purpose: "Compare a metric across one or two categorical fields" },
    { cmd: "timechart", purpose: "Aggregate a metric over time; _time is the axis" },
    { cmd: "trendline", purpose: "Moving average over a time series" },
    { cmd: "timewrap", purpose: "Compare a time series against an earlier period" },
    { cmd: "bin", purpose: "Group numeric or time values into buckets (no aggregation)" },
    { cmd: "eval", purpose: "Create or overwrite a field from an expression" },
    { cmd: "iplocation", purpose: "Add geographic fields from an IP address" },
    { cmd: "geostats", purpose: "Aggregate events into geographic clusters" },
    { cmd: "geom", purpose: "Add geographic boundary (shape) fields from a lookup" },
    { cmd: "gauge", purpose: "Shape a value for a gauge visualization" },
  ]

  const mistakes = [
    "m means minutes, mon means months. earliest=-1mon@mon and earliest=-1m@m are not close to the same thing.",
    "-1h subtracts an hour from now. -1h@h subtracts an hour, then snaps to the start of that hour. They usually differ.",
    "strftime() formats an epoch value into a string. strptime() parses a string into an epoch value. Easy to swap by habit.",
    "bin only rewrites values into bucket boundaries. It doesn't count or sum anything; stats or a second pipeline step does that.",
    "count(field) counts events where that field has a value. It does not add up the field's numbers, sum(field) does that.",
    "dc(field) is distinct count. count(field) can be much larger than dc(field) if the same value repeats across many events.",
    "list(field) keeps duplicates and has a size limit. values(field) returns only the distinct values. They are not interchangeable.",
    "timechart accepts exactly one split-by field. chart can split by two fields at once (over and by).",
    "After rename old AS new, later commands must reference new. Referencing old again returns no matches, not an error.",
    "geom does not translate arbitrary names into lookup feature IDs on its own. The field's values must already match what the lookup expects.",
  ]

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Terminal className="h-8 w-8" />
          Splunk SPL Cheatsheet
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Field selection, statistics, transforming commands, time handling, and geospatial/visualization prep,
          with worked examples against a small set of security log shapes: firewall traffic, authentication events,
          web access logs, and cloud API calls.
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 h-auto gap-1 p-1">
          <TabsTrigger value="fields" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <Columns className="h-3.5 w-3.5" /> Fields
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <Sigma className="h-3.5 w-3.5" /> Stats
          </TabsTrigger>
          <TabsTrigger value="transform" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <TrendingUp className="h-3.5 w-3.5" /> Transform
          </TabsTrigger>
          <TabsTrigger value="time" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <Clock className="h-3.5 w-3.5" /> Time & eval
          </TabsTrigger>
          <TabsTrigger value="geo" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <Globe2 className="h-3.5 w-3.5" /> Geo & Viz
          </TabsTrigger>
          <TabsTrigger value="reference" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <BookOpen className="h-3.5 w-3.5" /> Reference
          </TabsTrigger>
        </TabsList>

        {/* FIELDS */}
        <TabsContent value="fields" className="space-y-4 mt-4">
          <h2 className="text-lg font-semibold">Field selection and formatting</h2>

          <CommandBlock
            command="| fields user, app, action"
            description="Keep only the named fields in the pipeline from this point on."
            example="index=firewall sourcetype=pan_traffic | fields user, app, action"
          />
          <CommandBlock
            command="| fields - dest_ip, dest_port"
            description="Drop the named fields, keep everything else."
            example="| fields - _raw, _time"
          />
          <CommandBlock
            command="| table _time user app bytes_out"
            description="Display selected fields as ordered columns. A transforming command, the output becomes the result set."
          />
          <CommandBlock
            command="| dedup user"
            description="Keep one event per unique value. By default, the first event encountered is kept; sort first if you need a specific one."
            example="| sort _time | dedup user dest_port"
          />
          <CommandBlock
            command='| rename src_ip AS "Source IP"'
            description="Change a field's displayed name. Later commands must use the new name, the old one is gone from the pipeline."
            example="| rename dest_* AS target_*"
          />
          <CommandBlock
            command="| sort -bytes_out"
            description="Order results. A leading - sorts descending, + sorts ascending (the default)."
            example="| sort +user -bytes_out"
          />

          <SplBlock label="fieldformat: display only, value stays numeric">
            {'index=firewall sourcetype=pan_traffic\n| stats sum(bytes_out) as TotalBytes by user\n| fieldformat TotalBytes = tostring(TotalBytes, "commas")'}
          </SplBlock>
          <MiniTable
            fields={["user", "TotalBytes (underlying)", "TotalBytes (displayed)"]}
            rows={[
              ["jsmith", "6010", "6,010"],
              ["svc_backup", "1540000", "1,540,000"],
            ]}
          />
          <Note>
            TotalBytes is still numeric underneath. If you then pipe into another | sort TotalBytes, it sorts
            correctly as a number, the comma formatting is cosmetic only.
          </Note>
        </TabsContent>

        {/* STATS */}
        <TabsContent value="stats" className="space-y-4 mt-4">
          <h2 className="text-lg font-semibold">Aggregation and statistics</h2>

          <div className="overflow-x-auto rounded-lg border border-muted">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-2 text-left">Function</th>
                  <th className="p-2 text-left">Meaning</th>
                  <th className="p-2 text-left">Example</th>
                </tr>
              </thead>
              <tbody>
                {statFunctions.map((f) => (
                  <tr key={f.fn} className="border-t border-muted">
                    <td className="p-2 font-mono text-xs">{f.fn}</td>
                    <td className="p-2 text-muted-foreground">{f.meaning}</td>
                    <td className="p-2 font-mono text-xs text-muted-foreground">{f.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <SplBlock label="Multiple statistics, one command">
            {"index=firewall sourcetype=pan_traffic\n| stats count as Connections,\n        sum(bytes_out) as TotalBytes,\n        dc(dest_ip) as UniqueDestinations\n  by user"}
          </SplBlock>

          <SplBlock label="Conditional counts with count(eval(...))">
            {'index=firewall sourcetype=pan_traffic\n| stats count(eval(action="blocked")) as Blocked,\n        count(eval(action="allowed")) as Allowed\n  by user'}
          </SplBlock>
          <Note>
            dc(field) counts distinct values. count(field) counts events where the field is populated, duplicates
            and all. If one user hits the same destination IP five times, dc(dest_ip) is 1, count(dest_ip) is 5.
          </Note>

          <SplBlock label="addtotals: row and column totals">
            {'index=firewall sourcetype=pan_traffic\n| chart sum(bytes_out) over user by app\n| addtotals row=true col=true label="Total" labelfield="user" fieldname="Total Bytes"'}
          </SplBlock>
          <MiniTable
            fields={["user", "tls", "rdp", "Total Bytes"]}
            rows={[
              ["jsmith", "4,820", "0", "4,820"],
              ["svc_backup", "0", "15,400", "15,400"],
              ["Total", "4,820", "15,400", "20,220"],
            ]}
          />
          <Note>row=true totals across each row. col=true adds a summary row totaling down each column. The two are independent options.</Note>
        </TabsContent>

        {/* TRANSFORM */}
        <TabsContent value="transform" className="space-y-4 mt-4">
          <h2 className="text-lg font-semibold">Transforming and trend commands</h2>

          <CommandBlock
            command="| top app limit=3"
            description="The most frequent values, with count and percent by default."
            example="| top action by user limit=1"
          />
          <CommandBlock
            command="| rare dest_port limit=5 showperc=f"
            description="The least frequent values, useful for surfacing unusual ports, rare user agents, or uncommon API calls."
          />

          <SplBlock label="chart: compare two categorical fields">
            {"index=firewall sourcetype=pan_traffic\n| chart count over action by app"}
          </SplBlock>
          <MiniTable
            fields={["action", "tls", "ssh", "rdp"]}
            rows={[
              ["allowed", "118", "3", "9"],
              ["blocked", "0", "41", "2"],
            ]}
          />

          <SplBlock label="timechart: aggregate over time, one split-by field">
            {"index=auth sourcetype=okta auth_result=failure\n| timechart span=1h count by app limit=3"}
          </SplBlock>
          <Note>
            chart takes a row-split (over) and an optional column-split (by), two fields total. timechart only
            takes one split-by field; time is always the row axis and doesn't count toward that limit.
          </Note>

          <SplBlock label="trendline: smooth a noisy count">
            {'index=firewall sourcetype=pan_traffic action="blocked"\n| timechart span=1h count as Blocked\n| trendline sma3(Blocked) as Blocked_Trend'}
          </SplBlock>
          <Note>sma3 needs 3 periods of history before it has a value; the first two buckets come back blank, not zero.</Note>

          <SplBlock label="timewrap: this week vs. last week">
            {"index=auth sourcetype=okta auth_result=failure earliest=-14d@d latest=@d\n| timechart span=1d count as Failures\n| timewrap 1w"}
          </SplBlock>

          <div className="overflow-x-auto rounded-lg border border-muted mt-2">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-2 text-left">Command</th>
                  <th className="p-2 text-left">X-axis</th>
                  <th className="p-2 text-left">Split fields</th>
                  <th className="p-2 text-left">Best for</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-muted">
                  <td className="p-2 font-mono text-xs">chart</td>
                  <td className="p-2 text-muted-foreground">Chosen field (over)</td>
                  <td className="p-2 text-muted-foreground">Up to 2 (over + by)</td>
                  <td className="p-2 text-muted-foreground">Comparing categories</td>
                </tr>
                <tr className="border-t border-muted">
                  <td className="p-2 font-mono text-xs">timechart</td>
                  <td className="p-2 text-muted-foreground">_time, automatic</td>
                  <td className="p-2 text-muted-foreground">1 (by)</td>
                  <td className="p-2 text-muted-foreground">Trends over time</td>
                </tr>
                <tr className="border-t border-muted">
                  <td className="p-2 font-mono text-xs">stats</td>
                  <td className="p-2 text-muted-foreground">None, a table</td>
                  <td className="p-2 text-muted-foreground">Any number (by)</td>
                  <td className="p-2 text-muted-foreground">General aggregation</td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* TIME & EVAL */}
        <TabsContent value="time" className="space-y-4 mt-4">
          <h2 className="text-lg font-semibold">Time modifiers and eval</h2>

          <p className="text-sm text-muted-foreground">
            _time is stored as Unix epoch seconds. earliest and latest are search-time modifiers that filter which
            events are included, using the pattern <code className="bg-muted px-1 rounded">[+/-]&lt;number&gt;&lt;unit&gt;@&lt;snap_unit&gt;</code>.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Units</div>
              <div className="space-y-1.5">
                {timeUnits.map((u) => (
                  <div key={u.unit} className="flex items-start gap-2 text-sm">
                    <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs shrink-0">{u.unit}</code>
                    <span className="text-muted-foreground">{u.meaning}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                Snapping vs. subtracting (now = Oct 16, 14:45)
              </div>
              <div className="space-y-1.5">
                {relativeExamples.map((e) => (
                  <div key={e.expr} className="flex items-start gap-2 text-sm">
                    <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs shrink-0">{e.expr}</code>
                    <span className="text-muted-foreground">{e.meaning}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <CommandBlock
            command="| bin span=1h _time"
            description="Group values into buckets. By itself it does not aggregate, pair it with stats."
            example="| bin span=1h _time | stats count by _time"
          />

          <div className="overflow-x-auto rounded-lg border border-muted">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-2 text-left">eval function</th>
                  <th className="p-2 text-left">Meaning</th>
                  <th className="p-2 text-left">Example</th>
                </tr>
              </thead>
              <tbody>
                {evalFunctions.map((f) => (
                  <tr key={f.fn} className="border-t border-muted">
                    <td className="p-2 font-mono text-xs">{f.fn}</td>
                    <td className="p-2 text-muted-foreground">{f.meaning}</td>
                    <td className="p-2 font-mono text-xs text-muted-foreground">{f.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <SplBlock label="case(): risk-score a firewall decision">
            {'index=firewall sourcetype=pan_traffic\n| eval risk = case(\n    action="blocked" AND dest_port=22, "High",\n    action="blocked", "Medium",\n    1=1, "Low"\n  )'}
          </SplBlock>
          <Note>case() evaluates top to bottom and stops at the first true condition. Order the specific cases before the catch-all.</Note>

          <SplBlock label="Filtering on a time-zone-correct hour, not a raw extracted field">
            {'index=cloud sourcetype=aws_cloudtrail earliest=-2d@d latest=@d\n| eval my_hour = tonumber(strftime(_time, "%H"))\n| search my_hour>=2 AND my_hour<5'}
          </SplBlock>
          <Note>
            Extracted fields such as date_hour can reflect a different time basis than _time displayed in your
            configured time zone. Deriving the hour from strftime(_time, ...) keeps the filter and the display
            consistent.
          </Note>
        </TabsContent>

        {/* GEO & VIZ */}
        <TabsContent value="geo" className="space-y-4 mt-4">
          <h2 className="text-lg font-semibold">Geospatial analysis and single-value visualizations</h2>

          <SplBlock label="iplocation: enrich an IP with geography">
            {"index=web sourcetype=nginx_access\n| iplocation clientip"}
          </SplBlock>
          <MiniTable
            fields={["clientip", "uri_path", "Country", "City", "lat", "lon"]}
            rows={[["203.0.113.44", "/login", "Germany", "Frankfurt", "50.1109", "8.6821"]]}
          />
          <Note>Not every IP resolves to a city; some only resolve to a country, or not at all, depending on the lookup data available.</Note>

          <SplBlock label="geostats: cluster for a marker map">
            {"index=auth sourcetype=okta\n| iplocation src_ip\n| geostats latfield=lat longfield=lon count by auth_result"}
          </SplBlock>

          <SplBlock label="geom: boundaries for a choropleth map">
            {"index=cloud sourcetype=aws_cloudtrail\n| stats count by awsRegion\n| geom geo_countries featureIdField=awsRegion"}
          </SplBlock>
          <Note>
            geom does not translate arbitrary region names into valid feature IDs automatically. The field's
            values have to already match what the geographic lookup expects.
          </Note>

          <SplBlock label="gauge: a single value against thresholds">
            {'index=firewall sourcetype=pan_traffic\n| stats count(eval(action="blocked")) as BlockedConnections\n| gauge BlockedConnections 0 50 150 300'}
          </SplBlock>
          <Note>
            gauge shapes the result for the visualization; the color bands (ok / warn / critical) come from the
            threshold arguments, and get configured further in the panel's visualization settings.
          </Note>

          <div className="grid sm:grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg border border-muted p-3">
              <div className="font-mono text-xs text-muted-foreground mb-1">iplocation</div>
              Convert IPs into geographic fields
            </div>
            <div className="rounded-lg border border-muted p-3">
              <div className="font-mono text-xs text-muted-foreground mb-1">geostats</div>
              Aggregate into geographic clusters
            </div>
            <div className="rounded-lg border border-muted p-3">
              <div className="font-mono text-xs text-muted-foreground mb-1">geom</div>
              Add boundary shapes from a lookup
            </div>
          </div>
        </TabsContent>

        {/* REFERENCE */}
        <TabsContent value="reference" className="space-y-4 mt-4">
          <h2 className="text-lg font-semibold">Quick reference</h2>

          <div className="overflow-x-auto rounded-lg border border-muted">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-2 text-left">Command</th>
                  <th className="p-2 text-left">Purpose</th>
                </tr>
              </thead>
              <tbody>
                {quickRef.map((r) => (
                  <tr key={r.cmd} className="border-t border-muted">
                    <td className="p-2 font-mono text-xs whitespace-nowrap">{r.cmd}</td>
                    <td className="p-2 text-muted-foreground">{r.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-base font-semibold mt-6">Common mistakes</h3>
          <ul className="space-y-2">
            {mistakes.map((m, i) => (
              <li key={i} className="text-sm text-muted-foreground flex gap-2">
                <span className="text-amber-500 shrink-0">•</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  )
}
