"use client"

import { forwardRef, useCallback, useRef } from "react"
import { CANVAS_HEIGHT, CANVAS_WIDTH, DiagramEdge, DiagramNode, DiagramState } from "@/lib/diagram-builder/types"

export type Selection = { type: "node" | "edge"; id: string } | null

interface DiagramCanvasProps {
  state: DiagramState
  selected: Selection
  connectMode: boolean
  connectFrom: string | null
  themeCss: string
  onSelect: (selection: Selection) => void
  onNodeMove: (id: string, x: number, y: number) => void
  onNodeConnectClick: (id: string) => void
  onBackgroundClick: () => void
}

function wrapLabel(label: string, maxChars: number): string[] {
  const words = label.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let current = ""
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (candidate.length > maxChars && current) {
      lines.push(current)
      current = word
    } else {
      current = candidate
    }
  }
  if (current) lines.push(current)
  return lines.slice(0, 4)
}

function boundaryPoint(node: DiagramNode, dx: number, dy: number) {
  const hw = node.width / 2
  const hh = node.height / 2
  if (dx === 0 && dy === 0) return { x: node.x, y: node.y }
  if (node.shape === "diamond") {
    const denom = Math.abs(dx) / hw + Math.abs(dy) / hh
    const t = denom === 0 ? 0 : 1 / denom
    return { x: node.x + dx * t, y: node.y + dy * t }
  }
  let t: number
  if (dx === 0) t = hh / Math.abs(dy)
  else if (dy === 0) t = hw / Math.abs(dx)
  else t = Math.min(hw / Math.abs(dx), hh / Math.abs(dy))
  return { x: node.x + dx * t, y: node.y + dy * t }
}

function edgeGeometry(edge: DiagramEdge, nodes: DiagramNode[]) {
  const source = nodes.find((n) => n.id === edge.source)
  const target = nodes.find((n) => n.id === edge.target)
  if (!source || !target) return null
  const dx = target.x - source.x
  const dy = target.y - source.y
  if (dx === 0 && dy === 0) return null
  const start = boundaryPoint(source, dx, dy)
  const end = boundaryPoint(target, -dx, -dy)
  return { start, end, mid: { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 } }
}

function colorKey(color: string) {
  return color.replace("#", "")
}

function nodeShapePoints(node: DiagramNode) {
  if (node.shape === "diamond") {
    return `${node.x},${node.y - node.height / 2} ${node.x + node.width / 2},${node.y} ${node.x},${node.y + node.height / 2} ${node.x - node.width / 2},${node.y}`
  }
  return null
}

