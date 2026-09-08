// Nexus_Intel/src/components/GraphWorkspace.jsx
import { ArrowLeft } from 'lucide-react'
import { CaseGraph } from '../graph/CaseGraph'

export function GraphWorkspace({ onExit, onIndividuals, onAlerts }) {
  return (
    <div className="flex h-screen flex-col bg-[#0e1626] text-white">
      <header className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-[#1e293b] bg-[#111c30] px-4 py-3 sm:px-7">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.16em] text-[#94a3b8]">Investigation graph // workspace</p>
          <h1 className="font-serif text-2xl">CAS-2026-0392 <span className="font-sans text-sm font-normal text-[#94a3b8]">Operation Dark Ledger — victim &amp; suspect graph</span></h1>
        </div>
        <div className="flex gap-2">
          <button className="rounded-full bg-[#172033] px-4 py-2 text-xs" onClick={onIndividuals}>Key individuals</button>
          <button className="rounded-full bg-[#172033] px-4 py-2 text-xs" onClick={onAlerts}>Alerts</button>
          <button className="inline-flex items-center gap-2 rounded-full border border-[#334155] px-3 py-2 text-xs" onClick={onExit}><ArrowLeft className="size-4" />Dashboard</button>
        </div>
      </header>
      <p className="flex flex-wrap gap-x-6 gap-y-1 border-b border-[#1e293b] bg-[#0b1220] px-4 py-2 text-[11px] text-[#94a3b8] sm:px-7">
        <span><i className="mr-1.5 inline-block size-2 rounded-full" style={{ background: '#3b82f6' }} />Victim branch — neutral</span>
        <span><i className="mr-1.5 inline-block size-2 rounded-full" style={{ background: '#c0362c' }} />Suspect branch — size &amp; color scale with number of connections</span>
        <span>Click any node to expand it and see its stored details.</span>
      </p>
      <main className="min-h-0 flex-1">
        <CaseGraph />
      </main>
    </div>
  )
}
