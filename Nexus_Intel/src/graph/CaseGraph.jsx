// Nexus_Intel/src/graph/CaseGraph.jsx
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Background, Controls, MarkerType, MiniMap, ReactFlow, ReactFlowProvider, useStore } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { RotateCcw } from 'lucide-react'
import { getCaseGraphData } from './caseRegistry'
import { buildIndex } from './flatten'
import { layoutRadialCluster } from './layout'
import { PersonNode } from './PersonNode'
import { EntityInspector } from './EntityInspector'

const VICTIM_CENTER = { x: 420, y: 460 }
const SUSPECT_CENTER = { x: 1360, y: 460 }

const nodeTypes = { person: PersonNode }

function nodeSize(kind) {
  return kind === 'root' ? 68 : kind === 'category' ? 48 : 40
}

function collectDescendants(id, byId, acc) {
  acc.add(id)
  if (byId[id]?.childIds) {
    for (const childId of byId[id].childIds) collectDescendants(childId, byId, acc)
  }
  return acc
}

function computeVisible(rootId, byId, expandedIds) {
  const visible = new Set([rootId])
  function walk(id) {
    if (!expandedIds.has(id) || !byId[id]) return
    for (const childId of byId[id].childIds) {
      visible.add(childId)
      walk(childId)
    }
  }
  walk(rootId)
  return visible
}

function pickHandles(sourcePos, targetPos) {
  if (!sourcePos || !targetPos) return { sourceHandle: 's-r', targetHandle: 't-l' }
  const dx = targetPos.x - sourcePos.x
  const dy = targetPos.y - sourcePos.y

  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx > 0 ? { sourceHandle: 's-r', targetHandle: 't-l' } : { sourceHandle: 's-l', targetHandle: 't-r' }
  }
  return dy > 0 ? { sourceHandle: 's-b', targetHandle: 't-t' } : { sourceHandle: 's-t', targetHandle: 't-b' }
}

export function CaseGraph({ caseId = 'CAS-2026-1140' }) {
  return (
    <ReactFlowProvider key={caseId}>
      <CaseGraphCanvas caseId={caseId} />
    </ReactFlowProvider>
  )
}

