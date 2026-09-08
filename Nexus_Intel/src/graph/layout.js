// Nexus_Intel/src/graph/layout.js
// Hemispheric Radial Orbital Layout:
// Anchors the root node at (0, 0).
// Ring 1 (Inner Orbit, R_CATEGORY): Direct category branches encircling the root.
// Ring 2 (Outer Orbit, R_LEAF): Leaf entities encircling the root in their parent sector.
// Direction:
// - 'victim': fans outward to the LEFT (100° to 260°), leaving the center corridor clear.
// - 'suspect': fans outward to the RIGHT (-80° to +80°), leaving the center corridor clear.

const R_CATEGORY = 175
const R_LEAF = 315

export function layoutRadialCluster(rootId, byId, expandedIds, side = 'victim') {
  const positions = {}
  positions[rootId] = { x: 0, y: 0 }

  const node = byId[rootId]
  if (!node) return positions

  const visibleCategoryIds = expandedIds.has(rootId) ? node.childIds : []
  const catCount = visibleCategoryIds.length
  if (catCount === 0) return positions

  // Hemispheric fan:
  // victim side fans leftwards (105° to 255°)
  // suspect side fans rightwards (-75° to +75°)
  const isVictim = side === 'victim' || side < 0
  const arcSpan = Math.PI * 0.88 // ~160 degrees fan

  // Center angle of the fan: PI for victim (left), 0 for suspect (right)
  const centerAngle = isVictim ? Math.PI : 0
  const startAngle = centerAngle - arcSpan / 2
  const angleStep = catCount > 1 ? arcSpan / (catCount - 1) : 0

  visibleCategoryIds.forEach((catId, i) => {
    const catAngle = catCount === 1 ? centerAngle : startAngle + i * angleStep
    positions[catId] = {
      x: Math.round(R_CATEGORY * Math.cos(catAngle)),
      y: Math.round(R_CATEGORY * Math.sin(catAngle)),
    }

    const catNode = byId[catId]
    if (!catNode) return

    const visibleLeafIds = expandedIds.has(catId) ? catNode.childIds : []
    const leafCount = visibleLeafIds.length
    if (leafCount === 0) return

    const leafSpread = 0.36 // ~20 degrees between sibling leaves
    const leafStart = catAngle - ((leafCount - 1) / 2) * leafSpread

    visibleLeafIds.forEach((leafId, j) => {
      const leafAngle = leafCount === 1 ? catAngle : leafStart + j * leafSpread
      positions[leafId] = {
        x: Math.round(R_LEAF * Math.cos(leafAngle)),
        y: Math.round(R_LEAF * Math.sin(leafAngle)),
      }
    })
  })

  return positions
}
