import { useState } from 'react'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { ActivityMonitor } from './ActivityMonitor'
import { CrossCasePanel } from './CrossCasePanel'
import { EntityDossier } from './EntityDossier'
import { RankingsPanel } from './RankingsPanel'

const tabs = [
  ['rankings', 'Rankings & Groups'],
  ['activity', 'Activity Monitor'],
  ['cross-case', 'Cross-Case Hits'],
  ['dossier', 'Entity Dossier'],
]

export function IntelligenceHub({ onExit, initialTab, initialQuery }) {
  const [tab, setTab] = useState(initialTab && tabs.some(([id]) => id === initialTab) ? initialTab : 'rankings')
  const [dossierQuery, setDossierQuery] = useState(initialQuery || '')

  const openDossier = (query) => { setDossierQuery(query); setTab('dossier') }

  return (
    <div className="min-h-screen bg-[#f5f1ea] text-[#171511]">
      <header className="sticky top-0 z-20 border-b border-[#e5e0d8] bg-[#f5f1ea]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="grid size-7 place-items-center rounded bg-[#111] text-white"><Sparkles className="size-4" /></span>
            <span className="text-[13px] font-semibold uppercase tracking-wider">Anveshak // Intelligence</span>
          </div>
          <button className="inline-flex items-center gap-2 text-xs text-[#666052] hover:text-[#171511]" onClick={onExit}><ArrowLeft className="size-4" /> Dashboard</button>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3 sm:px-8">
          {tabs.map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-medium transition ${tab === id ? 'bg-[#111] text-white' : 'bg-white text-[#666052] hover:bg-[#ece8e1]'}`}>{label}</button>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-7 sm:px-8">
        {tab === 'rankings' && <RankingsPanel />}
        {tab === 'activity' && <ActivityMonitor />}
        {tab === 'cross-case' && <CrossCasePanel onOpenDossier={openDossier} highlightQuery={initialQuery} />}
        {tab === 'dossier' && <EntityDossier key={dossierQuery} initialQuery={dossierQuery} />}
      </main>
    </div>
  )
}