export const DiagramCanvas = forwardRef<SVGSVGElement, DiagramCanvasProps>(function DiagramCanvas(
  { state, selected, connectMode, connectFrom, themeCss, onSelect, onNodeMove, onNodeConnectClick, onBackgroundClick },
  ref
) {
  const dragState = useRef<{ id: string; offsetX: number; offsetY: number; pointerId: number } | null>(null)
  const localRef = useRef<SVGSVGElement | null>(null)

  const setRefs = useCallback(
    (node: SVGSVGElement | null) => {
      localRef.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) (ref as React.MutableRefObject<SVGSVGElement | null>).current = node
    },
    [ref]
  )

  const toSvgPoint = useCallback((clientX: number, clientY: number) => {
    const svg = localRef.current
    if (!svg) return { x: 0, y: 0 }
    const rect = svg.getBoundingClientRect()
    const scaleX = CANVAS_WIDTH / rect.width
    const scaleY = CANVAS_HEIGHT / rect.height
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY }
  }, [])

  const handleNodePointerDown = (e: React.PointerEvent, node: DiagramNode) => {
    e.stopPropagation()
    if (connectMode) {
      onNodeConnectClick(node.id)
      return
    }
    onSelect({ type: "node", id: node.id })
    const p = toSvgPoint(e.clientX, e.clientY)
    dragState.current = { id: node.id, offsetX: p.x - node.x, offsetY: p.y - node.y, pointerId: e.pointerId }
    ;(e.target as Element).setPointerCapture(e.pointerId)
  }

  const handleNodePointerMove = (e: React.PointerEvent) => {
    const drag = dragState.current
    if (!drag || drag.pointerId !== e.pointerId) return
    const p = toSvgPoint(e.clientX, e.clientY)
    const nx = Math.max(0, Math.min(CANVAS_WIDTH, p.x - drag.offsetX))
    const ny = Math.max(0, Math.min(CANVAS_HEIGHT, p.y - drag.offsetY))
    onNodeMove(drag.id, nx, ny)
  }

  const handleNodePointerUp = (e: React.PointerEvent) => {
    if (dragState.current?.pointerId === e.pointerId) {
      dragState.current = null
    }
  }

  const uniqueColors = Array.from(new Set(state.edges.map((edge) => edge.color)))

  return (
    <svg
      ref={setRefs}
      viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
      className="w-full h-auto touch-none select-none"
      style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`, background: "#ffffff" }}
      onPointerDown={() => {
        onBackgroundClick()
      }}
    >
      <defs>
        {uniqueColors.map((color) => (
          <marker
            key={color}
            id={`arrow-${colorKey(color)}`}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
          </marker>
        ))}
        {themeCss && <style>{themeCss}</style>}
      </defs>

      <rect
        className="ctidiag-canvas-bg"
        x={0}
        y={0}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        fill="#ffffff"
        stroke="#e2e8f0"
        strokeWidth={2}
      />

      {/* Edges */}
      {state.edges.map((edge) => {
        const geo = edgeGeometry(edge, state.nodes)
        if (!geo) return null
        const isSelected = selected?.type === "edge" && selected.id === edge.id
        return (
          <g key={edge.id}>
            <line
              x1={geo.start.x}
              y1={geo.start.y}
              x2={geo.end.x}
              y2={geo.end.y}
              stroke="transparent"
              strokeWidth={16}
              style={{ cursor: "pointer" }}
              onPointerDown={(e) => {
                e.stopPropagation()
                onSelect({ type: "edge", id: edge.id })
              }}
            />
            <line
              className={`ctidiag-edge${edge.dashed ? " ctidiag-edge--dashed" : ""}`}
              x1={geo.start.x}
              y1={geo.start.y}
              x2={geo.end.x}
              y2={geo.end.y}
              stroke={edge.color}
              strokeWidth={2}
              strokeDasharray={edge.dashed ? "6 5" : undefined}
              markerEnd={edge.directed ? `url(#arrow-${colorKey(edge.color)})` : undefined}
              pointerEvents="none"
            />
            {isSelected && (
              <line
                x1={geo.start.x}
                y1={geo.start.y}
                x2={geo.end.x}
                y2={geo.end.y}
                stroke="#0ea5e9"
                strokeWidth={2}
                strokeDasharray="4 4"
                pointerEvents="none"
              />
            )}
            {edge.label && (
              <g pointerEvents="none">
                <rect
                  className="ctidiag-edge-label-bg"
                  x={geo.mid.x - (edge.label.length * 3.4 + 8)}
                  y={geo.mid.y - 10}
                  width={edge.label.length * 6.8 + 16}
                  height={20}
                  fill="#ffffff"
                  opacity={0.9}
                  rx={4}
                />
                <text
                  className="ctidiag-edge-label"
                  x={geo.mid.x}
                  y={geo.mid.y + 4}
                  textAnchor="middle"
                  fontSize={11}
                  fill="#475569"
                  fontFamily="var(--font-mono, monospace)"
                >
                  {edge.label}
                </text>
              </g>
            )}
          </g>
        )
      })}

      {/* Nodes */}
      {state.nodes.map((node) => {
        const isSelected = selected?.type === "node" && selected.id === node.id
        const isConnectSource = connectFrom === node.id
        const lines = wrapLabel(node.label, node.shape === "diamond" ? 14 : 18)
        const lineHeight = 15
        const startY = node.y - ((lines.length - 1) * lineHeight) / 2
        const points = nodeShapePoints(node)

        return (
          <g
            key={node.id}
            onPointerDown={(e) => handleNodePointerDown(e, node)}
            onPointerMove={handleNodePointerMove}
            onPointerUp={handleNodePointerUp}
            style={{ cursor: connectMode ? "crosshair" : "grab" }}
          >
            {points ? (
              <polygon
                className={`ctidiag-node ctidiag-node--${node.kind}`}
                points={points}
                fill={node.color}
                stroke={node.textColor}
                strokeWidth={1.5}
              />
            ) : (
              <rect
                className={`ctidiag-node ctidiag-node--${node.kind}`}
                x={node.x - node.width / 2}
                y={node.y - node.height / 2}
                width={node.width}
                height={node.height}
                rx={10}
                fill={node.color}
                stroke={node.textColor}
                strokeWidth={1.5}
              />
            )}
            {(isSelected || isConnectSource) &&
              (points ? (
                <polygon
                  points={points}
                  fill="none"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  strokeDasharray={isConnectSource ? "5 3" : undefined}
                />
              ) : (
                <rect
                  x={node.x - node.width / 2}
                  y={node.y - node.height / 2}
                  width={node.width}
                  height={node.height}
                  rx={10}
                  fill="none"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  strokeDasharray={isConnectSource ? "5 3" : undefined}
                />
              ))}
            <text
              className="ctidiag-node-text"
              textAnchor="middle"
              fontSize={13}
              fontWeight={600}
              fill={node.textColor}
              fontFamily="var(--font-sans, sans-serif)"
            >
              {lines.map((line, i) => (
                <tspan key={i} x={node.x} y={startY + i * lineHeight}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        )
      })}
    </svg>
  )
})
