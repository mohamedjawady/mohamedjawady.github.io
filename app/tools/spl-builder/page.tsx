import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Database, FileCode } from "lucide-react"
import { SplPipelineBuilder } from "@/components/tools/spl-pipeline-builder"
import { DATASETS } from "@/lib/spl-pipeline"
import { getCanonicalUrl } from "@/lib/url"

export const metadata: Metadata = {
  title: "Splunk SPL Builder | Mohamed Habib Jaouadi",
  description:
    "Write or paste real SPL, or build a pipeline command by command, against sample security log data in a Splunk-style search console. Chain field selection, stats, transforming commands, eval, and geospatial commands, and see the actual output at every stage.",
  openGraph: {
    title: "Splunk SPL Builder | Mohamed Habib Jaouadi",
    description:
      "Write or paste real SPL, or build a pipeline command by command, against sample security log data in a Splunk-style search console. Chain field selection, stats, transforming commands, eval, and geospatial commands, and see the actual output at every stage.",
    url: getCanonicalUrl("/tools/spl-builder"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Splunk SPL Builder | Mohamed Habib Jaouadi",
    description:
      "Write or paste real SPL, or build a pipeline command by command, against sample security log data in a Splunk-style search console. Chain field selection, stats, transforming commands, eval, and geospatial commands, and see the actual output at every stage.",
  },
}

export default function SplBuilderPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link
        href="/tools"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-emerald-500 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Tools
      </Link>

      <div className="mb-8">
        <h1 className="font-serif text-4xl md:text-5xl mb-4">Splunk SPL Builder</h1>
        <p className="text-muted-foreground text-lg">
          Pick a dataset, then either type or paste a real SPL query into the search bar and click Run, or build the
          same pipeline command by command with the guided editors below it, fields, stats, chart, eval, iplocation,
          and more. Both ways stay in sync: edit the text and the guided view updates, or click through the guided
          editors and watch the query text write itself. Every stage is a real transform over the previous one's
          output, so the SPL and the results table are always consistent with each other. Everything runs locally in
          your browser; nothing is uploaded, and no Splunk instance is required.
        </p>
      </div>

      <SplPipelineBuilder />

      <div className="mt-16 pt-10 border-t border-border">
        <h2 className="text-2xl font-bold font-mono mb-2">Annex: Indices and Sourcetypes</h2>
        <p className="text-muted-foreground mb-6">
          Every search in this builder, and in real Splunk, starts with <code className="bg-muted px-1.5 py-0.5 rounded text-sm">index=&hellip; sourcetype=&hellip;</code>.
          The two look similar as search terms, but they answer different questions and are configured in different
          places.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-emerald-500" />
              <h3 className="font-semibold">index</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Where the data physically lives. An index is a separate repository on disk, with its own retention
              period, storage location, and access controls.
            </p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li className="flex gap-2"><span className="text-emerald-500 shrink-0">&bull;</span>Set at ingest time, by the input or forwarder that sends the data in.</li>
              <li className="flex gap-2"><span className="text-emerald-500 shrink-0">&bull;</span>Used to segregate data by team, retention requirement, or sensitivity, e.g. a 7-day index for firewall noise vs. a 2-year index for authentication logs.</li>
              <li className="flex gap-2"><span className="text-emerald-500 shrink-0">&bull;</span>Role-based access control is usually applied at the index level: an analyst's role can be scoped to only the indices they're allowed to search.</li>
              <li className="flex gap-2"><span className="text-emerald-500 shrink-0">&bull;</span><code className="bg-muted px-1 rounded">index=*</code> or omitting <code className="bg-muted px-1 rounded">index=</code> entirely searches every index the user has access to, which is almost always more expensive than naming one.</li>
            </ul>
          </div>

          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileCode className="w-4 h-4 text-emerald-500" />
              <h3 className="font-semibold">sourcetype</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              What format the data is in. The sourcetype tells Splunk how to parse an event: where the timestamp
              is, how to break raw text into lines, and which field extractions apply.
            </p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li className="flex gap-2"><span className="text-emerald-500 shrink-0">&bull;</span>Drives timestamp recognition and line-breaking rules, usually defined in <code className="bg-muted px-1 rounded">props.conf</code>.</li>
              <li className="flex gap-2"><span className="text-emerald-500 shrink-0">&bull;</span>Determines which automatic field extractions and CIM data model mappings apply to an event.</li>
              <li className="flex gap-2"><span className="text-emerald-500 shrink-0">&bull;</span>Is a property of the data's format, not its storage, so the same sourcetype can legitimately appear across several indices.</li>
              <li className="flex gap-2"><span className="text-emerald-500 shrink-0">&bull;</span>A wrong or generic sourcetype (<code className="bg-muted px-1 rounded">_json</code>, <code className="bg-muted px-1 rounded">syslog</code>) is one of the most common reasons fields fail to extract the way a dashboard or detection expects.</li>
            </ul>
          </div>
        </div>

        <div className="rounded-lg border border-border p-4 mb-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">In one line:</strong> index is about where and how long; sourcetype is
            about what shape. A search like <code className="bg-muted px-1.5 py-0.5 rounded">index=firewall sourcetype=pan_traffic</code> narrows
            to one storage bucket, then to one event format inside it. Changing the index wouldn't change how an
            event parses; changing the sourcetype wouldn't change where it's stored or who can search it.
          </p>
        </div>

        <h3 className="font-semibold mb-3">The four sample sources used by this builder</h3>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-3 py-2 text-left font-semibold">index</th>
                <th className="px-3 py-2 text-left font-semibold">sourcetype</th>
                <th className="px-3 py-2 text-left font-semibold">What it represents</th>
                <th className="px-3 py-2 text-left font-semibold">Fields</th>
              </tr>
            </thead>
            <tbody>
              {DATASETS.map((d) => (
                <tr key={d.id} className="border-b border-border/50 last:border-0">
                  <td className="px-3 py-2 font-mono text-xs whitespace-nowrap align-top">{d.index}</td>
                  <td className="px-3 py-2 font-mono text-xs whitespace-nowrap align-top">{d.sourcetype}</td>
                  <td className="px-3 py-2 text-muted-foreground align-top">{d.description}</td>
                  <td className="px-3 py-2 text-muted-foreground align-top">
                    <span className="font-mono text-xs">{d.fields.join(", ")}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
