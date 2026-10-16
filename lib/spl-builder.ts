export interface SplTable {
  fields: string[]
  rows: string[][]
}

export interface SplVariant {
  id: string
  label: string
  description: string
  spl: string
  sourceLine: string
  input: SplTable
  output: SplTable
  note?: string
}

export interface SplCommand {
  id: string
  name: string
  group: string
  summary: string
  variants: SplVariant[]
}

export const SPL_GROUPS = [
  "Field Selection & Formatting",
  "Aggregation & Statistics",
  "Transforming & Trend Commands",
  "Time Modifiers & eval",
  "Geospatial & Single-Value",
] as const

export const SPL_COMMANDS: SplCommand[] = [
  // ---------------------------------------------------------------------
  // Field Selection & Formatting
  // ---------------------------------------------------------------------
  {
    id: "fields",
    name: "fields",
    group: "Field Selection & Formatting",
    summary: "Include or exclude fields from the results carried through the rest of the pipeline.",
    variants: [
      {
        id: "keep",
        label: "Keep selected fields",
        description: "Drop everything except the fields you name.",
        spl: "| fields user, app, action, bytes_out",
        sourceLine: "index=firewall sourcetype=pan_traffic",
        input: {
          fields: ["_time", "src_ip", "dest_ip", "dest_port", "app", "action", "bytes_out", "user"],
          rows: [
            ["09:01:02", "10.1.2.15", "203.0.113.9", "443", "tls", "allowed", "4820", "jsmith"],
            ["09:02:11", "10.1.4.22", "198.51.100.7", "22", "ssh", "blocked", "0", "mchen"],
            ["09:03:58", "10.1.9.3", "192.0.2.50", "3389", "rdp", "allowed", "15400", "svc_backup"],
          ],
        },
        output: {
          fields: ["user", "app", "action", "bytes_out"],
          rows: [
            ["jsmith", "tls", "allowed", "4820"],
            ["mchen", "ssh", "blocked", "0"],
            ["svc_backup", "rdp", "allowed", "15400"],
          ],
        },
        note: "_time, src_ip, dest_ip, and dest_port are still in the raw event, just no longer carried forward in the pipeline.",
      },
      {
        id: "exclude",
        label: "Exclude fields",
        description: "Keep everything except the fields you name with a leading minus.",
        spl: "| fields - dest_ip, dest_port",
        sourceLine: "index=firewall sourcetype=pan_traffic",
        input: {
          fields: ["_time", "src_ip", "dest_ip", "dest_port", "app", "action", "bytes_out", "user"],
          rows: [
            ["09:01:02", "10.1.2.15", "203.0.113.9", "443", "tls", "allowed", "4820", "jsmith"],
            ["09:02:11", "10.1.4.22", "198.51.100.7", "22", "ssh", "blocked", "0", "mchen"],
          ],
        },
        output: {
          fields: ["_time", "src_ip", "app", "action", "bytes_out", "user"],
          rows: [
            ["09:01:02", "10.1.2.15", "tls", "allowed", "4820", "jsmith"],
            ["09:02:11", "10.1.4.22", "ssh", "blocked", "0", "mchen"],
          ],
        },
      },
    ],
  },
  {
    id: "table",
    name: "table",
    group: "Field Selection & Formatting",
    summary: "Render results as an ordered column table. A transforming command: the output replaces the event stream.",
    variants: [
      {
        id: "basic",
        label: "Select and order columns",
        description: "Choose which fields to display, and in what order.",
        spl: "| table _time user app bytes_out",
        sourceLine: "index=firewall sourcetype=pan_traffic",
        input: {
          fields: ["_time", "src_ip", "dest_ip", "app", "action", "bytes_out", "user"],
          rows: [
            ["09:01:02", "10.1.2.15", "203.0.113.9", "tls", "allowed", "4820", "jsmith"],
            ["09:03:58", "10.1.9.3", "192.0.2.50", "rdp", "allowed", "15400", "svc_backup"],
          ],
        },
        output: {
          fields: ["_time", "user", "app", "bytes_out"],
          rows: [
            ["09:01:02", "jsmith", "tls", "4820"],
            ["09:03:58", "svc_backup", "rdp", "15400"],
          ],
        },
      },
      {
        id: "reorder",
        label: "Reorder without filtering",
        description: "The same fields, listed in a different order, to change the display order only.",
        spl: "| table app user bytes_out _time",
        sourceLine: "index=firewall sourcetype=pan_traffic",
        input: {
          fields: ["_time", "app", "user", "bytes_out"],
          rows: [
            ["09:01:02", "tls", "jsmith", "4820"],
            ["09:03:58", "rdp", "svc_backup", "15400"],
          ],
        },
        output: {
          fields: ["app", "user", "bytes_out", "_time"],
          rows: [
            ["tls", "jsmith", "4820", "09:01:02"],
            ["rdp", "svc_backup", "15400", "09:03:58"],
          ],
        },
        note: "table never changes which rows exist, only which columns show and in what order.",
      },
    ],
  },
  {
    id: "dedup",
    name: "dedup",
    group: "Field Selection & Formatting",
    summary: "Remove duplicate events, keeping the first event encountered per unique value (or combination).",
    variants: [
      {
        id: "single",
        label: "Dedup by one field",
        description: "Keep one event per unique value of a single field.",
        spl: "| dedup user",
        sourceLine: "index=firewall sourcetype=pan_traffic",
        input: {
          fields: ["_time", "user", "dest_port", "action"],
          rows: [
            ["09:01:02", "jsmith", "443", "allowed"],
            ["09:01:05", "jsmith", "443", "allowed"],
            ["09:02:11", "mchen", "22", "blocked"],
            ["09:02:40", "agupta", "443", "allowed"],
            ["09:03:02", "mchen", "22", "blocked"],
          ],
        },
        output: {
          fields: ["_time", "user", "dest_port", "action"],
          rows: [
            ["09:01:02", "jsmith", "443", "allowed"],
            ["09:02:11", "mchen", "22", "blocked"],
            ["09:02:40", "agupta", "443", "allowed"],
          ],
        },
        note: "Sort first if you need something other than the first chronological event retained per user.",
      },
      {
        id: "multi",
        label: "Dedup by a field combination",
        description: "Keep one event per unique combination of several fields.",
        spl: "| dedup user dest_port",
        sourceLine: "index=firewall sourcetype=pan_traffic",
        input: {
          fields: ["_time", "user", "dest_port", "action"],
          rows: [
            ["09:01:02", "jsmith", "443", "allowed"],
            ["09:01:05", "jsmith", "443", "allowed"],
            ["09:02:11", "mchen", "22", "blocked"],
            ["09:04:20", "mchen", "3389", "blocked"],
          ],
        },
        output: {
          fields: ["_time", "user", "dest_port", "action"],
          rows: [
            ["09:01:02", "jsmith", "443", "allowed"],
            ["09:02:11", "mchen", "22", "blocked"],
            ["09:04:20", "mchen", "3389", "blocked"],
          ],
        },
        note: "mchen now keeps two rows, one per distinct dest_port, because the dedup key includes dest_port.",
      },
    ],
  },
  {
    id: "fieldformat",
    name: "fieldformat",
    group: "Field Selection & Formatting",
    summary: "Change how a value is displayed, without changing the underlying field value used by later calculations.",
    variants: [
      {
        id: "commas",
        label: "Comma-grouped bytes",
        description: "Format a summed byte count for readability.",
        spl: '| stats sum(bytes_out) as TotalBytes by user\n| fieldformat TotalBytes = tostring(TotalBytes, "commas")',
        sourceLine: "index=firewall sourcetype=pan_traffic",
        input: {
          fields: ["user", "bytes_out"],
          rows: [
            ["jsmith", "4820"],
            ["jsmith", "1190"],
            ["svc_backup", "1540000"],
          ],
        },
        output: {
          fields: ["user", "TotalBytes"],
          rows: [
            ["jsmith", "6,010"],
            ["svc_backup", "1,540,000"],
          ],
        },
        note: "TotalBytes is still numerically 1540000 underneath. fieldformat only changes what's displayed.",
      },
    ],
  },
  {
    id: "rename",
    name: "rename",
    group: "Field Selection & Formatting",
    summary: "Change field names in the results. Later commands must refer to the new name.",
    variants: [
      {
        id: "basic",
        label: "Rename to display labels",
        description: "Give fields human-readable names for a report.",
        spl: '| rename src_ip AS "Source IP", action AS Verdict',
        sourceLine: "index=firewall sourcetype=pan_traffic",
        input: {
          fields: ["src_ip", "action", "app"],
          rows: [
            ["10.1.2.15", "allowed", "tls"],
            ["10.1.4.22", "blocked", "ssh"],
          ],
        },
        output: {
          fields: ["Source IP", "Verdict", "app"],
          rows: [
            ["10.1.2.15", "allowed", "tls"],
            ["10.1.4.22", "blocked", "ssh"],
          ],
        },
        note: 'A later | sort action would now fail silently (no such field); it has to be | sort Verdict.',
      },
      {
        id: "wildcard",
        label: "Wildcard rename",
        description: "Rename every field matching a pattern in one command.",
        spl: "| rename dest_* AS target_*",
        sourceLine: "index=firewall sourcetype=pan_traffic",
        input: {
          fields: ["dest_ip", "dest_port", "app"],
          rows: [["203.0.113.9", "443", "tls"]],
        },
        output: {
          fields: ["target_ip", "target_port", "app"],
          rows: [["203.0.113.9", "443", "tls"]],
        },
      },
    ],
  },
  {
    id: "sort",
    name: "sort",
    group: "Field Selection & Formatting",
    summary: "Order results by one or more fields, ascending or descending.",
    variants: [
      {
        id: "desc",
        label: "Descending, single field",
        description: "Largest values first.",
        spl: "| sort -bytes_out",
        sourceLine: "index=firewall sourcetype=pan_traffic",
        input: {
          fields: ["user", "bytes_out"],
          rows: [
            ["jsmith", "4820"],
            ["svc_backup", "15400"],
            ["agupta", "2310"],
          ],
        },
        output: {
          fields: ["user", "bytes_out"],
          rows: [
            ["svc_backup", "15400"],
            ["jsmith", "4820"],
            ["agupta", "2310"],
          ],
        },
      },
      {
        id: "multi",
        label: "Multi-field sort",
        description: "Sort by one field ascending, then break ties with another, descending.",
        spl: "| sort +user -bytes_out",
        sourceLine: "index=firewall sourcetype=pan_traffic",
        input: {
          fields: ["user", "bytes_out"],
          rows: [
            ["jsmith", "1190"],
            ["jsmith", "4820"],
            ["agupta", "2310"],
          ],
        },
        output: {
          fields: ["user", "bytes_out"],
          rows: [
            ["agupta", "2310"],
            ["jsmith", "4820"],
            ["jsmith", "1190"],
          ],
        },
        note: "Users sorted alphabetically first; within jsmith's two rows, the larger bytes_out comes first.",
      },
    ],
  },

  // ---------------------------------------------------------------------
  // Aggregation & Statistics
  // ---------------------------------------------------------------------
  {
    id: "stats",
    name: "stats",
    group: "Aggregation & Statistics",
    summary: "Calculate aggregate statistics across events currently in the pipeline, grouped with by.",
    variants: [
      {
        id: "count-by",
        label: "count by",
        description: "How many events per group.",
        spl: "| stats count by user",
        sourceLine: "index=firewall sourcetype=pan_traffic",
        input: {
          fields: ["user", "action"],
          rows: [
            ["jsmith", "allowed"],
            ["jsmith", "allowed"],
            ["mchen", "blocked"],
            ["mchen", "blocked"],
            ["agupta", "allowed"],
          ],
        },
        output: {
          fields: ["user", "count"],
          rows: [
            ["agupta", "1"],
            ["jsmith", "2"],
            ["mchen", "2"],
          ],
        },
      },
      {
        id: "multi-func",
        label: "Multiple statistics at once",
        description: "Combine count, sum, and distinct count in a single stats command.",
        spl: '| stats count as Connections, sum(bytes_out) as TotalBytes, dc(dest_ip) as UniqueDestinations by user',
        sourceLine: "index=firewall sourcetype=pan_traffic",
        input: {
          fields: ["user", "dest_ip", "bytes_out"],
          rows: [
            ["jsmith", "203.0.113.9", "4820"],
            ["jsmith", "203.0.113.9", "1190"],
            ["jsmith", "198.51.100.3", "900"],
          ],
        },
        output: {
          fields: ["user", "Connections", "TotalBytes", "UniqueDestinations"],
          rows: [["jsmith", "3", "6910", "2"]],
        },
        note: "dc() counts distinct destination IPs (2), not the number of events (3). count(field) and dc(field) answer different questions.",
      },
      {
        id: "conditional",
        label: "Conditional counts with eval()",
        description: "Count how many events match a condition, inside a single stats command.",
        spl: '| stats count(eval(action="blocked")) as Blocked, count(eval(action="allowed")) as Allowed by user',
        sourceLine: "index=firewall sourcetype=pan_traffic",
        input: {
          fields: ["user", "action"],
          rows: [
            ["mchen", "blocked"],
            ["mchen", "blocked"],
            ["jsmith", "allowed"],
            ["jsmith", "allowed"],
          ],
        },
        output: {
          fields: ["user", "Blocked", "Allowed"],
          rows: [
            ["jsmith", "0", "2"],
            ["mchen", "2", "0"],
          ],
        },
        note: "count(eval(...)) counts events where the expression is non-null/true. String comparisons are case-sensitive.",
      },
    ],
  },
  {
    id: "addtotals",
    name: "addtotals",
    group: "Aggregation & Statistics",
    summary: "Add a total column per row, a summary row totaling each column, or both.",
    variants: [
      {
        id: "row",
        label: "row=true (per-row total)",
        description: "Add a total column summing across each row's categories.",
        spl: '| chart sum(bytes_out) over user by app\n| addtotals row=true fieldname="Total Bytes"',
        sourceLine: "index=firewall sourcetype=pan_traffic",
        input: {
          fields: ["user", "app", "bytes_out"],
          rows: [
            ["jsmith", "tls", "4820"],
            ["jsmith", "ssh", "900"],
            ["svc_backup", "rdp", "15400"],
          ],
        },
        output: {
          fields: ["user", "tls", "ssh", "rdp", "Total Bytes"],
          rows: [
            ["jsmith", "4820", "900", "0", "5720"],
            ["svc_backup", "0", "0", "15400", "15400"],
          ],
        },
      },
      {
        id: "row-col",
        label: "row=true col=true (grand total)",
        description: "Add both a per-row total column and a grand-total summary row.",
        spl: '| chart sum(bytes_out) over user by app\n| addtotals row=true col=true label="Total" labelfield="user" fieldname="Total Bytes"',
        sourceLine: "index=firewall sourcetype=pan_traffic",
        input: {
          fields: ["user", "app", "bytes_out"],
          rows: [
            ["jsmith", "tls", "4820"],
            ["svc_backup", "rdp", "15400"],
          ],
        },
        output: {
          fields: ["user", "tls", "rdp", "Total Bytes"],
          rows: [
            ["jsmith", "4820", "0", "4820"],
            ["svc_backup", "0", "15400", "15400"],
            ["Total", "4820", "15400", "20220"],
          ],
        },
        note: "row sums across each row; col sums down each column. The two options are independent.",
      },
    ],
  },

  // ---------------------------------------------------------------------
  // Transforming & Trend Commands
  // ---------------------------------------------------------------------
  {
    id: "top",
    name: "top",
    group: "Transforming & Trend Commands",
    summary: "Find the most frequent values of a field, with count and percentage by default.",
    variants: [
      {
        id: "limit",
        label: "top with limit",
        description: "The N most common values.",
        spl: "| top app limit=3",
        sourceLine: "index=firewall sourcetype=pan_traffic",
        input: {
          fields: ["app"],
          rows: [["tls"], ["tls"], ["tls"], ["ssh"], ["ssh"], ["rdp"]],
        },
        output: {
          fields: ["app", "count", "percent"],
          rows: [
            ["tls", "3", "50.00"],
            ["ssh", "2", "33.33"],
            ["rdp", "1", "16.67"],
          ],
        },
      },
      {
        id: "by-group",
        label: "top ... by group",
        description: "The most common value within each group.",
        spl: "| top 1 action by user",
        sourceLine: "index=firewall sourcetype=pan_traffic",
        input: {
          fields: ["user", "action"],
          rows: [
            ["mchen", "blocked"],
            ["mchen", "blocked"],
            ["mchen", "allowed"],
            ["jsmith", "allowed"],
          ],
        },
        output: {
          fields: ["user", "action", "count", "percent"],
          rows: [
            ["mchen", "blocked", "2", "66.67"],
            ["jsmith", "allowed", "1", "100.00"],
          ],
        },
        note: "top N <field> by <group> returns the N most frequent values within each group, not globally.",
      },
    ],
  },
  {
    id: "rare",
    name: "rare",
    group: "Transforming & Trend Commands",
    summary: "Find the least frequent values of a field, the inverse sort order of top.",
    variants: [
      {
        id: "basic",
        label: "rare with limit",
        description: "Surface unusual destination ports.",
        spl: "| rare dest_port limit=3 showperc=f",
        sourceLine: "index=firewall sourcetype=pan_traffic",
        input: {
          fields: ["dest_port"],
          rows: [["443"], ["443"], ["443"], ["22"], ["8081"]],
        },
        output: {
          fields: ["dest_port", "count"],
          rows: [
            ["8081", "1"],
            ["22", "1"],
            ["443", "3"],
          ],
        },
        note: "showperc=f hides the percentage column. 8081 and 22 tie at count 1; either may appear first.",
      },
    ],
  },
  {
    id: "chart",
    name: "chart",
    group: "Transforming & Trend Commands",
    summary: "Aggregate into a table suitable for a category-comparison chart: over sets rows, by splits into series.",
    variants: [
      {
        id: "over-by",
        label: "over ... by ...",
        description: "Compare a metric across two categorical fields at once.",
        spl: "| chart count over action by app",
        sourceLine: "index=firewall sourcetype=pan_traffic",
        input: {
          fields: ["action", "app"],
          rows: [
            ["allowed", "tls"],
            ["allowed", "tls"],
            ["blocked", "ssh"],
            ["allowed", "rdp"],
          ],
        },
        output: {
          fields: ["action", "tls", "ssh", "rdp"],
          rows: [
            ["allowed", "2", "0", "1"],
            ["blocked", "0", "1", "0"],
          ],
        },
      },
      {
        id: "limit-useother",
        label: "limit + useother=f",
        description: "Cap the number of series and drop the catch-all OTHER column.",
        spl: "| chart sum(bytes_out) over user by app limit=2 useother=f",
        sourceLine: "index=firewall sourcetype=pan_traffic",
        input: {
          fields: ["user", "app", "bytes_out"],
          rows: [
            ["jsmith", "tls", "4820"],
            ["jsmith", "ssh", "100"],
            ["jsmith", "rdp", "50"],
            ["svc_backup", "rdp", "15400"],
          ],
        },
        output: {
          fields: ["user", "tls", "rdp"],
          rows: [
            ["jsmith", "4820", "50"],
            ["svc_backup", "0", "15400"],
          ],
        },
        note: "Without useother=f, a third column named OTHER would absorb jsmith's ssh total instead of dropping it.",
      },
    ],
  },
  {
    id: "timechart",
    name: "timechart",
    group: "Transforming & Trend Commands",
    summary: "Aggregate into a time-series table. _time is always the row axis; span sets the bucket size.",
    variants: [
      {
        id: "span-count",
        label: "span + count",
        description: "Count events in fixed time buckets.",
        spl: "| timechart span=1h count",
        sourceLine: "index=firewall sourcetype=pan_traffic",
        input: {
          fields: ["_time"],
          rows: [["08:12"], ["08:47"], ["09:03"], ["09:58"], ["09:59"]],
        },
        output: {
          fields: ["_time", "count"],
          rows: [
            ["08:00", "2"],
            ["09:00", "3"],
          ],
        },
      },
      {
        id: "by-limit",
        label: "by ... limit=N",
        description: "One series per value of a split field, capped to the busiest N.",
        spl: "| timechart span=1h sum(bytes_out) by app limit=2",
        sourceLine: "index=firewall sourcetype=pan_traffic",
        input: {
          fields: ["_time", "app", "bytes_out"],
          rows: [
            ["08:10", "tls", "4820"],
            ["08:40", "ssh", "100"],
            ["09:05", "rdp", "15400"],
          ],
        },
        output: {
          fields: ["_time", "tls", "rdp"],
          rows: [
            ["08:00", "4820", "0"],
            ["09:00", "0", "15400"],
          ],
        },
        note: "timechart accepts only one split-by field, unlike chart, which can take a row-split and a column-split.",
      },
    ],
  },
  {
    id: "trendline",
    name: "trendline",
    group: "Transforming & Trend Commands",
    summary: "Compute a moving average over a time series to smooth short-term fluctuations.",
    variants: [
      {
        id: "sma",
        label: "sma3 (simple moving average)",
        description: "Smooth a blocked-connection count to see the underlying trend.",
        spl: "| timechart span=1h count as Blocked\n| trendline sma3(Blocked) as Blocked_Trend",
        sourceLine: 'index=firewall sourcetype=pan_traffic action="blocked"',
        input: {
          fields: ["_time", "Blocked"],
          rows: [
            ["06:00", "4"],
            ["07:00", "9"],
            ["08:00", "5"],
            ["09:00", "11"],
          ],
        },
        output: {
          fields: ["_time", "Blocked", "Blocked_Trend"],
          rows: [
            ["06:00", "4", ""],
            ["07:00", "9", ""],
            ["08:00", "5", "6.00"],
            ["09:00", "11", "8.33"],
          ],
        },
        note: "sma3 needs 3 periods of history before it produces a value; the first two buckets are blank.",
      },
    ],
  },

  // ---------------------------------------------------------------------
  // Time Modifiers & eval
  // ---------------------------------------------------------------------
  {
    id: "bin",
    name: "bin",
    group: "Time Modifiers & eval",
    summary: "Group continuous numeric or time values into fixed-size buckets. Does not aggregate by itself.",
    variants: [
      {
        id: "time",
        label: "bin span=1h _time",
        description: "Snap event timestamps down to the start of their hour.",
        spl: "| bin span=1h _time\n| stats count by _time",
        sourceLine: "index=firewall sourcetype=pan_traffic",
        input: {
          fields: ["_time"],
          rows: [["08:12"], ["08:47"], ["09:03"]],
        },
        output: {
          fields: ["_time", "count"],
          rows: [
            ["08:00", "2"],
            ["09:00", "1"],
          ],
        },
        note: "bin alone only rewrites the _time values into bucket boundaries; stats performs the actual aggregation.",
      },
      {
        id: "numeric",
        label: "bin span=<n> <numeric field>",
        description: "Group a numeric field, such as transfer size, into fixed-width bands.",
        spl: "| bin bytes_out span=5000\n| stats count by bytes_out",
        sourceLine: "index=firewall sourcetype=pan_traffic",
        input: {
          fields: ["bytes_out"],
          rows: [["1200"], ["4820"], ["15400"], ["16100"]],
        },
        output: {
          fields: ["bytes_out", "count"],
          rows: [
            ["0", "2"],
            ["15000", "2"],
          ],
        },
        note: "bytes_out is overwritten with its bucket's lower bound, not its original value.",
      },
    ],
  },
  {
    id: "eval",
    name: "eval",
    group: "Time Modifiers & eval",
    summary: "Create or overwrite a field by evaluating an expression: arithmetic, conditionals, strings, or time functions.",
    variants: [
      {
        id: "arithmetic",
        label: "Arithmetic + round()",
        description: "Convert bytes to a rounded kilobyte figure.",
        spl: "| eval total_kb = round(bytes_out / 1024, 2)",
        sourceLine: "index=firewall sourcetype=pan_traffic",
        input: {
          fields: ["user", "bytes_out"],
          rows: [["svc_backup", "15400"]],
        },
        output: {
          fields: ["user", "bytes_out", "total_kb"],
          rows: [["svc_backup", "15400", "15.04"]],
        },
      },
      {
        id: "case",
        label: "case() for conditional labels",
        description: "Turn raw fields into a risk label, evaluated top to bottom.",
        spl: '| eval risk = case(\n    action="blocked" AND dest_port=22, "High",\n    action="blocked", "Medium",\n    1=1, "Low"\n  )',
        sourceLine: "index=firewall sourcetype=pan_traffic",
        input: {
          fields: ["action", "dest_port"],
          rows: [
            ["blocked", "22"],
            ["blocked", "3389"],
            ["allowed", "443"],
          ],
        },
        output: {
          fields: ["action", "dest_port", "risk"],
          rows: [
            ["blocked", "22", "High"],
            ["blocked", "3389", "Medium"],
            ["allowed", "443", "Low"],
          ],
        },
        note: "case() stops at the first true condition, so order matters: a blocked SSH attempt matches the first clause, not the second.",
      },
      {
        id: "strftime",
        label: "strftime() for a readable time",
        description: "Format the epoch timestamp into something human-readable.",
        spl: '| eval event_time = strftime(_time, "%b %d, %I:%M %p")',
        sourceLine: "index=firewall sourcetype=pan_traffic",
        input: {
          fields: ["_time"],
          rows: [["1760605262"]],
        },
        output: {
          fields: ["_time", "event_time"],
          rows: [["1760605262", "Oct 16, 09:01 AM"]],
        },
        note: "strftime() formats an epoch value into a string. strptime() does the reverse: string to epoch.",
      },
    ],
  },
  {
    id: "timewrap",
    name: "timewrap",
    group: "Time Modifiers & eval",
    summary: "Compare a time series against an earlier period of the same length, such as this week vs. last week.",
    variants: [
      {
        id: "week",
        label: "timewrap 1w",
        description: "Compare daily blocked-login counts against the same weekday last week.",
        spl: '| timechart span=1d count as Failures\n| timewrap 1w',
        sourceLine: 'index=auth sourcetype=okta auth_result="failure" earliest=-14d@d latest=@d',
        input: {
          fields: ["_time", "Failures"],
          rows: [
            ["Mon (this week)", "12"],
            ["Mon (last week)", "9"],
          ],
        },
        output: {
          fields: ["Day", "Failures", "Failures_lag_1w"],
          rows: [["Mon", "12", "9"]],
        },
        note: "The exact output field names depend on the Splunk version; the point is one row per day with both weeks side by side.",
      },
    ],
  },

  // ---------------------------------------------------------------------
  // Geospatial & Single-Value
  // ---------------------------------------------------------------------
  {
    id: "iplocation",
    name: "iplocation",
    group: "Geospatial & Single-Value",
    summary: "Enrich events with geographic fields (Country, City, lat, lon) derived from an IP address.",
    variants: [
      {
        id: "basic",
        label: "iplocation <ip field>",
        description: "Resolve client IPs on inbound web traffic to a country and coordinates.",
        spl: "| iplocation clientip",
        sourceLine: "index=web sourcetype=nginx_access",
        input: {
          fields: ["clientip", "uri_path", "status"],
          rows: [["203.0.113.44", "/login", "200"]],
        },
        output: {
          fields: ["clientip", "uri_path", "status", "Country", "City", "lat", "lon"],
          rows: [["203.0.113.44", "/login", "200", "Germany", "Frankfurt", "50.1109", "8.6821"]],
        },
        note: "Not every IP resolves to a city; some only resolve to a country, or not at all, depending on the lookup data.",
      },
    ],
  },
  {
    id: "geostats",
    name: "geostats",
    group: "Geospatial & Single-Value",
    summary: "Aggregate events into geographic clusters for a map visualization.",
    variants: [
      {
        id: "with-iplocation",
        label: "iplocation + geostats count",
        description: "Count login attempts by resolved location, ready for a marker map.",
        spl: "| iplocation src_ip\n| geostats count",
        sourceLine: "index=auth sourcetype=okta",
        input: {
          fields: ["src_ip", "lat", "lon"],
          rows: [
            ["203.0.113.44", "50.1109", "8.6821"],
            ["203.0.113.44", "50.1109", "8.6821"],
            ["198.51.100.9", "35.6762", "139.6503"],
          ],
        },
        output: {
          fields: ["lat", "lon", "count"],
          rows: [
            ["50.1109", "8.6821", "2"],
            ["35.6762", "139.6503", "1"],
          ],
        },
      },
    ],
  },
  {
    id: "gauge",
    name: "gauge",
    group: "Geospatial & Single-Value",
    summary: "Shape a single aggregate value for a gauge visualization, against defined threshold ranges.",
    variants: [
      {
        id: "thresholds",
        label: "gauge <field> <ranges>",
        description: "Show blocked-connection count against a defined scale.",
        spl: "| stats count(eval(action=\"blocked\")) as BlockedConnections\n| gauge BlockedConnections 0 50 150 300",
        sourceLine: "index=firewall sourcetype=pan_traffic",
        input: {
          fields: ["action"],
          rows: [["blocked"], ["blocked"], ["allowed"]],
        },
        output: {
          fields: ["BlockedConnections"],
          rows: [["2"]],
        },
        note: "gauge only shapes the result for the visualization; the gauge's color bands (0-50 ok, 50-150 warn, 150-300 critical) are set by the threshold arguments.",
      },
    ],
  },
]

export function getSplCommand(id: string): SplCommand | undefined {
  return SPL_COMMANDS.find((c) => c.id === id)
}
