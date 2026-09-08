// Nexus_Intel/src/graph/CytoscapeGraph.jsx
import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import cytoscape from 'cytoscape'
import {
  Activity,
  Compass,
  GitFork,
  Maximize2,
  Minimize2,
  RefreshCw,
  Route,
  Zap,
} from 'lucide-react'
import { getCaseGraphData } from './caseRegistry'
import { buildIndex } from './flatten'
import { layoutRadialCluster } from './layout'
import { EntityInspector } from './EntityInspector'

// Each case branch is laid out inside its own half of the canvas
function halves(cy) {
  const width = cy.width() || 1300
  const height = cy.height() || 800
  const half = width * 0.44
  return {
    height,
    victim: { x1: 0, y1: 0, w: half, h: height },
    suspect: { x1: width - half, y1: 0, w: half, h: height },
  }
}

function runClusterLayout(cy, caseGraphData, byId) {
  if (!cy || !caseGraphData || !byId) return
  const width = cy.width() || 1300
  const height = cy.height() || 800
  const vCenter = { x: width * 0.28, y: height * 0.5 }
  const sCenter = { x: width * 0.72, y: height * 0.5 }

  const vRoot = caseGraphData.victimTree.id
  const sRoot = caseGraphData.suspectTree.id
  const allIds = new Set(Object.keys(byId))

  const vPos = layoutRadialCluster(vRoot, byId, allIds, 'victim')
  const sPos = layoutRadialCluster(sRoot, byId, allIds, 'suspect')

  cy.batch(() => {
    for (const [id, pos] of Object.entries(vPos)) {
      const node = cy.$id(id)
      if (node && !node.empty()) {
        node.position({ x: vCenter.x + pos.x, y: vCenter.y + pos.y })
      }
    }
    for (const [id, pos] of Object.entries(sPos)) {
      const node = cy.$id(id)
      if (node && !node.empty()) {
        node.position({ x: sCenter.x + pos.x, y: sCenter.y + pos.y })
      }
    }
  })

  cy.fit(undefined, 65)
}

function runPhysicsLayout(cy) {
  const box = halves(cy)
  const options = {
    name: 'cose',
    animate: false,
    nodeDimensionsIncludeLabels: true,
    idealEdgeLength: () => 95,
    nodeRepulsion: () => 12000,
    padding: 24,
  }

  cy.nodes('[side = "victim"]').layout({ ...options, boundingBox: box.victim }).run()
  cy.nodes('[side = "suspect"]').layout({ ...options, boundingBox: box.suspect }).run()
  cy.fit(undefined, 55)
}

