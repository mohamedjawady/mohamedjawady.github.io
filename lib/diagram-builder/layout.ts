import { CANVAS_WIDTH, DiagramEdge, DiagramNode } from "./types"

const ROW_HEIGHT = 160
const COL_WIDTH = 190
const TOP_MARGIN = 110

/**
 * Lays out nodes as a tree/forest based on directed edges (source = parent, target = child).
 * Nodes with no incoming edge are treated as roots. Depth comes from BFS distance from a root;
 * x position is the average of a node's children's x (leaves get sequential slots). Shared
 * children and disconnected nodes are handled without crashing, since this operates on a
 * general graph, not a guaranteed tree.
 */
export function autoLayoutTree(nodes: DiagramNode[], edges: DiagramEdge[]): DiagramNode[] {
  if (nodes.length === 0) return nodes

  const nodeIds = new Set(nodes.map((n) => n.id))
  const childrenOf = new Map<string, string[]>()
  const hasParent = new Set<string>()
  for (const e of edges) {
    if (!nodeIds.has(e.source) || !nodeIds.has(e.target)) continue
    if (!childrenOf.has(e.source)) childrenOf.set(e.source, [])
    childrenOf.get(e.source)!.push(e.target)
    hasParent.add(e.target)
  }

  const roots = nodes.filter((n) => !hasParent.has(n.id))
  const rootList = roots.length > 0 ? roots : [nodes[0]]

  const positioned = new Map<string, { x: number; y: number }>()
  const visited = new Set<string>()
  let nextSlot = 0

  function layout(nodeId: string, depth: number): number {
    if (visited.has(nodeId)) {
      return positioned.get(nodeId)?.x ?? nextSlot * COL_WIDTH
    }
    visited.add(nodeId)
    const children = (childrenOf.get(nodeId) || []).filter((c) => nodeIds.has(c))
    let x: number
    if (children.length === 0) {
      x = nextSlot * COL_WIDTH
      nextSlot += 1
    } else {
      const childXs = children.map((c) => layout(c, depth + 1))
      x = childXs.reduce((a, b) => a + b, 0) / childXs.length
    }
    positioned.set(nodeId, { x, y: TOP_MARGIN + depth * ROW_HEIGHT })
    return x
  }

  rootList.forEach((root) => layout(root.id, 0))

  nodes.forEach((n) => {
    if (!positioned.has(n.id)) {
      positioned.set(n.id, { x: nextSlot * COL_WIDTH, y: TOP_MARGIN })
      nextSlot += 1
    }
  })

  const xs = Array.from(positioned.values()).map((p) => p.x)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const offsetX = (CANVAS_WIDTH - (maxX - minX)) / 2 - minX

  return nodes.map((n) => {
    const pos = positioned.get(n.id)!
    return { ...n, x: pos.x + offsetX, y: pos.y }
  })
}
