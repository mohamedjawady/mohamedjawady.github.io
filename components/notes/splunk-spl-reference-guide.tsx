"use client"

import { useState } from "react"
import Link from "next/link"
import { Copy, Check, Terminal, Wrench, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <Button
      size="sm"
      variant="ghost"
      className="h-7 w-7 p-0"
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      title={copied ? "Copied" : "Copy"}
    >
      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
    </Button>
  )
}

function Code({ children }: { children: string }) {
  return (
    <div className="flex items-start justify-between gap-2 bg-muted/50 rounded p-2">
      <code className="text-xs font-mono whitespace-pre-wrap break-all">{children}</code>
      <CopyButton text={children} />
    </div>
  )
}

interface ConceptCardProps {
  title: string
  description: string
  keyPoints?: string[]
  examples?: string[]
  note?: string
}

function ConceptCard({ title, description, keyPoints, examples, note }: ConceptCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        {keyPoints && keyPoints.length > 0 && (
          <ul className="space-y-1">
            {keyPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        )}
        {examples && examples.length > 0 && (
          <div className="space-y-1.5">
            {examples.map((ex, i) => (
              <Code key={i}>{ex}</Code>
            ))}
          </div>
        )}
        {note && (
          <Alert>
            <AlertDescription className="text-xs">
              <strong>Note: </strong>
              {note}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

function SectionHeading({ icon: Icon, title }: { icon: React.ComponentType<{ className?: string }>; title: string }) {
  return (
    <div className="flex items-center gap-2 mt-10 mb-4">
      <Icon className="w-5 h-5 text-emerald-500" />
      <h2 className="text-xl font-bold font-mono">{title}</h2>
    </div>
  )
}

export default function SplunkSplReferenceGuideNotes() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Terminal className="h-8 w-8" />
          Splunk SPL Reference Guide
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          SPL reads left to right as a pipeline: each stage narrows or reshapes whatever the previous stage handed
          it. Almost every mistake below comes from forgetting that, and treating a command as a standalone query
          instead of one link in a chain.
        </p>
      </div>

      <SectionHeading icon={Terminal} title="The pipeline model" />
      <div className="grid md:grid-cols-2 gap-4">
        <ConceptCard
          title="Search first, then shape"
          description="Every SPL search starts with an implicit search command: index, sourcetype, and field=value terms filter raw events before anything else runs. Everything after the first | reshapes what already matched."
          keyPoints={[
            "Filtering in the base search is cheap; filtering later with | search re-reads data that's already been pulled into the pipeline.",
            "field=value terms are ANDed together automatically. Use OR and parentheses explicitly for alternatives.",
            "A leading wildcard (*.evil.com) is expensive to search; a trailing one (evil.*) is cheap.",
          ]}
          examples={['index=web sourcetype=nginx_access status=404 (method=POST OR method=PUT)']}
        />
        <ConceptCard
          title="Transforming vs. non-transforming commands"
          description="Non-transforming commands (fields, eval, sort, dedup, rename) keep events as events. Transforming commands (stats, chart, timechart, top, rare) replace the event stream with a results table, after which per-event fields like the original _raw are gone."
          keyPoints={[
            "Once you've transformed, you can't go back to raw events later in the same search.",
            "table is technically transforming too: it fixes the column set and order for display.",
            "Order commands with that in mind: do per-event work (eval, where) before you aggregate it away.",
          ]}
          note="If a field you need in a later command has disappeared, the usual cause is a transforming command earlier in the pipeline that didn't carry it forward."
        />
      </div>

      <SectionHeading icon={Wrench} title="Field selection and shaping" />
      <div className="grid md:grid-cols-2 gap-4">
        <ConceptCard
          title="fields, table, dedup"
          description="These three control which fields survive and which events survive, without aggregating anything."
          keyPoints={[
            "fields keeps or drops columns (fields - x,y to drop). table does the same but also fixes display order, and is the one you reach for at the end of a search.",
            "dedup keeps the first event per unique value of its key fields. Sort first if 'first' needs to mean something specific, like most recent.",
            "dedup <field1> <field2> dedups on the combination, not each field independently.",
          ]}
          examples={["| fields - _raw, _time", "| sort -_time | dedup user"]}
        />
        <ConceptCard
          title="rename, sort, fieldformat"
          description="Cosmetic-looking commands with one sharp edge each."
          keyPoints={[
            "After rename old AS new, old no longer exists in the pipeline. A later command referencing it silently matches nothing.",
            "sort -field is descending, +field (or no sign) is ascending. Multiple fields break ties left to right.",
            "fieldformat changes how a value displays, not its underlying type. A field formatted with commas still sorts and sums as a number.",
          ]}
          examples={['| rename src_ip AS "Source IP"', '| fieldformat TotalBytes = tostring(TotalBytes, "commas")']}
        />
      </div>

      <SectionHeading icon={Wrench} title="Aggregation: stats and friends" />
      <div className="grid md:grid-cols-2 gap-4">
        <ConceptCard
          title="The function you actually want"
          description="The most common real-world bug in a stats search is picking the wrong aggregation function, not getting the syntax wrong."
          keyPoints={[
            "count(field) counts events where the field is populated. It is not a sum of the field's values.",
            "dc(field) is distinct count. If one source IP generates 500 events, count(src_ip) is 500 but dc(src_ip) is 1.",
            "values(field) returns distinct values (sorted). list(field) returns every value including duplicates, in roughly event order, and has a size cap.",
            "Combine several functions in one stats command instead of chaining multiple stats calls; by only needs to be stated once.",
          ]}
          examples={["| stats count as Events, dc(src_ip) as UniqueSources, sum(bytes) as TotalBytes by user"]}
        />
        <ConceptCard
          title="Conditional aggregation and totals"
          description="count(eval(...)) lets you split one stats command into several conditional buckets instead of running the search multiple times with different filters."
          keyPoints={[
            'count(eval(action="blocked")) as Blocked counts only matching events, in the same row as any other stats function.',
            "addtotals row=true sums across each row's own columns. col=true adds a summary row that sums down each column. They're independent toggles.",
            "addtotals is most useful right after chart or stats, where there are several numeric columns to total.",
          ]}
          examples={['| stats count(eval(action="blocked")) as Blocked, count(eval(action="allowed")) as Allowed by user']}
        />
      </div>

      <SectionHeading icon={Wrench} title="Transforming and trend commands" />
      <div className="grid md:grid-cols-2 gap-4">
        <ConceptCard
          title="chart vs. timechart vs. stats"
          description="All three aggregate. The difference is the axis."
          keyPoints={[
            "stats: no inherent axis, just a results table grouped by any number of by fields.",
            "chart: a chosen field is the row axis (over), and an optional second field (by) splits into columns, up to two fields total.",
            "timechart: time is always the row axis automatically, and only one by field is allowed.",
            "If you need a trend over time, reach for timechart, not chart over _time.",
          ]}
          examples={["| chart count over action by app", "| timechart span=1h count by app limit=5"]}
        />
        <ConceptCard
          title="top, rare, trendline, timewrap"
          description="Specialized shortcuts that save you from writing the equivalent stats/sort/head by hand."
          keyPoints={[
            "top field limit=N is the N most frequent values, with count and percent columns by default. rare is the same sorted the other way.",
            "top field by group finds the top value(s) within each group, not globally across all events.",
            "trendline sma3(field) smooths a time series with a simple moving average; the first N-1 buckets have no value yet.",
            "timewrap 1w lines up this period against the previous one of the same length, for week-over-week or day-over-day comparison.",
          ]}
          examples={["| top app by user limit=1", "| timechart span=1d count | timewrap 1w"]}
        />
      </div>

      <SectionHeading icon={Wrench} title="Time: epoch, earliest/latest, bin" />
      <div className="grid md:grid-cols-2 gap-4">
        <ConceptCard
          title="How Splunk actually stores time"
          description="_time is Unix epoch seconds under the hood. earliest and latest are search-time modifiers that filter on that value; everything displayed in your configured time zone is a formatting layer on top of it."
          keyPoints={[
            "Pattern: [+/-]<number><unit>@<snap_unit>. The @ snaps down to a boundary instead of just subtracting.",
            "-1h subtracts an hour from now. -1h@h subtracts an hour, then rounds down to the start of that hour. They are usually different timestamps.",
            "m is minutes. mon is months. Confusing them silently changes a 1-minute window into a 1-month one.",
          ]}
          examples={["earliest=-24h latest=now", "earliest=-7d@d latest=@d"]}
        />
        <ConceptCard
          title="bin"
          description="Groups a numeric or time field into fixed-size buckets, overwriting the field's value with its bucket boundary. It does not aggregate anything by itself."
          keyPoints={[
            "| bin span=1h _time followed by | stats count by _time is the manual, two-step version of what timechart does in one.",
            "Works on any numeric field too: | bin bytes span=5000 groups byte counts into bands of 5000.",
            "If a bin'd field looks unchanged, check that the span unit actually matches the field's scale.",
          ]}
        />
      </div>

      <SectionHeading icon={Wrench} title="eval and calculated fields" />
      <div className="grid md:grid-cols-2 gap-4">
        <ConceptCard
          title="eval basics"
          description="Creates or overwrites a field from an expression. Multiple fields can be defined in one eval, separated by commas, and each can reference fields defined earlier in the same command."
          keyPoints={[
            "Arithmetic: + - * / on numeric fields or literals.",
            "String concatenation uses a dot: full = first . \" \" . last.",
            "case(cond1, val1, cond2, val2, ..., 1=1, default) evaluates top to bottom and stops at the first true condition, so order the specific cases before the catch-all.",
            "coalesce(a, b, c) returns the first non-null argument, useful for filling in a default when a field is sometimes missing.",
          ]}
          examples={['| eval risk = case(action="blocked" AND dest_port=22, "High", action="blocked", "Medium", 1=1, "Low")']}
        />
        <ConceptCard
          title="Time functions inside eval"
          description="The four functions that come up constantly, and are easy to mix up under pressure."
          keyPoints={[
            "strftime(epoch, format) turns an epoch value into a readable string.",
            "strptime(string, format) does the reverse: a formatted string back into epoch.",
            "relative_time(epoch, modifier) applies an earliest/latest-style relative expression to a given epoch, not to now specifically.",
            "now() is the search's start time. time() is evaluated per event as the search runs. They're rarely interchangeable.",
          ]}
          examples={['| eval event_time = strftime(_time, "%b %d, %I:%M %p")', '| eval yesterday = relative_time(now(), "-1d@d")']}
        />
      </div>

      <SectionHeading icon={Wrench} title="Geospatial and visualization prep" />
      <div className="grid md:grid-cols-2 gap-4">
        <ConceptCard
          title="iplocation, geostats, geom"
          description="Three separate jobs that get confused for one another: resolving an IP, clustering results geographically, and drawing region boundaries."
          keyPoints={[
            "iplocation <ip field> adds Country/City/lat/lon fields from a geo lookup. Not every IP resolves; private/reserved ranges usually won't.",
            "geostats aggregates events into geographic clusters for a marker map, using latfield/longfield (defaults to lat/lon).",
            "geom <lookup> featureIdField=<field> adds boundary shapes for a choropleth map. The field's values must already match the lookup's feature IDs; geom does not do fuzzy name matching.",
          ]}
          examples={["| iplocation src_ip", "| geostats latfield=lat longfield=lon count"]}
        />
        <ConceptCard
          title="gauge and single-value prep"
          description="These commands don't visualize anything themselves, they just shape the result into something the chosen visualization panel expects."
          keyPoints={[
            "gauge <field> <t0> <t1> <t2> ... needs exactly one summary row. Run stats without a by clause first.",
            "A plain stats sum(...)/count with no by is what feeds a Single Value visualization.",
            "The actual colors, ranges, and chart type are configured in the visualization panel, not in SPL.",
          ]}
          examples={['| stats count(eval(action="blocked")) as Blocked\n| gauge Blocked 0 50 150 300']}
        />
      </div>

      <SectionHeading icon={Wrench} title="Mistakes worth memorizing" />
      <Card>
        <CardContent className="pt-6">
          <ul className="space-y-2">
            {[
              "count(field) counts events, not the field's values. sum(field) adds the values. Mixing these up quietly inflates or deflates a total.",
              "dc(field) is almost always what you want for 'how many unique X', not count(field).",
              "m means minutes, mon means months, in both relative time modifiers and span=.",
              "-1h and -1h@h usually give different timestamps; one subtracts, the other subtracts then snaps to a boundary.",
              "chart can split by two fields (over + by). timechart can only split by one, time is always the other axis.",
              "A field you renamed no longer exists under its old name. A later command referencing the old name returns no match, not an error.",
              "bin alone doesn't count or sum anything. Pair it with stats.",
              "list() keeps duplicates and has a size limit. values() returns only distinct values. They are not interchangeable.",
            ].map((m, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-amber-500 shrink-0">•</span>
                <span className="text-muted-foreground">{m}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 mt-8 p-4 rounded-lg border border-border bg-muted/20">
        <BookOpen className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          For hands-on practice: the{" "}
          <Link href="/tools/spl-builder" className="text-emerald-500 hover:underline">
            SPL Builder
          </Link>{" "}
          chains these commands into a real, combinable pipeline against sample log data and shows the actual
          output at each step. The{" "}
          <Link href="/cheatsheets/splunk-spl" className="text-emerald-500 hover:underline">
            SPL Cheatsheet
          </Link>{" "}
          has the same command surface in a flatter, copy-paste quick-reference format.
        </div>
      </div>
    </div>
  )
}
