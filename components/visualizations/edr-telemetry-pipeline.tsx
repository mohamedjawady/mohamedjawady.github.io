"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SensorLayer {
  id: string
  label: string
  where: string
  colorClass: string
  ringClass: string
  bgClass: string
  borderClass: string
  captures: string
  strength: string
  defeatedBy: string
  attckId: string
}

const layers: SensorLayer[] = [
  {
    id: "usermode-hook",
    label: "Usermode inline hooks",
    where: "ntdll.dll, in the target process",
    colorClass: "bg-amber-500 hover:bg-amber-600",
    ringClass: "ring-amber-400",
    bgClass: "bg-amber-50 dark:bg-amber-950/20",
    borderClass: "border-amber-300 dark:border-amber-700",
    captures: "Function arguments at the Nt*/Zw* boundary, before the syscall instruction executes: file paths, process handles, registry keys, exactly what the calling code passed in.",
    strength: "Cheap to deploy, rich context (the full argument list, not just a raw syscall number), and works identically on every Windows version since it doesn't depend on kernel structures.",
    defeatedBy: "It runs inside the same process it's watching, with the same privilege level as the code it's monitoring. Anything that can read ntdll's own unhooked copy from disk, map a fresh copy, or resolve syscall numbers and issue the syscall instruction directly skips the hook entirely. This is why \"direct syscalls\" (Hell's Gate, Halo's Gate and their descendants) exist as a technique category.",
    attckId: "T1106 Native API",
  },
  {
    id: "etw-ti",
    label: "ETW, especially Threat Intelligence",
    where: "Kernel-side provider, consumed in usermode by the EDR's service",
    colorClass: "bg-emerald-600 hover:bg-emerald-700",
    ringClass: "ring-emerald-400",
    bgClass: "bg-emerald-50 dark:bg-emerald-950/20",
    borderClass: "border-emerald-300 dark:border-emerald-700",
    captures: "Process, thread, image load, and (via the Threat Intelligence provider specifically) memory allocation, protection changes, and remote thread creation, emitted by the kernel itself, not by code running in the monitored process.",
    strength: "The event is generated in the kernel, after the syscall has already happened, so a usermode patch to ntdll has nothing to patch; the hook was never there to begin with. The Threat Intelligence provider in particular exposes fields ordinary ETW consumers can't subscribe to, specifically to make it a harder target.",
    defeatedBy: "The classic technique patches the usermode stub that forwards events to the kernel (historically ntdll!EtwEventWrite) so the forwarding call becomes a no-op, silencing a specific process's own telemetry without touching the kernel provider itself. Needs only usermode code execution in the target process, not a kernel exploit.",
    attckId: "T1562.006 Indicator Blocking",
  },
  {
    id: "kernel-callbacks",
    label: "Kernel notify routines & minifilters",
    where: "Kernel, registered by the EDR's own driver",
    colorClass: "bg-sky-600 hover:bg-sky-700",
    ringClass: "ring-sky-400",
    bgClass: "bg-sky-50 dark:bg-sky-950/20",
    borderClass: "border-sky-300 dark:border-sky-700",
    captures: "Process and thread creation (PsSetCreateProcessNotifyRoutineEx), image loads (PsSetLoadImageNotifyRoutine), registry operations (CmRegisterCallbackEx), handle operations on protected objects like LSASS (ObRegisterCallbacks), and file system I/O (a minifilter registered with FltRegisterFilter).",
    strength: "Runs at the same privilege level as the thing it's watching. ObRegisterCallbacks in particular is what lets an EDR strip PROCESS_VM_READ off a handle being opened to LSASS before the open even completes, turning a credential-dumping attempt into a access-denied error instead of a detection written after the fact.",
    defeatedBy: "Needs kernel code execution to remove, which Driver Signature Enforcement is supposed to prevent. The practical bypass is BYOVD: load a legitimately signed, vulnerable third-party driver and use its own exposed IOCTL to read and patch kernel memory, including unlinking the EDR's own callback from the kernel's notify list.",
    attckId: "T1562.001 Disable or Modify Tools",
  },
]

export function EdrTelemetryPipeline() {
  const [active, setActive] = useState<string | null>("etw-ti")
  const activeLayer = layers.find((l) => l.id === active)

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 my-8">
      <Card className="border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle>Where an EDR Sensor Actually Sits</CardTitle>
          <CardDescription>
            Three places in the OS a sensor can be placed, from easiest to deploy to hardest to blind. Click each one for what it
            captures, why it's used, and the real technique that defeats it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-col gap-2">
            {layers.map((l, i) => (
              <div key={l.id}>
                <motion.button
                  onClick={() => setActive(active === l.id ? null : l.id)}
                  whileTap={{ scale: 0.99 }}
                  whileHover={{ scale: 1.005 }}
                  className={`${l.colorClass} text-white rounded-xl p-4 text-left transition-all duration-200 shadow-sm hover:shadow-md w-full flex items-center justify-between gap-3 ${
                    active === l.id ? `ring-2 ring-offset-1 ${l.ringClass} shadow-lg` : ""
                  }`}
                >
                  <div>
                    <span className="font-bold text-sm leading-tight block">{l.label}</span>
                    <span className="text-[11px] opacity-85 leading-snug">{l.where}</span>
                  </div>
                  <span className="text-[10px] font-mono bg-black/20 rounded px-1.5 py-0.5 shrink-0">{l.attckId.split(" ")[0]}</span>
                </motion.button>
                {i < layers.length - 1 && (
                  <div className="flex justify-center py-1">
                    <span className="text-muted-foreground text-xs" aria-hidden>
                      ↓ closer to the kernel ↓
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <AnimatePresence>
            {activeLayer && (
              <motion.div
                key={activeLayer.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden"
              >
                <div className={`p-5 rounded-xl border-2 ${activeLayer.bgClass} ${activeLayer.borderClass} space-y-4`}>
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h4 className="font-bold text-base">{activeLayer.label}</h4>
                      <p className="text-sm text-muted-foreground">{activeLayer.where}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs font-mono whitespace-nowrap">
                      {activeLayer.attckId}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Captures</div>
                    <p className="text-sm leading-relaxed">{activeLayer.captures}</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-background/60 border border-border/40">
                      <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Why it's used</div>
                      <p className="text-sm leading-relaxed">{activeLayer.strength}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background/60 border border-border/40">
                      <div className="text-[10px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">Defeated by</div>
                      <p className="text-sm leading-relaxed">{activeLayer.defeatedBy}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3 p-4 bg-muted/30 rounded-xl border border-border/30 items-start">
            <div className="w-2 flex-shrink-0 self-stretch rounded-full bg-gradient-to-b from-amber-500 via-emerald-500 to-sky-600" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Core principle</p>
              <p className="text-sm leading-relaxed">
                Every layer down this list is harder for the monitored code to blind, and more expensive for the vendor to get
                right across every Windows build. No real EDR relies on only one; they correlate all three, so that defeating a
                single layer degrades a detection instead of erasing it. A mature detection program assumes the same thing about
                its own telemetry: know which layer each log source comes from, and what evading only that layer would look like.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
