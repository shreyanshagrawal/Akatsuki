import { useMemo, useState } from 'react'
import { AlertTriangle, Radio } from 'lucide-react'
import { activityEvents, caseById } from './intelData'

const severityStyle = { Critical: 'bg-[#fbeaea] text-[#c0362c]', High: 'bg-[#fbeaea] text-[#c0362c]', Medium: 'bg-[#f4ead8] text-[#8d6117]', Low: 'bg-[#ece8e1] text-[#5b564b]' }
const filters = ['All', 'Critical', 'Movement', 'Financial', 'Comms']

function sourceCategory(source) {
  if (/FIU|Bank|registry/i.test(source)) return 'Financial'
  if (/CDR|Tower|comms/i.test(source)) return 'Comms'
  if (/ANPR|Immigration|Port|CCTV/i.test(source)) return 'Movement'
  return 'Other'
}

export function ActivityMonitor() {
  const [filter, setFilter] = useState('All')
  const filtered = useMemo(() => activityEvents.filter((event) => {
    if (filter === 'All') return true
    if (filter === 'Critical') return event.severity === 'Critical'
    return sourceCategory(event.source) === filter
  }), [filter])

  return (
    <div>
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#a47621]"><i className="size-2 animate-pulse rounded-full bg-[#3d7a42]" />Live surveillance feed</div>
      <h1 className="font-serif text-3xl">Activity Monitor</h1>
      <p className="mt-2 max-w-2xl text-sm text-[#777166]">{activityEvents.length} monitored events across every watched individual and case.</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {filters.map((f) => <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-3 py-2 text-xs ${filter === f ? 'bg-[#111] text-white' : 'bg-white'}`}>{f}</button>)}
      </div>

      <div className="mt-5 rounded-xl border border-[#e5e0d8] bg-white shadow-sm">
        {filtered.length === 0 && <p className="p-6 text-center text-sm text-[#8a8578]">No events match this filter.</p>}
        <ol className="divide-y divide-[#e5e0d8]">
          {filtered.map((event, i) => {
            const relatedCase = caseById[event.caseId]
            return (
              <li key={event.id} className={`flex flex-wrap gap-3 p-4 sm:flex-nowrap sm:gap-4 ${i === 0 ? 'bg-[#faf7f2]' : ''}`}>
                <div className="w-full font-mono text-[11px] text-[#8a8578] sm:w-24 sm:shrink-0">{event.time}</div>
                <span className={`grid size-7 shrink-0 place-items-center rounded-full ${severityStyle[event.severity]}`}>{event.severity === 'Critical' ? <AlertTriangle className="size-3.5" /> : <Radio className="size-3.5" />}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{event.person}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${severityStyle[event.severity]}`}>{event.severity}</span>
                  </div>
                  <p className="mt-1 text-sm leading-5 text-[#666052]">{event.event}</p>
                  <p className="mt-1.5 font-mono text-[10px] text-[#8a8578]">{event.caseId}{relatedCase ? ` · ${relatedCase.title}` : ''} · {event.source}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
