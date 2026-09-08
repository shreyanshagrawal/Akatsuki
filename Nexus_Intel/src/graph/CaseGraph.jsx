// Nexus_Intel/src/graph/CaseGraph.jsx
import { useCallback, useMemo, useState } from 'react'
import { Background, Controls, ReactFlow } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { crossEdges, rootLinkEdge, suspectTree, victimTree } from './data'
import { buildIndex, degreeColor, degreeOf, degreeSize } from './flatten'
import { layoutSide } from './layout'
import { PersonNode } from './PersonNode'

const VICTIM_COLOR = '#3b82f6'
const VICTIM_ORIGIN = { x: 40, y: 360 }
const SUSPECT_ORIGIN = { x: 1560, y: 360 }

const nodeTypes = { person: PersonNode }

const victimIndex = buildIndex(victimTree)
const suspectIndex = buildIndex(suspectTree)
const byId = { ...victimIndex.byId, ...suspectIndex.byId }
const structuralEdges = [rootLinkEdge, ...crossEdges, ...victimIndex.treeEdges, ...suspectIndex.treeEdges]
const crossEdgeIds = new Set(crossEdges.map((edge) => edge.id))

function collectDescendants(id, acc) {
  acc.add(id)
  for (const childId of byId[id].childIds) collectDescendants(childId, acc)
  return acc
}

function computeVisible(rootId, expandedIds) {
  const visible = new Set([rootId])
  function walk(id) {
    if (!expandedIds.has(id)) return
    for (const childId of byId[id].childIds) {
      visible.add(childId)
      walk(childId)
    }
  }
  walk(rootId)
  return visible
}

export function CaseGraph() {
  const [expandedIds, setExpandedIds] = useState(() => new Set(['v-root', 's-root']))
  const [selectedId, setSelectedId] = useState(null)

  const handleNodeClick = useCallback(
    (id) => {
      const isCurrentlyOpen = selectedId === id
      setSelectedId(isCurrentlyOpen ? null : id)
      setExpandedIds((current) => {
        const next = new Set(current)
        if (isCurrentlyOpen) {
          for (const descendantId of collectDescendants(id, new Set())) next.delete(descendantId)
        } else if (byId[id].childIds.length > 0) {
          next.add(id)
        }
        return next
      })
    },
    [selectedId],
  )

  const visibleIds = useMemo(() => {
    const victimVisible = computeVisible('v-root', expandedIds)
    const suspectVisible = computeVisible('s-root', expandedIds)
    return new Set([...victimVisible, ...suspectVisible])
  }, [expandedIds])

  const suspectDegrees = useMemo(() => {
    const ids = Object.keys(suspectIndex.byId)
    const counts = ids.map((id) => degreeOf(id, structuralEdges))
    return {
      min: Math.min(...counts),
      max: Math.max(...counts),
      byId: Object.fromEntries(ids.map((id, index) => [id, counts[index]])),
    }
  }, [])

  const nodes = useMemo(() => {
    const victimPositions = layoutSide('v-root', byId, expandedIds, 'right')
    const suspectPositions = layoutSide('s-root', byId, expandedIds, 'left')
    return [...visibleIds].map((id) => {
      const node = byId[id]
      const isSuspect = node.side === 'suspect'
      const origin = isSuspect ? SUSPECT_ORIGIN : VICTIM_ORIGIN
      const rel = isSuspect ? suspectPositions[id] : victimPositions[id]
      const degree = isSuspect ? suspectDegrees.byId[id] : 0
      return {
        id,
        type: 'person',
        position: { x: origin.x + rel.x, y: origin.y + rel.y },
        draggable: false,
        selectable: false,
        data: {
          label: node.label,
          kind: node.kind,
          fields: node.fields,
          hasChildren: node.childIds.length > 0,
          isExpanded: expandedIds.has(id),
          isSelected: selectedId === id,
          size: isSuspect ? degreeSize(degree, suspectDegrees.min, suspectDegrees.max) : 56,
          color: isSuspect ? degreeColor(degree, suspectDegrees.min, suspectDegrees.max) : VICTIM_COLOR,
          onToggle: () => handleNodeClick(id),
        },
      }
    })
  }, [visibleIds, expandedIds, selectedId, suspectDegrees, handleNodeClick])

  const edges = useMemo(() => {
    const withHandles = structuralEdges.map((edge) => {
      const sourceIsVictim = byId[edge.source].side === 'victim'
      return { ...edge, sourceHandle: sourceIsVictim ? 's-r' : 's-l', targetHandle: sourceIsVictim ? 't-l' : 't-r' }
    })
    const visibleEdges = withHandles.filter((edge) => visibleIds.has(edge.source) && visibleIds.has(edge.target))
    const touchesSelected = (edge) => edge.source === selectedId || edge.target === selectedId
    const anyEmphasized = selectedId !== null && visibleEdges.some((edge) => crossEdgeIds.has(edge.id) && touchesSelected(edge))

    return visibleEdges.map((edge) => {
      const emphasized = anyEmphasized && crossEdgeIds.has(edge.id) && touchesSelected(edge)
      const dimmed = anyEmphasized && !emphasized
      return {
        ...edge,
        type: 'smoothstep',
        animated: emphasized,
        style: { stroke: emphasized ? '#ef4444' : '#64748b', strokeWidth: emphasized ? 3 : 1.5, opacity: dimmed ? 0.15 : 1 },
        labelStyle: { fill: '#cbd5e1', fontSize: 10 },
      }
    })
  }, [visibleIds, selectedId])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      panOnScroll
      zoomOnScroll
      fitView
    >
      <Background color="#334155" gap={28} />
      <Controls showInteractive={false} />
    </ReactFlow>
  )
}
