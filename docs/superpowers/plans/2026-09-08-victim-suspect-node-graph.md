# Victim/Suspect Node Graph Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the tabbed Victim Profile page and the static suspect-network graph with a single React Flow canvas showing two collapsible, connected trees — one rooted at the victim, one at the suspect — where clicking a node expands its children and opens an inline dropdown of its stored fields, cross-tree links glow on drill-in, and suspect nodes grow and redden as their connection count rises.

**Architecture:** A pure data/layout layer (`src/graph/`) holds the two trees as plain nested JS objects, flattens them into an id-indexed map plus a structural edge list, and computes node positions with a small hand-written tidy-tree function — no physics simulation. A single stateful `CaseGraph` component turns that into React Flow's `nodes`/`edges` arrays each render based on which node ids are "expanded" and which one is "selected." `GraphWorkspace.jsx` is rewritten to just be screen chrome (header, legend) around `<CaseGraph />`. `VictimProfile.jsx` is deleted; every existing entry point that used to open it or the old graph now opens this one.

**Tech Stack:** React 19, Vite 8, Tailwind CSS 4 (all already in place) + `@xyflow/react` (new dependency) for the node-graph canvas.

## Global Constraints

- Work happens entirely inside `Nexus_Intel/` — this is a frontend-only demo with no backend and no persistence; nothing in this plan changes that.
- The repo has no automated test framework (confirmed in the prior system audit). Verification for every task is `npm run lint` and, where noted, `npm run build` and a manual check with `npm run dev` — there is no test command to add to these steps.
- Only one seed case exists (`CAS-2026-0392`); this plan builds against that single case, per the spec's explicit out-of-scope note.
- Do not modify `LoginPortal.jsx`, `CaseIntakeWizard.jsx`, `KeyIndividuals.jsx`, `AlertsCenter.jsx`, `DashboardSidebar.jsx`, `CaseDirectory.jsx`, `authConfig.js`, or `dashboardData.js` — none of them need to change for this feature.
- Every git commit message ends with: `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`

---

### Task 1: Add the React Flow dependency

**Files:**
- Modify: `Nexus_Intel/package.json` (via `npm install`, not hand-edited)

**Interfaces:**
- Consumes: nothing
- Produces: the `@xyflow/react` package, importable as `import { ReactFlow, Background, Controls, Handle, Position } from '@xyflow/react'` and `import '@xyflow/react/dist/style.css'`, for every later task.

- [ ] **Step 1: Install the package**

Run: `cd Nexus_Intel && npm install @xyflow/react`

- [ ] **Step 2: Verify install and existing build are still clean**

Run: `npm run lint && npm run build`
Expected: both exit 0 with no errors, same as before this change (this step only adds a dependency, no source changes yet).

- [ ] **Step 3: Commit**

```bash
git add Nexus_Intel/package.json Nexus_Intel/package-lock.json
git commit -m "Add @xyflow/react dependency for the case graph

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 2: Graph data model

**Files:**
- Create: `Nexus_Intel/src/graph/data.js`

**Interfaces:**
- Consumes: nothing
- Produces: `victimTree` and `suspectTree` (nested node objects, each shaped `{ id, label, kind: 'root'|'category'|'leaf', side: 'victim'|'suspect', fields: [string, string][], children: node[] }`), `rootLinkEdge` (`{ id, source, target, label }`), and `crossEdges` (array of the same shape) — consumed by Task 3's `buildIndex` and Task 6's `CaseGraph`.

- [ ] **Step 1: Write the data file**

```js
// Nexus_Intel/src/graph/data.js
// Two hierarchies — victim and suspect — each rooted at a person, plus the
// edges that connect them. All victim-side field values are reused from the
// existing Victim Profile content; all suspect-side field values are reused
// from the existing Graph Workspace fixture. The 2 family members and 3
// documents don't exist elsewhere in the app and are defined here.

function leaf(id, label, fields) {
  return { id, label, kind: 'leaf', side: 'victim', fields, children: [] }
}