export function CytoscapeGraph({ caseId = 'CAS-2026-1140', caseItem = null }) {
  const containerRef = useRef(null)
  const cyRef = useRef(null)
  const selectedIdRef = useRef(null)
  const [selectedId, setSelectedId] = useState(null)
  const [anchor, setAnchor] = useState(null)
  const [containerSize, setContainerSize] = useState(null)
  const [activeLayout, setActiveLayout] = useState('clusters')
  const [activeAlgorithm, setActiveAlgorithm] = useState(null)
  const [analyticsStats, setAnalyticsStats] = useState(null)

  const caseGraphData = useMemo(() => getCaseGraphData(caseId, caseItem), [caseId, caseItem])
  const victimIndex = useMemo(() => buildIndex(caseGraphData.victimTree), [caseGraphData])
  const suspectIndex = useMemo(() => buildIndex(caseGraphData.suspectTree), [caseGraphData])
  const byId = useMemo(() => ({ ...victimIndex.byId, ...suspectIndex.byId }), [victimIndex, suspectIndex])

  const allEdges = useMemo(() => [
    caseGraphData.rootLinkEdge,
    ...caseGraphData.crossEdges,
    ...victimIndex.treeEdges,
    ...suspectIndex.treeEdges,
  ], [caseGraphData, victimIndex, suspectIndex])

  useEffect(() => {
    selectedIdRef.current = selectedId
  }, [selectedId])

  // Keep popover pinned to its node through pans, zooms, and drags
  const syncAnchor = useCallback(() => {
    const cy = cyRef.current
    const id = selectedIdRef.current
    if (!cy || !id) return setAnchor(null)
    const node = cy.$id(id)
    if (!node || node.empty()) return setAnchor(null)
    const point = node.renderedPosition()
    setAnchor({ x: point.x, y: point.y, r: node.renderedWidth() / 2 })
  }, [])

  const selectNode = useCallback((id) => {
    setSelectedId(id)
    selectedIdRef.current = id
    syncAnchor()
  }, [syncAnchor])

  useEffect(() => {
    if (!containerRef.current) return

    const elements = [
      ...Object.values(byId).map((node) => {
        const isSuspect = node.side === 'suspect'
        const isRoot = node.kind === 'root'
        const isCategory = node.kind === 'category'
        const hasAvatar = Boolean(node.avatar)

        return {
          group: 'nodes',
          data: {
            id: node.id,
            label: node.label,
            kind: node.kind,
            side: node.side,
            fields: node.fields,
            avatar: node.avatar || null,
            size: isRoot ? 74 : hasAvatar ? 56 : isCategory ? 52 : 38,
            bgColor: isSuspect
              ? isRoot
                ? '#c0362c'
                : isCategory
                  ? '#e08a1e'
                  : '#f0a95c'
              : isRoot
                ? '#1e3a5f'
                : isCategory
                  ? '#2f7fc4'
                  : '#8fbde4',
            borderColor: isSuspect ? '#991b1b' : '#0f172a',
          },
        }
      }),
      ...(() => {
        const crossOffsets = [-30, -10, 10, 30]
        let crossSeen = 0
        return allEdges.map((edge) => {
          const isCross = edge.id.startsWith('e-cross') || edge.id.startsWith('e-1140') || edge.id === 'e-root-link'
          const labelOffset = isCross ? crossOffsets[crossSeen++ % crossOffsets.length] : 0
          return {
            group: 'edges',
            data: {
              id: edge.id,
              source: edge.source,
              target: edge.target,
              label: edge.label || '',
              isCross,
              labelOffset,
            },
          }
        })
      })(),
    ]

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      minZoom: 0.35,
      maxZoom: 2.2,
      style: [
        {
          selector: 'node',
          style: {
            'width': 'data(size)',
            'height': 'data(size)',
            'background-color': 'data(bgColor)',
            'border-width': 3,
            'border-color': '#ffffff',
            'label': 'data(label)',
            'font-size': '11px',
            'font-weight': 500,
            'font-family': 'Plus Jakarta Sans, sans-serif',
            'color': '#171511',
            'text-valign': 'bottom',
            'text-margin-y': 8,
            'text-wrap': 'wrap',
            'text-max-width': '120px',
            'text-background-color': '#fbf9f5',
            'text-background-opacity': 0.92,
            'text-background-padding': '3px',
            'text-background-shape': 'roundrectangle',
            'transition-property': 'background-color, line-color, target-arrow-color, width, height, border-color, border-width',
            'transition-duration': '0.25s',
          },
        },
        {
          selector: 'node[avatar]',
          style: {
            'background-image': 'data(avatar)',
            'background-fit': 'cover',
            'background-clip': 'node',
            'border-width': 3.5,
            'border-color': '#ffffff',
          },
        },
        {
          selector: 'node[kind = "root"]',
          style: {
            'font-family': 'Newsreader, Georgia, serif',
            'font-size': '15px',
            'font-weight': 'bold',
            'border-width': 4,
            'text-margin-y': 10,
          },
        },
        {
          selector: 'node[kind = "category"]',
          style: { 'font-size': '12px', 'font-weight': 600 },
        },
        {
          selector: 'node:selected',
          style: { 'border-width': 5, 'border-color': '#171511' },
        },
        {
          selector: 'node.highlighted',
          style: { 'border-width': 5, 'border-color': '#c0362c' },
        },
        {
          selector: 'edge',
          style: {
            'width': 1.8,
            'line-color': '#c4bdb1',
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': '#c4bdb1',
            'arrow-scale': 0.85,
            'opacity': 0.9,
            'transition-property': 'line-color, target-arrow-color, width, opacity',
            'transition-duration': '0.25s',
          },
        },
        {
          selector: 'edge[?isCross]',
          style: {
            'width': 2.6,
            'line-color': '#c0362c',
            'line-style': 'dashed',
            'target-arrow-color': '#c0362c',
            'label': 'data(label)',
            'font-size': '10px',
            'font-family': 'JetBrains Mono, monospace',
            'font-weight': 600,
            'color': '#7f1d1d',
            'text-background-color': '#fef2f2',
            'text-background-opacity': 1,
            'text-background-padding': '4px',
            'text-background-shape': 'roundrectangle',
            'text-border-color': '#fca5a5',
            'text-border-width': 1,
            'text-border-opacity': 1,
            'text-margin-y': 'data(labelOffset)',
            'z-index': 20,
          },
        },
        {
          selector: 'edge.highlighted',
          style: {
            'width': 3.6,
            'line-color': '#b91c1c',
            'target-arrow-color': '#b91c1c',
            'opacity': 1,
            'z-index': 99,
          },
        },
        { selector: '.dimmed', style: { 'opacity': 0.15 } },
      ],
      layout: { name: 'preset' },
    })

    cy.on('tap', 'node', (event) => {
      const id = event.target.id()
      selectedIdRef.current = id
      setSelectedId(id)
      const point = event.target.renderedPosition()
      setAnchor({ x: point.x, y: point.y, r: event.target.renderedWidth() / 2 })
    })

    cy.on('tap', (event) => {
      if (event.target === cy) {
        selectedIdRef.current = null
        setSelectedId(null)
        setAnchor(null)
      }
    })

    cy.on('pan zoom', syncAnchor)
    cy.on('position', 'node', syncAnchor)

    cyRef.current = cy
    runClusterLayout(cy, caseGraphData, byId)

    const observer = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect
      if (box) setContainerSize({ width: box.width, height: box.height })
      cy.resize()
    })
    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
      cy.destroy()
    }
  }, [caseId, caseGraphData, byId, allEdges, syncAnchor])

  const applyLayout = useCallback((layoutName) => {
    if (!cyRef.current) return
    setActiveLayout(layoutName)
    const cy = cyRef.current

    if (layoutName === 'clusters') {
      runClusterLayout(cy, caseGraphData, byId)
      return
    }
    if (layoutName === 'physics') {
      runPhysicsLayout(cy)
      return
    }

    let options = { name: layoutName, animate: true, animationDuration: 600, padding: 50 }
    if (layoutName === 'breadthfirst') {
      const root1 = caseGraphData.victimTree.id
      const root2 = caseGraphData.suspectTree.id
      options = { name: 'breadthfirst', animate: true, roots: `#${root1}, #${root2}`, spacingFactor: 1.15, padding: 50 }
    }

    cy.layout(options).run()
  }, [caseGraphData, byId])

  const runPageRank = useCallback(() => {
    if (!cyRef.current) return
    const cy = cyRef.current
    setActiveAlgorithm('pagerank')
    cy.elements().removeClass('highlighted dimmed')

    const pr = cy.elements().pageRank({ dampingFactor: 0.85, precision: 0.00001 })
    let maxRank = 0
    let topNode = null

    cy.nodes().forEach((node) => {
      const rank = pr.rank(node)
      if (rank > maxRank) {
        maxRank = rank
        topNode = node
      }
      const scaledSize = Math.max(32, Math.min(88, Math.round(30 + rank * 190)))
      node.animate({ style: { width: scaledSize, height: scaledSize }, duration: 400 })
    })

    if (topNode) {
      topNode.addClass('highlighted')
      setAnalyticsStats({
        type: 'PageRank',
        detail: `Highest structural rank: ${topNode.data('label')} (${(maxRank * 100).toFixed(1)} score)`,
      })
    }
  }, [])

  const runBetweenness = useCallback(() => {
    if (!cyRef.current) return
    const cy = cyRef.current
    setActiveAlgorithm('betweenness')
    cy.elements().removeClass('highlighted dimmed')

    const bc = cy.elements().betweennessCentrality({ directed: true })
    let maxBc = 0
    let bridgeNode = null

    cy.nodes().forEach((node) => {
      const score = bc.betweenness(node)
      if (score > maxBc) {
        maxBc = score
        bridgeNode = node
      }
    })

    if (bridgeNode) {
      bridgeNode.addClass('highlighted')
      bridgeNode.connectedEdges().addClass('highlighted')
      setAnalyticsStats({
        type: 'Betweenness',
        detail: `Key intermediary bridge: ${bridgeNode.data('label')} (betweenness ${maxBc.toFixed(2)})`,
      })
    }
  }, [])

  const runShortestPath = useCallback(() => {
    if (!cyRef.current) return
    const cy = cyRef.current
    setActiveAlgorithm('path')
    cy.elements().removeClass('highlighted dimmed')

    const vRoot = `#${caseGraphData.victimTree.id}`
    const dijkstra = cy.elements().dijkstra(vRoot, () => 1)

    // For Case 11:40, trace from Hriday to Devishi (Alibi accomplice)
    // For CAS-2026-0392, trace from Ananya to s-hawala
    const targetSelector = caseId === 'CAS-2026-1140' ? '#s-devishi' : '#s-hawala'
    const target = cy.$(targetSelector)
    const pathToTarget = dijkstra.pathTo(target)

    if (pathToTarget.length > 0) {
      cy.elements().addClass('dimmed')
      pathToTarget.removeClass('dimmed').addClass('highlighted')
      const hops = pathToTarget.nodes().map((node) => node.data('label')).join(' → ')
      setAnalyticsStats({
        type: 'Shortest path',
        detail: `${pathToTarget.nodes().length} hops — ${hops}`,
      })
    }
  }, [caseGraphData, caseId])

  const resetAnalytics = useCallback(() => {
    if (!cyRef.current) return
    const cy = cyRef.current
    setActiveAlgorithm(null)
    setAnalyticsStats(null)
    cy.elements().removeClass('highlighted dimmed')
    cy.nodes().forEach((node) => {
      node.animate({ style: { width: node.data('size') || 40, height: node.data('size') || 40 }, duration: 350 })
    })
  }, [])

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
    for (const edge of allEdges) {
      if (edge.source === selectedId) push(edge.target, edge.label || 'Linked')
      else if (edge.target === selectedId) push(edge.source, edge.label || 'Linked')
    }
    return results
  }, [selectedId, byId, allEdges])

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#fbf9f5]">
      {/* Control bar */}
      <div className="absolute left-3 top-3 z-20 flex flex-wrap items-center gap-2 rounded-2xl border border-[#e5e0d8] bg-white/95 p-1.5 shadow-md backdrop-blur">
        <div className="flex items-center gap-1 border-r border-[#e5e0d8] pr-2">
          <span className="px-2 font-mono text-[10px] uppercase tracking-wider text-[#8a8578]">Layout:</span>
          {[
            ['clusters', 'Clusters', Compass],
            ['physics', 'Physics', null],
            ['circle', 'Circle', null],
            ['breadthfirst', 'Tree', null],
          ].map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => applyLayout(id)}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition ${activeLayout === id ? 'bg-[#171511] text-white' : 'text-[#625d53] hover:bg-[#faf7f2]'}`}
            >
              {Icon && <Icon className="size-3" />}
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <span className="px-2 font-mono text-[10px] uppercase tracking-wider text-[#8a8578]">Graph math:</span>
          <button
            onClick={runPageRank}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition ${activeAlgorithm === 'pagerank' ? 'bg-[#c0362c] text-white' : 'border border-[#e5e0d8] bg-white text-[#171511] hover:bg-[#faf7f2]'}`}
            title="Rank entities by structural influence"
          >
            <Activity className="size-3" />
            PageRank
          </button>
          <button
            onClick={runBetweenness}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition ${activeAlgorithm === 'betweenness' ? 'bg-[#c0362c] text-white' : 'border border-[#e5e0d8] bg-white text-[#171511] hover:bg-[#faf7f2]'}`}
            title="Identify the intermediary bridging the two networks"
          >
            <GitFork className="size-3" />
            Find Bridge
          </button>
          <button
            onClick={runShortestPath}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition ${activeAlgorithm === 'path' ? 'bg-[#c0362c] text-white' : 'border border-[#e5e0d8] bg-white text-[#171511] hover:bg-[#faf7f2]'}`}
            title="Trace the investigative hop path"
          >
            <Route className="size-3" />
            Trace Hop
          </button>
          {activeAlgorithm && (
            <button onClick={resetAnalytics} className="rounded-lg p-1 text-[#8a8578] hover:bg-[#eae5dd] hover:text-[#171511]" title="Reset analytics">
              <RefreshCw className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {analyticsStats && (
        <div className="animate-rise-in absolute left-3 top-16 z-20 flex max-w-[min(640px,60%)] items-center gap-2 rounded-xl border border-[#c3e6cd] bg-[#f0f9f3] px-3.5 py-2 text-xs text-[#1e6b37] shadow-sm">
          <Zap className="size-4 shrink-0 text-[#22c55e]" />
          <span><strong>{analyticsStats.type}:</strong> {analyticsStats.detail}</span>
        </div>
      )}

      <div ref={containerRef} className="h-full w-full cursor-grab active:cursor-grabbing" />

      <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-1 rounded-xl border border-[#e5e0d8] bg-white p-1 shadow-md">
        <button onClick={() => cyRef.current?.zoom(cyRef.current.zoom() * 1.25)} className="rounded-lg p-1.5 text-[#171511] hover:bg-[#faf7f2]" title="Zoom in">
          <Maximize2 className="size-3.5" />
        </button>
        <button onClick={() => cyRef.current?.zoom(cyRef.current.zoom() * 0.8)} className="rounded-lg p-1.5 text-[#171511] hover:bg-[#faf7f2]" title="Zoom out">
          <Minimize2 className="size-3.5" />
        </button>
        <button onClick={() => cyRef.current?.fit(undefined, 60)} className="rounded-lg p-1.5 text-[#171511] hover:bg-[#faf7f2]" title="Fit view">
          <RefreshCw className="size-3.5" />
        </button>
      </div>

      {inspectedEntity && (
        <EntityInspector
          entity={inspectedEntity}
          connectedEntities={connectedEntities}
          anchor={anchor}
          containerSize={containerSize}
          onClose={() => { selectedIdRef.current = null; setSelectedId(null); setAnchor(null) }}
          onSelectEntity={(id) => {
            selectNode(id)
            const cy = cyRef.current
            const target = cy?.$id(id)
            if (target && !target.empty()) {
              cy.animate({ center: { eles: target }, duration: 350 })
            }
          }}
        />
      )}
    </div>
  )
}
