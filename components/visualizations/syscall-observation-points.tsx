"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Capability = "block" | "record" | "none"

interface ObservationPoint {
  id: string
  step: string
  label: string
  zone: "usermode" | "boundary" | "kernel" | "agent"
  api: string
  sees: string
  capability: Capability
  capabilityNote: string
  evadedBy: string
}

const points: ObservationPoint[] = [
  {
    id: "win32",
    step: "1",
    label: "The Win32 call",
    zone: "usermode",
    api: "kernelbase!VirtualAllocEx",
    sees: "Nothing, as far as security is concerned. This layer is a thin forwarder that validates a few arguments and calls the native API below it. Some products do hook here as well, but it is the weakest possible placement: a program can simply call the native API one level down and never touch it.",
    capability: "none",
    capabilityNote:
      "No sensor worth counting. Treat telemetry that claims to come from this layer as a convenience, not a control.",
    evadedBy: "Calling the Nt* native API directly, which every loader already does.",
  },
  {
    id: "ntdll",
    step: "2",
    label: "The ntdll syscall stub",
    zone: "usermode",
    api: "ntdll!NtAllocateVirtualMemory",
    sees: "The complete argument list, in the form the calling code actually built it: target process handle, base address, region size, and the requested page protection. This is the richest view any layer gets, because after this point the arguments become register values and kernel structures.",
    capability: "block",
    capabilityNote:
      "Can block, by returning a failure status instead of calling through. This is real prevention, but prevention enforced by code running at the same privilege as the thing it is policing.",
    evadedBy:
      "Direct and indirect syscalls. The stub is only a few instructions that load a syscall number and execute syscall; code that knows the number can issue the instruction itself and never execute the patched bytes.",
  },
  {
    id: "transition",
    step: "3",
    label: "The syscall instruction",
    zone: "boundary",
    api: "syscall / KiSystemCall64",
    sees: "This is the privilege boundary, not a sensor. Control transfers to the kernel through the MSR-configured entry point. There is no third-party extension point here: no supported way for a driver to interpose on the syscall path itself.",
    capability: "none",
    capabilityNote:
      "Nothing to place here. This matters because it is exactly why everything above it is bypassable and everything below it is not.",
    evadedBy:
      "Not applicable. Nothing above this line can stop code from crossing it; the question is only what is waiting on the other side.",
  },
  {
    id: "etwti",
    step: "4",
    label: "ETW Threat Intelligence",
    zone: "kernel",
    api: "nt!EtwTiLogAllocExecVm",
    sees: "The operation as the kernel performed it, emitted from inside the kernel implementation. For this call specifically, an allocation carrying an executable protection. Sibling functions cover the rest of the injection primitives: EtwTiLogProtectExecVm for protection changes, EtwTiLogReadWriteVm for cross-process reads and writes, and EtwTiLogInsertQueueUserApc for APC queueing. On current builds these events can carry the originating call stack.",
    capability: "record",
    capabilityNote:
      "Records only. The event is emitted from within the operation, so by the time a consumer reads it from the session buffer the memory is already allocated. Excellent for detection, structurally incapable of prevention.",
    evadedBy:
      "Not reachable from usermode: the provider is registered by the kernel, so patching ntdll!EtwEventWrite does nothing to it. Silencing it requires kernel code execution. Note the consumer-side constraint instead: only a process running as Protected Process Light Anti-Malware can subscribe at all.",
  },
  {
    id: "obcallback",
    step: "5",
    label: "Object manager callback",
    zone: "kernel",
    api: "ObRegisterCallbacks (pre-operation)",
    sees: "Handle creation and duplication against registered object types, with the requested access mask, before the handle is returned. This is the layer that fires when something opens a handle to LSASS, and the pre-operation callback can rewrite the desired access to drop rights such as PROCESS_VM_READ.",
    capability: "block",
    capabilityNote:
      "Can block, and this is the one placement where blocking is both reliable and cheap. The caller receives a handle that simply cannot do the thing it wanted, with no downstream detection logic required. Only the pre-operation callback can modify access; the post-operation structure is informational.",
    evadedBy:
      "Kernel code execution, typically through a vulnerable signed driver used to unlink the callback entry. Also worth knowing its scope limit: registration is only permitted for process, thread, and desktop object types, which is why files and registry keys need entirely separate mechanisms.",
  },
  {
    id: "notify",
    step: "6",
    label: "Notify routines and the minifilter",
    zone: "kernel",
    api: "PsSetCreateProcessNotifyRoutineEx, CmRegisterCallbackEx, FltRegisterFilter",
    sees: "The lifecycle events that give an agent its structural picture: process and thread creation, image loads, registry writes, and file system I/O. This is where the process tree comes from, and the process tree is what makes any single event interpretable.",
    capability: "block",
    capabilityNote:
      "Can block in several cases. The Ex form of the process-creation callback can refuse a process by setting a failure status, and a minifilter can fail a file operation outright.",
    evadedBy:
      "Kernel code execution again. The callbacks live in finite, enumerable kernel arrays, which is precisely what driver-assisted callback removal walks and unlinks.",
  },
  {
    id: "agent",
    step: "7",
    label: "Correlation, local then cloud",
    zone: "agent",
    api: "The agent service and the vendor backend",
    sees: "Sequences rather than events. One executable allocation is noise; an executable allocation into a remote process, followed by a cross-process write, followed by a thread created at that address, within milliseconds, is an injection. Nothing below this point can make that judgement, because no single sensor sees the whole shape.",
    capability: "record",
    capabilityNote:
      "Cannot block the original operation, because it has already completed. Can still act, by killing the process or isolating the host, which is response rather than prevention.",
    evadedBy:
      "Operating slowly enough, or in a shape unusual enough, to stay under the correlation thresholds. This is the layer that is tuned rather than bypassed.",
  },
]

