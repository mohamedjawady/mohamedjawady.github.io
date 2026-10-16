import { ShieldOff, Zap } from "lucide-react"

export function ICSTacticCompare() {
  return (
    <div className="w-full my-8 not-prose">
      <div className="rounded-lg border border-border p-4">
        <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">
          Two Ways to Break an Industrial Process
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-md border border-amber-500/40 bg-amber-500/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldOff className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <div className="text-sm font-semibold">Inhibit Response Function</div>
            </div>
            <div className="text-xs font-mono text-amber-600 dark:text-amber-400 mb-2">TA0107</div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Disable the safety net. The process itself isn&apos;t touched, what would have caught a problem with it is.
            </p>
            <div className="rounded border border-border bg-background/60 p-2.5">
              <div className="text-xs font-mono text-muted-foreground mb-0.5">TRITON / TRISIS, 2017</div>
              <div className="text-xs text-muted-foreground">T0800: Activate Firmware Update Mode against a Triconex Safety Instrumented System</div>
            </div>
          </div>

          <div className="rounded-md border border-red-500/40 bg-red-500/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
              <div className="text-sm font-semibold">Impair Process Control</div>
            </div>
            <div className="text-xs font-mono text-red-600 dark:text-red-400 mb-2">TA0106</div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Push the process directly. The safety net isn&apos;t touched, the thing it was watching over is manipulated outright.
            </p>
            <div className="rounded border border-border bg-background/60 p-2.5">
              <div className="text-xs font-mono text-muted-foreground mb-0.5">Industroyer2, 2022</div>
              <div className="text-xs text-muted-foreground">T0855: Unauthorized Command Message to open Ukrainian grid substation breakers</div>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4 text-center italic">
          TRITON removed the net without touching the tightrope walker. Industroyer2 pushed the tightrope walker without touching the net.
        </p>
      </div>
    </div>
  )
}
