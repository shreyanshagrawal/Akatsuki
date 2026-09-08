import { ArrowLeft, Network, Sparkles } from 'lucide-react'

const toneClass = { bad: 'bg-[#fbeaea] text-[#c0362c]', warn: 'bg-[#f4ead8] text-[#8d6117]', neutral: 'bg-[#ece8e1] text-[#5b564b]' }

export function CaseOverview({ caseItem, onExit, onIntel }) {
  if (!caseItem) return null
  return (
    <div className="min-h-screen bg-[#f5f1ea] text-[#171511]">
      <header className="sticky top-0 z-20 border-b border-[#e5e0d8] bg-[#f5f1ea]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="grid size-7 place-items-center rounded bg-[#111] text-white"><Sparkles className="size-4" /></span>
            <span className="text-[13px] font-semibold uppercase tracking-wider">Nexus // Intel</span>
            <span className="hidden font-mono text-[10px] text-[#8a8578] sm:inline">CASE OVERVIEW</span>
          </div>
          <button className="inline-flex items-center gap-2 text-xs text-[#666052] hover:text-[#171511]" onClick={onExit}><ArrowLeft className="size-4" /> Dashboard</button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
        <span className="rounded-full border border-[#171511] bg-white px-2 py-1 font-mono text-[10px]">{caseItem.id}</span>
        <h1 className="mt-3 font-serif text-3xl sm:text-4xl">{caseItem.title}</h1>
        <p className="mt-2 text-sm text-[#777166]">Primary subject: <b className="text-[#171511]">{caseItem.subject}</b>{caseItem.alias && <span className="ml-1 font-mono text-xs">({caseItem.alias})</span>}</p>

        <div className="mt-5 flex flex-wrap gap-2 text-[11px]">
          <span className={`rounded-full px-2.5 py-1 font-semibold ${toneClass.neutral}`}>{caseItem.status}</span>
          <span className={`rounded-full px-2.5 py-1 font-semibold ${caseItem.risk === 'High' ? toneClass.bad : toneClass.warn}`}>{caseItem.risk} risk</span>
          <span className={`rounded-full px-2.5 py-1 font-semibold ${toneClass.neutral}`}>{caseItem.lead}</span>
          <span className={`rounded-full px-2.5 py-1 font-semibold ${toneClass.neutral}`}>Updated {caseItem.updated}</span>
        </div>

        <section className="mt-8 grid gap-5 lg:grid-cols-12">
          <div className="rounded-xl border border-[#e5e0d8] bg-white p-8 text-center shadow-sm lg:col-span-8">
            <Network className="mx-auto size-8 text-[#a47621]" />
            <h2 className="mt-3 font-serif text-xl">Investigation graph not yet built for this case</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#777166]">This demo currently renders a full node graph for CAS-2026-0392 only. {caseItem.subject}'s network can still be explored through cross-case intelligence below.</p>
            <button onClick={onIntel} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#111] px-4 py-2.5 text-xs font-medium text-white transition hover:bg-[#262626]"><Network className="size-4" />See cross-case activity for {caseItem.subject}</button>
          </div>
          <aside className="rounded-xl border border-[#e5e0d8] bg-white p-5 shadow-sm lg:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#8a8578]">FIR details</p>
            <dl className="mt-3 space-y-3 text-sm">
              <Field label="FIR ID" value={caseItem.firId} />
              <Field label="Incident" value={caseItem.incidentAt} />
              <Field label="Identity ref" value={caseItem.identityRef} />
              <Field label="Location" value={caseItem.location} />
            </dl>
          </aside>
        </section>
      </main>
    </div>
  )
}

function Field({ label, value }) {
  return <div><dt className="font-mono text-[10px] uppercase tracking-wider text-[#8a8578]">{label}</dt><dd className="mt-1 text-sm font-medium">{value || '—'}</dd></div>
}
