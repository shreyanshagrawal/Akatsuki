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