function suspectLeaf(id, label, fields) {
  return { id, label, kind: 'leaf', side: 'suspect', fields, children: [] }
}

export const victimTree = {
  id: 'v-root',
  label: 'Ananya Sharma',
  kind: 'root',
  side: 'victim',
  fields: [
    ['Role', 'Primary Complainant / Victim'],
    ['Case', 'CAS-2026-0392'],
    ['FIR', 'FIR-CR-9402/2026-NZ'],
  ],
  children: [
    {
      id: 'v-personal',
      label: 'Personal Info',
      kind: 'category',
      side: 'victim',
      fields: [
        ['Full Legal Name', 'Ananya Ramesh Sharma'],
        ['Date of Birth / Age', '14 July 1991 (34 yrs)'],
        ['Residential Address', 'Flat 402, Sea Breeze Enclave, Bandra West, Mumbai, MH 400050'],
        ['Primary Contact', '+91 98201-44918'],
        ['National ID / KYC Ref', 'KYC-UID-8941-2094-1182'],
        ['Primary Occupation', 'Senior Financial Auditor at Apex Global Advisory'],
        ['Secondary Email', 'ananya.sharma@apexglobal.in'],
        ['Legal Representation', 'Adv. Rohan Iyer (High Court Bar Assoc. #HC-8821)'],
      ],
      children: [],
    },
    {
      id: 'v-family',
      label: 'Family & Kin',
      kind: 'category',
      side: 'victim',
      fields: [['Linked relatives', '2']],
      children: [
        leaf('v-family-karan', 'Karan Sharma', [
          ['Relation', 'Spouse'],
          ['Occupation', 'Marine Logistics Manager'],
          ['Contact', '+91 98212-33410'],
          ['Note', 'Primary family liaison contact'],
        ]),
        leaf('v-family-meenal', 'Meenal Sharma', [
          ['Relation', 'Mother'],
          ['Address', 'Same residence as victim'],
          ['Contact', '+91 98213-88820'],
          ['Note', 'Informed of Tier 1 witness-protection status'],
        ]),
      ],
    },
    {
      id: 'v-fir',
      label: 'FIR Details',
      kind: 'category',
      side: 'victim',
      fields: [
        ['FIR ID', 'FIR-CR-9402/2026-NZ'],
        ['Filed', '18 Mar 2026 • 06:15 IST'],
        ['Station', 'State Central Cyber Cell'],
        ['Investigating Officer', 'Insp. D. Miller'],
        ['Incident Summary', 'Unauthorized wire transfer of ₹45,00,000 initiated from escrow account at 02:40 IST.'],
      ],
      children: [],
    },
    {
      id: 'v-financial',
      label: 'Financial Loss',
      kind: 'category',
      side: 'victim',
      fields: [
        ['Total Fraud Volume', '₹45,00,000'],
        ['Recovery Freeze', '₹28,50,000'],
        ['Unrecovered Delta', '₹16,50,000'],
      ],
      children: [],
    },
    {
      id: 'v-documents',
      label: 'Linked Documents',
      kind: 'category',
      side: 'victim',
      fields: [['Documents on file', '3']],
      children: [
        leaf('v-doc-fir', 'FIR Statement (PDF)', [
          ['Filed', '18 Mar 2026'],
          ['Location', 'State Central Cyber Cell'],
          ['Ref', 'FIR-CR-9402/2026-NZ'],
        ]),
        leaf('v-doc-kyc', 'Aadhaar / KYC Verification', [
          ['Ref', 'KYC-UID-8941-2094-1182'],
          ['Status', 'Cross-verified with Aadhaar registry'],
        ]),
        leaf('v-doc-phish', 'Phishing-Domain Correlation Report', [
          ['Filed', '23 Mar 2026'],
          ['Finding', 'apex-escrow-secure[.]net identified as the spoofed domain used in the wire-transfer request'],
          ['Cross-reference', 'Linked to Hawala Shell Unit 04'],
        ]),
      ],
    },
    {
      id: 'v-evidence',
      label: 'Evidence Locker',
      kind: 'category',
      side: 'victim',
      fields: [['Items on file', '2']],
      children: [
        leaf('v-evd-dump', 'Forensic Device Dump', [
          ['Completed', '19 Mar 2026 • 11:30 IST'],
          ['Ref', 'EVD-9041'],
        ]),
        leaf('v-evd-deposition', 'Deposition Recording', [
          ['Taken', '21 Mar 2026 • 15:00 IST'],
          ['Officer', 'Insp. D. Miller'],
        ]),
      ],
    },
  ],
}

