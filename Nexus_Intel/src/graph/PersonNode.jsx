import { useState } from 'react'
import { Handle, Position } from '@xyflow/react'

const hiddenHandle = { opacity: 0, width: 1, height: 1, minWidth: 1, minHeight: 1, border: 'none' }

export function PersonNode({ data }) {
  const { label, kind, fields, hasChildren, isExpanded, isSelected, isLinked, size, color, onToggle } = data
  const isRoot = kind === 'root'
  const [notice, setNotice] = useState('')

  return (
    <div
      onClick={onToggle}
      className={`cursor-pointer rounded-xl border border-white/20 px-3.5 py-2.5 text-white shadow-lg transition-all ${isRoot ? 'font-serif text-sm font-semibold' : 'text-xs font-medium'} ${isSelected ? 'ring-4 ring-[#22d3ee] ring-offset-2 ring-offset-[#0e1626]' : isLinked ? 'ring-2 ring-[#ef4444]' : ''}`}
      style={{
        background: color,
        minWidth: `${size}px`,
        minHeight: isRoot ? 56 : 44,
        maxWidth: 300,
        transform: `scale(${(size / 56).toFixed(2)})`,
        transformOrigin: 'center',
      }}
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
        <div className="mt-2 space-y-1 rounded-lg bg-black/25 p-2.5 text-[11px]" onClick={(event) => event.stopPropagation()}>
          {fields.map(([key, value]) => (
            <div className="flex justify-between gap-3" key={key}>
              <span className="text-white/60">{key}</span>
              <span className="min-w-0 flex-1 text-right font-medium break-words">{value}</span>
            </div>
          ))}
          <div className="mt-2 flex flex-wrap gap-1.5 border-t border-white/10 pt-2">
            <button onClick={() => setNotice('Added to the active dossier.')} className="rounded-full bg-white/10 px-2 py-1 text-[10px] hover:bg-white/20">Add to dossier</button>
            <button onClick={() => setNotice('Priority alert created for this entity.')} className="rounded-full bg-white/10 px-2 py-1 text-[10px] hover:bg-white/20">Trigger alert</button>
            <button onClick={() => setNotice('Export prepared for download.')} className="rounded-full bg-white/10 px-2 py-1 text-[10px] hover:bg-white/20">Export graph</button>
          </div>
          {notice && <p className="mt-1 text-[10px] text-emerald-300">{notice}</p>}
        </div>
      )}
    </div>
  )
}
