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