export const suspectTree = {
  id: 's-root',
  label: 'Ramesh Kumar',
  kind: 'root',
  side: 'suspect',
  fields: [
    ['Alias', '"Wire"'],
    ['Risk', 'Critical'],
    ['Summary', 'Primary suspect and central bridge. Eighteen encrypted VoIP calls preceded a ₹28.5L RTGS dispatch.'],
  ],
  children: [
    {
      id: 's-financial',
      label: 'Financial',
      kind: 'category',
      side: 'suspect',
      fields: [['Linked accounts/entities', '2']],
      children: [
        suspectLeaf('s-hawala', 'Hawala Shell Unit 04', [
          ['Type', 'Organization / Shell'],
          ['Risk', 'High'],
          ['Detail', 'Offshore clearing entity identified in 41 connected ledger entries.'],
        ]),
        suspectLeaf('s-mule', 'Mule Account 02', [
          ['Type', 'Financial Account'],
          ['Risk', 'Critical'],
          ['Detail', 'HDFC destination account currently frozen by court order.'],
        ]),
      ],
    },
    {
      id: 's-locations',
      label: 'Locations',
      kind: 'category',
      side: 'suspect',
      fields: [['Linked sites', '1']],
      children: [
        suspectLeaf('s-safehouse', 'Safehouse Goregaon', [
          ['Type', 'Location / Site'],
          ['Risk', 'Medium'],
          ['Detail', 'Unregistered lease with eleven recurring geolocation pings.'],
        ]),
      ],
    },
    {
      id: 's-communications',
      label: 'Communications',
      kind: 'category',
      side: 'suspect',
      fields: [['Linked lines', '1']],
      children: [
        suspectLeaf('s-sim', 'SIM +91 98201', [
          ['Type', 'Phone / SIM'],
          ['Risk', 'High'],
          ['Detail', 'Encrypted hotline with 42 matched call records.'],
        ]),
      ],
    },
    {
      id: 's-evidence',
      label: 'Evidence',
      kind: 'category',
      side: 'suspect',
      fields: [['Items seized', '1']],
      children: [
        suspectLeaf('s-ssd', 'Seized 4TB SSD', [
          ['Type', 'Physical Evidence'],
          ['Risk', 'Medium'],
          ['Detail', 'Evidence item EVD-209 with encrypted call-log archive.'],
        ]),
      ],
    },
    {
      id: 's-assets',
      label: 'Assets',
      kind: 'category',
      side: 'suspect',
      fields: [['Vehicles', '1']],
      children: [
        suspectLeaf('s-vehicle', 'Toyota Fortuner', [
          ['Type', 'Vehicle / Asset'],
          ['Risk', 'Medium'],
          ['Detail', 'Vehicle observed near Goregaon location twice.'],
        ]),
      ],
    },
  ],
}

export const rootLinkEdge = { id: 'e-root-link', source: 'v-root', target: 's-root', label: 'Named in FIR' }

export const crossEdges = [
  { id: 'e-cross-financial', source: 'v-financial', target: 's-mule', label: 'Traced funds' },
  { id: 'e-cross-fir', source: 'v-fir', target: 's-root', label: 'Named suspect' },
  { id: 'e-cross-doc', source: 'v-doc-phish', target: 's-hawala', label: 'Domain correlation' },
]
```

- [ ] **Step 2: Verify**

Run: `cd Nexus_Intel && npm run lint`
Expected: exits 0 (the file isn't imported anywhere yet, but it must still be syntactically valid and lint-clean on its own).

- [ ] **Step 3: Commit**

```bash
git add Nexus_Intel/src/graph/data.js
git commit -m "Add victim/suspect graph data model

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 3: Flatten and degree helpers

