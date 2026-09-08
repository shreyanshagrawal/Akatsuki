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
