import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import {
  Building2,
  Car,
  CreditCard,
  FileText,
  HardDrive,
  MapPin,
  Minus,
  Phone,
  Plus,
  Shield,
  ShieldAlert,
  User,
  Users,
} from 'lucide-react'

const handleStyle = {
  opacity: 0,
  width: 1,
  height: 1,
  minWidth: 1,
  minHeight: 1,
  border: 'none',
}

function getNodeIcon(id, kind, side) {
  if (id === 'v-root' || id === 's-root') return User
  if (id.includes('family')) return Users
  if (id.includes('financial') || id.includes('mule') || id.includes('loss')) return CreditCard
  if (id.includes('hawala') || id.includes('shell') || id.includes('station')) return Building2
  if (id.includes('safehouse') || id.includes('location') || id.includes('residence')) return MapPin
  if (id.includes('sim') || id.includes('phone') || id.includes('comm')) return Phone
  if (id.includes('doc') || id.includes('fir')) return FileText
  if (id.includes('ssd') || id.includes('dump') || id.includes('device')) return HardDrive
  if (id.includes('vehicle') || id.includes('car')) return Car
  if (side === 'suspect') return ShieldAlert
  return Shield
}

export const PersonNode = memo(function PersonNode({ data }) {
  const {
    id,
    label,
    kind,
    side,
    hasChildren,
    isExpanded,
    isSelected,
    isLinked,
    onSelect,
    onToggleExpand,
  } = data

  const isRoot = kind === 'root'
  const isCategory = kind === 'category'
  const isSuspect = side === 'suspect'
  const Icon = getNodeIcon(id, kind, side)

  return (
    <div
      onClick={onSelect}
      className={`group relative flex cursor-pointer items-center justify-center rounded-full transition-all duration-200 select-none ${
        isRoot
          ? 'size-16'
          : isCategory
            ? 'size-12'
            : 'size-10'
      } ${
        isRoot
          ? isSuspect
            ? 'bg-gradient-to-br from-[#c0362c] to-[#991b1b] text-white shadow-[0_4px_16px_rgba(192,54,44,0.3)] border-2 border-white'
            : 'bg-gradient-to-br from-[#1e3a5f] to-[#0f172a] text-white shadow-[0_4px_16px_rgba(30,58,95,0.3)] border-2 border-white'
          : isCategory
            ? isSuspect
              ? 'bg-[#fef3c7] text-[#92400e] border-2 border-[#f59e0b] shadow-sm hover:scale-105'
              : 'bg-[#e0f2fe] text-[#0369a1] border-2 border-[#38bdf8] shadow-sm hover:scale-105'
            : isSuspect
              ? 'bg-white text-[#b91c1c] border-2 border-[#fca5a5] shadow-sm hover:scale-110'
              : 'bg-white text-[#1d4ed8] border-2 border-[#93c5fd] shadow-sm hover:scale-110'
      } ${
        isSelected
          ? 'ring-4 ring-[#171511] ring-offset-2 ring-offset-[#fbf9f5] scale-110 shadow-xl'
          : isLinked
            ? 'ring-4 ring-[#c0362c] ring-offset-2 animate-pulse shadow-lg'
            : ''
      }`}
    >
      {/* 4 Cardinal Handles for Clean Radial Edge Anchoring */}
      <Handle type="target" position={Position.Top} id="t-t" style={handleStyle} />
      <Handle type="source" position={Position.Top} id="s-t" style={handleStyle} />
      <Handle type="target" position={Position.Right} id="t-r" style={handleStyle} />
      <Handle type="source" position={Position.Right} id="s-r" style={handleStyle} />
      <Handle type="target" position={Position.Bottom} id="t-b" style={handleStyle} />
      <Handle type="source" position={Position.Bottom} id="s-b" style={handleStyle} />
      <Handle type="target" position={Position.Left} id="t-l" style={handleStyle} />
      <Handle type="source" position={Position.Left} id="s-l" style={handleStyle} />

      {/* Center Icon */}
      <Icon
        className={`${
          isRoot
            ? 'size-7'
            : isCategory
              ? 'size-5'
              : 'size-4'
        }`}
      />

      {/* Expand / Collapse Indicator Button Pill */}
      {hasChildren && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggleExpand?.()
          }}
          className={`absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full border shadow-sm transition hover:scale-110 ${
            isExpanded
              ? 'border-[#d8d3c8] bg-[#171511] text-white hover:bg-[#333]'
              : 'border-[#171511] bg-white text-[#171511] hover:bg-[#faf7f2]'
          }`}
          title={isExpanded ? 'Collapse branch' : 'Expand branch'}
        >
          {isExpanded ? <Minus className="size-2.5" /> : <Plus className="size-2.5" />}
        </button>
      )}

      {/* External Label Positioned Below the Circle */}
      <div
        className={`pointer-events-none absolute left-1/2 -translate-x-1/2 flex flex-col items-center text-center ${
          isRoot
            ? 'top-[calc(100%+6px)] w-28'
            : isCategory
              ? 'top-[calc(100%+5px)] w-24'
              : 'top-[calc(100%+4px)] w-20'
        }`}
      >
        <span
          className={`leading-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] ${
            isRoot
              ? 'font-serif text-xs font-bold text-[#171511]'
              : isCategory
                ? 'font-medium text-[11px] text-[#171511]'
                : 'text-[10px] font-normal text-[#2b2722] line-clamp-2'
          }`}
        >
          {label}
        </span>
        {isRoot && (
          <span className="mt-0.5 rounded-full bg-[#f0ece3] px-1.5 py-0.2 font-mono text-[9px] uppercase tracking-wider text-[#716b5f]">
            {isSuspect ? 'Primary Target' : 'Complainant'}
          </span>
        )}
      </div>
    </div>
  )
})