**Files:**
- Create: `Nexus_Intel/src/graph/flatten.js`

**Interfaces:**
- Consumes: a tree node shaped like `victimTree`/`suspectTree` from Task 2 (`{ id, childIds via .children }`).
- Produces: `buildIndex(root)` → `{ byId, treeEdges }` where `byId[id] = { id, label, kind, side, fields, parentId, childIds }` and `treeEdges` is `{ id, source, target }[]`; `degreeOf(nodeId, edges)` → number; `degreeColor(count, min, max)` → CSS color string; `degreeSize(count, min, max)` → number (px). All four consumed by Task 6's `CaseGraph`.

- [ ] **Step 1: Write the file**

```js
// Nexus_Intel/src/graph/flatten.js
// Turns the nested tree data into a flat id-indexed map plus a parent-child
// edge list, and provides the suspect-side degree -> size/color scaling.

export function buildIndex(root) {
  const byId = {}
  const treeEdges = []

  function visit(node, parentId) {
    byId[node.id] = {
      id: node.id,
      label: node.label,
      kind: node.kind,
      side: node.side,
      fields: node.fields,
      parentId,
      childIds: node.children.map((child) => child.id),
    }
    if (parentId) treeEdges.push({ id: `e-${parentId}-${node.id}`, source: parentId, target: node.id })
    node.children.forEach((child) => visit(child, node.id))
  }

  visit(root, null)
  return { byId, treeEdges }
}

export function degreeOf(nodeId, edges) {
  return edges.filter((edge) => edge.source === nodeId || edge.target === nodeId).length
}

const AMBER = [192, 138, 46]
const RED = [192, 54, 44]

export function degreeColor(count, min, max) {
  const t = max === min ? 0 : (count - min) / (max - min)
  const rgb = AMBER.map((channel, index) => Math.round(channel + (RED[index] - channel) * t))
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
}

export function degreeSize(count, min, max) {
  const t = max === min ? 0 : (count - min) / (max - min)
  return Math.round(44 + t * 24)
}
```

- [ ] **Step 2: Verify**

Run: `cd Nexus_Intel && npm run lint`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add Nexus_Intel/src/graph/flatten.js
git commit -m "Add graph flatten/degree helpers

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 4: Tidy-tree layout

**Files:**
- Create: `Nexus_Intel/src/graph/layout.js`

**Interfaces:**
- Consumes: `byId` map from Task 3's `buildIndex`, an `expandedIds` `Set<string>`, a root id, and a `direction` of `'right'` or `'left'`.
- Produces: `layoutSide(rootId, byId, expandedIds, direction)` → `{ [id]: { x, y } }` positions relative to that side's own root at `(0, 0)`. Consumed by Task 6.

- [ ] **Step 1: Write the file**

```js
// Nexus_Intel/src/graph/layout.js
// A small hand-written tidy-tree layout: depth sets x, and each internal
// node is vertically centered on the midpoint of its visible children.
// Only nodes whose id is in `expandedIds` have their children counted as
// visible, so collapsed branches take up no space.

const ROW_HEIGHT = 96
const COL_WIDTH = 230

export function layoutSide(rootId, byId, expandedIds, direction) {
  const rawPositions = {}
  let cursor = 0

  function visit(id, depth) {
    const node = byId[id]
    const visibleChildren = expandedIds.has(id) ? node.childIds : []
    if (visibleChildren.length === 0) {
      const y = cursor * ROW_HEIGHT
      cursor += 1
      rawPositions[id] = { depth, y }
      return y
    }
    const childYs = visibleChildren.map((childId) => visit(childId, depth + 1))
    const y = (childYs[0] + childYs[childYs.length - 1]) / 2
    rawPositions[id] = { depth, y }
    return y
  }

  visit(rootId, 0)

  const rootY = rawPositions[rootId].y
  const positions = {}
  for (const [id, { depth, y }] of Object.entries(rawPositions)) {
    const x = direction === 'right' ? depth * COL_WIDTH : -depth * COL_WIDTH
    positions[id] = { x, y: y - rootY }
  }
  return positions
}
```

