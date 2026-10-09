"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Stage {
  id: string
  label: string
  field: string
  desc: string
}

const stages: Stage[] = [
  {
    id: "header",
    label: "pcHeader",
    field: "magic = 0xfffffff1",
    desc: "The fixed 72-byte struct this whole chain starts from. Located by scanning for its magic number, then validated via pad1/pad2 (must be 0) and ptrSize (must be 4 or 8).",
  },
  {
    id: "functab",
    label: "functab[]",
    field: "pcHeader + pclnOffset",
    desc: "An array of nfunc entries, each { entryoff uint32, funcoff uint32 }. entryoff is a function's start PC relative to textStart; funcoff points to that function's _func struct.",
  },
  {
    id: "_func",
    label: "_func",
    field: "pclntab base + funcoff",
    desc: "Per-function metadata. The field this post's parser reads is nameOff, an index into funcnametab. Real _func also carries args size, pcsp/pcfile/pcln tables, and more.",
  },
  {
    id: "funcname",
    label: "funcnametab",
    field: "pcHeader + funcnameOffset",
    desc: "A flat buffer of NUL-terminated strings. nameOff from _func indexes directly into this buffer to recover the actual function name, e.g. \"main.checkLicense\".",
  },
]

export function PclntabStructureDiagram() {
  const [active, setActive] = useState(0)

  return (
    <div className="w-full max-w-4xl mx-auto my-8 not-prose">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-mono text-lg">Walking PCLNTAB to a Function Name</CardTitle>
          <CardDescription>
            The four-hop chain the parser in this post follows, every offset relative to where the header was found. Click a stage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap items-center gap-1">
            {stages.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <button
                  onClick={() => setActive(i)}
                  className={cn(
                    "px-3 py-2 rounded-lg border text-sm font-mono transition-colors",
                    active === i
                      ? "border-emerald-500/60 bg-emerald-500/10 text-foreground"
                      : "border-border bg-muted/20 text-muted-foreground hover:border-border hover:text-foreground",
                  )}
                >
                  {s.label}
                </button>
                {i < stages.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-muted-foreground/40 mx-1 shrink-0" />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={stages[active].id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="rounded-lg border border-border bg-muted/20 p-4"
            >
              <div className="font-mono text-xs text-emerald-600 dark:text-emerald-400 mb-1">
                {stages[active].field}
              </div>
              <div className="font-semibold text-sm mb-2">{stages[active].label}</div>
              <p className="text-sm text-muted-foreground leading-relaxed">{stages[active].desc}</p>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}
