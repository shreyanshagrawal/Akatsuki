import { useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  Download,
  FileCheck2,
  Shield,
  ShieldAlert,
  X,
} from 'lucide-react'

const POPOVER_WIDTH = 370
const POPOVER_MAX_HEIGHT = 490

// Places the card beside the node it belongs to, flipping to the other side
// (or clamping vertically) when it would otherwise run off the canvas. The gap
// is measured from the node's edge, not its centre, so the card never sits on
// top of the node it is describing.
function resolvePlacement(anchor, container) {
  if (!anchor) return null
  const width = container?.width ?? 1200
  const height = container?.height ?? 800
  const gap = (anchor.r ?? 36) + 16

  const flipLeft = anchor.x + gap + POPOVER_WIDTH > width - 8
  const left = flipLeft ? anchor.x - gap - POPOVER_WIDTH : anchor.x + gap

  const rawTop = anchor.y - 90
  const maxTop = height - POPOVER_MAX_HEIGHT - 12
  const top = Math.max(12, Math.min(rawTop, Math.max(12, maxTop)))

  return { left: Math.max(8, left), top, flipLeft, pointerY: anchor.y - top }
}

export function EntityInspector({ entity, connectedEntities = [], onClose, onSelectEntity, anchor, containerSize }) {
  const [notice, setNotice] = useState('')
  const [copiedKey, setCopiedKey] = useState(null)

  if (!entity) return null

  const isSuspect = entity.side === 'suspect'
  const isRoot = entity.kind === 'root'

  const riskField = entity.fields?.find(([k]) => k.toLowerCase().includes('risk'))
  const riskRating = riskField ? riskField[1] : isSuspect ? (isRoot ? 'Critical' : 'High') : 'Protected'

  // De-duplicated: an entity can be reachable both as a child and via an edge.
  const links = []
  const seen = new Set()
  for (const link of connectedEntities) {
    if (seen.has(link.id)) continue
    seen.add(link.id)
    links.push(link)
  }

  const placement = resolvePlacement(anchor, containerSize)

  function copyText(text, key) {
    navigator.clipboard?.writeText?.(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 1800)
  }

  function handleAction(msg) {
    setNotice(msg)
    setTimeout(() => setNotice(''), 3500)
  }

  const positionStyle = placement
    ? { left: placement.left, top: placement.top, width: POPOVER_WIDTH, maxHeight: POPOVER_MAX_HEIGHT }
    : { right: 12, top: 12, width: POPOVER_WIDTH, maxHeight: POPOVER_MAX_HEIGHT }

  return (
    <div
      aria-label="Entity dossier"
      className="animate-rise-in absolute z-30 flex flex-col overflow-hidden rounded-2xl border border-[#d8d3c8] bg-white shadow-[0_12px_40px_rgba(23,21,17,0.18)]"
      style={positionStyle}
    >
      {/* Pointer nub aimed back at the node */}
      {placement && (
        <span
          className={`absolute size-3 rotate-45 border border-[#d8d3c8] bg-[#faf8f5] ${placement.flipLeft ? 'border-b-0 border-l-0' : 'border-t-0 border-r-0'}`}
          style={{
            top: Math.max(14, Math.min(placement.pointerY, POPOVER_MAX_HEIGHT - 24)),
            [placement.flipLeft ? 'right' : 'left']: -7,
          }}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-[#e5e0d8] bg-[#faf8f5] px-4 py-3">
        <div className="flex items-start gap-3 min-w-0">
          {entity.avatar && (
            <img
              src={entity.avatar}
              alt={entity.label}
              className="size-12 rounded-xl object-cover border border-[#d8d3c8] shadow-sm shrink-0"
            />
          )}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#8a8578]">Entity dossier</span>
              <span
                className={`rounded-full px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase ${
                  isSuspect
                    ? riskRating === 'Critical'
                      ? 'border border-[#f1c6c3] bg-[#fbeaea] text-[#c0362c]'
                      : 'border border-[#fde4ba] bg-[#fff4df] text-[#a47621]'
                    : 'border border-[#d6e4ff] bg-[#eef4ff] text-[#2457a6]'
                }`}
              >
                {riskRating}
              </span>
            </div>
            <h2 className="mt-0.5 truncate font-serif text-lg font-semibold leading-tight text-[#171511]">{entity.label}</h2>
            <p className="mt-0.5 truncate text-[11px] text-[#777166]">{isSuspect ? 'Suspect network' : 'Complainant record'} · {entity.id}</p>
          </div>
        </div>
        <button onClick={onClose} className="shrink-0 rounded-lg p-1 text-[#8a8578] transition hover:bg-[#eae5dd] hover:text-[#171511]" title="Close">
          <X className="size-4" />
        </button>
      </div>

      {/* Body */}
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        {entity.evidenceImage && (
          <div className="rounded-xl border border-[#e5e0d8] bg-white p-3">
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#8a8578]">Photographic Forensic Exhibit</span>
            <div className="mt-2 overflow-hidden rounded-lg border border-[#e5e0d8]">
              <img
                src={entity.evidenceImage}
                alt="Forensic Evidence"
                className="w-full max-h-48 object-cover"
              />
            </div>
          </div>
        )}

        <div className={`flex items-start gap-2.5 rounded-xl border p-3 text-[11px] leading-relaxed ${isSuspect ? 'border-[#f1c6c3] bg-[#fdf6f6] text-[#6d2825]' : 'border-[#e0dfd5] bg-[#faf8f5] text-[#555044]'}`}>
          {isSuspect ? <ShieldAlert className="mt-0.5 size-3.5 shrink-0 text-[#c0362c]" /> : <Shield className="mt-0.5 size-3.5 shrink-0 text-[#2563eb]" />}
          <span>{isSuspect ? 'Flagged across 14 state cyber cells. Live telemetry and ledger auditing active.' : 'Tier 1 protection. Bi-weekly check-in with Mumbai Central Cyber Cell.'}</span>
        </div>

        <div>
          <h3 className="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#8a8578]">Recorded attributes</h3>
          <div className="divide-y divide-[#ece8e1] rounded-xl border border-[#e5e0d8] bg-[#faf9f6]">
            {entity.fields && entity.fields.length > 0 ? (
              entity.fields.map(([key, value]) => (
                <div key={key} className="flex items-start justify-between gap-2 p-2.5 text-[11px]">
                  <span className="shrink-0 font-mono text-[10px] text-[#777166]">{key}</span>
                  <div className="flex min-w-0 items-start gap-1">
                    <span className="break-words text-right font-medium text-[#171511]">{value}</span>
                    <button onClick={() => copyText(value, key)} className="mt-0.5 shrink-0 text-[#999388] transition hover:text-[#171511]" title="Copy">
                      {copiedKey === key ? <CheckCircle2 className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-2.5 text-[11px] text-[#8a8578]">No secondary fields recorded.</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#8a8578]">Direct links ({links.length})</h3>
          {links.length > 0 ? (
            <div className="space-y-1">
              {links.map((link) => (
                <button
                  key={link.id}
                  onClick={() => onSelectEntity(link.id)}
                  className="flex w-full items-center justify-between gap-2 rounded-lg border border-[#e5e0d8] bg-white p-2 text-left text-[11px] transition hover:border-[#171511] hover:bg-[#faf7f2]"
                >
                  <span className="flex min-w-0 items-center gap-1.5">
                    <span className={`size-1.5 shrink-0 rounded-full ${link.side === 'suspect' ? 'bg-[#c0362c]' : 'bg-[#2563eb]'}`} />
                    <span className="truncate font-medium text-[#171511]">{link.label}</span>
                  </span>
                  <span className="shrink-0 font-mono text-[9px] uppercase text-[#8a8578]">{link.relationship || 'Linked'} →</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-[#8a8578]">No connected edges.</p>
          )}
        </div>

        {notice && (
          <div className="animate-rise-in flex items-center gap-2 rounded-lg border border-[#c3e6cd] bg-[#f0f9f3] px-3 py-2 text-[11px] text-[#1e6b37]">
            <CheckCircle2 className="size-3.5 shrink-0" />
            <span>{notice}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-1.5 border-t border-[#e5e0d8] bg-[#faf8f5] p-3">
        <button
          onClick={() => handleAction('Entity added to the active case dossier.')}
          className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-[#171511] text-[11px] font-medium text-white transition hover:bg-[#2b2722] active:scale-[0.99]"
        >
          <FileCheck2 className="size-3.5" /> Add to dossier
        </button>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => handleAction('Priority alert dispatched to State Cyber Cell.')}
            className="flex h-8 items-center justify-center gap-1.5 rounded-lg border border-[#f1c6c3] bg-white text-[11px] font-medium text-[#c0362c] transition hover:bg-[#fdf6f6]"
          >
            <AlertTriangle className="size-3" /> Alert
          </button>
          <button
            onClick={() => handleAction('Sub-graph intelligence export prepared.')}
            className="flex h-8 items-center justify-center gap-1.5 rounded-lg border border-[#e5e0d8] bg-white text-[11px] font-medium text-[#5c574d] transition hover:bg-[#faf8f5]"
          >
            <Download className="size-3" /> Export
          </button>
        </div>
      </div>
    </div>
  )
}
