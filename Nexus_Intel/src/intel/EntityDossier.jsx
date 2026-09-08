import { useMemo, useState } from 'react'
import { Fingerprint, Search, ShieldAlert, Sparkles, Users } from 'lucide-react'
import { caseById, crossCaseEntities, entityDossiers } from './intelData'

const quickSearches = ['Ramesh Kumar', 'Salim Qureshi', 'Marcus Vance', 'Elena Rostova']

function findPersonDossier(query) {
  const q = query.trim().toLowerCase()
  if (!q) return null
  return Object.values(entityDossiers).find((d) => d.name.toLowerCase().includes(q) || d.alias.toLowerCase().includes(q)) || null
}

function findEntity(query) {
  const q = query.trim().toLowerCase()
  if (!q) return null
  return crossCaseEntities.find((entity) => entity.kind !== 'person' && entity.name.toLowerCase().includes(q)) || null
}

export function EntityDossier({ initialQuery }) {
  const [query, setQuery] = useState(initialQuery || '')
  const person = useMemo(() => findPersonDossier(query), [query])
  const nonPerson = useMemo(() => (person ? null : findEntity(query)), [person, query])

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-[#a47621]">Single-Search Background Check</p>
      <h1 className="font-serif text-3xl">Entity Dossier</h1>
      <p className="mt-2 max-w-2xl text-sm text-[#777166]">Search any person, phone, vehicle, or account. If they've touched more than one case, this is the single place that shows the whole history.</p>

      <div className="relative mt-5 max-w-lg">
        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8a8578]" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a name, alias, phone, or plate…" className="h-11 w-full rounded-full border border-[#e5e0d8] bg-white pl-10 pr-4 text-sm outline-none focus:border-[#171511]" />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {quickSearches.map((q) => <button key={q} onClick={() => setQuery(q)} className="rounded-full bg-white px-3 py-1.5 text-xs text-[#666052] ring-1 ring-[#e5e0d8] hover:bg-[#ece8e1]">{q}</button>)}
      </div>

      {!query && <EmptyState />}
      {query && !person && !nonPerson && <p className="mt-8 rounded-xl border border-dashed border-[#d4cebf] bg-white p-6 text-center text-sm text-[#777166]">No match for "{query}". Try Ramesh Kumar, Salim Qureshi, or a case subject's name.</p>}
      {person && <PersonDossier person={person} />}
      {nonPerson && <EntityCard entity={nonPerson} />}
    </div>
  )
}

function EmptyState() {
  return <div className="mt-10 rounded-xl border border-dashed border-[#d4cebf] bg-white p-10 text-center"><Fingerprint className="mx-auto size-8 text-[#a47621]" /><p className="mt-3 text-sm text-[#777166]">Search above, or try one of the quick lookups.</p></div>
}

function PersonDossier({ person }) {
  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-12">
      <div className="space-y-5 lg:col-span-8">
        <div className="rounded-xl border border-[#e5e0d8] bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <span className="grid size-12 place-items-center rounded-full bg-[#ece8e1] font-serif text-lg">{person.name.split(' ').map((w) => w[0]).join('')}</span>
            <div>
              <h2 className="font-serif text-2xl">{person.name} <span className="text-base italic text-[#777166]">'{person.alias}'</span></h2>
              <p className="text-xs text-[#8a8578]">{person.identity.nationality} · DOB {person.identity.dob}</p>
            </div>
          </div>
          {person.neverNamedSuspect && <p className="mt-4 flex items-start gap-2 rounded-lg bg-[#fff4df] p-3 text-xs leading-5 text-[#6e4f14]"><ShieldAlert className="mt-0.5 size-4 shrink-0" />Never named as a suspect in any single case file. Surfaces only through cross-case correlation.</p>}
          <p className="mt-4 rounded-lg bg-[#faf7f2] p-3 text-xs leading-5 text-[#3a362f]"><Sparkles className="mr-1 inline size-3.5 text-[#c08a2e]" />{person.aiAssessment}</p>
        </div>

        <div className="rounded-xl border border-[#e5e0d8] bg-white p-5 shadow-sm">
          <h3 className="font-semibold">Case involvement timeline</h3>
          <div className="mt-4 space-y-4 border-l border-[#e5e0d8] pl-5">
            {person.timeline.map((entry, i) => (
              <div key={`${entry.caseId}-${i}`} className="relative">
                <i className={`absolute -left-[25px] top-1 size-2.5 rounded-full ring-4 ring-white ${i === person.timeline.length - 1 ? 'bg-[#c08a2e]' : 'bg-[#2e8b8b]'}`} />
                <p className="font-mono text-[10px] text-[#777166]">{entry.date} · {entry.caseId} · {caseById[entry.caseId]?.title}</p>
                <p className="mt-1 text-sm leading-5">{entry.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-5 lg:col-span-4">
        <div className="rounded-xl border border-[#e5e0d8] bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-1.5 font-semibold"><Users className="size-4" />Known associates</h3>
          <ul className="mt-3 space-y-3">
            {person.associates.map((associate) => (
              <li key={associate.name} className="text-xs">
                <div className="flex items-center justify-between"><span className="font-medium text-[#171511]">{associate.name}</span><span className="rounded-full bg-[#ece8e1] px-1.5 py-0.5 font-mono text-[10px]">×{associate.count}</span></div>
                <p className="mt-0.5 text-[#777166]">{associate.note}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-[#e5e0d8] bg-white p-5 shadow-sm">
          <h3 className="font-semibold">Registered assets</h3>
          <ul className="mt-3 space-y-2 text-xs text-[#666052]">{person.assets.map((asset) => <li key={asset}>• {asset}</li>)}</ul>
        </div>
        <div className="rounded-xl border border-[#e5e0d8] bg-white p-5 shadow-sm">
          <h3 className="font-semibold">Prior record</h3>
          <ul className="mt-3 space-y-2 text-xs text-[#666052]">{person.priorRecord.map((record) => <li key={record}>• {record}</li>)}</ul>
        </div>
      </div>
    </div>
  )
}

function EntityCard({ entity }) {
  return (
    <div className="mt-6 rounded-xl border border-[#e5e0d8] bg-white p-6 shadow-sm">
      <h2 className="font-serif text-2xl">{entity.name}</h2>
      <p className="mt-1 text-sm text-[#777166]">Appears in {entity.appearances.length} open cases.</p>
      <div className="mt-4 space-y-2">
        {entity.appearances.map((a) => (
          <div key={a.caseId} className="rounded-lg bg-[#faf7f2] p-3 text-xs">
            <p className="font-mono text-[10px] text-[#8a8578]">{a.caseId} · {caseById[a.caseId]?.title} · {a.recordType}</p>
            <p className="mt-1 text-sm leading-5 text-[#3a362f]">{a.role}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