function CaseGraphCanvas({ caseId }) {
  const wrapperRef = useRef(null)
  const [containerSize, setContainerSize] = useState(null)

  const caseGraphData = useMemo(() => getCaseGraphData(caseId), [caseId])
  const victimIndex = useMemo(() => buildIndex(caseGraphData.victimTree), [caseGraphData])
  const suspectIndex = useMemo(() => buildIndex(caseGraphData.suspectTree), [caseGraphData])
  const byId = useMemo(() => ({ ...victimIndex.byId, ...suspectIndex.byId }), [victimIndex, suspectIndex])

  const structuralEdges = useMemo(() => [
    caseGraphData.rootLinkEdge,
    ...caseGraphData.crossEdges,
    ...victimIndex.treeEdges,
    ...suspectIndex.treeEdges,
  ], [caseGraphData, victimIndex, suspectIndex])

  const crossEdgeIds = useMemo(
    () => new Set([caseGraphData.rootLinkEdge.id, ...caseGraphData.crossEdges.map((edge) => edge.id)]),
    [caseGraphData],
  )

  const [expandedIds, setExpandedIds] = useState(() => {
    if (caseId === 'CAS-2026-1140') {
      return new Set(['v-hriday', 's-akshay', 'v-comms', 's-transport', 's-accomplice', 'v-spoof'])
    }
    return new Set(['v-root', 's-root', 's-financial', 'v-financial', 'v-fir'])
  })
  const [selectedId, setSelectedId] = useState(null)
  const [draggedPositions, setDraggedPositions] = useState({})

  // Live viewport transform so the popover stays pinned to its node
  const transform = useStore((state) => state.transform)

  useEffect(() => {
    const element = wrapperRef.current
    if (!element) return
    const observer = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect
      if (box) setContainerSize({ width: box.width, height: box.height })
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const handleToggleExpand = useCallback((id) => {
    if (!byId[id] || byId[id].childIds.length === 0) return
    setExpandedIds((current) => {
      const next = new Set(current)
      if (current.has(id)) {
        for (const descendantId of collectDescendants(id, byId, new Set())) next.delete(descendantId)
      } else {
        next.add(id)
      }
      return next
    })
  }, [byId])

  const handleSelectNode = useCallback((id) => {
    setSelectedId((current) => (current === id ? null : id))
  }, [])

  const handleNodeDrag = useCallback((_, node) => {
    setDraggedPositions((prev) => ({ ...prev, [node.id]: node.position }))
  }, [])

  const handleNodeDragStop = useCallback((_, node) => {
    setDraggedPositions((prev) => ({ ...prev, [node.id]: node.position }))
  }, [])

  const resetNodePositions = useCallback(() => setDraggedPositions({}), [])

  const visibleIds = useMemo(() => {
    const victimVisible = computeVisible(caseGraphData.victimTree.id, byId, expandedIds)
    const suspectVisible = computeVisible(caseGraphData.suspectTree.id, byId, expandedIds)
    return new Set([...victimVisible, ...suspectVisible])
  }, [caseGraphData, byId, expandedIds])

  const linkedId = useMemo(() => {
    if (!selectedId) return null
    const edge = structuralEdges.find(
      (candidate) => crossEdgeIds.has(candidate.id) && (candidate.source === selectedId || candidate.target === selectedId),
    )
    if (!edge) return null
    return edge.source === selectedId ? edge.target : edge.source
  }, [selectedId, structuralEdges, crossEdgeIds])

  const inspectedEntity = useMemo(() => (selectedId && byId[selectedId]) || null, [selectedId, byId])

  const connectedEntities = useMemo(() => {
    if (!selectedId || !byId[selectedId]) return []
    const results = []
    const seen = new Set()
    const push = (id, relationship) => {
      if (!byId[id] || seen.has(id)) return
      seen.add(id)
      results.push({ id, label: byId[id].label, side: byId[id].side, relationship })
    }

    const current = byId[selectedId]
    if (current.parentId) push(current.parentId, 'Parent branch')
    for (const childId of current.childIds) push(childId, 'Child record')
    for (const edge of structuralEdges) {
      if (!crossEdgeIds.has(edge.id)) continue
      if (edge.source === selectedId) push(edge.target, edge.label || 'Cross-link')
      else if (edge.target === selectedId) push(edge.source, edge.label || 'Cross-link')
    }
    return results
  }, [selectedId, byId, structuralEdges, crossEdgeIds])

  const defaultPositions = useMemo(() => {
    const vRootId = caseGraphData.victimTree.id
    const sRootId = caseGraphData.suspectTree.id
    const victimPositions = layoutRadialCluster(vRootId, byId, expandedIds, 'victim')
    const suspectPositions = layoutRadialCluster(sRootId, byId, expandedIds, 'suspect')
    const positions = {}
    for (const [id, pos] of Object.entries(victimPositions)) {
      positions[id] = { x: VICTIM_CENTER.x + pos.x, y: VICTIM_CENTER.y + pos.y }
    }
    for (const [id, pos] of Object.entries(suspectPositions)) {
      positions[id] = { x: SUSPECT_CENTER.x + pos.x, y: SUSPECT_CENTER.y + pos.y }
    }
    return positions
  }, [caseGraphData, byId, expandedIds])

  const nodePositions = useMemo(() => {
    const merged = { ...defaultPositions }
    for (const [id, pos] of Object.entries(draggedPositions)) {
      if (merged[id]) merged[id] = pos
    }
    return merged
  }, [defaultPositions, draggedPositions])

  // Container-relative screen point for the selected node, tracking pan/zoom
  const anchor = useMemo(() => {
    if (!selectedId || !byId[selectedId]) return null
    const pos = nodePositions[selectedId]
    if (!pos) return null
    const half = nodeSize(byId[selectedId].kind) / 2
    const [tx, ty, zoom] = transform
    return { x: (pos.x + half) * zoom + tx, y: (pos.y + half) * zoom + ty, r: half * zoom }
  }, [selectedId, byId, nodePositions, transform])

  const nodes = useMemo(() => {
    return [...visibleIds].map((id) => {
      const node = byId[id]
      if (!node) return null
      const size = nodeSize(node.kind)
      return {
        id,
        type: 'person',
        position: nodePositions[id] || { x: 0, y: 0 },
        width: size,
        height: size,
        draggable: true,
        selectable: true,
        zIndex: selectedId === id ? 50 : node.kind === 'root' ? 30 : 10,
        data: {
          id,
          label: node.label,
          kind: node.kind,
          side: node.side,
          fields: node.fields,
          avatar: node.avatar || null,
          hasChildren: node.childIds.length > 0,
          isExpanded: expandedIds.has(id),
          isSelected: selectedId === id,
          isLinked: id === linkedId,
          onSelect: () => handleSelectNode(id),
          onToggleExpand: () => handleToggleExpand(id),
        },
      }
    }).filter(Boolean)
  }, [visibleIds, byId, nodePositions, selectedId, expandedIds, linkedId, handleSelectNode, handleToggleExpand])

  const edges = useMemo(() => {
    const visibleEdges = structuralEdges.filter((edge) => visibleIds.has(edge.source) && visibleIds.has(edge.target))
    const touchesSelected = (edge) => edge.source === selectedId || edge.target === selectedId
    const anyEmphasized = selectedId !== null && visibleEdges.some((edge) => crossEdgeIds.has(edge.id) && touchesSelected(edge))

    return visibleEdges.map((edge) => {
      const isCross = crossEdgeIds.has(edge.id)
      const emphasized = touchesSelected(edge)
      const dimmed = anyEmphasized && !emphasized
      const handles = pickHandles(nodePositions[edge.source], nodePositions[edge.target])

      if (isCross) {
        return {
          ...edge,
          ...handles,
          type: 'default',
          animated: true,
          style: {
            stroke: emphasized ? '#b91c1c' : '#c0362c',
            strokeWidth: emphasized ? 3.2 : 2.2,
            strokeDasharray: '6 4',
            opacity: dimmed ? 0.2 : 0.95,
          },
          markerEnd: { type: MarkerType.ArrowClosed, color: emphasized ? '#b91c1c' : '#c0362c', width: 14, height: 14 },
          labelStyle: {
            fill: '#7f1d1d',
            fontSize: 10.5,
            fontWeight: 600,
            fontFamily: 'JetBrains Mono, monospace',
            opacity: dimmed ? 0.2 : 1,
          },
          labelBgStyle: { fill: '#fef2f2', stroke: '#fca5a5', strokeWidth: 1, rx: 6, ry: 6, opacity: dimmed ? 0.2 : 1 },
          labelBgPadding: [6, 4],
        }
      }

      return {
        ...edge,
        ...handles,
        type: 'default',
        animated: false,
        markerEnd: { type: MarkerType.ArrowClosed, color: emphasized ? '#171511' : '#b8b2a7', width: 11, height: 11 },
        style: {
          stroke: emphasized ? '#171511' : '#b8b2a7',
          strokeWidth: emphasized ? 2.5 : 1.5,
          opacity: dimmed ? 0.2 : 0.85,
        },
      }
    })
  }, [structuralEdges, visibleIds, selectedId, crossEdgeIds, nodePositions])

  const hasCustomPositions = Object.keys(draggedPositions).length > 0

  return (
    <div ref={wrapperRef} className="relative h-full w-full overflow-hidden bg-[#fbf9f5]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
        onNodeDrag={handleNodeDrag}
        onNodeDragStop={handleNodeDragStop}
        onNodeClick={() => {}}
        onPaneClick={() => setSelectedId(null)}
        panOnScroll
        zoomOnScroll
        fitView
        fitViewOptions={{ padding: 0.18 }}
        minZoom={0.3}
        maxZoom={1.6}
      >
        <Background color="#dfdad0" gap={24} size={1.2} />
        <Controls
          showInteractive={false}
          className="!overflow-hidden !rounded-xl !border !border-[#e5e0d8] !bg-white !shadow-sm [&>button]:!border-b [&>button]:!border-[#e5e0d8] [&>button]:!text-[#171511] hover:[&>button]:!bg-[#faf7f2]"
          style={{ bottom: 125, left: 14 }}
        />
        <MiniMap
          nodeColor={(n) => (n.data?.side === 'suspect' ? '#c0362c' : '#1e3a5f')}
          nodeStrokeColor="#ffffff"
          nodeStrokeWidth={2}
          maskColor="rgba(245, 241, 234, 0.72)"
          className="!overflow-hidden !rounded-xl !border !border-[#e5e0d8] !bg-white !shadow-md"
          position="bottom-left"
          style={{ left: 14, bottom: 14, width: 145, height: 95 }}
        />
      </ReactFlow>

      {hasCustomPositions && (
        <button
          onClick={resetNodePositions}
          className="animate-rise-in absolute left-3 top-3 z-20 flex items-center gap-1.5 rounded-full border border-[#e5e0d8] bg-white px-3 py-1.5 text-xs font-medium text-[#171511] shadow-sm transition hover:bg-[#faf7f2] active:scale-95"
          title="Reset dragged nodes back to their orbit"
        >
          <RotateCcw className="size-3" />
          Reset radial layout
        </button>
      )}

      {inspectedEntity && (
        <EntityInspector
          entity={inspectedEntity}
          connectedEntities={connectedEntities}
          anchor={anchor}
          containerSize={containerSize}
          onClose={() => setSelectedId(null)}
          onSelectEntity={(id) => {
            setSelectedId(id)
            setExpandedIds((current) => new Set([...current, id]))
          }}
        />
      )}
    </div>
  )
}
