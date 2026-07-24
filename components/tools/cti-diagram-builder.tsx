"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { DiagramCanvas, Selection } from "@/components/tools/diagram-canvas"
import { DiagramToolbar } from "@/components/tools/diagram-toolbar"
import { DiagramSidePanel } from "@/components/tools/diagram-side-panel"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Maximize, ZoomIn, ZoomOut } from "lucide-react"
import { exportRaster, exportSvg } from "@/lib/svg-export"
import { diamondModelBlock, getPreset, killChainBlock } from "@/lib/diagram-builder/presets"
import { CANVAS_HEIGHT, CANVAS_WIDTH, createEdge, createNode, DiagramMode, DiagramState, NodeKind } from "@/lib/diagram-builder/types"
import { CUSTOM_CSS_CLASS_REFERENCE, getTheme } from "@/lib/diagram-builder/themes"

const MIN_ZOOM = 0.4
const MAX_ZOOM = 3

function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "diagram"
  )
}

function clampZoom(z: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z))
}

export function CtiDiagramBuilder() {
  const [mode, setMode] = useState<DiagramMode>("kill-chain")
  const [state, setState] = useState<DiagramState>(() => getPreset("kill-chain"))
  const [selected, setSelected] = useState<Selection>(null)
  const [connectMode, setConnectMode] = useState(false)
  const [connectFrom, setConnectFrom] = useState<string | null>(null)
  const [themeId, setThemeId] = useState("light")
  const [customCss, setCustomCss] = useState("")
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })

  const svgRef = useRef<SVGSVGElement | null>(null)
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const panState = useRef<{ pointerId: number; startX: number; startY: number; startPan: { x: number; y: number } } | null>(null)

  const selectedNode = useMemo(
    () => (selected?.type === "node" ? state.nodes.find((n) => n.id === selected.id) ?? null : null),
    [selected, state.nodes]
  )
  const selectedEdge = useMemo(
    () => (selected?.type === "edge" ? state.edges.find((e) => e.id === selected.id) ?? null : null),
    [selected, state.edges]
  )

  const themeCss = themeId === "custom" ? customCss : getTheme(themeId).css

  const resetView = useCallback(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [])

  const handleModeChange = (newMode: DiagramMode) => {
    const hasContent = state.nodes.length > 0
    if (hasContent && typeof window !== "undefined") {
      const ok = window.confirm("Switching templates replaces the current canvas. Continue?")
      if (!ok) return
    }
    setMode(newMode)
    setState(getPreset(newMode))
    setSelected(null)
    setConnectFrom(null)
    setConnectMode(false)
    resetView()
  }

  const handleAddNode = (kind: NodeKind) => {
    const jitter = () => Math.random() * 80 - 40
    const node = createNode(kind, CANVAS_WIDTH / 2 + jitter(), CANVAS_HEIGHT / 2 + jitter())
    setState((s) => ({ ...s, nodes: [...s.nodes, node] }))
    setSelected({ type: "node", id: node.id })
  }

  const handleInsertBlock = (block: "diamond-model" | "kill-chain") => {
    setState((s) => {
      const maxY = s.nodes.reduce((max, n) => Math.max(max, n.y + n.height / 2), 0)
      const insertY = s.nodes.length === 0 ? (block === "diamond-model" ? 400 : 140) : Math.min(maxY + 140, CANVAS_HEIGHT - 120)
      const generated =
        block === "diamond-model"
          ? diamondModelBlock(CANVAS_WIDTH / 2, insertY, 170)
          : killChainBlock(CANVAS_WIDTH / 2, insertY, CANVAS_WIDTH - 70)
      return { ...s, nodes: [...s.nodes, ...generated.nodes], edges: [...s.edges, ...generated.edges] }
    })
  }

  const handleNodeMove = useCallback((id: string, x: number, y: number) => {
    setState((s) => ({
      ...s,
      nodes: s.nodes.map((n) => (n.id === id ? { ...n, x, y } : n)),
    }))
  }, [])

  const handleToggleConnect = () => {
    setConnectMode((c) => !c)
    setConnectFrom(null)
  }

  const handleNodeConnectClick = useCallback(
    (id: string) => {
      if (!connectMode) return
      if (!connectFrom) {
        setConnectFrom(id)
        return
      }
      if (connectFrom === id) {
        setConnectFrom(null)
        return
      }
      setState((s) => ({ ...s, edges: [...s.edges, createEdge(connectFrom, id)] }))
      setConnectFrom(null)
    },
    [connectMode, connectFrom]
  )

  const handleDeleteSelected = useCallback(() => {
    if (!selected) return
    setState((s) => {
      if (selected.type === "node") {
        return {
          ...s,
          nodes: s.nodes.filter((n) => n.id !== selected.id),
          edges: s.edges.filter((e) => e.source !== selected.id && e.target !== selected.id),
        }
      }
      return { ...s, edges: s.edges.filter((e) => e.id !== selected.id) }
    })
    setSelected(null)
  }, [selected])

  const handleReset = () => {
    if (typeof window !== "undefined") {
      const ok = window.confirm("Reset the canvas back to the template default? Unsaved changes will be lost.")
      if (!ok) return
    }
    setState(getPreset(mode))
    setSelected(null)
    setConnectFrom(null)
    setConnectMode(false)
    resetView()
  }

  const handleUpdateNode = (id: string, patch: Partial<(typeof state.nodes)[number]>) => {
    setState((s) => ({ ...s, nodes: s.nodes.map((n) => (n.id === id ? { ...n, ...patch } : n)) }))
  }

  const handleUpdateEdge = (id: string, patch: Partial<(typeof state.edges)[number]>) => {
    setState((s) => ({ ...s, edges: s.edges.map((e) => (e.id === id ? { ...e, ...patch } : e)) }))
  }

  const handleBackgroundClick = () => {
    setSelected(null)
    setConnectFrom(null)
  }

  const handleExport = async (format: "svg" | "png" | "jpeg") => {
    const svg = svgRef.current
    if (!svg) return
    const filename = `${slugify(state.title)}.${format}`
    if (format === "svg") {
      exportSvg(svg, filename)
    } else {
      await exportRaster(svg, format, filename, CANVAS_WIDTH, CANVAS_HEIGHT)
    }
  }

  const zoomAtPoint = useCallback((factor: number, clientX?: number, clientY?: number) => {
    setZoom((prevZoom) => {
      const newZoom = clampZoom(prevZoom * factor)
      const viewport = viewportRef.current
      if (viewport) {
        const rect = viewport.getBoundingClientRect()
        const px = clientX ?? rect.left + rect.width / 2
        const py = clientY ?? rect.top + rect.height / 2
        const localX = px - rect.left
        const localY = py - rect.top
        setPan((prevPan) => {
          const contentX = (localX - prevPan.x) / prevZoom
          const contentY = (localY - prevPan.y) / prevZoom
          return { x: localX - contentX * newZoom, y: localY - contentY * newZoom }
        })
      }
      return newZoom
    })
  }, [])

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const factor = e.deltaY > 0 ? 0.9 : 1.1
    zoomAtPoint(factor, e.clientX, e.clientY)
  }

  const handleViewportPointerDown = (e: React.PointerEvent) => {
    if (connectMode) return
    panState.current = { pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, startPan: pan }
    ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
  }

  const handleViewportPointerMove = (e: React.PointerEvent) => {
    const drag = panState.current
    if (!drag || drag.pointerId !== e.pointerId) return
    setPan({ x: drag.startPan.x + (e.clientX - drag.startX), y: drag.startPan.y + (e.clientY - drag.startY) })
  }

  const handleViewportPointerUp = (e: React.PointerEvent) => {
    if (panState.current?.pointerId === e.pointerId) {
      panState.current = null
    }
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      const isEditable = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable
      if (isEditable) return
      if ((e.key === "Delete" || e.key === "Backspace") && selected) {
        e.preventDefault()
        handleDeleteSelected()
      }
      if (e.key === "Escape") {
        setConnectMode(false)
        setConnectFrom(null)
        setSelected(null)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [selected, handleDeleteSelected])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Input
            value={state.title}
            onChange={(e) => setState((s) => ({ ...s, title: e.target.value }))}
            className="text-lg font-semibold font-mono h-auto py-1.5 max-w-md border-transparent bg-transparent px-0 hover:border-input focus-visible:border-input"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {connectMode
            ? connectFrom
              ? "Click a target node to complete the connection."
              : "Click a node to start a connection."
            : "Drag nodes to reposition. Drag empty space to pan, scroll to zoom."}
        </p>
      </div>

      <DiagramToolbar
        mode={mode}
        connectMode={connectMode}
        hasSelection={selected !== null}
        themeId={themeId}
        onModeChange={handleModeChange}
        onAddNode={handleAddNode}
        onInsertBlock={handleInsertBlock}
        onToggleConnect={handleToggleConnect}
        onDeleteSelected={handleDeleteSelected}
        onReset={handleReset}
        onExport={handleExport}
        onThemeChange={setThemeId}
      />

      {themeId === "custom" && (
        <div className="rounded-lg border border-border/60 p-4 space-y-2">
          <Label htmlFor="custom-css">Custom CSS</Label>
          <Textarea
            id="custom-css"
            rows={5}
            placeholder={".ctidiag-node--adversary { fill: #fee2e2; stroke: #b91c1c; }"}
            value={customCss}
            onChange={(e) => setCustomCss(e.target.value)}
            className="font-mono text-xs"
          />
          <p className="text-xs text-muted-foreground">
            Targetable classes: {CUSTOM_CSS_CLASS_REFERENCE.join(" · ")}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        <div
          ref={viewportRef}
          className="relative rounded-lg border border-border/60 overflow-hidden bg-muted/10 touch-none"
          style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}
          onWheel={handleWheel}
          onPointerDown={handleViewportPointerDown}
          onPointerMove={handleViewportPointerMove}
          onPointerUp={handleViewportPointerUp}
        >
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "0 0",
              width: "100%",
              height: "100%",
            }}
          >
            <DiagramCanvas
              ref={svgRef}
              state={state}
              selected={selected}
              connectMode={connectMode}
              connectFrom={connectFrom}
              themeCss={themeCss}
              onSelect={setSelected}
              onNodeMove={handleNodeMove}
              onNodeConnectClick={handleNodeConnectClick}
              onBackgroundClick={handleBackgroundClick}
            />
          </div>

          <div
            className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md border border-border/60 bg-background/90 backdrop-blur px-1.5 py-1 shadow-sm"
            onPointerDown={(e) => e.stopPropagation()}
          >

            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => zoomAtPoint(0.85)} title="Zoom out">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span data-testid="zoom-level" className="text-xs font-mono w-10 text-center text-muted-foreground">
              {Math.round(zoom * 100)}%
            </span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => zoomAtPoint(1 / 0.85)} title="Zoom in">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={resetView} title="Center / reset view">
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <DiagramSidePanel
          node={selectedNode}
          edge={selectedEdge}
          onUpdateNode={handleUpdateNode}
          onUpdateEdge={handleUpdateEdge}
        />
      </div>
    </div>
  )
}
