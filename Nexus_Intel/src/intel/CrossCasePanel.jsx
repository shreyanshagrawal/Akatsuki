import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, Link2 } from 'lucide-react'
import { CASE_ORDER, caseById, crossCaseEntities } from './intelData'

const kindLabel = { person: 'Person', vehicle: 'Vehicle', phone: 'Phone / SIM' }

export function CrossCasePanel({ onOpenDossier, highlightQuery }) {
  const matchedId = useMemo(() => {
    const q = highlightQuery?.trim().toLowerCase()
    if (!q) return null
    return crossCaseEntities.find((entity) => entity.name.toLowerCase().includes(q))?.id || null
  }, [highlightQuery])

  // `undefined` means the reader hasn't toggled anything yet, so the card to
  // open is still whatever the incoming query pointed at (or the top hit).
  const [toggledId, setToggledId] = useState(undefined)
  const open = toggledId !== undefined ? toggledId : (matchedId || crossCaseEntities[0]?.id || null)
  const setOpen = setToggledId
  const cardRefs = useRef({})
  const ranked = [...crossCaseEntities].sort((a, b) => b.appearances.length - a.appearances.length)

  useEffect(() => {
    if (!matchedId) return
    cardRefs.current[matchedId]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [matchedId])

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-[#a47621]">Cross-Case Correlation</p>
      <h1 className="font-serif text-3xl">Cross-Case Hits</h1>
      <p className="mt-2 max-w-2xl text-sm text-[#777166]">Entities appearing in two or more open cases — as a named suspect, or only as a peripheral record. This is how a hidden connection surfaces.</p>
      {highlightQuery && !matchedId && <p className="mt-3 rounded-lg bg-[#fff4df] p-3 text-xs text-[#6e4f14]">No cross-case record found for "{highlightQuery}" — showing the full list below.</p>}

      <section className="mt-6 space-y-3">
        {ranked.map((entity) => {
          const isOpen = open === entity.id
          const isMatched = matchedId === entity.id
          return (
            <article key={entity.id} ref={(el) => { cardRefs.current[entity.id] = el }} className={`animate-rise-in rounded-xl border bg-white p-5 shadow-sm transition ${isMatched ? 'border-[#c08a2e] ring-2 ring-[#c08a2e]/40' : 'border-[#e5e0d8]'}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-serif text-xl">{entity.name}</h2>
                    {entity.alias && <span className="text-sm italic text-[#777166]">{entity.alias}</span>}
                    <span className="rounded-full bg-[#ece8e1] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[#666052]">{kindLabel[entity.kind]}</span>
                    {entity.neverNamedSuspect && <span className="rounded-full bg-[#171511] px-2 py-0.5 text-[10px] font-medium text-white">Never a named suspect</span>}
                  </div>
                  <p className="mt-1 text-sm text-[#666052]">Appears in {entity.appearances.length} of {CASE_ORDER.length} open cases.</p>
                </div>
                <div className="flex gap-1">
                  {CASE_ORDER.map((caseId) => {
                    const hit = entity.appearances.find((a) => a.caseId === caseId)
                    return <span key={caseId} title={`${caseId} — ${caseById[caseId]?.title}${hit ? '' : ' (no record)'}`} className={`size-3 rounded-full ${hit ? 'bg-[#c0362c]' : 'bg-[#ece8e1]'}`} />
                  })}
                </div>
              </div>
              <button onClick={() => setOpen(isOpen ? null : entity.id)} className="mt-3 inline-flex items-center gap-1 text-xs font-medium"><Link2 className="size-3.5" />{isOpen ? 'Hide' : 'View'} case-by-case roles <ChevronDown className={`size-4 transition ${isOpen ? 'rotate-180' : ''}`} /></button>
              {isOpen && (
                <div className="mt-3 space-y-2 border-t border-[#e5e0d8] pt-3">
                  {entity.appearances.map((a) => (
                    <div key={a.caseId} className="rounded-lg bg-[#faf7f2] p-3 text-xs">
                      <p className="font-mono text-[10px] text-[#8a8578]">{a.caseId} · {caseById[a.caseId]?.title} · {a.recordType}</p>
                      <p className="mt-1 text-sm leading-5 text-[#3a362f]">{a.role}</p>
                    </div>
                  ))}
                  {entity.kind === 'person' && onOpenDossier && <button onClick={() => onOpenDossier(entity.name)} className="mt-1 text-xs font-medium underline underline-offset-2">Open full background dossier →</button>}
                </div>
              )}
            </article>
          )
        })}
      </section>
    </div>
  )
}