const zoneStyles: Record<
  ObservationPoint["zone"],
  { button: string; ring: string; panel: string; border: string; tag: string }
> = {
  usermode: {
    button: "bg-amber-500 hover:bg-amber-600",
    ring: "ring-amber-400",
    panel: "bg-amber-50 dark:bg-amber-950/20",
    border: "border-amber-300 dark:border-amber-700",
    tag: "Usermode",
  },
  boundary: {
    button: "bg-zinc-600 hover:bg-zinc-700",
    ring: "ring-zinc-400",
    panel: "bg-zinc-50 dark:bg-zinc-900/40",
    border: "border-zinc-300 dark:border-zinc-700",
    tag: "Privilege boundary",
  },
  kernel: {
    button: "bg-sky-600 hover:bg-sky-700",
    ring: "ring-sky-400",
    panel: "bg-sky-50 dark:bg-sky-950/20",
    border: "border-sky-300 dark:border-sky-700",
    tag: "Kernel",
  },
  agent: {
    button: "bg-violet-600 hover:bg-violet-700",
    ring: "ring-violet-400",
    panel: "bg-violet-50 dark:bg-violet-950/20",
    border: "border-violet-300 dark:border-violet-700",
    tag: "Agent",
  },
}

const capabilityStyles: Record<Capability, { label: string; className: string }> = {
  block: {
    label: "Can block",
    className: "bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/40",
  },
  record: {
    label: "Records only",
    className: "bg-amber-600/15 text-amber-700 dark:text-amber-400 border-amber-500/40",
  },
  none: {
    label: "No sensor",
    className: "bg-zinc-600/15 text-zinc-700 dark:text-zinc-400 border-zinc-500/40",
  },
}

export function SyscallObservationPoints() {
  const [active, setActive] = useState<string | null>("etwti")
  const activePoint = points.find((p) => p.id === active)
  const activeStyle = activePoint ? zoneStyles[activePoint.zone] : null

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 my-8">
      <Card className="border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle>One Allocation, Every Sensor That Sees It</CardTitle>
          <CardDescription>
            A single call to allocate executable memory in another process, traced from the application down to the vendor
            backend. Click any point for what it sees, whether it can actually stop the operation or only record it, and what
            gets past it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-col gap-1.5">
            {points.map((p, i) => {
              const style = zoneStyles[p.zone]
              const cap = capabilityStyles[p.capability]
              const prev = i > 0 ? points[i - 1] : null
              const crossesBoundary = prev !== null && prev.zone !== "kernel" && p.zone === "kernel"

              return (
                <div key={p.id}>
                  {crossesBoundary && (
                    <div className="flex items-center gap-2 py-2" aria-hidden>
                      <div className="h-px flex-1 bg-border" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Usermode code can no longer reach below this line
                      </span>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                  )}
                  <motion.button
                    onClick={() => setActive(active === p.id ? null : p.id)}
                    whileTap={{ scale: 0.99 }}
                    whileHover={{ scale: 1.005 }}
                    className={`${style.button} text-white rounded-xl p-3.5 text-left transition-all duration-200 shadow-sm hover:shadow-md w-full flex items-center gap-3 ${
                      active === p.id ? `ring-2 ring-offset-1 ${style.ring} shadow-lg` : ""
                    }`}
                  >
                    <span className="text-[11px] font-mono bg-black/25 rounded w-6 h-6 flex items-center justify-center shrink-0">
                      {p.step}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="font-bold text-sm leading-tight block">{p.label}</span>
                      <span className="text-[11px] opacity-85 leading-snug font-mono break-all">{p.api}</span>
                    </span>
                    <span className="text-[10px] font-semibold bg-black/25 rounded px-1.5 py-0.5 shrink-0 whitespace-nowrap">
                      {cap.label}
                    </span>
                  </motion.button>
                </div>
              )
            })}
          </div>

          <AnimatePresence>
            {activePoint && activeStyle && (
              <motion.div
                key={activePoint.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden"
              >
                <div className={`p-5 rounded-xl border-2 ${activeStyle.panel} ${activeStyle.border} space-y-4`}>
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <h4 className="font-bold text-base">
                        {activePoint.step}. {activePoint.label}
                      </h4>
                      <p className="text-sm text-muted-foreground font-mono break-all">{activePoint.api}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs whitespace-nowrap">
                        {activeStyle.tag}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs whitespace-nowrap ${capabilityStyles[activePoint.capability].className}`}
                      >
                        {capabilityStyles[activePoint.capability].label}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      What it sees
                    </div>
                    <p className="text-sm leading-relaxed">{activePoint.sees}</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-background/60 border border-border/40">
                      <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                        Block or record
                      </div>
                      <p className="text-sm leading-relaxed">{activePoint.capabilityNote}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background/60 border border-border/40">
                      <div className="text-[10px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">
                        What gets past it
                      </div>
                      <p className="text-sm leading-relaxed">{activePoint.evadedBy}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3 p-4 bg-muted/30 rounded-xl border border-border/30 items-start">
            <div className="w-2 flex-shrink-0 self-stretch rounded-full bg-gradient-to-b from-amber-500 via-zinc-500 to-violet-600" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Core principle</p>
              <p className="text-sm leading-relaxed">
                Only two points on this path can stop the operation: the usermode stub, which the operation can route around,
                and the object manager callback, which it cannot. Everything else is a recorder. That split is the whole reason
                prevention and detection are separate conversations: an agent can be perfectly informed about an action it was
                never in a position to prevent, which is also the normal outcome for anything ETW-sourced.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