- [ ] **Step 2: Verify**

Run: `cd Nexus_Intel && npm run lint`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add Nexus_Intel/src/graph/layout.js
git commit -m "Add tidy-tree layout for the case graph

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 5: Custom node component

**Files:**
- Create: `Nexus_Intel/src/graph/PersonNode.jsx`

**Interfaces:**
- Consumes: `@xyflow/react`'s `Handle`/`Position` (from Task 1's dependency); a React Flow node's `data` prop shaped `{ label, kind, fields, hasChildren, isExpanded, isSelected, size, color, onToggle }`.
- Produces: `PersonNode` component, registered as React Flow's `'person'` node type in Task 6.

- [ ] **Step 1: Write the file**

```jsx
// Nexus_Intel/src/graph/PersonNode.jsx
import { Handle, Position } from '@xyflow/react'

const hiddenHandle = { opacity: 0, width: 1, height: 1, minWidth: 1, minHeight: 1, border: 'none' }

export function PersonNode({ data }) {
  const { label, kind, fields, hasChildren, isExpanded, isSelected, size, color, onToggle } = data
  const isRoot = kind === 'root'

  return (
    <div
      onClick={onToggle}
      className={`cursor-pointer rounded-xl border border-white/20 px-3.5 py-2.5 text-white shadow-lg transition-all ${isRoot ? 'font-serif text-sm font-semibold' : 'text-xs font-medium'} ${isSelected ? 'ring-4 ring-[#22d3ee] ring-offset-2 ring-offset-[#0e1626]' : ''}`}
      style={{ background: color, minWidth: `${size}px`, minHeight: isRoot ? 56 : 44 }}
    >
      <Handle type="target" position={Position.Left} id="t-l" style={hiddenHandle} />
      <Handle type="target" position={Position.Right} id="t-r" style={hiddenHandle} />
      <Handle type="source" position={Position.Left} id="s-l" style={hiddenHandle} />
      <Handle type="source" position={Position.Right} id="s-r" style={hiddenHandle} />

      <div className="flex items-center justify-between gap-2">
        <span>{label}</span>
        {hasChildren && <span className="text-[10px] opacity-80">{isExpanded ? '▾' : '▸'}</span>}
      </div>

      {isSelected && (
        <div className="mt-2 space-y-1 rounded-lg bg-black/25 p-2.5 text-[11px]">
          {fields.map(([key, value]) => (
            <div className="flex justify-between gap-3" key={key}>
              <span className="text-white/60">{key}</span>
              <span className="text-right font-medium">{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify**

Run: `cd Nexus_Intel && npm run lint`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add Nexus_Intel/src/graph/PersonNode.jsx
git commit -m "Add custom node component with inline dropdown

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 6: CaseGraph orchestrator

**Files:**
- Create: `Nexus_Intel/src/graph/CaseGraph.jsx`

**Interfaces:**
- Consumes: `victimTree`, `suspectTree`, `rootLinkEdge`, `crossEdges` (Task 2); `buildIndex`, `degreeOf`, `degreeColor`, `degreeSize` (Task 3); `layoutSide` (Task 4); `PersonNode` (Task 5).
- Produces: `CaseGraph` component, taking no props, rendered by `GraphWorkspace.jsx` in Task 7.

- [ ] **Step 1: Write the file**

```jsx
// Nexus_Intel/src/graph/CaseGraph.jsx
import { useMemo, useState } from 'react'
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

  function handleNodeClick(id) {
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
  }

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
  }, [visibleIds, expandedIds, selectedId, suspectDegrees])

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
```

- [ ] **Step 2: Verify**

Run: `cd Nexus_Intel && npm run lint`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add Nexus_Intel/src/graph/CaseGraph.jsx
git commit -m "Add CaseGraph orchestrator component

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 7: Rewrite GraphWorkspace screen chrome

**Files:**
- Modify: `Nexus_Intel/src/components/GraphWorkspace.jsx` (full rewrite)

**Interfaces:**
- Consumes: `CaseGraph` from `../graph/CaseGraph` (Task 6).
- Produces: `GraphWorkspace({ onExit, onIndividuals, onAlerts })`, same prop signature as before, consumed by `App.jsx` (Task 8) unchanged.

- [ ] **Step 1: Replace the file**

```jsx
// Nexus_Intel/src/components/GraphWorkspace.jsx
import { ArrowLeft } from 'lucide-react'
import { CaseGraph } from '../graph/CaseGraph'

