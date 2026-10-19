"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PipelineStageInfo {
  id: string
  label: string
  spl: string
  colorClass: string
  ringClass: string
  bgClass: string
  borderClass: string
  runsOn: string
  fieldsNote: string
  detail: string
  fieldsBefore: string[]
  fieldsAfter: string[]
}

const stages: PipelineStageInfo[] = [
  {
    id: "base",
    label: "Base search",
    spl: 'index=botsv1 sourcetype="stream:http" dest_ip="192.168.250.70"',
    colorClass: "bg-slate-700 hover:bg-slate-800",
    ringClass: "ring-slate-400",
    bgClass: "bg-slate-50 dark:bg-slate-950/30",
    borderClass: "border-slate-300 dark:border-slate-700",
    runsOn: "Indexers (distributed)",
    fieldsNote: "Full raw event + every indexed and extracted field",
    detail:
      "Everything before the first pipe is retrieval, not transformation. Splunk uses index, sourcetype, and the time range to decide which buckets and .tsidx files to even open, then applies the remaining field=value terms as it reads events off disk. This is why a vague base search (no index, no sourcetype, no time bound) is slow: it has to open far more data before it can discard any of it. Nothing here can be undone later; an event excluded by the base search never exists for the rest of the pipeline.",
    fieldsBefore: [],
    fieldsAfter: ["_time", "_raw", "host", "source", "sourcetype", "src_ip", "dest_ip", "http_method", "uri_path", "status", "form_data", "…every other extracted field"],
  },
  {
    id: "nontransforming",
    label: "Non-transforming commands",
    spl: "| rex field=form_data \"passwd=(?<pw>[^&]+)\" | eval kb=round(bytes/1024,2) | where len(pw)=6 | sort 0 -_time",
    colorClass: "bg-emerald-600 hover:bg-emerald-700",
    ringClass: "ring-emerald-400",
    bgClass: "bg-emerald-50 dark:bg-emerald-950/20",
    borderClass: "border-emerald-300 dark:border-emerald-700",
    runsOn: "Search head (streaming, event-by-event)",
    fieldsNote: "Still every field; these only add, filter, or reorder events",
    detail:
      "eval, rex, where, search, sort, dedup, fields, and rename are non-transforming: each one looks at one event at a time (or, for sort/dedup, the whole set) and passes events through, not a summary. rex and eval can only ADD fields, never remove the ones already there. This is also the \"streaming\" phase: on a distributed deployment, commands like eval, where, and rex can run partly on the indexers themselves, before results even reach the search head, which is a major reason they're cheap. dedup and sort are not streaming: they need to see every event at once, so they must run on the search head.",
    fieldsBefore: ["_time", "_raw", "src_ip", "dest_ip", "http_method", "form_data", "bytes", "…"],
    fieldsAfter: ["_time", "_raw", "src_ip", "dest_ip", "http_method", "form_data", "bytes", "pw", "kb", "…"],
  },
  {
    id: "transforming",
    label: "First transforming command",
    spl: "| stats count dc(src_ip) AS distinct_src BY http_method",
    colorClass: "bg-amber-500 hover:bg-amber-600",
    ringClass: "ring-amber-400",
    bgClass: "bg-amber-50 dark:bg-amber-950/20",
    borderClass: "border-amber-300 dark:border-amber-700",
    runsOn: "Search head (collapses the event stream)",
    fieldsNote: "Only the fields this command explicitly names survive",
    detail:
      "stats, chart, timechart, top, rare, and table are transforming: they replace the event stream with a results table containing only the fields they were told to produce. This is the single most common source of \"my field disappeared\" bugs. _raw, _time (unless grouped on), and every extracted field not named in the BY clause or the function list are gone the instant this command runs: not hidden, gone. There is no command that restores them afterward; the only fix is to capture what you need (with eval, or by naming it in BY) before this stage runs.",
    fieldsBefore: ["_time", "_raw", "src_ip", "dest_ip", "http_method", "form_data", "bytes", "pw", "kb", "…"],
    fieldsAfter: ["http_method", "count", "distinct_src"],
  },
  {
    id: "after",
    label: "Everything after a transform",
    spl: "| rename distinct_src AS \"Unique Sources\" | sort - count | fieldformat count=tostring(count,\"commas\")",
    colorClass: "bg-violet-600 hover:bg-violet-700",
    ringClass: "ring-violet-400",
    bgClass: "bg-violet-50 dark:bg-violet-950/20",
    borderClass: "border-violet-300 dark:border-violet-700",
    runsOn: "Search head, on the collapsed table",
    fieldsNote: "Operates only on the transforming command's output fields",
    detail:
      "Once a transforming command has run, every later command, even a non-transforming one like rename, sort, or fieldformat, only has the reduced field set to work with. This is why \"rename field X, then where field=X\" fails silently after a stats: the rename already happened, but if X was never in the stats output in the first place, there was nothing to rename, and no error is raised. Always ask \"did the last transforming command keep this field?\" before debugging anything downstream of one.",
    fieldsBefore: ["http_method", "count", "distinct_src"],
    fieldsAfter: ["http_method", "count", "Unique Sources"],
  },
]