export function GraphWorkspace({ onExit, onIndividuals, onAlerts }) {
  return (
    <div className="flex h-screen flex-col bg-[#0e1626] text-white">
      <header className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-[#1e293b] bg-[#111c30] px-4 py-3 sm:px-7">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.16em] text-[#94a3b8]">Investigation graph // workspace</p>
          <h1 className="font-serif text-2xl">CAS-2026-0392 <span className="font-sans text-sm font-normal text-[#94a3b8]">Operation Dark Ledger — victim &amp; suspect graph</span></h1>
        </div>
        <div className="flex gap-2">
          <button className="rounded-full bg-[#172033] px-4 py-2 text-xs" onClick={onIndividuals}>Key individuals</button>
          <button className="rounded-full bg-[#172033] px-4 py-2 text-xs" onClick={onAlerts}>Alerts</button>
          <button className="inline-flex items-center gap-2 rounded-full border border-[#334155] px-3 py-2 text-xs" onClick={onExit}><ArrowLeft className="size-4" />Dashboard</button>
        </div>
      </header>
      <p className="flex flex-wrap gap-x-6 gap-y-1 border-b border-[#1e293b] bg-[#0b1220] px-4 py-2 text-[11px] text-[#94a3b8] sm:px-7">
        <span><i className="mr-1.5 inline-block size-2 rounded-full" style={{ background: '#3b82f6' }} />Victim branch — neutral</span>
        <span><i className="mr-1.5 inline-block size-2 rounded-full" style={{ background: '#c0362c' }} />Suspect branch — size &amp; color scale with number of connections</span>
        <span>Click any node to expand it and see its stored details.</span>
      </p>
      <main className="min-h-0 flex-1">
        <CaseGraph />
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Verify**

Run: `cd Nexus_Intel && npm run lint && npm run build`
Expected: both exit 0.

- [ ] **Step 3: Commit**

```bash
git add Nexus_Intel/src/components/GraphWorkspace.jsx
git commit -m "Rewrite GraphWorkspace around the new CaseGraph canvas

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 8: Wire navigation and retire VictimProfile

**Files:**
- Modify: `Nexus_Intel/src/App.jsx`
- Delete: `Nexus_Intel/src/components/VictimProfile.jsx`

**Interfaces:**
- Consumes: `GraphWorkspace` (unchanged signature from Task 7).
- Produces: `App`'s `'victim'` view is removed; `PortalDashboard`'s `onViewVictim` prop now opens the `'graph'` view directly.

- [ ] **Step 1: Update App.jsx**

Remove the `VictimProfile` import and its `view === 'victim'` branch, and point `onViewVictim` at the graph view:

```jsx
// Nexus_Intel/src/App.jsx
import { useState } from 'react'
import { LoginPortal } from './components/LoginPortal'
import { PortalDashboard } from './components/PortalDashboard'
import { CaseIntakeWizard } from './components/CaseIntakeWizard'
import { GraphWorkspace } from './components/GraphWorkspace'
import { KeyIndividuals } from './components/KeyIndividuals'
import { AlertsCenter } from './components/AlertsCenter'

function App() {
  const [session, setSession] = useState(null)
  const [view, setView] = useState('dashboard')

  if (!session) return <LoginPortal onAuthenticate={(user) => { setSession(user); setView('dashboard') }} />

  if (view === 'intake') {
    return <CaseIntakeWizard onComplete={() => setView('graph')} onExit={() => setView('dashboard')} />
  }

  if (view === 'graph') return <GraphWorkspace onAlerts={() => setView('alerts')} onExit={() => setView('dashboard')} onIndividuals={() => setView('individuals')} />
  if (view === 'individuals') return <KeyIndividuals onExit={() => setView('graph')} />
  if (view === 'alerts') return <AlertsCenter onExit={() => setView('dashboard')} onGraph={() => setView('graph')} />

  return <PortalDashboard session={session} onAlerts={() => setView('alerts')} onCreateCase={() => setView('intake')} onGraph={() => setView('graph')} onSignOut={() => { setSession(null); setView('dashboard') }} onViewVictim={() => setView('graph')} />
}

export default App
```

- [ ] **Step 2: Delete VictimProfile.jsx**

```bash
git rm Nexus_Intel/src/components/VictimProfile.jsx
```

- [ ] **Step 3: Verify**

Run: `cd Nexus_Intel && npm run lint && npm run build`
Expected: both exit 0 — this also confirms nothing else still imports the deleted `VictimProfile.jsx`.

- [ ] **Step 4: Smoke-test in the dev server**

Run: `npm run dev` (background), then `curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/`
Expected: `200`, and the terminal running `npm run dev` shows no error overlay/log entries. Stop the dev server afterward.

- [ ] **Step 5: Commit**

```bash
git add Nexus_Intel/src/App.jsx
git commit -m "Route case selection and Network Search to the case graph

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 9: Full manual verification pass

**Files:** none (verification only)

**Interfaces:** none

- [ ] **Step 1: Lint and build one more time end-to-end**

Run: `cd Nexus_Intel && npm run lint && npm run build`
Expected: both exit 0.

- [ ] **Step 2: Start the dev server and open it**

Run: `npm run dev`
Open `http://localhost:5173/`, sign in with the demo credentials shown on the login screen.

- [ ] **Step 3: Walk the checklist from the design spec**

Confirm each of the following (all from `docs/superpowers/specs/2026-09-08-victim-suspect-node-graph-design.md`):

1. Loading the graph (via clicking the seed case row from the dashboard) shows both roots (Ananya Sharma, Ramesh Kumar) and their category nodes, with no leaf nodes visible yet.
2. Clicking each victim category node (Personal Info, Family & Kin, FIR Details, Financial Loss, Linked Documents, Evidence Locker) opens its dropdown of fields, and for the two with children (Family & Kin, Linked Documents, Evidence Locker) reveals the correct leaf nodes.
3. Clicking each suspect category node (Financial, Locations, Communications, Evidence, Assets) reveals its leaf nodes; as more of the suspect branch is expanded, suspect nodes visibly grow and shift toward red.
4. Selecting "Financial Loss" highlights the edge to "Mule Account 02" (after expanding Suspect → Financial to reveal it) and dims other edges.
5. Selecting "FIR Details" highlights the root↔root edge.
6. Expanding "Linked Documents" then selecting "Phishing-Domain Correlation Report" highlights the edge to "Hawala Shell Unit 04" (after expanding Suspect → Financial to reveal it).
7. Collapsing a category (clicking it again) hides its leaf nodes again and closes its dropdown.
8. From the dashboard: the seed case row, and from the graph screen: "Key individuals" and "Alerts" buttons, all still navigate correctly; from Key Individuals and Alerts, the back buttons return to this same graph screen.

If any check fails, fix the relevant file from Tasks 2–8 and re-run this
checklist from Step 1.

- [ ] **Step 4: Stop the dev server**

Run: `pkill -f vite` (or Ctrl+C in the terminal running it).

No commit for this task — it's verification of work already committed in
Tasks 1–8.