export function SplPipelineOrder() {
  const [active, setActive] = useState<string | null>("base")
  const activeStage = stages.find((s) => s.id === active)

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 my-8">
      <Card className="border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle>Order of SPL Evaluation: Commands and Transforms</CardTitle>
          <CardDescription>
            A search is a strict left-to-right pipeline. Click each stage to see what runs where, and exactly which
            fields survive into the next one.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            {stages.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2 flex-1">
                <motion.button
                  onClick={() => setActive(active === s.id ? null : s.id)}
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.01 }}
                  className={`${s.colorClass} text-white rounded-xl p-3 text-left transition-all duration-200 shadow-sm hover:shadow-md flex-1 min-h-[88px] flex flex-col justify-between gap-1.5 ${
                    active === s.id ? `ring-2 ring-offset-1 ${s.ringClass} shadow-lg` : ""
                  }`}
                >
                  <span className="font-bold text-xs leading-tight">{s.label}</span>
                  <span className="text-[10px] font-mono opacity-80 leading-snug break-all">{s.spl}</span>
                </motion.button>
                {i < stages.length - 1 && (
                  <span className="hidden sm:block text-muted-foreground text-lg shrink-0" aria-hidden>
                    →
                  </span>
                )}
              </div>
            ))}
          </div>

          <AnimatePresence>
            {activeStage && (
              <motion.div
                key={activeStage.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden"
              >
                <div className={`p-5 rounded-xl border-2 ${activeStage.bgClass} ${activeStage.borderClass} space-y-4`}>
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h4 className="font-bold text-base">{activeStage.label}</h4>
                      <p className="text-sm text-muted-foreground">Runs on: {activeStage.runsOn}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs font-semibold whitespace-nowrap">
                      {activeStage.fieldsNote}
                    </Badge>
                  </div>
                  <p className="text-sm leading-relaxed">{activeStage.detail}</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-background/60 border border-border/40">
                      <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Fields going in</div>
                      <div className="flex flex-wrap gap-1.5">
                        {activeStage.fieldsBefore.length === 0 ? (
                          <span className="text-xs text-muted-foreground italic">(nothing yet, this is the start)</span>
                        ) : (
                          activeStage.fieldsBefore.map((f) => (
                            <Badge key={f} variant="outline" className="text-xs font-mono">
                              {f}
                            </Badge>
                          ))
                        )}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-background/60 border border-border/40">
                      <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Fields coming out</div>
                      <div className="flex flex-wrap gap-1.5">
                        {activeStage.fieldsAfter.map((f) => (
                          <Badge key={f} variant="outline" className="text-xs font-mono">
                            {f}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3 p-4 bg-muted/30 rounded-xl border border-border/30 items-start">
            <div className="w-2 flex-shrink-0 self-stretch rounded-full bg-gradient-to-b from-slate-600 via-amber-500 to-violet-600" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Core principle</p>
              <p className="text-sm leading-relaxed">
                Retrieval happens once, at the base search. Non-transforming commands only ever add to or filter what
                came out of retrieval. The moment a transforming command runs, the field set resets to exactly what
                that command named, and every command after it inherits that smaller set, forever. Debugging a search
                is almost always a matter of finding which side of that line a missing field fell on.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
